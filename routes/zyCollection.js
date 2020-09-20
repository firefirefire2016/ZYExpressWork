var express = require('express');
var router = express.Router();
const modelS = require('../models');
const bodyParser = require('body-parser');
const cors = require('cors');
const { INTEGER } = require('sequelize');
const zycontract = require('../models/zycontract');
var Sequelize = require('sequelize');
const { Op } = require("sequelize");

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET zy_collection listing. */
router.all('/', function (req, res, next) {
  res.json({
    list: {
      id: 1,
      result: '请求收款表!试试'
    }
  })
})

router.all('/list', async (req, res) => {
  let list = await modelS.zycollection.findAll();

  res.json({
    list
    //message:'无法访问？！'
  })
  console.log(list);
})


router.all('/create', async (req, res) => {
  try {
    let target = {
      amount_received = 0,contractno,
      amount_receivable = 0, invoice_amount = 0,
      startdate, enddate, itemname, overstate, latefees,
      invoice_limit, billno, collectdate, invoicedate
    } = req.body;
    let contract = await modelS.zycontract.findOne({
      where: {
        contractno
      }
    })
    target.contractid = contract.id;
    let collection = await modelS.zycollection.create({
      ...target,
      contract_status: 1,
      status: 1
    })
    console.log(collection);
    res.json({
      code: 0,
      msg: '创建成功',
      data: collection
    })

  }
  catch (error) {
    res.json({
      code: 1,
      msg: '创建失败' + error.message
    })
    console.error();
  }


})


router.all('/update', async (req, res) => {
  try {
    let newTarget = {
      amount_received,id,contractno,
      amount_receivable, invoice_amount,
      startdate, enddate, itemname, overstate, latefees,
      invoice_limit, billno, collectdate, invoicedate
    } = req.body;
    let contract = await modelS.zycontract.findOne({
      where: {
        contractno
      }
    })
    newTarget.contractid = contract.id;
    let target = await modelS.zycollection.findOne({
      where: {
        id
      }
    })
    //如果存在则更新
    if (target) {
      target = await target.update({
        ...newTarget
      })

    }
    res.json({
      code: 0,
      date: target,
      msg: '更新记录成功'
    })
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
    let target = await modelS.zycollection.findOne({
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
router.all('/delbyContract', async (req, res) => {
  try {
    let newStatus = { contract_status, id, status } = req.body;
    let target = await modelS.zycollection.findAll({
      where: {
        contractid: id
      }
    })
    //如果存在则更新为状态
    target.forEach(async collection => {
      if (collection && collection.contract_status != contract_status) {
        collection = await collection.update({
          contract_status,
          status
        })
      }
    });

    res.json({
      code: 0,
      msg: '成功更新状态为' + status + '，合同状态为' + contract_status
    })
    //console.log(target);
  } catch (error) {
    next(error);
  }
})

//修改目标状态，比如已删除
router.all('/update_status', async (req, res) => {
  try {
    let newStatus = { contract_status, id, status } = req.body;
    let target = await modelS.zycollection.findOne({
      where: {
        id
      }
    })
    //如果存在则更新为状态
    if (target && target.contract_status != contract_status) {
      target = await target.update({
        ...newStatus
      })
    }
    res.json({
      code: 0,
      msg: '成功更新状态为' + status + '，合同状态为' + contract_status
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
  //1.通过合同id找收款表
  try {
    //limit=-1的话，先查找总数量，再进行查询
    let { page, limit } = req.params;
    let { billno, itemname, overstate, property_name,rentdate ,contractid,contract_status,
      status,contractno,amount_select, invoice_select, startdate, enddate } = req.body;

    let offset = {};

    let where2 = {};

    if (rentdate) {
      where2.rentdate = rentdate
    }

    if (contractno) {
      where2.contractno = {
        [Op.substring]: contractno
      }
    }

    if (property_name) {
      where2.property_name = {
        [Op.substring]: property_name
      }
    }

    if (!contract_status && contract_status !== 0) {
      contract_status = -2;
    }

    if (!status && status !== 0) {
      status = -2;
    }

    contract_status = parseInt(contract_status);
    status = parseInt(status);
    let where = {};

    //如果状态为不要删除的
    if (status === -2) {
    //   where.status = {
    //     [Op.ne]: -1
    //   }
    // } else {
    //   where.status = status;
    }

    //如果合同状态为不要删除的
    if (contract_status === -2) {
      where.contract_status = {
        [Op.ne]: -1
      }
    } else {
      where.contract_status = contract_status;
    }

    if (startdate != null) {
      where.startdate = { [Op.gte]: startdate };
    }

    if (enddate != null) {
      where.enddate = { [Op.lte]: enddate };
    }


    if (billno) {
      where.billno = {
        [Op.substring]: billno
      }
    }

    if (itemname && itemname != 0) {
      where.itemname = itemname
    }

    if (overstate && overstate != 0) {
      where.overstate = overstate
    }

    //选择未缴费，则查询实际收款为0的
    if (parseInt(amount_select)  === 1) {
      where.amount_received = 0
    }
    //选择其他，则查询实际收款为大于0的
    if (parseInt(amount_select)  === 2) {
      where.amount_received = {
        [Op.gt]: 0
      }
    }

    //选择未缴费，则查询实际收款为0的
    if (parseInt(invoice_select)  === 1) {
      where.invoice_amount = 0
    }
    //选择其他，则查询实际收款为大于0的
    if (parseInt(invoice_select)  === 2) {
      where.invoice_amount = {
        [Op.gt]: 0
      }
    }

    if (contractid) {
      where.contractid = contractid
    }



    if (limit == -1) {
      const amount = await modelS.zycollection.count({
        where
      });
      limit = amount;
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    } else {
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    }

    const { count, rows } = await modelS.zycollection.findAndCountAll({
      where,
      offset,
      limit,
      //include:modelS.zycontract,
      include: [{
        model: modelS.zycontract,
        where: where2
      }],
      order: [
        [Sequelize.cast(Sequelize.col('year'), 'SIGNED'), 'DESC'],
        [Sequelize.cast(Sequelize.col('month'), 'SIGNED'), 'DESC']
      ]
      // include: [{
      //   model: modelS.zycontract,
      //   through: {
      //     attributes: ['contractno'],
      //     where: {}
      //   }
      // }]
    })
    console.log(rows);
    res.json({
      code: 0,
      rows,
      total: count,
      msg: '成功获得条件列表,共' + count + '条记录'
    })
  } catch (error) {
    next(error.message);
  }

})

module.exports = router;