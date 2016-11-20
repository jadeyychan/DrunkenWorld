var min_year = 1960;
var max_year = 2012;

// Initialize slider
var slider = d3.slider()
	.min(min_year)
	.max(max_year)
	.tickValues(d3.range(min_year, max_year, 10))
	.stepValues(d3.range(min_year, max_year + 1, 1))
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

// Animate button
$('.slider-button').click(function() {
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