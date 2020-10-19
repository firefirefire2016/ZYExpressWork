'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class zyremitaccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  zyremitaccount.init({
    account_name: DataTypes.STRING,
    account_bank: DataTypes.STRING,
    account_number: DataTypes.STRING,
    status: DataTypes.INTEGER,
    remarks: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'zyremitaccount',
  });
  return zyremitaccount;
};