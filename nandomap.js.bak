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
var active = d3.select(null);

var selectvar = (function() {
      var fmt = d3.format(".2f");
      return function(n) { return fmt(n) + "%"; };
    })(),
    fields = [
      {name: "Price Income Ratio between 2015 and 2017", id: "pir1517", lo: 1, hi: 9, unit: 'pir'},
      {name: "Price Income Ratio between 1998 and 2000", id: "pir9800", lo: 1, hi: 9, unit: 'pir'},
      {name: "Percent Change in College Graduates between 2012 and 2016", id: "pccol1216", lo: -15, hi: 15, unit: '%'},
      {name: "Population in 2010", id: "pop10", lo: 0, hi: 8000, unit: '#'},
      {name: "Population in 2016", id: "pop16", lo: 0, hi: 8000, unit: '#'},
      {name: "Change in Population between 2010 and 2016", id: "cpop1016", lo: -2900, hi: 2900, unit: '#'},
      {name: "Percent Change in Population Between 2010 and 2016", id: "pcpop1016", lo: -50, hi: 50, unit: '%'},
      {name: "Percent Change in White's between 2010 and 2016", id: "pcnhwht1016", lo: -13, hi: 13, unit: '%'},
      {name: "Percent Change in Black's between 2010 and 2016", id: "pcnhblk1016", lo: -13, hi: 13, unit: '%'},
      {name: "Percent Change in Asian's between 2010 and 2016", id: "pcasian1016", lo: -13, hi: 13, unit: '%'},
      {name: "Percent Change in Hispanic's between 2010 and 2016", id: "pchisp1016", lo: -13, hi: 13, unit: '%'},
      {name: "Median Home Value in 2016, Adjusted to 2017 Dollars", id: "mhmval16a17", lo: 50000.0, hi: 300000.0, unit: '$'},
      {name: "Percent Change in Median Home Value between 2000 and 2016, Adjusted to 2017 Dollars", id: "pcmhmval0016a17", lo: -50.0, hi: 50.0, unit: '%'},
      {name: "Median Rent in 2016, Adjusted to 2017 Dollars", id: "mrent16a17", lo: 400.0, hi: 1600.0, unit: '$'},
      {name: "Percent Change in Median Rent between 2012 and 2016, Adjusted to 2017 Dollars", id: "pcmrent1216a17",     lo: -80.0, hi: 80.0, unit: '%'},
      {name: "Median Sale Price for Single Family Homes between 2015 and 2017, Adjusted to 2017 Dollars", id: "mediansp1517a17", lo: 50000.0, hi: 445000.0, unit: '$'},
      {name: "Percent Change in Median Sale Price for Single Family Homes between 2000 and 2017, Adjusted to 2017 Dollars", id: "pcmediansp0017a17", lo: -100.0, hi: 100.0, unit: '%'}
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
      .selectAll('path');

var bar = d3.select("#bar"),
    colorbar = bar.append("g")
      .attr('class', 'vertical')
      .attr('transform', 'translate(20, 10)')

var translation = [-38, 32],
    scaling = 0.94;

var projection = d3.geoMercator().center([-78.8, 36.05]).scale(60000).precision(.1),
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

var zoom = d3.zoom()
  .scaleExtent([1, 4])
  .on("zoom", function() {
    Neighborhood();
    layer.attr("transform", d3.event.transform);
  });
svg.call(zoom); 

var zoomin = d3.select("#zoomin"),
    zoominmenu = zoomin.append("g")
      .attr("id","zoomin")
      .attr('transform', 'translate(0, 0)')
      .text("+")
      .on("click", function() {
        zoom.scaleBy(svg
          .transition()
          .duration(750), 2);
      }),
    zoomout = d3.select("#zoomout"),
    zoomoutmenu = zoomout.append("g")
      .attr("id","zoomout")
      .attr('transform', 'translate(0, 0)')
      .text("-")
      .on("click", function() {
        zoom.scaleBy(svg
          .transition()
          .duration(750), 0.5);
      });

var format = d3.format(",");
      
// Set tooltips
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      if (field.unit === '$') {
        // return "<strong>Location: </strong><span class='details'>"+'   '+"<br></span>" + "<strong>Tract ID: </strong><span class='details'>" + d.id + "<br></span>" + "<strong>Data Value: </strong><span class='details'>" + field.unit + format(d.properties[field.id]) + " " + "</span>";
        return "<strong>Tract ID: </ strong><span class='details'>" + d.id + "<br></span>" + "<strong>Data Value: </strong><span class='details'>" + field.unit + format(d.properties[field.id]) + " " + "</span>";           
      }
      else {
        // return "<strong>Location: </strong><span class='details'>"+'   '+"<br></span>" + "<strong>Tract ID: </strong><span class='details'>" + d.id + "<br></span>" + "<strong>Data Value: </strong><span class='details'>" + format(d.properties[field.id]) + " " + field.unit + "</span>";
        return "<strong>Tract ID: </ strong><span class='details'>" + d.id + "<br></span>" + "<strong>Data Value: </strong><span class='details'>" + format(d.properties[field.id]) + " " + field.unit + "</span>"; 
                  
      }
    })
layer.call(tip);
      
const roadsurls = ['roads.572-802.geojson', 'roads.573-802.geojson', 'roads.574-802.geojson', 'roads.575-802.geojson', 'roads.576-802.geojson', 'roads.577-802.geojson', 'roads.572-803.geojson', 'roads.573-803.geojson', 'roads.574-803.geojson', 'roads.575-803.geojson', 'roads.576-803.geojson', 'roads.577-803.geojson', 'roads.572-804.geojson', 'roads.573-804.geojson', 'roads.574-804.geojson', 'roads.575-804.geojson', 'roads.576-804.geojson', 'roads.577-804.geojson', 'roads.572-805.geojson', 'roads.573-805.geojson', 'roads.574-805.geojson', 'roads.575-805.geojson', 'roads.576-805.geojson', 'roads.577-805.geojson']

window.onhashchange = function() {
  parseHash();
};

window.onload = function() {
  if (location.hash.substr(1)) {
    location.replace("");
  }
};

// Add municiple boundaries
d3.json('data/muniboundaries.topojson', function (topology) {
  let geojson = topojson.feature(topology, topology.objects.muniboundaries)
  muniboundaries
    .data(geojson.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'muniboundary')
})
// Add county boundaries
d3.json('data/cntyboundaries.topojson', function (topology) {
  let geojson = topojson.feature(topology, topology.objects.cntyboundaries)
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
// Initiate Map
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
      });

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
         lo = field.lo,
         hi = field.hi;

  var colorScale = d3.scaleSequential(d3.interpolatePuOr)
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

  colorbar.append("text").attr("x", 70).attr("y", 105).text(field.unit)
  var tickspace = (hi - lo) / 4
  var cbV = d3.colorbarV(colorScale, 20, 200)
    .tickValues([lo, lo + tickspace, lo + (tickspace * 2), lo + (tickspace * 3), hi])
  colorbar.call(cbV)
}
// Update Map
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
      lo = field.lo,
      hi = field.hi;

  var colorScale = d3.scaleSequential(d3.interpolatePuOr)
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
    colorbar = bar.append('g')
      .attr('class', 'vertical')
      .attr('transform', 'translate(20, 10)')
    colorbar.append("text").attr("x", 70).attr("y", 105).text(field.unit)
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

function Neighborhood() {
  var zoomlevel = d3.zoomTransform(svg.node()).k
  if (zoomlevel === 1) {
    d3.selectAll('.durhamhds').attr('visibility', 'hidden')
  }
  else if (zoomlevel === 2) {
    d3.selectAll('.durhamhds').attr('visibility', 'hidden')
  }
  else if (zoomlevel === 4) {
    d3.selectAll('.durhamhds').attr('visibility', 'visible')
  }
}
