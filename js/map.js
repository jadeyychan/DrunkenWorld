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
    var country = country_ids[String(d.id)];
    if (consumption[country] && get_consumption(country, alc_types, year)) {
        return colorScale(get_consumption(country, alc_types, year));
    } else {
        return "#b5b5b5";
    }
}

function set_tooltip(d, year) {
    // skip countries that cannot be distinguished
    if (String(d.id) == "-99") return;

    var country = country_ids[String(d.id)];
    tooltip.transition()        
        .duration(200)      
        .style("opacity", .9);
    if (consumption[country]) {    
        tooltip.html(country + "<br />" + get_consumption(country, alc_types, year).toFixed(2) + " liters in " + year) 
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 28) + "px");
    } else {
        tooltip.html(country + "<br />N/A")  
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
    height = width / 2.073164161;

var colorScale = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#920099"]);

var projection = d3.geo.equirectangular()
    .translate([width / 2, height / 2])
    .scale(width / 2 / Math.PI);

var path = d3.geo.path()
    .projection(projection);

alc_types = ["Wine", "Beer", "Spirits"];

$('.check').on("change", function() {
    var check = $(this).attr('checked', this.checked);
    var id = this.value;
    if (check[0].checked) {    
        alc_types.push(this.value);
        var spirits_div = $("#"+id);
        $("#"+id).addClass("icon-enabled");
    }
    else {
        var index = alc_types.indexOf(this.value);
        alc_types.splice(index, 1);
        
        $("#"+id).removeClass("icon-enabled");
    }
    console.log(alc_types);
    year = String(self.slider.value());
    svg.selectAll(".country")
            .style("fill", function(d) { return set_country_color(d, year); })
            .on("mouseover", function(d) { set_tooltip(d, year); })                 
            .on("mouseout", function(d)  { disable_tooltip(); });
});

init_year = 1990;

/*****************/
/* build the map */
/*****************/

// zoom code
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

svg = d3.select(".main-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

// Define the div for the tooltip
var tooltip = d3.select(".main-container").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

var g = svg.append("g")
           .attr("id", "map");

d3.json("data/map/world-110m.json", function(error, world) {
    if (error) throw error;

    var countries = topojson.feature(world, world.objects.countries).features,
        neighbors = topojson.neighbors(world.objects.countries.geometries);

    g.selectAll(".country")
        .data(countries)
        .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", path)
        .style("fill", function(d)   { return set_country_color(d, init_year); })
        .on("mouseover", function(d) { set_tooltip(d, init_year); })                 
        .on("mouseout", function(d)  { disable_tooltip(); })
        .on("click", function(d)     { sidebar(d, init_year); });

    g.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

function zoomed() {
    var t = d3.event.translate,
        s = d3.event.scale;

    t[0] = Math.min(0, Math.max(width - width * s, t[0]));
    t[1] = Math.min(0, Math.max(height - height * s, t[1]));

    zoom.translate(t);

    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}
