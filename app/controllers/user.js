var User=require('../models/user')

//注册弹窗
exports.signup=function(req,res){
	var _user=req.body.user

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(user){
			return res.redirect('/signin');
		}
		else{
			var user=new User(_user)

			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.redirect('/')
			})
		}
	})
}

//登录弹窗
exports.signin=function(req,res){
	var _user=req.body.user
	var name=_user.name
	var password=_user.password

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}

		if(!user){
			// console.log('no signup');
			return res.redirect('/signup')
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				req.session.user=user
				// console.log('password compare')
				return res.redirect('/')
			}
			else{
				return res.redirect('/signin')
				// console.log('password err')
			}
		})
	})
}


//登出
exports.logout=function(req,res){
	delete req.session.user
	res.redirect('/')
}

//用户列表
exports.list=function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist',{
			title:'用户列表',
			users:users
		})
	})
}

//注册
exports.showSignup=function(req,res){
	res.render('signup',{
			title:'注册',
	})
}

//登录
exports.showSignin=function(req,res){
	res.render('signin',{
			title:'登录',
	})
}

//中间件  登录
exports.signinRequired=function(req,res,next){
	var user=req.session.user
	if(!user){
		return res.redirect('/signin')
	}
	next()
}

//中间件  权限
exports.adminRequired=function(req,res,next){
	var user=req.session.user
	if(user.role<=10){
		return res.redirect('/signin')
	}
	next()
}
