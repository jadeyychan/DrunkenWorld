function onPlayerStateChange(event) {        
    if(event.data === 0) {          
        alert('done');
    }
}

function info_page_slide() {
    $('html,body').animate({
        scrollTop: $(".data").offset().top -80}, 'slow');
    $(".see-more-button").addClass("hidden");
}