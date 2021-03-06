'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('zypropertyrights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      simpleaddress: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      owner: {
        type: Sequelize.STRING
      },
      rightno: {
        type: Sequelize.STRING
      },
      feature: {
        type: Sequelize.STRING
      },
      righttype: {
        type: Sequelize.STRING
      },
      community: {
        type: Sequelize.STRING
      },
      commonstate: {
        type: Sequelize.STRING
      },
      unitno: {
        type: Sequelize.STRING
      },
      usereason: {
        type: Sequelize.STRING
      },
      rightfeature: {
        type: Sequelize.STRING
      },
      area: {
        type: Sequelize.STRING
      },
      insidearea: {
        type: Sequelize.STRING
      },
      limitdate: {
        type: Sequelize.STRING
      },
      otherstatus: {
        type: Sequelize.STRING
      },
      remarks: {
        type: Sequelize.STRING
      },
      property_status: {
        type: Sequelize.STRING
      },
      contractid:{
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('zypropertyrights');
  }
};