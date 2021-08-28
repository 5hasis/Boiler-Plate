
const{ User } = require("../models/User");

let auth = (req, res, next) => {
    //인증 처리를 하는 곳

    //client cookie에서 token 가져오기
    let token = req.cookies.x_auth;

    //token을 복호화한 후 회원 찾기
    User.findByToken(token, (err,user)=> {
        if(err) throw err;
        if(!user) return res.json({isAtuh:false, err:true})

        req.token = token;
        req.user = user;
        next() //next()가 없으면 middelware에 갖혀버림
    })

    //회원이 있으면 인증 Okay

    //없으면 인증 No
}

//다른 파일에서도 쓸 수 있게 export
module.exports = {auth};