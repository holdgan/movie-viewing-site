var _=require('underscore')
var Movie=require('../models/movie')
var Comment=require('../models/comment')

//电影详情
exports.detail=function(req,res){
	var id=req.params.id

	Movie.findById(id,function(err,movie){
		Comment
			.find({movie:id})
			.populate('from','name')
			.populate('reply.from reply.to','name')
			.exec(function(err,comments){
				res.render('detail',{
					title:movie.title+'详情',
					movie:movie,
					comments:comments
			})
		})
	})
}


//录入电影
exports.save=function(req,res){
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
}

//电影列表-修改
exports.update=function(req,res){
	var id=req.params.id

	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'后台更新页',
				movie:movie
			})
		})
	}
}

//新的电影
exports.new=function(req,res){
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
}

//电影列表
exports.list=function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'电影列表',
			movies:movies
		})
	})
}

//电影列表-删除
exports.del=function(req,res){
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
}