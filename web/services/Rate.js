const localStorage = require('localStorage')

const update = function(point, url){

	let rate = parseInt(localStorage.getItem('count' + req.query.url))

	if(isNaN(rate) || rate == 0) {
	    localStorage.setItem('count' + req.query.url, 1);
	}
	else {
       	localStorage.setItem('count' + req.query.url, rate + parseInt(req.query.point));
    }

	console.log("new count: ", localStorage.getItem('count' + req.query.url));
};

module.exports = {
	update: update
}

