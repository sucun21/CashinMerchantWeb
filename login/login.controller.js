/* global theApp */

(function () {
    'use strict';
    
    theApp
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$location', '$scope', 'LoginService', '$rootScope' ,'$window', '$routeParams', '$cookies','$mdDialog'];
    function LoginController($location, $scope, LoginService, $rootScope, $window, $routeParams, $cookies, $mdDialog) {     
        $scope.vm = {};
        $scope.showError = false;
        $scope.init = function() {
            
        };
        $scope.init();
        $scope.login = function() {
            var u = $scope.vm.username;
            var p = $scope.vm.password;
            LoginService.login(u,p)
                .then(function (response) {
                        if (response.err === 0) {
                            $rootScope.globals.currentUser.username = response.dt.account_name;
                            $cookies.put('u', $rootScope.globals.currentUser.username);
                            $location.path('/dashboard');
                            console.log('login success, data res: ' + JSON.stringify(response));
                        } else {
                            $scope.showError = true;
                            $scope.errMsg = "Sai tên đăng nhập / mật khẩu";
                        }
                    });
        };
    }

})();