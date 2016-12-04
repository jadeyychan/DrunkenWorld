function show_landing_page() {
	$(".landing-page").slideDown("slow", function() {
		$(".viz-page").addClass("hidden");
		$(".info-page").addClass("hidden");
	});
}

function show_viz() {
	$(".viz-page").removeClass("hidden");
	$(".landing-page").slideUp("slow");
}

function show_help() {
	$(".info-page").removeClass("hidden");
	$(".landing-page").slideUp("slow");
}