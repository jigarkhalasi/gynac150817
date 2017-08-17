app.controller("courseController", ["$scope", "$rootScope", "dataService", "$filter", "$state", "$interval", "$stateParams", function ($scope, $rootScope, dataService, $filter, $state, $interval, $stateParams) {


    $scope.getAllNotification = function () {
        $rootScope.$emit('updateNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
    }
}]);