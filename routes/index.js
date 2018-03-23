var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //编码解析用
var path = require('path');
var db = require('../config/db');

var mysql = require('mysql');
var connection = mysql.createConnection(db);
// 执行数据库连接 
connection.connect();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/index');
	// console.log('路径：', path.join(__dirname, '../static/login/login.html'))
	// res.sendFile(path.join(__dirname, '../static/login/login.html'));
});

/* login接口的时候 */
var login = require('../controller/login');
router.route('/login')
	.post(function (req, res, next) {
        login.post(req, res, next);
	})
	.get(function (req, res, next) {
		login.get(req, res, next);
	});

//主页
router.route('/index')
.post(function (req, res, next) {
    res.sendFile(path.join(__dirname, '../static/views/index.html'));
})
.get(function (req, res, next) {
    res.sendFile(path.join(__dirname, '../static/views/index.html'));
});


//聊天窗口
router.route('/soket')
.post(function (req, res, next) {
	res.sendFile(path.join(__dirname, '../static/views/soket.html'));
})
.get(function (req, res, next) {
	res.sendFile(path.join(__dirname, '../static/views/soket.html'));
});

//获取用户信息
router.route('/getUserInfo')
.post(function (req, res, next) {
	var sqlstring = `Select * From userData WHERE userName='${req.body.userName}'`;
	connection.query(sqlstring, (err, result) => {
		if (err) {
            console.log('[查询失败] - ', err);
            return;
        }
        res.status(200).json({
        	state: '2',
            msg: '获取用户信息成功',
            data: result[0]
        });
        console.log(result[0])
	})
})


//用户头像
var userHeadImg = require('../controller/userHeadImg');
//获取用户信息
router.route('/getUserHeadImg')
    .post(function (req, res, next) {
        userHeadImg.getImg(req, res, next);
    })
router.route('/setUserHeadImg')
    .post(function (req, res, next) {
        console.log('调用了 /setUserHeadImg  接口')
        // console.log('==================111')
        userHeadImg.setImg(req, res, next);
    })
router.route('/setFilter')
    .post(function (req, res, next) {
        // console.log('==================111')
        userHeadImg.setFilter(req, res, next);
    })
module.exports = router;