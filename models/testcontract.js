'use strict';
const {
  Model
} = require('sequelize');

//Model.sync({ alter: true });

module.exports = (sequelize, DataTypes) => {
  class testcontract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  testcontract.init({
    contractno: DataTypes.STRING,
    startdate: DataTypes.STRING,
    enddate: DataTypes.STRING,
    renttype: DataTypes.STRING,
    rightno: DataTypes.STRING,
    contractname: DataTypes.STRING,
    address: DataTypes.STRING,
    coldate: DataTypes.STRING,
    status:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'testcontract',
  });
  return testcontract;
};