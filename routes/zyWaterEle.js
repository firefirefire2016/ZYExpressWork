var express = require('express');
var router = express.Router();
const modelS = require('../models');
const bodyParser = require('body-parser');
const cors = require('cors');
const { INTEGER } = require('sequelize');

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET zy_waterele listing. */
router.all('/', function(req, res, next) {
  res.json({
    list:{
      id:1,
      result:'请求水电费'
    }
  })
})

router.all('/list',async (req,res)=>{
    let list = await modelS.waterele.findAll();

    res.json({
      list
      //message:'无法访问？！'
    })
    console.log(list);
})


router.all('/create',async (req,res)=>{
  try{
    let {check_month,property_add,get_month,elecol_amount,elecheck_amount,elereceived_amount,watercol_amount
    ,watercheck_amount,waterreceived_amount,is_rent} = req.body;
    let contract = await modelS.waterele.create({    
        check_month,
        property_add,
        get_month,
        elecol_amount,
        elecheck_amount,
        elereceived_amount,
        watercol_amount,
        watercheck_amount,
        waterreceived_amount,
        is_rent,
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
    let {check_month,property_add,get_month,elecol_amount,elecheck_amount,elereceived_amount,watercol_amount
      ,watercheck_amount,waterreceived_amount,is_rent,id} = req.body;
    let target = await modelS.waterele.findOne({
          where:{
            id
          }
    })
    //如果存在则更新
    if(target){
      target = await target.update({
        check_month,
        property_add,
        get_month,
        elecol_amount,
        elecheck_amount,
        elereceived_amount,
        watercol_amount,
        watercheck_amount,
        waterreceived_amount,
        is_rent
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
    let target = await modelS.waterele.findOne({
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
    let offset = (page-1)*limit;
    let where = {};
    if(status != 0){
        where.status = status;
    }
    const {count,rows} = await modelS.waterele.findAndCountAll({
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