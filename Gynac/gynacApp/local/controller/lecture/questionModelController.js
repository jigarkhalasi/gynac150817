app.controller("questionModalController", ["$stateParams", "$scope", "$uibModalInstance", "$rootScope", "modalData", "$http", "dataService", function ($stateParams, $scope, $uibModalInstance, $rootScope, modalData, $http, dataService) {

    var self = this;

    self.ansUser = [];
    self.currentStep = 1;
    $scope.display = false;
    $scope.displayQuestion = false;
    $scope.completedQuestion = false;
    self.reject = false;

    self.cancel = cancel;
    
    self.setAns = setAns;
    self.finishExam = finishExam;

    init();

    function init() {
        if (modalData.UserTalkId) {
            $scope.display = true;       
        }
        if (modalData.IsExam == 'IsActive') {
            $scope.displayQuestion = true;
        }
       
        $http.get('gynacApp/local/controller/lecture/Questions.html').success(function (data) {
            self.questionList = _.find(data.questionList, function (question) {
                return question.talkId === modalData.TalkId;
            });
        });
    }

    function finishExam() {
        var res;
        _.each(self.ansUser, function (check) {
            if (check.userans === check.rightans) {
                res = true;
            }
            else {
                res = false;
            }
        });

        if (res) {
            var webURL = 'api/gynac/updateusertalkexam?userTalkId=' + modalData.UserTalkId;
            dataService.postData(webURL, {}).then(function (data) {
                $scope.currentLecture = {};
                alert("successfully!!");
                $uibModalInstance.close('success');
            }, function (errorMessage) {
                console.log(errorMessage + ' Error......');
            });
        }
        else {
            alert("some question are wrong!!");
            self.ansUser = {};
            $uibModalInstance.close('success');
        }
    }

    $scope.getSummaryQuestion = function () {
        var res;
        self.totalQuestion = self.questionList.questions.length;
        _.each(self.ansUser, function (check, idx) {
            if (check.userans === check.rightans) {
                self.ansUser[idx].status = true;
            }
            else {
                self.ansUser[idx].status = false;
                self.reject = true;
            }
        });
    }

    function setAns(question, userans, rightans, queId) {
        if (self.ansUser.length > 0) {
            _.each(self.ansUser, function (userAns) {
                self.ansUser = _.reject(self.ansUser, function (userans) { return userans.question === question; });
                self.ansUser.push({
                    "questionno":queId,
                    "question": question,
                    "userans": userans,
                    "rightans": rightans
                });
            })
        }
        else {
            self.ansUser.push({
                "questionno": queId,
                "question": question,
                "userans": userans,
                "rightans": rightans
            });
        }

        $scope.completedQuestion = (self.ansUser.length === self.questionList.questions.length) ? true : false;

        if ($scope.completedQuestion) {
            $scope.getSummaryQuestion();
        }
        console.log(self.ansUser);
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
        
    //Functions
    self.gotoStep = function(newStep,currentQue) {        
        var check = _.find(self.ansUser, function (userans) {            
            return userans.question === currentQue.question;
        });
        if (check != null && check.userans != "") {
            self.currentStep = newStep;
        }
        else {
            alert("select ans!!");
        }

        
    }
        
    self.getStepTemplate = function(){
        for (var i = 0; i < self.questionList.length; i++) {
            if (self.currentStep == self.questionList.questions[i].id) {
                return self.currentStep;
            }
        }
    }
        
   

}]);