FROM public.ecr.aws/bitnami/golang:latest as builder

ARG CACHEBUST=1

RUN mkdir -p /build
WORKDIR /build
COPY *.go .
COPY go.mod .
COPY go.sum .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main main.go


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