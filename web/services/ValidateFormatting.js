const Typo = require('typo-js');
const dictionary = new Typo('en_US');
const logger = require('../utils/Logger');

function validateFormatting(article) {
    const keywords = article.title.match(/\b(\w+)\b/g).concat(article.desc.match(/\b(\w+)\b/g));
    let contWrorg = 0;


    keywords.forEach(function(element) {
        if(!dictionary.check(element)) {
            contWrorg++;
            //logger.log(element + ' is misspeled...');
        }
    });
	
    return { pass:(contWrorg < 2) ? 'true' : (contWrorg == 2) ? 'unknown' : 'false' , cont: contWrorg};
}

module.exports = {
	validate: validateFormatting
}
