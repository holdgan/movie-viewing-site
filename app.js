var express=require('express');
var path=require('path');
var mongoose=require('mongoose')
var _=require('underscore')
var Movie=require('./models/movie')
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

app.get('/movie/:id',function(req,res){
	var id=req.params.id

	Movie.findById(id,function(err,movie){
		res.render('detail',{
			title:'详情',
			movie:movie
		})
	})
})

app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'后台录入',
		movie:{
			title:'',
			director:'',
			country:'',
			year:'',
			poster:'',
			flash:'',
			summary:'',
			language:''
		}
	})
})

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

app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'列表',
			movies:movies
		})
	})
})

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