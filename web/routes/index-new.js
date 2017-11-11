const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
		console.log('Index New Porra')
	  res.render('indexnew', { 
        title: 'Fake News Identifier'
    });

});

module.exports = router;