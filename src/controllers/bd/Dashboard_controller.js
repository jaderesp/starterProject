'use strict'
const planoMod = require('../../models/bd/Plano_model');
const assinaturaBDMod = require('../../models/bd/Assinatura_model');
const contactMod = require('../../models/bd/Contato_model');
const campanhasMod = require('../../models/bd/Campanha_model');
const dateUtil = require('../../controllers/utils/DatesDiffs');
const extend = require('extend');
const dateFormat = require('date-format');
const { Op, where } = require('sequelize');

module.exports.getPlanoAtivo = async (where) => {
    
    return new Promise( async (resolve, reject) => {

        let assinatura = await assinaturaBDMod.getSomeOne(where);

        let plano = {};

        if(assinatura){

            plano = await planoMod.getSomeOne({'id_plan':assinatura.id_plan});

            if(plano){
                extend(plano,assinatura);
            }

        }
              
        resolve(plano);

    });
}

module.exports.getQtdeContacts = async (where) => {
    
    return new Promise( async (resolve, reject) => {

        let contatcs = await contactMod.get(where);
              
        resolve(contatcs);

    });
}

module.exports.getCampanhasEnviadas = async (where) => {
    
    return new Promise( async (resolve, reject) => {

        let campanhas = await campanhasMod.get(where);

        if(!campanhas.length){
            campanhas = [];
        }
              
        resolve(campanhas);

    });
}


module.exports.getDataGraficoContacts = async (params,where) => {

    /* grafico contatos x cadastro diário

        qtde de usuarios cadastrados por periodo

        - pegar periodo escolhido,
        - verificar cada periodo a qtde de cadastros existentes
    */
        return new Promise( async (resolve, reject) => {

            let graficoData = {'categorias':[], 'dados':[]};
            //let contacts = await contactMod.get(where);

            /* retornar todas as datas do periodo selecionado */
            let periodos = await dateUtil.getDates(params.qtdeDias); /* por defaul data com 7 dias (no filtro) */
            
            if(periodos){

                for(var  p = 0; p < periodos.length; p++){
                        /* incializar */
                       // console.log("\r\n Dados: ", periodos[p]);
                        



                        let dat_i = periodos[p].split('/');
                        let conv = dat_i[1] + '/' +  dat_i[0] + '/' + dat_i[2] + ' 00:00:00.000';
                        let data1 = new Date(conv);

                        conv = dat_i[1] + '/' +  dat_i[0] + '/' + dat_i[2] + ' 23:59:59.000';
                        let data2 = new Date(conv);

                        let ini = dateFormat('yyyy-MM-dd hh:mm',new Date(data1));
                        let end = dateFormat('yyyy-MM-dd hh:mm',new Date(data2));

                        console.log("\r\n "+ ini +" : "+ end);

                        const where_ =  {
                                id_conta:where.id_conta,
                                createdAt: {
                                    [Op.between]: [ini, end]
                                },
                        };

                        let contacts = await contactMod.get(where_);
                            

                        /* formatar categorias (datas exibidas no grafico) */
                        let dataCat = new Date(dat_i[1] + '/' +  dat_i[0] + '/' + dat_i[2])
                        graficoData.categorias[p] = dateFormat('dd/MM/yyyy',new Date(dataCat));  /* d/m/Y ou como quiser */

                        /* verificar se foi encontrado contato(s) */
                        if(contacts){
                            /* adicionar qtde de contatos encontrados */
                            graficoData.dados[p] = contacts.length;                               
                            
                        }else{

                            graficoData.dados[p] = 0;

                        } 

                }

            }

            console.log("\r\n Dados grafico de contatos: ", graficoData);

            resolve(graficoData)


        });

}