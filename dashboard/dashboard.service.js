/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('DashboardService', DashboardService);

    DashboardService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function DashboardService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL + "invoices"; 
        
        service.getSummaryInvoice = getSummaryInvoice;
        service.getReportByDateOfPage = getReportByDateOfPage;
        return service;
        
        function getSummaryInvoice(date) {
            var cmd = "get_summamy_invoice";
            var dtJSON = {    
                date: date
            };
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt:dt
            });            
            return $http.post(url, data).then(handleSuccess, handleError('Error get list invoice'));
        }

        function getReportByDateOfPage(fromDate, toDate) {
            var cmd = "get_chart_invoice";  
            var dtJSON = {
                            from_date: fromDate,
                            to_date: toDate,
                         };
            var dt = JSON.stringify(dtJSON);          
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            
            return $http.post(url, data).then(handleSuccess, handleError('Error get invoice by month'));            
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
