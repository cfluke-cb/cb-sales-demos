FROM node:16.15-alpine as builder

# Create app directory
WORKDIR /workspace

RUN apk add --update --no-cache openssl git make musl-dev go python3 && ln -sf python3 /usr/bin/python

# Configure Go
ENV GOROOT /usr/lib/go
ENV GOPATH /go
ENV PATH /go/bin:$PATH

RUN mkdir -p ${GOPATH}/src ${GOPATH}/bin

RUN npm i -g nx @nx-go/nx-go

# Copy package.json and the lock file
COPY package.json package-lock.json /workspace/

# Install app dependencies
RUN npm install

# Copy source files
COPY . .

# Build apps
RUN CGO_ENABLED=0 GOOS=linux nx build api --production --a --installsuffix cgo

# Build SSL certs
RUN openssl genrsa -out server.key 2048
RUN openssl ecparam -genkey -name secp384r1 -out server.key
RUN openssl req -new -x509 -sha256 -key server.key -out server.crt -days 3650 -subj "/C=US/ST=NYC/L=NYC/O=Global Security/OU=IT Department/CN=good.com"


# This is the stage where the final production image is built
FROM scratch as final

# Copy over artifacts from builder image
COPY --from=builder /workspace/dist/apps/api /main
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/ssl/certs /etc/ssl/certs
COPY --from=builder /workspace/server.crt /server.crt
COPY --from=builder /workspace/server.key /server.key

# Set environment variables
ENV PORT=8443
ENV HOST=0.0.0.0

# Expose default port
EXPOSE 8443


# Start server
CMD [ "/main" ]