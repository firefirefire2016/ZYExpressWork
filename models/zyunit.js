'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class zyunit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  zyunit.init({
    unit_name: DataTypes.STRING,
    unit_type: DataTypes.STRING,
    unit_contacts: DataTypes.STRING,
    unit_tel: DataTypes.STRING,
    unit_add: DataTypes.STRING,
    status:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'zyunit',
  });
  return zyunit;
};