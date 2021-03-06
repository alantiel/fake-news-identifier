var kittenGenerator = {

	newsAPI: 'http://localhost:3000/rest/news?url=',

	request: function(id) {
		
		var req = new XMLHttpRequest();
		req.open("GET", this.newsAPI + id, true);
		req.onload = this.showScore.bind(this);
		req.send(null);
	},

	showScore: function(e) {
		var json = JSON.parse(e.target.responseText);
		var score = json.score;
		if (score === 0) {
			$('#main-url').empty();
			$('#main-url').append('<p>Sorry, we couldn\'t analyze this page.</p> <span style="font-size: 0.8em"> Please, try again later.</span>');
		} else if (score > 30) {
			$('#main-url').empty();
			$('#main-url').append('<span>Probability of being fake: ' + score + '%</span>');
			$('#feedback-buttons-fake').removeAttr('hidden');
			$('#fake-graph-bar').removeAttr('hidden');
			$('#progress-bar').css({ 'width': score + '%' });
			$('#progress-bar').attr('aria-valuenow', score);
			$('#fake-value').text(score + '%');
			$('#more-info-fake').removeAttr('hidden');
		} else {
			$('#main-url').empty();
			$('#main-url').append('<span>Article verified <img src="/verified.png" width="20" height="20" title="Verified"></span>');
			$('#feedback-buttons-real').removeAttr('hidden');
			$('#more-info-real').removeAttr('hidden');
		}
	}
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function() {
	getUrl(function(tab) {
		var newsUrl = tab.url;
		kittenGenerator.request(newsUrl);
	});
});

function getUrl(method) {
	chrome.tabs.getSelected(null, method);
}
