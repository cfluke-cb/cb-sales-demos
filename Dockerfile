
# Use nxgo/cli as the base image to do the build
FROM nxgo/cli as builder

# Create app directory
WORKDIR /workspace

# Copy package.json and the lock file
COPY package.json /workspace/

# Install app dependencies
RUN yarn install --network-timeout 1000000

# Copy source files
COPY . .

# Build apps
RUN yarn build api

# This is the stage where the final production image is built
FROM golang:1.18.3-alpine as final

# Copy over artifacts from builder image
COPY --from=builder /workspace/dist/apps/api /workspace/api

# Set environment variables
ENV PORT=8080
ENV HOST=0.0.0.0

# Expose default port
EXPOSE 8080

# Start server
CMD [ "/workspace/api" ]