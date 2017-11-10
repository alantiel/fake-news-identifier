const express = require('express');
const router = express.Router();
const validator = require('../services/Validator');

const articles = require('../input/articles').sample;

router.get('/', (req, res) => {

	const fakeArticle = articles[1]; // real article = [0]
	const validations = validator.validate([fakeArticle])[0].validations;
  
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
        title: 'Fake News Identifier',
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
        finalRate: fakeArticle.score
    });

});

module.exports = router;
