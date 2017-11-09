var input = document.createElement("input");
input.setAttribute('id', 'currentTime');

var subtitleText = document.createElement("div");
subtitleText.setAttribute('id', 'subtitleText');
subtitleText.setAttribute('class','player-container-text');

var containerSubtitleText = document.createElement("div");
containerSubtitleText.setAttribute('id', 'containerSubtitleText');
containerSubtitleText.setAttribute('class','player-container-container-text');

containerSubtitleText.appendChild(subtitleText);

document.getElementById('body-container').appendChild(input);
document.getElementById('movie_player').appendChild(containerSubtitleText);

setInterval(function() {

	document.getElementById("currentTime").setAttribute('value', document.getElementById("movie_player").getCurrentTime());
	
}, 100);
