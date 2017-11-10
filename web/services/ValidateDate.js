const request = require('sync-request');
const compareDates = require('compare-dates');
const Diff = require('mdiff').Diff;

const logger = require('../utils/Logger');
const GOOGLE_API_CONFIG = require('../config/GOOGLE_API_CONFIG');

const validateDate = function(article) {
    const title = article.title;

    const res = request('GET', GOOGLE_API_CONFIG.G_ENDPOINT.concat('?key=').concat(GOOGLE_API_CONFIG.G_API_KEY).concat('&cx=').concat(GOOGLE_API_CONFIG.G_CX_WHITELIST).concat('&q=').concat(article.title));

    const items = JSON.parse(res.getBody('utf8')).items;

    const resSize = items.filter(function(item){
        return item.pagemap && item.pagemap.newsarticle && item.pagemap.newsarticle[0].datepublished;
    }).filter(function(item){
        const diff = new Diff(item.title, title);
        const lcs = diff.getLcs();

        return lcs.length >= 0.8 * Math.min(item.title.length, title.length);
    }).filter(function(item) {
        const articleDate = new Date(article.date);
        const limitDays = 7;
        const itemDate = new Date(item.pagemap.newsarticle[0].datepublished);
        logger.log(itemDate, articleDate, compareDates.add(articleDate, limitDays*-1, 'day'), compareDates.add(articleDate, limitDays, 'day'));
        return compareDates.isBetween(itemDate, compareDates.add(articleDate, limitDays*-1, 'day'), compareDates.add(articleDate, limitDays, 'day'));
    }).length;

	
    return {pass: resSize > 0};
};

module.exports = {
	validate: validateDate
}
