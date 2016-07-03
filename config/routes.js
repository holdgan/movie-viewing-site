var Index=require('../app/controllers/index')
var Movie=require('../app/controllers/movie')
var User=require('../app/controllers/user')

module.exports=function(app){

	app.use(function(req,res,next){
		var _user=req.session.user
		app.locals.user=_user
		return next()
	})

	//首页
	app.get('/',Index.index)

	//注册用户
	app.post('/user/signup',User.signup)
	//登录
	app.post('/user/signin',User.signin)
	//登出
	app.get('/logout',User.logout)
	//用户列表
	app.get('/admin/userlist',User.list)

	//电影详情
	app.get('/movie/:id',Movie.detail)
	//录入电影
	app.get('/admin/movie',Movie.save)
	//电影列表-修改
	app.get('/admin/update/:id',Movie.update)
	//新的电影
	app.post('/admin/movie/new',Movie.new)
	//电影列表
	app.get('/admin/list',Movie.list)
	//电影列表-删除
	app.delete('/admin/list',Movie.del)

}