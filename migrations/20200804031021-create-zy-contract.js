'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zyContracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contractno: {
        type: Sequelize.STRING
      },
      startdate: {
        type: Sequelize.STRING
      },
      enddate: {
        type: Sequelize.STRING
      },
      rentdate: {
        type: Sequelize.STRING
      },
      month_rent: {
        type: Sequelize.STRING
      },
      renttype: {
        type: Sequelize.STRING
      },
      rightno: {
        type: Sequelize.STRING
      },
      tenant:{
        type: Sequelize.STRING,
      },
      tel_tenant:{
        type: Sequelize.STRING,
      },
      deposit:{
        type: Sequelize.STRING,
      },
      contractname: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      coldate: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER
      }       
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('zyContracts');
  }
};