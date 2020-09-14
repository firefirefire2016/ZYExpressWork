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
router.all('/', function(req, res, next) {
  res.json({
    list:{
      id:1,
      result:'请求收款表!试试'
    }
  })
})

router.all('/list',async (req,res)=>{
    let list = await modelS.zycollection.findAll();

    res.json({
      list
      //message:'无法访问？！'
    })
    console.log(list);
})


router.all('/create',async (req,res)=>{
  try{
    let {contractid,month,amount_received = 0,amount_receivable = 0,invoice_amount = 0,year} = req.body;
    let collection = await modelS.zycollection.create({    
        contractid,
        year,
        month,
        amount_received,
        amount_receivable,
        invoice_amount,
        status:1
    })
    console.log(collection);
    res.json({
      code:0,
      msg:'创建成功',
      data:collection
    })

  }
  catch(error){
    console.error();
  }
  

})


router.all('/update',async (req,res)=>{
  try{
    let {contractid,month,amount_received,amount_receivable,invoice_amount,id} = req.body;
    let target = await modelS.zycollection.findOne({
          where:{
            id
          }
    })
    //如果存在则更新
    if(target){
      target = await target.update({
        contractid,
        month,
        amount_received,
        amount_receivable,
        invoice_amount
      })

    }
    res.json({
      //rows,
      code:0,
      date:target,
      msg:'更新记录成功'
    })
    console.log(target);
  }
  catch(error){
    next(error);
  }
})

//通过id找目标
router.all('/find/:id',async (req,res)=>{
  try{
    let {id} = req.params;
    let target = await modelS.zycollection.findOne({
          where:{
            id
          }
    })
    res.json({
      code:0,
      data:target,
      msg:'成功获取'
    })
    console.log(target);
  }
  catch(error){
    next(error);
  }
})

//修改目标状态及应收款，比如已删除
router.all('/delbyContract',async(req,res)=>{
    try{
      let {status,id,month_rent} = req.body;
      let target = await modelS.zycollection.findAll({
            where:{
              contractid : id
            }
      })
      //如果存在则更新为状态
      target.forEach(async collection => {
        if(collection && collection.status != status){
          collection = await collection.update({
            status,
            amount_receivable:month_rent
          })
        }
      });
      
      res.json({
        code: 0,
        msg:'成功更新状态为' + status
      })
      //console.log(target);
    }catch(error){
      next(error);
    }
})

//修改目标状态，比如已删除
router.all('/update_status',async (req,res)=>{
  try{
    let {status,id} = req.body;
    let target = await modelS.zycollection.findOne({
          where:{
            id
          }
    })
    //如果存在则更新为状态
    if(target && target.status != status){
      target = await target.update({
        status
      })
    }
    res.json({
      code: 0,
      msg:'成功更新状态为' + status
    })
    console.log(target);
  }
  catch(error){
    next(error);
  }
})

router.all('/list/:status/:page/:limit',async (req,res)=>{
  //状态 1：表示正常 -1：表示已删除 0：表示全部 2:表示终止 3:除了删除的
  //1.通过合同id找收款表
  try {
    let {status,page,limit} = req.params;
    let {contractid} = req.body;
    let offset = {};

    let where2 = {};

    let {month_rent,tenant} = req.body;

    let {year,month,amount_received,invoice_amount} = req.body;

    if(month_rent){
      month_rent = parseFloat(month_rent);
      where2.month_rent = {
        [Op.gte]:month_rent
      }
    }

    if(tenant){
      where2.tenant = {
        [Op.substring]:tenant
      }
    }

    status = parseInt(status);
    let where = {};
    if(status != 0){
      if(status === 3){
        where.status =  {
          [Op.or]: [1, 2]
        }
      }else{
        where.status = status;
      }        
    }

    if(year){
      year = parseInt(year);
      where.year = year;
    }

    if(month){
      month = parseInt(month);
      where.month = month;
    }

    if(amount_received){
      amount_received = parseFloat(amount_received);
      where.amount_received = {
        [Op.gte]:amount_received
      }
    }

    if(invoice_amount){
      invoice_amount = parseFloat(invoice_amount);
      where.invoice_amount = {
        [Op.gte]:invoice_amount
      }
    }



    if(contractid){
      where.contractid = contractid;
    }


    

    if(limit == -1){
      const amount = await modelS.zycollection.count({
        where
      });
      limit = amount;
      limit = parseInt(limit);
      offset = (page-1)*limit;
    }else{
      limit = parseInt(limit);
      offset = (page-1)*limit;
    }    

    const {count,rows} = await modelS.zycollection.findAndCountAll({
          where,
          offset,
          limit,
          //include:modelS.zycontract,
          include:[{
            model:modelS.zycontract,
            where:where2
          }],
          order:[
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
      code:0,
      rows,
      total:count,
      msg:'成功获得条件列表,共' + count + '条记录'
    })
  } catch (error) {
    next(error.message);
  }
  
})

module.exports = router;