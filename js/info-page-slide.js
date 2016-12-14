/********** Page Slide Animation *************/

// Slides page down
function info_page_slide() {
    $('html,body').animate({
        scrollTop: $(".data").offset().top -80}, 'slow');
}

// shows and hides the button
$(window).scroll(function() {
    var height = $(window).scrollTop();

    if (height <= 20) {
    	$(".see-more-button").removeClass("hidden");
    } else if (height >= 30) {
    	$(".see-more-button").addClass("hidden");
    }
});