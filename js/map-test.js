var width = 1249,
    height = 600;

var color = d3.scale.category10();

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
        .style("fill", function(d, i) { 
            return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); })
        .on("mouseover", function(d) {  
            var country = country_ids[String(d.id)];    
            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);      
            tooltip.html(country + "<br />Wine: " + consumption[country]["Wine"]["2014"] + " liters in 2014")  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
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