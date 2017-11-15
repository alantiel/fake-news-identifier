const express = require('express');
const router = express.Router();
const validator = require('../services/Validator');

const articles = require('../input/articles').sample;

router.get('/:idx', (req, res) => {

	const fakeArticle = articles[req.params.idx]; // real article = [0]
	const responseValidations = validator.validate([fakeArticle])[0];
	const validations = responseValidations.validations;
  
	const resHeadLine = validations[0];
	const resURL = validations[1];
	const resReputation = validations[2];
	const resFormatting = validations[3];
	const resImage = validations[4];
	const resDate = validations[5];
	const resSeven = validations[6];
	const resOtherSources = validations[7];
	const resJoke = validations[8];
	const resTen = validations[9];

	console.log(resHeadLine);
	console.log(resURL);
	console.log(resReputation);
	  res.render('validations', { 
        title: 'fake-o-meter',
        article: fakeArticle,
        validationOne: resHeadLine,
        validationTwo: resURL,
        validationThree: resReputation,
        validationFour: resFormatting,
        validationFive: resImage,
        validationSix: resDate,
        validationSeven: resSeven,
        validationEight: resOtherSources, 
        validationNine: resJoke,
        validationTen: resTen,
		countFalse: responseValidations.countFalse,
		countTrue: responseValidations.countTrue,
		countUnknown: responseValidations.countUnknown,
        finalRate: 'Probability of being fake news: '.concat(responseValidations.score).concat('%'),
        articles: articles
    });


});

module.exports = router;
