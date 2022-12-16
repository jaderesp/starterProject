'use strict'

module.exports.getTimeCrono = async (datetime2, datetime1, type) => {

  /* @retornar minutos de diferença entre duas datas 
    type = minutos, segundos, horas
  */

  return new Promise(async (resolve, reject) => {

    const miliseconds = new Date(datetime2).getTime() - new Date(datetime1).getTime();
    const seconds = miliseconds / 1000;


    let resultado = 0;

    if (type == 'minutos') {

      resultado = seconds / 60;

    } else if (type == 'segundos') {

      resultado = seconds;

    } else if (type == 'horas') {

      resultado = seconds / 60 / 60;

    } else {

      resultado = miliseconds;

    }

    resolve(Math.abs(Math.round(resultado)));

  })

}

module.exports.monthDiff = async (dateFrom, dateTo) => {

  return new Promise(async (resolve, reject) => {
    let retorno = dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));


    resolve(retorno);

  })
}


module.exports.addDaysToDate = (date, days) => {

  return new Promise(async (resolve, reject) => {

    var res = new Date(date);
    res.setDate(res.getDate() + parseInt(days));

    resolve(new Date(res));

  });
}

module.exports.getDates = async (qtdeDias) => {

  /* 
    exemplo de uso:
    
          var dateArray = getDates((new Date()).addDays(2), (new Date()).addDays(90));
      
          console.log(dateArray)
  
  */

  return new Promise(async (resolve, reject) => {


    Date.prototype.addDays = async function (days) {
      return new Promise(async (resolve, reject) => {

        var dat = new Date(this.valueOf())
        dat.setDate(dat.getDate() + days);
        resolve(dat);

      });
    }

    let startDate = new Date(); /* agora (hoje) */
    let dateF = await (new Date()).addDays(qtdeDias); /* adicionar dias a data para  */

    if (!dateF) {
      /* por defaul perido 7 dias */
      dateF = (new Date()).addDays(-7);
    }

    var dateArray = new Array();
    var currentDate = startDate;

    while (currentDate >= dateF) {
      var day = currentDate.getDate()
      var month = currentDate.getMonth() + 1
      var year = currentDate.getFullYear()
      dateArray.push(day + "/" + month + "/" + year)
      currentDate = await currentDate.addDays(-1);
    }

    dateArray = dateArray.reverse()
    // console.log("\r\n Retorno de datas periodo: ",dateArray);

    resolve(dateArray);

  });
}