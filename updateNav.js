const fs = require('fs');
const path = require('path');

// List all HTML files in the current directory
const htmlFiles = fs.readdirSync('.')
  .filter(file => file.endsWith('.html') && file !== 'itinerary-planner.html');

console.log('Updating navigation in the following files:');
console.log(htmlFiles.join(', '));

// Process each HTML file
htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Find the Map and Our Impact navigation items
  const mapRegex = /<li class="nav-item">\s*<a class="nav-link[^>]*>Map<\/a>\s*<\/li>/;
  const match = content.match(mapRegex);

  if (match) {
    // Construct the new navigation item
    const mapNavItem = match[0];
    const itineraryNavItem = `<li class="nav-item">
          <a class="nav-link${file === 'itinerary-planner.html' ? ' active' : ''}" href="itinerary-planner.html" aria-label="Plan your itinerary">Itinerary Planner</a>
        </li>`;

    // Replace the map nav item with map + itinerary nav items
    content = content.replace(mapNavItem, `${mapNavItem}
        ${itineraryNavItem}`);

    // Write the updated content back to the file
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated navigation in ${file}`);
  } else {
    console.log(`Could not find navigation pattern in ${file}`);
  }
});

console.log('Navigation update complete!'); 