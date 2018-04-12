/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('ListInvoiceService', ListInvoiceService);

    ListInvoiceService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function ListInvoiceService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL + "invoices"; 
        
        service.getListInvoice = getListInvoice;
        return service;

        function getListInvoice(currentPage,totalItemPerPage,fromDate,toDate, status) {
            var cmd = "get_list_invoice";
            var dtJSON = {    
                current_page: currentPage,
                total_item_per_page: totalItemPerPage,
                from_date: fromDate,
                to_date: toDate,
                status: status
            };
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt:dt
            });            
            return $http.post(url, data).then(handleSuccess, handleError('Error get list invoice'));
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
