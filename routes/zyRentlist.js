var express = require('express');
var router = express.Router();
const modelS = require('../models');
const bodyParser = require('body-parser');
const cors = require('cors');
const { INTEGER } = require('sequelize');
const { Op } = require("sequelize");

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET zy_Dict listing. */
router.all('/', function(req, res, next) {
  res.json({
    list:{
      id:1,
      result:'请求租金列表'
    }
  })
})

router.all('/list',async (req,res)=>{
    let list = await modelS.zyrentlist.findAll();

    res.json({
      list
      //message:'无法访问？！'
    })
    console.log(list);
})


router.all('/create',async (req,res)=>{
  try{
    let newTarget = {startdate,enddate,oncerate,onceamount,endamount,contractid
      ,remarks,contract_status,rentcycle
    } = req.body;

    delete newTarget.id;

    newTarget.status = 1;

    let target = await modelS.zyrentlist.create({  
        ...newTarget,        
        
    })
    console.log(target);
    res.json({
      code: 0,
      msg: '租金标准创建成功',
      data: target
    })

  }
  catch(error){
    res.json({
      code: 1,
      msg: '创建失败' + error.message
    })
    console.error();
  }
  

})


router.all('/update',async (req,res)=>{
  try{
    let newTarget = {startdate,enddate,oncerate,onceamount,endamount,contractid
      ,remarks,contract_status,id,rentcycle
    } = req.body;
    let target = await modelS.zyrentlist.findOne({
          where:{
            id
          }
    })
    //如果存在则更新
    if(target){
      target = await target.update({
        ...newTarget
      })

    }
    console.log(target);
    res.json({
      code: 0,
      msg: '租金标准修改成功',
      data: target
    })
  }
  catch(error){
    res.json({
      code: 1,
      msg: '修改失败' + error.message
    })
    next(error);
  }
})

//修改目标状态，比如已删除
router.all('/delbyContract', async (req, res) => {
  try {
    let { contract_status, id, status } = req.body;
    let target = await modelS.zyrentlist.findAll({
      where: {
        contractid: id
      }
    })
    //如果存在则更新为状态
    target.forEach(async rent => {
      if (rent && rent.status != status) {
        rent = await rent.update({
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
    res.json({
      code: 0,
      msg:'错误为' + status
    })
    next(error);
  }
})

//修改目标状态，比如已删除
router.all('/update_status',async (req,res)=>{
  try{
    let {status,id,contract_status} = req.body;
    let target = await modelS.zyrentlist.findOne({
          where:{
            id
          }
    })
    //如果存在则更新为状态
    if(target && target.status != status){
      target = await target.update({
        contract_status,
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
    res.json({
      code: 0,
      msg:'成功更新状态为' + status
    })
    next(error);
  }
})

router.all('/list/:page/:limit',async (req,res)=>{
  //1.状态 0：表示全部 1：表示未删除 -1：表示已删除 -2:除了删除的
  try {

    let { page, limit} = req.params;
    let {startdate,enddate,oncerate,onceamount,endamount,contractid
      ,remarks,contract_status,id,status,rentcycle
    } = req.body;

    let offset = {};

    if (!contract_status && contract_status !== 0) {
      contract_status = -2;
    }

    contract_status = parseInt(contract_status);

    if (!status && status !== 0) {
      status = -2;
    }

    status = parseInt(status);

    let where = {};

    if (endamount != null) {
      where.endamount = endamount;
    }

    if (contractid != null) {
      where.contractid = contractid;
    }

    //如果状态为不要删除的
    if (status === -2) {
      where.status = {
        [Op.ne]: -1
      }
    } else {
      where.status = status;
    }

    if (limit == -1) {
      const amount = await modelS.zyrentlist.count({
        where
      });
      limit = amount;
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    } else {
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    }


    const { count, rows } = await modelS.zyrentlist.findAndCountAll({
      where,
      offset,
      limit,
    })
    console.log(rows);
    res.json({
      code: 0,
      rows,
      total: count,
      msg: '成功获得条件列表,共' + count + '条记录'
    })
  } catch (error) {
    next(error);
  }
  
})

module.exports = router;