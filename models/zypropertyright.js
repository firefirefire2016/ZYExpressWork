'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class zypropertyright extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  zypropertyright.init({
    simpleaddress: DataTypes.STRING,
    address: DataTypes.STRING,
    owner: DataTypes.STRING,
    rightno: DataTypes.STRING,
    feature: DataTypes.STRING,
    type: DataTypes.STRING,
    community: DataTypes.STRING,
    commonstate: DataTypes.STRING,
    unitno: DataTypes.STRING,
    usereason: DataTypes.STRING,
    rightfeature: DataTypes.STRING,
    area: DataTypes.STRING,
    insidearea: DataTypes.STRING,
    limitdate: DataTypes.STRING,
    otherstatus: DataTypes.STRING,
    remarks: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'zypropertyright',
  });
  return zypropertyright;
};