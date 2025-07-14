#!/bin/sh
npm init -y
npm install fastify
npm install @fastify/static@7

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
tsc --init

npx tsc

node --version
node $VOLUME_NAME/backend/server.js