'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
          ler sobre migrate aqui: https://imasters.com.br/banco-de-dados/tutorial-de-migrations-com-node-js-e-sequelize
         */

        await queryInterface.createTable('AutoB_Resposta', {
            id_abresp: {
                type: Sequelize.INTEGER.ZEROFILL,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            id_sess: {
                type: Sequelize.INTEGER.ZEROFILL,
                allowNull: false,
            },
            id_conta: {
                type: Sequelize.INTEGER.ZEROFILL,
                allowNull: false,
            },
            type: { /* define qual tipo de resposta: mensagem, label, buttons, list etc... */
                type: Sequelize.STRING(600),
                allowNull: true
            },
            json_data: {
                type: Sequelize.STRING(5000),
                allowNull: true
            },
            fileName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            mensagem: {
                type: Sequelize.STRING(5000),
                allowNull: true
            },
            fileUrl: {
                type: Sequelize.STRING,
                allowNull: true
            },
            mimetype: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            posx: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            posy: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            // Timestamps
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
        })
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('AutoB_Resposta');
    }

}