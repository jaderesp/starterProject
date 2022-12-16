const validator = require('../../controllers/utils/CpfCnpj');

/* ger all */
module.exports.validate = async function(req,res){

    /* dados da lista de sessões */
   let number = req.body;

   if(number){

        let valid = await validator.validate(number.cpf);
        return res.send({'dados':valid});

   }else{

        return res.send({'dados':false});

   }       
    
 
 }