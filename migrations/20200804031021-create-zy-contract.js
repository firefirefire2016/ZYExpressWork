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
      once_rent: {
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
      tenant_idno: {
        type: Sequelize.STRING,
      },
      tenant_address: {
        type: Sequelize.STRING,
      },
      tenanttype:{
        type: Sequelize.STRING,
      },
      copytype:{
        type: Sequelize.STRING,
      },//抄表类型
      deposit: {
        type: Sequelize.STRING,
      },
      // address: {
      //   type: Sequelize.STRING
      // },
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
      quitdate: {
        type: Sequelize.STRING
      },//退租日期
      property_name: {
        type: Sequelize.STRING
      },//物业名称     
      accountingunit: {
        type: Sequelize.STRING
      },//核算单位
      latefeesrate: {
        type: Sequelize.STRING
      },//滞纳金比例  
      rightid: {//产权id
        allowNull: false,
        type: Sequelize.INTEGER
      },
      stopdate: {//停用日期
        type: Sequelize.STRING
      },
      stopreason: {//停用原因
        type: Sequelize.STRING
      },
      effectdate: {//启用日期
        type: Sequelize.STRING
      },
      deldate: {//删除日期
        type: Sequelize.STRING
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('zyContracts');
  }
};