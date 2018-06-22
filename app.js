var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator')
var cookieParser = require('cookie-parser'); //获取cookie用
var bodyParser = require('body-parser'); //编码解析用
var fs = require("fs"); //文件上传
var multer = require('multer'); //上传中间控件

var routes = require('./routes/index');

var app = express();

app.use(multer({ dest: '/tmp/'}).array('image'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, './static/favicon.ico')));

var logDirectory = path.join(__dirname, 'logs')
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// 创建日志文件
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: path.join(logDirectory, '%DATE%-log.log'),
  frequency: 'daily',
  verbose: false
})

// 自定义token
morgan.token('from', function(req, res){
    return req.query.from || '-';
});

// 自定义format，其中包含自定义的token
morgan.format('joke', '[joke] :method :remote-addr :url :status :res[content-length] - :response-time ms :remote-user :req[header]');

// 使用自定义的format
app.use(morgan('joke', {stream: accessLogStream}))
app.use(morgan('joke'))

app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
//允许上传大文件
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cookieParser());
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'static/base'))); // 公用的基础文件
app.use(express.static(path.join(__dirname, 'static/homePage'))); //主页
app.use(express.static(path.join(__dirname, 'static/photo'))); //图片特效
app.use(express.static(path.join(__dirname, 'static/login'))); //登录
app.use(express.static(path.join(__dirname, 'static/socket'))); //socket
app.use(express.static(path.join(__dirname, 'static/localStorage'))); //localStorage
app.use(express.static(path.join(__dirname, 'static/indexDB'))); //indexDB
app.use(express.static(path.join(__dirname, 'static/mvvm'))); //MVVM

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
