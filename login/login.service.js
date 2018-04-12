/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$http', '$q','API_URL', '$rootScope', '$cookies', '$location'];
    function LoginService($http, $q, API_URL, $rootScope, $cookies, $location) {
        var service = {};
        var url = API_URL + "login";
        service.login = login;
        service.isLogined = isLogined;
        return service;
        
        function login(username, password) {
            var cm = "login";
            var dtJSON = {
                u: username,
                p: password
            };
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cm,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error login'));
        }
        
        function isLogined(){
            $rootScope.globals.currentUser.username = $cookies.get('u');
            if ($rootScope.globals.currentUser.username === undefined) {
                $rootScope.globals.currentUser.username = "";
            }
            
            if ($rootScope.globals.currentUser.username === "") {   
                return false;            
            }
            
            return true; 
        }
        
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { err: -2, msg: error };
            };
        }
    }
    
})();
