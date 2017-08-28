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
        loadquestion();
        if (modalData.UserTalkId) {
            $scope.display = true;
        }
        if (modalData.IsExam == 'IsActive') {
            $scope.displayQuestion = true;
        }



        //$http.get('gynacApp/local/controller/lecture/Questions.html').success(function (data) {
        //    self.questionList = _.find(data.questionList, function (question) {
        //        return question.talkId === modalData.TalkId;
        //    });
        //});
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

    function setAns(question, userans, rightans, queId, mutiple) {
        if (self.ansUser.length > 0) {
            _.each(self.ansUser, function (userAns) {
                if (mutiple == true) {
                    var mulList = [];
                    var isExitsuserans = _.find(self.ansUser, function (userans) { return userans.question === question; });
                    if (isExitsuserans == undefined && isExitsuserans == null) {                        
                        self.ansUser.push({
                            "questionno": queId,
                            "question": question,
                            "userans": userans,
                            "rightans": rightans
                        });
                    }
                    else {
                        
                    }
                }
                else {
                    self.ansUser = _.reject(self.ansUser, function (userans) { return userans.question === question; });
                    self.ansUser.push({
                        "questionno": queId,
                        "question": question,
                        "userans": userans,
                        "rightans": rightans
                    });
                }
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
    self.gotoStep = function (newStep, currentQue) {
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

    self.getStepTemplate = function () {
        for (var i = 0; i < self.questionList.length; i++) {
            if (self.currentStep == self.questionList.questions[i].id) {
                return self.currentStep;
            }
        }
    }

    function loadquestion() {
        self.qusList = {
            "questionList": [
                {
                    "talkId": 1,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: All of the following are typical features of adenomyosis except:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "g",
                            "istext": true,
                            "isImage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a) Thick junctional zone (JZ)"
                                },
                                {
                                    "id": "b",
                                    "value": "b) Bulky uterus"
                                },
                                {
                                    "id": "c",
                                    "value": "c) Myometrial cysts"
                                },
                                {
                                    "id": "d",
                                    "value": "d) Poorly defined endomyometrial junction"
                                },
                                {
                                    "id": "e",
                                    "value": "e) Endometrial island"
                                },
                                {
                                    "id": "f",
                                    "value": "f) Endometrial buds in the junctional zone"
                                },
                                {
                                    "id": "g",
                                    "value": "g) Loss of uterine contour"
                                },
                                {
                                    "id": "h",
                                    "value": "h) Intra-lesional acoustic shadowing"
                                },
                                {
                                    "id": "i",
                                    "value": "i) Hyperechoic foci in the JZ"
                                }

                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Are the features of this mass more suggestive of a fibroid or an adenomyoma?",
                            "quedsc": "",
                            "ans": "b",
                            "istext": false,
                            "isimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "videosrc": "/media/media1.wmv",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Fibroid"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Adenomyoma"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Features of adenomyosis seen in this particular image include:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a, b, c, e",
                            "istext": false,
                            "isimage": true,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/image7.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Poorly defined endo-myometrial junction"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Hyperechoic foci in the junctional zone (JZ)"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Endometrial buds in JZ"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Thickened myometrium"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Cystic spaces in JZ"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Thickened junctional zone"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Acoustic shadowing"
                                 }
                            ]
                        }


                    ]
                }
            ]
        }

        self.questionList = _.find(self.qusList.questionList, function (question) {
            var que = question;
            return question.talkId === modalData.TalkId;
        });
    }
}]);