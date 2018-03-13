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
	console.log('路径：', path.join(__dirname, '../static/login/login.html'))
	res.sendFile(path.join(__dirname, '../static/login/login.html'));
});

/* login接口的时候 */
router.route('/login')
	.post(function (req, res, next) {

		// 查询数据  
        var sqlstring = `Select * From user WHERE userName='${req.body.userName}' && password='${req.body.password}'`;
        connection.query(sqlstring, function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ', err);
                return;
            }
            //用户不存在于数据库
            if(result && result.length < 1) {
                // 插入数据
                sqlstring = `Insert into user Values('${req.body.userName}', '${req.body.password}', '1')`;
                connection.query(sqlstring, function (err, result) {
                    if(err){
                        console.log('[插入失败] - ', err.message);
                        res.status(200).json({state: '1', msg: '密码错误'});
                        return;
                    }        
                    console.log('插入成功')
                    var sqlstring = "";
                    res.status(200).json({state: '2', msg: '注册成功' });
                });
            } else {
                // 更新数据
                sqlstring = `Update user Set state = '1' Where userName = '${req.body.userName}'`;
                connection.query(sqlstring, function (err, result) {
                    if(err || result && result.length < 1){
                        console.log('[UPDATE ERROR] - ', err.message);
                        return;
                    }        
                    console.log('更新成功'); 
                    res.status(200).json({state: '2', msg: '登录成功' });
                });
            }
       });
	})
	.get(function (req, res, next) {
		res.sendFile(path.join(__dirname, '../static/login/login.html'));
	});

router.route('/soket')
	.post(function (req, res, next) {
		// res.redirect('http://www.baidu.com')
		res.sendFile(path.join(__dirname, '../static/views/soket.html'));
	})
	.get(function (req, res, next) {
		res.sendFile(path.join(__dirname, '../static/views/soket.html'));
	});



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
module.exports = router;