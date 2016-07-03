var express=require('express');
var path=require('path');
var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
var port =process.env.PORT || 3000
var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser');
var app=express();
var dbUrl='mongodb://localhost/webtest1';
var logger = require('morgan');

mongoose.connect(dbUrl)

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.use(require('body-parser').urlencoded({extended: true}))
app.use(cookieParser());
app.use(cookieSession({
	name: 'session',
	keys:['key1','key2']
}));

//开发环境logger
if('development'===app.get('env')){
	app.set('showStackError',true)
	//路径log
	app.use(logger(':method:url:status'));
	//格式
	app.locals.pretty=true
	//数据log
	mongoose.set('debug',true)
}

require('./config/routes')(app)

app.listen(port);
app.locals.moment=require('moment')
app.use(express.static(path.join(__dirname,'public/')))

console.log('started on port '+port);


