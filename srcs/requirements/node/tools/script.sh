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
npm install fastify
npm install @fastify/static@7
npm install --save-dev @types/node

npm install -D tailwindcss postcss autoprefixer

npx tsc
node --version
node $VOLUME_NAME/public/server.js