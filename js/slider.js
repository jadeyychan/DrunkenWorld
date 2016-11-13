// Initialize slider
var slider = d3.slider()
				.min(1960)
				.max(2015)
				.tickValues(d3.range(1960, 2016, 10))
				.stepValues(d3.range(1960, 2016, 1))
				.showRange(true)
				.value(2015);


// Render the slider in the div
d3.select('.slider').call(slider);
