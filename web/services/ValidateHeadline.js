const logger = require('../utils/Logger');

function checkExclamationPointsRatio (article) {
    return article.match(/!/g) ? article.match(/!/g).length : 0;
}

function checkUpperCaseLettersRatio (article) {
    const letters = article.match(/[A-z]/g) ? article.match(/[A-z]/g).length : 0;
    const upperLetters = article.match(/[A-Z]/g) ? article.match(/[A-Z]/g).length : 0;

    return upperLetters/letters;
}

function checkSensationalismExpressionRatio (article) {
    const sensationalExpressions = [
        'you won\'t believe what happened', 
        'check this out',
        'oh my god',
        'warning!',
        'danger!'
    ];

    let senExprCount = 0;
    sensationalExpressions.forEach(function(exp) {
        const matched = article.match(new RegExp(exp, 'i'));
        if (matched) {
            senExprCount++;
        }
    });

    return senExprCount;
}

const validateHeadline = function(title) {
    const exc = checkExclamationPointsRatio(title);
    const upp = checkUpperCaseLettersRatio(title);
    const sen = checkSensationalismExpressionRatio(title);
    logger.log('Title = ' + title);
    logger.log('checkExclamationPointsRatio = ' + exc);
    logger.log('checkUpperCaseLettersRatio = ' + upp);
    logger.log('checkSensationalismExpressionRatio = ' + sen);

    return {pass: !(exc > 1 || upp > 0.3 || sen > 1)};
};

module.exports = {
	validate: validateHeadline
}
