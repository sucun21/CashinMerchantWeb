/* global theApp, Highcharts */

(function () {
    'use strict';
    theApp.controller('DashboardController', DashboardController);
    DashboardController.$inject = ['$scope', 'DashboardService', 'LoginService', '$rootScope', '$uibModal', '$timeout', '$location', '$confirm'];
    function DashboardController($scope, DashboardService, LoginService, $rootScope, $uibModal, $timeout, $location, $confirm) {
        $rootScope.summary;
        $scope.date = new Date();

        var YESTERDAY = 1;
        var TODAY = 2;
        var BEFORE7DAY = 3;
        var THISMONTH = 4;
        var LASTMONTH = 5;


        var selectTime_merchant = BEFORE7DAY;
        var m_textTime = 'DOANH THU 7 NGÀY QUA';

        

        var g_currentDay = 0;
        var g_currentMonth = 0;
        var g_currentYear = 0;


        var name_merchant = "CASH";
        var chart_merchant = null;
        var category_merchant = [];
        var data_merchant = [];
        var total_money_merchant = 0;

        var m_fromDate = null;
        var m_toDate = null;

        $scope.sl_time_merchant = 3;
        $scope.listDataMerchant = [];
        $scope.time_option=[
                    {
                        optionID: 1,
                        optionName: 'Hôm qua'
                    },
                    {
                        optionID: 2,
                        optionName: 'Hôm nay'
                    },
                    {
                        optionID: 3,
                        optionName: '7 ngày qua'
                    }
                    ,
                    {
                        optionID: 4,
                        optionName: 'Tháng này'
                    }
                    ,
                    {
                        optionID: 5,
                        optionName: 'Tháng trước'
                    }
                ];


        if (!LoginService.isLogined()) {
            $location.path("/login");
            return;
        }
        $scope.loadPage = function () {
            var date = "";
            if ($scope.date !== "") {
                var month=$scope.date.getMonth()+1;
                var day=$scope.date.getDate();
                if(month<10){
                    month='0'+month;
                }
                if(day<10){
                    day='0'+day;
                }
                date = $scope.date.getFullYear() + "-" + month + "-" + day;
            }
            console.log('date: ' + date );

           DashboardService.getSummaryInvoice(date)
                    .then(function (response) {
                        if (response.err === 0) {
                            console.log(response.dt);
                           $rootScope.summary = response.dt;
                        } else {
                            console.log("error get summary invoice");
                        }

                    });
        }
        
        $scope.search = function() {
            $scope.loadPage();
        };

        $rootScope.dataFromDashboard = null;
        $scope.changePage=function(){
            $rootScope.dataFromDashboard=$scope.date;
            console.log('changePage'+ $rootScope.dataFromDashboard);

            $location.path('/listinvoice');
        }

        $scope.time_merchant_change = function () {

            /* get current time*/
            getCurrentTime();
            selectTime_merchant = parseInt($scope.sl_time_merchant);
            switch (selectTime_merchant) {
                case YESTERDAY:
                    m_fromDate = getDayInfo(-1);
                    m_toDate = getDayInfo(-1); // current date
                    m_textTime = 'DOANH THU HÔM QUA';
                    break;
                case TODAY:
                    m_fromDate = getDayInfo(0);
                    m_toDate = getDayInfo(0); // current date
                    m_textTime = 'DOANH THU HÔM NAY';
                    break;
                case BEFORE7DAY:
                    m_fromDate = getDayInfo(-6);
                    m_toDate = getDayInfo(0); // current date                            
                    m_textTime = 'DOANH THU 7 NGÀY QUA';
                    break;
                case THISMONTH:
                    var totalDays = new Date(g_currentYear, g_currentMonth, 0).getDate();
                    m_fromDate = g_currentYear + '-' + ((parseInt(g_currentMonth) < 10) ? '0' + g_currentMonth : g_currentMonth) + '-' + '01';
                    m_toDate = g_currentYear + '-' + ((parseInt(g_currentMonth) < 10) ? '0' + g_currentMonth : g_currentMonth) + '-' + totalDays.toString();
                    m_textTime = 'DOANH THU THÁNG NÀY';
                    break;
                case LASTMONTH:
                    if (g_currentMonth === 1) {
                        g_currentMonth = 12;
                        g_currentYear = g_currentYear - 1;
                    } else {
                        g_currentMonth = g_currentMonth - 1;
                    }
                    var totalDays = new Date(g_currentYear, g_currentMonth, 0).getDate();
                    m_fromDate = g_currentYear + '-' + ((parseInt(g_currentMonth) < 10) ? '0' + g_currentMonth : g_currentMonth) + '-' + '01';
                    m_toDate = g_currentYear + '-' + ((parseInt(g_currentMonth) < 10) ? '0' + g_currentMonth : g_currentMonth) + '-' + totalDays.toString();
                    m_textTime = 'DOANH THU THÁNG TRƯỚC';
                    break;
                default:
                    break;
            }
            ;
            drawChartMerchant();
        };

        /*-- options merchant --*/
        var options_chart_merchant = {
            chart: {
                type: 'column',
                renderTo: 'container_merchant'
            },
            title: {
                text: 'Thống kê theo ngày'
            },
            subtitle: {
                text: 'Nguồn: <a href="#">CASH</a>'
            },
            xAxis: {
                categories: category_merchant,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Tiền (VNĐ)'
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },

            tooltip: {
                formatter: function () {
                    var x = this.x;
                    var y = this.y;
                    return '<b>' + this.series.name + '</b><br/>' +
                            '+ Ngày: ' + x + '<br/>' +
                            '+ Tiền: ' + y.toLocaleString('de-DE') + ' VNĐ';
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    color: '#00C853'
                }
            },
            series: [{
                    name: name_merchant,
                    data: data_merchant

                }]
        };
        function drawChartMerchant() {
            total_money_merchant = 0;
            DashboardService.getReportByDateOfPage(m_fromDate, m_toDate)
                    .then(function (response) {
                        if (response.err === 0) {
                            $scope.listDataMerchant = JSON.parse(response.dt.chartInvoices);
                            var n=$scope.listDataMerchant.length;
                            if(n==0){
                                n = parseInt(diffDays(m_fromDate, m_toDate)); 
                                data_merchant = new Array(n);
                                category_merchant = new Array(n); 
                                for (var i = 0; i < n; i++) {
                                category_merchant[i] = addDate(m_fromDate, i);
                                data_merchant[i] = 0;
                                total_money_merchant = total_money_merchant + data_merchant[i];
                                }
                            }
                            else{
                                data_merchant = new Array(n);
                                category_merchant = new Array(n); 
                                for (var i = 0; i < n; i++) {
                                    category_merchant[i] = $scope.listDataMerchant[i].date;
                                    data_merchant[i] = parseInt($scope.listDataMerchant[i].totalAmount);
                                    total_money_merchant = total_money_merchant + data_merchant[i];
                                }
                            }
                            chart_merchant = new Highcharts.Chart(options_chart_merchant);
                            chart_merchant.series[0].setData(data_merchant);
                            chart_merchant.xAxis[0].setCategories(category_merchant);
                            chart_merchant.setTitle(null, {text: "(" + m_fromDate + ' -> ' + m_toDate + ")"});
                            chart_merchant.redraw();
                            document.getElementById("p_total_money_merchant").innerHTML = m_textTime + " <b>" + total_money_merchant.toLocaleString('de-DE') + "</b> VNĐ";
                        } else if (response.err === 101) {      // has not logged in
                            $location.path('/login');
                        } else {
                            console.log(response.msg);
                        }
                    });
        }
        ;

        function getCurrentTime() {
            var dt = new Date();
            g_currentDay = dt.getDate();
            g_currentMonth = dt.getMonth() + 1;
            g_currentYear = dt.getFullYear();
        }
        ;    
        function getDayInfo(index) {
            var currentDay = new Date();
            var preDay = new Date(currentDay);
            preDay.setDate(currentDay.getDate() + parseInt(index));
            var month = ((preDay.getMonth() + 1).toString().length === 1) ? ('0' + (preDay.getMonth() + 1)) : (preDay.getMonth() + 1);
            var day = (preDay.getDate().toString().length === 1) ? ('0' + preDay.getDate()) : (preDay.getDate());
            var year = preDay.getFullYear();
            return year + '-' + month + '-' + day;
        }
        ;
        var diffDays = function (fromDate, toDate) {
            var timeDiff = new Date(toDate).getTime() - new Date(fromDate).getTime();
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return parseInt(diffDays) + 1;
        };

        var addDate = function (date, index) {
            var dt = new Date(date);
            dt.setDate(dt.getDate() + parseInt(index));
            var dateFormated = dt.toISOString().substr(0, 10);
            return dateFormated;
        };

        $scope.init = function () {
            console.log('init summaryinvoicecontroller');
            $scope.loadPage();

            m_fromDate = getDayInfo(-6); // 7days ago          
            m_toDate = getDayInfo(0); // currunt date
            drawChartMerchant();
        };
        $scope.init();
    }
})();