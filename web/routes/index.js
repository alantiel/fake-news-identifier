const express = require('express');
const compareDates = require('compare-dates');
const request = require('sync-request');
const Typo = require('typo-js');
const levenshtein = require('fast-levenshtein')
const dictionary = new Typo("en_US");

const router = express.Router();

const Diff = require('mdiff').Diff;
const service = require("../services/Validation.js");

router.get('/', function(req, res, next) {
  var article = {

	//title: 'WARNING: THIS IS FAKE!!',
	title: 'In an Age of Fake News, a Historian of the Hoax - The New York Times',
	desc: 'Just more one fake text... Here is a misspled text too. True fake neus!',
    url: 'http://cnnn.com/news/1',
	date: 'Nov 6, 2017',
	imgCloud:'https://cloud.google.com/vision/images/rushmore.jpg'
  }

  res.render('index', { 
	title: 'Fake News Identifier',
	article: article,
	validationOne: service.validateHeadline(article.title),
	validationTwo: service.validateURL(article.url),
	validationThree: service.validationThree(article.url),
	validationFour: service.validateFormatting(article),
	validationFive: service.validateImage(article),
	validationSix: service.validateDate(article),
	validationSeven: {pass: true},
	validationEight: {pass: true},
	validationNine: service.validationJoke(article.url),
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
	let title = article.title;

	//const G_API_KEY = 'AIzaSyB_LG4vUd3N38WsJ2PVTeOF8MBunWcs9Go'; // alan
	const G_API_KEY = 'AIzaSyC-A5v-Ni-5DEUeByv0ASTqIDzSedbVnVY'; //makoto
	const G_ENDPOINT = 'https://www.googleapis.com/customsearch/v1';
	//const G_CX_WHITELIST = '008799506537989115616:9mdr3jf9dm8'; //alan
	const G_CX_WHITELIST = '000736769589540582836:fcooc21yaqq'; //makoto

	let res = request('GET', G_ENDPOINT.concat('?key=').concat(G_API_KEY).concat('&cx=').concat(G_CX_WHITELIST).concat('&q=').concat(article.title));

	let items = JSON.parse(res.getBody('utf8')).items;

	let resSize = items.filter(function(item){
		return item.pagemap && item.pagemap.newsarticle && item.pagemap.newsarticle[0].datepublished;
	}).filter(function(item){
		diff = new Diff(item.title, title);
		lcs = diff.getLcs();

		return lcs.length >= 0.8 * Math.min(item.title.length, title.length);
	}).filter(function(item) {
		let articleDate = new Date(article.date);
		let limitDays = 7;
		let itemDate = new Date(item.pagemap.newsarticle[0].datepublished);
		console.log(itemDate, articleDate, compareDates.add(articleDate, limitDays*-1, 'day'), compareDates.add(articleDate, limitDays, 'day'));
		return compareDates.isBetween(itemDate, compareDates.add(articleDate, limitDays*-1, 'day'), compareDates.add(articleDate, limitDays, 'day'));
	}).length;

	
	return {pass: resSize > 0};
}




module.exports = router;
