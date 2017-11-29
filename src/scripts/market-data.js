// Set the dimensions of the canvas / graph
var margin = { top: 20, right: 0, bottom: 30, left: 10 },
	width = 328 - margin.left - margin.right,
	height = 308 - margin.top - margin.bottom;
var dateTypes = [
	{
		name: '1 DAY',
		value: '1d',
		checked: true,
		url: 'https://www1.hkex.com.hk/hkexwidget/data/getchartdata2?hchart=1&span=0&int=0&ric=.HSI&token=evLtsLsBNAUVTPxtGqVeG8FRBz8%2bk%2bOkkqmLWtD%2fryIW%2bhwmDC%2b1Pnl0WLEtvcoO&qid=1511747170016&callback=jQuery31109402538577963317_1511747158381&_=1511747158392'
	},
	{
		name: '5 DAY',
		value: '5d',
		url: 'https://www1.hkex.com.hk/hkexwidget/data/getchartdata2?hchart=1&span=6&int=2&ric=.HSI&token=evLtsLsBNAUVTPxtGqVeG8FRBz8%2bk%2bOkkqmLWtD%2fryIW%2bhwmDC%2b1Pnl0WLEtvcoO&qid=1511747207624&callback=jQuery31109402538577963317_1511747158381&_=1511747158393'
	},
	{
		name: '6 MONTH',
		value: '6m',
		url: 'https://www1.hkex.com.hk/hkexwidget/data/getchartdata2?hchart=1&span=6&int=4&ric=.HSI&token=evLtsLsBNAUVTPxtGqVeGzZh9EjP5IMPEwiQstomcT687ikOFETMbXYsXpoA8fHR&qid=1511765198211&callback=jQuery31108648118073582811_1511764618964&_=1511764619061'
	},
	{
		name: '1 YEAR',
		value: '1y',
		url: 'https://www1.hkex.com.hk/hkexwidget/data/getchartdata2?hchart=1&span=6&int=5&ric=.HSI&token=evLtsLsBNAUVTPxtGqVeGzZh9EjP5IMPEwiQstomcT687ikOFETMbXYsXpoA8fHR&qid=1511765226185&callback=jQuery31108648118073582811_1511764618985&_=1511764619071'
	},
	{
		name: 'MAX',
		value: 'max',
		url: 'https://www1.hkex.com.hk/hkexwidget/data/getchartdata2?hchart=1&span=8&int=8&ric=.HSI&token=evLtsLsBNAUVTPxtGqVeGzZh9EjP5IMPEwiQstomcT687ikOFETMbXYsXpoA8fHR&qid=1511765255006&callback=jQuery31108648118073582811_1511764618985&_=1511764619073'
	}
]
var regex = /\B(?=(\d{3})+\b)/g;
// Parse the date / time
var parseDate = d3.timeParse("%H:%M"),
	formatDate = d3.timeFormat("%H:%M"),
	yearFormatDate = d3.timeFormat('%m/%d/%Y')
bisectDate = d3.bisector(function (d) { return d.date; }).left;

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the axes
var xAxis = d3.axisBottom(x).ticks(5) // <-A;

var yAxis = d3.axisLeft(y).ticks(5);

// Define the line
var valueline = d3.line()
	.curve(d3.curveCardinal)
	.x(function (d) {
		return x(d.date);
	})
	.y(function (d) {
		return y(d.close);
	});
var svg,
	tooltip,
	tooltipText,
	lineSvg,
	focus;

// Adds the svg canvas
function createTabs() {
	var items = d3.select('.date-types').selectAll('li.date-type-item')
		.data(dateTypes).enter()
		.append('li')
		.attr('class', 'date-type-item')
	items.append('input').attr('type', 'radio').attr('name', 'type').attr('value', d => d.value).attr('id', d => d.value)
		.each(function (node) {
			node.checked && d3.select(this).attr('checked', node.checked)
		}).on('change', function (e, i) {
			init((dateTypes.find(data => e.value === data.value) || {}))
		})
	items.append('label').attr('for', d => d.value).text(d => d.name)
	items.append('div').attr('class', 'content')
	items.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
}

createTabs()
init((dateTypes.find(data => data.checked) || {}))
function init(obj) {
	svg = setSvgContiner()
	tooltip = setToolTip()
	tooltipText = setToolTipText()
	generatorChart(obj)

}
function setSvgContiner() {
	d3.selectAll(".date-types li input:checked ~ .content svg").remove()
	var selections = d3.selectAll(".date-types li input:checked ~ .content")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");
	lineSvg = selections.append("g");
	focus = selections.append("g")
	return selections
}
function setToolTip() {
	return svg.append('rect')
		.attr('class', 'tooltip')
		.attr('y', -20)
		.attr('rx', 2)
		.attr('ry', 2)
		.attr('width', 120)
		.attr('height', 21)
		.attr('fill', 'none')
		.attr('stroke', '#D1DDE6')
		.style("display", "none");
}
function setToolTipText() {
	return svg.append('text')
		.attr('class', 'tooltip-text')
		.attr('y', -24)
		.style("display", "none");
}

var area = d3.area()
	.x(function (d) { return x(d.date); })
	.y0(height)
	.y1(function (d) { return y(d.close); });

var t = d3.transition()
	.duration(1000)
	.ease(d3.easeLinear)
	.on("start", function (d) { console.log("transiton start") })
	.on("end", function (d) { console.log("transiton end") })
var baseLine

function generatorChart(obj) {
	// Get the data
	d3.request(obj.url)
		.mimeType("application/json")
		.response(function (xhr) {
			return JSON.parse(xhr.responseText.replace(/.*\(/, '').replace(/\)$/, ''));
		})
		.get(function (error, rep) {
			rep.data.datalist.pop()
			rep.data.datalist.shift()
			var data = rep.data.datalist.map(function (d, i) {
				return {
					date: new Date(d[0]),
					close: d[1]
				}
			});
			baseLine = data[0]
			// Scale the range of the data
			if (obj.value === '1d') {
				xAxis.tickFormat(formatDate)
				var start = d3.min(data, function (d) { return d.date; })
				var end = new Date(moment(start).add(6.5, 'hour'))
				x.domain([start, end]).ticks(d3.timeMinute.every(60));
			} else {
				xAxis.tickFormat(null)
				x.domain(d3.extent(data, function (d) { return d.date }));
			}

			y.domain([d3.min(data, function (d) { return d.close; }), d3.max(data, function (d) { return d.close; })]);

			// Add the valueline path.
			lineSvg.append("path")
				.attr("class", "line")
				.attr("d", valueline(data))
				.attr("stroke-dasharray", function (d) { return this.getTotalLength() })
				.attr("stroke-dashoffset", function (d) { return this.getTotalLength() });
			svg.selectAll(".line").transition(t)
				.attr("stroke-dashoffset", 0)

			// add the area
			svg.append("path")
				.data([data])
				.attr("class", "area")
				.attr("d", area);
			// Add the X Axis

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.attr('stroke', '#10416C');

			// Add the Y Axis
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.attr('display', 'none');


			// append the x line
			focus.append("line")
				.attr("class", "x")
				.style("stroke", "red")
				.style("stroke-dasharray", "3,3")
				.style("opacity", 1)
				.attr("y1", 0)
				.attr("y2", height)
				.style("display", "none");

			// append the y line
			focus.append("line")
				.attr("class", "y")
				.style("stroke", "blue")
				.style("stroke-dasharray", "3,6")
				.style("opacity", 1)
				.attr("x1", width)
				.attr("x2", width)
				.attr("transform", "translate(" + width * -1 + "," + y(baseLine.close) + ")")
				.attr("x2", width + width)

			focus.append('text')
				.attr('class', 'prev-close')
				.attr('x', 246)
				.attr('y', y(baseLine.close) - 8)
			focus.select('.prev-close')
				.append('tspan')
				.text('Prev.Close')
				.style('color', '#10416C')

			focus.select('.prev-close')
				.append('tspan')
				.text(baseLine.close.toString().replace(regex, ','))
				.attr('dy', 18)
				.attr('dx', -54)
				.style('color', '#10416C')

			// append the circle at the intersection
			focus.append("circle")
				.attr("class", "y")
				.style("fill", "red")
				.style("stroke", "red")
				.attr("r", 4)
				.style("display", "none");


			// append the rectangle to capture mouse
			svg.append("rect")
				.attr("width", width)
				.attr("height", height)
				.style("fill", "none")
				.style("pointer-events", "all")
				.on("mouseover", function () {
					focus.select('line.x').style("display", null);
					focus.select('circle.y').style("display", null);
					svg.select('rect.tooltip').style("display", null);
					tooltipText.style("display", null);
				})
				.on("mouseout", function () {
					focus.select('line.x').style("display", "none");
					focus.select('circle.y').style("display", "none");
					tooltipText.style("display", "none");
					svg.select('rect.tooltip').style("display", 'none');
				})
				.on("mousemove", mousemove);

			function mousemove() {
				var x0 = x.invert(d3.mouse(this)[0]),
					i = bisectDate(data, x0, 1),
					d0 = data[i - 1],
					d1 = data[i]
				if (!data[i]) return
				var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
				var tX = x(d.date) - 50 > 0 ? x(d.date) - 50 : 0
				var ttX = (x(d.date) - 40) > 0 ? (x(d.date) - 40) : 0
				svg.select('rect.tooltip')
					.attr("transform",
					"translate(" + tX + "," + 0 + ")")
					.style("display", null);
				var toolTipDate = obj.value === '1d' ? formatDate(d.date) : yearFormatDate(d.date)
				tooltipText.attr("transform",
					"translate(" + ttX + "," + 20 + ")")
					.style("display", null)
					.text(d.close.toString().replace(regex, ',') + '(' + toolTipDate + ')');
				focus.selectAll(".x")
					.attr("transform",
					"translate(" + x(d.date) + "," + 0 + ")")
				focus.selectAll("circle.y")
					.attr("transform",
					"translate(" + x(d.date) + "," + y(d.close) + ")");
			}

		});

}



