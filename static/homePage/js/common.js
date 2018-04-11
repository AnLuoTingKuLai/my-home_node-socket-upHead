
$(function(){
	$.ajaxSetup({
 		type: "POST",
 		dataType: "JSON",
 		contentType: "application/json; charset=utf-8",
 		error: function (jqXHR, textStatus, errorThrown) {
 			switch (jqXHR.status) {
 				case (500):
 					alert("服务器系统内部错误");
 					break;
 				case (401):
 					alert("未登录");
 					break;
 				case (403):
 					alert("无权限执行此操作");
 					break;
 				case (408):
 					alert("请求超时");
 					break;
 				default:
 					// alert("未知错误");
 			}
 		},
 		success: function (data) {
 			console.log("操作成功");
 		}
 	});

	// 代码懒加载
	(function($, w, document, undefined) {
	    var $w = $(w);
	    $.mlazyload = function(opts) {
	        var settings = {
	            lazyDom: opts.lazyDom?opts.lazyDom:null,
	            container : w,
	        };
	        if( !settings.lazyDom ) { //如果不传输dom 那么就一直不存在
	            return false;
	        }
	        var prec1 = getClient(); //获取文档框高
	        var prec2 = getSubClient(settings.lazyDom); //获取dom宽高

	        return intens(prec1, prec2); //如果存在dom 那么就返回是否在视图中

	        //返回浏览器的可视区域位置  
	        function getClient() {
	            var l, t, w, h;
	            l = document.documentElement.scrollLeft || document.body.scrollLeft;
	            t = document.documentElement.scrollTop || document.body.scrollTop;
	            w = document.documentElement.clientWidth;
	            h = document.documentElement.clientHeight;
	            return {
	                'left': l,
	                'top': t,
	                'width': w,
	                'height': h
	            };
	        }

	        //返回待加载资源位置  
	        function getSubClient(lazyDom) {
	            var l = 0,
	                t = 0,
	                w, h;
	            w = lazyDom.width();
	            h = lazyDom.height();

	            l += lazyDom.offset().left
	            t += lazyDom.offset().top
	            return {
	                'left': l,
	                'top': t,
	                'width': w,
	                'height': h
	            };
	        }

	        //判断两个矩形是否相交,返回一个布尔值  
	        function intens(rec1, rec2) {
	            var lc1, lc2, tc1, tc2, w1, h1;
	            lc1 = rec1.left + rec1.width / 2;
	            lc2 = rec2.left + rec2.width / 2;
	            tc1 = rec1.top + rec1.height / 2;
	            tc2 = rec2.top + rec2.height / 2;
	            w1 = (rec1.width + rec2.width) / 2;
	            h1 = (rec1.height + rec2.height) / 2;
	            return Math.abs(lc1 - lc2) <= w1 && Math.abs(tc1 - tc2) <= h1;
	        }

	    }
	})(jQuery, window, document);
})
