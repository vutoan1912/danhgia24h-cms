altairApp
        .service('LeadDetailService',
                function ($rootScope, $q, $http, API_URL_2, $localStorage, HttpVtgServices) {
                    var self = {
                        'leadDetail': [],
                        'leadDetail_tmp': [],
                        'loadUserInfo': function (leadid) {
                            var deferred = $q.defer();
                            HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=getLeadDetail&leadid=' + leadid, null)
                                    .then(function (response) {
                                        console.log(response.data);
                                        self.leadDetail_tmp = {
                                            address: response.data.address,
                                            email: response.data.email,
                                            industry: response.data.industry,
                                            lastname: response.data.lastname,
                                            phone: response.data.phone,
                                            mobile: response.data.mobile,
                                            product: response.data.product,
                                            product_id: response.data.product_id,
                                            total_salary: response.data.total_salary,
                                            salutation: response.data.salutation,

                                        };

                                        self.leadDetail = response.data;
                                        self.style_loading_stt = 0;
                                        self.style_loading = {
                                            'pointer-events': 'auto',
                                            'opacity': '1',
                                        }
                                        self.leadDetail.empty_phone = 0;
                                        if (response.data.phone) {
                                            self.leadDetail.empty_phone = 1;
                                        }
                                        self.leadDetail.empty_mobile = 0;
                                        if (response.data.mobile) {
                                            self.leadDetail.empty_mobile = 1;
                                        }
                                        deferred.resolve(self.leadDetail);
                                    })
                                    .catch(function (error) {
                                        deferred.reject(error);
                                    });
                            return deferred.promise;
                        }
                    }
                    return self;
                })
        .service('ActivityService',
                function ($rootScope, $q, $http, API_URL_2, $localStorage, HttpVtgServices, $filter) {
                    var date = new Date();
                    var self = {
                        'activity_info': {
                            'activity_type': '',
                            'activity_subject': '',
                            'activity_status': '',
                            'activity_response': '',
                            'activity_desctition': '',
                            'activity_startDate': $filter('date')(new Date(), 'yyyy/MM/dd'),
                            'activity_startTime': $filter('date')(new Date(), 'HH:00'),
                            'activity_endDate': $filter('date')(new Date(), 'yyyy/MM/dd'),
                            'activity_endTime': $filter('date')(new Date(), 'HH:30'),
                            'activity_visibility': 'Public',
                            'activity_assigned': '',
                        },
                        'leadDetail_tmp': [],
                    }
                    return self;
                })
        .service('ListProductService',
                function ($rootScope, $q, $http, API_URL_2, $localStorage, HttpVtgServices) {
                    var self = {
                        'listProduct': [],
                        'userInfo': {},
                        'listProduct': function (leadid) {
                            var deferred = $q.defer();
                            HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=getListProduct', null)
                                    .then(function (response) {
                                        console.log(response.data);
                                        self.listProduct = response.data;
                                    })
                        }
                    }
                    return self;
                })
        .service('SearchService',
                function ($rootScope, $q, $http, API_URL_2, $localStorage, HttpVtgServices) {
                    var self = {
                        'page': 0,
                        'limit': 10,
                        'table': [],
                        'searchName': null,
                        'ordering': 'id',
                        'error': null,
                        'type': null,
                        'loadPage': function () {
                            self.loadSearch('');
                        },
                        'loadSearch': function (params) {
                            //console.log(params.searchLeadSource);
                            HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=doSearch', params)
                                    .then(function (response) {
                                        console.log(response);
                                        self.table = response.data;
                                        $rootScope.content_preloader_hide();
                                        self.style_loading = {
                                            'pointer-events': 'auto',
                                            'opacity': '1',
                                        }
                                    })
                                    .catch(function (fallback) {

                                    });
                        },
                        'doSearch': function (params) {
                            self.searchName = params.searchName;
                            console.log(self.searchName);
                            self.style_loading =
                                    {
                                        'pointer-events': 'none',
                                        'opacity': '0.4',
                                    }
                            self.loadSearch(params);
                        }
                    }
                    return self;
                });

