var indexDB = window.indexedDB; //window.indexedDB获取IDBFactory，打开数据库的工厂对象，用于创建或打开数据库，并管理数据库版本
console.log(indexDB);
var curDb = null;
//创建数据库
function openDB({
	name = myDB.name,
	version = myDB.version,
	tableName = myDB.tableName
}) {
	/*
	 * {string} name 数据库名字
	 * {number} version 数据库版本
	 */
	//判断版本号
	// var version = version || 1;
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
	//创建数据库
	var request = indexedDB.open(name, version);
	//出错的时候
	request.onerror = function (e) {
		console.log('打开数据库出错!');
	};
	// 成功的时候
	request.onsuccess = function (e) {
		myDB.db = e.target.result;
		console.log("链接数据库成功");
		//查询全部数据
		getAllKey();
	};
	// 版本不一样的时候
	request.onupgradeneeded = function (e) {
		var db = e.target.result;
		//表名字
		if (!db.objectStoreNames.contains(myDB.tableName)) {
			//keyPath:"id , 主见为id
			//autoIncrement: true, 设置自动下标
			var store = db.createObjectStore(myDB.tableName, {
				keyPath: "key",
				autoIncrement: true
			});
			//添加唯一索引
			store.createIndex('username', 'username', {
				unique: true
			});
			//添加不唯一索引
			store.createIndex('nName', 'nickname', {
				unique: false
			});

		}
		//后台出书版本修改信息
		console.log('数据库版本号修改为 ' + version);
	};
}
//显示数据数量
function showCount(objectStore) {
	var reque = objectStore.count(); //数据库访问方法
	reque.onsuccess = function () {
		var count = event.target.result;
	}
}
//显示用户列表
function showUser(objectStore) {
	var request = objectStore.getAllKeys();
	request.onsuccess = function () {
		var keys = event.currentTarget.result;
		for (var i = 0; i < keys.length; i++) {
			var id = key[i];
			var obj = objectStore;
			var li = $("<li></li>");
			li.html(list[i].username);
			$("#list")
				.append(li);
		}
	}
}
//关闭数据库
function closeDB(db) {
	/*
	 *{object} db 数据库
	 */
	db.close();
}
//添加数据
function addData(db = myDB.db, tableName = myDB.tableName, tableContent) {
	/*
	 *{object} db 数据库
	 *{object} tableName 表名字
	 */
	/*
		*transaction 第一个值为存储的名字 第二个值为 什么事务
	    * 1.只读：read，不能修改数据库数据，可以并发执行
	    * 2.读写：readwrite，可以进行读写操作
	    * 3.版本变更：verionchange

	*/
	var transaction = db.transaction(tableName, 'readwrite');
	//store 存储的内容
	var store = transaction.objectStore(tableName);
	// for (var i = 0; i < tableContent.length; i++) {
	// 	store.add(tableContent[i]);
	// }
	store.add({
		username: $('#username')
			.val(),
		password: $('#password')
			.val(),
		nickname: $('#nickname')
			.val()
	});
	getAllKey();
	alert('添加成功');
	console.log('添加成功');
}
// 删除数据库
function deleteDB(name = myDB.name) {
	/*
	 *{string} name 需要删除的数据库的名字
	 */
	// alert(`删除了数据库${name}`);
	// console.log(`删除了数据库${name}`);
	// indexedDB.deleteDatabase(name);
	var deleteDbRequest = indexedDB.deleteDatabase(name);
	deleteDbRequest.onsuccess = function (e) {
		getAllKey();
		alert('删除成功');
	};
	deleteDbRequest.onerror = function (e) {
		alert(`删除失败：${e.target.errorCode} `);
		console.log("Database error: " + e.target.errorCode);
	};
}
// 清空数据
function clearAll({
	db = myDB.db,
	tableName = myDB.tableName,
	keyName
} = {}) {
	var transaction = db.transaction(tableName, 'readwrite');
	var store = transaction.objectStore(tableName);
	var request = store.clear()
	request.onsuccess = function (event) {
		alert('清空数据库成功');
		getAllKey();
		// result.innerHTML = "'Employees' object store cleared";
	};
	request.onerror = function (event) {
		alert('删除失败');
	};
}
//删除数据
function deleteDataByKey(db, tableName, keyName) {
	/*
	 *{object} db 数据库
	 *{object} tableName 表名字
	 *{string} keyName 关键字
	 */
	var transaction = db.transaction(tableName, 'readwrite');
	var store = transaction.objectStore(tableName);
	store.delete(keyName);
}
// 更新数据
function updateDataByKey({
	db = myDB.db,
	tableName = myDB.tableName,
	upData
} = {}) {
	/*
	 *{object} db 数据库
	 *{object} tableName 表名字
	 *{string} upData 关键字
	 */
	var transaction = db.transaction(tableName, 'readwrite');
	var store = transaction.objectStore(tableName);
	if (!parseInt($('#checkKey')
			.val())) {
		alert('请输入唯一标识符');
		return;
	}
	var request = store.get(parseInt($('#checkKey')
		.val()));
	request.onsuccess = function (e) {
		//获取数据对象
		var data = e.target.result;
		data.username = $('#username')
			.val();
		data.password = $('#password')
			.val();
		// 修改
		store.put(data);
		//刷新
		getAllKey();
	};
}
// 查找数据
function getDataByKey({
	db = myDB.db,
	tableName = myDB.tableName,
	keyName
}) {
	/*
	 *{object} db 数据库
	 *{object} tableName 表名字
	 *{string} keyName 关键字
	 */
	keyName = $("#checkKey")
		.val(); //获取关键字
	var $result = $('#getDataMsg'); //查询信息对象
	var transaction = db.transaction(tableName, 'readwrite');
	var store = transaction.objectStore(tableName);
	var request = store.get(parseInt(keyName));
	request.onsuccess = function (e) {
		//输出对象
		var employee = e.target.result;
		if (employee == null) {
			$result.html('查询不到数据')
		} else {
			var jsonStr = JSON.stringify(employee);
			$result.html(jsonStr);
		}
	};
};
//获取全部数据列表
function getAllKey({
	db = myDB.db,
	tableName = myDB.tableName,
} = {}) {
	/*
	 *{object} db 数据库
	 *{object} tableName 表名字
	 */
	var $result = $('#getAllDataList'); //查询信息对象
	var transaction = db.transaction(tableName, 'readwrite');
	var store = transaction.objectStore(tableName);
	var request = store.getAll();
	request.onsuccess = function (e) {
		//输出对象
		var employee = e.target.result;
		if (employee == null) {
			$result.html('查询不到数据')
		} else {
			let list = [];
			for (let i of employee) {
				list.push(JSON.stringify(i));
			}
			var jsonStr = list.join('</br>');
			$result.html(jsonStr);
		}
	};
};
//使用索引查找
function userNameCheck({
	db = myDB.db,
	tableName = myDB.tableName,
} = {}) {
	/*
	 *{object} db 数据库
	 *{object} tableName 表名字
	 */
	if (myDB != null && myDB.db != null) {
		var range = IDBKeyRange.only($('#checkKey')
			.val());
		var $result = $('#getDataMsg'); //查询信息对象
		var transaction = db.transaction(tableName);
		var store = transaction.objectStore(tableName);
		var index = store.index("username"); //必须有名为username的索引
		index.get(range)
			.onsuccess = function (e) {
				//输出对象
				var employee = e.target.result;
				if (employee == null) {
					$result.html('查询不到数据')
				} else {
					var jsonStr = JSON.stringify(employee);
					$result.html(jsonStr);
				}
			};
	};
};
// 游标迭代
function fetchAllEmployees({
	db = myDB.db,
	tableName = myDB.tableName,
} = {}) {
	var result = document.getElementById("getDataMsg");
	result.innerHTML = "</br>";
	var transaction = db.transaction(tableName);
	var store = transaction.objectStore(tableName);
	var request = store.openCursor();
	let i = 0;
	request.onsuccess = function (evt) {
		var cursor = evt.target.result;
		if (cursor) {
			var employee = cursor.value;
			var jsonStr = JSON.stringify(employee);
			result.innerHTML = result.innerHTML + `${i}:${jsonStr}<br>`;
			i++;
			cursor.continue(); //下一步
		}
	};
}

function fetchNewYorkEmployees({
	db = myDB.db,
	tableName = myDB.tableName,
	type
} = {}) {
	var result = document.getElementById("getDataMsg");
	result.innerHTML = "";
	var range = null;
	switch (type) {
		case 1: //查找指定值
			console.log('查找指定值');
			range = IDBKeyRange.only($('#checkKey')
				.val());
			break;
		case 2: //查找大于指定数的值
			console.log('查找大于指定数的值');
			range = IDBKeyRange.lowerBound($('#checkKey')
				.val());
			break;
		case 3: //查找小于指定数的值
			console.log('查找小于指定数的值');
			range = IDBKeyRange.upperBound($('#checkKey')
				.val());
			break;
		case 4: //XXX到XXX的值
			console.log('查找小于指定数的值');
			range = IDBKeyRange.bound($('#checkKey')
				.val(), "9999", true, true)
			break;
	}
	var transaction = db.transaction(tableName);
	var store = transaction.objectStore(tableName);
	var index = store.index("nName");
	index.openCursor(range)
		.onsuccess = function (evt) {
			var cursor = evt.target.result;
			if (cursor) {
				var employee = cursor.value;
				var jsonStr = JSON.stringify(employee);
				result.innerHTML = result.innerHTML + "<br>" + jsonStr;
				cursor.continue(); //下一步
			}
		};
}
var myDB = {
	//数据库名称
	name: 'csDB',
	// 数据库版本号
	// version: 1,
	//表名
	tableName: "cesName",
	// 数据库数据
	db: null
};
//创建数据库
openDB({});