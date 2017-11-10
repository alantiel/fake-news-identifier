const express = require('express');
const validationService = require('../services/Validation');
const router = express.Router();
const logger = console || {
    log: () => {},
    debug: () => {},
    info: () => {},
    error: () => {},
};

router.get('/', (req, res) => {
    const articles = validationService.articles();
    logger.log(articles);
    res.render('news', { 
        title: 'Fake-o-meter',
        articles
    });
});

module.exports = router;
