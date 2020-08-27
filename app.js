var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var zyContractRouter = require('./routes/zyContract');
var zyCollectionRouter = require('./routes/zyCollection');
var zyUnitRouter = require('./routes/zyUnit');
var zyWaterEleRouter = require('./routes/zyWaterEle');

const cors = require('cors');
const mysql = require("mysql");
//const sequelize = require('sequelize');
const modelS = require('./models');

//const testuser = require('./models/testuser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//请保存并提交，上传至远程仓库
//这次轮到分支自己上传
app.listen('4000',()=>{

   console.log("4000服务启动成功");
})

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
  // console.log('你好');
  // res.json({
  //   code:0,
  //   //data:contract.dataValues,
  //   msg:'创建成功哈'
  // })
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/list', usersRouter);

app.use('/zyContract', zyContractRouter);
app.use('/zyCollection', zyCollectionRouter);
app.use('/zyUnit', zyUnitRouter);
app.use('/zyWaterEle', zyWaterEleRouter);

 




app.get('/find/:id',async(req,res)=>{
    //let {id} = req.params;
    let user = await modelS.testUser.findOne({ 
      where: { id : req.params.id }
    });
    res.json({
      user
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
