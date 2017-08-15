app.controller('mainCtrl', function ($scope, $rootScope, $state, dataService) {

    $('#startupmodeltrigger').trigger('click');


    $scope.allLecturesList = [
        // section - 1 module - 1
        { json: 'Scanning the Pelvis Basics along with Tips and Tricks', section: 1, module: 1 }, // 1 
        { json: 'Torsion A Diagnostic Dilemma Made Easy', section: 1, module: 1 },// 2
        { json: 'Spectrum of Endometriosis Beyond the “Ground Glass” Appearance', section: 1, module: 1 },// 3

        // section - 1 module - 2
        { json: 'Congenital Uterine Anomalies - Simplified', section: 1, module: 2 },// 4
        { json: 'Cycle Assessment in infertility and ART', section: 1, module: 2 },// 5

        // section - 2 module - 1
        { json: 'Tubal Assessment', section: 2, module: 1 },// 6
        { json: 'Ultrasound Settings and Technique', section: 2, module: 1 },// 7
        { json: 'Evaluating Ovarian-Adnexal Lesions based on IOTA guidelines - Practice', section: 2, module: 1 },// 8

        // section - 2 module - 2
        { json: 'Evaluating Ovarian-Adnexal Lesions based on IOTA guidelines', section: 2, module: 2 },// 9
        { json: 'Possibilities with Ovarian Masses & Spectrum of Ovarian Neoplasia  - Part 1', section: 2, module: 2 },// 10

        // section - 2 module - 3
        { json: 'Possibilities with Ovarian Masses & Spectrum of Ovarian Neoplasia - Part 2', section: 2, module: 3 }// 11
    ];

    $rootScope.sectionModuleGroup = [
        {
            sectionName: 'Section 1',
            section: 1,
            modules: [
                {
                    moduleName: 'GENERAL TECHNIQUES GYNECOLOGICAL ULTRASOUND',
                    module: 1
                },
                {
                    moduleName: 'ULTRASOUND EVALUATION OF MYOMETRIUM',
                    module: 2
                }
            ]
        },
        {
            sectionName: 'Section 2',
            section: 2,
            modules: [
                {
                    moduleName: 'ULTRASOUND EVALUATION OF ENDOMETRIUM',
                    module: 1
                },
                {
                    moduleName: 'ULTRASOUND EVALUATION OF CERVIX & VAGINA',
                    module: 2
                },
                {
                    moduleName: 'ULTRASOUND EVALUATION OF OVARIAN & ADNEXAL MASSES',
                    module: 3
                }
            ]
        }
    ]



    $rootScope.speakerVideoList = [];

    $scope.getJsonData = function (webURL, i, jsonObj) {
        dataService.getData(webURL).then(function (data) {
            data.section = jsonObj.section;
            data.module = jsonObj.module;

            $rootScope.speakerVideoList[i] = data;
            console.log(".....", $rootScope.speakerVideoList);
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }

    for (var i = 0; i < $scope.allLecturesList.length; i++) {
        var webURL = 'gynacApp/local/json/' + $scope.allLecturesList[i].json + '.json';
        //$scope.getJsonData(webURL, i, $scope.allLecturesList[i]);
    }


    // User Obj

    $rootScope.authenticatedUser = {};
    $rootScope.authenticatedUser.UserInfo = {};
    $rootScope.totalAmount = 0;

    $scope.signOut = function () {
        $rootScope.$emit('signOut', $rootScope.authenticatedUser.UserInfo.User_Id);
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }

    // Right click disble

    /*$(document).on("contextmenu",function(){
       return false;
    });
    */

    // Country List

    $rootScope.CountryList = ['Australia', 'Belgium', 'Canada', 'China', 'Germany', 'Hong Kong', 'India', 'Iran', 'Italy', 'Japan', 'Malaysia', 'Netherlands', 'New Zealand', 'Singapore', 'Sweden', 'UK', 'USA', 'Others'];

    $rootScope.adminUserList = ['nipun710@gmail.com', 'pungul@gmail.com', 'sonalyogesh@yahoo.com', 'mala@sibal.com'];

    //get all notification
    $rootScope.$on('getNotification', function (event, userId) {
        var webURL = 'api/gynac/getnotificationbyuserid?userId=' + userId;
        dataService.getData(webURL, {}).then(function (data) {
            console.log(data);
            $scope.notificationCount = _.filter(data, function (d) { return d.IsRead === false; });
            if ($scope.notificationCount == 0) {
                $scope.notificationCount = {};
            }
            $scope.notification = data;            
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    });

    $rootScope.$on('updateNotification', function (event, userId) {        
        $("#triggerNotification").trigger('click');
        //send the api call for singout
        var webURL = 'api/gynac/updatenotification?userId=' + userId;
        dataService.postData(webURL, {}).then(function (data) {
            console.log(data);
            $scope.notificationCount = {};            
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    });
    
});