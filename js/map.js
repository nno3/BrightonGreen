document.addEventListener('DOMContentLoaded', function() {
  // Initialize the map centered on Brighton
  const map = L.map('interactive-map').setView([50.8225, -0.1372], 13);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Define different marker icons for each type of location
  const icons = {
    'beach-cleanup': L.icon({
      iconUrl: 'images/Water-Icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    }),
    'park': L.icon({
      iconUrl: 'images/treeIcon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    }),
    'garden': L.icon({
      iconUrl: 'images/Garden-Icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    }),
    'attraction': L.icon({
      iconUrl: 'images/attraction-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    }),
    'food': L.icon({
      // Create a simple food icon using one of the existing icons
      iconUrl: 'images/food-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    })
  };

  // Location data - in real app, this would come from a database
  const locations = [
    {
      id: 'brighton-pier',
      name: 'Brighton Palace Pier Beach Cleanup',
      type: 'beach-cleanup',
      coordinates: [50.8185, -0.1372],
      address: 'Brighton Palace Pier, Madeira Dr, Brighton BN2 1TW',
      description: 'Regular beach cleanup location near Brighton Palace Pier. Join us for our scheduled cleanup events to help keep this popular beach clean and safe for everyone.',
      image: 'images/Brighton-Beach-Cleanup1.jpeg',
      detailsLink: 'cleanup-events.html'
    },
    {
      id: 'hove-beach',
      name: 'Hove Beach Cleanup',
      type: 'beach-cleanup',
      coordinates: [50.8271, -0.1746],
      address: 'Hove Beach, Kingsway, Hove BN3 4FA',
      description: 'Hove Beach cleanup location focused on plastic waste removal and marine conservation education.',
      image: 'images/Brighton-Beach-Cleanup3.jpeg',
      detailsLink: 'cleanup-events.html'
    },
    {
      id: 'brighton-marina',
      name: 'Brighton Marina Conservation Area',
      type: 'beach-cleanup',
      coordinates: [50.8147, -0.1030],
      address: 'Brighton Marina, Brighton BN2 5UF',
      description: 'Cleanup and conservation efforts at Brighton Marina, focusing on both beach and water pollution.',
      image: 'images/Brighton-Beach-Cleanup2.jpeg',
      detailsLink: 'cleanup-events.html'
    },
    {
      id: 'seven-sisters',
      name: 'Seven Sisters Country Park',
      type: 'park',
      coordinates: [50.7772, 0.1510],
      address: 'Seven Sisters Country Park, East Dean Road, Seaford BN25 4AB',
      description: 'Stunning chalk cliff coastline and part of the South Downs National Park. Features beautiful walking trails, diverse wildlife, and the iconic seven white chalk cliffs.',
      image: 'images/SevenSisters.jpeg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'royal-pavilion-gardens',
      name: 'Royal Pavilion Gardens',
      type: 'garden',
      coordinates: [50.8223, -0.1387],
      address: '4-5 Pavilion Buildings, Brighton BN1 1EE',
      description: 'Historic garden surrounding the Royal Pavilion. Features Regency planting and layout with many exotic plants.',
      image: 'images/BrightonPavilion.jpg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'preston-park',
      name: 'Preston Park',
      type: 'park',
      coordinates: [50.8406, -0.1486],
      address: 'Preston Rd, Brighton BN1 6SD',
      description: 'Brighton\'s largest urban park featuring tennis courts, a velodrome, and beautiful gardens including the famous Preston Rock Garden.',
      image: 'images/PrestonPark.jpeg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'stanmer-park',
      name: 'Stanmer Park',
      type: 'park',
      coordinates: [50.8665, -0.1157],
      address: 'Stanmer, Brighton BN1 9QA',
      description: 'Extensive park and woodland with Stanmer House, village and church. Great for walking and wildlife spotting.',
      image: 'images/StanmerPark.jpg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'queens-park',
      name: 'Queen\'s Park',
      type: 'park',
      coordinates: [50.8284, -0.1300],
      address: 'Egremont Pl, Brighton BN2 0HL',
      description: 'Victorian park with a pond, wildlife garden, and a popular playground. Regular nature events and activities.',
      image: 'images/QueensPark.jpeg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'kipling-gardens',
      name: 'Kipling Gardens',
      type: 'garden',
      coordinates: [50.8161, -0.1277],
      address: '32 Rottingdean High St, Rottingdean, Brighton BN2 7HR',
      description: 'Peaceful walled garden named after Rudyard Kipling, who lived in nearby Rottingdean. Beautiful roses and herb garden.',
      image: 'images/KiplingGardens.jpeg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'brighton-museum',
      name: 'Brighton Museum and Art Gallery',
      type: 'attraction',
      coordinates: [50.8229, -0.1387],
      address: 'Royal Pavilion Gardens, Brighton BN1 1EE',
      description: 'Located in the cultural heart of the city, Brighton Museum and Art Gallery offers a fascinating insight into Brighton\'s history and beyond. The museum houses diverse collections including fine art, fashion, natural sciences, and artifacts from around the world.',
      image: 'images/Brighton-Museum-Art-Gallery.jpg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'brighton-palace-pier',
      name: 'Brighton Palace Pier',
      type: 'attraction',
      coordinates: [50.8185, -0.1372],
      address: 'Madeira Dr, Brighton BN2 1TW',
      description: 'Built in 1899, Brighton Palace Pier is one of the most iconic landmarks of the Sussex coast. This Victorian pleasure pier extends 1,722 feet into the English Channel and offers traditional seaside entertainment for all ages.',
      image: 'images/Brighton-Pier.jpg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'british-airways-i360',
      name: 'British Airways i360',
      type: 'attraction',
      coordinates: [50.8225, -0.1508],
      address: 'Lower Kings Road, Brighton BN1 2LN',
      description: 'The British Airways i360 is a 162-meter tall observation tower on the seafront of Brighton. Designed by the creators of the London Eye, this futuristic attraction offers visitors a unique \'flight\' experience in a giant glass pod that slowly ascends to provide breathtaking 360-degree views.',
      image: 'images/british-airways.jpeg',
      detailsLink: 'attractions.html'
    },
    {
      id: 'sea-life-brighton',
      name: 'Sea Life Brighton',
      type: 'attraction',
      coordinates: [50.8197, -0.1350],
      address: 'Marine Parade, Brighton BN2 1TB',
      description: 'Sea Life Brighton, the world\'s oldest operating aquarium (originally opened in 1872), offers visitors a glimpse into the fascinating underwater world. The Victorian-era architecture houses over 5,500 sea creatures, from sharks and rays to turtles and colorful tropical fish.',
      image: 'images/Sea-life.jpeg',
      detailsLink: 'attractions.html'
    },
    // Food Locations
    {
      id: 'food-for-friends',
      name: 'Food for Friends',
      type: 'food',
      coordinates: [50.8214, -0.1400], // Approximate coordinates for Prince Albert St
      address: '17-18 Prince Albert St, Brighton BN1 1HF',
      description: 'Award-winning vegetarian restaurant serving creative, sustainable dishes. Established in 1981, it offers creative vegetarian and vegan cuisine made from locally-sourced, organic ingredients.',
      image: 'images/food-for-friends.jpeg',
      detailsLink: 'attractions.html#dining-heading'
    },
    {
      id: 'the-salt-room',
      name: 'The Salt Room',
      type: 'food',
      coordinates: [50.8214, -0.1476], // Approximate coordinates for Kings Road
      address: '106 Kings Road, Brighton BN1 2FU',
      description: 'Modern seafood restaurant with focus on sustainable fishing practices. Located on Brighton\'s seafront, it offers stunning ocean views and focuses on sustainably caught fish and seafood.',
      image: 'images/the-salt-room.jpeg',
      detailsLink: 'attractions.html#dining-heading'
    },
    {
      id: 'lucky-beach-cafe',
      name: 'Lucky Beach Café',
      type: 'food',
      coordinates: [50.8204, -0.1390], // Approximate coordinates for Kings Road Arches
      address: '183 Kings Road Arches, Brighton BN1 1NB',
      description: 'Sustainable beachfront café serving organic meals and locally-roasted coffee. They\'ve eliminated single-use plastics, composts food waste, and uses renewable energy.',
      image: 'images/lucky-beach-cafe.jpeg',
      detailsLink: 'attractions.html#dining-heading'
    },
    {
      id: 'the-chilli-pickle',
      name: 'The Chilli Pickle',
      type: 'food',
      coordinates: [50.8236, -0.1378], // Approximate coordinates for Jubilee St
      address: '17 Jubilee St, Brighton BN1 1GE',
      description: 'Authentic Indian cuisine with focus on regional specialties and sustainable practices. Award-winning restaurant sources spices directly from trusted suppliers in India while using locally-sourced meat, fish, and produce.',
      image: 'images/the-chilli-pickel.jpeg',
      detailsLink: 'attractions.html#dining-heading'
    },
    {
      id: 'metro-deco',
      name: 'Metro Deco',
      type: 'food',
      coordinates: [50.8189, -0.1277], // Approximate coordinates for Upper St James St
      address: '38 Upper St James\'s St, Kemptown, Brighton BN2 1JN',
      description: 'Elegant Art Deco tea room serving artisanal teas and homemade pastries. This vintage-inspired tea room offers over 30 varieties of loose-leaf tea alongside a delicious selection of homemade cakes.',
      image: 'images/metrodeco.jpeg',
      detailsLink: 'attractions.html#dining-heading'
    }
  ];

  // Create layer groups for filtering
  const layerGroups = {
    'beach-cleanup': L.layerGroup(),
    'park': L.layerGroup(),
    'garden': L.layerGroup(),
    'attraction': L.layerGroup(),
    'food': L.layerGroup()
  };

  // Add markers for each location
  locations.forEach(location => {
    const marker = L.marker(location.coordinates, {
      icon: icons[location.type] || icons['beach-cleanup']
    });
    
    // Simple popup
    marker.bindPopup(`<strong>${location.name}</strong><br>${location.type}`);
    
    // Add click event to show modal
    marker.on('click', function() {
      showLocationDetails(location);
    });
    
    // Add marker to the corresponding layer group
    layerGroups[location.type].addTo(map);
    layerGroups[location.type].addLayer(marker);
  });

  // Function to show location details in modal
  function showLocationDetails(location) {
    document.getElementById('locationTitle').textContent = location.name;
    document.getElementById('locationType').textContent = formatLocationType(location.type);
    document.getElementById('locationType').className = `location-type-badge ${location.type}`;
    
    // Set location image
    const imageContainer = document.getElementById('locationImageContainer');
    const image = document.getElementById('locationImage');
    if (location.image) {
      image.src = location.image;
      image.alt = location.name;
      imageContainer.style.display = 'block';
    } else {
      imageContainer.style.display = 'none';
    }
    
    // Set address and description
    document.getElementById('locationAddress').textContent = location.address;
    document.getElementById('locationDescription').textContent = location.description;
    
    // Set up directions link with proper URL encoding
    const directionsLink = document.getElementById('getDirections');
    const destinationAddress = encodeURIComponent(location.address);
    directionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${destinationAddress}`;
    
    // Add a click handler to ensure the link opens in a new tab
    directionsLink.onclick = function(e) {
      e.preventDefault(); // Prevent the default action
      const url = this.getAttribute('href');
      window.open(url, '_blank'); // Force opening in a new tab
      return false;
    };
    
    // Clear any existing modal instances first
    const existingModal = bootstrap.Modal.getInstance(document.getElementById('locationModal'));
    if (existingModal) {
      existingModal.dispose();
    }
    
    // Show the modal
    const locationModal = new bootstrap.Modal(document.getElementById('locationModal'), {
      backdrop: 'static', // This prevents clicking outside to close
      keyboard: true // This allows ESC key to close the modal
    });
    
    // Add event listener to properly handle modal close
    document.getElementById('locationModal').addEventListener('hidden.bs.modal', function () {
      document.body.classList.remove('modal-open');
      const backdrops = document.getElementsByClassName('modal-backdrop');
      while(backdrops.length > 0) {
        backdrops[0].parentNode.removeChild(backdrops[0]);
      }
    });
    
    locationModal.show();
  }
  
  // Format location type for display
  function formatLocationType(type) {
    switch(type) {
      case 'beach-cleanup':
        return 'Beach Cleanup';
      case 'park':
        return 'Park';
      case 'garden':
        return 'Garden';
      case 'attraction':
        return 'Attraction';
      case 'food':
        return 'Food';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  // Filter buttons functionality
  document.querySelectorAll('.filter-buttons button').forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      // Reset active state
      document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.remove('active', 'btn-success', 'btn-primary');
        if (btn.dataset.filter === 'all') {
          btn.classList.add('btn-outline-primary');
        } else {
          btn.classList.add('btn-outline-success');
        }
      });
      
      // Set active state
      if (filter === 'all') {
        this.classList.remove('btn-outline-primary');
        this.classList.add('active', 'btn-primary');
        
        // Show all layers
        Object.values(layerGroups).forEach(layer => {
          map.addLayer(layer);
        });
      } else {
        this.classList.remove('btn-outline-success');
        this.classList.add('active', 'btn-success');
        
        // Hide all layers first
        Object.values(layerGroups).forEach(layer => {
          map.removeLayer(layer);
        });
        
        // Show only the selected layer
        map.addLayer(layerGroups[filter]);
      }
    });
  });

  // Search functionality
  document.getElementById('map-search-btn').addEventListener('click', function() {
    searchLocations();
  });
  
  document.getElementById('map-search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchLocations();
    }
  });
  
  function searchLocations() {
    const searchTerm = document.getElementById('map-search').value.toLowerCase();
    
    if (!searchTerm) return;
    
    // Find matching locations
    const matches = locations.filter(location => 
      location.name.toLowerCase().includes(searchTerm) || 
      location.description.toLowerCase().includes(searchTerm) ||
      location.address.toLowerCase().includes(searchTerm) ||
      location.type.toLowerCase().includes(searchTerm)
    );
    
    if (matches.length === 0) {
      // Show toast notification for no results
      showToast('No locations found matching your search.', 'warning');
    } else if (matches.length === 1) {
      // Zoom to the single match
      map.setView(matches[0].coordinates, 16);
      // Find the marker and open its popup
      Object.values(layerGroups).forEach(layerGroup => {
        layerGroup.eachLayer(layer => {
          const layerLatLng = layer.getLatLng();
          if (layerLatLng.lat === matches[0].coordinates[0] && layerLatLng.lng === matches[0].coordinates[1]) {
            layer.openPopup();
          }
        });
      });
      showToast(`Found: ${matches[0].name}`, 'success');
    } else {
      // Create bounds for multiple matches
      const bounds = L.latLngBounds(matches.map(location => location.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
      showToast(`Found ${matches.length} locations matching your search.`, 'success');
    }
  }
  
  // Function to show toast notification
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
      toast.remove();
    });
  }
});