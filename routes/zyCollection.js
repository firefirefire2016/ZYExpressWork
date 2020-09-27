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
      amount_received = 0, contractno,
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
      amount_received, id, contractno,
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

//针对账单汇总查询
router.all('/mergelist/:page/:limit', async (req, res) => {
  //状态 1：表示正常 -1：表示已删除 -2:除了删除的
  //合同状态 0:未生效 1：已生效 2:已到期 3:已失效 -1:已删除 -2:除了删除的
  //1.通过合同id找收款表
  try {
    //limit=-1的话，先查找总数量，再进行查询
    let { page, limit } = req.params;
    let { billno, itemname, contractid, contract_status,
      status, contractno, startdate, enddate,
    } = req.body;
    let { isOwe, needInvoice, nowrealrent, nowrealinvoice, overstate, rentdate, simpleaddress } = req.body;

    let offset = {};

    let where2 = {};

    let where3 = {};


    if (rentdate) {
      where2.rentdate = rentdate
    }

    if (contractno) {
      where2.contractno = {
        [Op.substring]: contractno
      }
    }

    if (simpleaddress) {
      where3.simpleaddress = {
        [Op.substring]: simpleaddress
      }
    }

    where2.contract_status = {
      [Op.not]: 0
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
    }

    //如果合同状态为不要删除的
    if (contract_status === -2) {
      where2.contract_status = {
        [Op.gt]: 0
      }
    } else {
      where2.contract_status = contract_status;
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
    if (contractid) {
      where.contractid = contractid
    }


    if (limit == -1) {
      limit = 10;
      offset = (page - 1) * limit;
    } else {
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    }

    //先找所有符合条件的合同
    let contracts = await modelS.zycontract.findAndCountAll(
      {
        where: where2,
        include: [{
          model: modelS.zypropertyright,
          where:where3,
        }],
      }
    )


    let targetRentlist = [];


    let rows = contracts.rows;


    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      where.contractid = row.id;
      //通过指定合同id，找到本期账单，通过降序找到最近的一期账单，结束日期和开始日期都为最大值
      let item = await modelS.zycollection.findOne({
        where,
        offset,
        limit,        

        order: [
          [Sequelize.cast(Sequelize.col('enddate'), 'SIGNED'), 'DESC'],
          [Sequelize.cast(Sequelize.col('startdate'), 'SIGNED'), 'DESC']
        ]
      })

      if (item === null) {
        continue
      }

      item = item.dataValues;

      item.contractno = row.contractno;

      item.simpleaddress = row.zypropertyrights[0].simpleaddress;

      item.rentdate = row.rentdate;

      //判断该账单是否符合条件
      if (parseInt(nowrealrent) === 1 &&  item.amount_received > 0) {
        continue;
      }

      if (parseInt(nowrealrent) === 2 && item.amount_received <= 0) {
        continue;
      }

      if (parseInt(nowrealinvoice) === 1 && item.invoice_amount > 0) {
        continue;
      }
      
      if (parseInt(nowrealinvoice) === 2 && item.invoice_amount <= 0) {
        continue;
      }

      item.nowneedrent = item.amount_receivable;

      item.nowrealrent = item.amount_received;

      item.nowneedinvoice = item.invoice_limit;

      item.nowrealinvoice = item.invoice_amount;

      let totalrents = await modelS.zycollection.findAndCountAll({
        where,
        offset,
        limit
      })

      let totalrows = totalrents.rows;

      let totalneedAmount = 0;

      let totalrealAmount = 0;

      let totalneedInvoice = 0;

      let totalrealInvoice = 0

      for (let index = 0; index < totalrows.length; index++) {
        const row = totalrows[index];
        totalneedAmount += parseFloat(row.amount_receivable) ;

        totalneedInvoice += parseFloat(row.invoice_limit) ;

        totalrealAmount += parseFloat(row.amount_received) ;

        totalrealInvoice += parseFloat(row.invoice_amount) ;

      }

      item.totalneedAmount = totalneedAmount;

      item.totalrealAmount = totalrealAmount;

      item.totalneedInvoice = totalneedInvoice;

      item.totalrealInvoice = totalrealInvoice;

      let oweAmount = totalneedAmount - totalrealAmount;

      let invoiceNeed = totalneedInvoice - totalrealInvoice;

      //isOwe,needInvoic,nowrealrent,nowrealinvoice,overstate,
      //累计未收，'全部', '无欠费', '其他'
      //累计未开,'全部', '无欠票', '其他'

      if (isOwe != undefined && parseInt(isOwe) === 1 && oweAmount > 0) {
        continue
      }
      else if(isOwe != undefined && parseInt(isOwe) === 2 && oweAmount <= 0){
        continue
      }

      if (needInvoice != undefined && parseInt(needInvoice) === 1 && invoiceNeed > 0) {
        continue
      }
      else if(needInvoice != undefined && parseInt(needInvoice) === 2 && invoiceNeed <= 0){
        continue
      }

      if (oweAmount > 0) {
        item.isOwe = oweAmount;
      }
      else if (oweAmount <= 0) {
        item.isOwe = '无欠费';
      }

      if (invoiceNeed > 0) {
        item.needInvoice = invoiceNeed;
      }
      else if (invoiceNeed <= 0) {
        item.needInvoice = '无欠票';
      }

      targetRentlist.push(item);

    }

    // limit = parseInt(limit);
    // offset = (page - 1) * limit;

    let newList = [];

    let long = offset + limit;

    for (let index = offset; index < offset + limit; index++) {
      const element = targetRentlist[index];
      if(element){
        newList.push(element);
      }
      
    }

    console.log(newList);
    res.json({
      code: 0,
      newList,
      total: targetRentlist.length,
      msg: '成功获得条件列表,共' + targetRentlist.length + '条记录'
    })
  } catch (error) {
    next(error.message);
  }

})

//详情账单查询，一般账单查询
router.all('/list/:page/:limit', async (req, res) => {
  //状态 1：表示正常 -1：表示已删除 -2:除了删除的
  //合同状态 0:未生效 1：已生效 2:已到期 3:已失效 -1:已删除 -2:除了删除的
  //1.通过合同id找收款表
  try {
    //limit=-1的话，先查找总数量，再进行查询
    let { page, limit } = req.params;
    let { billno, itemname, overstate, simpleaddress, rentdate, contractid, contract_status,
      status, contractno, amount_select, invoice_select, startdate, enddate } = req.body;

    let offset = {};

    let where2 = {};

    let where3 = {};

    if (rentdate) {
      where2.rentdate = rentdate
    }

    if (contractno) {
      where2.contractno = {
        [Op.substring]: contractno
      }
    }

    if (simpleaddress) {
      where3.simpleaddress = {
        [Op.substring]: simpleaddress
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
      where2.contract_status = {
        [Op.gt]: 0
      }
    } else {
      where2.contract_status = contract_status;
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
    if (parseInt(amount_select) === 1) {
      where.amount_received = 0
    }
    //选择其他，则查询实际收款为大于0的
    if (parseInt(amount_select) === 2) {
      where.amount_received = {
        [Op.gt]: 0
      }
    }

    //选择未缴费，则查询实际收款为0的
    if (parseInt(invoice_select) === 1) {
      where.invoice_amount = 0
    }
    //选择其他，则查询实际收款为大于0的
    if (parseInt(invoice_select) === 2) {
      where.invoice_amount = {
        [Op.gt]: 0
      }
    }

    if (contractid) {
      where.contractid = contractid
    }

    // where.contractid = {
    //   [Op.col]:'zycollection.contractid'
    // }



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

    let { count, rows } = await modelS.zycollection.findAndCountAll({
      where,
      offset,
      limit,
      //include:modelS.zycontract,
      include: [{
        model: modelS.zycontract,
        where: where2,
        include:[{
          model:modelS.zypropertyright,
          where: where3,
        }]
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

    for (let index = 0; index < rows.length; index++) {
      rows[index].dataValues.simpleaddress = rows[index].dataValues.zycontract.zypropertyrights[0].simpleaddress;
      
    }

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