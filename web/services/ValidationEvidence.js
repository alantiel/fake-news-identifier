const localStorage = require('localStorage')

const validationEvidence = function(url){

	let rate = parseInt(localStorage.getItem('count' + url))

	if(isNaN(rate) || rate == 0) {
	    return {pass: 'unknown'};
	}
	else {
        return {pass:rate > 0};
    }
};

module.exports = {
	validate: validationEvidence
}

