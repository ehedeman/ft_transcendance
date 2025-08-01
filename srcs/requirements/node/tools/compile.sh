#!bin/bash

# Target directory (adjust if needed)
DIR="./$VOLUME_NAME/public"

# Find all .js files and loop through them
find "$DIR" -type f -name "*.js" | while read -r file; do
  echo "\033[0;32mProcessing: $file\033[0m"
  
  # Use sed to update import statements missing .js extension
  sed -i -E 's@(import .* from ["'"'"'])(\.[^"'"'"']+)(["'"'"'])@\1\2.js\3@g' "$file"
done

echo "\033[0;32mAll import paths updated with .js extensions.\033[0m"