// Number / Percentage - calculate the percentage of homeless people against the census data for the corresponding year (group of years)

// Add this to the html file (if the pie chart js remains in its own file):  <script type="text/javascript" src="static/js/radial.js"></script>

// radial chart that shows total homeless people and what percentage are sheltered, unsheltered, individuals, people in families 

var percentUnsheltered = 45;
var percentSheltered = 55;
var percentInFamilies = 67;
var percentIndivuals = 75;

var totalHomeless = 1907
var stateName = "Alaska" // ${fullStateName}


var options = {
    series: [percentUnsheltered, percentSheltered, percentInFamilies, percentIndivuals],
    chart: {
    
    height: 500,
    type: 'radialBar',
  },
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: {
          fontSize: '18px',
        },
        value: {
          fontSize: '18px',
        },
        total: {
          show: true,
          label: stateName + " Homeless Total",
          formatter: function (w) {
            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
            return totalHomeless
          }
        }
      }
    }
  },
  labels: ["Unsheltered Homeless", "Sheltered Homeless",  "Homeless People in Families", "Homeless Individuals",],
  colors: ["#4292c6", "#084594", "#08306b", "#545454"],  
};

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();  
  
  