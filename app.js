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
var zyDictRouter = require('./routes/zyDict');
var zyProperty = require('./routes/zyProperty');
var zyRentlist = require('./routes/zyRentlist');
var schedule = require('node-schedule');
const { Op } = require("sequelize");

const cors = require('cors');
const mysql = require("mysql");
//const sequelize = require('sequelize');
const modelS = require('./models');
const { json } = require('sequelize');

//const testuser = require('./models/testuser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//请保存并提交，上传至远程仓库
//这次轮到分支自己上传
// app.listen('4000',()=>{

//    console.log("4000服务启动成功");
// })



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
app.use('/zyDict', zyDictRouter);
app.use('/zyProperty', zyProperty);
app.use('/zyRentlist', zyRentlist);


const updateRent = async()=>{
  //TODO
}


const updateContract = async () => {

  try {
    let where = {};

    let where2 = {};

    where.contract_status = {
      [Op.or]: [1, 2, 3]//找到1已生效2即将到期3已到期的合同
    }

    let { count, rows } = await modelS.zycontract.findAndCountAll({
      where,
      include: [
        {
          model: modelS.zypropertyright,//同时要带有产权的
          where: where2,
        }
      ]
    })

    console.log('总共有' + count + '个：');

    rows.forEach(async row => {
      //console.log(JSON.stringify(row));
      //现在开始判断他的合同状态
      //先获取它的到期日期
      let enddate = parseInt(row.enddate);
      let today = parseInt(getToday());

      //假如为过期，但在距离结束日期小于3个月
      if (today < enddate && enddate - today <= 300) {
        //更新为即将到期
        let warnStatus = 2;
        let target = await modelS.zycontract.findOne({
          where: {
            id: row.id
          }
        })
        //如果存在则更新
        if (target) {
          target = await target.update({
            contract_status: warnStatus//合同状态3为已到期
          })
        }
        else {
          console.log('更新失败，目标不存在');
        }
      }

      //假如日期已超过结束日期
      if (today >= enddate) {
        //更新为已到期
        let overStatus = 3;
        let target = await modelS.zycontract.findOne({
          where: {
            id: row.id
          }
        })
        //如果存在则更新
        if (target) {
          target = await target.update({
            contract_status: overStatus//合同状态3为已到期
          })
        }
        else {
          console.log('更新失败，目标不存在');
        }
      }


    });
  } catch (error) {
    console.log(error.message);
  }


}

function getToday() {
  var today = new Date();

  var year = today.getFullYear();

  var month = parseInt(today.getMonth()) + 1;

  var day = today.getDate();

  if (month < 10) {
    month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day;
  }

  let dateNo = year.toString() + month.toString() + day.toString();

  return dateNo;

}


function scheduleRecurrenceRule() {

  var rule = new schedule.RecurrenceRule();
  // rule.dayOfWeek = 2;
  // rule.month = 3;
  // rule.dayOfMonth = 1;
  // rule.hour = 1;
  // rule.minute = 42;
  rule.second = 0;

  schedule.scheduleJob(rule, function () {
    updateContract();
  });

}



scheduleRecurrenceRule();


function scheduleCancel() {

  var counter = 1;
  var j = schedule.scheduleJob('* * * * * *', function () {

    console.log('定时器触发次数：' + counter);
    counter++;

  });

  setTimeout(function () {
    console.log('定时器取消')
    j.cancel();
  }, 5000);

}

scheduleCancel();


app.get('/find/:id', async (req, res) => {
  //let {id} = req.params;
  let user = await modelS.testUser.findOne({
    where: { id: req.params.id }
  });
  res.json({
    user
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
