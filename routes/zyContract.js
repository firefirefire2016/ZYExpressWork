var express = require('express');
var router = express.Router();
const modelS = require('../models');
const bodyParser = require('body-parser');
const cors = require('cors');
const { INTEGER } = require('sequelize');
const { sequelize } = require('../models');
const { Op } = require("sequelize");

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET zy_contract listing. */
router.all('/', function (req, res, next) {
  //res.send('合同请求响应');
  res.json({
    list: {
      id: 1,
      result: '请求合同!'
    }
  })
})

router.all('/list', async (req, res) => {


  let list = await modelS.zycontract.findAll();

  res.json({
    list
    //message:'无法访问？！'
  })
  console.log(list);
})

//启用合同
router.all('/startUse', async (req, res) => {
  try {

    let { id, contractno } = req.body;

    let once_rent = 0;

    let where1 = {};

    where1.contractid = id;

    where1.status = {
      [Op.ne]: -1
    }

    let rentlists = await modelS.zyrentlist.findAndCountAll({
      where: where1
    })

    if (rentlists == null || rentlists.count <= 0) {
      res.json({
        code: 1,
        msg: '租金标准不能为空，请编辑好再启用'
      })
    }

    //假如存在租金标准，则自动生成2020年1月开始的账单
    if (rentlists.count >= 1) {

      var rows = rentlists.rows;



      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        //如果是首期收款
        if (parseInt(row.rentcycle) === 1) {

          // var today = new Date();

          // var year = today.getFullYear();

          // var month = parseInt(today.getMonth()) + 1;

          // var day = today.getDate();

          // if (month < 10) {
          //   month = '0' + month;
          // }

          // if (day < 10) {
          //   day = '0' + day;
          // }

          // let dateNo = year.toString() + month.toString() + day.toString();

          if (parseFloat(row.enddate)) {
            let newCollection = {
              contractid: id,
              contract_status: 1,
              status:1,
              startdate: row.startdate,
              enddate: row.enddate,
              amount_receivable: row.endamount,
              invoice_limit: row.endamount,
              billno: row.startdate + '001',
              itemname: '1',
              amount_received: row.endamount,
              invoice_amount: row.endamount,
              overstate:3,
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

          var startDay = parseInt(row.startdate.substring(6, 8));

          var endYear = parseInt(row.enddate.substring(0, 4));

          var endMonth = parseInt(row.enddate.substring(4, 6));

          var endDay = parseInt(row.enddate.substring(6, 8));

          let realMonth = 0;

          let dataMonth = startMonth;

          let date = new Date();

          let currentMonth = parseInt(date.getMonth()) + 1

          let currentYear = parseInt(date.getFullYear())

          let _endMonth = 12;

          let _endYear = currentYear;

          if(_endYear > endYear){
            _endYear = endYear;
          }

          for (let year = startYear; year <= _endYear; year++) {
            // if (year < 2020) {
            //   let leftyear = 2020 - year;
            //   let leftmonth = 12 - startMonth;
            //   let leftmonths = leftyear * 12 + leftmonth + 1;
            //   realMonth = ((leftmonths - startMonth) % cycle);//取得余数
            //   if (realMonth > 0) {
            //     //1月份减去余数得跨年前的月份，再加上周期，再减去12月，可得2020年账单开始的月份
            //     dataMonth = 13 - realMonth + cycle - 12;
            //   }
            //   else {
            //     dataMonth = 1;
            //   }
            //   year = 2019;
            //   continue;
            // }
            if (dataMonth > 12) {
              dataMonth = dataMonth - 12;
            }
            if(year === endYear && currentMonth > endMonth){
              _endMonth = endMonth;
            }
            //let count = 1;
            //通过周期性生成账单
            for (; dataMonth <= _endMonth; dataMonth = dataMonth + cycle) {

              if (year === currentYear && dataMonth > currentMonth) {
                break;
              }
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

              let newCollection = {
                contractid: id,
                contract_status: 1,
                status:1,
                startdate,
                enddate,
                amount_receivable: row.endamount,
                invoice_limit: row.endamount,
                billno: startdate + '001',
                itemname: '1',
                amount_received: row.endamount,
                invoice_amount: row.endamount,
                overstate:3,
              }

              if (year === currentYear && dataMonth + cycle > currentMonth &&
                dataMonth <= currentMonth) {
                once_rent = newCollection.amount_receivable;
                newCollection.amount_received = 0;
                newCollection.invoice_amount = 0;
              }


              let nextRent = await modelS.zycollection.create({
                ...newCollection,
              })

              //count++;

              console.log(nextRent);

            }

          }

        }

      }

      let target = await modelS.zycontract.findOne({
        where: {
          id
        }
      })

      //如果存在则更新
      if (target) {
        target = await target.update({
          contract_status: 1,
          once_rent,
        })
        res.json({
          code: 0,
          once_rent,
          msg: '启用合同成功'
        })
      }
    }



  }
  catch (error) {
    res.json({
      code: 1,
      msg: error.message
    })
  }
})

router.all('/create', async (req, res) => {
  try {
    let target = {
      contractno, startdate, enddate, rentdate, renttype,
      once_rent, rightno, tenant, tel_tenant,//联系电话
      tenant_idno, tenant_address, tenanttype, deposit,
      copytype, contract_status, rentcycle, firstdate,
      signdate, agentman, rentmode, quitdate, property_name,
      accountingunit, latefeesrate, rightid, stopdate, stopreason,
      effectdate, deldate,
    } = req.body;

    delete target.id;

    let contract = await modelS.zycontract.create({
      ...target,
      contract_status: 0,
    })
    res.json({
      code: 0,
      data: contract,
      msg: '创建合同成功'
    })

  }
  catch (error) {
    console.error();
  }


})


router.all('/update', async (req, res) => {
  try {
    let newtarget = {
      contractno, startdate, enddate, rentdate, renttype,
      once_rent, rightno, tenant, tel_tenant,//联系电话
      tenant_idno, tenant_address, tenanttype, deposit,
      copytype, contract_status, rentcycle, firstdate,
      signdate, agentman, rentmode, quitdate, property_name,
      accountingunit, latefeesrate, rightid, stopdate, stopreason,
      effectdate, deldate, id
    } = req.body;
    let target = await modelS.zycontract.findOne({
      where: {
        id: newtarget.id
      }
    })
    //如果存在则更新
    if (target) {
      target = await target.update({
        ...newtarget
      })
      res.json({
        code: 0,
        msg: '更新记录成功'
      })
    }
    else {
      res.json({
        code: 1,
        msg: '更新记录出错'
      })
    }

    console.log(target);
  }
  catch (error) {
    next(error);
  }
})

//通过id找目标
router.all('/find/:id', async (req, res) => {
  try {
    let { id } = req.params;
    let target = await modelS.zycontract.findOne({
      where: {
        id
      }
    })
    res.json({
      code: 0,
      data: target,
      msg: '成功获取'
    })
    console.log(target);
  }
  catch (error) {
    next(error);
  }
})

//修改目标状态，比如已删除
router.all('/update_status', async (req, res) => {
  try {
    let { contract_status, id } = req.body;
    let target = await modelS.zycontract.findOne({
      where: {
        id
      }
    })
    //如果存在则更新为状态
    if (target && target.contract_status != contract_status) {
      target = await target.update({
        contract_status,

      })
    }
    res.json({
      code: 0,
      msg: '成功更新状态为' + contract_status
    })
    console.log(target);
  }
  catch (error) {
    next(error);
  }
})

router.all('/list/:page/:limit', async (req, res) => {
  //状态 1：表示正常 -1：表示已删除 -2:除了删除的
  //合同状态 0:未生效 1：已生效 2:已到期 3:已失效 -1:已删除 -2:除了删除的
  //contract_status:['执行中','作废(已终止)','草稿','退租中','退租待结算','已到期'],
  try {

    let { page, limit } = req.params;
    let { contractno, renttype, startdate, enddate, agentman,
      tenant, address, contract_status, simpleaddress, accountingunit } = req.body;


    let where2 = {};

    if (simpleaddress) {
      where2.simpleaddress = {
        [Op.substring]: simpleaddress
      }
    }

    if (!contract_status && contract_status !== 0) {
      contract_status = -2;
    }

    contract_status = parseInt(contract_status);

    let where = {};

    if (agentman) {
      where.agentman = {
        [Op.substring]: agentman
      }
    }

    if (tenant) {
      where.tenant = {
        [Op.substring]: tenant
      }
    }

    if (address) {
      where.address = {
        [Op.substring]: address
      }
    }

    if (contractno != null) {
      where.contractno = {
        [Op.substring]: contractno
      }
    }

    if (renttype != null) {
      //   where.renttype = {[Op.gte]: renttype};
      where.renttype = renttype;
    }

    if (accountingunit != null) {
      where.accountingunit = accountingunit;
    }

    if (startdate != null) {
      //startdate=startdate.replace(/-/g,"");
      // startdate=startdate.replace('-',"");
      // startdate = parseInt(startdate);
      where.startdate = { [Op.gte]: startdate };
    }

    if (enddate != null) {
      where.enddate = { [Op.lte]: enddate };
    }

    //如果状态为不删除的
    if (contract_status === -2) {
      where.contract_status = {
        [Op.ne]: -1
      }
    } else {
      where.contract_status = contract_status;
    }

    if (limit == -1) {
      limit = 10;
      offset = (page - 1) * limit;
    } else {
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    }

    let { count, rows } = await modelS.zycontract.findAndCountAll({
      where,
      offset,
      limit,
      include: [
        {
          model: modelS.zypropertyright,
          where: where2
        },
        // {
        //   model: modelS.zycollection,
        // }
      ],
      order: [
        ['updatedAt', 'DESC'],
        ['createdAt', 'DESC']
      ]
    })
    // rows.forEach(row => {
    //   row['area'] = row.zypropertyrights[0].area; 
    //   row['insidearea'] = row.zypropertyrights[0].area;
    //   row['simpleaddress'] = row.zypropertyrights[0].simpleaddress;
    // });
    console.log(rows);
    res.json({
      code: 0,
      rows,
      total: count,
      msg: '成功获得条件列表,共' + rows.length + '条记录'
    })

  } catch (error) {
    next(error);
  }

})

module.exports = router;