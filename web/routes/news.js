var express = require('express');
var validationService = require('../services/Validation');
var router = express.Router();


 
router.get('/', function(req, res, next) {
    var articles = validationService();
    console.log(articles);
    res.render('news', { 
        title: 'Fake-o-meter',
        articles
    });
});

module.exports = router;