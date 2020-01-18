// Create the map object
// Add in map tile layer
// Add in US map tile layer
// update stateAbbr in dataset to full state names to use the 
// Create a function to add color to the map based on the density of homelessness
// Add styling to our function
// Add in interactions 
  // Hover
  // Click
// Create a legend

// Tutorial: https://leafletjs.com/examples/choropleth/

// loop through stateData and homelessData, where states values match, add in value from allHomeless2019 to the statesData, that way when   



d3.json("../data/PIT").then(data => {
  console.log("start PIT");
  console.log(data);
});

// Creating map object
var myMap = L.map("map", {
    center: [39.50, -98.35],
    zoom: 5
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(myMap);
  
L.geoJson(statesData).addTo(myMap);

function getColor(d) {

  return d > 100000 ? "#08306b":
        d > 75000 ? "#084594" :
        d > 50000 ? "#2171b5" :
        d > 25000 ? "#4292c6" :
        d > 5000 ? "#6baed6" :
        d > 1000 ? "#9ecae1" :
                  "#c6dbef";
} 

function style(feature) {
  return {
      fillColor: getColor(feature.properties.homeless),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '2',
      fillOpacity: 0.7
  };
}
var geojson = L.geoJson(statesData, {style: style}).addTo(myMap);


function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 5,
      color: '#999',
      dashArray: '1',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

// Binding a pop-up to each layer (need to add in a year layer...)

function onEachFeature(feature, layer) {
  layer.bindPopup("<b>State: </b>" + feature.properties.name + "<br><b>Homeless Count:</b> " +
    feature.properties.homeless + "<br><a href = ../" + feature.properties.name +"> Data by Year</a> "
    );
}

var geojson;
geojson = L.geoJson(statesData, {
  style: style,
  onEachFeature: onEachFeature
}).addTo(myMap);
  

  // // Set up the legend, horizontal legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
        grades = [0, 1000, 5000, 25000, 50000, 75000, 10000],
        colors = ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"],
        labels = [];

    // Add min & max
    var legendInfo = "<h1>Homeless Population</h1>"+
      "<div class=\"labels\">" +
        "<div class=\"min\">" + grades[0] + "</div>" +
        "<div class=\"max\">" + grades[grades.length - 1] + "</div>"
      "</div>";

    div.innerHTML = legendInfo;

    grades.forEach(function(grades, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
  
//   L.control.timelineSlider({
//     timelineItems: ["Day 1", "The Next Day", "Amazing Event", "1776", "12/22/63", "1984"],
//     extraChangeMapParams: {greeting: "Hello World!"}, 
//     changeMap: changeMapFunction })
// .addTo(mymap);

  