
var bodyParser = require('body-parser'); //编码解析用
var fs = require("fs"); //文件上传
var path = require('path');
var db = require('../config/db');
var mysql = require('mysql');
var connection = mysql.createConnection(db);
// 执行数据库连接 
connection.connect();
module.exports = {
    getImg(req, res, next) {
        // 查询数据  
        var sqlstring = `Select * From user_data WHERE userName='${req.body.userName}' && fileUrl != ''`;
        connection.query(sqlstring, function (err, result) {
            if (err) {
                console.log('[查询失败] - ', err);
                return;
            }
            //用户不存在于数据库
            if (result && result.length < 1) {
                res.status(200)
                    .json({
                        state: '2',
                        msg: '注册成功',
                        data: {
                            fileUrl: '../images/',
                            fileName: 'head.jpg'
                        }
                    });
                return;
            }
            res.status(200)
                .json({
                    state: '2',
                    msg: '注册成功',
                    data: {
                        fileUrl: result[0].fileUrl,
                        fileName: result[0].fileName
                    }
                });
        })
    },
    setImg(req, res, next) {
        //接受文件
        var imgData = req.body.file;
        // 转义base64
        var base64Data = imgData.replace(/\s/g,"+");
        base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        // base64到后台 '+' 会变成 ' ' 所以转义一下
        console.log('===============')
        var dataBuffer = new Buffer(base64Data, 'base64');
        console.log('base64Data.substring(0,100): ', base64Data.substring(0,100))
        console.log('dataBuffer: ', dataBuffer)

        //查询用户
        let sqlstring = `Select userName, filePath From user_data WHERE userName='${req.body.userName}'`;
        connection.query(sqlstring, function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            //要是不存在数据的话 那么就新增
            if(result && result.length < 1) {
                console.log('新增成功')
                // 生成随机数
                var timeStamp = Math.round(Math.random() * 9999999) + (new Date()).getTime();
                //文件插入
                var fileName = 'head.jpg'; //文件名
                var fileUrl = `/images/userData/${timeStamp}/`; //文件相对路径
                var filePath = path.join(__dirname, `../static/socket/images/userData/${timeStamp}/`); //文件绝对路径
                console.log('filePath1', filePath);
                //创建文件夹
                fs.mkdir(filePath,function(err){  
                    if(err) {
                        console.error(err);
                        return
                    };
                    console.log('创建目录成功'); 
                    fs.writeFile(`${filePath}${fileName}`, dataBuffer, function(err) {
                        if(err){
                          res.send(err);
                          return;
                        }
                        //路径转换
                        fileUrl = fileUrl.replace(/\\/g,"/");
                        filePath = filePath.replace(/\\/g,"/");
                        let sqlstring = `INSERT INTO user_data  (userName, filePath, fileUrl, fileName) VALUES ( '${req.body.userName}', '${filePath}', '${fileUrl}', '${fileName}' )`;
                        // let sqlstring = `Update user_data Set filePath = '${filePath}/', fileUrl = '${fileUrl}', fileName = '${fileName}' Where userName='${req.body.userName}'`;
                        console.log('创建文件成功')
                        console.log('fileUrl:', fileUrl);
                        console.log('filePath:', filePath);
                        console.log('sqlstring:', sqlstring);
                        connection.query(sqlstring, function (err, result) {
                            if(err){
                                console.log('[UPDATE ERROR] - ', err.message);
                                res.status(200).json({state: '1', msg: '修改头像失败' });
                                return;
                            };
                            res.status(200).json({state: '2', msg: '修改头像成功' });
                        });
                    });
                })
            } else {
                // 如果存在数据的话那么就更新
                let sqlstring = `Select userName, filePath From user_data WHERE userName='${req.body.userName}' && filePath != ''`;
                connection.query(sqlstring, function (err, result) {
                    if(err){
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }
                    //如果不存在 那么就插入
                    if(result && result.length < 1) {
                        // 生成随机数
                        var timeStamp = Math.round(Math.random() * 9999999) + (new Date()).getTime();
                        //文件插入
                        var fileName = 'head.jpg'; //文件名
                        var fileUrl = `../images/userData/${timeStamp}/`; //文件相对路径
                        var filePath = path.join(__dirname, `../static/images/userData/${timeStamp}/`); //文件绝对路径
                        console.log('filePath1', filePath);
                        //创建文件夹
                        fs.mkdir(filePath,function(err){  
                            if(err) {
                                console.error(err);
                                return
                            };
                            console.log('创建目录成功'); 
                            fs.writeFile(`${filePath}${fileName}`, dataBuffer, function(err) {
                                if(err){
                                  res.send(err);
                                  return;
                                }
                                //路径转换
                                fileUrl = fileUrl.replace(/\\/g,"/");
                                filePath = filePath.replace(/\\/g,"/");
                                let sqlstring = `Update user_data Set filePath = '${filePath}/', fileUrl = '${fileUrl}', fileName = '${fileName}' Where userName='${req.body.userName}'`;
                                console.log('创建文件成功')
                                console.log('fileUrl:', fileUrl);
                                console.log('filePath:', filePath);
                                console.log('sqlstring:', sqlstring);
                                connection.query(sqlstring, function (err, result) {
                                    if(err){
                                        console.log('[UPDATE ERROR] - ', err.message);
                                        res.status(200).json({state: '1', msg: '修改头像失败' });
                                        return;
                                    };
                                    res.status(200).json({state: '2', msg: '修改头像成功' });
                                });
                            });
                        });  
                       
                    } else {
                        let sqlstring = `Select filePath From user_data WHERE userName='${req.body.userName}'`;
                        connection.query(sqlstring, function (err, result) {
                            if(err){
                                console.log('[查询失败] - ', err.message);
                                return;
                            }
                            console.log(result);
                            var filePath = `${result[0].filePath}/head.jpg`;
                            console.log('filePath2', filePath)
                            fs.writeFile(filePath, dataBuffer, function(err) {
                                if(err){
                                  res.send(err);
                                }else{
                                  res.send("保存成功！");
                                }
                            });
                        });
                    }
                });
            }
        });
    },
    setFilter(req, res, next) {
        sqlstring = `Update user_data Set filter = '${req.body.filter}' Where userName='${req.body.userName}'`;
        connection.query(sqlstring, function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
            console.log('滤镜更新成功')
            res.status(200).json({state: '2', msg: '修改头像成功' });
        });
    }
}