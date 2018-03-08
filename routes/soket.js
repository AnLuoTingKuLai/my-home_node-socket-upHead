

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
        // 查询数据        sqlstring = `Select * From user WHERE userName=${decodeURIComponent(obj.username)}`;
        console.log(decodeURIComponent(obj.username))
        connection.query(sqlstring, function (err, result) {
            if(err){
                // 插入数据
                sqlstring = `Insert into user Values('${decodeURIComponent(obj.username)}', '123456', '1')`;
                console.log('不存在这个用户的话:', sqlstring);
                connection.query(sqlstring, function (err, result) {
                    if(err){
                        console.log('[插入失败] - ', err.message);
                        return;
                    }        
                    console.log('插入成功')
                });
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            console.log(`'${decodeURIComponent(obj.username)}',存在于数据库内`);

                // 更新数据
                sqlstring = `Update user Set state = '1' Where userName = '${decodeURIComponent(obj.username)}'`;
                connection.query(sqlstring, function (err, result) {
                    if(err){
                        console.log('[UPDATE ERROR] - ', err.message);
                        return;
                    }        
                    console.log('更新成功'); 
                });
           
        });

        //广播消息
       
        console.log(decodeURIComponent(obj.username) + "加入了聊天室");
        var sqlstring = "";
    })
    
})

exports.listen = function (_server) {
	console.log('soket监听成功')
    return io.listen(_server);
};
