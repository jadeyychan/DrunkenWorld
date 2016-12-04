var CURRENT_PAGE = "landing-page";

function show_viz() {
	$(".viz-page").removeClass("hidden");
	$(".landing-page").slideUp("slow");
	CURRENT_PAGE = "viz-page";
}

function show_landing_page() {
	$(".landing-page").slideDown("slow");
	CURRENT_PAGE = "landing-page";
}

function show_help() {
	if ($(".info-page").hasClass("hidden")) {

		/* show_info_page */
		$(".info-page").removeClass("hidden");
		$("."+CURRENT_PAGE).slideUp("slow");

		/* Buttons */
		$(".x-button").removeClass("hidden");
		$(".i-button").addClass("hidden");

		// remove z- index
		$(".info-page").css("z-index", "0");

	} else {

		$("."+CURRENT_PAGE).slideDown("slow", function() {
			$(".info-page").addClass("hidden");
		});

		// current page remove hidden
		$("."+CURRENT_PAGE).removeClass("hidden");

		/* Buttons */
		$(".x-button").addClass("hidden");
		$(".i-button").removeClass("hidden");
	}
}


/*
landing page 5

info!

viz page

info

*/