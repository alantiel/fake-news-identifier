const levenshtein = require('fast-levenshtein');
const logger = require('../utils/Logger');

const validateURL = function(url) {
    const whiteList = ['cnn.com', 'nytimes.com', 'theguardian.com'];

    const host = url.split('/')[2];

    let closestDistance = 5, closestURL;
    let pass = true;
	
    whiteList.forEach(function(itemURL) {
        const distance = levenshtein.get(itemURL, host);
        if(distance > 0 && distance < 3 && distance < closestDistance) {
            closestDistance = distance;
            closestURL = itemURL;
            pass = false;
        }
    });
	
    return {pass: pass, url: closestURL};
};


module.exports = {
	validate: validateURL
}
