app.controller("freeLectureController", ["$scope", "$rootScope", "dataService", "$filter", "$state", "$interval", "$stateParams", "$uibModal", "jwplayer", function ($scope, $rootScope, dataService, $filter, $state, $interval, $stateParams, $uibModal, jwplayer) {

    $scope.userId = ($rootScope.authenticatedUser.UserInfo.First_Name) ? $rootScope.authenticatedUser.UserInfo.User_Id : "0";
    

    $scope.clickMe = function () {
        //
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

    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };

    $scope.getAllNotification = function () {
        $rootScope.$emit('updateNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
    }

    $scope.overviewDisplay = false;
    //open the talk description
    $scope.getTalkOverview = function (talkId) {
        $scope.overViewDetails = _.filter($scope.freeTalkList.List, function (d) { return d.TalkId === talkId; });
        $scope.overviewDisplay = true;
    }

    //pause video
    $scope.pauseVideo = function () {
        var iframe = document.getElementById("myIframe1");
        var player = new Vimeo.Player(iframe);

        player.pause().then(function () {          
        }).catch(function (error) {
            switch (error.name) {
                case 'PasswordError':
                    break;
                case 'PrivacyError':
                    break;
                default:
                    break;
            }
        });
    }

    //open video and previewvideo script
    $scope.openSpeakerVideo = function (talkId) {        
        $scope.talkVideo = _.filter($scope.freeTalkList.List, function (d) { return d.TalkId === talkId; });        
        if ($scope.userId != "0") {
                $scope.display = true;
                document.getElementById('myIframe1').src = $scope.talkVideo[0].PreViewVideoLink;
            }
            else {
                $scope.display = false;                
                document.getElementById('myIframe1').src = "";
                ("#overview-ID2").modal("show");
            }
    }

    $scope.goToLogin = function () {
        $state.go('signIn');
    }


    $(window).on('popstate', function (e) {
        $('#video-ID1').modal('dismiss');
        $('body').removeClass('modal-open');
    });

    //model close 
    $(function () {
        $('.modal').on('hidden.bs.modal', function (e) {           
            $("#myIframe1").attr('src', '');
        });
    });

    $scope.freeTalkList = {
                    "List" :[
                            {
                                "TalkId" : "1",
                                "TalkName": "TalkMaster1",
                                "SpeakerName": "Mala",
                                "Duration": "1:05",
                                "Talkdesc": "This is the first name",
                                "PreViewVideoLink": "https://player.vimeo.com/video/231745511",
                            },
                            {
                                "TalkId": "2",
                                "TalkName": "TalkMaster2",
                                "SpeakerName": "Mala2",
                                "Duration": "1:05",
                                "Talkdesc": "This is the first name dddd",
                                "PreViewVideoLink": "https://player.vimeo.com/video/231745511",
                            },
                    ]
    };


}]);