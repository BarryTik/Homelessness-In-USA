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

homelessData = {{ state_data }}

console.log(homelessData);

homelessData.forEach(function(data) {
    data.date = parseTime(data.date);
    data.homelessness = +data.homelessness;
});

var xTimeScale = d3.scaleTime()
    .domain(d3.extent(homelessData, data => data.date))
    .range([0, chartWidth]);

var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(homelessData, data => data.homelessness)])
    .range([chartHeight, 0]);
    

var bottomAxis = d3.axisBottom(xTimeScale);
var leftAxis = d3.axisLeft(yLinearScale);

var drawLine = d3.line()
    .x(data => xTimeScale(data.date))
    .y(data => yLinearScale(data.homelessness));

chartGroup.append("path")
    .attr("d", drawLine(homelessData))
    .classed("line", true);

chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);





