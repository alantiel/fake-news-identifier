const request = require('sync-request');

const logger = require('../utils/Logger');
const GOOGLE_API_CONFIG = require('../config/GOOGLE_API_CONFIG');

const validateImage = function(article){
	
    const res = request('POST', GOOGLE_API_CONFIG.VG_ENDPOINT.concat('?key=').concat(GOOGLE_API_CONFIG.VG_API_KEY), {
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

    const jsonResult = JSON.parse(res.getBody('utf8'));
	
    if(jsonResult.responses[0].labelAnnotations){
        const filters = jsonResult.responses[0].labelAnnotations.map((label=> label.description))
            .filter((description) => article.desc.indexOf(description) !== -1);

        //logger.log(jsonResult.responses[0].labelAnnotations.map((label=> label.description)));
        //logger.log('matches:'+ filters);
        const result = filters.length > 0;
        return { pass: result };
    }else{
        return { pass:false };
    }

};

module.exports = {
	validate: validateImage
}
