jms_app.controller('Autobot_controller', ['$scope','$window','$http','$timeout','$location', '$ngConfirm','DTOptionsBuilder', 'DTColumnBuilder','DTColumnDefBuilder', async function($scope,$window, $http,$timeout,$location,$ngConfirm,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder){

    $scope.base_url = $("#baseUrl").val() + "/";
    $scope.api_url = $("#apiUrl").val();


    console.log("\r\n Executou o controller: " )


}]);