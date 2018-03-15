$(function () {
    var userInfo = {
        'userName': sessionStorage.getItem('userName')
    };
    /*按钮点击效果*/
    $('#sendBtn')
        .on({
            mousedown() {
                $(this)
                    .css({
                        'background': "#007aff",
                        'color': "#ffffff"
                    });
            },
            mouseup() {
                $(this)
                    .css({
                        'background': "#e8e8e8",
                        'color': "#ffffff"
                    });
            },
            click(e) {
                emitMsg()
               
            }
        })
    $('#msg').on({
        keydown(e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                emitMsg();
                return false;
            }
        }
    })
    //生成 soket实例
    var socket = io.connect("ws://172.21.215.121:8099");
    //通知服务器有用户登录
    if (userInfo && userInfo.userName) {
        socket.emit('login', userInfo);
    } else {
        alert('请先登录');
        setTimeout(() => {
            window.location.href="../login/login.html"
        }, 2000)
    }
    //监听新用户登录
    socket.on('login', function (o) {
        updateMsg(o, 'login');
    });
    //监听用户退出
    socket.on('logout', function (o) {
        updateMsg(o, 'logout');
    });
    //发送消息
    socket.on('message', function (obj) {
        //聊天列表
        if (obj.userName == userInfo.userName) {
            var MsgHtml = '<section class="user clearfix">' + '<span>' + obj.userName + '</span>' + '<div>' + obj.content + '</div>' + '</section>';
        } else {
            var MsgHtml = '<section class="server clearfix">' + '<span>' + obj.userName + '</span>' + '<div>' + obj.content + '</div>' + '</section>';
        }
        $('.main-body')
            .append(MsgHtml);
        $('.main-body')
            .scrollTop(99999);
    })
    function logout() {
        socket.disconnect();
        location.reload();
    }
    /*监听函数*/
    function updateMsg(o, action) {
        //离线数
        var onOffLineCount = o.onOffLineCount;
        //当前在线数
        var onlineCount = o.onlineCount;
        //新加用户
        var userName = o.userName;
        //更新在线人数
        var userList = o.userList;

        //生成用户列表
        var userListHtml = '';
        for (key of userList) {
            userListHtml += `${key} 、`
        }
        //在线数量
        $('.chatNum').text(onlineCount);
        //离线数量
        $('.offchatNum').text(onOffLineCount);
        //在线人列表
        $('.chatList').text(userListHtml);
        //系统消息
        if (action == 'login') {
            var sysHtml = '<section class="chatRoomTip"><div>' + userName + '进入聊天室</div></section>';
        }
        if (action == "logout") {
            var sysHtml = '<section class="chatRoomTip"><div>' + userName + '退出聊天室</div></section>';
        }
        //系统消息
        $(".main-body")
            .append(sysHtml);
        $('.main-body')
            .scrollTop(99999);
    }
    //发送信息
    function emitMsg(e){
        var $msg = $('#msg');
        var content = $msg.val();
        if (content) {
            var obj = {
                'userName': userInfo.userName,
                'content': content
            }
            socket.emit('message', obj);
            $msg.val("");
        }
    }
});