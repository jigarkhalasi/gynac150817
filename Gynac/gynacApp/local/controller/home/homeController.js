app.controller("homeController",["$scope", "$rootScope", "dataService", "$state", "$stateParams", "$sce", function($scope, $rootScope, dataService, $state, $stateParams, $sce){
	

    $(function () {
        $('.modal').on('hidden.bs.modal', function (e) {
            $iframe = $(this).find("iframe");
            $iframe.attr("src", $iframe.attr("src"));
        });
    });


    // Random preview
    
    $scope.currentPage = 'home';
    
    $scope.viewAllTestimonials = function(val){
        $scope.currentPage = val;
    }
    
    $scope.previewLec = $rootScope.speakerVideoList[Math.floor(Math.random() * $rootScope.speakerVideoList.length)];
    
    $scope.testimonial = [
        {
            uaseName : '<div>Dr.P.Vydehi</div>',
            text: '“Dr Mala was excellent. I can’t wait to watch her online classes. Thank you for the wonderful training.”'
        },
        {
            uaseName : '<div>Dr Y.L.Rao, <br> Professor & HOD Gynecology, <br> RIMS, Srikakulam</div>',
            text: '“We enjoyed the training session. It was very useful. We came to know the hard work behind Dr. Mala Sibal’s success and her passion and dedication to the profession and her love and commitment to patients. I felt these are greater and inspiring more than just learning ultrasound. In addition to the academic matter you should give a motivational speech by telling us the background of your hard work.”'
        },
        {
            uaseName : '<div>Dr Nagamni, <br> Professor OBG, Andhra Medical College</div>',
            text: '“Ditto Dr YLN’s sentiments. Thank you, Dr Mala.”'
        },
        {
            uaseName : '<div>Dr M.V.R. Shailaja, <br> CHC Nakkapalli</div>',
            text: '“It was a lively presentation. Learnt a lot. My basic knowledge of gynecological ultrasound improved after this training. Torsion of the ovary was the best of all after IOTA evaluation of tumors. Thank you, mam. It was a wonderful experience. I learnt a lot. Searched a lot for Gynac USG training. Finally got the chance to learn it in my own place from such a renowned person.”'
        },
        {
            uaseName : '<div>DR V.Suneetha, <br> Suneetha Hospital</div>',
            text: '“It improved my standard of doing scans. This workshop was excellent. I personally appreciate your efforts to explain each and everything in an understandable way. The workshop was very interactive and interesting.”'
        },
        {
            uaseName : '<div>DR N.Sridevi</div>',
            text: '“Dr Mala Sibal – Excellent presentations. Very good lectures with correlation to pathology and description of why. Useful for busy practitioners – not to miss a lesion that needs follow up/ attention. Thank you very much for sharing knowledge. Privileged to have attended the sessions.”'
        },
        {
            uaseName : '<div>Dr M.Vasantha, <br> Ass. Prof, NRIIMS Visakhapatnam</div>',
            text: '“Dr Mala Sibal - Very useful, extensive and intensive training.”'
        },
        {
            uaseName : '<div>Dr Jayalaksmi</div>',
            text: 'Looking forward to a few more sessions of Dr Mala Sibal.”'
        },
        {
            uaseName : '<div>DR Gowthami, <br> Asst Prof. MIMS Vizianagaram</div>',
            text: '“Dr Mala Sibal – Madam thank you so much for sharing your wonderful experiences with us. Thank you for making us realize that ultrasound is not just for diagnosis of ectopic pregnancy, congenital uterine anomalies and fibroids .... It is much more than that. Thank you Sridevi madam and Mala madam for a such a wonderful training program.”'
        },
        {
            uaseName : '<div>Dr Padmaja, <br> Tappani Hospital</div>',
            text: '“Definitely useful – especially for pre-operative decision making in OPD setting & in patient selection. Thank you Mala mam & Dr Sridevi for the wonderful academic workshop and structured program in 2 days.”'
        },
        {
            uaseName : '<div>Dr Sharvani</div>',
            text: '“Thank you Mala madam & Sridevi madam for conducting such a wonderful CME.”'
        },
        {
            uaseName : '<div>Dr P.Rama</div>',
            text: '“Thank you Dr Mala madam & Dr Sridevi for conducting such a nice CME. It was a very useful program for us and you gave us confidence to do gynac scans which was a nightmare for me.”'
        },
        {
            uaseName : '<div>Dr Leela Digumarti</div>',
            text: '“It was a pleasure. Enjoyed the sessions very much.”'
        },
        {
            uaseName : '<div>Dr Vani Anuradha</div>',
            text: '“Thank you Dr Mala Mam & Dr Sridevi mam. Really it was a wonderful experience. Learnt a lot from this Gynac. Ultrasound training.”'
        }
    ];
    
    $scope.previewTestimonial = $scope.testimonial[Math.floor(Math.random() * $scope.testimonial.length)];
    
    $scope.renderHtml = function(html) {
		return $sce.trustAsHtml(html);
	};
    
    $scope.openPreviewVideo = function(src){
        $('#previewVideo').attr('src',src);
        $('#previewVideo').get(0).play();
        $scope.previewSrc = src;
    }
    
    $(document).ready(function(){
        $(window).resize(function(){
            setBlockHeight();
        });
        
        function setBlockHeight(){
            $('#b1').height($('#b2').height());
            $('#b3').height($('#b4').height());
        }
        
        setInterval(function(){
            setBlockHeight();
        },10)
        
    });
    
    $scope.slide = function (dir) {
        $('#carousel-example-generic').carousel(dir);
    };
    
    $scope.signOut = function(){
        for(var j = 0; j < $rootScope.speakerVideoList.length; j++){
            $rootScope.speakerVideoList[j].isSelected = false;
        }
        //singn out
        $rootScope.$emit('signOut', $rootScope.authenticatedUser.UserInfo.User_Id);
        $rootScope.totalAmount = 0;
        $rootScope.authenticatedUser = {};
        $rootScope.authenticatedUser.UserInfo = {};
        $state.go('home');
    }
    
    if(!$rootScope.authenticatedUser.UserInfo.Email){
        for(var j = 0; j < $rootScope.speakerVideoList.length; j++){
            $rootScope.speakerVideoList[j].isSelected = false;
        }
        $rootScope.totalAmount = 0;
    }
    
    $scope.verifyEmail = function(){
        var webURL = 'api/gynac/emailverified'
        var dataToBeSend = {};
        dataToBeSend.Guid = $stateParams.id;
        dataToBeSend.Email = $stateParams.email;
        console.log(dataToBeSend);
		dataService.postData(webURL, dataToBeSend).then(function (data) {
			console.log(data);
            
            if(dada == 0){
                 $('#triggerInternalError').trigger('click');
            }else if(data == 1){
                $('#triggerSucsessfullyVerifyEmailModal').trigger('click');
            }else if(data == 2){
                $("#triggerEmailNotFound").trigger('click');
            }
            
            //$('#triggerSucsessfullyVerifyEmailModal').trigger('click');
		}, function (errorMessage) {
			console.log(errorMessage + ' Error......');
		});
	}
    
    if($state.is('emailVerification')){
        $scope.verifyEmail();
    }
    
    $scope.pusePreviewVideo = function(){
        $('#previewVideo').get(0).pause();
    }

    $scope.getAllNotification = function () {
        $rootScope.$emit('updateNotification', $rootScope.authenticatedUser.UserInfo.User_Id);
    }

    
}]);