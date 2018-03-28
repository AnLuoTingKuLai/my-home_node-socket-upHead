 // 修改自官方demo的js
$(function () {
 	var userInfo = {
 		'userName': sessionStorage.getItem('userName')
 	};
 	//截图插件初始化
 	var initCropper = function (img, input) {
 		var $image = img;
 		var options = {
 			aspectRatio: 1, // 纵横比
 			viewMode: 1,
 			preview: '.img-preview', // 预览图的class名
 			crop: function (e) {
 			}
 		};
 		$image.cropper(options);
 		$('.img-container')
			.on({
				dblclick(e) {
					console.log(1111)
					imgCrop();
				}
			});
		$('#cutImg')
			.on({
				click(e) {
					console.log(2222)
					imgCrop();
				}
			});

 		//图片变动的时候
 		var $inputImage = input;
 		var uploadedImageURL;
 		if (URL) {
 			// 给input添加监听
 			$inputImage.change(function () {
 				var files = this.files;
 				var file;
 				if (!$image.data('cropper')) {
 					return;
 				}
 				if (files && files.length) {
 					file = files[0];
 					// 判断是否是图像文件
 					if (/^image\/\w+$/.test(file.type)) {
 						// 如果URL已存在就先释放
 						if (uploadedImageURL) {
 							URL.revokeObjectURL(uploadedImageURL);
 						}
 						uploadedImageURL = URL.createObjectURL(file);
 						// 销毁cropper后更改src属性再重新创建cropper
 						$image.cropper('destroy')
 							.attr('src', uploadedImageURL)
 							.cropper(options);
 						$inputImage.val('');
 					} else {
 						window.alert('请选择一个图像文件！');
 					}
 				}
 			});
 		} else {
 			$inputImage.prop('disabled', true)
 				.addClass('disabled');
 		}
 	}
 	//获取用户头像
 	$.ajax({
 		url: "/getUserHeadImg",
 		data: JSON.stringify({
 			'userName': userInfo.userName
 		}),
 		success: function (obj) {
 			$('#photo')
 				.attr('src', `${obj.data.fileUrl}${obj.data.fileName}`);
 			//初始化插件
 			initCropper($('#photo'), $('#upImg'));
 		}
 	});
 	//剪切图片
 	function imgCrop() {
 		var $image = $('#photo');
 		var $target = $('#result');
 		//获取裁剪后的canvas对象
 		var result = $('#photo')
 			.cropper("getCroppedCanvas", {
 				width: 150,
 				height: 150
 			});
 		//将canvas对象转换为base64
 		var dataurl = result.toDataURL('image/jpeg', 1);
 		//设置文件
 		$target.attr('src', dataurl)
 		document.body.appendChild(result);
 		//发起post请求
 		var base64 = dataurl;
 		
 		$.ajax({
 			contentType: "application/x-www-form-urlencoded; charset=utf-8",
 			url: '/setUserHeadImg',
 			data: {
	 			'file': base64,
	 			'userName': userInfo.userName
	 		},
 		})
 		// var data = `file=${base64}&userName=${userInfo.userName}`;
 		// var xhr = new XMLHttpRequest();
 		// xhr.onreadystatechange = function (event) {
 		// 	if (xhr.readyState == 4) { //4:解析完毕
 		// 		if (xhr.status == 200) { //200:正常返回
 		// 			console.log(xhr)
 		// 		}
 		// 	}
 		// };
 		// xhr.open('POST', '/setUserHeadImg', true); //true为异步
 		// xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
 		// xhr.send(data);
 	}
 });