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

function pull_annual_data_split(country, alc_type) {
    var annual_data = [ ];
    for (var year = min_year; year < max_year; year++) {
        var year_data = 0;
        if (consumption[country] && consumption[country][alc_type][String(year)]) {
            year_data += parseFloat(consumption[country][alc_type][String(year)]);
        }

        if (year_data > 0) annual_data.push({"year": year, "value": year_data});
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
    	$(".sidebar").append("<div class='sidebar_item' id='side"+d.id+"'>"+
                                "<p class='sidebar_x'></p>"+
                                "<p class='sidebar_country'>" + country_ids[d.id] + "</p>"+
                                "</div>");

        var linewidth  = 190;
        var lineheight = 120;

        var linesvg = d3.select("#side" + d.id).append("svg")
            .attr("width", linewidth + 50)
            .attr("height", lineheight + 25);

        var lineg = linesvg.append("g");
        var x = d3.scale.linear().range([0, linewidth]);
        var y = d3.scale.pow().exponent(.4).range([lineheight, 0]);
        var line = d3.svg.line().x(function(d) { return x(d.year);  })
                                .y(function(d) { return y(d.value); });

        x.domain([min_year, max_year]);
        y.domain([0, 30]);
        var xAxis = d3.svg.axis()
            .scale(x)
            .tickValues([1970, 1985, 2000])
            .tickFormat(function(d) { return String(d); })
            .innerTickSize(1)
            .outerTickSize(1)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickValues([1,4,10,20])
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
              .attr("transform", "translate(-40,17) rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .style("font-size","12px")
              .text("Consumption (L)");

        linesvg.selectAll(".tick > text")
            .style("font-size", "12px");

        var da = pull_annual_data(country_ids[d.id]);
        var dw = pull_annual_data_split(country_ids[d.id], "Wine");
        var db = pull_annual_data_split(country_ids[d.id], "Beer");
        var ds = pull_annual_data_split(country_ids[d.id], "Spirits");

        linesvg.append("path")
            .datum(dw)
            .attr("class", "line")
            .attr("id", "wine")
            .attr("d", line)
            .attr("transform", "translate(39,0)")
            .style("stroke", colorScale_Wine(20));

        linesvg.append("path")
            .datum(db)
            .attr("class", "line")
            .attr("id", "beer")
            .attr("d", line)
            .attr("transform", "translate(39,0)")
            .style("stroke", colorScale_Beer(20));

        linesvg.append("path")
            .datum(ds)
            .attr("class", "line")
            .attr("id", "spirits")
            .attr("d", line)
            .attr("transform", "translate(39,0)")
            .style("stroke", colorScale_Spirits(20));

        linesvg.append("path")
            .datum(da)
            .attr("class", "line")
            .attr("id", "all")
            .attr("d", line)
            .attr("transform", "translate(39,0)")
            .style("stroke", "#1F5673")
            .style("stroke-width", 0);

        if (alc_types.indexOf("Wine") == -1) {
            linesvg.select(".line#wine").style("stroke-width", 0);
        }

        if (alc_types.indexOf("Beer") == -1) {
            linesvg.select(".line#beer").style("stroke-width", 0);
        }

        if (alc_types.indexOf("Spirits") == -1) {
            linesvg.select(".line#spirits").style("stroke-width", 0);
        }

        linesvg.on("click", function() {
            var country = country_ids[d.id];
            var linesvg = d3.select("#side" + d.id + " svg");

            var da = pull_annual_data(country);
            var dw = pull_annual_data_split(country, "Wine");
            var db = pull_annual_data_split(country, "Beer");
            var ds = pull_annual_data_split(country, "Spirits");

            if (linesvg.select(".line#all").style("stroke-width") == "0px") {
                linesvg.select(".line#wine").transition(500)
                    .attr("d", line(da));
                linesvg.select(".line#beer").transition(500)
                    .attr("d", line(da));
                linesvg.select(".line#spirits").transition(500)
                    .attr("d", line(da))

                linesvg.select(".line#all").transition().delay(500)
                    .style("stroke-width", "1.5px");
            } else {
                linesvg.select(".line#wine").transition(500)
                    .attr("d", line(dw))
                    .style("stroke-width", (alc_types.indexOf("Wine") != -1 ? "1.5px" : "0px"));

                linesvg.select(".line#beer").transition(500)
                    .attr("d", line(db))
                    .style("stroke-width", (alc_types.indexOf("Beer") != -1 ? "1.5px" : "0px"));

                linesvg.select(".line#spirits").transition(500)
                    .attr("d", line(ds))
                    .style("stroke-width", (alc_types.indexOf("Spirits") != -1 ? "1.5px" : "0px"));

                linesvg.select(".line#all").transition()
                    .style("stroke-width", "0px");
            }
        });
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
    var y = d3.scale.pow().exponent(.4).range([lineheight, 0]);
    var line = d3.svg.line().x(function(d) { return x(d.year);  })
                            .y(function(d) { return y(d.value); });

    x.domain([min_year, max_year]);
    y.domain([0, 30]);

    var linesvg = d3.select("#side" + id + " svg");

    var da = pull_annual_data(country_ids[id]);
    var dw = pull_annual_data_split(country_ids[id], "Wine");
    var db = pull_annual_data_split(country_ids[id], "Beer");
    var ds = pull_annual_data_split(country_ids[id], "Spirits");

    linesvg.select(".line#all").attr("d", line(da));

    if (alc_types.indexOf("Wine") != -1 && linesvg.select(".line#all").style("stroke-width") == "0px") {
        linesvg.select(".line#wine").transition(500).style("stroke-width", "1.5px");
    } else {
        linesvg.select(".line#wine").transition(500).style("stroke-width", 0);
    }

    if (alc_types.indexOf("Beer") != -1 && linesvg.select(".line#all").style("stroke-width") == "0px") {
        linesvg.select(".line#beer").transition(500).style("stroke-width", "1.5px");
    } else {
        linesvg.select(".line#beer").transition(500).style("stroke-width", 0);
    }

    if (alc_types.indexOf("Spirits") != -1 && linesvg.select(".line#all").style("stroke-width") == "0px") {
        linesvg.select(".line#spirits").transition(500).style("stroke-width", "1.5px");
    } else {
        linesvg.select(".line#spirits").transition(500).style("stroke-width", 0);
    }
}

function sidebar_remove(d) {
    /* Removing sidebar item */
	$("#side" + d.id + " .sidebar_x").click(function() {
		$("#side"+d.id).remove();
        d3.select('.country#c' + d.id).style("stroke", "none");

        if ($(".sidebar_item").length == 0) {
            $('#sidebar_instruction').css('display', 'inherit');
            hide_sidebar();
        }
	});
}

function sidebar_clear() {
    var items = $(".sidebar_item");
    for (var i = 0; i < items.length; i++) {
        var cid = $(items[i]).attr("id").replace("side","");
        d3.select('.country#c' + cid).style("stroke", "none");
        $(items[i]).remove();
    }
    $('#sidebar_instruction').css('display','inherit')
}

$('.dropdown-btn').click(function() {
    show_sidebar();
});
