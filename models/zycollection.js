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
    status:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'zycollection',
    
  });

  


  return zycollection;
};