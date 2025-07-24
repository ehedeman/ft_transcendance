# FROM debian:bullseye

# RUN apt update -y && apt upgrade -y && apt install -y curl
# RUN apt-get update -y &&  apt-get install -y npm &&  npm install n -g &&  n lts

# COPY ./tools/code_1.101.2-1750797935_amd64.deb .

#RUN apt install ./code_1.101.2-1750797935_amd64.deb -y




# Use Debian Bullseye as the base image
FROM debian:bullseye

# Install dependencies and Node.js
RUN apt-get update -y && \
    apt-get install -y curl gnupg ca-certificates && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list && \
    apt-get update -y && \
    apt-get install -y nodejs && \
    node -v && npm -v && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install dev tools
RUN npm install -g typescript

# # Install Tailwind CSS and related tooling
# RUN npm install -D tailwindcss postcss autoprefixer

# Create app directory
WORKDIR /app

RUN 
RUN rm -f ./tsconfig.json
COPY ./tools/tsconfig.json ./
COPY ./tools/postcss.config.js ./
COPY ./tools/tailwind.config.js ./
COPY ./tools/package.json ./
COPY ./tools/script.sh ./

# RUN rm -rf ./data
# RUN mkdir ./data
# COPY ./_data/frontend ./data/frontend/.
# COPY ./_data/backend ./data/backend/.
# COPY ./_data/public ./data/public/.

RUN chmod +x ./script.sh

# Copy package files and install dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

CMD [ "./script.sh" ]