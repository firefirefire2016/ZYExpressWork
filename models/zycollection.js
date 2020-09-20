'use strict';
const {
  Model, DataTypes
} = require('sequelize');

const modelS = require('../models');

module.exports = (sequelize, DataTypes) => {
  class zycollection extends Model {
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.zycontract, { foreignKey: 'contractid' });
      //zycollection.belongsTo(zycontract);
    }
  };
  zycollection.init({
    year: {
      type:DataTypes.STRING
      
    },
    month: {
      type:DataTypes.STRING
      
    },
    amount_received: DataTypes.DECIMAL,
    amount_receivable: DataTypes.DECIMAL,
    invoice_amount: DataTypes.DECIMAL,
    contractid: DataTypes.INTEGER,
    contract_status:DataTypes.INTEGER,//合同状态
    status:DataTypes.INTEGER,//状态
    startdate:DataTypes.STRING,
    enddate:DataTypes.STRING,
    itemname:DataTypes.STRING,
    overstate:DataTypes.STRING,
    latefees:DataTypes.STRING,
    invoice_limit: DataTypes.DECIMAL,
    billno:DataTypes.STRING,
    collectdate:DataTypes.STRING,
    invoicedate:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'zycollection',
    
  });

  


  return zycollection;
};