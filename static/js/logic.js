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
stateNames = {'AK': 'ALASKA', 'AL': 'ALABAMA', 'AR': 'ARKANSAS', 'AZ': 'ARIZONA', 'CA': 'CALIFORNIA', 'CO': 'COLORADO', 'CT': 'CONNECTICUT', 'DC': 'DISTRICT OF COLUMBIA', 'DE': 'DELAWARE', 'FL': 'FLORIDA', 'GA': 'GEORGIA', 'HI': 'HAWAII', 'IA': 'IOWA', 'ID': 'IDAHO', 'IL': 'ILLINOIS', 'IN': 'INDIANA', 'KS': 'KANSAS', 'KY': 'KENTUCKY', 'LA': 'LOUISIANA', 'MA': 'MASSACHUSETTS', 'MD': 'MARYLAND', 'ME': 'MAINE', 'MI': 'MICHIGAN', 'MN': 'MINNESOTA', 'MO': 'MISSOURI', 'MS': 'MISSISSIPPI', 'MT': 'MONTANA', 'NC': 'NORTH CAROLINA', 'ND': 'NORTH DAKOTA', 'NE': 'NEBRASKA', 'NH': 'NEW HAMPSHIRE', 'NJ': 'NEW JERSEY', 'NM': 'NEW MEXICO', 'NV': 'NEVADA', 'NY': 'NEW YORK', 'OH': 'OHIO', 'OK': 'OKLAHOMA', 'OR': 'OREGON', 'PA': 'PENNSYLVANIA', 'PR': 'PUERTO RICO', 'RI': 'RHODE ISLAND', 'SC': 'SOUTH CAROLINA', 'SD': 'SOUTH DAKOTA', 'TN': 'TENNESSEE', 'TX': 'TEXAS', 'UT': 'UTAH', 'VA': 'VIRGINIA', 'VT': 'VERMONT', 'WA': 'WASHINGTON', 'WI': 'WISCONSIN', 'WV': 'WEST VIRGINIA', 'WY': 'WYOMING'}


function nameToAbbr(name) {
    var abbr = ""
    var found = false
    for(i=0; i< Object.keys(stateNames).length; i++){
        if(name.toUpperCase() === Object.values(stateNames)[i]){
            abbr = Object.keys(stateNames)[i];
            found = true;
        }
    }
    if(found){
        return abbr;
    }
    else{
        return "ERROR";
    }
}


function updateYear(year){
  for(var i=0; i<statesData["features"]["length"]; i++){


    var stateAbbr = nameToAbbr(statesData["features"][i]["properties"]["name"])
    //console.log(stateAbbr);
    statesData["features"][i]["properties"]["homeless"] = homelessData[stateAbbr][year];
    //console.log(statesData["features"][i]["properties"]["homeless"]);
    extentTester.push(homelessData[stateAbbr][year]);
  }
  
}
var homelessData = {}
var extentTester = [];
d3.json("../data/PIT").then(data => {
  //console.log("PIT Homeless Data");
  homelessData = data;
  //console.log(homelessData);
  

  var years = Object.keys(homelessData[Object.keys(homelessData)[0]]);
  for( var j=0; j<statesData["features"]["length"]; j++) {
    var year = years[j];
    updateYear(year);
  }
  var extentHomeless = d3.extent(extentTester);
  console.log(extentHomeless);
  var maxHomeless = extentHomeless[1];

  

  // Creating map object
  
    
    // Adding tile layer
  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    })


    
  

  function getColor(d) {

    return d > (12*maxHomeless/20) ? "#08306b": 
          d > (11*maxHomeless/20) ? "#183e76":
          d > (10*maxHomeless/20) ? "#284d81":
          d > (9*maxHomeless/20) ? "#385b8c":
          d > (8*maxHomeless/20) ? "#476997":
          d > (7*maxHomeless/20) ? "#5777a2":
          d > (6*maxHomeless/20) ? "#6785ad":
          d > (5*maxHomeless/20) ? "#7794b8" :
          d > (4*maxHomeless/20) ? "#87a2c3" :
          d > (3*maxHomeless/20) ? "#97b0ce" :
          d > (2*maxHomeless/20) ? "#a6bed9" :
          d > (maxHomeless/20) ? "#b6cde4" :
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
  // var geojson = L.geoJson(statesData, {style: style});


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
      feature.properties.homeless + "<br><a href = ../" + nameToAbbr(feature.properties.name) +"> Data by Year</a> "
      );
  }

  updateYear("2019");  
  var layer2019 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });
  //console.log(layer2019);

  updateYear("2018");
  var layer2018 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2017");
  var layer2017 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2016");
  var layer2016 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2015");
  var layer2015 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2014");
  var layer2014 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2013");
  var layer2013 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2012");
  var layer2012 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2011");
  var layer2011 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2010");
  var layer2010 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2009");
  var layer2009 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2008");
  var layer2008 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });

  updateYear("2007");
  var layer2007 = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  });
  //console.log(layer2019);
  //console.log(layer2007);

 

  var baseMaps = {
    2019: layer2019,
    2018: layer2018,
    2017: layer2017,
    2016: layer2016,
    2015: layer2015,
    2014: layer2014,
    2013: layer2013,
    2012: layer2012,
    2011: layer2011,
    2010: layer2010,
    2009: layer2009,
    2008: layer2008,
    2007: layer2007
  }


  

 

  // var geojson = L.geoJson(statesData, {
  //   style: style,
  //   onEachFeature: onEachFeature
  // })//.addTo(myMap);

  var myMap = L.map("map", {
    center: [39.50, -98.35],
    zoom: 5,
    layers: [light, layer2019]
  });
  L.control.layers(baseMaps).addTo(myMap);
    

    // // Set up the legend, horizontal legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
          grades = [0, maxHomeless/20, 2*maxHomeless/20, 3*maxHomeless/20, 4*maxHomeless/20, 5*maxHomeless/20, 6*maxHomeless/20, 7*maxHomeless/20, 8*maxHomeless/20, 9*maxHomeless/20, 10*maxHomeless/20, 11*maxHomeless/20, Math.round(12*maxHomeless/20)],
          colors = ["#c6dbef", "#b6cde4", "#a6bed9", "#97b0ce", "#87a2c3", "#7794b8", "#6785ad","#5777a2","#476997","#385b8c","#284d81","#183e76","#08306b"],
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
    


});