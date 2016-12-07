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
    if (alc_types == "Wine") {
        if (consumption[country] && get_consumption(country, alc_types, year)) {
            return colorScale_Wine(get_consumption(country, alc_types, year));
        } else {
            return "#DEDEE0";
        }
    }
    else if (alc_types == "Beer") {
        if (consumption[country] && get_consumption(country, alc_types, year)) {
            return colorScale_Beer(get_consumption(country, alc_types, year));
        } else {
            return "#DEDEE0";
        }
    }
    else if (alc_types == "Spirits") {
        if (consumption[country] && get_consumption(country, alc_types, year)) {
            return colorScale_Spirits(get_consumption(country, alc_types, year));
        } else {
            return "#DEDEE0";
        }
    }
    else if (alc_types.indexOf("Wine") != -1 && alc_types.indexOf("Spirits") != -1 && alc_types.indexOf("Beer") == -1 ) {
        if (consumption[country] && get_consumption(country, alc_types, year)) {
            return colorScale_WS(get_consumption(country, alc_types, year));
        } else {
            return "#DEDEE0";
        }
    }
    else if (alc_types.indexOf("Beer") != -1 && alc_types.indexOf("Spirits") != -1 && alc_types.indexOf("Wine") == -1 ) {
        if (consumption[country] && get_consumption(country, alc_types, year)) {
            return colorScale_BS(get_consumption(country, alc_types, year));
        } else {
            return "#DEDEE0";
        }
    }
    else if (alc_types.indexOf("Beer") != -1 && alc_types.indexOf("Wine") != -1 && alc_types.indexOf("Spirits") == -1 ) {
        if (consumption[country] && get_consumption(country, alc_types, year)) {
            return colorScale_BW(get_consumption(country, alc_types, year));
        } else {
            return "#DEDEE0";
        }
    }
    else {
        if (consumption[country] && get_consumption(country, alc_types, year)) {
            return colorScale_All(get_consumption(country, alc_types, year));
        } else {
            return "#DEDEE0";
        }
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
        pretty_alcs = alc_types[0];
        for (i = 1; i < alc_types.length; i++) {
            pretty_alcs = pretty_alcs + ", " + alc_types[i];
        }
        if (pretty_alcs == undefined) {
            pretty_alcs = "N/A";
        }
        tooltip.html("<span class='tooltip-firstline'>" +country + " (" + year + ")" +"</span>"+ "<br />" + pretty_alcs + ": " + get_consumption(country, alc_types, year).toFixed(2) + " liters") 
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

/************************/
/*      Map Colors      */
/************************/
var colorScale_Wine = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#960000"]);

var colorScale_Beer = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#B75800"]);

var colorScale_Spirits = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#4B7796"]);

var colorScale_WS = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#702764"]);

var colorScale_BS = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#416844"]);

var colorScale_BW = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#CC480C"]);

var colorScale_All = d3.scale.pow().exponent(.2)
    .domain([0, 30])
    .range(["white", "#034F49"]);

var projection = d3.geo.equirectangular()
    .translate([width / 2, height / 2])
    .scale(width / 2 / Math.PI);

var path = d3.geo.path()
    .projection(projection);

init_year  = 1990;

function search_bar () {
    
    /* Formatting data */
    searchbar_data = []; 
    Object.keys(country_ids).map(function(d) {
                                    searchbar_data.push({id: d, text: country_ids[d]});
                                });
    
    /* Appending to div */
    $(".searchbar").select2({
        data: searchbar_data,
    });

    $(".searchbar").on("select2:select", function (e) { 
                                            var year = 1990;
                                            var d = e.params.data;
                                            selected_country(d);
                                        });

}

function init_map() {
    width  = $(window).width() * 0.85,
    height = width / 2.073164161;

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
        year = String(self.slider.value());
        svg.selectAll(".country")
                .style("fill", function(d) { return set_country_color(d, year); })
                .on("mouseover", function(d) { set_tooltip(d, year); })                 
                .on("mouseout", function(d)  { disable_tooltip(); });

        update_sidebar();
    });

    /*****************/
    /* build the map */
    /*****************/

    // zoom code
    zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    svg = d3.select(".map-container").append("svg")
        .attr("id", "svg-map")
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
    tooltip = d3.select(".map-container").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    g = svg.append("g")
               .attr("id", "map");

    d3.json("data/map/world-110m.json", function(error, world) {
        if (error) throw error;

        var countries = topojson.feature(world, world.objects.countries).features,
            neighbors = topojson.neighbors(world.objects.countries.geometries);

        g.selectAll(".country")
            .data(countries)
            .enter().insert("path", ".graticule")
            .attr("class", "country")
            .attr("id", function(d) { return 'c' + d.id})
            .attr("d", path)
            .style("fill", function(d)   { return set_country_color(d, init_year); })
            .on("mouseover", function(d) { set_tooltip(d, init_year); })                 
            .on("mouseout", function(d)  { disable_tooltip(); })
            .on("click", function(d)     { selected_country(d); });

        g.insert("path", ".graticule")
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
            .attr("class", "boundary")
            .attr("d", path)
            .style("stroke", "none");
    });

    d3.select(self.frameElement).style("height", height + "px");
}

function selected_country(d) {

    if ($('.sidebar_item#side' + d.id).length == 0) {
        sidebar(d, init_year); 
        d3.select("#c"+d.id).style("stroke", "orange")
                       .style("stroke-width", 2);
    } else {
        $("#side"+d.id).remove();
        d3.select('.country#c' + d.id).style("stroke", "none");
    }

    if ($('.sidebar').css('display') == 'none' && $('.sidebar_item').length > 0) {
        $('#sidebar_instruction').css('display','none');
        $(".sidebar").toggle("slide");
        $(".select2-selection").css("width", "130px");
        $('.viz-page').animate({'margin-left': '0'}, 500);
    }

    if ($('.sidebar_item').length > 0 && $('#sidebar_instruction').css('display') != 'none') {
        $('#sidebar_instruction').css('display', 'none');
    }

    if ($('.sidebar_item').length == 0) {
        $('#sidebar_instruction').css('display','inherit')
        $(".sidebar").toggle("slide");
        $('.viz-page').animate({'margin-left': '7.5%'}, 500);
        $(".select2-selection").css("width", "200px");
    }
}

function zoomed() {
    var t = d3.event.translate,
        s = d3.event.scale;

    t[0] = Math.min(0, Math.max(width - width * s, t[0]));
    t[1] = Math.min(0, Math.max(height - height * s, t[1]));

    zoom.translate(t);

    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
}
