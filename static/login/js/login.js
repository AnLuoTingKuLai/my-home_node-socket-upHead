$(function () {
	$('#loginBtn')
		.on({
			click(e) {
				let userName = $('#userName')
					.val();
				let password = $('#password')
					.val();
				if (!userName) {
					alert('请输入账号')
					return;
				}
				if (!password) {
					alert('请输入密码')
					return;
				}
				$.ajax({
					type: 'POST',
					url: '/login',
					dataType: 'json',
					data: {
						userName: userName,
						password: password
					},
					success(data){
						//页面跳转
						if (data.state == 2) {
							window.location.href='/socket';
							sessionStorage.setItem('userName', userName); 
							alert('登录成功');
						} else {
							alert(data.msg)
						}
					},
					error(){
						alert('登录失败');
					}
				});
			}
		})
})