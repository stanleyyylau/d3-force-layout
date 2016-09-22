var w = 1000;
var h = 800;
var dataset = {};


d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', function(err, data) {
    if (err) return err;
    dataset = data;
    forceIt();
})

function forceIt() {
    var container = d3.select('.container');
    var forceOpt = {
        nodes: dataset.nodes,
        edges: dataset.links,
        size: [w, h],
        dis: [50],
        charge: [-100]
    }
    var force = createForce(forceOpt);
    var imgNode = appendImgNodeToIt(container, dataset.nodes).call(force.drag);
    var svg = appendSvgToIt(container, w, h);
    var edges = appendSvgLineToIt(svg, dataset.links);

    edges.style("stroke", "#ccc").style("stroke-width", 1);
    console.log(imgNode);
    force.on("tick", function() {

        edges.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        imgNode.style('left', function(d) {
            return d.x + 'px';
        });
        imgNode.style('top', function(d) {
            return d.y + 'px';
        });

    });

    // Show country name when mouseover
    imgNode.on('mouseover', function(d){
      var container = d3.select('.show-name');
      container.style('display', 'inline-block');
      container.text(d.country)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
    }).on('mouseout', function(d){
      var container = d3.select('.show-name');
      container.style('display', 'none');
    })
}



// Utility functions, I use the functional programing style to tackle this issue
// Below are functions that you pass value to it and return to you
// The main part is still the d3.json which gets the data and run forceIt on that dataset
function appendSvgToIt(obj, w, h) {
    return obj.append('svg').attr('width', w).attr('height', h);
}

function createForce(opt) {
    /*
    The object will look like this
    opt = {
      nodes: [],
      edges: [],
      size: [w, h],
      dis: [50], // Default value
      charge: [-100], // Default value
    }
    */
    return d3.layout.force().nodes(opt.nodes)
        .links(opt.edges)
        .size(opt.size)
        .linkDistance(opt.dis) // <-- New!
        .charge(opt.charge) // <-- New!
        .start();
}

function appendSvgLineToIt(obj, lineData) {
    return obj.selectAll('line').data(lineData).enter().append('line');
}

function appendImgNodeToIt(obj, nodeData) {
    return obj.append('div').attr('class', 'img-node').selectAll('img').data(nodeData).enter().append('img')
        .attr('class', function(d) {
            return "flag flag-" + d.code;
        });
}
