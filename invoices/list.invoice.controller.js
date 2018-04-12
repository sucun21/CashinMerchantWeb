/* global theApp, Highcharts */

(function () {
    'use strict';
    theApp.controller('ListInvoiceController', ListInvoiceController);
    ListInvoiceController.$inject = ['$scope', 'ListInvoiceService', 'LoginService', '$rootScope', '$uibModal', '$timeout', '$location', '$confirm'];
    function ListInvoiceController($scope, ListInvoiceService, LoginService, $rootScope, $uibModal, $timeout, $location, $confirm) {
        $rootScope.listinvoice = [];
        $scope.totalOpenBoxPerPageList = [10, 30, 50, 100];
        $scope.totalOpenBoxPerPage = 10;
        $scope.currentPage = 1;
        $scope.fromDate = new Date();
        $scope.toDate = new Date();
        $scope.itemNameSearch="";

        $scope.tempListPaymentStatus = [];
        $scope.tempObjPaymentStatus = {
            tranStatusID: -10,
            tranStatusName: "Tất cả"
        };
        $scope.tempListPaymentStatus.push($scope.tempObjPaymentStatus);
        $scope.initTempListPaymentStatus = function() {
            for (var i in $rootScope.tranStatus) {
                $scope.tempListPaymentStatus.push($rootScope.tranStatus[i]);
            }
        }
        $scope.initTempListPaymentStatus();
        $scope.paymentSttSelectedID = 1;
        if (!LoginService.isLogined()) {
            $location.path("/login");
            return;
        }
         $scope.loadPageChoose = function () {
            var fromDate = "";
            var toDate = "";
            var invoice_code=$scope.itemNameSearch;
            

            if ($rootScope.dataFromDashboard != null){
                $scope.fromDate = $rootScope.dataFromDashboard;
                $scope.toDate = $rootScope.dataFromDashboard;
                $rootScope.dataFromDashboard = null;
                $("#toDate").datepicker('update', $scope.toDate);
                $("#fromDate").datepicker('update', $scope.fromDate);

            }

            if ($scope.fromDate !== "") {
                var month=$scope.fromDate.getMonth()+1;
                var date=$scope.fromDate.getDate();
                if(month<10){
                    month='0'+month;
                }
                if(date<10){
                    date='0'+date;
                }
                fromDate = $scope.fromDate.getFullYear() + "-" + month + "-" + date;
            }
            

            if ($scope.toDate !== "") {
                var month=$scope.toDate.getMonth()+1;
                var date=$scope.toDate.getDate();
                if(month<10){
                    month='0'+month;
                }
                if(date<10){
                    date='0'+date;
                }
                toDate = $scope.toDate.getFullYear() + "-" + month + "-" +date;
            }

            ListInvoiceService.getListInvoice($scope.currentPage,$scope.totalOpenBoxPerPage,fromDate,toDate, $scope.paymentSttSelectedID)
                    .then(function (response) {
                        if (response.err === 0) {
                            $rootScope.listinvoice = JSON.parse(response.dt.list_invoice);
                            $scope.totalInvoice = response.dt.length;
                        } else {
                            console.log("error get list invoice");
                        }

                    });
        }
         $scope.init = function () {
            
            console.log('init listinvoicecontroller');
            $scope.loadPageChoose();
        };

        $scope.init();

        $scope.search = function() {
             $scope.loadPageChoose();
        };

        $scope.changePageSize = function () {
            $scope.currentPage = 1;
            $scope.loadPageChoose();
        };
        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    }
})();