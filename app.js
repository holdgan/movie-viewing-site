var express=require('express');
var path=require('path');
var mongoose=require('mongoose')
var _=require('underscore')
var Movie=require('./models/movie')
var User=require('./models/user')
var port =process.env.PORT || 3000
var app=express();

mongoose.connect('mongodb://localhost/webtest1')

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(require('body-parser').urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public/')))
app.locals.moment=require('moment')
app.listen(port);

console.log('started on port '+port);


//首页
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'首页',
			movies:movies
		})
	})	
})


//注册用户
app.post('/user/signup',function(req,res){
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
})


//电影详情
app.get('/movie/:id',function(req,res){
	var id=req.params.id

	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title:movie.title+'详情',
			movie:movie
		})
	})
})


//录入电影
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'后台录入',
		movie:{
			title:'',
			director:'',
			country:'',
			year:'',
			poster:'',
			flash:'http://player.video.qiyi.com/c19bec8ea58e4fda8726fa9b65b63a44/0/0/w_19rt21y5u1.swf-albumId=5781367909-tvId=5781367909-isPurchase=0-cnId=10',
			summary:'',
			language:''
		}
	})
})

//电影列表-修改
app.get('/admin/update/:id',function(req,res){
	var id=req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'后台更新页',
				movie:movie
			})
		})
	}
})

//新的电影
app.post('/admin/movie/new',function(req,res){
	var id=req.body.movie._id
	var movieObj=req.body.movie
	var _movie

	if(id!=='undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie=_.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movie._id)
			})
		})
	}
	else{
		_movie=new Movie({
			director:movieObj.director,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})

		_movie.save(function(err,movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+movie._id)
		})
	}
})

//电影列表
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'电影列表',
			movies:movies
		})
	})
})

//电影列表
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist',{
			title:'用户列表',
			users:users
		})
	})
})


//电影列表-删除
app.delete('/admin/list',function(req,res){
	var id=req.query.id

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success:1})
			}
		})
	}
})

// app.get('/',function(req,res){
// 	res.render('index',{
// 		title:'首页',
// 		movies:[{
// 			title:'钢铁侠',
// 			_id:1,
// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
// 		},{
// 			title:'钢铁侠',
// 			_id:2,
// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
// 		},{
// 			title:'钢铁侠',
// 			_id:3,
// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
// 		},{
// 			title:'钢铁侠',
// 			_id:4,
// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
// 		},{
// 			title:'钢铁侠',
// 			_id:5,
// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
// 		},{
// 			title:'钢铁侠',
// 			_id:6,
// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
// 		}]
// 	})
// })

// app.get('/movie/:id',function(req,res){
// 	res.render('detail',{
// 		title:'详情',
// 		movie:{		
// 			director:'sun',
// 			country:'China',
// 			title:'SUN',
// 			year:2016,
// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
// 			language:'Chinese',
// 			flash:'http://player.youku.com/player.php/Type/Folder/Fid/27495291/Ob/1/sid/XMTYxNTkzMjI5Mg==/v.swf',
// 			summary:'dasddjkashdajksdhskhdjksdhskhkjdshdkskjhkjh'
// 		}
// 	})
// })

// app.get('/admin/movie',function(req,res){
// 	res.render('admin',{
// 		title:'后台录入',
// 		movie:{
// 			title:'',
// 			director:'',
// 			country:'',
// 			year:'',
// 			poster:'',
// 			flash:'',
// 			summary:'',
// 			language:''
// 		}
// 	})
// })

// app.get('/admin/list',function(req,res){
// 	res.render('list',{
// 		title:'列表',
// 		movies:[{
// 			title:'SUN',
// 			_id:1,
// 			director:'sun',
// 			country:'China',
// 			year:2016,
// 			language:'CHinese',
// 			flash:'http://player.youku.com/player.php/Type/Folder/Fid/27495291/Ob/1/sid/XMTYxNTkzMjI5Mg==/v.swf'

// 		}]
// 	})
// })