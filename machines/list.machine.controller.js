
(function(){
	'use strict';
	theApp.controller('MachineController',MachineController);
	MachineController.$inject=['$scope','MachineService','LoginService','$rootScope','$uibModal','$timeout','$location','$confirm'];
	function MachineController($scope,MachineService,LoginService,$rootScope,$uibModal,$timeout,$location,$confirm){
		$rootScope.listmachine=[];

		if(!LoginService.isLogined()){
			$location.path("/login");
			return;
		}

		$scope.search= function(){
			console.log("get list machine");
			MachineService.getListMachine()
					.then(function (response){
						if(response.err==0){
							$rootScope.listmachine=response.dt;
							$scope.items=response.dt;
						}else{
							console.log("error get list Machine");
						}
					});
		};
		$scope.init = function () {
			console.log("init listMachineController");
			$scope.search();
		};
		$scope.init();

		$scope.deleteItems = function () {
            console.log('delete items');
            $scope.listItemIDDelete = [];
            for (var i in $scope.listmachine) {
                if ($scope.listmachine[i].delete_selected === true) {
                    $scope.listItemIDDelete.push($scope.listmachine[i].machine_name);
                }
            }
            if ($scope.listItemIDDelete.length <= 0) {
                alert('Bạn phải chọn may trước khi xoá.');
            } else {
                $confirm({title: 'Xóa tủ', text: 'Bạn có chắc chắn xóa may này ra khỏi hệ thống?'})
                        .then(function () {
                            console.log('delete list item');
                            MachineService.deleteListItem($scope.listItemIDDelete)
                                    .then(function (response) {
                                        if (response.err === 0) {
                                            console.log('delete machine success');
                                            $scope.init();
                                        } else {
                                            console.log("error delete machine");
                                        }
                                    });
                        });

            }
        };

        $scope.openPopupEditItem = function(item) {
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupEditItem.html',
                controller: 'EditItemController',
                resolve: {
                    itemMachine: function () {
                        return item;
                    }
                }
            });
        };

        $scope.openPopupAddItem = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupAddItem.html',
                controller: 'AddItemController',
                resolve: {
                }
            });
        };
    }

    theApp.controller('EditItemController', EditItemController);
    EditItemController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'MachineService', 'itemMachine'];
    function EditItemController($rootScope, $scope, $uibModalInstance, MachineService, itemMachine) {
        $scope.editItem = {};
        $scope.init = function() {
            console.log(JSON.stringify(itemMachine));
            $scope.editItem.machine_name = itemMachine.machine_name;
            $scope.editItem.address = itemMachine.address;
            $scope.editItem.action_type = itemMachine.action_type;
        };
        $scope.init();
        $scope.edit = function() {
            if(String($scope.editItem.machine_name).trim() === "" || String($scope.editItem.machine_name).trim() === "undefined") {
                $scope.errItemIsNull = true;
                return;
            }
            MachineService.editItem($scope.editItem)
                    .then(function (response) {
                        if (response.err == 0) {
                            console.log('edit machine success');
                            $scope.updateItemInList();
                        } else {
                            console.log("error edit machine");
                            alert('Chỉnh sửa thông tin thất bại.');
                         }
                    });
            $uibModalInstance.close();
        };
        
        $scope.updateItemInList = function() {
            for(var i in $rootScope.listmachine) {
                if($rootScope.listmachine[i].machine_name === $scope.editItem.machine_name) {
                    $rootScope.listmachine[i].action_type = $scope.editItem.action_type;
                    $rootScope.listmachine[i].address = $scope.editItem.address;
                    break;
                }
            }
        };
        
        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    }

    theApp.controller('AddItemController', AddItemController);
    AddItemController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'MachineService'];
    function AddItemController($rootScope, $scope, $uibModalInstance, MachineService) {
        $scope.newItem = {};
        $scope.errItemIsNull = false;
        $scope.ok = function () {
            if(String($scope.newItem.machine_name).trim() === "" || String($scope.newItem.machine_name).trim() === "undefined") {
                $scope.errItemIsNull = true;
                return;
            }
            MachineService.insertItem($scope.newItem)
                    .then(function (response) {
                        if (response.err === 0) {
                            $scope.newItem = response.dt;
                            $rootScope.listmachine.push($scope.newItem);
                            console.log('insert cabinet success');
                        } else {
                            console.log("error insert cabinet");
                            alert('Lưu thông tin thất bại.');
                         }
                    });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
        
    }


})();