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
    tenant: DataTypes.STRING,
    tel_tenant: DataTypes.STRING,
    deposit: DataTypes.STRING,
    contractname: DataTypes.STRING,
    address: DataTypes.STRING,
    coldate: DataTypes.STRING,
    status:DataTypes.INTEGER
  }, {

    sequelize,
    modelName: 'zycontract',
  });

 // zyContract.hasMany(modelS.zyC);

  return zyContract;
};