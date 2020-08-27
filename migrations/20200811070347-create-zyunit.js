'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zyunits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      unit_name: {
        type: Sequelize.STRING
      },
      unit_type: {
        type: Sequelize.STRING
      },
      unit_contacts: {
        type: Sequelize.STRING
      },
      unit_tel: {
        type: Sequelize.STRING
      },
      unit_add: {
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
    await queryInterface.dropTable('zyunits');
  }
};