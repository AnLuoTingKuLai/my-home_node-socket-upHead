
loadAll();

function save() {
	var key = $("#key")
		.val();
	var value = $("#value")
		.val();
	localStorage.setItem(key, value); //设置localStorage
	sessionStorage.setItem(key, value); //设置sessionStorage
	loadAll();
	console.log("添加成功");
}
//查找数据  
function find() {
	var $list = $("#list3");
	var key = $("#search")
		.val();
	var value = localStorage.getItem(key);
	var value2 = sessionStorage.getItem(key);
	$list.html(`key:${key}</br>localStorage:${value}</br>sessionStorage:${value2}`);
}
//清空数据
function empty() {
	var $list = $("#list3");
	$list.html(``);
	localStorage.clear();
	sessionStorage.clear();
	loadAll();
}
//加载列表
function loadAll() {
	var $list = $("#list"); //localStorage;
	var $list2 = $("#list2"); //sessionStorage;
	//localStorage
	if (localStorage.length > 0) {
		var result = '<table class="table">';
		result += "<tr><td>index</td><td>key</td><td>value</td></tr>";
		//循环内容
		for (var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i); //使用下表获取key值
			var value = localStorage.getItem(key); //使用key 获取value值
			result += `<tr><td>${i}</td><td>${key}</td><td>${value}</td></tr>`;
		}
		result += "</table>";
		$list.html(result);
	} else {
		$list.html("数据为空……");
	}
	//sessionStorage
	if (sessionStorage.length > 0) {
		var result = '<table class="table">';
		result += "<tr><td>index</td><td>key</td><td>value</td></tr>";
		//循环内容
		for (var i = 0; i < sessionStorage.length; i++) {
			var key = sessionStorage.key(i); //使用下表获取key值
			var value = sessionStorage.getItem(key); //使用key 获取value值
			result += `<tr><td>${i}</td><td>${key}</td><td>${value}</td></tr>`;
		}
		result += "</table>";
		$list2.html(result);
	} else {
		$list2.html("数据为空……");
	}
}
