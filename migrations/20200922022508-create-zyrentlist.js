'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zyrentlists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startdate: {
        type: Sequelize.STRING
      },
      enddate: {
        type: Sequelize.STRING
      },
      oncerate: {
        type: Sequelize.STRING
      },
      onceamount: {
        type: Sequelize.STRING
      },
      endamount: {
        type: Sequelize.DECIMAL
      },
      contractid: {
        type: Sequelize.INTEGER
      },
      remarks: {
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
        type: Sequelize.INTEGER
      },
      contract_status: {
        type: Sequelize.INTEGER
      },
      rentcycle: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('zyrentlists');
  }
};