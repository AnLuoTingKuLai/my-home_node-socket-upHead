
#安装
> 
```base
$npm install
$set DEBUG=myapp & npm start
```
> 
# 项目布局
> 

|-- bin                            
|    |-- www 						 //项目启动文件
|-- config                           
|    |-- db.js                       // 项目数据库
|-- doc                           	 // 说明文档
|-- routes                           // 路由用响应
|-- static                           // 静态文件目录
|    |-- css						 //css文件
|    |-- images						 //图片文件
|    |-- js							 //js文件
|    |-- plugins					 //插件
|    |-- views						 //静态html文件
|-- views  							 //视图(404 500等)
|-- app.js  						 //服务器配置
|-- package.json                     // 项目及工具的依赖配置文件
|-- README.md                        // 说明