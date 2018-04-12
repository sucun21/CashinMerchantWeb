(function () {
    'use strict';

    theApp
        .factory('AccountService', AccountService);

    AccountService.$inject = ['$http', '$q','API_URL'];
    function AccountService($http, $q, API_URL) {
        var service = {};
        var url = API_URL + "login";
        service.changePassword = changePassword;
        return service;
        
        function changePassword( username, oldPassword, newPassword) {
            var cm = "change_password";
            var ep = oldPassword;
            var enp = newPassword;
            var dtJson = { u: username, o_p:ep, n_p: enp};           
            var dt = JSON.stringify(dtJson);
            var data = $.param({
                cm: cm,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error verify login'));
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
