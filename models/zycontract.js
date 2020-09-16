'use strict';
const {
  Model
} = require('sequelize');

const modelS = require('../models');

module.exports = (sequelize, DataTypes) => {
  class zyContract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    static associate(models) {
      // define association here
     // this.hasMany(models.zycollection);
    }
  };
  zyContract.init({
    contractno: DataTypes.STRING,
    startdate: DataTypes.STRING,
    enddate: DataTypes.STRING,
    rentdate: DataTypes.STRING,
    renttype: DataTypes.STRING,
    month_rent: DataTypes.STRING,
    rightno: DataTypes.STRING,
    tenant: DataTypes.STRING,//客户名称
    tel_tenant: DataTypes.STRING,//联系电话
    deposit: DataTypes.STRING,
    address: DataTypes.STRING,//地址
    contract_status:DataTypes.INTEGER,//合同状态
    rentcycle: DataTypes.STRING,//付款周期
    firstdate:DataTypes.STRING,//首期收款日
    signdate:DataTypes.STRING,//签订日期
    agentman:DataTypes.STRING,//对接人 
    rentmode:DataTypes.STRING,//租金模式 
    needcopy:DataTypes.STRING,//是否需要抄表
    quitdate:DataTypes.STRING,//退租日期
    property_name:DataTypes.STRING,//物业名称
  }, {

    sequelize,
    modelName: 'zycontract',
  });

 // zyContract.hasMany(modelS.zyC);

  return zyContract;
};