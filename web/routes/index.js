const express = require('express');
const router = express.Router();
const service = require("../services/Validation.js");

router.get('/', function(req, res, next) {

  var articles = service.articles();

  var fakeArticle = articles[1]; // real article = [0]
  var validations = fakeArticle.validations;
  
  var resHeadLine = validations[0];
  var resURL = validations[1];
  var resReputation = validations[2];
  var resFormatting = validations[3];
  var resImage = validations[4];
  var resDate = validations[5];
  var resSeven = validations[6];
  var resOtherSources = validations[7];
  var resJoke = validations[8];
  var resTen = validations[9];

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
