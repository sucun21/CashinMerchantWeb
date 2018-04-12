(function () {
    'use strict';

    theApp
        .factory('SidebarService', SidebarService);

    SidebarService.$inject = ['$http', '$q','API_URL', '$rootScope', '$cookies', '$location'];
    function SidebarService($http, $q, API_URL, $rootScope, $cookies, $location) {
        var service = {};
        var url = API_URL + "login";
        
        service.getUserLogin = getUserLogin;
        return service;
        
       
        function getUserLogin() {
             var cm = "get_user_login";
            var dtJson = "";
            var dt = JSON.stringify(dtJson);
            var data = $.param({
                cm: cm,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error get user login'));
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
