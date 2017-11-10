const request = require('sync-request');
const Diff = require('mdiff').Diff;

const logger = require('../utils/Logger');

const GOOGLE_API_CONFIG = require('../config/GOOGLE_API_CONFIG');

const validateOtherSources = function(article) {
    const title = article.title;

    const G_NUM_RETURN = '5';

    const resWhitelist = request('GET', GOOGLE_API_CONFIG.G_ENDPOINT
        .concat('?key=')
        .concat(GOOGLE_API_CONFIG.G_API_KEY)
        .concat('&cx=')
        .concat(GOOGLE_API_CONFIG.G_CX_WHITELIST)
        .concat('&num=')
        .concat(GOOGLE_API_CONFIG.G_NUM_RETURN)
        .concat('&q=')
        .concat(article.title));

    const whitelistItems = JSON.parse(resWhitelist.getBody('utf8')).items;

    const resWhitelistSize = whitelistItems.filter(function(item){
        const diff = new Diff(item.title.toUpperCase(), title.toUpperCase());
        const lcs = diff.getLcs();
        return lcs.length >= 0.8 * Math.min(item.title.length, title.length);
    }).length;

    const resBlacklist = request('GET', GOOGLE_API_CONFIG.G_ENDPOINT
        .concat('?key=')
        .concat(GOOGLE_API_CONFIG.G_API_KEY)
        .concat('&cx=')
        .concat(GOOGLE_API_CONFIG.G_CX_BLACKLIST)
        .concat('&num=')
        .concat(GOOGLE_API_CONFIG.G_NUM_RETURN)
        .concat('&q=')
        .concat(article.title));

    const blacklistResponse = JSON.parse(resBlacklist.getBody('utf8'));
    const blacklistItems = blacklistResponse.items || [];

    const resBlacklistSize = blacklistItems.filter(function(item){
        const diff = new Diff(item.title.toUpperCase(), title.toUpperCase());
        const lcs = diff.getLcs();
        logger.log('f0', item.title, title);
        logger.log('f2', lcs.length >= 0.8 * Math.min(item.title.length, title.length));
        return lcs.length >= 0.8 * Math.min(item.title.length, title.length);
    }).length;

    return {pass: (resWhitelistSize > 0 && resBlacklistSize == 0)? 'true' : (resWhitelistSize == 0 && resBlacklistSize > 0)? false : 'unknown', step:8}; 
    
};

module.exports = {
	validate: validateOtherSources
}
