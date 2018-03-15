

var io = require('socket.io')();
var db = require('../config/db');

var mysql = require('mysql');
var connection = mysql.createConnection(db);
// 执行数据库连接 
connection.connect();

io.on('connection', function (socket) {
    console.log('新用户连接');
    //监听新用户加入
    socket.on('login', function (obj) {
        console.log('新用户登录');
        socket.name = obj.userName;
        console.log(obj)
        getUserNume({type:1, name: obj.userName})
    }); //登录结束

    //监听用户退出
    socket.on('disconnect', function () {
        //将退出用户在在线列表删除
        sqlstring = `Select * From user WHERE  userName='${socket.name}'`;
        console.log('登出的用户名', socket.name)
        connection.query(sqlstring, function (err, result) {
            console.log('查看退出角色', result)
            if(err){
                console.log('[SELECT ERROR] - ', err);
                return;
            }
            if(result && result.length < 1) {
                console.log('[SELECT ERROR] - ', '数据库内 查找不到该用户');
            } else {
                sqlstring = `Update user Set state = '2' WHERE userName = '${socket.name}'`;
                connection.query(sqlstring, function (err, result) {
                    if(err){
                        console.log('[UPDATE ERROR] - ', err.message);
                        return;
                    }        
                    console.log(`${socket.name}退出了聊天室`);
                    getUserNume({type:1, name: socket.name})
                });
            }
        });
       
    })

    //监听用户发布聊天内容
    socket.on('message', function (obj) {
        //向所有客户端广播发布的消息
        io.emit('message', obj);
        console.log(obj.userName + '说：' + obj.content);
    });

    //获取 在线，离线,在线用户列表信息
    function getUserNume({onOffLineCount = 0, onlineCount = 0, type, name} = {}){
        console.log('用户名', name)
        var sqlstring = `Select state, COUNT(*) as num From user GROUP BY state`;
        connection.query(sqlstring, function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ', err);
                return;
            }
            if (result && result.length < 1) {
                console.log('[SELECT ERROR] - ', '数据库内 查找不到该用户');
                return;
            }
            //获取在线离线用户数量
            for(let i of result) {
                console.log('查询到的统计数据', i)
                if(i.state == 1) {
                    onlineCount = i.num; //在线人数
                } else if(i.state == 2) {
                    onOffLineCount = i.num //离线人数
                }
            }

            //获取在线用户列表
            var sqlstring = `SELECT u.userName,u.password,u.state,ua.fileName,ua.fileUrl,ua.filePath from USER AS u left JOIN userdata AS ua on u.userName = ua.userName WHERE u.state = '1'`;
            connection.query(sqlstring, function (err, result) {
                // var userList = [];
                console.log('返回的数据:', result);
                // for(let i of result) {
                //     userList.push(i.userName);
                // }
                let obj =  {
                    onOffLineCount: onOffLineCount, //离线人数
                    onlineCount: onlineCount, //在线人数
                    userName: name, //当前用户
                    onlineUsers: result //在线用户列表
                }
                console.log('obj', obj)
                if (type == 1) {
                    //广播消息
                    io.emit('login', obj);
                    console.log(`${name}加入了聊天室`);
                } else {
                    // //广播消息
                    io.emit('logout',obj)
                    console.log(`${name}退出了聊天室`);
                }
            });
        });
    }
    
})

exports.listen = function (_server) {
	console.log('soket监听成功')
    return io.listen(_server);
};
