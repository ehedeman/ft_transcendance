#!/bin/sh

mkdir data/public
# mkdir data/frontend
# mkdir data/backend

# mv ./index.js ./data/public/index.js
mv ./index.html ./data/public/index.html
mv ./styles.css ./data/public/styles.css

# mv ./index.ts ./data/frontend/index.ts
# mv ./server.ts ./data/backend/server.ts
# mv ./styles.css ./data/frontend/styles.css



npm init -y
# npm install fastify
# npm uninstall fastify
# echo "------------------Fastify uninstalled.------------------"
npm install fastify@latest
echo "------------------Fastify installed.------------------"
npm install @fastify/static@latest
echo "------------------Fastify and @fastify/static installed.------------------"
# npm uninstall @fastify/websocket
# echo "------------------@fastify/websocket uninstalled.------------------"
npm install @fastify/websocket@latest
echo "------------------@fastify/websocket installed.------------------"
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

