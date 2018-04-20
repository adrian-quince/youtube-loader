aq_yt_loader = { 
	options: {
		url: "https://www.google.com/",
		timeout: 5000
	},
	loadAPI: function () {
		// Load the API
		tag = document.createElement('script');
		tag.src = aq_yt_loader.options.url;
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		// Show fallback if timed out
		setTimeout(function() {
			if (!aq_yt_loader.ytLoaded) aq_yt_loader.showFallback()
		}, aq_yt_loader.options.timeout)
	},
	loadPlayers: function () {
		var playerDivs = document.querySelectorAll(".aq-yt-player"); // get .player nodes
		var playerDivsArr = [].slice.call(playerDivs); // nodelist to array to use forEach();
		var players = new Array(playerDivsArr.length);

		playerDivsArr.forEach(function(e, i) { 
			players[i] = new YT.Player(e.id, {
				height: $("#" + e.id).height(),
				width: $("#" + e.id).width(),
				videoId: e.id,
				events: { 
					'onReady': aq_yt_loader.onPlayerReady
				}
			})
		})
	},
	onPlayerReady: function (event) {
		$(".aq-yt-loading").hide();
		$("#" + event.target.a.id).css("display", "block");

		// for Progressive div, animate the show of the div.
		setTimeout(function() {
			if ($("#" + event.target.a.id).parent().attr("class") === "aq-yt-cont-progressive") {
				if (navigator.maxTouchPoints || 'ontouchstart' in document.documentElement) // detect mobile device
					$("#" + event.target.a.id).parent().show().transition({height: 'auto'}, 500);
				else
					$("#" + event.target.a.id).parent().show().transition({height: $("#" + event.target.a.id).parent()[0].scrollHeight + "px"}, 500);
			}
		}, 30)
	},
	showFallback: function () {
		$(".aq-yt-loading").hide();
		$(".aq-yt-fallback").show();
	},
	sizeContainers: function () {
		if($(".aq-yt-player").length > 0) {
			// Set container sizes
			$(".aq-yt-cont-fallback").each(function() {
				var h = $(this).find(".aq-yt-player").first().height();
				var w = $(this).find(".aq-yt-player").first().width();
				$(this).find(".aq-yt-loading").width(w).height(h);
				$(this).find(".aq-yt-fallback").width(w).height(h);
				$(this).width(w + 2).height($(this)[0].scrollHeight);
			})

			$(".aq-yt-cont-progressive").each(function() {
				var w = $(this).find(".aq-yt-player").first().width();
				$(this).width(w + 2).height(0);
				$(this).find(".aq-yt-loading").hide();
				$(this).find(".aq-yt-fallback").hide();
			})
		}
	},
	ytLoaded: false
} 

onYouTubeIframeAPIReady = function() {
	aq_yt_loader.ytLoaded = true;
	aq_yt_loader.loadPlayers();
}

if (!$.support.transition)
    $.fn.transition = $.fn.animate; 

aq_yt_loader.loadAPI();

$(document).ready(function () {
	aq_yt_loader.sizeContainers();
})