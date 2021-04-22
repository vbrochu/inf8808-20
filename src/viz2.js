

// set the dimensions and margins of the graph
let graphWidth = Math.min(self.innerWidth, 1500);
let graphHeight = graphWidth * 0.6;
var margin = {top: 20, right: 60, bottom: 160, left: 60},
    width = graphWidth - margin.left - margin.right,
    height = graphHeight * 0.6 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#viz2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv('./data2.csv').then((data) => {

  // format the data
  data.forEach(function(d) {
    d.count = +d.count;
  });

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.terme; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.terme); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .style("font-size", 14);

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});
