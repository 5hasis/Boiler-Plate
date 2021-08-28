const mongoose = require('mongoose');

const bcrypt = require('bcrypt')
const saltRounds = 10
var jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique:1
    },
    password: {
        type:String,
        minlength:5
    },
    lastname: {
        type:String,
        maxlength:50
    },
    role: {
        type:Number,
        default: 0
    },
    image: String,
    token: {
        type:String
    },
    tokenExp: {
        type:Number
    }
})

userSchema.pre('save', function(next){

    var user = this;

    if(user.isModified('password')){
        //비밀번호 암호화 시키기
        bcrypt.genSalt(saltRounds, function(err,salt){
            if(err) return(err)

            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, callbackf){
    //plainPassword 12345678 == 암호화된 비밀번호
     bcrypt.compare(plainPassword,this.password, function(err, isMatch){
        if(err) return callbackf(err);
        callbackf(null, isMatch)
     })
}

userSchema.methods.generateToken = function(callbackf){

    var user = this;

    //jsonwebtoken 이용하여 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err,user){
        if(err) return callbackf(err);
        callbackf(null, user)
    })
}

userSchema.statics.findByToken = function(token, callbackf){
    var user = this;


    //토큰을 decode하기
    jwt.verify(token, 'secretToken', function(err,decoded){
        //회원 아이디 이용해 회원을 찾은 다음
        //client에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        //mongoDB에 있는 함수
        user.findOne({"_id":decoded, "token":token}, function(err,user){
            if(err) return callbackf(err);
            callbackf(null, user)
        }) 
    })
}

const User = mongoose.model('User',userSchema)

module.exports = {User}