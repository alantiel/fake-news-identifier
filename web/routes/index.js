const express = require('express');
const router = express.Router();
const service = require("../services/Validation.js");

router.get('/', function(req, res, next) {
  var article = {

	//title: 'WARNING: THIS IS FAKE!!',
	//title: 'In an Age of Fake News, a Historian of the Hoax - The New York Times',
	title: 'ALEX JONES SUGGESTS FLYING FALSE FLAG AT HALF-STAFF FOR TEXAS CHURCH SHOOTING VICTIMS',
	desc: 'Just more one fake text... Here is a misspled text too. True fake neus!',
   url: 'http://cnnn.com/news/1',
	date: 'Jan 6, 2017',
	imgCloud:'https://cloud.google.com/vision/images/rushmore.jpg'
  }

  res.render('index', { 
	title: 'Fake News Identifier',
	article: article,
	validationOne: service.validateHeadline(article.title),
	validationTwo: service.validateURL(article.url),
	validationThree: service.validationThree(article.url),
	validationFour: service.validateFormatting(article),
	validationFive: {pass: true}, //service.validateImage(article),
	validationSix: {pass: true},//service.validateDate(article),
	validationSeven: {pass: true},
	validationEight: {pass: true}, //service.validateOtherSources(article), 
	validationNine: service.validationJoke(article.url),
	validationTen: {pass: true}
  });

});

module.exports = router;
