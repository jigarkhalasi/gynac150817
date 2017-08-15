app.controller("VideoModalController", ["$stateParams", "$scope", "$uibModalInstance", "$rootScope", "modalData", "dataService", "$sce", "jwplayer", function ($stateParams, $scope, $uibModalInstance, $rootScope, modalData, dataService, $sce,jwplayer) {

    var self = this;

    //modalData.UserTalkId = 46;
    self.updateVideoComment = updateVideoComment;
    self.cancel = cancel;

    //$scope.$resolve = { modalData: modalData };
    console.log(modalData);    

    init();

    function init() {
        //get the data of the video by talk id        
        var webURL = 'api/gynac/gettalkvideo?talkId=' + modalData.TalkId + '&&userTalkId=' + modalData.UserTalkId;
        dataService.getData(webURL, {}).then(function (data) {
            console.log(data);
            $scope.currentLecture = data;          
            if (modalData.UserTalkId) {
                $scope.display = true;
                $scope.currentLecture.Comment = modalData.Comment;                
                document.getElementById('myIframe').src = jwplayer.url + data.VideoLink + '?sig=' + $scope.currentLecture.Signature + '&exp=' + $scope.currentLecture.ExpTime;               
            }
            else {
                $scope.display = false;
                $scope.currentLecture.Comment = modalData.Comment;                
                document.getElementById('myIframe').src = $scope.currentLecture.VideoLink;                
            }
            
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }

    $scope.htmlSafe = function (data) {
        var data = data;
        return $sce.trustAsHtml(data);
    }

    function updateVideoComment() {
        //update the comment and the post the user log
        var webURL = 'api/gynac/updateusertalkcomment';
        $scope.data = {};
        $scope.data.userTalkId = modalData.UserTalkId;//;self.userTalkId;
        $scope.data.comment = $scope.currentLecture.Comment; //self.comment;
        $scope.data.Email = $scope.currentLecture.Email;
        
        dataService.postData(webURL, $scope.data).then(function (data) {
            $scope.currentLecture = {};
            $uibModalInstance.close('success');
        }, function (errorMessage) {
            console.log(errorMessage + ' Error......');
        });
    }

    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };

    function cancel() {
        $scope.currentLecture = {};
        $uibModalInstance.dismiss('cancel');
    }

    $scope.getIframeSrc = function () {
        return 'http://content.jwplatform.com/players/wHEkqM70-RZnnsc9B.html?sig=' + $scope.currentLecture + '&exp=' + $scope.ExpTime;
    };
}]);