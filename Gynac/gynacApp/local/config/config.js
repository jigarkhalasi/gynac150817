var app = angular.module("gynacApp", ['ui.router', 'angular.filter', 'ui.bootstrap']);

app.config(function ($stateProvider, $urlRouterProvider, $sceProvider) {

    $urlRouterProvider.otherwise("/home")

    $sceProvider.enabled(true);

    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "gynacApp/local/controller/home/home.html",
            controller: "homeController"
        })
        .state('emailVerification', {
            url: "/emailVerification/:id/:email",
            templateUrl: "gynacApp/local/controller/home/home.html",
            controller: "homeController"
        })
        .state('about', {
            url: "/about",
            templateUrl: "gynacApp/local/controller/about/aboutPage.html",
            controller: "aboutController"
        })
        .state('course', {
            url: "/course",
            templateUrl: "gynacApp/local/controller/course/coursePage.html",
            controller: "courseController"
        })
        .state('lecture', {
            url: "/lecture",
            templateUrl: "gynacApp/local/controller/lecture/lecturePage.html",
            controller: "lectureController"
        })
        .state('lecturePayment', {
            url: "/lecturePayment/:status/:id",
            templateUrl: "gynacApp/local/controller/lecture/lecturepage.html",
            controller: "lectureController"
        })
        .state('contact', {
            url: "/contact",
            templateUrl: "gynacApp/local/controller/contact/contactPage.html",
            controller: "contactController"
        })
        .state('myProfile', {
            url: "/myProfile",
            templateUrl: "gynacApp/local/controller/myProfile/myProfilePage.html",
            controller: "myProfileController"
        })
        .state('signIn', {
            url: "/signIn",
            templateUrl: "gynacApp/local/controller/signIn/signInPage.html",
            controller: "signInController"
        })
        .state('forgotPassword', {
            url: "/forgotPassword/:id/:email",
            templateUrl: "gynacApp/local/controller/signIn/signInPage.html",
            controller: "signInController"
        })
        .state('signUp', {
            url: "/signUp",
            templateUrl: "gynacApp/local/controller/signUp/signUpPage.html",
            controller: "signUpController"
        })
        .state('training', {
            url: "/training",
            templateUrl: "gynacApp/local/controller/training/trainingPage.html",
            controller: "trainingController"
        })
        .state('faculty', {
            url: "/faculty",
            templateUrl: "gynacApp/local/controller/faculty/facultyPage.html",
            controller: "facultyController"
        })
        .state('testimonial', {
            url: "/testimonial",
            templateUrl: "gynacApp/local/controller/testimonial/testimonial.html",
            controller: "testimonialController"
        })

     .state('imagesubmission', {
         url: "/imagesubmission/:moduleId/:userTalkId",
         templateUrl: "gynacApp/local/controller/lecture/ImageSubmissionPage.html",
         controller: "imageSubmissionController"
     })

});

app.run(function ($rootScope, dataService, $state) {


    $rootScope.$on('$stateChangeStart',
        function (event, toState, toStateParams) {
            // track the state the user wants to go to; 
            // authorization service needs this
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            // if the principal is resolved, do an 
            // authorization check immediately. otherwise,
            // it'll be done when the state it resolved.          

            if (localStorage.getItem("User") != null) {
                //alert(localStorage.getItem("User"));
                $rootScope.authenticatedUser.UserInfo.User_Id = localStorage.getItem("User");
                $rootScope.$emit('getNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
            }
            else {

            }
        });
    $rootScope.$on('signOut', function (event, userId) {
        //send the api call for singout
        var webURL = 'api/gynac/signout?userId=' + userId;
        dataService.postData(webURL, {}).then(function (data) {
            console.log(data);
            localStorage.clear();
            $state.go('home');
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    });

    window.onunload = function () {
        //logout code here...
        $rootScope.$emit('signOut', $rootScope.authenticatedUser.UserInfo.User_Id);
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
    }
});

app.constant('_',
  window._
);

app.constant('jwplayer',
  {
      "url": 'http://content.jwplatform.com/'
  });

app.filter('secondsToDateTime', [function () {
    return function (seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])