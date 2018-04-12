(function() {
    'use strict';

    theApp
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$scope', '$rootScope', 'AccountService', 'LoginService', '$cookies', '$mdDialog', '$location'];
    function AccountController($scope, $rootScope, AccountService, LoginService, $cookies, $mdDialog, $location) {
        $scope.submitClicked = false;
        $scope.showError = false;
        $scope.showSuccess = false;

        if (!LoginService.isLogined()) {
            $location.path("/login");
            return;
        }

        var username = $rootScope.globals.currentUser.username;



        if ( username === undefined || username === "") {
            $location.path("/login");
            return;
        }
        
        $scope.changePassword = function() {
            $scope.submitClicked = true;

            if (!$scope.accountForm.$valid) {
                return;
            }
            if($scope.old_password===undefined||$scope.old_password===""){
                $scope.showError = true;
                $scope.alertMsg = "Yêu cầu nhập mật khẩu hiện thời";
                return;
            }
            console.log(username);

            if ($scope.new_password !== $scope.new_password_conf) {
                $scope.showError = true;
                $scope.alertMsg = "Mật khẩu nhập lại không trùng khớp";
                return;
            }

            AccountService.changePassword( username, $scope.old_password, $scope.new_password)
                    .then(function(response) {

                        if (response.err === 0) {
                            $scope.showSuccess = true;
                            $scope.showError = false;
                            $scope.alertMsg = "Cập nhật thành công";
                            $location.path("/dashboard");
                        }
                        else{
                            $scope.showError = true;
                            $scope.alertMsg = "Mật khẩu hiện thời không đúng";
                        }
                    });

        };

        $scope.nextInput = function(id) {
            $("#" + id).focus();
        };

        $scope.showAlert = function(ev) {
            $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Thông báo')
                    .textContent(ev)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent(ev)
                    );
        };
    }

})();