var express = require('express');
var router = express.Router();
const modelS = require('../models');
const bodyParser = require('body-parser');
const cors = require('cors');
const { INTEGER } = require('sequelize');
const { Op } = require("sequelize");
var common = require('../common');

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET zy_Customer listing. */
router.all('/', function (req, res, next) {
  res.json({
    list: {
      id: 1,
      result: '请求客户列表'
    }
  })
})

router.all('/list', async (req, res) => {
  let list = await modelS.zypropertyright.findAll();

  res.json({
    list
    //message:'无法访问？！'
  })

})


router.all('/create', async (req, res) => {
  try {
    let newTarget = {
      customer_name
    } = req.body;
    let where = {};
    if (customer_name !== null) {
      where.customer_name = customer_name;
    }

    let obj = await modelS.zycustomer.findOne({
      where,
    })
    if (obj !== null) {
      res.json({
        code: 1,
        msg: '客户名称已存在，不能重复！',
      })
      return;
    }
    let target = await modelS.zycustomer.create({
      ...newTarget,
      status: 1
    })
    res.json({
      code: 0,
      msg: '创建成功',
      data: target
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
    } = req.body;

    let target = await modelS.zycustomer.findOne({
      where: {
        id
      }
    })


    if (target) {
      target = await target.update({
        ...newTarget
      })

    }

    res.json({
      code: 0,
      msg: '修改成功',
      data: target
    })
  }
  catch (error) {
    res.json({
      code: 1,
      msg: '修改失败' + error.message
    })
    next(error);
  }
})





//修改目标状态，比如已删除
router.all('/update_status', async (req, res) => {
  try {
    let { status, id } = req.body;
    let target = await modelS.zycustomer.findOne({
      where: {
        id
      }
    })
    //如果存在则更新为状态
    if (target && target.status != status) {
      target = await target.update({
        status
      })
    }
    res.json({
      code: 0,
      msg: '成功更新状态为' + status
    })
  }
  catch (error) {
    res.json({
      code: 0,
      msg: '更新状态失败'
    })
    next(error);
  }
})

router.all('/list/:page/:limit', async (req, res) => {
  //1.状态 0：表示全部 1：表示未删除 -1：表示已删除 -2:除了删除的
  try {

    let { page, limit } = req.params;
    let { customer_name,customer_type,contact,contact_tel,contract_status,status
    } = req.body;

    let offset = {};

    let where2 = {};

    if (!contract_status && contract_status !== 0) {
      contract_status = -2;
    }

    contract_status = parseInt(contract_status);

    where2.contract_status = contract_status;

    let where = {};

    if (customer_name) {
      where.customer_name = {
        [Op.substring]: customer_name
      }
    }

    if (contact) {
      where.contact = {
        [Op.substring]: contact
      }
    }

    if (contact_tel) {
      where.contact_tel = {
        [Op.substring]: contact_tel
      }
    }

    if (customer_type) {
      where.customer_type = customer_type
    }   

    if(!status && status !== 0){
      where.status = {
        [Op.ne]:-1
      };
    }
    else{
      where.status = status
    }

    if (limit  == '-1') {
      limit = 10;
      offset = (parseInt(page)  - 1) * limit;
    } else {
      limit = parseInt(limit);
      offset = (parseInt(page) - 1) * limit;
    }

    if(page=== '0' || limit === '0'){
      offset = null;
      limit = null
    }

    const { count, rows } = await modelS.zycustomer.findAndCountAll({
      where,
      offset,
      limit,
      order: [
        ['updatedAt', 'DESC'],
        ['createdAt', 'DESC']
      ],
      include:[
        {
          model: modelS.zycontract,
          where: where2
        },
      ]
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