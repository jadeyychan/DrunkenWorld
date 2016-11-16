// Initialize slider
var slider = d3.slider()
				.min(1961)
				.max(2011)
				.tickValues(d3.range(1960, 2014, 10))
				.stepValues(d3.range(1960, 2014, 1))
				.showRange(true)
				.value(init_year)
                .tickFormat(d3.format("d"))
                .callback(function(event) {
                    year = String(self.slider.value());
                    svg.selectAll(".country")
                        .style("fill", function(d) { return set_country_color(d, year); })
                        .on("mouseover", function(d) { set_tooltip(d, year); })                 
                        .on("mouseout", function(d)  { disable_tooltip(); });
                });

// Render the slider in the div
d3.select('.slider').call(slider);
