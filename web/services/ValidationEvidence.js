const localStorage = require('localStorage')

const validationEvidence = function(url){

	let rate = parseInt(localStorage.getItem('count' + url))
	var variables = {rate: rate}
	if(isNaN(rate) || rate == 0) {
			return {pass: 'unknown', variables: variables};
	}
	else {
      return {pass:rate > 0, variables: variables};
    }
};

module.exports = {
	validate: validationEvidence
}

