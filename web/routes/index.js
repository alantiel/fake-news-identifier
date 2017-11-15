const express = require('express');
const router = express.Router();
const validator = require('../services/Validator');

const articles = require('../input/articles').sample;

const localStorage = require('localStorage')

router.get('/', (req, res) => {

	const fakeArticle = articles[1]; // real article = [0]
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

    res.render('index', { 
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
        finalRate: 'probability of being fake: '.concat(responseValidations.score).concat('%')
    });

});

router.get('/rate', (req, res) => {

	let rate = parseInt(localStorage.getItem('count' + req.query.url))

	if(isNaN(rate) || rate == 0) {
	    localStorage.setItem('count' + req.query.url, 1);
	}
	else {
       	localStorage.setItem('count' + req.query.url, rate + parseInt(req.query.point));
    }

	console.log("new count: ", localStorage.getItem('count' + req.query.url));

	res.send();

});

module.exports = router;
