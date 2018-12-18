angular
        .module('altairApp')
        .controller('errorCtrl', [
            '$scope',
            '$rootScope',
            '$timeout',
            'HttpServices',
            '$localStorage',
            'VTIGER_LOGIN',
            'HOME_URL',
            function ($scope, $rootScope, $timeout, HttpServices, $localStorage, VTIGER_LOGIN, HOME_URL) {
                $scope.vtiger_login = VTIGER_LOGIN;
                $scope.reloadRoute = function () {
                    location.href = HOME_URL;
                }
            }
        ]);