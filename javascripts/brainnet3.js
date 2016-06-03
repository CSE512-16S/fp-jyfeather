var margin = {top: 300, right: 100, bottom: 30, left:250},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var color = d3.scale.category10();

/* fig 1, x - y */
var fig1 = d3.select("body")
.append("svg")
.attr("width", width+margin.left+margin.right)
.attr("height", height+margin.top+margin.bottom);

/* fig 1, x - z */
var fig2 = d3.select("body")
.append("svg")
.attr("width", width+margin.left+margin.right)
.attr("height", height+margin.top+margin.bottom);

d3.json("functional.json", function(error, json){
  var nodes = json.nodes.map(function(d){
    return {
      'index' : d.id,
      'x' : d.x*3,
      'y' : d.y*3,
      'fixed': true,
      'label' : d.name,
      'group' : d.group
    };

  });

  var links = json.links.map(function(d){
    return {
      'source': parseInt(d.source),
      'target': parseInt(d.target)
    };
  });

  var force = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .on("tick", tick);

  force.start();

  fig1.append("g")
  .attr("class", "network")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /* network */
  var network = fig1.selectAll("g.network");

  network.append("g")
  .selectAll("line.link")
  .data(links).enter()
  .append("line")
  .attr("class", "link");

  /* link */
  var link = fig1.selectAll(".link")
  .style("stroke", "#fff");

  network.append("g")
  .attr("class", "nodes")
  .selectAll("g.node")
  .data(force.nodes())
  .enter()
  .append("svg:g")
  .attr("class", "node");

  /* node */
  var node = fig1.selectAll("g.node");

  node.append("svg:circle")
  .attr("r", 10)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .style("fill", function(d){return color(d.group);});

  function tick(test) {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
  }
});

// figure 2
d3.json("functional.json", function(error, json){
  var nodes = json.nodes.map(function(d){
    return {
      'index' : d.id,
      'x' : d.x*3,
      'y' : d.z*3,
      'fixed': true,
      'label' : d.name,
      'group' : d.group
    };

  });

  var links = json.links.map(function(d){
    return {
      'source': parseInt(d.source),
      'target': parseInt(d.target)
    };
  });

  var force = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .on("tick", tick);

  force.start();

  fig2.append("g")
  .attr("class", "network")
  .attr("transform", "translate(" + margin.left+ "," + margin.top+ ")");

  /* network */
  var network = fig2.selectAll("g.network");

  network.append("g")
  .selectAll("line.link")
  .data(links).enter()
  .append("line")
  .attr("class", "link");

  /* link */
  var link = fig2.selectAll(".link")
  .style("stroke", "#fff");

  network.append("g")
  .attr("class", "nodes")
  .selectAll("g.node")
  .data(force.nodes())
  .enter()
  .append("svg:g")
  .attr("class", "node");

  /* node */
  var node = fig2.selectAll("g.node");

  node.append("svg:circle")
  .attr("r", 10)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .style("fill", function(d){return color(d.group);});

  function tick(test) {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
  }


});