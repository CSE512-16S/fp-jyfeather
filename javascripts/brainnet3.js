var margin = {top: 300, right: 100, bottom: 30, left:300},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var color = d3.scale.category10();

var default_node_color = "#808080";
//var default_node_color = "rgb(3,190,100)";
var default_link_color = "grey";
var highlight_link_color = "#fff";
var nominal_base_node_size = 8;
var nominal_text_size = 8;
var max_text_size = 24;
var nominal_stroke = 1.5;
var max_stroke = 4.5;
var max_base_node_size = 36;
var min_zoom = 0.1;
var max_zoom = 7;
var focus_node = null;
var highlight_node = null;
var isHighlight = 0;
var highlight_trans = 0.1;

/* fig 1, x - y */
var fig1 = d3.select("#xy")
.append("svg")
.attr("width", width+margin.left+margin.right)
.attr("height", height+margin.top+margin.bottom);

/* fig 2, x - z */
var fig2 = d3.select("#xz")
.append("svg")
.attr("width", width+margin.left+margin.right)
.attr("height", height+margin.top+margin.bottom);

/* fig 3, x - z */
var fig3 = d3.select("#yz")
.append("svg")
.attr("width", width+margin.left+margin.right)
.attr("height", height+margin.top+margin.bottom);

/* read data and plot figures */
d3.json("functional.json", function(error, json){
  /* ------------ read data ------------- */
  var nodes = json.nodes.map(function(d){
    return {
      'index' : d.id,
      'x' : d.x*3,
      'y' : d.y*3,
      'z' : d.z*3,
      'fixed': true,
      'name' : d.name,
      'group' : d.group
    };

  });

  var links = json.links.map(function(d){
    return {
      'source': parseInt(d.source),
      'target': parseInt(d.target),
      'value' : parseFloat(d.value)
    };
  });

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
      if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property]) return true;
    }
    return false;
  }

  /* ------------- figure xy ---------------- */
  var force1 = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .on("tick", tickxy);

  force1.start();

  fig1.append("g")
  .style("cursor", "move")
  .attr("class", "network")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var network1 = fig1.selectAll("g.network");

  network1.append("g")
  .selectAll("line.link")
  .data(links).enter()
  .append("line")
  .attr("class", "link");

  var link1 = fig1.selectAll(".link")
  .style("stroke", default_link_color);

  network1.append("g")
  .attr("class", "nodes")
  .selectAll("g.node")
  .data(force1.nodes())
  .enter()
  .append("svg:g")
  .attr("class", "node");

  var node1 = fig1.selectAll("g.node");

  node1.append("circle")
  .attr("r", 10)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.y; })
  .style("fill", function(d) { return color(d.group); })

  // node1.append("text")
  // .attr("dx", 12)
  // .attr("dy", ".35em")
  // .style("text-anchor", "middle")
  // .text(function(d) { return d.name; });

  node1.on("mouseover", function(d) {
    set_highlight(d);
  })
  .on("mousedown", function(d) {
    d3.event.stopPropagation();
    focus_node = d;
    set_focus(d);
    if (highlight_node === null) set_highlight(d);
  })
  .on("mouseout", function(d) {
      exit_highlight();
  });

  /* ------------- figure xz ---------------- */
  var force2 = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .on("tick", tickxz);

  force2.start();

  fig2.append("g")
  .attr("class", "network")
  .attr("transform", "translate(" + margin.left+ "," + margin.top+ ")");

  var network2 = fig2.selectAll("g.network");

  network2.append("g")
  .selectAll("line.link")
  .data(links).enter()
  .append("line")
  .attr("class", "link");

  var link2 = fig2.selectAll(".link")
  .style("stroke", default_link_color);

  network2.append("g")
  .attr("class", "nodes")
  .selectAll("g.node")
  .data(force2.nodes())
  .enter()
  .append("svg:g")
  .attr("class", "node");

  var node2 = fig2.selectAll("g.node");

  node2.append("svg:circle")
  .attr("r", 10)
  .attr("cx", function(d) { return d.x; })
  .attr("cy", function(d) { return d.z; })
  .style("fill", function(d){return color(d.group);});

  /* ------------- figure yz ---------------- */
  var force3 = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .on("tick", tickyz);

  force3.start();

  fig3.append("g")
  .attr("class", "network")
  .attr("transform", "translate(" + margin.left+ "," + margin.top+ ")");

  var network3 = fig3.selectAll("g.network");

  network3.append("g")
  .selectAll("line.link")
  .data(links).enter()
  .append("line")
  .attr("class", "link");

  var link3 = fig3.selectAll(".link")
  .style("stroke", default_link_color);

  network3.append("g")
  .attr("class", "nodes")
  .selectAll("g.node")
  .data(force3.nodes())
  .enter()
  .append("svg:g")
  .attr("class", "node");

  var node3 = fig3.selectAll("g.node");

  node3.append("svg:circle")
  .attr("r", 10)
  .attr("cx", function(d) { return d.y; })
  .attr("cy", function(d) { return d.z; })
  .style("fill", function(d){return color(d.group);});

  /* ------------- dictionary ---------------- */
  d3.select(window).on("mouseup", function() {
    if (focus_node!==null) {
      focus_node = null;
      if (highlight_trans<1) {
        node1.style("opacity", 1);
        // text.style("opacity", 1);
        link1.style("opacity", 1);
      }
    }

    if (highlight_node === null) exit_highlight();
  });

  /* --------------- functions ------------------ */
  function tickxy(test) {
    link1.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .attr("stroke-width", function(d) {return d3.round(d.value/1.5,0)*1.5+1; });
  }

  function tickxz(test) {
    link2.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.z; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.z; })
    .attr("stroke-width", function(d) {return d3.round(d.value/1.5,0)*1.5+1; });
  }

  function tickyz(test) {
    link3.attr("x1", function(d) { return d.source.y; })
    .attr("y1", function(d) { return d.source.z; })
    .attr("x2", function(d) { return d.target.y; })
    .attr("y2", function(d) { return d.target.z; })
    .attr("stroke-width", function(d) {return d3.round(d.value/1.5,0)*1.5+1; });
  }

  function set_highlight(d) {
    fig1.style("cursor","pointer");
    if (focus_node!==null) d = focus_node;
    highlight_node = d;

    if (isHighlight != 1) {
      isHighlight = 1;
      link1.style("stroke", function(o) {
        return o.source.index == d.index || o.target.index == d.index ? highlight_link_color : ((isNumber(o.group) && o.group>=0)?color(o.group):default_link_color);
      });
    }
  }

  function set_focus(d) { 
    if (highlight_trans<1)  {
      node1.style("opacity", function(o) {
        return isConnected(d, o) ? 1 : highlight_trans;
      });
      link1.style("opacity", function(o) {
        return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
      });   
    }
  }

  function exit_highlight() {
    highlight_node = null;
    if (focus_node===null) {
      fig1.style("cursor","move");
      if (isHighlight === 1) {
        isHighlight = 0;
        link1.style("stroke", function(o) {
          return (isNumber(o.group) && o.group>=0) ? color(o.group) : default_link_color;});
      }
    }
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  } 
});

