'use strict';
// hide the form if the browser doesn't do SVG,
// (then just let everything else fail)
if (!document.createElementNS) {
  document.getElementsByTagName("form")[0].style.display = "none";
}

var body = d3.select("body"),
    stat = d3.select("#status");

const width = 580
const height = 580
var centered

var selectvar = (function() {
      var fmt = d3.format(".2f");
      return function(n) { return fmt(n) + "%"; };
    })(),
    fields = [
      {name: "Price Income Ratio between 2015 and 2017", id: "pir1517", lo: 1, hi: 13},
      {name: "Price Income Ratio between 2007 and 2012", id: "pir0712", lo: 1, hi: 13},
      {name: "Price Income Ratio between 1998 and 2000", id: "pir9800", lo: 1, hi: 13},
      {name: "Percent Change in College Graduates between 2000 and 2016", id: "pccol0016", lo: -25, hi: 25},
      {name: "Percent Change in White's between 2010 and 2016", id: "pcnhwht1016", lo: -25, hi: 25},
      {name: "Percent Change in Black's between 2010 and 2016", id: "pcnhblk1016", lo: -25, hi: 25},
      {name: "Percent Change in Asian's between 2010 and 2016", id: "pcasian1016", lo: -25, hi: 25},
      {name: "Percent Change in Hispanic's between 2010 and 2016", id: "pchisp1016", lo: -25, hi: 25},
      {name: "Percent Change in White's between 2000 and 2016", id: "pcnhwht0016", lo: -25, hi: 25},
      {name: "Percent Change in Black's between 2000 and 2016", id: "pcnhblk0016", lo: -25, hi: 25},
      {name: "Percent Change in Asian's between 2000 and 2016", id: "pcasian0016", lo: -25, hi: 25},
      {name: "Percent Change in Hispanic's between 2000 and 2016", id: "pchisp0016", lo: -25, hi: 25},
      {name: "Percent Change in White's between 2000 and 2010", id: "pcnhwht0010", lo: -25, hi: 25},
      {name: "Percent Change in Black's between 2000 and 2010", id: "pcnhblk0010", lo: -25, hi: 25},
      {name: "Percent Change in Asian's between 2000 and 2010", id: "pcasian0010", lo: -25, hi: 25},
      {name: "Percent Change in Hispanic's between 2000 and 2010", id: "pchisp0010", lo: -25, hi: 25},
      {name: "Percent Change in Median Home Value between 2012 and 2016, Adjusted to 2017 Dollars", id: "pcmhmval1216a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Median Rent between 2012 and 2016, Adjusted to 2017 Dollars", id: "pcmrent1216a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Median Home Value between 2000 and 2016, Adjusted to 2017 Dollars", id: "pcmhmval0016a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Median Rent between 2000 and 2016, Adjusted to 2017 Dollars", id: "pcmrent0016a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Median Home Value between 2000 and 2012, Adjusted to 2017 Dollars", id: "pcmhmval0012a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Median Rent between 2000 and 2012, Adjusted to 2017 Dollars", id: "pcmrent0012a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Mean Sale Price for Single Family Homes between 2009 and 2016, Adjusted to 2017 Dollars", id: "pcmeansp0917a17", lo: -100.0, hi: 100.0},
      {name: "Percent Change in Median Sale Price for Single Family Homes between 2009 and 2016, Adjusted to 2017 Dollars", id: "pcmediansp0917a17", lo: -100.0, hi: 100.0},
      {name: "Percent Change in Mean Sale Price for Single Family Homes between 2000 and 2016, Adjusted to 2017 Dollars", id: "pcmeansp0017a17", lo: -100.0, hi: 100.0},
      {name: "Percent Change in Median Sale Price for Single Family Homes between 2000 and 2016, Adjusted to 2017 Dollars", id: "pcmediansp0017a17", lo: -100.0, hi: 100.0},
      {name: "Percent Change in Mean Sale Price for Single Family Homes between 2000 and 2009, Adjusted to 2017 Dollars", id: "pcmeansp0009a17", lo: -100.0, hi: 100.0},
      {name: "Percent Change in Median Sale Price for Single Family Homes between 2000 and 2009, Adjusted to 2017 Dollars", id: "pcmediansp0009a17", lo: -100.0, hi: 100.0},
      {name: "Percent Change in Household Income between 2012 and 2016, Adjusted to 2017 Dollars", id: "pchinc1216a17", lo: -35.0, hi:  35.0},
      {name: "Percent Change in Household Income for White's between 2012 and 2016, Adjusted to 2017 Dollars", id: "pchincw1216a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Black's between 2012 and 2016, Adjusted to 2017 Dollars", id: "pchincb1216a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Asian's between 2012 and 2016, Adjusted to 2017 Dollars", id: "pchinca1216a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Hispanic's between 2012 and 2016, Adjusted to 2017 Dollars", id: "pchinch1216a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income between 2000 and 2016, Adjusted to 2017 Dollars", id: "pchinc0016a17", lo: -35.0, hi: 35.0},
      {name: "Percent Change in Household Income for White's between 2000 and 2016, Adjusted to 2017 Dollars", id: "pchincw0016a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Black's between 2000 and 2016, Adjusted to 2017 Dollars", id: "pchincb0016a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Asian's between 2000 and 2016, Adjusted to 2017 Dollars", id: "pchinca0016a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Hispanic's between 2000 and 2016, Adjusted to 2017 Dollars", id: "pchinch0016a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income between 2000 and 2012, Adjusted to 2017 Dollars", id: "pchinc0012a17", lo: -35.0, hi: 35.0},
      {name: "Percent Change in Household Income for White's between 2000 and 2012, Adjusted to 2017 Dollars", id: "pchincw0012a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Black's between 2000 and 2012, Adjusted to 2017 Dollars", id: "pchincb0012a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Asian's between 2000 and 2012, Adjusted to 2017 Dollars", id: "pchinca0012a17", lo: -50.0, hi: 50.0},
      {name: "Percent Change in Household Income for Hispanic's between 2000 and 2012, Adjusted to 2017 Dollars", id: "pchinch0012a17", lo: -50.0, hi: 50.0}
    ],
    fieldsById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(fields),
    field = fields[0];

var fieldSelect = d3.select("#field")
  .on("change", function(e) {
    field = fields[this.selectedIndex];
    location.hash = "#" + [field.id].join("/");
  });

fieldSelect.selectAll("option")
  .data(fields)
  .enter()
  .append("option")
    .attr("value", function(d) { return d.id; })
    .text(function(d) { return d.name; });

var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Tract ID: </strong><span class='details'>" + d.id + "<br></span>" + "<strong>Data Value: </strong><span class='details'>" + format(d.properties[field.id]) +"</span>";
            })

var svg = d3.select("#map"),
    layer = svg.append("g")
	  .attr("id", "layer"),
    muniboundaries = layer.append('g')
      .attr('id', 'muniboundaries')
      .selectAll('path'),
    cntyboundaries = layer.append('g')
      .attr('id', 'cntyboundaries')
      .selectAll('path'),
    durhamtrts10 = layer.append("g")
      .attr("id", "durhamtrts10")
      .selectAll("path"),
    roads = layer.append('g')
      .attr('id', 'roads')
      .selectAll('path'),
    durhamhds = layer.append('g')
      .attr('id', 'durhamhds')
      .selectAll('path'),
    colorbar = layer.append('g')
      .attr('class', 'vertical')
      .attr('transform', 'translate(100, 20)')

var translation = [-38, 32],
    scaling = 0.94;

var projection = d3.geoMercator().center([-78.7, 36.05]).scale(60000).precision(.1),
    topology,
    geometries,
    dataById = {},
    carto = d3.cartogram()
      .projection(projection)
      .properties(function(d) {
          return dataById.get(d.id);
      })
      .value(function(d) {
          return +d.properties[field];
      });

var path = d3.geoPath()
  .projection(projection)

layer.call(tip);

const roadsurls = ['roads.572-802.geojson', 'roads.573-802.geojson', 'roads.574-802.geojson', 'roads.575-802.geojson', 'roads.576-802.geojson', 'roads.577-802.geojson', 'roads.572-803.geojson', 'roads.573-803.geojson', 'roads.574-803.geojson', 'roads.575-803.geojson', 'roads.576-803.geojson', 'roads.577-803.geojson', 'roads.572-804.geojson', 'roads.573-804.geojson', 'roads.574-804.geojson', 'roads.575-804.geojson', 'roads.576-804.geojson', 'roads.577-804.geojson', 'roads.572-805.geojson', 'roads.573-805.geojson', 'roads.574-805.geojson', 'roads.575-805.geojson', 'roads.576-805.geojson', 'roads.577-805.geojson']

window.onhashchange = function() {
  parseHash();
};

// Add municiple boundaries
d3.json('data/muniboundaries.geojson', function (geojson) {
  // let geojson = topojson.feature(topology, topology.objects.muniboundaries)
  muniboundaries
    .data(geojson.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'muniboundary')
})
// Add county boundaries
d3.json('data/cntyboundaries.geojson', function (geojson) {
  // let geojson = topojson.feature(topology, topology.objects.cntyboundaries)
  cntyboundaries
    .data(geojson.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'cntyboundary')
})
// Add Data
d3.json("data/durhamtrts10.topojson", function(error, topo) {
  topology = topo;
  geometries = topology.objects.durhamtrts10.geometries;
  d3.csv("data/durham_ltdb_7017_trts_NandO.csv", function(error, data) {
    dataById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(data);
    init();
  });
});
// Add roads
for (var i = 0; i < roadsurls.length; i++) {
  d3.json('data/' + roadsurls[i], function (geojson) {
    roads
      .data(geojson.features)
      .enter().append('path')
      .attr('d', path)
      .attr('class', 'roads')
      .attr('class', function (d) { return d.properties.kind })
  })
} 
// Add neighborhood boundaries
d3.json('data/durhamhds.geojson', function (geojson) {
  // var geojson = topojson.feature(topology, topology.objects.durhamhds)
  durhamhds
    .data(geojson.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'durhamhds')
    .attr('visibility', 'hidden')

  durhamhds
    .data(geojson.features)
    .enter()
    .append('text')
    .attr('class', 'durhamhds')
    .attr('visibility', 'hidden')
    .each(function (d) {
      if (parseFloat(d.properties.shape_area) < 0.00006) {
        return
      }
      else {
          d3.select(this)
            .attr('transform', function (d) { return 'translate(' + path.centroid(d) + ')' })
            .attr('text-anchor', 'middle')
            .style('font-size', '3px')
            .style('stroke', '#000')
            .style('stroke-width', '0.3px')
            .text(function (d) { return d.properties.name })
      }
    })
    .filter(function (d) {
      return parseFloat(d.properties.shape_area) < 0.00006
    }).remove()
})

function init() {
  var features = carto.features(topology, geometries);

  durhamtrts10 = durhamtrts10.data(features)
    .enter()
    .append("path")
      .attr("class", "durhamtr")
      .attr("id", function(d) {
	          return d.id;
           })
      .attr("fill", "#fafafa")
      .attr("d", path)
      .on('mouseover',function(d){
         tip.show(d);
      })
      .on('mouseout', function(d){
         tip.hide(d);
      })
      .on('click', clicked);

  durhamtrts10.append("title");

  var value = function(d) {
        return +d.properties['pir1517'];
      },
      values = durhamtrts10.data()
       .map(value)
       .filter(function(n) {
         return !isNaN(n);
       })
       .sort(d3.ascending),
         lo = 1, // values[0],
         hi = 13.1; // values[values.length - 1];

  var colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
    .domain([lo, hi])

  durhamtrts10.transition()
    .duration(750)
    .ease(d3.easeLinear)
    .attr('fill', function (d) {
      if (isNaN(value(d))) {
        return 'transparent'
      }
      else {
        return colorScale(value(d))
      }
    }) 

  var tickspace = (hi - lo) / 4
  var cbV = d3.colorbarV(colorScale, 20, 200)
    .tickValues([lo, lo + tickspace, lo + (tickspace * 2), lo + (tickspace * 3), hi])
  colorbar.call(cbV)
}


function update() {
  var start = Date.now();
  body.classed("updating", true);

  var parameter = field.id.replace("%d"),
      fmt = (typeof field.format === "function")
	? field.format
	: d3.format(field.format || ","),
      value = function(d) {
	      return +d.properties[parameter];
      },
      values = durhamtrts10.data()
	.map(value)
	.filter(function(n) {
	  return !isNaN(n);
	})
	.sort(d3.ascending),
      lo = field.lo, // values[0],
      hi = field.hi; // values[values.length - 1];

  var colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
    .domain([lo, hi])

  durhamtrts10.transition()
    .duration(750)
    .ease(d3.easeLinear)
    .attr('fill', function (d) {
      if (isNaN(value(d))) {
        return 'transparent'
      }
      else {
        return colorScale(value(d))
      }
    });

    colorbar.remove()
    colorbar = layer.append('g')
      .attr('class', 'vertical')
      .attr('transform', 'translate(100, 20)')
    var tickspace = (hi - lo) / 4
    var cbV = d3.colorbarV(colorScale, 20, 200)
        .tickValues([lo, lo + tickspace, lo + (tickspace * 2), lo + (tickspace * 3), hi])
    colorbar.call(cbV)
}

var deferredUpdate = (function() {
  var timeout;
  return function() {
    var args = arguments;
    clearTimeout(timeout);
    return timeout = setTimeout(function() {
      update.apply(null, arguments);
    }, 10);
  };
})();

var hashish = d3.selectAll("a.hashish")
  .datum(function() {
    return this.href;
  });

function parseHash() {
  var parts = location.hash.substr(1).split("/"),
      desiredFieldId = parts[0],

  field = fieldsById.get(desiredFieldId) || fields[0];
  fieldSelect.property("selectedIndex", fields.indexOf(field));

  deferredUpdate();
  location.replace("#" + [field.id].join("/"));

  hashish.attr("href", function(href) {
    return
  });
}

// Click to zoom
function clicked(d) {
  let x
  let y
  let k

  if (d && centered !== d) {
    let centroid = path.centroid(d)
    x = centroid[0]
    y = centroid[1]
    k = 4
    centered = d

    d3.selectAll('.durhamhds').attr('visibility', 'visible')
  }
  else {
    x = width / 2
    y = height / 2
    k = 1
    centered = null

    d3.selectAll('.durhamhds').attr('visibility', 'hidden')
  }

  layer.selectAll('path')
    .classed('active', centered && function (d) { return d === centered })

  layer.transition()
    .duration(750)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 1.75 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
    .style('stroke-width', 1.5 / k + 'px')
}
