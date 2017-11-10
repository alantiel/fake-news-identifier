const express = require('express');
const validator = require('../services/Validator');

const articles = require('../input/articles').sample;

const router = express.Router();
const logger = console || {
    log: () => {},
    debug: () => {},
    info: () => {},
    error: () => {},
};

router.get('/', (req, res) => {
	const allArtiles = articles;

	const validationResponse = validator.validate(allArtiles);

    res.render('news', { 
        title: 'Fake-o-meter',
        articles: validationResponse
    });
});

module.exports = router;
