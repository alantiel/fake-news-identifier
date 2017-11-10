const express = require('express');
const validator = require('../services/Validator');
const router = express.Router();

const allArtiles = require('../input/articles').sample;
 
router.get('/', (req, res) => {
    const url = req.query.url;
    
    const current = allArtiles
        .filter(article => article.originUrl === url);

	const validationResponse = validator.validate(current)[0];

    const score = validationResponse != null ? validationResponse.score : 0;

    res.send({
        score: score
    });
});

module.exports = router;
