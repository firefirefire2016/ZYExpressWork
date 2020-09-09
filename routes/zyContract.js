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
router.all('/', function(req, res, next) {
  //res.send('合同请求响应');
  res.json({
    list:{
      id:1,
      result:'请求合同!'
    }
  })
})

router.all('/list',async (req,res)=>{
  

    let list = await modelS.zycontract.findAll();

    res.json({
      list
      //message:'无法访问？！'
    })
    console.log(list);
})


router.all('/create',async (req,res)=>{
  try{
    let {contractno,startdate,enddate,renttype,rightno,rentdate,month_rent,deposit,tenant,tel_tenant} = req.body;
    let contract = await modelS.zycontract.create({    
        contractno,
        startdate,
        enddate,
        rentdate,
        renttype,
        rightno,
        deposit,
        tenant,
        tel_tenant,
        month_rent,
        status:1
    })
    console.log(contract.dataValues);
    res.json({
      code:0,
      data:contract.dataValues,
      msg:'创建成功哈'
    })

  }
  catch(error){
    console.error();
  }
  

})


router.all('/update',async (req,res)=>{
  try{
    let {contractno,startdate,enddate,renttype,rightno,id,rentdate,month_rent,deposit,tenant,tel_tenant} = req.body;
    let target = await modelS.zycontract.findOne({
          where:{
            id
          }
    })
    //如果存在则更新
    if(target){
      target = await target.update({
        contractno,
        startdate,
        enddate,
        rentdate,
        renttype,
        deposit,
        tenant,
        tel_tenant,
        month_rent,
        rightno
      })

    }
    res.json({
      //rows,
      code:0,
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
    let target = await modelS.zycontract.findOne({
          where:{
            id
          }
    })
    res.json({
      code:0,
      data:target,
      message:'成功获取'
    })
    console.log(target);
  }
  catch(error){
    next(error);
  }
})

//修改目标状态，比如已删除
router.all('/update_status',async (req,res)=>{
  try{
    let {status,id} = req.body;
    let target = await modelS.zycontract.findOne({
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
  try {
    
    let {status,page,limit} = req.params; 
    limit = parseInt(limit);
    status = parseInt(status);
    let offset = (page-1)*limit;
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
    if(limit != 0){
      const {count,rows} = await modelS.zycontract.findAndCountAll({
        where,
        offset,
        limit,
        order: [
          ['updatedAt','DESC'],
          ['createdAt','DESC']
        ]
      })
      console.log(rows);
      res.json({
        code:0,
        rows,
        total:count,
        msg:'成功获得条件列表,共' + rows.length + '条记录'
      })
    }else{
      const {count,rows} = await modelS.zycontract.findAndCountAll({
        where,
        offset,
        order: [
          ['updatedAt','DESC'],
          ['createdAt','DESC']
        ]
      })
      console.log(rows);
      res.json({
        code:0,
        rows,
        msg:'成功获得条件列表,共' + count + '条记录'
      })
    }
    
  } catch (error) {
    next(error);
  }
  
})

module.exports = router;