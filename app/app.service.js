altairApp
        .service('detectBrowser', [
            '$window',
            function ($window) {
                // http://stackoverflow.com/questions/22947535/how-to-detect-browser-using-angular
                return function () {
                    var userAgent = $window.navigator.userAgent,
                            browsers = {
                                chrome: /chrome/i,
                                safari: /safari/i,
                                firefox: /firefox/i,
                                ie: /internet explorer/i
                            };

                    for (var key in browsers) {
                        if (browsers[key].test(userAgent)) {
                            return key;
                        }
                    }
                    return 'unknown';
                }
            }
        ])

        .service('preloaders', [
            '$rootScope',
            '$timeout',
            'utils',
            function ($rootScope, $timeout, utils) {
                $rootScope.content_preloader_show = function (style, variant, container, width, height) {
                    var $body = $('body');
                    if (!$body.find('.content-preloader').length) {
                        var image_density = utils.isHighDensity() ? '@2x' : '',
                                width = width ? width : 48,
                                height = height ? height : 48;

                        var preloader_content = (style == 'regular')
                                ? '<img src="assets/img/spinners/spinner' + image_density + '.gif" alt="" width="32" height="32">'
                                : '<div class="md-preloader"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="' + height + '" width="' + width + '" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg></div>';

                        var thisContainer = (typeof container !== 'undefined') ? $(container) : $body;

                        thisContainer.append('<div class="content-preloader content-preloader-' + variant + '" style="height:' + height + 'px;width:' + width + 'px;margin-left:-' + width / 2 + 'px">' + preloader_content + '</div>');
                        $timeout(function () {
                            $('.content-preloader').addClass('preloader-active');
                        });
                    }
                };
                $rootScope.content_preloader_hide = function () {
                    var $body = $('body');
                    if ($body.find('.content-preloader').length) {
                        // hide preloader
                        $('.content-preloader').removeClass('preloader-active');
                        // remove preloader
                        $timeout(function () {
                            $('.content-preloader').remove();
                        }, 500);
                    }
                };


            }
        ])

        .service('Message', function () {
            return {
                'error': function (msg) {
                    // toaster.pop('error', '', msg);
                },
                'success': function (msg) {
                    //toaster.pop('success', '', msg);
                },
                'warning': function (msg) {
                    //toaster.pop('warning', '', msg);
                },
                'system_error': function () {
                    //toaster.pop('error', '', MSG.sys_error);
                },
                "saved": function () {
                    //toaster.pop('success', '', MSG.saved_success);
                },
                "updated": function () {
                    //toaster.pop('success', '', MSG.updated_success);
                },
                "deleted": function () {
                    //toaster.pop('success', '', MSG.deleted_success);
                }
            }
        })

        .service('TemplateService', function ($http, CONFIG, $q) {
            var self = {

                'getData': function (url, param) {
                    var deferred = $q.defer();

                    $http({method: 'GET', url: url, params: param}).then(
                            function successCallback(response) {
                                if (response.data.response.status == 'success') {
                                    deferred.resolve(response.data.response.data);
                                } else {
                                    //toaster.pop(response.data.response.status, response.data.response.message);
                                    deferred.reject();
                                }

                            }, function errorCallback(response) {
                        //toaster.pop(response.data.response.status, response.data.response.message);
                        deferred.reject();
                    });

                    return deferred.promise;
                },

                'postData': function (url, param) {
                    var deferred = $q.defer();

                    $http({
                        method: 'POST',
                        url: url,
                        data: param
                    }).then(function successCallback(response) {
                        if (response.data.response.status == 'success') {
                            deferred.resolve(response.data.response.data);
                        } else {
                            deferred.reject();
                        }
                        //toaster.pop(response.data.response.status, response.data.response.message);

                    }, function errorCallback(response) {
                        //toaster.pop(response.data.response.status, response.data.response.message);
                        deferred.reject();
                    });

                    return deferred.promise;
                },

                'putData': function (url, param) {
                    var deferred = $q.defer();

                    $http({
                        method: 'PUT',
                        url: url,
                        data: param
                    }).then(function successCallback(response) {
                        if (response.data.response.status == 'success') {
                            deferred.resolve(response.data.response.data);
                        } else {
                            deferred.reject();
                        }
                        //toaster.pop(response.data.response.status, response.data.response.message);

                    }, function errorCallback(response) {
                        //toaster.pop(response.data.response.status, response.data.response.message);
                        deferred.reject();
                    });

                    return deferred.promise;
                }

            };

            return self;
        })

        .service('Common', function () {
            return{
                'checkJson': function (text) {
                    if (text != "")
                        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                            return true;
                        }

                    return false;
                }
            }

        })

        //Authorize
        /*.service('AuthService', [
            '$rootScope',
            '$timeout',
            'utils',
            '$localStorage',
            '$http',
            'API_CHECK_LOGIN',
            '$state',
            'BYPASS_AUTH',
            '$q',
            function ($rootScope, $timeout, utils, $localStorage, $http, API_CHECK_LOGIN, $state, BYPASS_AUTH, $q) {
                $rootScope.bypass_auth = BYPASS_AUTH;

                $rootScope.authorize = function () {

                    var deferred = $q.defer();

                    var token = $localStorage.get('token');
                    if (!angular.isDefined(token)) {

                        $http({
                            method: "GET",
                            url: API_CHECK_LOGIN + 'checkUserLogin.php',
                            params: null
                        }).then(
                            function mySucces(response) {
                                console.log(response);
                                if (angular.isDefined(response.data)) {
                                    if (response.data.status === 200) {
                                        $rootScope.killSessionToken().then(function(res) {
                                            console.log(res);
                                            $localStorage.put('token', response.data.token, 1);
                                            deferred.resolve(response);
                                        })

                                    } else {
                                        $localStorage.remove('token');
                                        $state.go('error.401');
                                    }
                                } else {
                                    $localStorage.remove('token');
                                    $state.go('error.401');
                                }
                            },
                            function myError(response) {
                                console.log(response);
                                $localStorage.remove('token');
                                deferred.reject(response);
                                $state.go('error.401');
                            }
                        );
                    }
                    return deferred.promise;
                };

                $rootScope.killSessionToken = function () {
                    var deferred = $q.defer();
                    $http({
                        method: "POST",
                        url: API_CHECK_LOGIN + 'auth/kill-session-token',
                        params: null
                    }).then(
                        function mySucces(response) {
                            console.log(response);
                            deferred.resolve(response);
                        },
                        function myError(response) {
                            deferred.reject(response);
                        }
                    );
                    return deferred.promise;
                };
            }
        ])*/

        ;