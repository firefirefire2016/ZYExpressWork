'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zycollections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.STRING
      },
      month: {
        type: Sequelize.STRING
      },
      amount_received: {
        type: Sequelize.DECIMAL
      },
      amount_receivable: {
        type: Sequelize.DECIMAL
      },
      invoice_amount: {
        type: Sequelize.DECIMAL
      },
      contractid: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('zycollections');
  }
};