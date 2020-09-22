'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class zyrentlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.zycontract, { foreignKey: 'contractid' });
    }
  };
  zyrentlist.init({
    startdate: DataTypes.STRING,
    enddate: DataTypes.STRING,
    oncerate: DataTypes.STRING,
    onceamount: DataTypes.STRING,
    endamount: DataTypes.DECIMAL,
    contractid: DataTypes.INTEGER,
    remarks: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'zyrentlist',
  });
  return zyrentlist;
};