var CURRENT_PAGE = "landing-page";

function show_visit() {
	CURRENT_PAGE = "main-container";

	if ($(".main-container").hasClass("hidden")) {
		$(".main-container").removeClass("hidden");
	}
	$(".landing-page").slideUp("slow");
}

function show_landing_page() {
	CURRENT_PAGE = "landing-page";
	$(".landing-page").slideDown("slow");
}

function show_help() {
	if ($(".info-page").hasClass("hidden")) {

		$("."+CURRENT_PAGE).slideUp("slow");

		$(".info-page").removeClass("hidden");
		
		/* Buttons */
		$(".x-button").removeClass("hidden");
		$(".i-button").addClass("hidden");

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
