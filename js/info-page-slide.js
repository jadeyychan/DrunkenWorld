/********** Page Slide Animation *************/

// Slides page down
function info_page_slide() {
    $('html,body').animate({
        scrollTop: $(".data").offset().top -80}, 'slow');
}

// shows and hides the button
$(window).scroll(function() {
    var height = $(window).scrollTop();

    if (height < $('.info-content').height() - $(window).height()) {
    	$(".see-more-button").fadeIn();
    } else {
    	$(".see-more-button").fadeOut()
    }
});