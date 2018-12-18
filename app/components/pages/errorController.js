angular
        .module('altairApp')
        .controller('errorCtrl', [
            '$scope',
            '$rootScope',
            '$timeout',
            'HttpServices',
            '$localStorage',
            'HOME_URL',
            function ($scope, $rootScope, $timeout, HttpServices, $localStorage, HOME_URL) {
                $scope.reloadRoute = function () {
                    location.href = HOME_URL;
                }
            }
        ]);