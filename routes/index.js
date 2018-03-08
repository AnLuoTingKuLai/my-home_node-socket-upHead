var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
 	console.log('路径：', path.join(__dirname, '../static/views/soket.html'))
    res.sendFile(path.join(__dirname, '../static/views/soket.html'));
});

module.exports = router;
