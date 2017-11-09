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
		$('#main-url').empty();
		$('#main-url').append('<p>Taxa fake: ' + score + '%</p>');
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