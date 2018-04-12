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
    $('#msg')
        .on({
            keydown(e) {
                e = e || window.event;
                if (e.keyCode == 13) {
                    emitMsg();
                    return false;
                }
            }
        })
    $('.filter')
        .on({
            click(e) {
                $.when($.ajax({
                    url: '/setFilter',
                    data: JSON.stringify({
                        'userName': userInfo.userName,
                        'filter': $(this).data('filter')
                    })
                })).then(req => {
                    if(req.state == 2) {
                        $('[data-own-head = "true"]').attr({
                            class: `img-head img-o-head filter filter-${$(this).data('filter')}`
                        })
                    }
                });
            }
        })
    //生成 soket实例
    var socket = io.connect("ws://120.27.212.237:80");
    //通知服务器有用户登录
    if (userInfo && userInfo.userName) {
        socket.emit('login', userInfo);
    } else {
        alert('请先登录');
        setTimeout(() => {
            window.location.href = "../login/login.html"
        }, 2000)
    }
    //监听新用户登录
    socket.on('login', function (o) {
        updateMsg(o, 'login');
        $.when($.ajax({
                url: '/getUserInfo',
                data: JSON.stringify({
                    'userName': userInfo.userName
                })
            }))
            .then(req => {
                if (req.state == 2) {
                    let src = '../images/head.js'
                    if (req.data && req.data.fileUrl) {
                        src = `${req.data.fileUrl}${req.data.fileName}`;
                    };
                    $('#img-head')
                        .attr({
                            'src': src,
                        });
                    if (req.data.filter) {
                        $('#img-head')
                            .addClass(`filter filter-${req.data.filter}`)
                    };
                    $('.head-filter-list')
                        .find('img')
                        .attr({
                            'src': src
                        });
                }
            })
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
        $('#chatWrap')
            .append(MsgHtml);
        $('#chatWrap')
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
        var userList = o.onlineUsers;
        //生成用户列表
        var userListHtml = '';
        for (user of userList) {
            //获取滤镜
            let filter = user.filter ? `filter filter-${user.filter}` : '';
            let flageOwn = false;
            if (user.userName == userInfo.userName) {
                flageOwn = true;
            }

            userListHtml += `
                <img data-own-head="${flageOwn}" class="img-o-head ${filter}" src="${user.fileUrl}${user.fileName}" alt="$(userName)">
            `
        }
        //在线数量
        $('.chatNum')
            .text(onlineCount);
        //离线数量
        $('.offchatNum')
            .text(onOffLineCount);
        //在线人列表
        $('.chat-list')
            .html(userListHtml);
        //系统消息
        if (action == 'login') {
            var sysHtml = '<section class="chat-room-tip"><div>' + userName + '进入聊天室</div></section>';
        }
        if (action == "logout") {
            var sysHtml = '<section class="chat-room-tip"><div>' + userName + '退出聊天室</div></section>';
        }
        //系统消息
        $("#chatWrap")
            .append(sysHtml);
        //默认头像设置
        $('.img-o-head')
            .add($('#img-head'))
            .on({
                error() {
                    $(this)
                        .attr({
                            src: '/images/head.jpg'
                        })
            }
        })
        $('#chatWrap')
            .scrollTop(99999);
    }
    //发送信息
    function emitMsg(e) {
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