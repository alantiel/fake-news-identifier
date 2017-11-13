var localStorage = require('localStorage')

const validationEvidence = function(url){

	const host = url.split('/')[2]

	let rate = parseInt(localStorage.getItem('count' + host))

	console.log("evidence: ", rate);

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

