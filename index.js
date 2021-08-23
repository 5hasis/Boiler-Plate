const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!앙뇽')
})

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ohasis:1234@boilerplate.l0hi1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Conntected...')) //mongoDB와 잘 연결되었다는 문구 출력
  .catch(err => console.log(err))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})