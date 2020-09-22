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
     this.belongsTo(models.zypropertyright, { foreignKey: 'rightid' });
    }
  };
  zyContract.init({
    contractno: DataTypes.STRING,
    startdate: DataTypes.STRING,
    enddate: DataTypes.STRING,
    rentdate: DataTypes.STRING,
    renttype: DataTypes.STRING,
    once_rent: DataTypes.STRING,
    rightno: DataTypes.STRING,
    tenant: DataTypes.STRING,//客户名称
    tel_tenant: DataTypes.STRING,//联系电话
    tenant_idno:DataTypes.STRING,//客户身份证
    tenant_address:DataTypes.STRING,//客户地址
    tenanttype:DataTypes.STRING,//客户类型
    deposit: DataTypes.STRING,//押金
    copytype:DataTypes.STRING,//抄表类型
    //address: DataTypes.STRING,//地址
    contract_status:DataTypes.INTEGER,//合同状态
    rentcycle: DataTypes.STRING,//付款周期
    firstdate:DataTypes.STRING,//首期收款日
    signdate:DataTypes.STRING,//签订日期
    agentman:DataTypes.STRING,//对接人,签订人
    rentmode:DataTypes.STRING,//租金模式 
    quitdate:DataTypes.STRING,//退租日期
    property_name:DataTypes.STRING,//物业名称
    accountingunit:DataTypes.STRING,//核算单位
    latefeesrate:DataTypes.STRING,//滞纳金比例
    rightid:DataTypes.INTEGER,//产权id
  }, {

    sequelize,
    modelName: 'zycontract',
  });

 // zyContract.hasMany(modelS.zyC);

  return zyContract;
};