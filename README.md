
# 安装

``` 
$ git clone
$ npm install
$ npm install -g supervisor //监听项目
$ npm start (必创建数据库 否则会出错)

```

# 创建MySql数据库

uaer表：

userName| password| state
:-: | :-: | :-:
用户名(主键) | 密码 | 登录状态

user_data表：

userName | fileUrl | fileName | filePath | filter| upDate
:-: | :-: | :-: | :-: | :-: | :-:
用户名（主键, 外键) | 文件相对服务器路径 | 文件名 | 文件存储路径 |  滤镜效果|  创建时间

修改config文件夹里面db.js的配置为新建的数据库


# 项目布局
```
|-- bin 							
|	|-- www 						//项目启动文件
|-- config							//存放配置文件的夹
|	|-- db.js 						//配置项目数据库
|	|-- server.js					//配置端口号
|-- doc								//说明文档
|-- routes							//路由用响应
|-- static							//静态文件目录
|	|-- base						//基础的公用文件
|	|	|-- css						//编译后的css文件
|	|	|-- sass					//sass文件
|	|	|-- font					//font字体文件夹
|	|	|-- images					//图片文件
|	|	|-- js						//js文件
|	|	|-- plugins					//插件
|	|	|-- views					//静态html文件
|-- views  							//视图（默认 404 500等页面）
|-- app.js  						//服务器配置
|-- package.json					// 项目及工具的依赖配置文件
|-- README.md						// 说明
```