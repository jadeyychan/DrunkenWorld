// Initialize slider
var slider = d3.slider()
				.min(1961)
				.max(2011)
				.tickValues(d3.range(1960, 2014, 10))
				.stepValues(d3.range(1960, 2014, 1))
				.showRange(true)
				.value(1990)
                .tickFormat(d3.format("d"))
                .callback(function(event) {
                    year = String(self.slider.value());
                    svg.selectAll(".country")
                       .style("fill", function(d) {
                            var country = country_ids[String(d.id)];
                            if (consumption[country] && consumption[country]["All types"][year]) {
                                return colorScale(consumption[country]["All types"][year]);
                            } else {
                                return "grey";
                            }
                    });
                });


// Render the slider in the div
d3.select('.slider').call(slider);
