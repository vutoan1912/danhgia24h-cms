/**
 * Created by toanvd2 on 11/21/2018.
 */

altairApp

    .service('HttpServices', function ($http, $q, Message, $localStorage, $state, BYPASS_AUTH) {

        var self = {
            'response': [],
            'Authorization': $localStorage.get('token'), // Get authorization from localStorage

            'checkError': function (response) {
                //console.log(response);
                if (response.status === 401 && parseInt(BYPASS_AUTH) !== 1) {
                    $localStorage.remove('token');
                    $localStorage.remove('uid');
                    $state.go('error.401');
                }
            },

            'getData': function (url, params) {

                var deferred = $q.defer();
                self.getTokenLocal();
                $http({
                    method: "GET",
                    url: url,
                    params: params,
                    headers: {'Authorization': self.Authorization}
                }).then(
                    function mySucces(response) {
                        self.response = response;
                        deferred.resolve(response);
                    },
                    function myError(response) {
                        self.response = response;
                        self.checkError(response);
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            },

            'postData': function (url, params) {
                var deferred = $q.defer();
                self.getTokenLocal();
                $http({
                    method: "POST",
                    url: url,
                    data: params,
                    headers: {'Authorization': self.Authorization}
                }).then(
                    function mySuccess(response) {
                        self.response = response;
                        deferred.resolve(response);
                    },
                    function myError(response) {
                        self.response = response;
                        self.checkError(response);
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            },

            'postDataMessage': function (url, params) {
                var deferred = $q.defer();
                self.getTokenLocal();
                $http({
                    method: "POST",
                    url: url,
                    data: {"data": params},
                    headers: {'Authorization': self.Authorization}
                }).then(
                    function mySuccess(response) {
                        Message.success(response.data['success']);
                        deferred.resolve(response);
                    },
                    function myError(response) {
                        self.response = response;
                        self.checkError(response);
                        Message.error(response.data['error']);
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            },

            'postDataObject': function (url, params) {
                var deferred = $q.defer();
                self.getTokenLocal();
                $http({
                    method: "POST",
                    url: url,
                    data: params,
                    headers: {'Authorization': self.Authorization}
                }).then(
                    function mySuccess(response) {
                        Message.success(response.data['success']);
                        deferred.resolve(response);
                    },
                    function myError(response) {
                        self.response = response;
                        self.checkError(response);
                        deferred.reject(response);
                    }
                );
                return deferred.promise;

            },

            'getTokenLocal': function () {
                self.Authorization = $localStorage.get('token');
            }
        }

        return self;

    })

;