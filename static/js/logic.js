const URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const COLOR_DEPTHS = [10,30,50,70,90];
const RADIUS_MULTIPLIER = 4;
const RADIUS_MIN = 5;

// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with options.
let map = L.map("map", {
center: [40.73, -74.0059],
zoom: 3,
});
streetmap.addTo(map)

// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
let Earthquakes = new L.LayerGroup();

// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
  "Satellite": streetmap
  };
// Create an overlayMaps object to hold the Earthquakes layer.
let overlayMaps = {
  "Earthquakes": Earthquakes
  };
// Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
  }).addTo(map);

// Adding earthquake features to map
function style(feature){
  return{
    fillColor: color(feature.geometry.coordinates[2]),
    radius: radius(feature.properties.mag),
    color:"black",
    weight: 1,
    fillOpacity: 0.75,
  }
}

// Adding color for earthquake depths
function color(depth){
    const COLOR_COLORS = ['#fff2cc','#ffef53','#ffd630','#f5812a',	'#ee2e2b',	'	#cc0000'];
    if (depth <= COLOR_DEPTHS[0]) {
      return COLOR_COLORS[0];
    } else if (depth <= COLOR_DEPTHS[1]) {
      return COLOR_COLORS[1]; 
    } else if (depth <= COLOR_DEPTHS[2]) {
      return COLOR_COLORS[2]; 
    } else if (depth <= COLOR_DEPTHS[3]) {
      return COLOR_COLORS[3]; 
    } else if (depth <= COLOR_DEPTHS[4]) {
      return COLOR_COLORS[4]; 
    } else  {
      return COLOR_COLORS[5]; 
    }
}
function radius(magnitude){
  let calc_radius= magnitude * RADIUS_MULTIPLIER;
  return Math.max(calc_radius, RADIUS_MIN);
}

// Add D3 and add popups that provide info about magnitude and location of earthquake
d3.json(URL).then(function(data){
L.geoJson(data, {
pointToLayer: function(feature,coords){return L.circleMarker(coords)
},
style:style,
onEachFeature:function(feature,layer){
  layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
}
}).addTo(map)
  })


// Adding the legend
  let legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function(map){
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML = '<h4>Depth (km)</h4>'; 
    const depth = ["-10", "10", "30", "50", "70", "90"];
    const COLOR_COLORS = ['#fff2cc','#ffef53','#ffd630','#f5812a',	'#ee2e2b',	'	#cc0000'];
    for (var i = 0; i < depth.length; i++) {
      console.log(COLOR_COLORS[i]);
      div.innerHTML +=
        "<i style='background: " + COLOR_COLORS[i] + "'></i> " +
        depth[i] + (depth[i+1] ? "&ndash;" + depth[i+1] + "<br>" : "+");
      }
      return div;
  };
  console.log("adding legend to map");
  legend.addTo(map);

