var User=require('../models/user')

//注册用户
exports.signup=function(req,res){
	var _user=req.body.user

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(user){
			return res.redirect('/');
		}
		else{
			var user=new User(_user)

			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.redirect('/admin/userlist')
			})
		}
	})
}

//登录
exports.signin=function(req,res){
	var _user=req.body.user
	var name=_user.name
	var password=_user.password

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}

		if(!user){
			console.log('no signup');
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				req.session.user=user
				console.log('password compare')
				res.redirect('/')
			}
			else{
				console.log('password err')
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