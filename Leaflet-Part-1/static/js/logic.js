// Initialize Leaflet map
var map = L.map('map').setView([0, 0], 2);

// Add base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 10,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load earthquake data from USGS API using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(function(data) {
    // Loop through each earthquake feature and add a marker to the map
    data.features.forEach(feature => {
      // Extract necessary information from the feature
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2]; // Extracting depth from the third coordinate
      var coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

      // Define marker size based on magnitude
      var markerSize = magnitude * 3;

      // Define marker color based on depth
      var color = depthColor(depth);

      // Create the marker with custom options
      var markerOptions = {
        radius: markerSize,
        draggable: true,
        color: 'black',
        weight: 1,
        fillColor: color,
        fillOpacity: 0.8
      };

      // Create the marker and add it to the map
      var marker = L.circleMarker(coordinates, markerOptions).addTo(map);

      // Bind a popup to the marker with additional earthquake information
      marker.bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km<br><b>Location:</b> ${feature.properties.place}`);
    });

    // Add legend to the map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<div class="legend-item"><span class="legend-color" style="background: #31a354;"></span> -10 to 10 km</div>';
        div.innerHTML += '<div class="legend-item"><span class="legend-color" style="background: #31a354;"></span> 10 to 100 km</div>';
        div.innerHTML += '<div class="legend-item"><span class="legend-color" style="background: #bbdd6e;"></span> 150 to 200 km</div>';
        div.innerHTML += '<div class="legend-item"><span class="legend-color" style="background: #c51b8a;"></span> 200 to 600 km</div>';
        return div;
      };


    legend.addTo(map);
  })
  .catch(function(error) {
    console.error('Error fetching earthquake data:', error);
  });

// Function to determine marker color based on depth
function depthColor(depth) {
    // Adjust color based on depth range
    if (depth >= -10 && depth <= 10) {
      return '#31a354'; // Green
    } else if (depth > 10 && depth <= 100) {
      return '#31a354'; // Green
    } else if (depth > 150 && depth <= 200) {
      return '#bbdd6e'; // mustard
    } else if (depth > 200 && depth <= 600) {
      return '#c51b8a'; // purple
    } 
}
    
// Function to determine marker color based on depth
function depthColor(depth) {
  // Adjust color based on depth range
  var hue = 120 - (depth / 400) * 120; // Scale depth to hue range (0-120)
  return `hsl(${hue}, 40%, 50%)`; // Convert hue to HSL color
}
