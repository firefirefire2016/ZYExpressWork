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
router.all('/startUse',async(req,res) =>{
  try{

    let { id } = req.body;

    var _sourceUrl = 'zyRentlist';

    let where1 = {};

    where1.contractid = id;

    //TODO

    let rentlists = await modelS.zyrentlist.findAndCountAll({
       where:where1
    })

    //通过id获取租金标准，如果为空，则做提醒失败
    await getList(_sourceUrl, 1, -1, { contractid: id }).then(async function (res) {
        if (res.code === 0) {
            //message.info(res.msg);
        }
        else {
            message.warn('获取租金标准失败:' + res.msg);
            return;
        }
        if (res.total <= 0) {
            message.warn('租金标准不能为空，请编辑好再启用');
            return
        }
        //假如存在租金标准，则自动生成2020年1月开始的账单
        if (res.total >= 1) {
            var rentUrl = 'zyCollection';

            var rows = res.rows;

            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                //如果是首期收款
                if (row.rentcycle === '0') {

                    let dateNo = getTodayStr();
                    if (parseFloat(row.enddate) > 20200101) {
                        let newCollection = {
                            contractid: id,
                            contract_status: 1,
                            startdate: row.startdate,
                            enddate: row.enddate,
                            amount_receivable: row.endamount,
                            invoice_limit: row.endamount,
                            billno: dateNo + '001',
                            itemname: '0',
                            amount_received: 0,
                            invoice_amount: 0,
                        }
                        await createTarget(rentUrl, newCollection).then(function (res) {
                            if (res.code === 1) {
                                message.warn('自动生成账单失败:' + res.msg);
                            }
                        })
                    }
                }
                else {
                    //如果是后面的周期性收款，则根据周期生成账单
                    let cycle = parseInt(row.rentcycle);//这是周期，1到12

                    var startYear = parseInt(row.startdate.substring(0, 4));

                    var startMonth = parseInt(row.startdate.substring(4, 6));

                    var startDay = parseInt(row.startdate.substring(6, 8));

                    var endYear = parseInt(row.enddate.substring(0, 4));

                    var endMonth = parseInt(row.enddate.substring(4, 6));

                    var endDay = parseInt(row.enddate.substring(6, 8));

                    let realMonth = 0;

                    let dataMonth = startMonth;

                    for (let year = startYear; year < endYear; year++) {
                        if (year < 2020) {
                            let leftyear = 2020 - year;
                            let leftmonth = 12 - startMonth;
                            let leftmonths = leftyear * 12 + leftmonth + 1;
                            realMonth = ((leftmonths - startMonth) % cycle);//取得余数
                            if (realMonth > 0) {
                                //1月份减去余数得跨年前的月份，再加上周期，再减去12月，可得2020年账单开始的月份
                                dataMonth = 13 - realMonth + cycle - 12;
                            }
                            else {
                                dataMonth = 1;
                            }
                            year = 2019;
                            continue;
                        }
                        if (dataMonth > 12) {
                            dataMonth = dataMonth - 12;
                        }
                        //通过周期性生成账单
                        for (; dataMonth <= 12; dataMonth = dataMonth + cycle) {
                            let startdate, enddate;
                            if (dataMonth < 10) {
                                startdate = year + '0' + dataMonth + '01';
                            }
                            else {
                                startdate = year + dataMonth + '01';
                            }
                            if (dataMonth + 1 < 10) {
                                enddate = year + '0' + (dataMonth + 1) + '01';
                            }
                            else {
                                enddate = year + (dataMonth + 1) + '01';
                            }

                            let newCollection = {
                                contractid: id,
                                contract_status: 1,
                                startdate,
                                enddate,
                                amount_receivable: row.endamount,
                                invoice_limit: row.endamount,
                                billno: startdate + '001',
                                itemname: '0',
                                amount_received: 0,
                                invoice_amount: 0,
                            }
                            await createTarget(rentUrl, newCollection).then(function (res) {
                                if (res.code === 1) {
                                    message.warn('自动生成账单失败:' + res.msg);
                                }
                            })

                        }

                    }

                }

            }





        }


        //生成账单同时，合同状态改为1，已生效
        await updateOneStatus(sourceUrl,{contract_status:1,id}).then(function(res){

            if (res.code === 0) {
                message.info(res.msg);
            }
            else {
                message.warn('启用状态失败:' + res.msg);
            }

            dispatch({
                type: "COMMIT_START",
                payload: { ...res,  res }
            })

        });


    });



  }
  catch(error){
    res.json({
      code: 1,
      msg: error.message
    })
  }
})

router.all('/create', async (req, res) => {
  try {
    let target = {
      contractno,startdate,enddate,rentdate,renttype, 
      once_rent,rightno,tenant, tel_tenant,//联系电话
      tenant_idno,tenant_address,tenanttype,deposit,
      copytype,contract_status,rentcycle,firstdate,
      signdate, agentman,rentmode,quitdate,property_name,
      accountingunit,latefeesrate,rightid,stopdate,stopreason,
      effectdate,deldate,
    } = req.body;
    let contract = await modelS.zycontract.create({
      ...target,
      contract_status: 0,
    })
    console.log(contract.dataValues);
    res.json({
      code: 0,
      data: contract.dataValues,
      msg: '创建成功哈'
    })

  }
  catch (error) {
    console.error();
  }


})


router.all('/update', async (req, res) => {
  try {
    let newtarget = {
      contractno,startdate,enddate,rentdate,renttype, 
      once_rent,rightno,tenant, tel_tenant,//联系电话
      tenant_idno,tenant_address,tenanttype,deposit,
      copytype,contract_status,rentcycle,firstdate,
      signdate, agentman,rentmode,quitdate,property_name,
      accountingunit,latefeesrate,rightid,stopdate,stopreason,
      effectdate,deldate,id
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
      tenant, address, contract_status, simpleaddress,accountingunit } = req.body;


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
      const amount = await modelS.zycontract.count({
        where
      });
      limit = amount;
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    } else {
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    }


    if (limit != 0) {
      let { count, rows } = await modelS.zycontract.findAndCountAll({
        where,
        offset,
        limit,
        include: [{
          model: modelS.zypropertyright,
          where: where2
        }],
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
    } else {
      const { count, rows } = await modelS.zycontract.findAndCountAll({
        where,
        offset,
        order: [
          ['updatedAt', 'DESC'],
          ['createdAt', 'DESC']
        ]
      })
      console.log(rows);
      res.json({
        code: 0,
        rows,
        msg: '成功获得条件列表,共' + count + '条记录'
      })
    }

  } catch (error) {
    next(error);
  }

})

module.exports = router;