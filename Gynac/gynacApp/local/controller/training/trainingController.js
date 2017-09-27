app.controller("trainingController",["$scope", "dataService", "$rootScope", "$state", "$filter", function($scope, dataService, $rootScope, $state, $filter){
	
    //$rootScope.authenticatedUser.UserInfo.User_Id = 45;
    $scope.userId = ($rootScope.authenticatedUser.UserInfo.First_Name) ? $rootScope.authenticatedUser.UserInfo.User_Id : "0";
    if ($rootScope.authenticatedUser.UserInfo.User_Id) {
        //$scope.$apply(function () {
            $scope.useremail = $rootScope.authenticatedUser.UserInfo.Email;
            $scope.part = $rootScope.authenticatedUser.UserInfo.Isparticipate;
            $scope.TutorialSummaryTitle = $rootScope.authenticatedUser.UserInfo.TutorialSummaryTitle;
            if ($scope.StartDate != "" && $scope.EndDate != "")
            {
                $scope.StartDate = new Date($scope.StartDate);
                $scope.EndDate = new Date($scope.EndDate);
            }
        //});
    }
    else {
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

    //$scope.userId = ($rootScope.authenticatedUser.UserInfo.First_Name) ? $rootScope.authenticatedUser.UserInfo.User_Id : "0";
    $scope.selectuserTalk = "";

    //get user talks
    $scope.getUserTalks = function () {
        $scope.index = 0;
        var webURL = 'api/gynac/getusertalks?userId=' + $scope.userId;
        dataService.getData(webURL).then(function (data) {
            $scope.userTalkList = data;
            $scope.userTalkList.UserTalkId = ($scope.userTalkList.UserTalkId) ? $scope.userTalkList.UserTalkId : 0;
            $scope.userTalks = _.reject($scope.userTalkList, function (talk) { return talk.UserTalkId === 0; });
            console.log($scope.userTalks);
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
        //}
    }
    $scope.getUserTalks();

    $scope.getBookmark = function () {
        var webURL = 'api/gynac/getuserbookmark?userId=' + $scope.userId + '&&talkId=' + $scope.selectuserTalk.TalkId;
        dataService.getData(webURL, {}).then(function (data) {
            $scope.userBookmark = data;
            console.log($scope.userBookmark);
            //var setTime = $scope.SecondsTohhmmss($scope.userBookmark.BookMarkTime);
            //$scope.userBookmark.BookMarkTime = setTime == 0 ? "00:00:00" : setTime;
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }

    //$scope.getBookmark();

    $scope.gettutorialSummary = function () {
        var webURL = 'api/gynac/gettutorialsummary?userId=' + $scope.userId;
        dataService.getData(webURL, {}).then(function (data) {            
            $scope.tutorialSummary = data;            
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }

    $scope.gettutorialSummary();

    $scope.setBookmarkId = function (bookmarkId) {
        $scope.currentBookmarkId = bookmarkId;
    }

    $scope.removeBookmark = function () {              
        var webURL = 'api/gynac/deleteuserbookmark?userId=' + $scope.userId + '&&userBookmarkId=' + $scope.currentBookmarkId;
        dataService.postData(webURL, {}).then(function (data) {
            $scope.userBookmark = _.reject($scope.userBookmark, function (bookmark) { return bookmark.Id === $scope.currentBookmarkId; });
            alert("Bookmark Remove Successfully");
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }

    $scope.submitParticipate = function () {
        //alert($scope.part);
        //$scope.useremail = 'jigs.prince79@gmail.com';//$rootScope.authenticatedUser.UserInfo.Email;
        $scope.useremail = $rootScope.authenticatedUser.UserInfo.Email;
        var webURL = 'api/gynac/isparticipate?userId=' + $scope.userId + '&&userEmail=' + $scope.useremail + '&&part=' + $scope.part;
        dataService.postData(webURL, {}).then(function (data) {
            alert("Your request submitted successfully!");
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }

    $scope.getAllNotification = function () {
        $rootScope.$emit('updateNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
    }
	
}]);