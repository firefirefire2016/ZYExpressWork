'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class zysysdict extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  zysysdict.init({
    dicttype: DataTypes.STRING,
    dicttypecode: DataTypes.STRING,
    dictcode: DataTypes.STRING,
    dictvalue: DataTypes.STRING,
    remarks: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'zysysdict',
  });
  return zysysdict;
};