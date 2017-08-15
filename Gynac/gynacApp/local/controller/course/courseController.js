app.controller("courseController", ["$scope", "$rootScope", "dataService", "$filter", "$state", "$interval", "$stateParams", "$modal", function ($scope, $rootScope, dataService, $filter, $state, $interval, $stateParams, $modal) {


    $scope.getAllNotification = function () {
        $rootScope.$emit('updateNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
    }
}]);