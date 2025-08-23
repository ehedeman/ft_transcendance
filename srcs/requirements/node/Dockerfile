# Use Debian Bullseye as the base image
FROM debian:bullseye

# Install dependencies and Node.js
RUN apt-get update -y && \
    apt-get install -y curl gnupg ca-certificates && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update -y && \
    apt-get install -y nodejs python3 make g++ && \
    node -v && npm -v && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install global dev tools
RUN npm install -g typescript

# Create app directory
WORKDIR /app

# Remove existing config (if any)
RUN rm -f ./tsconfig.json

# Copy configuration and scripts
COPY ./tools/tsconfig.json ./
COPY ./tools/postcss.config.js ./
COPY ./tools/tailwind.config.js ./
COPY ./tools/package.json ./
COPY ./tools/script.sh ./

# Copy source code
COPY ./_data/frontend .
COPY ./_data/backend .
COPY ./_data/public .
COPY ./_data/cert .

# Make script executable
RUN chmod +x ./script.sh

# Install better-sqlite3 before general dependencies to ensure native build
RUN npm install better-sqlite3

# Install multipart support
RUN npm install @fastify/multipart

# Install remaining dependencies
RUN npm install

# Expose app port
EXPOSE 3000

# Start the app
CMD [ "./script.sh" ]
