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

/********** Embedded Youtube Video *************/

// create youtube player
var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('info-video-player', {
      height: '315',
      width: '560',
      videoId: 'O-eeiWZ7WRY',
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
}

// when video ends
function onPlayerStateChange(event) {        
    if(event.data === 0) {          
        info_page_slide();
    }
}