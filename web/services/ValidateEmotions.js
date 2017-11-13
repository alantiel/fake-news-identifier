const request = require('sync-request');

// const personalityUrl = 'https://gateway.watsonplatform.net/personality-insights/api/v3/profile?version=2017-10-13';
// const username = '206ae7ee-5c30-4962-9a5f-4331072a94e8';
// const password = 'G1vhCszBsXlZ';

const watson_config = require('../config/IBM_WATSON_API_CONFIG');

const target_personality_trait_ids = ['big5_openness', 'big5_extraversion', 'big5_neuroticism'];
const target_children_trait_ids = ['facet_emotionality', 'facet_excitement_seeking', 'facet_anger', 'facet_depression', 'facet_immoderation'];
// const target_needs = ['need_excitement', 'need_love', 'need_self_expression'];

function createBasicAuth(username, password) {
    return "Basic " + new Buffer(username + ":" + password).toString("base64");
}

function calculateResult(json) {
    var res = 0;
    var founds = 0;
    var personalities = json.personality;
    personalities.forEach(function(personality) {
        if (target_personality_trait_ids.includes(personality.trait_id)) {
            personality.children.forEach(function(child) {
                if (target_children_trait_ids.includes(child.trait_id)) {
                    res += child.percentile;
                    founds++;
                    console.log('Adicionando: ' + child.percentile + ' do ' + child.trait_id);
                }
            });
        }
    });
    // TODO: provavelmente remover -> percentual de 'Necessidades' muito baixo em comparacao com o percentual de 'Personalidades'
    // json.needs.forEach(function(need) {
    //     if (target_needs.includes(need.trait_id)) {
    //         res += need.percentile;
    //         founds++;
    //         console.log('Adicionando: ' + need.percentile + ' do ' + need.trait_id);
    //     }
    // });
    
    // TODO: verificar calculo - media aritmetica (?)
    console.log('Calculo da emotividade do text: ' + res/founds);
    return res/founds;
}

const validateEmotions = function(text) {
    console.log('ValidateEmotions - text: ' + text);
    
    var payload = {
        contentItems: [{
            content: text,
            contenttype: 'text/plain',
            created: 1447639154000,
            id: '666073008692314113',
            language: 'en'
        }]
     };

    var params = {
      json: payload,
      headers: {
        'content-type': 'application/json',
        'authorization': createBasicAuth(watson_config.PI_USERNAME, watson_config.PI_PASSWORD)
      }
    };

    var res = request('POST', watson_config.PI_ENDPOINT, params);
    const jsonResult = JSON.parse(res.getBody('utf8'));

    // if (error) {
    //     console.log('ValidateEmotions#request - ERROR: ', error);
    //     return {step: 11, pass: 'unknown'};
    // } else {
    //     console.log('ValidateEmotions#request - jsonResult: ' + JSON.stringify(jsonResult));
    //     var result = calculateResult(jsonResult);
    //     return {step: 11, pass: (result > 0.5 ? false : true)};
    // }
    var result = calculateResult(jsonResult);
    // TODO: verificar calculo - maior que 0.5 (?)
    return {step: 11, pass: (result > 0.5 ? false : true)};
}

module.exports = {
    validate: validateEmotions
}