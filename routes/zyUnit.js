var express = require('express');
var router = express.Router();
const modelS = require('../models');
const bodyParser = require('body-parser');
const cors = require('cors');
const { INTEGER } = require('sequelize');
const { Op } = require("sequelize");

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET zy_unit listing. */
router.all('/', function(req, res, next) {
  res.json({
    list:{
      id:1,
      result:'请求单位'
    }
  })
})

router.all('/list',async (req,res)=>{
    let list = await modelS.zyunit.findAll();

    res.json({
      list
      //message:'无法访问？！'
    })
    console.log(list);
})


router.all('/create',async (req,res)=>{
  try{
    let {unit_name,unit_type,unit_contacts,unit_tel,unit_add} = req.body;
    let contract = await modelS.zyunit.create({    
        unit_name,
        unit_type,
        unit_contacts,
        unit_tel,
        unit_add,
        status:1
    })
    console.log(contract);
    res.json({
      msg:'创建成功哈'
    })

  }
  catch(error){
    console.error();
  }
  

})


router.all('/update',async (req,res)=>{
  try{
    let {unit_name,unit_type,unit_contacts,unit_tel,unit_add,id} = req.body;
    let target = await modelS.zyunit.findOne({
          where:{
            id
          }
    })
    //如果存在则更新
    if(target){
      target = await target.update({
        unit_name,
        unit_type,
        unit_contacts,
        unit_tel,
        unit_add
      })

    }
    res.json({
      //rows,
      message:'更新记录成功'
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
    let target = await modelS.zyunit.findOne({
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
      message:'成功更新状态为' + status
    })
    console.log(target);
  }
  catch(error){
    next(error);
  }
})

router.all('/list/:status/:page/:limit',async (req,res)=>{
  //1.状态 1：表示未删除 -1：表示已删除 0：表示全部
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
    const {count,rows} = await modelS.zyunit.findAndCountAll({
          where,
          offset,
          limit
    })
    console.log(rows);
    res.json({
      rows,
      message:'成功获得条件列表,共' + count + '条记录'
    })
  } catch (error) {
    next(error);
  }
  
})

module.exports = router;