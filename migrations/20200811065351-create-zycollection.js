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
      contract_status: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      startdate:{
        allowNull: false,
        type: Sequelize.STRING
      },
      enddate:{
        allowNull: false,
        type: Sequelize.STRING
      },
      itemname:{
        allowNull: false,
        type: Sequelize.STRING
      },
      overstate:{
        allowNull: false,
        type: Sequelize.STRING
      },
      latefees:{
        allowNull: false,
        type: Sequelize.STRING
      },
      invoice_limit:{
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      billno:{
        allowNull: false,
        type: Sequelize.STRING
      },
      collectdate:{
        allowNull: false,
        type: Sequelize.STRING
      },
      invoicedate:{
        allowNull: false,
        type: Sequelize.STRING
      },
      remarks:{
        allowNull: false,
        type: Sequelize.STRING
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('zycollections');
  }
};