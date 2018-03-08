

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
        socket.name = decodeURIComponent(obj.username);
        // 查询数据  
        sqlstring = `Select * From user WHERE userName='${decodeURIComponent(obj.username)}'`;

        console.log(decodeURIComponent(obj.username))
        connection.query(sqlstring, function (err, result) {
            if(err || result && result.length < 1){
                // 插入数据
                sqlstring = `Insert into user Values('${decodeURIComponent(obj.username)}', '123456', '1')`;
                console.log('不存在这个用户的话:', sqlstring);
                connection.query(sqlstring, function (err, result) {
                    if(err){
                        console.log('[插入失败] - ', err.message);
                        return;
                    }        
                    console.log('插入成功')
                    getUserNume({type:1, name: decodeURIComponent(obj.username)})
                    var sqlstring = "";
                });
                console.log('[SELECT ERROR] - ', err ? err.message : '无此数据');
                return;
            }
            console.log(result)
            console.log(`'${decodeURIComponent(obj.username)}',存在于数据库内`);

                // 更新数据
                sqlstring = `Update user Set state = '1' Where userName = '${decodeURIComponent(obj.username)}'`;
                connection.query(sqlstring, function (err, result) {
                    if(err || result && result.length < 1){
                        console.log('[UPDATE ERROR] - ', err.message);
                        return;
                    }        
                    console.log('更新成功'); 
                });

            getUserNume({type:1, name: decodeURIComponent(obj.username)})
            var sqlstring = "";
       });
    }); //登录结束

    // // 监听用户退出
    socket.on('disconnect', function () {
        //将退出用户在在线列表删除
        sqlstring = `Select * From user WHERE  userName='${socket.name}'`;
        console.log(socket.name)
        connection.query(sqlstring, function (err, result) {
            console.log('查看退出角色', result)
            if(err || result && result.length < 1){
                console.log('[SELECT ERROR] - ', err ? err.message : '无此数据');
                return;
            }
            console.log(`'${socket.name}',存在于数据库内`);
            // // // 更新数据
            sqlstring = `Update user Set state = '2' WHERE userName = '${socket.name}'`;
            connection.query(sqlstring, function (err, result) {
                if(err){
                    console.log('[UPDATE ERROR] - ', err.message);
                    return;
                }        
                console.log('用户退出'); 
                getUserNume({type:1, name: socket.name})
            });
            console.log(`${socket.name}退出了聊天室`);
        });
       
    })

    function getUserNume({onOffLineCount = 0, onlineCount = 0, type, name} = {}){
        var sqlstring = `Select state, COUNT(*) as num From user GROUP BY state`;
        connection.query(sqlstring, function (err, result) {
            if(err || result && result.length < 1){
                console.log('[SELECT ERROR] - ', err ? err.message : '无此数据');
            }
            for(let i of result) {
                console.log('查询到的统计数据', i)
                if(i.state == 1) {
                    onlineCount = i.num
                } else if(i.state == 2) {
                    onOffLineCount = i.num
                }
            }

            var sqlstring = `Select userName From user WHERE state = '1'`;
            connection.query(sqlstring, function (err, result) {
                var userList = [];
                for(let i of result) {
                    userList.push(encodeURIComponent(i.userName));
                }

                let obj =  {
                    onOffLineCount: onOffLineCount,
                    onlineCount: onlineCount,
                    user: encodeURIComponent(name),
                    userList: userList
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
