function pull_annual_data(country) {
    var annual_data = [ ];
    for (var year = min_year; year < max_year; year++) {
        var year_sum = 0;
        for (var i = 0; i < alc_types.length; i++) {
            if (consumption[country] && consumption[country][alc_types[i]][String(year)]) {
                year_sum += parseFloat(consumption[country][alc_types[i]][String(year)]);
            } else if (consumption[country]) {
                year_sum += 0;
            } else {
                return null;
            }
        }
        annual_data[year - min_year] = year_sum;
    }
    return annual_data;
}

function sidebar(d, year) {
    country = country_ids[String(d.id)];
    sidebar_append(d, year);
    sidebar_remove(d);
}

function sidebar_append(d, year) {
    var info;

    if (consumption[country]) { 
        info = country + " | " + get_consumption(country, alc_types, year).toFixed(2) + " liters in " + year; 
    } else {
        info = country + " | N/A";
    }

    if(!$("#side"+d.id).length) { // country is not already selected
    	$(".sidebar").append("<div class='sidebar_item' id='side"+d.id+"'>" + country + "</div>");

        var lineplot = d3.select("#side" + d.id).append("svg")
            .attr("width", 200)
            .attr("height", 150);

        var x = d3.time.scale().range([0, 200]);
        var y = d3.scale.linear().range([150, 0]);
        var line = d3.svg.line().x(function(d) { return x(d.year);  })
                                .y(function(d) { return y(d.value); });

        var ds = pull_annual_data(country).map(function(d,i) { return {"value": d, "year": 1960 + i}; });

        x.domain([min_year, max_year]);
        y.domain([0, 35]);

        lineplot.append("path").datum(ds).attr("class", "line").attr("d", line);
    };
}

function sidebar_remove(d) {
    /* Removing sidebar item */
	$("#side"+d.id).click(function() {
		$("#side"+d.id).remove();
	});
}

function sidebar_clear() {
	$(".sidebar_item").remove();
}
