'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class waterele extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  waterele.init({
    check_month: DataTypes.STRING,
    property_add: DataTypes.STRING,
    get_month: DataTypes.STRING,
    elecol_amount: DataTypes.DECIMAL,
    elecheck_amount: DataTypes.DECIMAL,
    elereceived_amount: DataTypes.DECIMAL,
    watercol_amount: DataTypes.DECIMAL,
    watercheck_amount: DataTypes.DECIMAL,
    waterreceived_amount: DataTypes.DECIMAL,
    is_rent: DataTypes.STRING,
    status:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'waterele',
  });
  return waterele;
};