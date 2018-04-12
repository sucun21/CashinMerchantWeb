

/* global theApp */

theApp.controller('HeaderController', function($rootScope,$scope, $http,$cookies, $location, LoginService, $window) {
    
    var path = $location.path();
    var titlePage = "CashInMerchant - Admin";
    switch(path){
        case '/dashboard/':
            titlePage = "Báo cáo chung";
            break;

        case '/listinvoice/':
            titlePage = "Nhật ký giao dịch";
            break;

    }
    
    $scope.titlePage = titlePage;
    
    $scope.logout = function (){
        $rootScope.globals.currentUser.username = "";
        $cookies.remove('u');   
        $location.path("/login");  
    };
});