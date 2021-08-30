const express = require('express')
const app = express()

const cookieParser = require('cookie-parser');
const config = require('./config/key');
const{ User } = require("./models/User");
const{ auth } = require("./middleware/auth");

//application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:true}));

//application/json
//app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser())

//const bodyParser = require('body-parser');

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Conntected...')) //mongoDB와 잘 연결되었다는 문구 출력
  .catch(err => console.log(err))

const port = 5000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World!앙뇽~')
})

app.get('/api/hello', (req,res)=>{
  res.send("안녕하세요~")
})

//회원가입을 위한  register route
app.post('/api/users/register', (req, res) => {
  //회원가입시 필요한 정보들을 client에서 가져오면
  //그걸들을 데이터 베이스에 넣어줌
  
  const user = new User(req.body)

  //save() : mongoDB에서 오는 메소드
  user.save((err, userInfo) => {
      if(err) return res.json({success:false, err}) //에러메세지 함께 전달
      return res.status(200).json({
        success: true
    })
  })

})

app.post('/api/users/login', (req,res) => {
  //1.요청된 이메일을 데이터베이스에 있는지 찾는다
  User.findOne({email: req.body.email}, (err,user)=>{
    if(!user){
      return res.json({
        loginSuccess:false,
        message : "입력한 이메일에 해당하는 정보가 없습니다."
      })
    }

  //2.요청된 이메일이 DB에 있다면 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        })

      //3.비밀번호가 맞다면 토큰 생성.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
        res.cookie("x_auth",user.token)
        .status(200)
        .json({loginSuccess:true, userId: user._id})

      })

    })
  })
})


app.get('/api/users/auth', auth,(req, res) => {
  //여기까지 middelware를 통과해왔다는 얘기는 Authentication이 True라는 말

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, //role이 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })

})

app.get('/api/users/logout',auth, (req,res) => {
  User.findByIdAndUpdate({_id: req.user._id},
    {token:""},
    (err,user) => {
      if(err) return res.json({successfalse, err});
      return res.status(200).send({
        success:true
      })
    })
})