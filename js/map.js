/********************/
/* helper functions */
/********************/
function get_consumption(country, alc_types, year) {
    var consumption_sum = 0;
    for (var i = 0; i < alc_types.length; i++) {
        consumption_type = consumption[country][alc_types[i]][String(year)];
        consumption_sum += parseFloat(consumption_type != null ? consumption_type : 0);
    }
    return consumption_sum;
}

function set_country_color(d, year) {
    var country   = country_ids[String(d.id)];
    if (consumption[country] && get_consumption(country, alc_types, year)) {
        return colorScale(get_consumption(country, alc_types, year));
    } else {
        return "grey";
    }
}

function set_tooltip(d, year) {
    var country = country_ids[String(d.id)];
    tooltip.transition()        
        .duration(200)      
        .style("opacity", .9);
    if (consumption[country]) {    
        tooltip.html(country + "<br />Alcohol: " + get_consumption(country, alc_types, year).toFixed(2) + " liters in " + year) 
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
    } else {
        tooltip.html(country + "<br />Alcohol: N/A")  
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
    }
}

function disable_tooltip() {
    tooltip.transition()        
        .duration(500)      
        .style("opacity", 0); 
}

/************************/
/* initialize variables */
/************************/
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

var alc_types = ["Wine", "Beer", "Spirits"];

$('.check').on("change", function() {
    var check = $(this).attr('checked', this.checked);
    if (check[0].checked) {
        alc_types.push(this.value);
    }
    else {
        var index = alc_types.indexOf(this.value);
        alc_types.splice(index, 1);
    }
    console.log(alc_types);
    year = String(self.slider.value());
    svg.selectAll(".country")
            .style("fill", function(d) { return set_country_color(d, year); })
            .on("mouseover", function(d) { set_tooltip(d, year); })                 
            .on("mouseout", function(d)  { disable_tooltip(); });
})


init_year = 1990;

/*****************/
/* build the map */
/*****************/
svg = d3.select("body").append("svg")
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
        .style("fill", function(d) { return set_country_color(d, init_year); })
        .on("mouseover", function(d) { set_tooltip(d, init_year); })                 
        .on("mouseout", function(d)  { disable_tooltip(); });

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