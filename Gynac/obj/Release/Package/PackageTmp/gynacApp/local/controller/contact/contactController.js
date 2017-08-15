app.controller("contactController",["$scope", "dataService", "$rootScope", "$state", function($scope, dataService, $rootScope, $state){
	
    $scope.contact = {};
    
    function isValid(){
        var valid = true;
        $scope.contactUsError = {};
        if(!$scope.contact.FromAddress){
            $scope.contactUsError.emailRequired = true;
            valid = false;
        }else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.contact.FromAddress))){
            $scope.contactUsError.emailInvalid = true;
            valid = false;
        }
        if(!$scope.contact.Name){
            $scope.contactUsError.NameRequired = true;
            valid = false;
        }
        if(!$scope.contact.Subject){
            $scope.contactUsError.SubjectRequired = true;
            valid = false;
        }
        if(!$scope.contact.Body){
            $scope.contactUsError.BodyRequired = true;
            valid = false;
        }
        
        return valid;
    }
    
    $scope.contactUs = function () {
        if(isValid()){
            var webURL = 'api/gynac/sendcontactusemail';
            dataService.postData(webURL, $scope.contact).then(function (data) {
                console.log(data);
                if (data == 1) {
                    $("#triggerMailSentModal").trigger('click');
                }
                else {
                    $('#triggerInternalError').trigger('click');
                }

            }, function (errorMessage) {
                console.log(errorMessage + ' Error......');
            });
        }
	}
    
    $scope.signOut = function () {
        $rootScope.$emit('signOut', $rootScope.authenticatedUser.UserInfo.User_Id);
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }

    $scope.goToHome = function () {
        $state.go('home');
    }
    
    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };

    $scope.getAllNotification = function () {
        $rootScope.$emit('updateNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
    }
	
}]);