function bounds(array1, array2) {
    var newArray = []

    for(i=0; i< array1.length; i++){
        newArray.push(array1[i]);
    };
    for(i=0; i< array1.length; i++){
        newArray.push(array2[i]);
    };
    return d3.extent(newArray);
}


console.log(stateName);
console.log(fullStateName);

d3.json("../data/PIT").then(data => {
    console.log("start PIT");
    var homelessData = data[stateName];
    console.log(homelessData);
    d3.json("../data/HIC").then(data2 => {
        console.log("start HIC");
        var bedsData = data2[stateName];
        console.log(bedsData);


        var years = Object.keys(homelessData);
        var homelessness = Object.values(homelessData);
        var extentHomelessness = d3.extent(homelessness);
        var beds = Object.values(bedsData);
        var extentBeds = d3.extent(beds);
        console.log(extentHomelessness);

        var options = {
            series: [
            {
            name: `Number of Homeless in ${fullStateName}`,
            data: homelessness
            },
            {
              name: `Available Housing for Homeless in ${fullStateName}`,
              data: beds
            }
        ],
            chart: {
            height: 750,
            type: 'line',
            dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
            },
            toolbar: {
            show: false
            }
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: `Number of Homeless in ${fullStateName}`,
            align: 'left'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            categories: years,
            title: {
            text: 'Year'
            }
        },
        yaxis: {
            title: {
            text: 'Number'
            },
            min: bounds(extentHomelessness,extentBeds)[0]*0.95,
            max: bounds(extentHomelessness,extentBeds)[1]*1.03 
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
        }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();



    }).catch(function(error){
        console.log(error);
    });

    

}).catch(function(error){
    console.log(error);
});



