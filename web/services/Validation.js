const request = require('sync-request');
const Typo = require('typo-js');
const levenshtein = require('fast-levenshtein')
const dictionary = new Typo("en_US");

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

 function validateFormatting(article) {
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

function validationThree(url){

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
					  "imageUri": article.imgCloud
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
	return { pass: result };
}

var articles = [
    {
        title: 'Chefe da Guarda Civil de SP diz que bairro é só um dos fatores que influenciam abordagens policiais',
        desc: ' Em um debate sobre como as autoridades policiais devem se dirigir às pessoas nas ruas, o comandante geral da GCM (Guarda Civil Metropolitana) de São Paulo, Adelson de Souza, disse que "cada abordagem é diferente" -- e o local da cidade onde ela acontece não pode ser determinante para uma ação policial diferenciada.',
        url: 'http://cnnn.com/news/1',
        imgCloud:'https://cloud.google.com/vision/images/rushmore.jpg',
        imgUrl: 'https://conteudo.imguol.com.br/c/noticias/67/2017/11/08/08nov2017---comandante-geral-da-gcm-de-sp-adelson-de-souza-1510158156286_300x420.jpg',
        originUrl:''
    },    
    {
        title: 'A chocante foto de elefantes em chamas premiada em concurso!!!!',
        desc: 'A imagem de dois elefantes fugindo de uma multidão que ateava fogo neles foi escolhida como a vencedora de um prêmio de fotografia da vida selvagem.',
        url: 'http://cnnn.com/news/1',
        imgCloud:'https://cloud.google.com/vision/images/rushmore.jpg',
        imgUrl: 'https://conteudo.imguol.com.br/c/noticias/3c/2017/11/08/a-imagem-de-dois-elefantes-fugindo-de-uma-multidao-que-ateava-fogo-neles-foi-escolhida-como-a-vencedora-de-um-premio-de-fotografia-da-vida-selvagem-1510158759882_615x300.jpg',
        originUrl:''
    }
]

module.exports = function() {
    articles.forEach(function(article) {
        var validations = [];
        var isValidStep1 = validateHeadline(article.title);
        validations.push({step:1, valid: isValidStep1.pass});

        var isValidStep2 = validateURL(article.url);
        validations.push({step:2, valid: isValidStep2.pass});

        var isValidStep3 = validationThree(article.url);
        validations.push({step:3, valid: isValidStep3.pass});
      
        var isValidStep4 = validateFormatting(article);
        validations.push({step:4, valid: isValidStep4.pass});

        var isValidStep5 = validateImage(article);
        validations.push({step:5, valid: isValidStep5.pass})
   
        var isValidStep6 = {step:6, valid: true};
        validations.push(isValidStep6)

        var isValidStep7 = {step:7, valid: true};
        validations.push(isValidStep7)

        var isValidStep8 = {step:8, valid: true};
        validations.push(isValidStep8)

        var isValidStep9 = {step:9, valid: true};
        validations.push(isValidStep9)

        var isValidStep10 = {step:10, valid: true};
        validations.push(isValidStep10)

        article['validations'] = validations;
        article['score'] = 100 - validations.filter((validation) => validation.valid === true).length * 10;
    });
    console.log(articles);
    return articles;
}