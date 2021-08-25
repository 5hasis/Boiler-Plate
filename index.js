const express = require('express')
const app = express()
const port = 5000

const config = require('./config/key');

//application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:true}));

//application/json
//app.use(bodyParser.json());
app.use(express.json());

//const bodyParser = require('body-parser');
const{ User } = require("./models/User");

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Conntected...')) //mongoDB와 잘 연결되었다는 문구 출력
  .catch(err => console.log(err))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Hello World!앙뇽~')
})

//회원가입을 위한 route
app.post('/register', (req, res) => {
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