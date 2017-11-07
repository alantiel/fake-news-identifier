var express = require('express');
var Typo = require('typo-js');
var dictionary = new Typo("en_US");

var router = express.Router();


router.get('/', function(req, res, next) {
  var article = {
	title: 'WARNING: THIS IS FAKE!!',
	desc: 'Just more one fake text... Here is a misspled text too. True fake neus!'
  }

  res.render('index', { 
	title: 'Fake News Identifier',
	article: article,
	validationOne: { pass: true, contUpperWords: 0, contExclamationPoints: 0},
	validationTwo: {pass: true},
	validationThree: {pass: true},
	validationFour: validationFour(article),
	validationFive: {pass: true},
	validationSix: {pass: true},
	validationSeven: {pass: true},
	validationEight: {pass: true},
	validationNine: {pass: true},
	validationTen: {pass: true}
  });

});

validationOne = function(article) {
	return 0;
}

validationFour = function(article) {
	var keywords = article.title.match(/\b(\w+)\b/g).concat(article.desc.match(/\b(\w+)\b/g))
	var contWrorg = 0;

	console.log(dictionary.check("misspelled"));

	console.log(dictionary.check("mispelled"));
	console.log(dictionary.suggest("misspled"));

	keywords.forEach(function(element) {
		console.log(element, dictionary.check(element));
		if(!dictionary.check(element)) {
			contWrorg++;
			console.log(element + ' is misspeled...');
		}
	});
	
	return { pass:(contWrorg < 2) , cont: contWrorg};
}

module.exports = router;
