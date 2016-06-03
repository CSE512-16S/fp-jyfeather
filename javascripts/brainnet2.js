var width = 960,
height = 500;

var color = d3.scale.category10();

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var g = svg.append("g");

d3.json("test.json", function(error, json) {
  /* build links */
  var linkedByIndex = {};
  json.links.forEach(function(d) {
    linkedByIndex[d.source + "," + d.target] = true;
  });
  function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }
  function hasConnections(a) {
    for (var property in linkedByIndex) {
      s = property.split(",");
      if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property])          return true;
    }
    return false;
  }

  var force = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .size([width, height]);

  var nodes = json.nodes.map(function(d){
    return {
      // 'index' : d.id,
      'x' : 3*d.x+300,
      'y' : 3*d.y+300,
      'fixed': true,
      // 'label' : d.name,
      // 'group' : d.group
    };
  });

  var links = json.links.map(function(d) {
    return {
      'source' : d.source,
      'target' : d.target,
      'value' : d.value
    };
  });

  g.selectAll("line")
  .data(links)
  .enter().append("line")
  .attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; })
  .style("stroke-width",1.5)
  .style("stroke", function(d) { 
    if (isNumber(d.group) && d.group>=0) return color(d.group);
    else return "#fff"; });

  g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", 10)
    .style("fill", function(d){return color(d.group);});
});

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
