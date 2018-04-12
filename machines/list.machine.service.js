/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('MachineService', MachineService);

    MachineService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function MachineService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL + "machines"; 
        
        service.getListMachine = getListMachine;
        service.deleteListItem = deleteListItem;
        service.insertItem = insertItem;
        service.editItem = editItem;
       
        return service;

        function editItem(item) {
            var cmd = "edit_machine";
            var dtJSON = {machine: item};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error edit cabinet'));
        }

        function insertItem(item) {
            var cmd = "insert_machine";
            var dtJSON = {machine: item};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error insert cabinet'));
        }

        function deleteListItem(listID) {
            var cmd = "delete_machine";
            var dtJSON = {list_item_id_del: listID};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error delete list cabinet'));
        }

        function getListMachine(){
            var cmd = "get_list_machine";
            var data = $.param({
                cm:cmd
            });
            return $http.post(url,data).then(handleSuccess,handleError('Error get list Machine'));

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
