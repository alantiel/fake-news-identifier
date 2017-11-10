const logger = require('../utils/Logger');

const ValidateHeadline = require('../services/ValidateHeadline');
const ValidateURL = require('../services/validateURL');
const ValidateFormatting = require('../services/ValidateFormatting');
const ValidationReputation = require('../services/ValidationReputation');
const ValidateOtherSources = require('../services/ValidateOtherSources');
const ValidateImage = require('../services/ValidateImage');
const ValidationJoke = require('../services/ValidationJoke');
const ValidateDate = require('../services/ValidateDate');


module.exports = {
    validate: function(articles){
		logger.log(articles);

        articles.forEach(function(article) {
            const validations = [];
            const isValidStep1 = ValidateHeadline.validate(article.title);
            validations.push({step:1, valid: isValidStep1.pass});

            const isValidStep2 = ValidateURL.validate(article.url);
            validations.push({step:2, valid: isValidStep2.pass});

            const isValidStep3 = ValidationReputation.validate(article.url);
            validations.push({step:3, valid: isValidStep3.pass});

            const isValidStep4 = ValidateFormatting.validate(article);
            validations.push({step:4, valid: isValidStep4.pass});

            //const isValidStep5 = ValidateImage.validate(article);
            //validations.push({step:5, valid: isValidStep5.pass}); // TODO descomentar e apagar a linha abaixo
			validations.push({step:5, valid: true});

            //const isValidStep6 = ValidateDate.validate(article); 
            //validations.push({step:6, valid: isValidStep6.pass}); // TODO descomentar e apagar a linha abaixo
			validations.push({step:6, valid: false});

            const isValidStep7 = {step:7, valid: true};
            validations.push(isValidStep7);

            //const isValidStep8 = ValidateOtherSources.validate(article);
            //validations.push({step:8, valid: isValidStep8.pass}); // TODO descomentar e apagar a linha abaixo
			validations.push({step:8, valid: true});

            const isValidStep9 = ValidationJoke.validate(article.url);
            validations.push({step:8, valid: isValidStep9.pass});

            const isValidStep10 = {step:10, valid: true};
            validations.push(isValidStep10);

            validations.forEach((validation)=>{
                logger.log(validation);
            });

            article['validations'] = validations;
            article['score'] = validations.filter((validation) => validation.valid === false || validation.valid === 'false' ).length * 10;
        });
        logger.log(articles);
        return articles;
    }
}; 
