#!/bin/sh

mkdir -p data/public/avatars
# mkdir data/public
# mkdir data/frontend
# mkdir data/backend

# mv ./index.js ./data/public/index.js
mv ./index.html ./data/public/index.html
mv ./styles.css ./data/public/styles.css
# mv ./avatars/default-avatar.png ./data/public/avatars/default-avatar.png

# mv ./index.ts ./data/frontend/index.ts
# mv ./server.ts ./data/backend/server.ts
# mv ./styles.css ./data/frontend/styles.css



npm init -y
npm install fastify@latest
npm install @fastify/static@latest
npm install @fastify/websocket@latest
npm install @fastify/multipart@latest
npm install --save-dev @types/ws
npm install --save-dev @types/node

npm install -D tailwindcss postcss autoprefixer

# cd tools/package.json
npm install better-sqlite3 --save
npm install --save-dev @types/better-sqlite3
npm i --save-dev @types/bcrypt

npm i --save-dev @types/node

cd /app

npx tsc
node --version
node $VOLUME_NAME/public/server.js

