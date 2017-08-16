app.controller("signInController", ["$scope", "dataService", "$rootScope", "$state", "$stateParams", function ($scope, dataService, $rootScope, $state, $stateParams) {
/*$rootScope.authenticatedUser = {
  "UserInfo": {
    "User_Id": 2,
    "Title": "Prof",
    "First_Name": "TestFN",
    "Middle_Name": "",
    "Last_Name": "TestLN",
    "Email": "TestFNTestLN@gmail.com",
    "Email_Verified": true,
    "Mobile": "1234567891",
    "Password": "12345678",
    "Professional_Specialty": "Proff",
    "Educational_Qualification": "Edu",
    "Street_Address": "Add",
    "City_Town": "Mumbai",
    "Country": "India",
    "Institution_Work_Place": "work",
    "Where_Hear": "Web"
  },
  "PendingUserCourse": [
    {
      "User_Id": 2,
      "Course_Id": 2,
      "Registered_Date": "01/01/2016",
      "Registered_Till": "01/01/2016",
      "Payment_Mode": "",
      "Payment_Amount": 0.00000,
      "Payment_Currency": "",
      "Payment_Pending": true
    }
  ],
  "ActiveUserCourse": [
    {
      "User_Id": 2,
      "Course_Id": 1,
      "Registered_Date": "01/01/2016",
      "Registered_Till": "01/01/2016",
      "Payment_Mode": "",
      "Payment_Amount": 0.00000,
      "Payment_Currency": "",
      "Payment_Pending": false
    },
    {
      "User_Id": 2,
      "Course_Id": 2,
      "Registered_Date": "01/01/2016",
      "Registered_Till": "01/01/2016",
      "Payment_Mode": "",
      "Payment_Amount": 0.00000,
      "Payment_Currency": "",
      "Payment_Pending": false
    }
  ],
  "ExpiredUserCourse": [
    {
      "User_Id": 2,
      "Course_Id": 7,
      "Registered_Date": "01/01/2016",
      "Registered_Till": "01/01/2016",
      "Payment_Mode": "",
      "Payment_Amount": 0.00000,
      "Payment_Currency": "",
      "Payment_Pending": false
    }
  ]
}
 */

/*,
    {
      "User_Id": 2,
      "Course_Id": 3,
      "Registered_Date": "01/01/2016",
      "Registered_Till": "01/01/2016",
      "Payment_Mode": "",
      "Payment_Amount": 0.00000,
      "Payment_Currency": "",
      "Payment_Pending": false
    },
      {
      "User_Id": 2,
      "Course_Id": 4,
      "Registered_Date": "01/01/2016",
      "Registered_Till": "01/01/2016",
      "Payment_Mode": "",
      "Payment_Amount": 0.00000,
      "Payment_Currency": "",
      "Payment_Pending": false
    }*/
    
    
    
    if ($state.is('forgotPassword')) {
        $scope.signIn = 3;
    } else {
        $scope.signIn = 1;
    }
    
    $scope.user = {};
    $scope.forgotUser = {};
    $scope.resetUser = {};
    
    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };
    
    function isValid(){
        var valid = true;
        $scope.errorSignIn = {};
        if(!$scope.user.Email){
            $scope.errorSignIn.emailRequired = true;
            valid = false;
        }else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.user.Email))){
            $scope.errorSignIn.emailInvalid = true;
            valid = false;
        }
        if(!$scope.user.Password){
            $scope.errorSignIn.passwordRequired = true;
            valid = false;
        }
        
        return valid;
    }


    $scope.submitData = function () {
        if(isValid()){        
            var webURL = 'api/gynac/verifylogin'
            dataService.postData(webURL, $scope.user).then(function (data) {
                console.log(data)
                /*if (data) {
                    $rootScope.authenticatedUser = data;
                    $scope.authenticLecture();
                    $('#triggerSucsessfullySigninModal').trigger('click');
                } else {
                    $('#triggerNotFoundSigninModal').trigger('click');
                }*/
                
                $scope.isDisplay = false;
                if(data == null){
                    $('#triggerNotFoundSigninModal').trigger('click');
                } else if (data.EmailVerificationPending == true) {
                    $("#triggerEmailPendding").trigger('click');
                }
                else if (data.IsLogin == true) {
                    $("#triggerEmailPendding").trigger('click');                    
                    $rootScope.authenticatedUser.UserInfo.User_Id = data.UserInfo.User_Id;
                    $scope.isDisplay = true;
                }
                else {
                    $scope.signIn = 5;
                    $scope.dothisdone = data.Otp;
                    $scope.logindata = data;

                    //$scope.name = 'Superhero';
                    //$scope.counter = 300;
                    //$scope.onTimeout = function () {
                    //    if ($scope.counter > 0) {
                    //        $scope.counter--;
                    //        mytimeout = $timeout($scope.onTimeout, 1000);
                    //    }
                    //    else {
                    //        //otp blank
                    //    }

                    //}
                    //var mytimeout = $timeout($scope.onTimeout, 1000);
                    //$rootScope.authenticatedUser = data;
                    //localStorage.setItem("User", $rootScope.authenticatedUser.UserInfo.User_Id);
                    //$scope.authenticLecture();
                    //$('#triggerSucsessfullySigninModal').trigger('click');               
                }
                
            }, function (errorMessage) {
                console.log(errorMessage + ' Error......');
            });
        }
    }
    
    $scope.checkotp = function () {
        if ($scope.dothisdone == $scope.signin.otp) {
            $rootScope.authenticatedUser = $scope.logindata;
            var webURL = 'api/gynac/signin?userId=' + $rootScope.authenticatedUser.UserInfo.User_Id;
            dataService.postData(webURL, {}).then(function (data) {
                console.log(data);                
                localStorage.setItem("User", $rootScope.authenticatedUser.UserInfo.User_Id);
                $scope.authenticLecture();
                //$('#triggerSucsessfullySigninModal').trigger('click');                                
                window.location.href = "/#/home";
            }, function (errorMessage) {
                console.log(errorMessage + ' Error......');
            });
        }
        else {
            alert("Wrong OTP, Please check and verify.");
        }
    }

    function forgotValid(){
        var valid = true;
        $scope.errorForgot = {};
        if(!$scope.forgotUser.Email){
            $scope.errorForgot.emailRequired = true;
            valid = false;
        }else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.forgotUser.Email))){
            $scope.errorForgot.emailInvalid = true;
            valid = false;
        }
        
        return valid;
    }

    $scope.forgotPassword = function () {
        if(forgotValid()){
            var webURL = 'api/gynac/forgotpassword'
            dataService.postData(webURL, $scope.forgotUser).then(function (data) {
                console.log(data)

                if (data == 1) {
                    $('#triggerSucsessfullyForgotPasswordModal').trigger('click');
                } else if (data == 2) {
                    $('#triggerSucsessfullyForgotPasswordModal').trigger('click');
                } else {
                    $('#triggerInternalError').trigger('click');
                }

            }, function (errorMessage) {
                console.log(errorMessage + ' Error......');
            });
        }
    }
    
    function isResetValid(){
        var valid = true;
        $scope.errorReset = {};
        if($scope.resetUser.Password != $scope.resetUser.conformPassword){
            $scope.errorReset.passwordNotMatch = true;
            valid = false;
        }
        
        return valid;
    }


    $scope.resetPassword = function () {
        if(isResetValid()){
            var webURL = 'api/gynac/resetpassword';
            $scope.resetUser.Guid = $stateParams.id
            $scope.resetUser.Email = $stateParams.email;
            dataService.postData(webURL, $scope.resetUser).then(function (data, status) {
                console.log(data)
                if (data == 1) {
                    $('#triggerSucsessfullyPasswordChangedModal').trigger('click');
                } else if (data == 2) {
                    $('#triggerNotFoundForgotPasswordModal').trigger('click');
                } else {
                    $('#triggerInternalError').trigger('click');
                }
            }, function (errorMessage) {
                console.log(errorMessage + ' Error......');
            });
        }
    }

    $scope.authenticLecture = function () {
        var penddingLecLength = $rootScope.authenticatedUser.ActiveUserCourse.length;
        for (var i = 0; i < penddingLecLength; i++) {
            var lecLength = $rootScope.speakerVideoList.length;
            for (var j = 0; j < lecLength; j++) {
                if (($rootScope.authenticatedUser.UserInfo.User_Id == $rootScope.authenticatedUser.ActiveUserCourse[i].User_Id) && ($rootScope.authenticatedUser.ActiveUserCourse[i].Course_Id == $rootScope.speakerVideoList[j].Course_Id)) {
                    $rootScope.speakerVideoList[j].isActive = true;
                }
            }
        }
        console.log($rootScope.speakerVideoList)
    }

    $scope.signOut = function () {
        $rootScope.$emit('signOut', $rootScope.authenticatedUser.UserInfo.User_Id);
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        location.reload();
        $state.go('home');
    }

    $scope.goToHome = function () {
        $state.go('home');
    }

    $scope.goToLogin = function () {
        $state.go('signIn');
    }

    
}]);
