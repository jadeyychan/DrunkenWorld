
function info_page_slide() {
    $('html,body').animate({
        scrollTop: $(".data").offset().top -80}, 'slow');
    $(".see-more-button").addClass("hidden");
}

$(window).scroll(function() {
    var height = $(window).scrollTop();

    if (height <= 20) {
    	$(".see-more-button").removeClass("hidden");
    } else if (height >= 30) {
    	$(".see-more-button").addClass("hidden");
    }
});