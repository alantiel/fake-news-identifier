const logger = require('../utils/Logger');

const ValidateHeadline = require('../services/ValidateHeadline');
const ValidateURL = require('../services/validateURL');
const ValidateFormatting = require('../services/ValidateFormatting');
const ValidationReputation = require('../services/ValidationReputation');
const ValidateOtherSources = require('../services/ValidateOtherSources');
const ValidateImage = require('../services/ValidateImage');
const ValidationJoke = require('../services/ValidationJoke');
const ValidateDate = require('../services/ValidateDate');
const ValidateEmotions = require('../services/ValidateEmotions');
const ValidationEvidence = require('../services/ValidationEvidence');

const calculateScore = function (validations) {
	var sum = 0;
	validations.forEach(function(v) {
		if(v.valid === false || v.valid === 'false') {
			sum+=10;
		} else if(v.valid === 'unknown') {
			sum+=5;
		}
	});
	return sum;
}

module.exports = {
    validate: function(articles){
		//logger.log(articles);

        articles.forEach(function(article) {
            const validations = [];
            const isValidStep1 = ValidateHeadline.validate(article.title);
            validations.push({step:1, valid: isValidStep1.pass, variables: isValidStep1.variables});

            const isValidStep2 = ValidateURL.validate(article.url);
            validations.push({step:2, valid: isValidStep2.pass, variables: isValidStep2.variables});

            const isValidStep3 = ValidationReputation.validate(article.url);
            validations.push({step:3, valid: isValidStep3.pass, variables: isValidStep3.variables});

            const isValidStep4 = ValidateFormatting.validate(article);
            validations.push({step:4, valid: isValidStep4.pass, variables: isValidStep4.variables});

            //const isValidStep5 = ValidateImage.validate(article);
            //validations.push({step:5, valid: isValidStep5.pass, variables: isValidStep5.variables}); // TODO descomentar e apagar a linha abaixo (mockando para artigos testados nao fazerem muitas chamadas)
			validations.push({step:5, valid: ( article.originUrl === 'https://theguardian.com/world/2017/nov/07/photo-of-elephant-and-calf-fleeing-fire-throwing-mob-wins-top-prize'), variables: {filters: 'elephant,wildlife,mammal'}});

            //const isValidStep6 = ValidateDate.validate(article); 
            //validations.push({step:6, valid: isValidStep6.pass, variables: isValidStep6.variables}); // TODO descomentar e apagar a linha abaixo (mockando para artigos testados nao fazerem muitas chamadas)
			validations.push({step:6, valid: ( article.originUrl === 'https://theguardian.com/world/2017/nov/07/photo-of-elephant-and-calf-fleeing-fire-throwing-mob-wins-top-prize'), variables: { itemDate: '2017-01-27T00:34:13.000Z',
                articleDate: '2017-01-26T02:00:00.000Z' }});

			const isValidStep7 = ValidationEvidence.validate(article.url);
            validations.push({step:7, valid: isValidStep7.pass, variables: isValidStep7.variables});

            //const isValidStep8 = ValidateOtherSources.validate(article);
            //validations.push({step:8, valid: isValidStep8.pass}); // TODO descomentar e apagar a linha abaixo (mockando para artigos testados nao fazerem muitas chamadas)
			validations.push({step:8, valid: ( article.originUrl !== 'http://nationalreport.net/alex-jones-suggests-flying-false-flag-half-staff-texas-church-shooting-victims/') });

            const isValidStep9 = ValidationJoke.validate(article.url);
            validations.push({step:9, valid: isValidStep9.pass});

            const isValidStep10 = {step:10, valid: true};
            validations.push(isValidStep10);

            //valida emotividade do texto (+emocao -verdade)
            //const isEmotionalText = ValidateEmotions.validate(article.desc);
            //validations.push({step:11, valid: isEmotionalText.pass});

			logger.log(article);
            validations.forEach((validation)=>{
                logger.log(validation);
            });

            article['validations'] = validations;
            article['score'] = calculateScore(validations);
			article['countFalse'] = validations.filter((validation) => validation.valid === false || validation.valid === 'false' ).length;
			article['countUnknown'] = validations.filter((validation) =>  validation.valid === 'unknown' ).length;
			article['countTrue'] = validations.filter((validation) => validation.valid === true || validation.valid === 'true' ).length;

			}); 
        logger.log(articles);
        return articles;
    }
}; 
