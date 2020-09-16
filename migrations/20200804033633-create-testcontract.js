'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('testcontracts', {
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
      renttype: {
        type: Sequelize.STRING
      },
      rightno: {
        type: Sequelize.STRING
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
      contract_status: {
        allowNull: false,
        type: Sequelize.INTEGER
      } 
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('testcontracts');
  }
};