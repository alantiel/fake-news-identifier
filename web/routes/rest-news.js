const express = require('express');
const validationService = require('../services/Validation');
const router = express.Router();
 
router.get('/', (req, res) => {
    const url = req.query.url;
    
    const articles = validationService.articles();
    
    const scores = articles
        .filter(article => article.originUrl === url)
        .map(article => article.score);

    const score = scores.length > 0 ? scores[0] : 0;

    res.send({
        score: score
    });
});

module.exports = router;