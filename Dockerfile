FROM node:16.15-alpine as builder

# Create app directory
WORKDIR /workspace

RUN apk add --update --no-cache git make musl-dev go python3 && ln -sf python3 /usr/bin/python

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
RUN nx build api --production

# This is the stage where the final production image is built
FROM golang:1.18.3-alpine as final

# Copy over artifacts from builder image
COPY --from=builder /workspace/dist/apps/api /workspace/api

# Set environment variables
ENV PORT=8443
ENV HOST=0.0.0.0

# Expose default port
EXPOSE 8443

# Start server
CMD [ "/workspace/api" ]