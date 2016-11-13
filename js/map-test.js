var width  = $(window).width() * 0.8,
    height = $(window).height() * 0.8,
    scale0 = (width - 1) / 2 / Math.PI;

var colorScale = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#920099"]);

var quantize = d3.scale.quantile()
    .domain([0, 4])
    .range(d3.range(9).map(function(i) { return "country-" + i; }));

var projection = d3.geo.equirectangular()
    .scale(160)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

// Define the div for the tooltip
var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

d3.json("data/map/world-110m.json", function(error, world) {
    if (error) throw error;

    var countries = topojson.feature(world, world.objects.countries).features,
        neighbors = topojson.neighbors(world.objects.countries.geometries);

    svg.selectAll(".country")
        .data(countries)
        .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", path)
        .style("fill", function(d) {
            var country = country_ids[String(d.id)];
            if (consumption[country] && consumption[country]["Wine"]["2010"]) {
                return colorScale(consumption[country]["Wine"]["2010"]);
            } else {
                return "grey";
            }
        })
        .on("mouseover", function(d) {  
            var country     = country_ids[String(d.id)];
            var co =  
            console.log(d.id, country);

            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);
            if (consumption[country]) {    
                tooltip.html(country + "<br />Wine: " + consumption[country]["Wine"]["2010"] + " liters in 2010")  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");
            } else {
                tooltip.html(country + "<br />Wine: N/A")  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");
            }
            })                 
        .on("mouseout", function(d) {       
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

// zoom code
var zoom = d3.behavior.zoom()
    .translate([width / 2, height / 2])
    .scale(scale0)
    .scaleExtent([scale0, 8 * scale0])
    .on("zoom", zoomed);

svg
    .call(zoom)
    .call(zoom.event);

function zoomed() {
  projection
      .translate(zoom.translate())
      .scale(zoom.scale());

  svg.selectAll("path")
      .attr("d", path);
}