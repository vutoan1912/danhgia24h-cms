angular
        .module('altairApp')
        .controller('toolsToolafCtrl', [
            '$scope', '$rootScope', '$timeout',
            'HttpVtgServices', 'SearchService', 'DetailService',
            '$localStorage', 'API_URL_2', '$filter',
            'ListProductService', '$http', 'LeadafActivityService',
            'DOMAIN_VTIGER_2', '$translate', '$q', 'DOMAIN_VTIGER',
            function ($scope, $rootScope, $timeout, HttpVtgServices, SearchService, DetailService, $localStorage, API_URL_2, $filter,
                    ListProductService, $http, LeadafActivityService, DOMAIN_VTIGER_2, $translate, $q, DOMAIN_VTIGER) {
                //init
                $scope.CurrentDate = new Date();
                var date = new Date();
                $scope.startDate = $filter('date')(new Date(), 'yyyy/MM/dd');
                $scope.endDate = $filter('date')(new Date(), 'yyyy/MM/dd');
                $scope.startTime = $filter('date')(new Date(), 'HH:mm');
                $scope.endTime = $filter('date')(new Date(), 'HH:mm');
                $scope.table = [];
                $scope.pageSize = 10;
                $scope.paginationCurrent = 1;
                //
                //load page
                $scope.SearchService = SearchService;
                $scope.SearchService.loadPage();
                //
                $scope.ListProductService = ListProductService;

                //load user info
                $scope.DetailService = DetailService;
                //init LeadafActivityService
                $scope.LeadafActivityService = LeadafActivityService;
                $scope.DOMAIN_VTIGER_2 = DOMAIN_VTIGER_2;
                $scope.DOMAIN_VTIGER = DOMAIN_VTIGER;

                //display with role
                $scope.dao_display = 0;
                $scope.action_display = 0;
                $scope.branch_display = 0;
                HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_tool_af&func=getRoleUser', null)
                        .then(function (response) {
                            var check = response.data
                            if (check.rm_role == "RM") {
                                $scope.action_display = 1;
                            }
                            if (check.rm_role == "PM" || check.rm_role == "BM") {
                                $scope.dao_display = 1;
                            }
                            if (check.rm_role == "ADMIN") {
                                $scope.dao_display = 1;
                                $scope.branch_display = 1;
                            }
                        })
                //
                var myDate = new Date();
                var previousMonth = new Date(myDate);
                previousMonth.setMonth(myDate.getMonth() - 3);
                $scope.last_activity = $filter('date')(previousMonth, 'dd/MM/yyyy');
                //search function
                $scope.doSearch = function () {
                    $rootScope.content_preloader_show();
                    var search_params = {
                        district: $scope.SearchAfService.district,
                        region: $scope.SearchAfService.region,
                        dao: $scope.SearchAfService.dao,
                        cif: $scope.SearchAfService.cif,
                    };
                    console.log(search_params);
                }

            }
        ]);
