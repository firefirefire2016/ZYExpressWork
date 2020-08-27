var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const modelS = require('./models');
const { sequelize } = require('./models');
const { Model } = require('sequelize');



const testport = require('./testport');

const zycontract = require('./models/zycontract');

var test = express();

var Sequelize = require('sequelize');
// 数据库配置文件
var sqlConfig = {
    host: "localhost",
    user: "root",
    password: "Lupeng1",
    database: "example-sequelize"
};

console.log('init sequelize...');
console.log('mysql: ' + JSON.stringify(sqlConfig));



    let list = modelS.zycontract.findAll();

    

//    // Model

//     console.log('models: ' + modelS);

     //console.log(' list = ' + list );

//     console.log(" what happen?!");

    // res.json({