var express = require('express');
var Typo = require('typo-js');
var levenshtein = require('fast-levenshtein')
var dictionary = new Typo("en_US");

var router = express.Router();


router.get('/', function(req, res, next) {
  var article = {
	title: 'WARNING: THIS IS FAKE!!',
	desc: 'Just more one fake text... Here is a misspled text too. True fake neus!',
   url: 'http://cnnn.com/news/1'
  }

  res.render('index', { 
	title: 'Fake News Identifier',
	article: article,
	validationOne: { pass: true, contUpperWords: 0, contExclamationPoints: 0},
	validationTwo: validateURL(article.url),
	validationThree: validationThree(article.url),
	validationFour: validateFormatting(article),
	validationFive: {pass: true},
	validationSix: {pass: true},
	validationSeven: {pass: true},
	validationEight: {pass: true},
	validationNine: {pass: true},
	validationTen: {pass: true}
  });

});

function checkExclamationPoints (article) {
	return article.match(/!/g).length;
}

function checkUpperCaseWords (article) {
	let letters = article.match(/[A-z]/g).length;
	let upperLetters = article.match(/[A-Z]/g).length;

	return upperLetters/letters;
}

function checkSensationalismExpression (article) {
	let sensationalExpressions = [
		"you won't believe what happened", 
		"check this out",
		"oh my god"
	];

	let senExprCount = 0;
	sensationalExpressions.forEach(function(exp) {
		let matched = article.match(new RegExp(exp, "i"));
		if (matched) {
			senExprCount++;
		}
	});

	return senExprCount;
}

validationOne = function(article) {
	let title = article.title;
	let exc = checkExclamationPoints(title);
	let upp = checkUpperCaseWords(title);
	let sen = checkSensationalismExpression(title); 
	console.log("checkExclamationPoints = " + exc);
	console.log("checkUpperCaseWords = " + upp);
	console.log("checkSensationalismExpression = " + sen);

	return 0;
}

validateURL = function(url) {
	var whiteList = ['cnn.com', 'nytimes.com'];

	var host = url.split("/")[2];

	var closestDistance = 5, closestURL;
	var pass = true;
	
	whiteList.forEach(function(itemURL) {
		var distance = levenshtein.get(itemURL, host);
		console.log(itemURL, url, distance);
		if(distance > 0 && distance < 3 && distance < closestDistance) {
			closestDistance = distance;
			closestURL = itemURL;
			pass = false;
		}
	});
	
	return {pass: pass, url: closestURL}
}

validateFormatting = function(article) {
	var keywords = article.title.match(/\b(\w+)\b/g).concat(article.desc.match(/\b(\w+)\b/g))
	var contWrorg = 0;


	keywords.forEach(function(element) {
		console.log(element, dictionary.check(element));
		if(!dictionary.check(element)) {
			contWrorg++;
			console.log(element + ' is misspeled...');
		}
	});
	
	return { pass:(contWrorg < 2) , cont: contWrorg};
}

validationThree = function(url){

	var whiteList = ['bbc.com', 'cnn.com', 'msn.com'];
	var blackList = [ 'bcc.com', 'cnm.com', 'nsm.com'];
	var host = url.split("/")[2];

	if(whiteList.indexOf(host) != -1){
		return {pass:true}
	}
	if(blackList.indexOf(host) != -1){
		return {pass:false}
	}
	return {pass: 'unknow'}
}

module.exports = router;
