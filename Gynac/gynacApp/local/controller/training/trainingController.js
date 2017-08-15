app.controller("trainingController",["$scope", "dataService", "$rootScope", "$state", "$filter", function($scope, dataService, $rootScope, $state, $filter){
	
    if(!$rootScope.authenticatedUser.UserInfo.User_Id){
        $state.go('home');
    }
    
	$scope.clickMe = function(){
		var webURL = 'appData/zoneData.json'
		dataService.getData(webURL).then(function (data) {
			console.log(data)
		}, function (errorMessage) {
			console.log(errorMessage + ' Error......');
		});
	}
    
	$scope.signOut = function () {
	    $rootScope.$emit('signOut', $rootScope.authenticatedUser.UserInfo.User_Id);
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }
    
    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };
    
    if($rootScope.authenticatedUser.ActiveUserCourse){
        for(var i = 0; i < $rootScope.authenticatedUser.ActiveUserCourse.length; i++){
            var data = $filter('filter')($rootScope.speakerVideoList, {Course_Id : $rootScope.authenticatedUser.ActiveUserCourse[i].Course_Id});
            if(data[0]){
                $rootScope.authenticatedUser.ActiveUserCourse[i].DrName = data[0].DrName;
            }
        }
        
        for(var i = 0; i < $rootScope.authenticatedUser.ExpiredUserCourse.length; i++){
            var data = $filter('filter')($rootScope.speakerVideoList, {Course_Id : $rootScope.authenticatedUser.ExpiredUserCourse[i].Course_Id});
            if(data[0]){
                $rootScope.authenticatedUser.ExpiredUserCourse[i].DrName = data[0].DrName;
            }
        }
    }

    $scope.getAllNotification = function () {
        $rootScope.$emit('updateNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
    }
	
}]);