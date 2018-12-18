angular
        .module('altairApp')
        .controller('leadscfCtrl', [
            '$scope',
            '$rootScope',
            '$timeout',
            'HttpVtgServices',
            'SearchAfService',
            'DetailService',
            '$localStorage',
            'API_URL',
            '$filter',
            'ListProductService',
            '$http',
            'LeadafActivityService',
            'DOMAIN_VTIGER_2',
            'API_URL_2',
            function ($scope, $rootScope, $timeout, HttpVtgServices, SearchAfService, DetailService, $localStorage, API_URL, $filter, ListProductService, $http, LeadafActivityService, DOMAIN_VTIGER_2,API_URL_2) {
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
                $scope.DOMAIN_VTIGER_2 = DOMAIN_VTIGER_2;
                //display with role
                $scope.dao_display = 0;
                $scope.action_display = 0;
                $scope.district_display = 0;
                $scope.region_display = 0;
                HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead_af&func=getRoleUser', null)
                        .then(function (response) {
                            var check = response.data
                            if (check.role == "saler") {
                                $scope.action_display = 1;
                            }
                            if (check.role == "manager") {
                                $scope.dao_display = 1;
                            }
                            if (check.role == "af") {
                                $scope.region_display = 1;
                                $scope.dao_display = 1;
                                $scope.district_display = 1;
                            }
                        })

                //load page
                $scope.SearchAfService = SearchAfService;
                $scope.SearchAfService.loadPage();
                //load user info
                $scope.DetailService = DetailService;

                // Load Select lead source
                $scope.selectize_a_data = {options: []};
                HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=getLeadsSource', null)
                        .then(function (response) {
                            $scope.selectize_a_data.options = response.data;
                        })
                        .catch(function (fallback) {

                        });

                $scope.selectize_a_config = {
                    plugins: {
                        'disable_options': {
                            disableOptions: ["c1", "c2"]
                        }
                    },
                    create: false,
                    maxItems: 1,
                    placeholder: 'Select Lead Source',
                    valueField: 'cf_1744',
                    labelField: 'cf_1744',
                    searchField: 'cf_1744',
                    onInitialize: function (selectize) {
                        selectize.on('change', function () {
                        });
                        selectize.on('focus', function () {
                        });
                        selectize.on('dropdown_open', function () {
                        });
                    }
                };
                // Select list source
                var planets_data = $scope.selectize_planets_options = [];

                HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=getLeadsSource', null)
                        .then(function (response) {
                            var planets_data = $scope.selectize_planets_options = response.data;
                        })
                        .catch(function (fallback) {

                        });
                $scope.selectize_planets_config = {
                    plugins: {
                        'remove_button': {
                            label: ''
                        }
                    },
                    maxItems: 1,
                    valueField: 'cf_1744',
                    labelField: 'cf_1744',
                    searchField: 'cf_1744',
                    create: false,
                    render: {
                        option: function (planets_data, escape) {
                            return  '<div class="option">' +
                                    '<span class="title">' + escape(planets_data.cf_1744) + '</span>' +
                                    '</div>';
                        },
                        item: function (planets_data, escape) {
                            return '<div class="item">' + escape(planets_data.cf_1744) + '</div>';
                        }
                    }
                };
                // Select list status
                var status_data = $scope.selectize_Leads_options = [];

                HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=getLeadsStatus', null)
                        .then(function (response) {
                            var status_data = $scope.selectize_Leads_options = response.data;
                        })
                        .catch(function (fallback) {

                        });
                $scope.selectize_Leads_config = {
                    plugins: {
                        'remove_button': {
                            label: ''
                        }
                    },
                    maxItems: 1,
                    valueField: 'leadstatus',
                    labelField: 'leadstatus',
                    searchField: 'leadstatus',
                    create: false,
                    render: {
                        option: function (status_data, escape) {
                            return  '<div class="option">' +
                                    '<span class="title">' + escape(status_data.leadstatus) + '</span>' +
                                    '</div>';
                        },
                        item: function (status_data, escape) {
                            return '<div class="item">' + escape(status_data.leadstatus) + '</div>';
                        }
                    }
                };
                //search function
                $scope.doSearch = function () {
                    $rootScope.content_preloader_show();

                    var search_params = {
                        district: $scope.SearchAfService.district,
                        region: $scope.SearchAfService.region,
                        searchName: $scope.SearchAfService.searchName,
                        cmnd: $scope.SearchAfService.cmnd,
                        phone: $scope.SearchAfService.phone,
                        dao: $scope.SearchAfService.dao,
                        cif: $scope.SearchAfService.cif,
                        searchLeadSource: $scope.SearchAfService.searchLeadSource,
                        searchLeadStatus: $scope.SearchAfService.searchLeadStatus,
                    };
                    console.log(search_params);
                    $scope.SearchAfService.doSearch(search_params);
                };

                //disable_layout
                $scope.disable_layout = function (check) {
//                    console.log("disable layout");
                    if (check) {
                        $scope.SearchAfService.style_loading =
                                {
                                    'pointer-events': 'none',
                                    'opacity': '0.2',
                                }
                    } else {
                        $scope.SearchAfService.style_loading =
                                {
                                    'pointer-events': 'auto',
                                    'opacity': '1',
                                }
                    }
                }
                $scope.lead_id = '';
            }
        ]);
