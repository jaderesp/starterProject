'use strict'
require('dotenv').config();
/* 

        fonte informações definições do sequelize: 
                https://sequelize.org/v4/manual/tutorial/models-definition.html

        migrates ler:
                

*/
const dotenv = require('dotenv');
const Sequelize = require('sequelize');
dotenv.config();

var opts = {
        timezone: process.env.APP_TIMEZONE,
        define: {
                freezeTableName: true, /* não permitir que use nomes de tabelas no plural (consultas) */
                dialectOptions: {connectTimeout: 1000} /* for mariadb */
        },
        dialect: process.env.DB_DIALECT.toString()
}
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,process.env.DB_PWD, opts);
 
module.exports = sequelize;