var express = require('express');
var validationService = require('../services/Validation');
var router = express.Router();
 
router.get('/', function(req, res, next) {
    var url = req.query.url;
    
    var articles = validationService.articles();
    var score = articles.filter(article => article.originUrl === url)
    .map(article => article.score)
    score = score.length > 0 ? score[0] : 0;
    res.send({
        score: score
    });
});

module.exports = router;