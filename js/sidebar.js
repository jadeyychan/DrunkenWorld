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
        if (year_sum > 0) annual_data.push({"year": year, "value": year_sum});
    }
    return annual_data;
}

function sidebar(d, year) {
    country = country_ids[String(d.id)];
    sidebar_append(d, year);
    sidebar_remove(d);
}

function sidebar_append(d, year) {
    if(!$("#side"+d.id).length) { // country is not already selected
        console.log(d.id);

    	$(".sidebar").append("<div class='sidebar_item' id='side"+d.id+"'>" + country + "</div>");

        var linewidth  = 190;
        var lineheight = 120;

        var linesvg = d3.select("#side" + d.id).append("svg")
            .attr("width", linewidth + 50)
            .attr("height", lineheight + 50);

        var lineg = linesvg.append("g");

        var x = d3.scale.linear().range([0, linewidth]);
        var y = d3.scale.pow().exponent(.5).range([lineheight, 0]);
        var line = d3.svg.line().x(function(d) { return x(d.year);  })
                                .y(function(d) { return y(d.value); });

        var ds = pull_annual_data(country);

        x.domain([min_year, max_year]);
        y.domain([0, 35]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickValues([1970, 1985, 2000])
            .tickFormat(function(d) { return String(d); })
            .innerTickSize(1)
            .outerTickSize(1)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickValues([1,5,12,20,30])
            .innerTickSize(1)
            .outerTickSize(1)
            .orient("left");

        linesvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(39,"+ lineheight + ")")
            .call(xAxis);

        linesvg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(40,0)")
              .call(yAxis)
            .append("text")
              .attr("transform", "translate(-42,18) rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .style("font-size","12px")
              .text("Consumption (L)");

        linesvg.selectAll(".tick > text")
            .style("font-size", "12px");

        linesvg.append("path")
            .datum(ds)
            .attr("class", "line")
            .attr("d", line)
            .attr("transform", "translate(39,0)");
    };
}

function update_sidebar() {
    var items = $(".sidebar_item");
    for (var i = 0; i < items.length; i++) {
        var cid = $(items[i]).attr("id").replace("side","");
        update_data(cid);
    }
}

function update_data(id) {
    var linewidth  = 190;
    var lineheight = 120;

    var x = d3.scale.linear().range([0, linewidth]);
    var y = d3.scale.pow().exponent(.5).range([lineheight, 0]);
    var line = d3.svg.line().x(function(d) { return x(d.year);  })
                            .y(function(d) { return y(d.value); });

    x.domain([min_year, max_year]);
    y.domain([0, 35]);

    var nsvg = d3.select("#side" + id + " .line");
    var ds = pull_annual_data(country_ids[id]);
    nsvg.transition().attr("d", line(ds))
}

function sidebar_remove(d) {
    /* Removing sidebar item */
	$("#side"+d.id).click(function() {
		$("#side"+d.id).remove();
        d3.select('.country#c' + d.id).style("stroke", "none");
	});
}

function sidebar_clear() {
    var items = $(".sidebar_item");
    for (var i = 0; i < items.length; i++) {
        var cid = $(items[i]).attr("id").replace("side","");
        d3.select('.country#c' + cid).style("stroke", "none");
        $(items[i]).remove();
    }
}
