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


router.all('/create', async (req, res) => {
  try {
    let target = {
      contractno, startdate, enddate, renttype, rightno,
      rentdate, month_rent, deposit, tenant, tel_tenant,
      rentcycle, firstdate, signdate, agentman, rentmode,
      needcopy, quitdate, property_name, address
    } = req.body;
    // rentcycle: DataTypes.STRING,//付款周期
    // firstdate:DataTypes.STRING,//首期收款日
    // signdate:DataTypes.STRING,//签订日期
    // agentman:DataTypes.STRING,//对接人 
    // rentmode:DataTypes.STRING,//租金模式 
    // needcopy:DataTypes.STRING,//是否需要抄表
    // quitdate:DataTypes.STRING,//退租日期
    // property_name:DataTypes.STRING,//物业名称
    let contract = await modelS.zycontract.create({
      ...target,
      contract_status: 1,
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
      contractno, startdate, enddate, renttype, rightno,
      rentdate, month_rent, deposit, tenant, tel_tenant,
      rentcycle, firstdate, signdate, agentman, rentmode,
      needcopy, quitdate, property_name, address, contract_status,
      id
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
      const { count, rows } = await modelS.zycontract.findAndCountAll({
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