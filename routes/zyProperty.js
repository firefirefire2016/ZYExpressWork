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
      result:'请求字典'
    }
  })
})

router.all('/list',async (req,res)=>{
    let list = await modelS.zypropertyright.findAll();

    res.json({
      list
      //message:'无法访问？！'
    })
    console.log(list);
})


router.all('/create',async (req,res)=>{
  try{
    let newTarget = {simpleaddress,address,owner,rightno,
      feature,type,community,commonstate,unitno,usereason,rightfeature,
      area,insidearea,limitdate,otherstatus,remarks
    } = req.body;
    let dict = await modelS.zypropertyright.create({    
        ...newTarget,        
        status:1
    })
    console.log(dict);
    res.json({
      msg:'产权创建成功'
    })

  }
  catch(error){
    console.error();
  }
  

})


router.all('/update',async (req,res)=>{
  try{
    let newTarget = {simpleaddress,address,owner,rightno,
      feature,type,community,commonstate,unitno,usereason,rightfeature,
      area,insidearea,limitdate,otherstatus,remarks,id
    } = req.body;
    let target = await modelS.zypropertyright.findOne({
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
    let target = await modelS.zypropertyright.findOne({
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

router.all('/list/:page/:limit',async (req,res)=>{
  //1.状态 0：表示全部 1：表示未删除 -1：表示已删除 -2:除了删除的
  try {

    let { page, limit} = req.params;
    let {simpleaddress,address,owner,rightno,
      feature,type,community,commonstate,unitno,usereason,rightfeature,
      area,insidearea,limitdate,otherstatus,remarks,status
    } = req.body;

    let offset = {};

    if (!status && status !== 0) {
      status = -2;
    }

    status = parseInt(status);

    let where = {};

    if (contractno) {
      where.rightno = {
        [Op.substring]: rightno
      }
    }

    if (feature != null) {
      where.feature = feature;
    }

    if (owner != null) {
      where.owner = owner;
    }

    if (community != null) {
      where.community = community;
    }

    if (type != null) {
      where.type = type;
    }

    //如果合同状态为不要删除的
    if (status === -2) {
      where.status = {
        [Op.ne]: -1
      }
    } else {
      where.status = status;
    }

    if (limit == -1) {
      const amount = await modelS.zypropertyright.count({
        where
      });
      limit = amount;
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    } else {
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    }


    const { count, rows } = await modelS.zypropertyright.findAndCountAll({
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