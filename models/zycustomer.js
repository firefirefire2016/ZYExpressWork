'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class zycustomer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.zycontract,{ foreignKey: 'tenantid' });
    }
  };
  zycustomer.init({
    customer_name: DataTypes.STRING,
    customer_type: DataTypes.STRING,
    contact: DataTypes.STRING,
    contact_tel: DataTypes.STRING,
    contact_idno: DataTypes.STRING,
    contact_address: DataTypes.STRING,
    status: DataTypes.INTEGER,
    email: DataTypes.STRING,
    qq: DataTypes.STRING,
    remarks: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'zycustomer',
  });
  return zycustomer;
};