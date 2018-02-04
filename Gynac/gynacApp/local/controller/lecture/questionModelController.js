app.controller("questionModalController", ["$stateParams", "$scope", "$uibModalInstance", "$rootScope", "modalData", "$http", "dataService", function ($stateParams, $scope, $uibModalInstance, $rootScope, modalData, $http, dataService) {

    var self = this;

    self.ansUser = [];
    self.currentStep = 1;
    self.countScore = 0;
    $scope.display = false;
    $scope.displayQuestion = false;
    $scope.completedQuestion = false;
    self.reject = false;

    self.cancel = cancel;

    self.setAns = setAns;
    self.storeans = storeans;
    self.finishExam = finishExam;
    self.setAnsMulti = setAnsMulti;
    self.returnCall = returnCall;
    init();

    $scope.userId = ($rootScope.authenticatedUser.UserInfo.First_Name) ? $rootScope.authenticatedUser.UserInfo.User_Id : "0";

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
            var webURL = 'api/gynac/updateusertalkexam?userTalkId=' + modalData.UserTalkId + "&&moduleId=" + modalData.ModuleId + "&&userId=" + $scope.userId;
            dataService.postData(webURL, {}).then(function (data) {
                $scope.currentLecture = {};
                alert("Self Assessment submitted successfully!!");
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

        if (!isAlreadyExits) {
            if (isValidAns == true) {

                if (self.ansUser.length > 0 && userans != 'undefined' && userans != null) {
                    _.each(self.ansUser, function (userAns) {
                        if (mutiple == true) {
                            var mulList = [];
                            userans = $("#multians").val();
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
                            if (userans == null || userans == undefined) {
                                userans = $("#multians").val();
                            }
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
                    if (userans == null || userans == undefined) {
                        userans = $("#multians").val();

                    }
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
            else {

            }
        }

    }

    function setAnsMulti(question, userans, rightans, queId, mutiple) {

        if (self.ansUser.length > 0) {
            _.each(self.ansUser, function (userAns) {
                if (mutiple == true) {
                    var mulList = [];
                    userans = $("#multians").val();
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
                    if (userans == null || userans == undefined) {
                        userans = $("#multians").val();
                    }
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
        } else {
            var check = _.find(self.ansUser, function (userans) {
                return userans.question === currentQue.question;
            });
            if (check != null && check.userans != "") {
                self.currentStep = newStep;
            }
            else {
                alert("Please select the answer");
                consol.log(check);
            }
        }
        console.log(self.ansUser);
    }

    var isValidAns = false;
    var isAlreadyExits = false;
    function storeans(userans, quesid) {

        isAlreadyExits = _.find(self.ansUser, function (question) {
            return (question.questionno === quesid) ? true : false;
        });

        if (!isAlreadyExits) {
            $("#multians").val('');
            var chkselected = "";
            $.each($("input[name='optradio" + quesid + "']:checked"), function () {
                chkselected += $(this).val() + ",";
            });
            chkselected = chkselected.slice(0, -1);
            var str = chkselected.split(",").sort().join(",")

            console.log(str);
            if (str != "") {
                $("#multians").val(str);
                isValidAns = true;
            }
            else {
                isValidAns = false;
                alert("Select Option");

            }
        }
        else {

        }
    }

    function returnCall() {
        self.countScore = 0;
        $("#multians").val('');
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    //Functions
    self.gotoStep = function (newStep, currentQue) {
        if (!isAlreadyExits) {
            if (isValidAns == true) {
                var check = _.find(self.ansUser, function (userans) {
                    return userans.question === currentQue.question;
                });

                if (check != null && check.userans != "") {
                    self.currentStep = newStep;
                }
            }
            else {

            }
        }
        else {
            self.currentStep = newStep;
        }

        self.countScore = 0;
        _.each(self.ansUser, function (userans) {
            if (userans.userans === userans.rightans) {
                self.countScore++;
            }
            else {
                //self.countScore--;
            }
            console.log(self.countScore);
        });
    }

    self.gotoPrvStep = function (newStep, currentQue) {
        var prevCurrentStep = self.currentStep;
        self.currentStep = parseInt(prevCurrentStep) - 1;
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
                            "question": "Q 1: All these 4 orientations are acceptable for transvaginal scan. However, the orientation that is/are accepted to be more appropriate and therefore suggested for those who are beginners and have not yet got used to any particular orientation is/are:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,b",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": true,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "/gynacApp/local/img/question/Talk1/T1Q1_1.PNG"
                                 },
                                 {
                                     "id": "b",
                                     "value": "/gynacApp/local/img/question/Talk1/T1Q1_2.PNG"
                                 },
                                 {
                                     "id": "c",
                                     "value": "/gynacApp/local/img/question/Talk1/T1Q1_3.PNG"
                                 },
                                 {
                                     "id": "d",
                                     "value": "/gynacApp/local/img/question/Talk1/T1Q1_4.PNG"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Advantages of a transabdominal scan include all of the following except:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "c,f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk1/T1Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Good overview (panoramic view) of the entire pelvis"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Better evaluation of large pelvic masses"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Good assessment of  bowel adhesions to uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Better assessment of the endometrium in a mid-positioned uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Better assessment of endometrium in cases with cervical & lower corpus fibroids"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Good visualization of small endometriotic cysts"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Typical ultrasound features that are likely to help differentiate between this solid & the cystic mass below include:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk1/T1Q3.PNG",                            
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Acoustic enhancement"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Shape of the mass"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Echogenicity"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Doppler evaluation"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Echotexture"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Margins of the mass"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: All of the following statements are true except :",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "c,g",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Transabdominal & Transvaginal scans complement each other and therefore both should be ideally done"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Rotation of the TVS probe on ultrasound scan from long section to transverse scan should always be in the same direction regardless of which side of the adnexa is being assessed"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Version is the angle between the uterine body and cervix and flexion is the angle between the cervix and vagina"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Coronal views of the uterus can be seen on TAS only with the help of 3D scan"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Evaluation of a pathology/structure on ultrasound in multiple planes and with multiple modalities (Doppler, 3D, etc) increases diagnostic accuracy"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) For proper Doppler evaluation of  tissues of pelvic masses, PRF should ideally be brought down to 0.3 to 0.6"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) If bowel are adherent to the posterior wall of the uterus then sliding sign is present"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: On ultrasound a hyperechoic line is seen along the interphase between 2 smooth surfaces (like the endometrial midline below). In pelvic ultrasound this may also be seen in which of the following conditions?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk1/T1Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Endometriotic cyst"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Septate vagina"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Hydrosalpinx"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Fibroid"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Endometrial polyp"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Corpus luteum"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Adenomyosis"
                                 }
                            ]
                        },
                        {
                            "id": 6,
                            "question": "Q 6: What is the position of the uterus in this image?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk1/T1Q6.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Anteverted retrolexed"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Retroverted anteflexed"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Retroverted retroflexed"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Anteverted anteflexed"
                                 }
                            ]
                        }


                    ]
                }, {
                    "talkId": 2,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Which of the following settings will enhance the frame rate:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "c,f",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Increasing the depth  & decreasing the angle"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Decreasing the angle & decreasing the depth"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Decreasing the depth and decreasing the angle"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Decreasing the angle and increasing the focal zones"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Decreasing the depth and increasing the focal zones"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Decreasing the depth and decreasing the number of focal zones"
                                 }
                            ]
                        }, {
                            "id": 2,
                            "question": "Q 2: Low velocity blood flows can be best documented by…",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) High wall filter and high gains"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Low PRF and low gains"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) High gains and high PRF"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Low wall filter and low PRF"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) High gains and high wall filter"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: What setting should be changed to improve this image quality?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk2/T2Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Increase colour gain"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Decrease PRF"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Decrease wall filter"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Increase B mode gain"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Decrease B mode gain"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: Which of the following require angle correction?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) PSV"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) RI"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) PI"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) EDV"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) S/D"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: What will you do to improve this image?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b,d,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk2/T2Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Increase B mode gain"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Increase wall filter"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Decrease PRF"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Increase PRF"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Decrease colour gain"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Decrease wall filter"
                                 }
                            ]
                        }
                    ]
                }, {
                    "talkId": 3,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Generally flow is seen in solid tissues. However, no flow may be seen in solid tissue occasionally in all these conditions. Which of these are not acceptable reasons and easily preventable?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b,e",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Increased distance of the tissue from the probe"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Undue pressure with the probe"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Torsion or any other condition where blood flow to the tissue has ceased (red degeneration, embolised fibroid etc.)"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Tissue with dense fibrosis."
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Improper Doppler settings."
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Vessel lying perpendicular to the ultrasound beam."
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "What is the correct order of color score of these images from A to D?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk3/T3Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) 1, 2, 3, 4"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) 3, 1, 2, 4"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) 4, 2, 3, 1"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) 2, 4, 3, 1"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) 1, 3, 4, 2"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) 3, 4, 1, 2"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) 4, 1, 3, 2"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Typical Doppler features of malignancy include all of the following except:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b,e,f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk3/T3Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) High colour score"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Parallel course of vessels"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Randomly dispersed colour"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Mosaics, lakes and splashes"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Peripheral flow "
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) High resistance flow"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) High velocity flow"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: High colour score is typically seen in all of the following except:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk3/T3Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Malignant tissue"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Infected tissue"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Trophoblastic tissue of an ectopic pregnancy"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Ovarian tissue in a case of torsion"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Corpus luteal tissue in an ovary"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) A V malformation"
                                 }
                            ]
                        }, {
                            "id": 5,
                            "question": "Q 5: Doppler flow in which of these cases will raise a high possibility of malignancy ?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,c",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": true,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "/gynacApp/local/img/question/Talk3/T3Q5_1.PNG"
                                 },
                                 {
                                     "id": "b",
                                     "value": "/gynacApp/local/img/question/Talk3/T3Q5_2.PNG"
                                 },
                                 {
                                     "id": "c",
                                     "value": "/gynacApp/local/img/question/Talk3/T3Q5_3.PNG"
                                 },
                                 {
                                     "id": "d",
                                     "value": "/gynacApp/local/img/question/Talk3/T3Q5_4.PNG"
                                 }
                            ]
                        }


                    ]
                }, {
                    "talkId": 4,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: 3D Ultrasound is especially beneficial because it permits us to visualize which section of the uterus?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Sagittal section"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Coronal section"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Transverse section"
                                 }
                            ]
                        }, {
                            "id": 2,
                            "question": "Q 2: Which is the best phase of the menstrual cycle to evaluate the shape of the uterine cavity on 3D?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "c",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Menstrual phase"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Proliferative phase"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Secretory phase"
                                 }
                            ]
                        }, {
                            "id": 3,
                            "question": "Q 3: Which of these images raise a high suspicion of malignancy?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,d",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": true,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "/gynacApp/local/img/question/Talk4/T4Q3_1.PNG"
                                 },
                                 {
                                     "id": "b",
                                     "value": "/gynacApp/local/img/question/Talk4/T4Q3_2.PNG"
                                 },
                                 {
                                     "id": "c",
                                     "value": "/gynacApp/local/img/question/Talk4/T4Q3_3.PNG"
                                 },
                                 {
                                     "id": "d",
                                     "value": "/gynacApp/local/img/question/Talk4/T4Q3_4.PNG"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: 3 D is very useful in diagnosing which of the following?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,c,f",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) The position of a displaced IUCD"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) The presence of a septum in a cyst"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) The type of uterine anomaly"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) The presence of an endometrial polyp"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) The presence of a papilla in a cyst"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) The abnormal vascular morphology in endometrial carcinoma"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: In 3D, VCI with sectional planes is very useful in studying the following:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b,c",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) The junctional zone in adenomyosis"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) The shape of uterine cavity in an uterine anomaly"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Myometrial invasion in endometrial carcinoma"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Septum in an ovarian cyst"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Vascular morphology in endometrial carcinoma"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Incomplete septae of a hydrosalpinx"
                                 }
                            ]
                        }


                    ]
                }, {
                    "talkId": 5,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Indications for Gel Sonovaginography include all of the following except:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Suspicion of cervical polyp"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Suspicion or diagnosis of cervical & vaginal malignancy"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Uterine anomaly where a vaginal septum is suspected"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Suspicion of an endometrial polyp"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Suspicion of deep infiltrating endometriosis of the cervix or vagina"
                                 }
                            ]
                        }, {
                            "id": 2,
                            "question": "Q 2: Gel sonovaginography is contraindicated in:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk5/T5Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Pregnant women"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Post menopausal women"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Women with adnexal masses"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Women with menstrual bleeding"
                                 }
                            ]
                        }, {
                            "id": 3,
                            "question": "Q 3: Evalution on Gel sonovaginography is best in the initial few minutes because:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) With time gel gets displaced and passes out of the vagina"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) With time micro-bubbles begin to appear in the vagina"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Gel is known to cause local burning sensation and irritation"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Procedure becomes painful with time"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) None of the above"
                                 }
                            ]
                        }, {
                            "id": 4,
                            "question": "Q 4: Limitations of Sonohysterography include:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk5/T5Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Doppler evaluation is often sub-optimal"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Patient has to be admitted for the procedure"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Cannot be done in pregnant women"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Cannot be done in women with suspected endometrial carcinoma"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: All of the following are true about sonohysterography (SHG) except:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) It is done between Day 12 – Day 17 of the menstrual cycle in pre-menopausal women"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Prophylactic antibiotic – may be given"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) TVS is done prior to SHG "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Parts are cleaned. Cervix is visualized with a speculum & may be held with a vulsellum or tenaculum"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) A size 7 F catheterr (sonohysterography catheter) or infant feeding tube is used to instill saline into the endometrial cavity"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Initially - 10 ml is instilled (up to 40ml may be instilled)"
                                 }
                            ]
                        }
                    ]
                }, {
                    "talkId": 6,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: The image of the uterus that best shows the shape of the uterine cavity & endo-myometrial junction on ultrasound is:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,b,c,e",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) 2D – sagittal section image of the uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) 2D – transverse section of the uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) 3D - sagittal section image of the uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) 3D - transverse section image of the uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) 3D – coronal rendered image of the uterus"
                                 }
                            ]
                        }, {
                            "id": 2,
                            "question": "Q 2: Based on below images which of these is/are likely to be a fibroid rather than an adenomyomas/adenomyosis?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "d,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk6/T6Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f"
                                 }
                            ]
                        }, {
                            "id": 3,
                            "question": "Q 3: Place the below images in likely chronological (age based) order from youngest to oldest. (Neonatal, pediatric, reproductive age & post menopausal)",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "g",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk6/T6Q3.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) 1, 2, 3, 4"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) 4, 2, 1, 3"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) 2, 3, 1, 4"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) 2, 4, 1, 3"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) 3, 1, 2, 4"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) 3, 2, 1, 4"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) 4, 3, 1, 2"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) 1, 3, 2, 4"
                                 }
                            ]
                        }
                    ]
                }, {
                    "talkId": 7,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Determine the position of this fibroid based on findings in this 3D rendered coronal image of the uterus",
                            "quedsc": "(Choose a single option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk7/T7Q1.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Fundal, submucous, right sided. anterior wall fibroid"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Upper corpus, right sided,  submucous fibroid"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Fundal and upper corpus, transmural right sided fibroid"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Fundal, transmural, right sided fibroid"
                                 }
                            ]
                        }, {
                            "id": 2,
                            "question": "Q 2: Sarcomas are difficult to diagnose on ultrasound. Yet some features may raise suspicion. Which of these features are not typical of sarcomas?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk7/T7Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Often single large tumors appearing like fibroids"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) They are usually hyperechoic"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) May appear heterogeneous"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Show acoustic shadowing"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) May show irregular margins or less defined borders"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) High vascularity"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) High velocity flow on Doppler > 42cm/sec"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) Rapid growth – fibroid/uterus"
                                 },
                                 {
                                     "id": "i",
                                     "value": "i) Usually diagnosed as fibroids pre-operatively"
                                 }
                            ]
                        }, {
                            "id": 3,
                            "question": "Q 3: Which of these features of fibroids are not useful in differentiating them from adenomyomas/adenomyosis?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b,c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk7/T7Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Margins are well defined"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Intra-lesional acoustic shadowing"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Myometrial lesion"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Edge shadowing"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Doppler Flow - Mainly circumferential"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) No endometrium is seen within the mass"
                                 }
                            ]
                        }, {
                            "id": 4,
                            "question": "Q 4: What features do these 2 fibroids have in common?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": true,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": [
                                {
                                    "value": "/gynacApp/local/img/question/Talk7/T7Q4_1.PNG"
                                },
                                {
                                    "value": "/gynacApp/local/img/question/Talk7/T7Q4_2.PNG"
                                }

                            ],
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Acoustic shadowing"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Well circumscribed margins"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Cavitation"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Calcification"
                                 }
                            ]
                        }, {
                            "id": 5,
                            "question": "Q 5: What is the final impression of the mass seen in this video clip?",
                            "quedsc": "(Choose a single option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk7/T7Q5.mp4",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Fundal & upper corpus, submucous, midline, anterior wall fibroid"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Fundal & upper corpus, midline, anterior wall  adenomyoma"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Mid and upper corpus, anterior wall, midline, submucous fibroid"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Fundal & upper corpus, transmural, midline, anterior wall fibroid"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Fundal, posterior wall, transmural, midline fibroid"
                                 }
                            ]
                        }
                    ]
                }, {
                    "talkId": 8,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: All of the following are typical features of adenomyosis except:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "g",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
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
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk8/T8Q2.mp4",
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
                            "ans": "a,b,c,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk8/T8Q3.PNG",
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
                        },
                        {
                            "id": 4,
                            "question": "Q 4: In which of these is the adenomyosis more likely to be associated with pelvic endometriosis? (a, b, c, d, e) Arrows point to the endometrium.",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,e",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": true,
                            "videosrc": "",
                            "ImagePath": "",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "/gynacApp/local/img/question/Talk8/T8Q4_1.PNG"
                                 },
                                 {
                                     "id": "b",
                                     "value": "/gynacApp/local/img/question/Talk8/T8Q4_2.PNG"
                                 },
                                 {
                                     "id": "c",
                                     "value": "/gynacApp/local/img/question/Talk8/T8Q4_3.PNG"
                                 },
                                 {
                                     "id": "d",
                                     "value": "/gynacApp/local/img/question/Talk8/T8Q4_4.PNG"
                                 },
                                 {
                                     "id": "e",
                                     "value": "/gynacApp/local/img/question/Talk8/T8Q4_5.PNG"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: Obvious features of adenomyosis seen in this video clip include:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "d,g",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk8/T8Q5.mp4",
                            "ImagePath": "",
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
                }, {
                    "talkId": 9,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Ultrasound features that raise the suspicion of a uterine anomaly on 2D grey scale pelvic scan, are all of the below except:",
                            "quedsc": "",
                            "ans": "c",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a) Endometrial cavity splitting into 2 in transverse section views of the uterus"
                                },
                                {
                                    "id": "b",
                                    "value": "b) Shorter endometrial length in the midline in long section view of the uterus"
                                },
                                {
                                    "id": "c",
                                    "value": "c) Short length of the cervix"
                                },
                                {
                                    "id": "d",
                                    "value": "d) Broad transverse diameter of the uterus"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Classification of uterine anomalies requires 3D rendered coronal views of the uterus. The best phase of the menstrual cycle to evaluate the shape of the uterine cavity  on 3D for classifying uterine anomalies is:",
                            "quedsc": "",
                            "ans": "c",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/media/media1.wmv",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Menstrual phase of menstrual cycle"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Proliferative phase of menstrual cycle"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Secretory phase of menstrual cycle"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Name the uterine anomaly?",
                            "quedsc": "",
                            "ans": "f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk9/T9Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Arcuate uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Sub-septate uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Septate uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Partial bicornuate uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Bicornuate unicollis"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Bicornuate bicollis"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Uterus didelphys"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) Unicornuate uterus"
                                 },
                                 {
                                     "id": "i",
                                     "value": "i) ‘T’ shaped uterus"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: Name the uterine anomaly?",
                            "quedsc": "",
                            "ans": "a",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk9/T9Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Arcuate uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Sub-septate uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Septate uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Partial bicornuate uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Bicornuate unicollis"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Bicornuate bicollis"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Uterus didelphys"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) ‘T’ shaped uterus"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: Name the uterine anomaly?",
                            "quedsc": "",
                            "ans": "e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk9/T9Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Arcuate uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Sub-septate uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Septate uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Partial bicornuate uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Bicornuate unicollis"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Bicornuate bicollis"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Uterus didelphys"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) ‘T’ shaped uterus"
                                 }
                            ]
                        },
                        {
                            "id": 6,
                            "question": "Q 6: Name the uterine anomaly?",
                            "quedsc": "",
                            "ans": "g",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": true,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": [
                                {
                                    "value": "/gynacApp/local/img/question/Talk9/T9Q6_1.PNG"
                                }, {
                                    "value": "/gynacApp/local/img/question/Talk9/T9Q6_2.PNG"
                                }
                            ],
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Arcuate uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Sub-septate uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Septate uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Partial bicornuate uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Bicornuate unicollis"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Bicornuate bicollis"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Uterus didelphys"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) ‘T’ shaped uterus"
                                 }
                            ]
                        }, {
                            "id": 7,
                            "question": "Q 7: Name the uterine anomaly?",
                            "quedsc": "",
                            "ans": "a",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk9/T9Q7.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Arcuate uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Sub-septate uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Septate uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Partial bicornuate uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Bicornuate unicollis"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Bicornuate bicollis"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Uterus didelphys"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) ‘T’ shaped uterus"
                                 }
                            ]
                        }, {
                            "id": 8,
                            "question": "Q 8: Name the uterine anomaly?",
                            "quedsc": "",
                            "ans": "e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk9/T9Q8.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Arcuate uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Sub-septate uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Septate uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Partial bicornuate uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Bicornuate unicollis"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Bicornuate bicollis"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Uterus didelphys"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) ‘T’ shaped uterus"
                                 }
                            ]
                        },
                        {
                            "id": 9,
                            "question": "Q 9: Name the uterine anomaly?",
                            "quedsc": "",
                            "ans": "b",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk9/T9Q9.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Arcuate uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Sub-septate uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Septate uterus"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Partial bicornuate uterus"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Bicornuate unicollis"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Bicornuate bicollis"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Uterus didelphys"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) ‘T’ shaped uterus"
                                 }
                            ]
                        }

                    ]
                },
                {
                    "talkId": 10,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q1. Which of the following is true ?",
                            "quedsc": "(Note: There may be more than one option)",
                            "ans": "a,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. On grey scale – structures perpendicular to the beam are well seen"
                                },
                                {
                                    "id": "b",
                                    "value": "b. On Doppler – flows perpendicular to the beam are well seen"
                                },
                                {
                                    "id": "c",
                                    "value": "c. On grey scale – structures parallel to the beam are well seen"
                                },
                                {
                                    "id": "d",
                                    "value": "d. On Doppler – flows parallel to the beam are well seen"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q2. All the following are true about measuring the endometrium except",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "e,g",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk10/T10Q2.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Measured in the sagittal plane (the endometrium should be seen continuous with the cervical canal below)"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Where the endometrium is at its thickest"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Image should be sufficiently  zoomed"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Measurement should be done perpendicular to the endometrial stripe"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Should include the hypoechoic adjoining myometrium (Junctional zone) "
                                },
                                {
                                    "id": "f",
                                    "value": "f. 2 layer thickness – reported in ‘mm’ (rounded to 1 decimal point)"
                                },
                                {
                                    "id": "g",
                                    "value": "g. If there is a polyp it should not be included in the measurement"
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q3. Put these different endometrial images in the order of how they appear in a patient with a normal menstrual cycle (starting from D1) ",
                            "quedsc": "",
                            "ans": "b",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk10/T10Q3.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. A, B, C"
                                },
                                {
                                    "id": "b",
                                    "value": "b. C, A, B"
                                },
                                {
                                    "id": "c",
                                    "value": "c. A, C, B"
                                },
                                {
                                    "id": "d",
                                    "value": "d. B, C, A"
                                },
                                {
                                    "id": "e",
                                    "value": "e. C, A, B"
                                },
                                {
                                    "id": "f",
                                    "value": "f. B, A, C"
                                }
                            ]
                        }

                    ]
                },
                {
                    "talkId": 11,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q1. The best time to evaluate the endometrium for a polyp in a patient with regular menstrual cycles is:",
                            "quedsc": "",
                            "ans": "b",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk11/T11Q1.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Menstrual phase - D 2 to D 3"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Proliferative phase - D 10 to D 12"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Secretory phase - D 20 to D 23"
                                },
                                {
                                    "id": "d",
                                    "value": "d. At the time when the patient has spotting"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q2. Which features in this video clip of a patient with a thickened appearing endometrium  suggest that this is an endometrial polyp? ",
                            "quedsc": "",
                            "ans": "a,b",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk11/T11Q2.mp4",
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Hyperechoic line (or bright edge)"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Feeder vessel – on Doppler"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Cystic spaces in the endometrium"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Blunt lower end of polyp"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Sliding sign (polyp sliding in the cavity on pressure from the probe)"
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q3. The feeder vessel of a polyp may not be seen because of:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,c,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk11/T11Q3.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Improper Doppler settings"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Feeder vessel running perpendicular to the ultrasound probe"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Excessive pressure by the probe"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Increased distance of the vessel from the probe"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Polyp with increased fibrous tissue"
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q3. All the following about endometrial polyps are true except",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk11/T11Q4.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. All endometrial polyps are benign"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Polyps typically have a single dominant vessel crossing the endomyometrial junction"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Irregular outline of an endometrial polyp raises a high possibility of malignancy"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Branching of the feeder vessel inside the polyp raises a high possibility of malignancy"
                                },
                                {
                                    "id": "e",
                                    "value": "e. They often have a hyperechoic line/ bright edge surrounding them"
                                },
                                {
                                    "id": "f",
                                    "value": "f. Polyps are well seen in the presence of fluid within the endometrial cavity"
                                }
                            ]
                        }

                    ]
                },
                 {
                     "talkId": 12,
                     "questions": [
                         {
                             "id": 1,
                             "question": "Q 1: The vascular flow pattern seen here in this image may be seen in:",
                             "quedsc": "(Note: there may be more than one option)",
                             "ans": "b,d",
                             "istext": false,
                             "isimage": true,
                             "ismultiimage": false,
                             "isvideo": false,
                             "ismultyplenas": true,
                             "ismultyimgopt": false,
                             "ImagePath": "/gynacApp/local/img/question/Talk12/T12Q1.PNG",
                             "option": [
                                 {
                                     "id": "a",
                                     "value": "a) An endometrial polyp"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Secretory endometrium"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Endometrial carcinoma"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Endometrial hyperplasia"
                                 }
                             ]
                         },
                         {
                             "id": 2,
                             "question": "Q 2: The cut-off for ‘thickened’ endometrium in a post menopausal woman is:",
                             "quedsc": "",
                             "ans": "c",
                             "istext": false,
                             "isimage": true,
                             "ismultiimage": false,
                             "isvideo": false,
                             "ismultyplenas": false,
                             "ismultyimgopt": false,
                             "ImagePath": "/gynacApp/local/img/question/Talk12/T12Q2.PNG",
                             "option": [
                                 {
                                     "id": "a",
                                     "value": "a. 3 mm"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b. 4 mm"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c. 5 mm"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d. 6 mm"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e. 15 mm"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e. 20 mm"
                                 }
                             ]
                         },
                         {
                             "id": 3,
                             "question": "Q 3: Which of these images raise the possibility of malignancy?",
                             "quedsc": "(Note - there may be more than one option)",
                             "ans": "b,c",
                             "istext": false,
                             "isimage": true,
                             "ismultiimage": false,
                             "isvideo": false,
                             "ismultyplenas": true,
                             "ismultyimgopt": false,
                             "ImagePath": "/gynacApp/local/img/question/Talk12/T12Q3.PNG",
                             "option": [
                                 {
                                     "id": "a",
                                     "value": "a."
                                 },
                                 {
                                     "id": "b",
                                     "value": "b."
                                 },
                                 {
                                     "id": "c",
                                     "value": "c."
                                 },
                                 {
                                     "id": "d",
                                     "value": "d."
                                 }
                             ]
                         },
                         {
                             "id": 4,
                             "question": "Q 4: Whenever we encounter a thick endometrium we need to also assess the following:",
                             "quedsc": "(Note - there may be more than one option)",
                             "ans": "b,c,e,f",
                             "istext": false,
                             "isimage": true,
                             "ismultiimage": false,
                             "isvideo": false,
                             "ismultyplenas": true,
                             "ismultyimgopt": false,
                             "ImagePath": "/gynacApp/local/img/question/Talk12/T12Q4.PNG",
                             "option": [
                                 {
                                     "id": "a",
                                     "value": "a.  Presence of fibroids"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b. Cervix to look for vascular tissue"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c.  Endomyometrial junction for irregularity"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d. Presence of adenomyosis"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e. Doppler – to assess the vascular flow pattern "
                                 },
                                 {
                                     "id": "f",
                                     "value": "f. Ovaries to look for PCOS or any tumor that may produce hormones"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g. Presence of IUCD"
                                 }
                             ]
                         },
                         {
                             "id": 5,
                             "question": "Q 5: Which of these 3D Doppler with glass body display images of the endometrium suggest likely malignancy?",
                             "quedsc": "(Note - there may be more than one option)",
                             "ans": "b,c",
                             "istext": false,
                             "isimage": true,
                             "ismultiimage": false,
                             "isvideo": false,
                             "ismultyplenas": true,
                             "ismultyimgopt": false,
                             "ImagePath": "/gynacApp/local/img/question/Talk12/T12Q5.PNG",
                             "option": [
                                 {
                                     "id": "a",
                                     "value": "a."
                                 },
                                 {
                                     "id": "b",
                                     "value": "b."
                                 },
                                 {
                                     "id": "c",
                                     "value": "c."
                                 },
                                 {
                                     "id": "d",
                                     "value": "d."
                                 }
                             ]
                         },
                         {
                             "id": 6,
                             "question": "Q 6: All of the following statements are true except:",
                             "quedsc": "(Note - there may be more than one option)",
                             "ans": "d,e",
                             "istext": true,
                             "isimage": false,
                             "ismultiimage": false,
                             "isvideo": false,
                             "ismultyplenas": true,
                             "ismultyimgopt": false,
                             "option": [
                                 {
                                     "id": "a",
                                     "value": "a. One of the best ways to evaluate the endometrium for myometrial invasion is to examine the endomyometrial junction with 3D sectional planes, using VCI"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b. Endometrial hyperplasia is a histological diagnosis because on ultrasound findings can overlap with both endometrial malignancy and normal endometrium"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c. The 3 most likely differential diagnosis for a thickened endometrium are an endometrial polyp, endometrial hyperplasia and endometrial carcinoma"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d. Sonohysterography is not recommended if there is a suspicion of endometrial malignancy"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e. Following progesterone therapy for endometrial hyperplasia with atypia,  vascularity of the endometrium decreases in a few weeks"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f. Patients on Tamoxifen are known to show cystic changes in the endometrium"
                                 }
                             ]
                         },
                        {
                            "id": 7,
                            "question": "Q 7: What are frequently seen/ known 2D grey scale & Doppler findings in endometrial carcinoma?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,c,g",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "ImagePath": "/gynacApp/local/img/question/Talk12/T12Q7.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Colour score 3 or 4"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Thick endometrium "
                                },
                                {
                                    "id": "c",
                                    "value": "c. Non uniform distribution of colour"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Most vessels run a parallel course"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Most vessels are seen crossing the endo-myometrial junction"
                                },
                                {
                                    "id": "f",
                                    "value": "f. Homogeneous endometrium"
                                },
                                {
                                    "id": "g",
                                    "value": "g. Intracavitory fluid"
                                }
                            ]
                        }
                     ]
                 },
                {
                    "talkId": 13,
                    "questions": [
		                {
		                    "id": 1,
		                    "question": "Q 1: What is the ultrasound diagnosis of this case shown in the video clip ",
		                    "quedsc": "(Choose a single option)",
		                    "ans": "c",
		                    "istext": false,
		                    "isimage": false,
		                    "ismultiimage": false,
		                    "isvideo": true,
		                    "ismultyplenas": false,
		                    "ismultyimgopt": false,
		                    "videosrc": "/gynacApp/local/img/question/Talk13/T13Q1.mp4",
		                    "option": [
				                {
				                    "id": "a",
				                    "value": "a) Sub endometrial fibrosis"
				                },
				                {
				                    "id": "b",
				                    "value": "b)  Endometritis"
				                },
				                {
				                    "id": "c",
				                    "value": "c) Asherman’s Syndrome"
				                },
				                {
				                    "id": "d",
				                    "value": "d) Menstruating endometrium"
				                }
		                    ]
		                },
		                {
		                    "id": 2,
		                    "question": "Q 2: All these are known ultrasound features of Asherman’s Syndrome except: ",
		                    "quedsc": "(Note: there may be more than one option)",
		                    "ans": "b,d",
		                    "istext": false,
		                    "isimage": true,
		                    "ismultiimage": false,
		                    "isvideo": false,
		                    "ismultyplenas": true,
		                    "ismultyimgopt": false,
		                    "ImagePath": "/gynacApp/local/img/question/Talk13/T13Q2.PNG",
		                    "option": [
				                {
				                    "id": "a",
				                    "value": "a. Seen as breaks in the endometrial continuity"
				                },
				                {
				                    "id": "b",
				                    "value": "b. Are seen as hyperechoic bands "
				                },
				                {
				                    "id": "c",
				                    "value": "c. Endometrial margins may be irregular"
				                },
				                {
				                    "id": "d",
				                    "value": "d.  Fluid is never seen in the endometrial tissue of cases with Asherman’s Syndrome"
				                },
				                {
				                    "id": "e",
				                    "value": "e. Scarred area may extend on to adjoining myometrium "
				                },
				                {
				                    "id": "e",
				                    "value": "e. 3D evaluation of the endometrial cavity is useful in assessing the extent of scarring"
				                }
		                    ]
		                },
		                {
		                    "id": 3,
		                    "question": "Q 3: Intracavitory fluid (in the endometrial cavity) may be associated with all of the following except:",
		                    "quedsc": "(Note - there may be more than one option)",
		                    "ans": "b,e",
		                    "istext": false,
		                    "isimage": true,
		                    "ismultiimage": false,
		                    "isvideo": false,
		                    "ismultyplenas": true,
		                    "ismultyimgopt": false,
		                    "ImagePath": "/gynacApp/local/img/question/Talk13/T13Q3.PNG",
		                    "option": [
				                {
				                    "id": "a",
				                    "value": "a. Endometrial polyps"
				                },
				                {
				                    "id": "b",
				                    "value": "b. Subserous fibroids"
				                },
				                {
				                    "id": "c",
				                    "value": "c. Endometrial carcinoma"
				                },
				                {
				                    "id": "d",
				                    "value": "d. Cervical carcinoma"
				                },
				                {
				                    "id": "e",
				                    "value": "e. Ovarian carcinoma"
				                },
				                {
				                    "id": "f",
				                    "value": "f. Fallopian tube carcinoma"
				                },
				                {
				                    "id": "g",
				                    "value": "g. Postmenopausal uterus in the absence of obvious pathology"
				                }
		                    ]
		                },
		                {
		                    "id": 4,
		                    "question": "Q 4: What statements of endometritis mentioned here are incorrect?",
		                    "quedsc": "(Note - there may be more than one option)",
		                    "ans": "a,e",
		                    "istext": false,
		                    "isimage": true,
		                    "ismultiimage": false,
		                    "isvideo": false,
		                    "ismultyplenas": true,
		                    "ismultyimgopt": false,
		                    "ImagePath": "/gynacApp/local/img/question/Talk13/T13Q4.PNG",
		                    "option": [
				                {
				                    "id": "a",
				                    "value": "a. Endometritis – infection of the endometrium, is one of the commonest findings of the spectrum of PID "
				                },
				                {
				                    "id": "b",
				                    "value": "b. May be florid when it is seen in the post partum period"
				                },
				                {
				                    "id": "c",
				                    "value": "c. May be associated with RPOC"
				                },
				                {
				                    "id": "d",
				                    "value": "d. May be seen associated with endometrial carcinoma"
				                },
				                {
				                    "id": "e",
				                    "value": "e. The endometrium becomes polypoidal "
				                },
				                {
				                    "id": "f",
				                    "value": "f. Presence of bright echoes often showing acoustic shadowing implies likely infection with gas forming organisms"
				                }
		                    ]
		                },
		                {
		                    "id": 5,
		                    "question": "Q 5: What is the ultrasound diagnosis of this case shown in the video clip. Patient had a myomectomy 2-3 yrs back and presently has an IUCD.",
		                    "quedsc": "(Choose a single option)",
		                    "ans": "a",
		                    "istext": false,
		                    "isimage": false,
		                    "ismultiimage": false,
		                    "isvideo": true,
		                    "ismultyplenas": false,
		                    "ismultyimgopt": false,
		                    "videosrc": "/gynacApp/local/img/question/Talk13/T13Q5.mp4",
		                    "option": [
				                {
				                    "id": "a",
				                    "value": "a. Sub endometrial fibrosis"
				                },
				                {
				                    "id": "b",
				                    "value": "b. Endometritis"
				                },
				                {
				                    "id": "c",
				                    "value": "c. Asherman’s Syndrome"
				                },
				                {
				                    "id": "d",
				                    "value": "d. Menstruating endometrium"
				                },
				                {
				                    "id": "e",
				                    "value": "e.  IUCD with no abnormal findings"
				                }
		                    ]
		                }
                    ]
                },
                {
                    "talkId": 14,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q1. Which of the following ultrasound parameters is most reliable for diagnosis of polycystic ovaries? ",
                            "quedsc": "",
                            "ans": "c",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Ovarian size"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Number of antral follicles"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Stromal hyperechogenicity"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Low ovarian artery resistance"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q2. What is the follicle number that can be considered a frank manifestation of PCOS according to recent studies?",
                            "quedsc": "",
                            "ans": "d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. 10"
                                },
                                {
                                    "id": "b",
                                    "value": "b. 12"
                                },
                                {
                                    "id": "c",
                                    "value": "c. 19"
                                },
                                {
                                    "id": "d",
                                    "value": "d. 26"
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q3. Ovarian stromal resistance can be correlated to…",
                            "quedsc": "",
                            "ans": "b,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Androgen"
                                },
                                {
                                    "id": "b",
                                    "value": "b. LH"
                                },
                                {
                                    "id": "c",
                                    "value": "c. FSH"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Insulin resistance"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Oestrogen"
                                },
                                {
                                    "id": "f",
                                    "value": "f. Progesterone"
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q4. Stromal abundance can be assessed by…",
                            "quedsc": "",
                            "ans": "d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Stromal volume"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Stromal echogenicity"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Stromal area"
                                },
                                {
                                    "id": "d",
                                    "value": "d. All"
                                }
                            ]
                        },
                            {
                                "id": 5,
                                "question": "Q5. High androgen in PCO presents as:",
                                "quedsc": "",
                                "ans": "c,e",
                                "istext": true,
                                "isimage": false,
                                "ismultiimage": false,
                                "isvideo": false,
                                "ismultyplenas": true,
                                "ismultyimgopt": false,
                                //"ImagePath": "\/img\/GynAc-logo.jpg",
                                "option": [
                                    {
                                        "id": "a",
                                        "value": "a. Increased stromal echogenicity"
                                    },
                                    {
                                        "id": "b",
                                        "value": "b. Decreased stromal vascularity"
                                    },
                                    {
                                        "id": "c",
                                        "value": "c. More antral follicles "
                                    },
                                    {
                                        "id": "d",
                                        "value": "d. High endometrial flow"
                                    },
                                    {
                                        "id": "e",
                                        "value": "e. High uterine artery resistance"
                                    }
                                ]
                            },
                            {
                                "id": 6,
                                "question": "Q6. Obese PCOS patients have:",
                                "quedsc": "",
                                "ans": "b,c,d",
                                "istext": true,
                                "isimage": false,
                                "ismultiimage": false,
                                "isvideo": false,
                                "ismultyplenas": true,
                                "ismultyimgopt": false,
                                //"ImagePath": "\/img\/GynAc-logo.jpg",
                                "option": [
                                    {
                                        "id": "a",
                                        "value": "a. Less small antral follicles (2-6mm)"
                                    },
                                    {
                                        "id": "b",
                                        "value": "b. Less stromal flows"
                                    },
                                    {
                                        "id": "c",
                                        "value": "c. More small antral follicles (2-6mm)"
                                    },
                                    {
                                        "id": "d",
                                        "value": "d. More stromal RI"
                                    },
                                    {
                                        "id": "e",
                                        "value": "e. Less stromal PSV"
                                    },
                                    {
                                        "id": "f",
                                        "value": "f. More stromal echogenicity"
                                    }
                                ]
                            }
                    ]
                },
                {
                    "talkId": 15,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q1. What are the two most important parameters to decide stimulation protocol?",
                            "quedsc": "",
                            "ans": "b",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Ovarian volume and AFC"
                                },
                                {
                                    "id": "b",
                                    "value": "b. AFC and ovarian flow"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Ovarian volume and ovarian flow"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q2. Follicular maturity cannot be confirmed without…",
                            "quedsc": "",
                            "ans": "e",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Follicle size"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Follicular vascularity"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Cumulus oophorus"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Follicle size and cumulus oophorus"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Follicle size and vascularity"
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q3. Signs of impending rupture are:",
                            "quedsc": "",
                            "ans": "a,c",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Rising PSV"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Rising RI"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Falling RI"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Falling PSV"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Increasing follicle size"
                                },
                                {
                                    "id": "f",
                                    "value": "f. Thickened echogenic follicular wall"
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q4. High endometrial receptivity is indicated by…",
                            "quedsc": "",
                            "ans": "b,c,e",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Grade C endometrium"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Grade B endometrium"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Grade A endometrium"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Spiral vessel RI < 0.6"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Uterine artery PI < 3.2"
                                },
                                {
                                    "id": "f",
                                    "value": "f. Zone 2 vascularity"
                                }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q5. Normal luteal phase scan shows:",
                            "quedsc": "",
                            "ans": "b,c",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Uterine artery PI < 3.2"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Uterine artery PI < 2.5"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Spiral artery RI < 0.5"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Corpus luteal RI < 0.6"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Spiral artery RI < 0.6"
                                }
                            ]
                        }
                    ]
                },
                {
                    "talkId": 16,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q1. What is the gold standard to evaluate tubal status?",
                            "quedsc": "",
                            "ans": "d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Saline infusion salpingography"
                                },
                                {
                                    "id": "b",
                                    "value": "b. HSG"
                                },
                                {
                                    "id": "c",
                                    "value": "c. HyCoSy"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Laparoscopy"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q2. Major drawback of HSG …",
                            "quedsc": "",
                            "ans": "c,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Can see the shape of the uterus"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Can see the entire tubal lumen"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Cannot see the tubo-ovarian relation"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Static picture"
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q3. Tubal lumen can be outlined by..",
                            "quedsc": "",
                            "ans": "b,e",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Colour"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Air"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Water"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Saline"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Echovist"
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q4. What is the major drawback of HyCoSy?",
                            "quedsc": "",
                            "ans": "d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Inability to see the tubo-ovarian relation"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Static picture"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Painful"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Inability to see the entire tubal lumen in some cases"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Inability to see the fimbria"
                                }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q5. Intermittent injection of contrast is specific for:",
                            "quedsc": "",
                            "ans": "a",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Colour Doppler for SIS"
                                },
                                {
                                    "id": "b",
                                    "value": "b. HyCoSy"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Air-Saline salpingography"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Saline infusion salpingography"
                                }
                            ]
                        }
                    ]
                },
                {
                    "talkId": 17,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q1. For ovum pick up and embryo transfers the patients should be painted with:",
                            "quedsc": "",
                            "ans": "b",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Betadine"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Normal saline"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Savlon"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Distilled water"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q2. What should you use to visualize the external os - cervix for embryo transfer? ",
                            "quedsc": "",
                            "ans": "c",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Sims’ Speculum"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Cusco’s speculum"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Any"
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q3. Which of these consistently affect the results of ART ?",
                            "quedsc": "",
                            "ans": "a,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Time taken for embryo transfer"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Selection of speculum"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Selection of embryo-transfer catheter"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Ease of transfer procedure"
                                },
                                {
                                    "id": "e",
                                    "value": "e. Rest period after transfer"
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q4. These points need to be remembered when doing an ovum pick up…",
                            "quedsc": "",
                            "ans": "a,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a. Switch on biopsy guide"
                                },
                                {
                                    "id": "b",
                                    "value": "b. Can do any number of punctures on the ovary"
                                },
                                {
                                    "id": "c",
                                    "value": "c. Should access the larger follicles first"
                                },
                                {
                                    "id": "d",
                                    "value": "d. Should access the follicles in the same plane first"
                                }
                            ]
                        }
                    ]
                },
                {
                    "talkId": 18,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1. What statements of nabothian follicles are false?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "d,e,f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk18/T18Q1.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Also known as Nabothian cysts"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Typically seen on either side of the cervical canal mucosa"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Usually multiple"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Are tender to touch on TVS"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Rare findings in women"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Women with nabothian cysts are generally symptomatic with pain and discharge"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2. What statements of cervical polyps are true? ",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,c,d,f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk18/T18Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Usually better seen on Gel Sonovaginography"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Doppler helps to confirm their presence and sight of origin"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Sometimes the only evidence of a polyp at the cervix is a vessel in the cervical canal on Doppler"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) May cause post coital spotting"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Are usually malignant"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Polyps seen at the cervix may originate from the walls of the cervix or the endometrial cavity higher up"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3. Which facts of cervical cancer are false?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "b,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk18/T18Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Are generally very vascular"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Ultrasound is the standard modality used for staging"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Adenocarcinomas are often isoechoic – making their margins difficult to delineate on grey scale"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) 3D Doppler with Glass body display, may show abnormal vascular morphology"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Are usually very tender"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) May bleed on touch/TVS"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Parametrial infiltration appears as irregular margins of the tumor with hypoechoic, bud-like vascular extensions into the adjoining parametrium"
                                 }
                            ]
                        }
                    ]
                },
                {
                    "talkId": 19,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1. Which statements of septate vagina are true? ",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "ImagePath": "/gynacApp/local/img/question/Talk19/T19Q1.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a) Often seen in association with cases of complete septate uterus"
                                },
                                {
                                    "id": "b",
                                    "value": "b) At TVS, a hyperechoic line which helps to detect the  septum, is the lumen of the collapsed contralateral hemivagina"
                                },
                                {
                                    "id": "c",
                                    "value": "c) Usually multiple"
                                },
                                {
                                    "id": "d",
                                    "value": "d) Gel sonovaginography can be used to confirm presence of septum"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2. Which statements of imperforate hymen are false?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "ImagePath": "/gynacApp/local/img/question/Talk19/T19Q2.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a) Cases typically present with pain abdomen at around the age of menarche"
                                },
                                {
                                    "id": "b",
                                    "value": "b) A transperineal scan helps to assess presence & thickness of the hymen "
                                },
                                {
                                    "id": "c",
                                    "value": "c) Typical finding is hematocolpos"
                                },
                                {
                                    "id": "d",
                                    "value": "d) Requires a major surgery to relieve the patient of her symptoms"
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3. Which of the following facts about vaginal cysts are false?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "ImagePath": "/gynacApp/local/img/question/Talk19/T19Q3.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a) Patients are usually symptomatic"
                                },
                                {
                                    "id": "b",
                                    "value": "b) May have turbid contents"
                                },
                                {
                                    "id": "c",
                                    "value": "c) Common vaginal cysts are Gartner duct, Mullerian and Bartholin gland cysts"
                                },
                                {
                                    "id": "d",
                                    "value": "d) Gartner duct & Mullerian cysts are located posterolateral to the vaginal introitus"
                                },
                                {
                                    "id": "e",
                                    "value": "e) Presence of solid tissue and septae in a Bartholin gland cyst raise the possibility of malignancy"
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4. The following are true about vaginal cancer:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,c,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"ImagePath": "\/img\/GynAc-logo.jpg",
                            "ImagePath": "/gynacApp/local/img/question/Talk19/T19Q4.PNG",
                            "option": [
                                {
                                    "id": "a",
                                    "value": "a) Show high vascularity"
                                },
                                {
                                    "id": "b",
                                    "value": "b) Typically hypoechoic solid tumors"
                                },
                                {
                                    "id": "c",
                                    "value": "c) Are well assessed with the help of gel sonovaginography"
                                },
                                {
                                    "id": "d",
                                    "value": "d) Vaginal cancer lesion - involving the cervix (considered so if the external os is involved) is considered a primary cervical cancer"
                                },
                                {
                                    "id": "e",
                                    "value": "e) Vaginal cancer lesion - involving the vulva – is considered a  primary vaginal cancer"
                                }
                            ]
                        }
                    ]
                },                
                {
                    "talkId": 20,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Features & techniques that may help locate post menopausal ovaries include all of the following except:",
                            "quedsc": "",
                            "ans": "c",
                            "istext": false, 
                            "isimage": true, 
                            "ismultiimage": false, 
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk20/T20Q1.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Tracing along the medial margins of the external iliac vessels, in transverse section"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Following the hypoechoic utero-ovarian ligament from the cornual end of the uterus, laterally"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Presence of multiple follicles in the ovaries"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Following the anastomosis of the utero-ovarian vessels from the cornual end of the uterus, laterally, with Doppler"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Which of these features are likely help in deciding that the cyst in the image is extra-ovarian?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,b,c,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk20/T20Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Absence of crescent sign"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Presence of splitting sign"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Presence of antral follicles along the adjoining margins of the ovary beside it "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Presence of wedge of tissue between the ovary and cyst"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Presence of Iliac vessels beside it"
                                 }
                            ]
                        },                        
                        {
                            "id": 3,
                            "question": "Q 3: Which of these are  adnexal lesions? ",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk20/T20Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b)"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c)"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d)"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: Which of the following statements is false?",
                            "quedsc": "(Choose a single option)",
                            "ans": "e",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            //"ImagePath": "/gynacApp/local/img/question/Talk20/T20Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Ovarian follicles may be seen in neonatal ovaries"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Ovarian volume of > 4 cc & 6 or more follicles in girls less than 7 years, should raise the suspicion of precocious puberty"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) In pregnancy, the corpus luteum may be larger and persist for a longer period"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Ovaries are generally easy to identify in women prior to menopause because of the presence of follicles"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) In premature ovarian failure, menopause sets in before the age of 45"
                                 }
                            ]
                        },
                    ]
                },                
                {
                    "talkId": 21,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1. While evaluating an adnexal cyst, presence of the ‘crescent sign’ implies that:",
                            "quedsc": " (Note - there may be more than one option)",
                            "ans": "a",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk22/T22Q1.png",
                            "ImagePath": "/gynacApp/local/img/question/Talk21/T21Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) The lesion is intraovarian"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) The lesion is extraovarian"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) The lesion is likely to be a hydrosalpinx"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) The entire ovary is crescent shaped"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2.  A papilla is any solid projections into the cavity from a cyst wall if it measures (height):",
                            "quedsc": "  (Note: there is only one option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk21/T21Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Equal to or more than 7 mm from the inner margins of the cyst wall"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Equal to or more than 5 mm from the inner margins of the cyst wall"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Equal to or more than 3 mm from the inner margins of the cyst wall"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Equal to or less than 7 mm from the outer margins of the cyst wall"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Equal to or less than 5 mm from the outer margins of the cyst wall"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Equal to or less than 3 mm from the outer margins of the cyst wall"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3. Which of the following facts about acoustic shadowing are false? ",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "c,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk28/media3.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk21/T21Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Is loss of echoes beyond a sound - absorbing structure"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Is a typical finding in a fibroma"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Is a typical feature of a hydrosalpinx"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Suggests that the mass is likely to be malignant"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Is typical of a Dermoid"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Is typical of a papilla in a cystadenofibroma"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4. The following is true about ‘morphological classification’ of persistent adnexal masses:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk21/T21Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) There are 5 types in the classification"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Doppler evaluation is essential"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) A papilla is not considered to be solid for the classificatio"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) A mass is considered to be ‘ Solid’ if at least 90% of the mass on subjective evaluation is made up of solid tissue"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5.  The following are true about simple descriptors:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,c,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk21/T21Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) There are 4 benign and 2 malignant simple descriptors "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) There are 2 benign and 4 malignant simple descriptors"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) In the benign descriptors – all the masses are unilocular"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) In the malignant descriptors – either the woman is postmenopausal or above the age of 50 "
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) It provides easy instant diagnosis for about 20 to 25 % of adnexal masses"
                                 }
                            ]
                        },
                        {
                            "id": 6,
                            "question": "Q 6.   The following are true about simple rules:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk21/T21Q6.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) There are 5 benign and 5 malignant simple rules "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Presence of more than 2 papillary projections is a malignant feature"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) If there are 3 malignant and only one benign feature, as per the simple rules, the mass is malignant"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) In inconclusive cases about half of them are likely to be malignant "
                                 }
                            ]
                        }
                    ]
                },
                {
                    "talkId": 22,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1. Features that suggest that a hyperechoic area within a cyst is a clot (and not solid tissue) include all of the following except:",
                            "quedsc": " (Note: there may be more than one option)",
                            "ans": "a,f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk22/T22Q1.png",
                            "ImagePath": "/gynacApp/local/img/question/Talk22/T22Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Entire margins facing the wall are usually firmly adherent to the cyst wall"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) No flow within a clot on Doppler (with optimal settings)"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Clots may retract away from the cyst wall & the demarcation may be seen"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Usually a clot has concave margins facing the lumen"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Clot may move (jelly like movements) on touch"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) No change in appearance with time (on repeat scan a few days/weeks later)"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2. For optimal Doppler evaluation of adnexal masses the recommendations are:",
                            "quedsc": "  (Note: there may be more than one option)",
                            "ans": "a,d,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk22/T22Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Use of Power Doppler or HD flow"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Use of Colour Doppler"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) PRF should be set at 1.0 or 1.3"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) The mass being evaluated should not be far away from the probe"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) The Doppler gain should be maximum possible without artefacts ( ie., gain to be increased till artefacts appear, then one should stop, and then gradually decrease the gain till the artefacts just disappear)"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q3. Ovarian adnexal masses can be secondary to all these various etiologies except:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,b,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk28/media3.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk22/T22Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Functional "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Endometriosis"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Infection"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Diabetes"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Neoplastic"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Torsion"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Ectopic pregnancy"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4. The following are true of hypoechoic cysts:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "b,c,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk22/T22Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) In premenopausal they are definitely endometriotic"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) In post menopausal they are most often malignant"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) If there are hyperechoic foci along their walls they are very likely to be endometriotic "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) At times regressing hemorrhagic cysts can appear hypoechoic"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5. Which of these statements are true?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,c,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk22/T22Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) In Van Wyk-Grumbach Syndrome – there are bilateral enlarged multicystic ovaries seen, secondary to juvenile hypothyroidism "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Theca lutein cysts are seen in Gestational Trophoblastic Disease"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Endometriotic cysts regress naturally with time"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Endometriotic cysts are often multiple "
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Presence of decidualized endometriotic cysts, suggests that there is an ectopic pregnancy – causing the decidual changes"
                                 }
                            ]
                        },

                    ]
                },
                {
                    "talkId": 23,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Of these 3 neoplastic serous cysts one is benign, one is malignant and the third is borderline. Which of these is likely to be borderline?",
                            "quedsc": "(Choose a single option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk22/T22Q1.png",
                            "ImagePath": "/gynacApp/local/img/question/Talk23/T23Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) "
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) "
                                 }                                 
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2. Which of the following statements are not true for epithelial ovarian neoplasms?",
                            "quedsc": "  (Note: there may be more than one option)",
                            "ans": "a,b",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            //"ImagePath": "/gynacApp/local/img/question/Talk22/T22Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Only malignant ones are bilateral"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Papillae are more common in mucinous as compared to serous cysts"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Both mucinous and serous benign cysts may show septae"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Presence of solid tissue and papillae increase the probability of malignancy"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) They are the commonest category of ovarian neoplasms "
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Brenner tumor is rare "
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Malignant epithelial masses are more common in older women"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3. What features in this videoclip suggest that this is likely to be a case of ovarian  malignancy?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,c,d",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk23/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk22/T22Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Bilateral adnexal masses "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Significant amount of solid tissue"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Irregular margins of the solid tissue"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Presence of ascites"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Presence of deposits along the pelvic side walls"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4. What is the most likely diagnosis for this left ovarian lesion?",
                            "quedsc": "(Choose a single option)",
                            "ans": "e",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk23/media2.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk22/T22Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Papillary serous cystadenoma"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Mucinous cystadenoma"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Borderline serous cyst "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Malignant serous cyst"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Papillary Serous Cystadenofibroma "
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Brenner tumor"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5. Which of the following statements is/are not true for mucinous epithelial ovarian neoplasms?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,e",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            //"ImagePath": "/gynacApp/local/img/question/Talk22/T22Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Often bilateral "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Usually multilocular and only occasionally unilocular"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) If multilocular, the locules often vary in echogenicity"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) They can reach a very large size "
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Mucinous cysts are less likely to show internal echoes as compared to serous epithelial cysts"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Borderline mucinous cyst typically show a cluster of tiny locules "
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Solid tissue showing vascularity is usually seen in malignant mucinous tumors"
                                 }
                            ]
                        },

                    ]
                },
                {
                    "talkId": 24,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1. What is the most likely diagnosis of this mass? ",
                            "quedsc": " (Choose a single option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk24/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk21/T21Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Germ cell tumor"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Granulosa cell tumor"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Fibroma"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Dermoid"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Immature teratoma"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Krukenberg tumor"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2. Which of these statements are true about germ cell tumors?",
                            "quedsc": "  (Note - there may be more than one option)",
                            "ans": "a,c,d,f",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            //"ImagePath": "/gynacApp/local/img/question/Talk21/T21Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Includes Dermoids, Immature Teratomas, Dysgerminomas, Yolk Sac Tumors, Embryonal Carcinoma etc."
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Seen in older perimenopausal women"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Often mixed variety with 2 to 3 cell types coexisting"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Dermoids are benign; others are malignant"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Malignant germ cell tumors are often bilateral "
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Malignant germ cell tumors are predominantly solid masses"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3. What is the most likely diagnosis of this mass?  ",
                            "quedsc": "(Choose a single option)",
                            "ans": "f",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk24/media2.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk21/T21Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Mature Cystic Teratoma"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Immature Teratoma"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Dysgerminoma"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Granulosa Cell Tumor"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Germ Cell Tumor"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Fibroma "
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Krukenberg Tumor "
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4. Which of these statements are true about Sex Cord Stromal tumors?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,c,d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            //"ImagePath": "/gynacApp/local/img/question/Talk21/T21Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Many are hormone producing"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Typically bilateral"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Include Granulosa Cell Tumors, Sertoli & Sertoli Leydig Cell Tumors, Fibromas & Thecomas"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Granulosa Cell Tumors may show a solid or Swiss-cheese appearance"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5. Typical features of Dermoid tumors include all of the following except:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "c,d,f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk24/T24Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Show mixed echoes "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Acoustic shadowing by the  hyperechoic areas "
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Show multiple septae"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Show small papillae "
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Fine/linear scattered echoes"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Abundant flow in its walls "
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Solid protuberance from its walls from which often hair are seen radiating outwards"
                                 }
                            ]
                        },
                        {
                            "id": 6,
                            "question": "Q 6. These are 2 metastatic tumors. Based on their morphology their primaries are likely to be:",
                            "quedsc": "(Choose any one option)",
                            "ans": "b",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk24/T24Q6.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) 1. Primary-breast cancer; 2. Primary-colorectal cancer "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) 1. Primary-colorectal cancer ; 2. Primary-breast cancer"
                                 }                                 
                            ]
                        }
                    ]
                },
                {
                    "talkId": 25,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1. Which of the following facts about fallopian tube are false?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk22/T22Q1.png",
                            "ImagePath": "/gynacApp/local/img/question/Talk25/T25Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Normal fallopian tube is not generally seen easily on ultrasound"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) The fimbrial end of the tube appears as sold tissue with irregular margins and may be seen floating within some fliud in the POD"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Flow in tubal tissue typically shows a protodiastolic notch"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Normal fallopian tube, if seen, is about 20 to 30 mm wide"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) An adnexal cystic mass with incomplete septae is most often of tubal origin"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2. Which of the following facts about Pelvic inflammatory Disease are true? ",
                            "quedsc": " (Note - there may be more than one option)",
                            "ans": "a,d,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk25/T25Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) More in – women in multiple sexual partners, use of IUCD, post abortal or puerperal and those who have undergone  intrauterine or laparoscopic procedures"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) PID is generally unilateral"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Infection primarily involves the ovaries, but fallopian tubes and endometrium may be involved"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Pus may be seen in the POD"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Very often the tubes are adherent to the ovaries forming a Tubo-ovarian mass or abscess "
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3. What is the likely diagnosis in order of the images (1, 2, 3, 4)?",
                            "quedsc": "(Note – please select only one option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk23/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk25/T25Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Pyosalpinx, Fallopian tube Carcinoma, Hydrosalpinx, Tubo-ovarian mass "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Fallopian tube Carcinoma, Hydrosalpinx, Pyosalpinx, Tubo-ovarian mass"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Pyosalpinx, Hydrosalpinx, Tubo-ovarian mass, Fallopian tube Carcinoma"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Pyosalpinx, Hydrosalpinx, Fallopian tube Carcinoma, Tubo-ovarian mass,"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Fallopian tube Carcinoma, Hydrosalpinx, Pyosalpinx, Tubo-ovarian mass"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4. The following are true about fallopian Tube Carcinoma except:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk23/media2.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk25/T25Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Some amount of clear fluid in the endometrial cavity is a common ultrasound finding"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) A hydrosalpinx is commonly seen inn association with it"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Is usually secondary to Ovarian Carcinoma"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) If solid vascular tissue is seen protruding into a hydrosalpinx – highly s/o fallopian tube malignancy"
                                 }                                 
                            ]
                        },
                    ]
                },
                {
                    "talkId": 26,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1. Which of these is likely to be a paraovarian (and not an ovarian cyst)?  ",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk22/T22Q1.png",
                            "ImagePath": "/gynacApp/local/img/question/Talk26/T26Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) "
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) "
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2. The following are true about Peritoneal inclusion Cysts (PIC) except:",
                            "quedsc": " (Note - there may be more than one option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk26/T26Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) PIC are basically loculated fluid trapped between adhesions"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) May be secondary to endometriosis, PID, previous pelvic surgery"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) They are usually the cause for the patient being symptomatic"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) If a patient with PIC is symptomatic  - it is not because of PIC itself but usually that of underlying pathology "
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3. What is the most likely diagnosis for the case in this video clip? ",
                            "quedsc": "(Note – Please select one option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk26/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk25/T25Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Right Ovarian Cyst with torsion"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Left Paraovarian Cyst with torsion"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Right Paraovarian Cyst with torsion"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Left Ovarian Cyst with torsion"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Right Ovarian Cyst with no torsion"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Left Ovarian Cyst with no torsion"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4. Which of these are true about ultrasound features of Peritoneal inclusion Cysts (PIC)?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,c,d,f,g",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk23/media2.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk26/T26Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Multilocular masses "
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Contents are typically turbid"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Bizarre shaped with pointed beak- like or narrow extensions along outer margins"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Adhesion bands/septae may show ‘Flapping Sail Sign’"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Incomplete septae are never seen "
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Minimal flow may be seen in septae/adhesions"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Ovaries are often seen lying within or beside it"
                                 }
                            ]
                        },
                    ]
                },
                {
                    "talkId": 27,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1. Which is the morphological class/name for the mass in this video?",
                            "quedsc": "(Note: there is only one option)",
                            "ans": "e",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk25/T25Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Unilocula"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Multilocula"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Unilocular solid"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Multilocular solid"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Solid"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2. Which of these of these simple descriptors will help classify the mass in this video (same as in question 1) into benign or malignant",
                            "quedsc": " (Note: there is only one option)",
                            "ans": "g",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk25/T25Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Unilocular ground glass in premenopausal (endometriotic)"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Unilocular with mixed echogenicity & acoustic shadowing in premenopausal (Dermoid)"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Unilocular anechoic < 10cm with regular walls (Cystadenoma)"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d)  Remaining unilocular with regular walls (physiological, eg; hemorrhagic)"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Postmenopausal, ascites & at least moderate flow (colour score of 3 or 4)"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f)  Age > 50y & CA 125 >100 IU/mL "
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) NONE OF THE ABOVE"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3. Which of these of these simple rules are applicable to & will help classify the mass in this video (same as in question 1) into benign or malignant",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,e",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk25/T25Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)  Ascites    (Fluid outside POD"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b)  Irregular solid tumor   (>/= 80% solid)"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) At least 4 papillary structures"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Irregular multilocular solid - largest diameter >/= 10cms"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Strong blood flow (colour score 4)"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Unilocular – no solid"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Unilocular solid,  largest diam. <7mm"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h)  Acoustic shadowing"
                                 },
                                 {
                                     "id": "i",
                                     "value": "i) Smooth multiloculated < 10cm"
                                 },
                                 {
                                     "id": "j",
                                     "value": "j) No blood flow - Colour score 1"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) NONE OF THE ABOVE"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4. The mass in this video (same as in question 1) is:",
                            "quedsc": "(Note: there is only one option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk25/T25Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Benign – using ‘simple descriptors’"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Malignant – using ‘simple descriptors’"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Benign – using ‘simple rules’"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Malignant – using ‘simple rules’"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Inconclusive"
                                 }
                            ]
                        },
                    ]
                },
                {
                    "talkId": 28,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Features in favour of endometriosis in this video clip include all of the following except:",
                            "quedsc": " (Note: there may be more than one option)",
                            "ans": "e,k",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk28/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk28/T28Q1.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Presence of hypoechoic cysts"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Bilateral cysts"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Multiple cysts in each ovary"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Ovaries adherent to the uterine wall"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Vascular papillary projections"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Loculated fluid within adhesions"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Kissing ovaries"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) Hyperechoic area in cyst with no flow on Doppler"
                                 },
                                 {
                                     "id": "i",
                                     "value": "i) Hyperechoic foci in the cyst wall"
                                 },
                                 {
                                     "id": "j",
                                     "value": "j) Posterior wall adenomyosis"
                                 },
                                 {
                                     "id": "k",
                                     "value": "k) Free fluid"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: The differential diagnosis for this cyst, in a pregnant known case of endometriosis, in order of probability include: 1) Endometriotic cyst with a clot within 2) Decidualized endometriotic cyst 3) Clear cell carcinoma or endometroid carcinoma",
                            "quedsc": " (Choose a single option)",
                            "ans": "a",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk28/T28Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) 2, 1, 3"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) 1, 2, 3"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) 3, 1, 2 "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) 3, 2, 1"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Features in this clip that suggest that this is a decidualized endometriotic cyst and not a neoplastic cyst include:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,b,d,f",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk28/media3.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk28/T28Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Gravid uterus"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Hypoechoic cyst with turbid contents"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Papillary (hyperechoic areas with flow within) projections having irregular margins"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Rounded papillary (hyperechoic areas with flow within) projections with smooth contour"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Presence of septae"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Hyperechoic foci along the cyst walls"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: The following facts about Deep Infiltrating Endometriosis are false:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "b,f,g",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk28/T28Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Lesions may show cystic areas"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Uterosacral DIE is easier to diagnose than bowel DIE"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Usually tender"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Diagnosis prior to surgery is very useful in planning surgery"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Often diagnosis is missed on pelvic ultrasound"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Uterus in patients with bowel DIE is often anteflexed and shows posterior wall adenomyosis"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Show moderate to high vascularity"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: What is the diagnosis in this case as seen in the image?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk28/T28Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Rectovaginal DIE"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Ovarian endometrioma"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Uterosacral DIE"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Large bowel DIE "
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Bladder DIE"
                                 }
                            ]
                        },
                        {
                            "id": 6,
                            "question": "Q 6: What facts of the ‘Red Indian Hair Dress Sign’ are correct?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "b,c,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk28/T28Q6.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Is suggestive of vaginal DIE"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) It is due to fibrotic retraction of the DIE nodule"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Suggests the sub-mucosa of bowel is involved "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Is a striking feature on pelvic ultrasound that helps to pick up DIE lesions"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) It suggests ureteric involvement"
                                 }

                            ]
                        },
                        {
                            "id": 7,
                            "question": "Q 7: The following facts about scar endometriosis are false:",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,g",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "",
                            "ImagePath": "/gynacApp/local/img/question/Talk28/T28Q7.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Margins are usually well delineated"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Better seen on ultrasound with linear high frequency probes"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Usually tender"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Often difficult to diagnose"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Symptoms are noted or worsen cyclically (during periods)"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Difficult to diagnose and require a careful search"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Show moderate to high vascularity"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) Comparison with normal abdominal wall elsewhere provides a convenient control"
                                 }
                            ]
                        },
                    ]
                },
                {
                    "talkId": 29,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Rhombencephalon appears at ",
                            "quedsc": "",
                            "ans": "b",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk34/T34Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) 6 weeks"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) 7 weeks"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) 8 weeks"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) 12 weeks"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Bad prognosis for the pregnancy is suspected when… ",
                            "quedsc": "",
                            "ans": "d",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk34/T34Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Fetal pole is not seen in a GS of 15 mm"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Yolk sac is not seen in a GS of 10mm"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Embryonic heart rate < 100 at 7 weeks "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) All of the above"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Which of these yolk sacs are normal",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk29/T29Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b)"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c)"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d)"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: LMP is to be corrected when there is difference of ",
                            "quedsc": "",
                            "ans": "a",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk34/T34Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) 7 days in first trimester"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) 10 days in first trimester"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) 10 days in third trimester"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) 5 days in first trimester"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: Abnormalities that should not be missed in first trimester",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "d,e,f",
                            "istext": true,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk34/T34Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Left ventricular hypoplasia"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Total AVSD"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Hydrocephaly"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Alobar holoprosencephaly"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Encephalocoele"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Anencephaly "
                                 }
                            ]
                        },
                    ]
                },
                {
                    "talkId": 30,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: The following features of a tubal ectopic mass may help differentiate it from a corpus luteum:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "c,d,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk30/T30Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Peripheral vascularity"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Central cystic area"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Extra ovarian location"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Presence of a fetal pole with FHR"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Presence of thick hyperechoic tissue around the central cytic area"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Findings that may be seen in a case of a tubal ectopic pregnancy include all of the following except: ",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "f",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk30/T30Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Slow rise of beta hCG (< 66% in 48hrs)"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Turbid fluid in the POD, suggestive of blood"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) An extra ovarian circumscribed mass"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) A corpus luteum in an ovary"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Tenderness during TVS examination"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Endometrium showing increased vascularity"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Endometrium showing tiny cystic spaces  (decidualized endometrium)"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Which of these ultrasound features are seen in the video clip of this case of a tubal ectopic?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,f",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk30/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk30/T30Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Turbid fluid in the POD, suggestive of blood"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) An extra ovarian right tubal ectopic mass"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) A yolk sac and fetal pole in the ectopic GS"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) A corpus luteum on the same side as the ectopic"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Endometrium showing increased vascularity"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) To the extent seen endometrial cavity appeared empty"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: In a case of PUL , beta hCG is done twice with a gap of 48hrs. Which of the following would be considered high risk?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk30/T30Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) A rise of >66 %"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Fall of >13% or any fall"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Slow rise of less than 50%"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: What is the likely diagnosis of this case?",
                            "quedsc": "(Choose a single option)",
                            "ans": "b",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk30/T30Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Cornual ectopic"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Interstitial ectopic"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Tubal ectopic"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Cervical ectopic"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Intrauterine pregnancy"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Ovarian ectopic"
                                 }
                            ]
                        },
                    ]
                },
                {
                    "talkId": 31,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: A detailed transabdominal scan is suggested in every case, following a recent abortion or delivery, while evaluating for RPOC because:",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,b,c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk31/T31Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) The uterus is typically bulky/large resulting in suboptimal evaluation of the upper endometrium due to increased distance from the probe, during TVS"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) The uterus is often midpositioned & on grey scale, on TVS, the endometrial cavity lies parallel to the ultrasound beam resulting in suboptimal evaluation of the endometrium"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) In the frequently midpositioned uterus, flows to the endometrium from the anterior and posterior uterine wall lie perpendicular to the TVS probe and therefore not visualized."
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Patient may be bleeding making evaluation with TVS difficult"
                                 }                                 
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: The following are not true of ultrasound features of retained products of conception?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk31/T31Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) They typically appear as solid heterogeneous tissue within the endometrial cavity"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) RPOC always show some vascularity"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Flow is seen approaching it form the adjoining myometrium"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) The endomyometrial junction may be poorly defined"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Their ultrasound appearance often changes with time (since abortion)"
                                 },                                 
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Of these possible differential diagnoses, what is the most likely diagnosis?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "f",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk31/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk30/T30Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Blood & clots in the uterine cavity"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Invasive mole"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Increased placental bed vascularity"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Submucous adenomyomas"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Fibroid polyp"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) RPOC"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Endometrial polyps"
                                 }
                            ]
                        },                        
                    ]
                },
                {
                    "talkId": 32,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Which of the following are not true about GTD? ",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk32/T32Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) It is a spectrum of disorders of trophoblastic origin"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Beta hCG is typically increased in most cases of GTD"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) In persistent GTD tissue diagnosis is not required for appropriate management"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Invasive moles are typically seen in the first 6 months following an abortion, molar pregnancy or normal delivery"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) GTN like invasive mole, choriocarcinoma & PSTT appear similar and may be difficult to differentiate on ultrasound"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Which of the following are true for partial mole?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,b,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk32/T32Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) A gestational sac is often seen"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) A fetal pole may be seen"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Theca lutein cysts are commonly seen"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Beta hCG values are usually higher than in complete moles"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) The placenta typically shows cystic spaces within"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Follow up with beta hCG is not required"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: What is the likely diagnosis ",
                            "quedsc": "(Choose a single option)",
                            "ans": "c",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk30/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk32/T32Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Complete molar pregnancy"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Partial molar pregnancy"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Invasive mole"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Placental Site Trophoblastic Tumor"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: What is the likely diagnosis",
                            "quedsc": "(Choose a single option)",
                            "ans": "b",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk32/T32Q4.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Complete molar pregnancy"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Partial molar pregnancy"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Invasive mole"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Placental Site Trophoblastic Tumor"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Choriocarcinoma"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: What is the likely diagnosis ",
                            "quedsc": "(Choose a single option)",
                            "ans": "a",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk32/T32Q5.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Complete molar pregnancy"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Partial molar pregnancy"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Invasive mole"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Placental Site Trophoblastic Tumor"
                                 }
                            ]
                        },
                    ]
                },
                {
                    "talkId": 33,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: Which of these are not typical findings in cases of torsion?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "b,e,g,h,j",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk33/T33Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Follicular Ring Sign"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Bulky uterus"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Enlarged ovary"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Cysts showing thick walls and turbid fluid"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) DIE"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Whirlpool Sign"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Endometriotic cysts"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) Loculated fluid with adhesions"
                                 },
                                 {
                                     "id": "i",
                                     "value": "i) Target sign - of cross section of pedicle"
                                 },
                                 {
                                     "id": "j",
                                     "value": "j) Subserous pedunculated fibroid"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Which of these are the three specific features of torsion?",
                            "quedsc": "  (Note: there may be more than one option)",
                            "ans": "a,b,g",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk33/T33Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Follicular Ring Sign"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Absence of flow on Doppler"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Enlarged ovary"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Cysts showing thick walls and turbid fluid"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Free fluid in POD"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f)  An elongated heterogeneous mass suggestive of a pedicle"
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Whirlpool Sign"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) Oedematous ovarian stroma with peripherally arranged antral follicles"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: What features of torsion are seen in this video clip (TAS & TVS) of a case of torsion?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,c,d,e,f,h",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk33/media1.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk34/T34Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)  Follicular Ring Sign"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b)  Whirlpool Sign"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Absence of flow on Doppler"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Enlarged ovary"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Free fluid in pelvis"
                                 },
                                {
                                    "id": "f",
                                    "value": "f) Target sign - of cross section of pedicle"
                                },
                                 {
                                     "id": "g",
                                     "value": "g) Cysts with thick walls"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) Oedematous ovarian stroma"
                                 }
                            ]
                        },
                        {
                            "id": 4,
                            "question": "Q 4: All these features of torsion are seen in this video clip of a 11yr old girl with torsion except …..",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "e",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk33/media2.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk34/T34Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)  Follicular Ring Sign"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b)  Whirlpool Sign"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Absence of flow on Doppler "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Enlarged ovary"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Cysts showing thick walls and turbid fluid"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f) Free fluid in POD "
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Target sign - of cross section of pedicle"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h) Oedematous ovarian stroma"
                                 }
                            ]
                        },
                        {
                            "id": 5,
                            "question": "Q 5: What is the likely diagnosis?",
                            "quedsc": "(Choose one option)",
                            "ans": "a",
                            "istext": false,
                            "isimage": false,
                            "ismultiimage": false,
                            "isvideo": true,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            "videosrc": "/gynacApp/local/img/question/Talk33/media3.mp4",
                            //"ImagePath": "/gynacApp/local/img/question/Talk34/T34Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Torsion of a Paraovarian Cyst"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b)  Torsion of Ovary"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Torsion of hydrosalpinx "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) No Torsion"
                                 }                                 
                            ]
                        },
                        {
                            "id": 6,
                            "question": "Q 6: Which of these are limitations of Doppler assessment in Torsion?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": false,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk33/T33Q6.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)   It is a late feature in torsion and good flows may be seen in cases with torsion"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b)  In torsion of hydrosalpinx and paraovarian cysts because of minimal tissue in the torsed structure, it is difficult to assess absence of flows"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) If the torsed mass is far away from the probe, Doppler may falsely show no flow, even when flow exists in the mass "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d)  If Doppler settings are not proper assessment may be erroneous (wrong)"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Comparison with the normal contralateral ovary provides a convenient control"
                                 }
                            ]
                        },
                        {
                            "id": 7,
                            "question": "Q 7: Which of these features are useful in diagnosis of torsion of a hydrosalpinx?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,b,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk33/T33Q7.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)  Whirlpool Sign"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Turbid fluid in a cystic mass showing an incomplete septum with normal appearing ovaries"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c)Follicular Ring Sign"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Thick walls of a hydrosalpinx showing no flow on Doppler"
                                 }                                 
                            ]
                        },
                    ]
                },
                {
                    "talkId": 34,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Q 1: What features may be seen in common - in cases with tubal ectopic pregnancy and hemorrhage from a corpus luteum that present with acute pelvic pain?",
                            "quedsc": "(Note: there may be more than one option)",
                            "ans": "a,c,e",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk34/T34Q1.png",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Hemoperitoneum"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) An extraovarian circumscribed mass with a gestational sac"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Clots in the adnexa"
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Positive pregnancy test"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Corpus luteum in an ovary"
                                 }
                            ]
                        },
                        {
                            "id": 2,
                            "question": "Q 2: Acute pelvic pain during periods/menstruation is a known possibility in all the following except? ",
                            "quedsc": " (Note: there may be more than one option)",
                            "ans": "a,e,f,g,h",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk34/T34Q2.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a) Tubal ectopic pregnancy"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b) Adenomyosis"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Submucous fibroid "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d)   DIE (Deep Infiltrating Endometriosis)"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) PID"
                                 },
                                 {
                                     "id": "f",
                                     "value": "f)  Cystitis "
                                 },
                                 {
                                     "id": "g",
                                     "value": "g) Appendicitis"
                                 },
                                 {
                                     "id": "h",
                                     "value": "h)  Torsion "
                                 },
                                 {
                                     "id": "i",
                                     "value": "i) Endometriosis"
                                 }
                            ]
                        },
                        {
                            "id": 3,
                            "question": "Q 3: Patients with OHSS (Ovarian Hyperstimulation Syndrome) may have abdominopelvic pain because of the following?",
                            "quedsc": "(Note - there may be more than one option)",
                            "ans": "a,c,d",
                            "istext": false,
                            "isimage": true,
                            "ismultiimage": false,
                            "isvideo": false,
                            "ismultyplenas": true,
                            "ismultyimgopt": false,
                            //"videosrc": "/gynacApp/local/img/question/Talk27/media1.mp4",
                            "ImagePath": "/gynacApp/local/img/question/Talk34/T34Q3.PNG",
                            "option": [
                                 {
                                     "id": "a",
                                     "value": "a)  Torsion"
                                 },
                                 {
                                     "id": "b",
                                     "value": "b)  Hypovolemic shock"
                                 },
                                 {
                                     "id": "c",
                                     "value": "c) Enlarged ovary and ascites "
                                 },
                                 {
                                     "id": "d",
                                     "value": "d) Hemorrhage from the ovaries"
                                 },
                                 {
                                     "id": "e",
                                     "value": "e) Multiple gestations in early pregnancy"
                                 }
                            ]
                        },                        
                    ]
                },
            ]
        }

        self.questionList = _.find(self.qusList.questionList, function (question) {
            var que = question;
            return question.talkId === modalData.TalkId;
        });
    }
}]);