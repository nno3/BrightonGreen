#!/bin/bash

# Script to add common.css to all HTML files that don't already have it
# Updated for macOS compatibility

for file in *.html; do
  # Skip if file already contains common.css
  if grep -q "common.css" "$file"; then
    echo "$file already has common.css, skipping"
    continue
  fi
  
  # Add common.css after style.css (macOS compatible version)
  awk '
  /style\.css/ { 
    print $0;
    print "  ";
    print "  <!-- Common CSS for consistent components across pages -->";
    print "  <link rel=\"stylesheet\" href=\"css/common.css\">";
    next;
  }
  { print }
  ' "$file" > temp.html && mv temp.html "$file"
  
  echo "Added common.css to $file"
done

echo "Done updating HTML files" 