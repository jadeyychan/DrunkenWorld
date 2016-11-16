var min_year = 1960;
var max_year = 2016;
var default_year = 1990;

// Initialize slider
var slider = d3.slider()
				.min(min_year)
				.max(max_year)
				.tickValues(d3.range(min_year, max_year, 10))
				.stepValues(d3.range(min_year, max_year, 1))
				.showRange(true)
				.value(default_year)
                .tickFormat(d3.format("d"))
                .callback(function(event) {
                    year = String(self.slider.value());
                    svg.selectAll(".country")
                       .style("fill", function(d) {
                            var country = country_ids[String(d.id)];
                            if (consumption[country] && consumption[country]["Wine"][year]) {
                                return colorScale(consumption[country]["Wine"][year]);
                            } else {
                                return "grey";
                            }
                    });
                });

// Render the slider in the div
d3.select('.slider').call(slider);


// Animate button
$('.slider-button').click(
    function() {
        time_travel(min_year);
    });

function time_travel(pos) {
    setTimeout(function() {
        slider.setValue(pos);
        if (pos < max_year) {
            time_travel(++pos);
       }
   }, 80);
}