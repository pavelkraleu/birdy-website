
var dataset = null;
var svg = d3.select('#birdyRealTime');
var svgElement = document.getElementById('birdyRealTime');
var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
};
var width = svgElement.width.baseVal.value - margin.left - margin.right;
var height = svgElement.height.baseVal.value - margin.top - margin.bottom;
var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var timeParseMask = d3.timeParse('%Y-%m-%d %H:%M:%S');
var parseValues = function(data) {
    for (var i = 0; i < data.length; ++i) {
        data[i].Date = timeParseMask(data[i].Date);
        data[i].Birds = +data[i].Birds;
        data[i]['Outdoor Temperature'] = +data[i]['Outdoor Temperature'];
    }
    return data;
};

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var birdLine = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Birds); });

var temperatureLine = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d['Outdoor Temperature']); });


Tabletop.init({
    key: 'https://docs.google.com/spreadsheets/d/1b-I_sqDUSi4DLrNH9eQgt1vGZ0ZJme892QrYkxmm1eg/pubhtml',
    callback: function(data, tabletop) {
        dataset = parseValues(data.Sheet1.elements);
        d3Magic();
    },
});


var d3Magic = function() {

    console.log(dataset);
    if (!dataset) {
        return false;
    }

    var data = dataset;

    width = svgElement.width.baseVal.value - margin.left - margin.right;
    height = svgElement.height.baseVal.value - margin.top - margin.bottom;

    console.log(svg.select('g').select('g'));

    svg.select('path').remove();

    
    x.domain(d3.extent(data, function(d) { return d.Date; }));
    y.domain(d3.extent(data, function(d) { return d.Birds; }));

    g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .select('.domain')
        .remove();

    g.append('g')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Birds (Blue) Temperature (Red)');

    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 2)
        .attr('d', birdLine);

    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 2)
        .attr('d', temperatureLine);
}


window.addEventListener('resize', d3Magic);
