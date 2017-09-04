app.controller("imageSubmissionController", ["$scope", "dataService", "$rootScope", "$state", "$stateParams", "$http", function ($scope, dataService, $rootScope, $state, $stateParams, $http) {

    $scope.display = true;

    if ($stateParams.userTalkId != "0") {
        $scope.display = false;
    }

    $scope.getModuleImages = function () {
        var userId = 45;//($rootScope.authenticatedUser.UserInfo.User_Id) ? $rootScope.authenticatedUser.UserInfo.User_Id : "0";
        var moduleId = $stateParams.moduleId;
        var webURL = 'api/gynac/getmoduleimages?moduleId=' + moduleId + '&&userId=' + userId;
        dataService.getData(webURL, {}).then(function (data) {
            console.log(data);
            $scope.moduleImages = data;
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }
    $scope.getModuleImages();

    $scope.uploadFile = function (input) {
        var userId = 45;//($rootScope.authenticatedUser.UserInfo.User_Id) ? $rootScope.authenticatedUser.UserInfo.User_Id : "0";
        var fd = new FormData();
        //Take the first selected file
        var files = input.files;
        var i = input.name;
        var ModuleImageId = ($scope.moduleImages[i] != null && $scope.moduleImages[i] != undefined) ? $scope.moduleImages[i].ModuleImageId : "0";
        var UserImageId = ($scope.moduleImages[i] != null && $scope.moduleImages[i] != undefined) ? $scope.moduleImages[i].UserImageId : "0";
        fd.append("file", files[0]);
        fd.append("UserId", userId);
        fd.append("ModuleId", $stateParams.moduleId);
        fd.append("ModuleImageId", ModuleImageId);
        fd.append("userModuleImageId", UserImageId);

        var webURL = 'api/gynac/uploadmoduleimage';

        console.log($scope.selectedItem);
        
        $http.post(webURL, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function () {
            alert("upload!!");
            $scope.getModuleImages();
        }).error(function () {
            alert("Error");
        });

    };

    $scope.clickMe = function () {
        var webURL = 'appData/zoneData.json'
        dataService.getData(webURL).then(function (data) {
            console.log(data)
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }

    $scope.signOut = function () {
        //singn out
        $rootScope.$emit('signOut', $rootScope.authenticatedUser.UserInfo.User_Id);
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }


    $scope.getAllNotification = function () {
        $rootScope.$emit('updateNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
    }

}]);