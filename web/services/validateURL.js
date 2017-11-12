const levenshtein = require('fast-levenshtein');
const logger = require('../utils/Logger');

const validateURL = function(url) {
    const whiteList = ['cnn.com', 'nytimes.com','nationalreport.net'];

    const host = url.split('/')[2];

    let closestDistance = 5, closestURL;
    let pass = true;
	
    whiteList.forEach(function(itemURL) {
        const distance = levenshtein.get(itemURL, host);
        logger.log(itemURL, url, distance);
        if(distance > 0 && distance < 3 && distance < closestDistance) {
            closestDistance = distance;
            closestURL = itemURL;
            pass = false;
        }
    });

	const variables  ={whiteList: whiteList, host: host, closestDistance: closestDistance};

    return {pass: pass, url: closestURL, variables: variables};
};


module.exports = {
	validate: validateURL
}
