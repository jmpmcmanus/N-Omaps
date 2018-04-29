'use strict';
// hide the form if the browser doesn't do SVG,
// (then just let everything else fail)
if (!document.createElementNS) {
  document.getElementsByTagName("form")[0].style.display = "none";
}

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

var body = d3.select("body"),
    stat = d3.select("#status");
    
var selectvar = (function() {
      var fmt = d3.format(".2f");
      return function(n) { return fmt(n) + "%"; };
    })(),
    fields = [
      {name: "Price Income Ratio between 2015 and 2017", id: "none"},
      {name: "Price Income Ratio between 1998 and 2000", id: "pir9800", key: "pir9800"},
      {name: "Price Income Ratio between 2007 and 2012", id: "pir0712", key: "pir0712"},
      {name: "Price Income Ratio between 2015 and 2017", id: "pir1517", key: "pir1517"},
      {name: "Percent Change in White's between 2000 and 2016", id: "pcnhwht0016", key: "pcnhwht0016"},
      {name: "Percent Change in Black's between 2000 and 2016", id: "pcnhblk0016", key: "pcnhblk0016"},
      {name: "Percent Change in Asian's between 2000 and 2016", id: "pcasian0016", key: "pcasian0016"},
      {name: "Percent Change in Hispanic's between 2000 and 2016", id: "pchisp0016", key: "pchisp0016"},
      {name: "Change in Median Home Value between 2000 and 2016, Adjusted to 2017 Dollars", id: "cmhmval0016a17", key: "cmhmval0016a17"},
      {name: "Change in Median Rent between 2000 and 2016, Adjusted to 2017 Dollars", id: "cmrent0016a17", key: "cmrent0016a17"},
      {name: "Change in Household Income between 2012 and 2016, Adjusted to 2017 Dollars", id: "chinc1216a17", key:"chinc1216a17"},
      {name: "Change in Household Income for White&apos;s between 2012 and 2016, Adjusted to 2017 Dollars", id: "chincw1216a17", key: "chincw1216a17"},
      {name: "Change in Household Income for Black's between 2012 and 2016, Adjusted to 2017 Dollars", id: "chincb1216a17", key: "chincb1216a17"},
      {name: "Change in Household Income for Asian's between 2012 and 2016, Adjusted to 2017 Dollars", id: "chinca1216a17", key: "chinca1216a17"},
      {name: "Change in Household Income for Hispanic's between 2012 and 2016, Adjusted to 2017 Dollars", id: "chinch1216a17", key: "chinch1216a17"},
      {name: "Change in Mean Sale Price for Single Family Homes between 2009 and 2016, Adjusted to 2017 Dollars", value: "cmeansp0916a17", key: "cmeansp0916a17"},
      {name: "Change in Median Sale Price for Single Family Homes between 2009 and 2016, Adjusted to 2017 Dollars", value: "cmediansp0916a17", key: "cmediansp0916a17"},
      {name: "Change in Household Income between 2000 and 2016, Adjusted to 2017 Dollars", value: "chinc0016a17", key: "chinc0016a17"},
      {name: "Change in Household Income for White's between 2000 and 2016, Adjusted to 2017 Dollars", value: "chincw0016a17", key: "chincw0016a17"},
      {name: "Change in Household Income for Black's between 2000 and 2016, Adjusted to 2017 Dollars", value: "chincb0016a17", key: "chincb0016a17"},
      {name: "Change in Household Income for Asian's between 2000 and 2016, Adjusted to 2017 Dollars", value: "chinca0016a17", key: "chinca0016a17"},
      {name: "Change in Household Income for Hispanic's between 2000 and 2016, Adjusted to 2017 Dollars", id: "chinch0016a17", key: "chinch0016a17"},
      {name: "Change in Mean Sale Price for Single Family Homes between 2000 and 2016, Adjusted to 2017 Dollars", id: "cmeansp0016a17", key: "cmeansp0016a17"},
      {name: "Change in Median Sale Price for Single Family Homes between 2000 and 2016, Adjusted to 2017 Dollars", id: "cmediansp0016a17", key: "cmediansp0016a17"},
      {name: "Percent Change in College Graduates between 2000 and 2016", id: "pccol0016", key: "pccol0016"}
    ],
    years = [2017],
    fieldsById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(fields),
    field = fields[0],
    year = years[0],
    colors = d3.schemeRdYlGn[3].reverse()
      .map(function(rgb) { return d3.hsl(rgb); });

var fieldSelect = d3.select("#field")
  .on("change", function(e) {
    field = fields[this.selectedIndex];
    location.hash = "#" + [field.id, year].join("/");
  });

fieldSelect.selectAll("option")
  .data(fields)
  .enter()
  .append("option")
    .attr("value", function(d) { return d.id; })
    .text(function(d) { return d.name; });

var yearSelect = d3.select("#year")
  .on("change", function(e) {
    year = years[this.selectedIndex];
    location.hash = "#" + [field.id, year].join("/");
  });

yearSelect.selectAll("option")
  .data(years)
  .enter()
  .append("option")
    .attr("value", function(y) { return y; })
    .text(function(y) { return y; });

var dmap = d3.select("#map"),
    layer = dmap.append("g")
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
    colorbar = layer.append('g')
      .attr('class', 'vertical')
      .attr('transform', 'translate(100, 20)')

var translation = [-38, 32],
    scaling = 0.94;

layer.attr("transform",
    "translate(" + translation + ")" +
    "scale(" + scaling + ")");

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

function init() {
  var features = carto.features(topology, geometries),
      path = d3.geoPath().projection(projection);

  durhamtrts10 = durhamtrts10.data(features)
    .enter()
    .append("path")
      .attr("class", "durhamtr")
      .attr("id", function(d) {
	          return d.id;
           })
      .attr("fill", "#fafafa")
      .attr("d", path);

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
         lo = values[0],
         hi = values[values.length - 1];

  var color = d3.scaleSequential(d3.interpolateRdYlGn)
    .domain([lo, hi])

  durhamtrts10.transition()
    .duration(750)
    .ease(d3.easeLinear)
    .attr('fill', function (d) {
      if (isNaN(value(d))) {
        return 'transparent'
      }
      else {
        return color(value(d))
      }
    }) 

  var tickspace = (hi - lo) / 4
  var cbV = d3.colorbarV(color, 20, 200)
    .tickValues([lo, lo + tickspace, lo + (tickspace * 2), lo + (tickspace * 3), hi])
  colorbar.call(cbV)

} 

function update() {
  var start = Date.now();
  body.classed("updating", true);

  var key = field.key.replace("%d", year),
      fmt = (typeof field.format === "function")
	? field.format
	: d3.format(field.format || ","),
      value = function(d) {
	      return +d.properties[key];
      },
      values = durhamtrts10.data()
	.map(value)
	.filter(function(n) {
	  return !isNaN(n);
	})
	.sort(d3.ascending),
      lo = values[0],
      hi = values[values.length - 1];

  var color = d3.scaleSequential(d3.interpolateRdYlGn)
    .domain([lo, hi])

  durhamtrts10.transition()
    .duration(750)
    .ease(d3.easeLinear)
    .attr('fill', function (d) {
      if (isNaN(value(d))) {
        return 'transparent'
      }
      else {
        return color(value(d))
      }
    });

    colorbar.remove()
    colorbar = layer.append('g')
      .attr('class', 'vertical')
      .attr('transform', 'translate(100, 20)')
    var tickspace = (hi - lo) / 4
    var cbV = d3.colorbarV(color, 20, 200)
        .tickValues([lo, lo + tickspace, lo + (tickspace * 2), lo + (tickspace * 3), hi])
    colorbar.call(cbV)

}

var deferredUpdate = (function() {
  var timeout;
  return function() {
    var args = arguments;
    clearTimeout(timeout);
    stat.text("calculating...");
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
      desiredYear = +parts[1];

  field = fieldsById.get(desiredFieldId) || fields[0];
  year = (years.indexOf(desiredYear) > -1) ? desiredYear : years[0];

  fieldSelect.property("selectedIndex", fields.indexOf(field));

  if (field.id === "none") {

    yearSelect.attr("disabled", "disabled");

  } else {

    if (field.years) {
      if (field.years.indexOf(year) === -1) {
	       year = field.years[0];
      }
      yearSelect.selectAll("option")
	      .attr("disabled", function(y) {
	        return (field.years.indexOf(y) === -1) ? "disabled" : null;
	    });
    } else {
      yearSelect.selectAll("option")
	    .attr("disabled", null);
    }

    yearSelect
      .property("selectedIndex", years.indexOf(year))
      .attr("disabled", null);

    deferredUpdate();
    location.replace("#" + [field.id, year].join("/"));

    hashish.attr("href", function(href) {
      return
    });
  }
}
