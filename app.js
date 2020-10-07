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


const addRentByContract = async () => {

  try {
    //第一步先找到合同
    //条件1 合同状态是已生效、即将过期的
    //条件2 合同带有产权
    let where = {};

    let where1 = {};

    where.contract_status = {
      [Op.or]: [1, 2]
    }

    let { count, rows } = await modelS.zycontract.findAndCountAll({
      where,
      include: [
        {
          model: modelS.zypropertyright,
          where: where1
        },
      ],
    })

    //第二步，循环遍历每个合同，找到合同对应的租金标准
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      let once_rent = 0;//这个是合同当期租金

      let where2 = {};

      where2.contractid = row.id;//对应的合同id

      let contract_status = row.contract_status;

      let contractid = row.id;

      where2.status = {
        [Op.ne]: -1
      }

      let rentlists = await modelS.zyrentlist.findAndCountAll({
        where: where2
      })

      //若没有租金标准则跳过
      if (rentlists == null || rentlists.count <= 0) {
        continue;
      }

      //找到租金标准后
      //假如存在租金标准，则自动生成最新一期的账单
      if (rentlists.count >= 1) {

        var rentRows = rentlists.rows;

        let today = parseInt(getToday());//今天为1号


        for (let index = 0; index < rentRows.length; index++) {
          const row = rentRows[index];
          //如果是首期收款,且首期收款初始日期在当前月，则在1号这天生成首期收款账单
          if (parseInt(row.rentcycle) === 1 &&
            parseInt(row.startdate) >= today && //初始日期在当前月
            parseInt(row.startdate) - today <= 30
          ) {

            let dateNo = getToday();

            if (parseFloat(row.enddate)) {
              let newCollection = {
                contractid: contractid,
                contract_status: contract_status,
                startdate: row.startdate,
                enddate: row.enddate,
                amount_receivable: row.endamount,
                invoice_limit: row.endamount,
                billno: dateNo + '001',
                overstate:3,
                itemname: '1',
                amount_received: 0,
                invoice_amount: 0,
              }

              let firstRent = await modelS.zycollection.create({
                ...newCollection,
                remarks: '首期收款',
              })
            }

          }
          else if (parseInt(row.rentcycle) >= 2) {
            //如果是后面的周期性收款，则根据周期生成账单
            let cycle = parseInt(row.rentcycle) - 1;//这是周期，1到12

            var startYear = parseInt(row.startdate.substring(0, 4));

            var startMonth = parseInt(row.startdate.substring(4, 6));

            let dataMonth = startMonth;

            let date = new Date();

            let currentMonth = parseInt(date.getMonth()) + 1

            let currentYear = parseInt(date.getFullYear())

            for (let year = startYear; year <= currentYear; year++) {
              if (dataMonth > 12) {
                dataMonth = dataMonth - 12;
              }
              //通过周期性走到目标期数
              for (; dataMonth <= 12; dataMonth = dataMonth + cycle) {
                if (year === currentYear && dataMonth > currentMonth) {
                  break;
                }
                //刚好到当期，则生成账单
                if (year === currentYear && dataMonth + cycle > currentMonth &&
                  dataMonth <= currentMonth) {
                  let startdate, enddate;
                  if (dataMonth < 10) {
                    startdate = year.toString() + '0' + dataMonth.toString() + '01';
                  }
                  else {
                    startdate = year.toString() + dataMonth.toString() + '01';
                  }
                  if (dataMonth + 1 < 10) {
                    enddate = year.toString() + '0' + (dataMonth + 1).toString() + '01';
                  }
                  else {
                    enddate = year.toString() + (dataMonth + 1).toString() + '01';
                    if (dataMonth == 12) {
                      enddate = (year + 1).toString() + '0101';
                    }
                  }
                  //账单生成时默认逾期情况为正常
                  //账单生成时间为每周期1号
                  let newCollection = {
                    contractid: contractid,
                    contract_status: contract_status,
                    startdate,
                    enddate,
                    overstate:3,
                    amount_receivable: row.endamount,
                    invoice_limit: row.endamount,
                    billno: startdate + '001',
                    itemname: '1',
                    amount_received: 0,
                    invoice_amount: 0,
                  }

                  once_rent = newCollection.amount_receivable;

                  let nextRent = await modelS.zycollection.create({
                    ...newCollection,
                  })
                }
                else {
                  continue;
                }

              }

            }

          }

        }

        let target = await modelS.zycontract.findOne({
          where: {
            id: contractid
          }
        })

        //如果存在则更新
        if (target) {
          target = await target.update({
            //contract_status: 1,
            once_rent,
          })
        }
      }



    }
  } catch (error) {
    console.log(error.message);
  }


}

//每天更新账单逾期情况
const updateRent = async () => {
  try {

    let where = {};

    let where2 = {};


    where.status = {
      [Op.ne]: -1
    }

    where.overstate = {
      [Op.or]: [1, 3]//逾期情况是1即将逾期3正常的
    }

    where2.contract_status = {
      [Op.gte]: 0//合同状态为已生效的0-4
    }

    //首先要找到账单，条件1 账单未被删除的
    //条件2 合同未被删除的，合同状态>= 0 ，0-4
    //条件3 合同不需要带有产权的
    let { count, rows } = await modelS.zycollection.findAndCountAll({
      where,
      include: [
        {
          model: modelS.zycontract,
          where: where2,
        }
      ]
    })

    console.log('总共有' + count + '个：');

    rows.forEach(async row => {
      //console.log(JSON.stringify(row));
      //现在开始判断他的逾期情况
      //先获取它的收款提醒日日期
      let startdate = row.startdate;
      startdate = startdate.substr(0, 6);
      let rentdate = parseInt(row.zycontract.rentdate) ;
      if(rentdate < 10){
        rentdate = '0' + rentdate;
      }
      let warndate = parseInt(startdate + rentdate.toString());
      let today = parseInt(getToday());

      //假如未逾期，但距离提醒日小于3天
      if (today <= warndate && warndate - today <= 3 && row.overstate === '3' && 
        (row.amount_receivable > row.amount_received || row.invoice_limit > row.invoice_amount)
         ) {
        //更新为即将逾期
        let warnState = 1;
        let target = await modelS.zycollection.findOne({
          where: {
            id: row.id
          }
        })
        //如果存在则更新
        if (target) {
          target = await target.update({
            overstate: warnState//合同状态1为即将逾期
          })
        }
        else {
          console.log('更新失败，目标不存在');
        }
      }

      //假如日期已超过提醒日期
      if (today > warndate && (row.overstate === '1' || row.overstate === '3') && 
      (row.amount_receivable > row.amount_received || row.invoice_limit > row.invoice_amount)) {
        //更新为已逾期
        let overState = 2;
        let target = await modelS.zycollection.findOne({
          where: {
            id: row.id
          }
        })
        //如果存在则更新
        if (target) {
          target = await target.update({
            overstate: overState//逾期情况2为已逾期
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

      //假如未过期，但在距离结束日期小于3个月
      if (today < enddate && enddate - today <= 300 && row.contract_status === 1) {
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
            contract_status: warnStatus//合同状态2为即将到期
          })
        }
        else {
          console.log('更新失败，目标不存在');
        }
      }

      //假如日期已超过结束日期
      if (today >= enddate && row.contract_status < 3) {
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



//scheduleRecurrenceRule();


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
