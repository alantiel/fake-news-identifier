const request = require('sync-request');
const Typo = require('typo-js');
const levenshtein = require('fast-levenshtein');
const dictionary = new Typo('en_US');
const compareDates = require('compare-dates');
const Diff = require('mdiff').Diff;

const logger = console || {
    log: () => {},
    debug: () => {},
    info: () => {},
    error: () => {},
};

//const G_API_KEY = 'AIzaSyB_LG4vUd3N38WsJ2PVTeOF8MBunWcs9Go'; // alan
const G_API_KEY = 'AIzaSyC-A5v-Ni-5DEUeByv0ASTqIDzSedbVnVY'; //makoto
const G_ENDPOINT = 'https://www.googleapis.com/customsearch/v1';
//const G_CX_WHITELIST = '008799506537989115616:9mdr3jf9dm8'; //alan
const G_CX_WHITELIST = '000736769589540582836:fcooc21yaqq'; //makoto

const G_CX_BLACKLIST = '000736769589540582836:lqjfyjgyf0g'; // makoto

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
        'you won\'t believe what happened', 
        'check this out',
        'oh my god',
        'warning!',
        'danger!'
    ];

    let senExprCount = 0;
    sensationalExpressions.forEach(function(exp) {
        let matched = article.match(new RegExp(exp, 'i'));
        if (matched) {
            senExprCount++;
        }
    });

    return senExprCount;
}

const validateHeadline = function(title) {
    let exc = checkExclamationPointsRatio(title);
    let upp = checkUpperCaseLettersRatio(title);
    let sen = checkSensationalismExpressionRatio(title);
    logger.log('Title = ' + title);
    logger.log('checkExclamationPointsRatio = ' + exc);
    logger.log('checkUpperCaseLettersRatio = ' + upp);
    logger.log('checkSensationalismExpressionRatio = ' + sen);

    return {pass: !(exc > 1 || upp > 0.3 || sen > 1)};
};

const validateURL = function(url) {
    let whiteList = ['cnn.com', 'nytimes.com'];

    let host = url.split('/')[2];

    let closestDistance = 5, closestURL;
    let pass = true;
	
    whiteList.forEach(function(itemURL) {
        let distance = levenshtein.get(itemURL, host);
        logger.log(itemURL, url, distance);
        if(distance > 0 && distance < 3 && distance < closestDistance) {
            closestDistance = distance;
            closestURL = itemURL;
            pass = false;
        }
    });
	
    return {pass: pass, url: closestURL};
};

function validateFormatting(article) {
    let keywords = article.title.match(/\b(\w+)\b/g).concat(article.desc.match(/\b(\w+)\b/g));
    let contWrorg = 0;


    keywords.forEach(function(element) {
        logger.log(element, dictionary.check(element));
        if(!dictionary.check(element)) {
            contWrorg++;
            logger.log(element + ' is misspeled...');
        }
    });
	
    return { pass:(contWrorg < 2) , cont: contWrorg};
}

const validationReputation = function(url){

    let whiteList = ['bbc.com', 'cnn.com', 'msn.com'];
    let blackList = [ 'bcc.com', 'cnm.com', 'nsm.com','nationalreport.net'];
    let host = url.split('/')[2];

    if(whiteList.indexOf(host) != -1){
        return {pass:true};
    }
    if(blackList.indexOf(host) != -1){
        return {pass:false};
    }
    return {pass: 'unknow'};
};


const validateOtherSources = function(article) {
    let title = article.title;

    const G_NUM_RETURN = '5';

    let resWhitelist = request('GET', G_ENDPOINT
        .concat('?key=')
        .concat(G_API_KEY)
        .concat('&cx=')
        .concat(G_CX_WHITELIST)
        .concat('&num=')
        .concat(G_NUM_RETURN)
        .concat('&q=')
        .concat(article.title));

    let whitelistItems = JSON.parse(resWhitelist.getBody('utf8')).items;

    let resWhitelistSize = whitelistItems.filter(function(item){
        let diff = new Diff(item.title.toUpperCase(), title.toUpperCase());
        let lcs = diff.getLcs();
        return lcs.length >= 0.8 * Math.min(item.title.length, title.length);
    }).length;

    let resBlacklist = request('GET', G_ENDPOINT
        .concat('?key=')
        .concat(G_API_KEY)
        .concat('&cx=')
        .concat(G_CX_BLACKLIST)
        .concat('&num=')
        .concat(G_NUM_RETURN)
        .concat('&q=')
        .concat(article.title));

    let blacklistResponse = JSON.parse(resBlacklist.getBody('utf8'));
    let blacklistItems = blacklistResponse.items || [];

    let resBlacklistSize = blacklistItems.filter(function(item){
        let diff = new Diff(item.title.toUpperCase(), title.toUpperCase());
        let lcs = diff.getLcs();
        logger.log('f0', item.title, title);
        logger.log('f2', lcs.length >= 0.8 * Math.min(item.title.length, title.length));
        return lcs.length >= 0.8 * Math.min(item.title.length, title.length);
    }).length;

    return {pass: (resWhitelistSize > 0 && resBlacklistSize == 0)? 'true' : (resWhitelistSize == 0 && resBlacklistSize > 0)? false : 'unknow', step:8}; 
    
};

const articles = [
    {
        title: 'Photo of elephant and calf fleeing fire-throwing mob wins top prize',
        desc: 'An arresting image showing an adult elephant and its calf fleeing a mob attack has won a top Asian wildlife photography prize.	It shows the two animals running among a crowd that has hurled flaming tar balls and crackers at them, reportedly to ward the elephants away from human settlements.',
        url: 'https://www.theguardian.com/world/2017/nov/07/photo-of-elephant-and-calf-fleeing-fire-throwing-mob-wins-top-prize',
        imgCloud:'https://storage.googleapis.com/fakenews_hackaton/elefante.jpg',
        imgUrl: 'https://storage.googleapis.com/fakenews_hackaton/elefante.jpg',
        originUrl:'https://www.theguardian.com/world/2017/nov/07/photo-of-elephant-and-calf-fleeing-fire-throwing-mob-wins-top-prize'
    },
    {
        title: 'ALEX JONES SUGGESTS FLYING FALSE FLAG AT HALF-STAFF FOR TEXAS CHURCH SHOOTING VICTIMS',
        desc: 'Just more one fake text... Here is a misspled text too. True fake neus!',
        url: 'http://nationalreport.net/alex-jones-suggests-flying-false-flag-half-staff-texas-church-shooting-victims/',
        date: 'Jan 6, 2017',
        imgCloud:'http://nationalreport.net/wp-content/uploads/2017/11/8368024532_d74e9d988d_z.jpg',
        imgUrl: 'http://nationalreport.net/wp-content/uploads/2017/11/8368024532_d74e9d988d_z.jpg',
        originUrl:'http://nationalreport.net/alex-jones-suggests-flying-false-flag-half-staff-texas-church-shooting-victims/'  
    }
];

const validateImage = function(article){
    let res = request('POST', 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC-A5v-Ni-5DEUeByv0ASTqIDzSedbVnVY', {
        json:{
            'requests': [
                {
                    'image': {
                        'source': {
                            'imageUri': article.imgCloud
                        }
                    },
                    'features': [
                        {
                            'type': 'LABEL_DETECTION',
                            'maxResults': 10
                        }
                    ]
                }
            ]
        }
    });

    let jsonResult = JSON.parse(res.getBody('utf8'));
	
    if(jsonResult.responses[0].labelAnnotations){
        let filters = jsonResult.responses[0].labelAnnotations.map((label=> label.description))
            .filter((description) => article.desc.indexOf(description) !== -1);

        logger.log(jsonResult.responses[0].labelAnnotations.map((label=> label.description)));
        logger.log('matches:'+ filters);
        let result = filters.length > 0;
        return { pass: result };
    }else{
        return { pass:false };
    }

};

let validationJoke = function(url){
    let knowedDomains = ['thechive.com', 'cracked.com', 'break.com'];
    let host = url.split('/')[2];
       
    if(knowedDomains.indexOf(host) != -1){
        return { pass:false};
    }       
    return{ pass: true, step: 9};
};


const validateDate = function(article) {
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
        let diff = new Diff(item.title, title);
        let lcs = diff.getLcs();

        return lcs.length >= 0.8 * Math.min(item.title.length, title.length);
    }).filter(function(item) {
        let articleDate = new Date(article.date);
        let limitDays = 7;
        let itemDate = new Date(item.pagemap.newsarticle[0].datepublished);
        logger.log(itemDate, articleDate, compareDates.add(articleDate, limitDays*-1, 'day'), compareDates.add(articleDate, limitDays, 'day'));
        return compareDates.isBetween(itemDate, compareDates.add(articleDate, limitDays*-1, 'day'), compareDates.add(articleDate, limitDays, 'day'));
    }).length;

	
    return {pass: resSize > 0};
};


module.exports = {
    articles: function(){
        articles.forEach(function(article) {
            let validations = [];
            let isValidStep1 = validateHeadline(article.title);
            validations.push({step:1, valid: isValidStep1.pass});

            let isValidStep2 = validateURL(article.url);
            validations.push({step:2, valid: isValidStep2.pass});

            let isValidStep3 = validationReputation(article.url);
            validations.push({step:3, valid: isValidStep3.pass});

            let isValidStep4 = validateFormatting(article);
            validations.push({step:4, valid: isValidStep4.pass});

            let isValidStep5 = validateImage(article);
            validations.push({step:5, valid: isValidStep5.pass});

            let isValidStep6 = validateDate(article);
            validations.push({step:6, valid: isValidStep6.pass});

            let isValidStep7 = {step:7, valid: true};
            validations.push(isValidStep7);

            let isValidStep8 = validateOtherSources(article);
            validations.push({step:8, valid: isValidStep8.pass});

            let isValidStep9 = validationJoke(article.url);
            validations.push({step:8, valid: isValidStep9.pass});

            let isValidStep10 = {step:10, valid: true};
            validations.push(isValidStep10);

            validations.forEach((validation)=>{
                logger.log(validation);
            });

            article['validations'] = validations;
            article['score'] = validations.filter((validation) => validation.valid === false || validation.valid === 'false' ).length * 10;
        });
        logger.log(articles);
        return articles;
    },
    validateHeadline,
    validateURL,
    validationReputation,
    validateFormatting,
    validateImage,
    validateDate,
    validationJoke,
    validateOtherSources
}; 
