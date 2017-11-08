const express = require('express');
const request = require('sync-request');
const Typo = require('typo-js');
const levenshtein = require('fast-levenshtein')
const dictionary = new Typo("en_US");

const router = express.Router();


router.get('/', function(req, res, next) {
  var article = {
	title: 'WARNING: THIS IS FAKE!!',
	desc: 'Just more one fake text... Here is a misspled text too. True fake neus! geology',
   url: 'http://cnnn.com/news/1',
   img:'https://cloud.google.com/vision/images/rushmore.jpg'
  }

  res.render('index', { 
	title: 'Fake News Identifier',
	article: article,
	validationOne: validateHeadline(article.title),
	validationTwo: validateURL(article.url),
	validationThree: validationThree(article.url),
	validationFour: validateFormatting(article),
	validationFive: validateImage(article),
	validationSix: {pass:true},//validateDate(article),
	validationSeven: {pass: true},
	validationEight: {pass: true},
	validationNine: {pass: true},
	validationTen: {pass: true}
  });

});

function checkExclamationPointsRatio (article) {
	return article.match(/!/g) ? article.match(/!/g).length : 0;
}

function checkUpperCaseLettersRatio (article) {
	let letters = article.match(/[A-z]/g) ? article.match(/[A-z]/g).length : 0;
	let upperLetters = article.match(/[A-Z]/g) ? article.match(/[A-Z]/g).length : 0;

	return upperLetters/letters;
}

function checkSensationalismExpressionRatio (article) {
	let sensationalExpressions = [
		"you won't believe what happened", 
		"check this out",
		"oh my god",
		"warning!",
		"danger!"
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

validateHeadline = function(title) {
	let exc = checkExclamationPointsRatio(title);
	let upp = checkUpperCaseLettersRatio(title);
	let sen = checkSensationalismExpressionRatio(title);
	console.log("Title = " + title);
	console.log("checkExclamationPointsRatio = " + exc);
	console.log("checkUpperCaseLettersRatio = " + upp);
	console.log("checkSensationalismExpressionRatio = " + sen);

	return {pass: !(exc > 1 || upp > 0.3 || sen > 1)};
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

validateDate = function(article) {
	let date = article.date;
	let title = article.title;

	const G_API_KEY = 'AIzaSyB_LG4vUd3N38WsJ2PVTeOF8MBunWcs9Go';
	const G_ENDPOINT = 'https://www.googleapis.com/customsearch/v1';
	const G_CX_WHITELIST = '008799506537989115616:9mdr3jf9dm8';

	console.log(G_ENDPOINT.concat('?key=').concat(G_API_KEY).concat('&cx=').concat(G_CX_WHITELIST).concat('&q=').concat(article.title));
	let res = request('GET', G_ENDPOINT.concat('?key=').concat(G_API_KEY).concat('&cx=').concat(G_CX_WHITELIST).concat('&q=').concat(article.title));

	console.log(JSON.parse(res.getBody('utf8')))

}
validateImage = function(article){
	var res = request('POST', 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC-A5v-Ni-5DEUeByv0ASTqIDzSedbVnVY', {
		json: { 
			"requests": [
				{
				  "image": {
					"source": {
					  "imageUri": article.img
					}
				  },
				  "features": [
					{
					  "type": "LABEL_DETECTION",
					  "maxResults": 10
					}
				  ]
				}
			  ]
		}
	  });
	var jsonResult = JSON.parse(res.getBody('utf8'));
	
	var filters = jsonResult.responses[0].labelAnnotations.map((label=> label.description))
		.filter((description) => article.desc.indexOf(description) !== -1);

	console.log(jsonResult.responses[0].labelAnnotations.map((label=> label.description)));
	console.log('matches:'+ filters)
	var result = filters.length > 0
	return {pass: result};
}
module.exports = router;
