#!/bin/sh

mkdir data/public
# mkdir data/frontend
# mkdir data/backend
mkdir -p data/public/avatars

# mv ./index.js ./data/public/index.js
mv ./index.html ./data/public/index.html
mv ./styles.css ./data/public/styles.css
mv ./avatars/default-avatar.png ./data/public/avatars/default-avatar.png

# mv ./index.ts ./data/frontend/index.ts
# mv ./server.ts ./data/backend/server.ts
# mv ./styles.css ./data/frontend/styles.css



npm init -y
npm install fastify
npm install @fastify/static@7
npm install --save-dev @types/node

npm install -D tailwindcss postcss autoprefixer

# cd tools/package.json
npm install better-sqlite3 --save
npm install --save-dev @types/better-sqlite3
npm i --save-dev @types/bcrypt

cd /app

npx tsc
node --version
node $VOLUME_NAME/public/server.js

