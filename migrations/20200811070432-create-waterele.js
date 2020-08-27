'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('watereles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      check_month: {
        type: Sequelize.STRING
      },
      property_add: {
        type: Sequelize.STRING
      },
      get_month: {
        type: Sequelize.STRING
      },
      elecol_amount: {
        type: Sequelize.DECIMAL
      },
      elecheck_amount: {
        type: Sequelize.DECIMAL
      },
      elereceived_amount: {
        type: Sequelize.DECIMAL
      },
      watercol_amount: {
        type: Sequelize.DECIMAL
      },
      watercheck_amount: {
        type: Sequelize.DECIMAL
      },
      waterreceived_amount: {
        type: Sequelize.DECIMAL
      },
      is_rent: {
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
    await queryInterface.dropTable('watereles');
  }
};