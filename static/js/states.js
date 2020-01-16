var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("body")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

var parseTime = d3.timeParse("%Y");

var homelessData = {};

d3.json(APILink).then(data => {
    console.log("start");
    homelessData = data;
    console.log(homelessData);

    for(var i=0; i < homelessData.year.length; i++){

        homelessData.year[i] = parseTime(homelessData.year[i].toString());
        // console.log(homelessData.year[i]);
    };

    console.log(homelessData);
    console.log()


    var extent = d3.extent(homelessData.year); 
    console.log(extent);
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(homelessData.year))
        .range([0, chartWidth]);


    var max = d3.max(homelessData.homelessness);
    console.log(max);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(homelessData.homelessness)])
        .range([chartHeight, 0]);
        

    var bottomAxis = d3.axisBottom(xTimeScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    console.log(bottomAxis);
    console.log(leftAxis);

    var drawLine = d3.line()
        .x(data => xTimeScale(data.x))      //changed .year to .x
        .y(data => yLinearScale(data.y));   //changed .homelessness to .y

    // var drawLine = d3.line()
    //     .x(data => xTimeScale(data.year))      
    //     .y(data => yLinearScale(data.homelessness));  
    

    // var x1 = parseTime("2008");
    // var x2 = parseTime("2015");

    // console.log(x1);
    // console.log(x2);
    // var testLine = [
    //     {x:x1, y:15},
    //     {x:x2, y:10}
    // ];

    // var testLine2 = [
    //     {x:[x1, x2]},
    //     {y:[10,15]}
    // ];
    // console.log(testLine2)

    // console.log("drawing test line");
    // console.log(drawLine(testLine));

    var reorderedHomelessData = [];

    for( i=0; i<homelessData.homelessness.length; i++){
        console.log(homelessData.homelessness[i]);
        console.log(homelessData.year[i]);
        reorderedHomelessData[i] = {x:homelessData.year[i] , y:homelessData.homelessness[i]};
    };

    console.log(reorderedHomelessData);





    
    chartGroup.append("path")
        .classed("line", true)
        .attr("stroke", "black")
        .attr("stroke-width", 5)
        .attr("fill","none")
        .attr("d", drawLine(reorderedHomelessData));

    chartGroup.append("g")
        .classed("axis", true)
        .call(leftAxis);

    chartGroup.append("g")
        .classed("axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
}).catch(function(error){
    console.log(error);
});



