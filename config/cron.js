'use strict'

/* configurações de execução cron */

/* 
    metodo:
    
    Seconds: 0-59
    Minutes: 0-59
    Hours: 0-23
    Day of Month: 1-31
    Months: 0-11 (Jan-Dec)
    Day of Week: 0-6 (domingo-Sabado)
*/

const cronFig = {
        "agendamento":{ 
                "segundos":"01",   
                "minutos":"*", /* 19 */
                "horas":"*", /* 17 */
                "dia_mes":"*", /* 2 */
                "mes":"*",
                "dia_semana":"*" /* ex.: 1-5 = seg à sexta */
                /*obs.: o valor que não for configurar adicionar o valor * (asterisco) */
            }
    };

module.exports = cronFig;