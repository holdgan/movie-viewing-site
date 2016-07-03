var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
var SALT_WORK_FACTOR=10

var UserSchema=new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
	//角色 0:普通用户 1:确认中用户 2：完善用户 3~~~ >10：管理员 >50：超级 
	role:{
		type:Number,
		default:0
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

UserSchema.pre('save',function(next){
	var user=this
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}
	else{
		this.updateAt=Date.now()
	}

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err) return next(err)

		bcrypt.hash(user.password,salt,function(err,hash){
			if(err) return next(err)

			console.log('加盐前的密码：'+user.password)
			user.password=hash
			console.log('加盐后的密码：'+user.password)
			next()
		})
	})
})

UserSchema.methods={
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err) return cb(err)

			cb(null,isMatch)
		})
	}
}

UserSchema.statics={
	//取出数据库所有数据
	fetch:function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	//查询数据
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}

module.exports=UserSchema