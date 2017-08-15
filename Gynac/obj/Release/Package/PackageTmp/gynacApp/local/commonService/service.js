app.factory('dataService', ['$http', '$q', function ($http, $q) {
    return {
        getData: function (theAPI) {
            var deferred = $q.defer();
            $('#loading').show();
            $http.get(theAPI).success(function (data, status, header) {
                $('#loading').hide();
                if (data != "Code100")
                    deferred.resolve(data);
                else
                    deferred.reject("An error occured while fetching items")
            }).error(function (data, status, header) {
                $('#loading').hide();
                $('#triggerInternalError').trigger('click');
                deferred.reject("An error occured while fetching items");
            });
            return deferred.promise;
        },
		postData: function (theAPI,dataToBesend) {
            var deferred = $q.defer();
            $('#loading').show();
            $http.post(theAPI,dataToBesend).success(function (data, status, header) {
                $('#loading').hide();
                if (data != "Code100")
                    deferred.resolve(data);
                else
                    deferred.reject("An error occured while fetching items")
            }).error(function (data, status, header) {
                $('#loading').hide();
                $('#triggerInternalError').trigger('click');
                deferred.reject("An error occured while fetching items");
            });
            return deferred.promise;
        }
    };
}]);

app.directive('numbersOnly', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, el, attrs, ngModelCtrl) {
            function fromUser(inputtext) {
                var old = ngModelCtrl.$modelValue ? ngModelCtrl.$modelValue : '';
                if (inputtext != "") {
                    var f = parseFloat(inputtext);
                    if (RegExp(/^\d{0,10}$/g).test(inputtext)) {
                        return inputtext;
                    } else {
                        ngModelCtrl.$setViewValue(old);
                        ngModelCtrl.$render();
                        return old;
                    }
                } else {
                    return "";
                }
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    }
});