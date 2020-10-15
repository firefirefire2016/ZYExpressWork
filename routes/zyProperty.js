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

/* GET zy_Dict listing. */
router.all('/', function (req, res, next) {
  res.json({
    list: {
      id: 1,
      result: '请求字典'
    }
  })
})

router.all('/list', async (req, res) => {
  let list = await modelS.zypropertyright.findAll();

  res.json({
    list
    //message:'无法访问？！'
  })
  console.log(list);
})


router.all('/create', async (req, res) => {
  try {
    let newTarget = {
      simpleaddress, address, owner, rightno,
      feature, righttype, community, commonstate, unitno, usereason, rightfeature,
      area, insidearea, limitdate, otherstatus, remarks,
    } = req.body;
    let where = {};
    if (rightno == null) {
      where.simpleaddress = simpleaddress;
    }
    else {
      where = {
        [Op.or]: [
          {
            simpleaddress,
          },
          // {
          //   rightno,
          // }
        ]
      }
    }


    let obj = await modelS.zypropertyright.findOne({
      where,
    })
    if (obj != null) {
      res.json({
        code: 1,
        msg: '物业名称已存在，不能重复！',
      })
      return;
    }
    let target = await modelS.zypropertyright.create({
      ...newTarget,
      property_status: 1
    })
    console.log(target);
    res.json({
      code: 0,
      msg: '产权创建成功',
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
      simpleaddress, address, owner, rightno, feature, righttype, community,
      commonstate, unitno, usereason, rightfeature,
      area, insidearea, limitdate, otherstatus, remarks, id, contractid
    } = req.body;

    let target = await modelS.zypropertyright.findOne({
      where: {
        id
      }
    })

    // delete newTarget.id

    //
    if (contractid) {
      //找到原本属于目标合同的产权
      let resetTemp = await modelS.zypropertyright.findOne({
        where: {
          contractid
        }
      })
      //目标合同有相应的产权
      if (resetTemp) {
        //目标合同的产权id和现在要更新的产权id相等，则直接更新
        if (resetTemp.id === target.id) {
          //return;
          if (target) {
            target = await target.update({
              ...newTarget
            })

          }
        }
        else {//目标合同的产权id和现在要更新的产权id不相等
          //把目标合同的产权的合同id设置为null
          resetTemp = await resetTemp.update({
            contractid: null
          })
          //把要设置的产权设置为目标合同的产权
          if (target) {
            target = await target.update({
              ...newTarget
            })

          }
        }
      }
      else {
        
        let rightno = target.dataValues;

        let id = target.contractid;

        //目标合同没有产权直接更改即可(一般是普通创建合同时触发)
        if (target) {
          target = await target.update({
            ...newTarget
          })

        }

        //假如产权更改前不为空置（即不能创建时选择），且目标合同id与原合同id不一致，说明要续租
        if (target.property_status !== 1 && target.contractid !== contractid) {

          //把自己更改为目标合同的产权
          // target = await target.update({
          //   ...newTarget
          // })

          //创建一个产权副本给原合同id
          giveContractRight(id, rightno);

        }
      }

    }
    else {
      //产权没有合同id，直接更新
      if (target) {
        target = await target.update({
          ...newTarget
        })

      }
    }

    console.log(target);
    res.json({
      code: 0,
      msg: '产权修改成功',
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

//生成产权副本给合同
const giveContractRight = async (contractid, rightno) => {

  try {
    let _rightno;
    //暂定产权状态999的为副本
    let copystatus = 999;
    if (rightno == null) {
      return '产权信息为空！';
    }
    else {
      _rightno = new Object(rightno);

      //首先去掉id
      delete _rightno.id;

      //设置副本的合同id
      _rightno.contractid = contractid;

      let target = await modelS.zypropertyright.create({
        ..._rightno,
        property_status: copystatus
      })

      return target;
    }
  } catch (error) {
    return error.message;
  }
}



//修改目标状态，比如已删除
router.all('/update_status', async (req, res) => {
  try {
    let { property_status, id } = req.body;
    let target = await modelS.zypropertyright.findOne({
      where: {
        id
      }
    })
    //如果存在则更新为状态
    if (target && target.property_status != property_status) {
      target = await target.update({
        property_status
      })
    }
    res.json({
      code: 0,
      msg: '成功更新状态为' + property_status
    })
    console.log(target);
  }
  catch (error) {
    res.json({
      code: 0,
      msg: '成功更新状态为' + property_status
    })
    next(error);
  }
})

router.all('/list/:page/:limit', async (req, res) => {
  //1.状态 0：表示全部 1：表示未删除 -1：表示已删除 -2:除了删除的
  try {

    let { page, limit } = req.params;
    let { simpleaddress, address, owner, rightno,
      feature, righttype, community, commonstate, unitno, usereason, rightfeature,
      area, insidearea, limitdate, otherstatus, remarks, property_status, contractid
    } = req.body;

    let offset = {};

    if (!property_status && property_status !== 0) {
      property_status = -2;
    }

    property_status = parseInt(property_status);

    let where = {};

    if (simpleaddress) {
      where.simpleaddress = {
        [Op.substring]: simpleaddress
      }
    }

    if (rightno) {
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

    if (righttype != null) {
      where.righttype = righttype;
    }

    if (contractid) {
      where.contractid = contractid;
    }


    //如果产权状态为不要删除的,也不要副本
    if (property_status === -2) {
      //  [Op.and]: [{ a: 5 }, { b: 6 }], 
      where.property_status = {
        [Op.and]: [
          {
            [Op.ne]: -1
          },
          {
            [Op.ne]: 999
          }
        ]
      }
      // where.property_status = {
      //   [Op.ne]: -1
      // }
    } else {
      where.property_status = property_status;
    }

    if (limit == -1) {
      limit = 10;
      offset = (page - 1) * limit;
    } else {
      limit = parseInt(limit);
      offset = (page - 1) * limit;
    }


    const { count, rows } = await modelS.zypropertyright.findAndCountAll({
      where,
      offset,
      limit,
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
      msg: '成功获得条件列表,共' + count + '条记录'
    })
  } catch (error) {
    next(error);
  }

})

module.exports = router;