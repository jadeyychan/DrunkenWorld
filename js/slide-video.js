$( document ).ready(function() {
	var video = document.getElementsByTagName('iframe')[0];

	video.onended = function(e) {
	  console.log("video: ", video);
	};
});
