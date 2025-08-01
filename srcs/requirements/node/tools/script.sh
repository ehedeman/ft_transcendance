#!/bin/sh

rm -rf $VOLUME_NAME/*

mkdir $VOLUME_NAME/public
mkdir $VOLUME_NAME/frontend
mkdir $VOLUME_NAME/frontend/utils
mkdir $VOLUME_NAME/backend

mv ./index.js ./$VOLUME_NAME/public/index.js
mv ./index.html ./$VOLUME_NAME/public/index.html
#mv ./styles.css ./$VOLUME_NAME/public/styles.css

mv ./index.ts ./$VOLUME_NAME/frontend/index.ts
mv ./styles.css ./$VOLUME_NAME/frontend/styles.css
mv ./utils/tournament.ts ./$VOLUME_NAME/frontend/utils/tournament.ts
mv ./utils/structures.ts ./$VOLUME_NAME/frontend/utils/structures.ts

mv ./server.js ./$VOLUME_NAME/backend/server.js

rm -rf ./utils

echo "all files moved to $VOLUME_NAME"

npm init -y
npm install fastify
npm install @fastify/static@7

echo "\033[0;32mnpm packag fastify installed\033[0m"

npm install -D @tailwindcss/cli postcss autoprefixer

echo "\033[0;32mtailwindcss CLI, postcss and autoprefixer installed\033[0m"

npx @tailwindcss/cli init
npx @tailwindcss/cli init -p
tsc --init

echo "\033[0;32mtailwindcss and postcss config files created\033[0m"

npx @tailwindcss/cli -i ./$VOLUME_NAME/frontend/styles.css -o ./$VOLUME_NAME/public/styles.css
npx tsc


# Target directory (adjust if needed)
DIR="./$VOLUME_NAME/public"

# Find all .js files and loop through them
find "$DIR" -type f -name "*.js" | while read -r file; do
  echo "\033[0;32mProcessing: $file\033[0m"
  
  # Use sed to update import statements missing .js extension
  sed -i -E 's@(import .* from ["'"'"'])(\.[^"'"'"']+)(["'"'"'])@\1\2.js\3@g' "$file"
done

echo "\033[0;32mAll import paths updated with .js extensions.\033[0m"



node --version
node $VOLUME_NAME/backend/server.js