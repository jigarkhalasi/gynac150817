app.controller("signUpController",["$scope", "dataService", "$rootScope", "$state", function($scope, dataService, $rootScope, $state){
	
    $scope.emailVerified = function () {
        var webURL = 'api/gynac/emailVerified';
        console.log($scope.user);
        dataService.postData(webURL, $scope.user).then(function (data) {
            console.log(data)
            $scope.submitData();
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }
    
    $scope.user = {};
    $scope.user.isChecked = false;
    
    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };

    $scope.isConditional = function (isChecked) {
        if (isChecked) {
            $scope.user.isChecked = false;
        }
        else {
            $scope.user.isChecked = true;
        }
    }
    
    function isValid(){
        var valid = true;
        $scope.errorSignUp = {};
        if(!$scope.user.Title){
            $scope.errorSignUp.Title = true;
            valid = false;
        }
        if(!$scope.user.First_Name){
            $scope.errorSignUp.First_Name = true;
            valid = false;
        }
        if(!$scope.user.Last_Name){
            $scope.errorSignUp.Last_Name = true;
            valid = false;
        }
        if(!$scope.user.Professional_Specialty){
            $scope.errorSignUp.Professional_Specialty = true;
            valid = false;
        }
        /*if(!$scope.user.Educational_Qualification){
            $scope.errorSignUp.Educational_Qualification = true;
            valid = false;
        }*/
        if(!$scope.user.Street_Address){
            $scope.errorSignUp.Street_Address = true;
            valid = false;
        }
        if(!$scope.user.Country){
            $scope.errorSignUp.Country = true;
            valid = false;
        }
        if(!$scope.user.City_Town){
            $scope.errorSignUp.City_Town = true;
            valid = false;
        }
        if(!$scope.user.Mobile){
            $scope.errorSignUp.Mobile = true;
            valid = false;
        }
        if(!$scope.user.Institution_Work_Place){
            $scope.errorSignUp.Institution_Work_Place = true;
            valid = false;
        }
        if(!$scope.user.Email){
            $scope.errorSignUp.emailRequired = true;
            valid = false;
        }else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.user.Email))){
            $scope.errorSignUp.emailInvalid = true;
            valid = false;
        }
        if(!$scope.user.Password){
            $scope.errorSignUp.Password = true;
            valid = false;
        }else if($scope.user.rePassword != $scope.user.Password){
            $scope.errorSignUp.rePassword = true;
            valid = false;
        }
        /*if(!$scope.user.Where_Hear){
            $scope.errorSignUp.Where_Hear = true;
            valid = false;
        }*/
        
        return valid;
    }

	$scope.submitData = function(){
        if(isValid()){
            var webURL = 'api/gynac/saveuser';
            console.log($scope.user);
            dataService.postData(webURL, $scope.user).then(function (data) {
                console.log(data);
                /*if(data == 'Found'){
                    $('#triggerFoundSignupModal').trigger('click');
                }else{               
                    $('#triggerSucsessfullySignupModal').trigger('click');
                }*/
                
                if(data == 0){
                    $('#triggerInternalError').trigger('click');
                }else if(data == 1){
                    $('#triggerSucsessfullySignupModal').trigger('click');
                }else if(data == 2){
                    $('#triggerFoundSignupModal').trigger('click');
                }
                
                //$state.go('home');
            }, function (errorMessage) {
                console.log(errorMessage + ' Error......');
            });
        }else{
            $( "body" ).scrollTop( 100 );
        }
	}
    
	$scope.signOut = function () {
	    $rootScope.$emit('signOut', $rootScope.authenticatedUser.UserInfo.User_Id);
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }
    
    $scope.goToHome = function(){
        $state.go('home');
    }
	
}]);