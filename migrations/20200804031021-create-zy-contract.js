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
      tenant: {
        type: Sequelize.STRING,
      },
      tel_tenant: {
        type: Sequelize.STRING,
      },
      deposit: {
        type: Sequelize.STRING,
      },
      address: {
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
      },
      rentcycle: {
        type: Sequelize.STRING
      },//付款周期
      firstdate: {
        type: Sequelize.STRING
      },//首期收款日
      signdate: {
        type: Sequelize.STRING
      },//签订日期
      agentman: {
        type: Sequelize.STRING
      },//对接人 
      rentmode: {
        type: Sequelize.STRING
      },//租金模式 
      needcopy: {
        type: Sequelize.STRING
      },//是否需要抄表
      quitdate: {
        type: Sequelize.STRING
      },//退租日期
      property_name: {
        type: Sequelize.STRING
      }//物业名称     
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('zyContracts');
  }
};