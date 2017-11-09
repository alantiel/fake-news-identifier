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

  var resHeadLine = service.validateHeadline(article.title);
  var resURL = service.validateHeadline(article.title);
  var resThree = service.validationThree(article.url);
  var resFormatting = service.validateFormatting(article);
  var resImage = service.validateImage(article)
  var resDate = service.validateDate(article)
  var resSeven = {pass: true};
  var resOtherSources = service.validateOtherSources(article)
  var resJoke = service.validationJoke(article.url);
  var resTen = {pass: true};

  res.render('index', { 
	title: 'Fake News Identifier',
	article: article,
	validationOne: resHeadLine,
	validationTwo: resURL,
	validationThree: resThree,
	validationFour: resFormatting,
	validationFive: resImage,
	validationSix: resDate,
	validationSeven: resSeven,
	validationEight: resOtherSources, 
	validationNine: resJoke,
	validationTen: resTen,
	finalRate: service.articles()[1].score
  });

});

finalRate = function(answers){
	var vTrue = 0;
	var vFalse = 0;
	var vUnknow = 0;

	answers.forEach(function(res){
		switch(res.pass){
			case true:
				vTrue+=1;
				break;
			case false:
				vFalse+=1;
				break;
			case 'unknow':
				vUnknow+=1;
				break;
		}
	})
	var result = ((vFalse  + vUnknow* 0.5)/answers.length) * 10;
	return " Final Rate = " + result.toFixed(2) + " %";
}


module.exports = router;
