/* directivas do angularjs app */
jms_app.directive('copyToClipboard', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.click(function () {
                if (attrs.copyToClipboard) {
                    var $temp_input = $("<input>");
                    $("body").append($temp_input);
                    $temp_input.val(attrs.copyToClipboard).select();
                    document.execCommand("copy");
                    $temp_input.remove();
                }
            });
        }
    };
});

/* filters */
jms_app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}); 

jms_app.filter('filterMultiple',['$filter',function ($filter) {
    return function (items, keyObj) {
        var filterObj = {
            data:items,
            filteredData:[],
            applyFilter : function(obj,key){
                var fData = [];
                if (this.filteredData.length == 0)
                    this.filteredData = this.data;
                if (obj){
                    var fObj = {};
                    if (!angular.isArray(obj)){
                        fObj[key] = obj;
                        fData = fData.concat($filter('filter')(this.filteredData,fObj));
                    } else if (angular.isArray(obj)){
                        if (obj.length > 0){
                            for (var i=0;i<obj.length;i++){
                                if (angular.isDefined(obj[i])){
                                    fObj[key] = obj[i];
                                    fData = fData.concat($filter('filter')(this.filteredData,fObj));    
                                }
                            }
    
                        }
                    }
                    if (fData.length > 0){
                        this.filteredData = fData;
                    }
                }
            }
        };
        if (keyObj){
            angular.forEach(keyObj,function(obj,key){
                filterObj.applyFilter(obj,key);
            });
        }
        return filterObj.filteredData;
    }
}]);

/* executar ao pressionar enter keypress Enter */
jms_app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

/* executar ao pressionar enter keypress Enter */
jms_app.directive('ctrEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown", function (event) {

            var name = event.key;
            var code = event.code;
            var target = event.target;
            /* 17 = control - 13 = enter */
         
                    if(event.ctrlKey == false && code == "Enter"){
                           
                        /* se pressionar o enter + control - não fazer nada */
                        scope.$apply(function (){
                            scope.$eval(attrs.ctrEnter);
                        });
        
                        event.preventDefault();  

                    }else if(event.ctrlKey == true && code == "Enter"){

                        element[0].value = element[0].value + '\r\n';
                        //console.log("\r Elemento: ", element);
                        //console.log("\r Attr: ", attrs);

                    }

                
            
          
        });
    };
});


/* remover espaços string */
jms_app.filter('remover_espacos', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '');
    };
}])

/* remover espaços string */
jms_app.filter('somenteNumberos', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/\D/g, '');
    };
}])

/* substituir caracter na string */
jms_app.filter('replace', [function () {

    return function (input, from, to) {
      
      if(input === undefined) {
        return;
      }
  
      var regex = new RegExp(from, 'g');
      return input.replace(regex, to);
       
    };


}]);

/* formatar porcentagem */
jms_app.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }]);

/* exemplo:  {{itens_orcamento | sumOfValue:'total_item_roc'}} */
jms_app.filter('sumOfValue', function () {
    return function (data, key) {        
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;        
        var sum = 0;        
        angular.forEach(data,function(value){
            sum = sum + parseFloat(value[key], 10);
        });        
        return sum;
    }
})


 /* somar total de um objecto (array ng-repeat) */
 jms_app.filter('sumByKey', function() 
 {
     /* JADER ESP. S. SILVA - JMSOFTS.COM.BR
      02-10-2018 - upgrade 
     antes - soma de um indice apenas
     novo - soma de varios indices passando um obj de indices */
     return function(data, objKey) 
     {
         if (typeof(data) === 'undefined' || typeof(objKey) === 'undefined') {
             return 0;
         }
 
         var sum = 0;
         var result=0;
         data = Array.prototype.slice.apply(data);
         for (var i = data.length - 1; i >= 0; i--) 
         {  
             /* verificar se string ou objeto de indices */
             if(typeof objKey != 'string')
             {
                 /* tranformar o object string em objecto real */
                 objKey = angular.fromJson(objKey);
                 /* laço do objeto de indices para soma */
                 angular.forEach(objKey, function(value, key) 
                 {
                      /* verificar se valor null, somar zero (0) */ 
                      result = data[i][value];
                      if(result == null)
                      {
                          result = 0;
                      }
  
                      sum += parseDouble(result);
                 });
                
             }else
             {
                     result = data[i][objKey];
                     if(result == null)
                     {
                         result = 0;
                     }
 
                     sum += parseDouble(result);
             }
             
         }
 
         return sum;
     };
 });


 /* converter texto para html code */
 jms_app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}); 

/* ex.: {{myValue | zeroFill:11}}  */
jms_app.filter('zeroFill', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = ''+num;
        while (num.length < len) {
            num = '0'+num;
        }
        return num;
    };
});