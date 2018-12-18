/**
 * Created by toanvd2 on 11/21/2018.
 */

altairApp

        .service('HttpVtgServices', function ($http, $q, Message, $localStorage, $state, BYPASS_AUTH, DOMAIN_VTIGER_2) {

            var self = {
                'response': [],

                'checkError': function (response) {
                    console.log(response);
                    if (response.status === 401 && parseInt(BYPASS_AUTH) !== 1) {
                        document.location = DOMAIN_VTIGER_2 + '/index.php';
                    }
                },

                'getData': function (url, params) {

                    var deferred = $q.defer();
                    $http({
                        method: "GET",
                        url: url,
                        params: params
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
                    $http({
                        method: "POST",
                        url: url,
                        data: params
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
                    $http({
                        method: "POST",
                        url: url,
                        data: {"data": params}
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
                }
            }

            return self;

        })

        ;
