altairApp
        .service('DetailService',
                function ($rootScope, $q, $http, $localStorage, HttpVtgServices, API_URL_2) {
                    var self = {
                        'Authorization': $localStorage.get('token'), // Get authorization from localStorage
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
                                            product: response.data.product,
                                            product_id: response.data.product_id,
                                            leadsource: response.data.leadsource,
                                            leadstatus: response.data.leadstatus,
                                            createdtime: response.data.createdtime,
                                        };
                                        self.leadDetail = response.data;
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
        .service('LeadafActivityService',
                function ($rootScope, $q, $http, $localStorage, HttpVtgServices,API_URL_2) {
                    var self = {
                        'Authorization': $localStorage.get('token'), // Get authorization from localStorage
                        'activity_info': {
                            'token': $localStorage.get('token'),
                            'activity_type': '',
                            'activity_subject': '',
                            'activity_status': '',
                            'activity_response': '',
                            'activity_desctition': '',
                            'activity_startDate': '',
                            'activity_startTime': '',
                            'activity_endDate': '',
                            'activity_endTime': '',
                            'activity_visibility': 'Public',
                            'activity_assigned': '',
                        },
                        'leadDetail_tmp': [],
                    }
                    return self;
                })
        .service('ListProductService',
                function ($rootScope, $q, $http, $localStorage, HttpVtgServices,API_URL_2) {
                    var self = {
                        'Authorization': $localStorage.get('token'), // Get authorization from localStorage
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
        .service('SearchAfService',
                function ($rootScope, $q, $http, $localStorage, HttpVtgServices, API_URL_2) {
                    var self = {
                        'Authorization': $localStorage.get('token'), // Get authorization from localStorage
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
                            HttpVtgServices.getData(API_URL_2+'com=service&elem=vtg_lead_af&func=doSearchAf', params)
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

