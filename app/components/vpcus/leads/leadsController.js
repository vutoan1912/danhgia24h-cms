angular
        .module('altairApp')
        .controller('leadsCtrl', [
            '$scope', '$rootScope', '$timeout',
            'HttpVtgServices', 'SearchService', 'LeadDetailService',
            '$localStorage', 'API_URL_2', '$filter',
            'ListProductService', '$http', 'ActivityService',
            'DOMAIN_VTIGER_2', '$translate', '$q', 'DOMAIN_VTIGER',
            function ($scope, $rootScope, $timeout, HttpVtgServices, SearchService, LeadDetailService, $localStorage, API_URL_2, $filter,
                    ListProductService, $http, ActivityService, DOMAIN_VTIGER_2, $translate, $q, DOMAIN_VTIGER) {
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
                $scope.LeadDetailService = LeadDetailService;
                //init ActivityService
                $scope.ActivityService = ActivityService;
                $scope.DOMAIN_VTIGER_2 = DOMAIN_VTIGER_2;
                $scope.DOMAIN_VTIGER = DOMAIN_VTIGER;
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
                        searchName: $scope.SearchService.searchName,
                        cif: $scope.SearchService.cif,
                        searchLeadSource: $scope.SearchService.searchLeadSource,
                        searchLeadStatus: $scope.SearchService.searchLeadStatus,
                        cmnd: $scope.SearchService.cmnd,
                        phone: $scope.SearchService.phone
                    };
                    $scope.SearchService.doSearch(search_params);
                };
                //search function
                $scope.clearSearch = function () {
                    $scope.SearchService.searchName = '';
                    $scope.SearchService.cif = '';
                    $scope.SearchService.searchLeadSource = '';
                    $scope.SearchService.searchLeadStatus = '';
                    $scope.SearchService.cmnd = '';
                    $scope.SearchService.phone = '';
                    $scope.doSearch();
                };

                //disable_layout
                $scope.disable_layout = function (check) {
//                    console.log("disable layout");
                    if (check) {
                        $scope.SearchService.style_loading =
                                {
                                    'pointer-events': 'none',
                                    'opacity': '0.2',
                                }
                    } else {
                        $scope.SearchService.style_loading =
                                {
                                    'pointer-events': 'auto',
                                    'opacity': '1',
                                }
                    }
                }
                //lead detail
                $scope.get_info_detail = function (leadid) {
                    $scope.LeadDetailService.leadDetail = {};
                    $scope.LeadDetailService.style_loading_stt = 1;
                    $scope.LeadDetailService.style_loading = {
                        'pointer-events': 'none',
                        'opacity': '0.4',
                    }
                    $scope.LeadDetailService.loadUserInfo(leadid);
                    // sale product 
                    HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=getListProduct', null)
                            .then(function (response) {
                                console.log(response.data);
                                var product_data = $scope.selectize_sale_product_options = response.data;
                                $scope.products_data_tmp1 = $scope.selectize_sale_product_options = response.data;
                            })
                }
                var product_data = $scope.selectize_sale_product_options = [];
                $scope.selectize_sale_product_config = {
                    maxItems: 1,
                    valueField: 'productid',
                    labelField: 'product_mark',
                    searchField: 'product_mark',
                    create: false,
                    render: {
                        option: function (product_data, escape) {
                            return  '<div class="option">' +
                                    '<span class="title" style="font-size: 13px;">' + escape(product_data.product_mark) + '</span>' +
                                    '</div>';
                        },
                        item: function (product_data, escape) {
                            return '<div class="item" style="font-size: 13px;">' + escape(product_data.product_mark) + '</div>';
                        }
                    },
                };
                //edit lead
                $scope.EditLeadDetail = function () {
                    if (LeadDetailService.leadDetail.phone) {
                        LeadDetailService.leadDetail.empty_phone = 1;
                    }
                    if (LeadDetailService.leadDetail.mobile) {
                        LeadDetailService.leadDetail.empty_mobile = 1;
                    }
                    $scope.Editdetail.open();
                    $scope.detail.close();
                }
                //edit lead detail
                $scope.updateLeadDetail = function () {
                    var $update_data = {};
                    $update_data.leadid = LeadDetailService.leadDetail.leadid;
                    if (LeadDetailService.leadDetail.lastname !== "" && LeadDetailService.leadDetail.lastname !== LeadDetailService.leadDetail_tmp.lastname) {
                        $update_data.lastname = LeadDetailService.leadDetail.lastname;
                    }
                    if (LeadDetailService.leadDetail.salutation !== "" && LeadDetailService.leadDetail.salutation !== LeadDetailService.leadDetail_tmp.salutation) {
                        $update_data.salutation = LeadDetailService.leadDetail.salutation;
                    }
                    if (LeadDetailService.leadDetail.email !== "" && LeadDetailService.leadDetail.email !== LeadDetailService.leadDetail_tmp.email) {
                        $update_data.email = LeadDetailService.leadDetail.email;
                    }
                    if (LeadDetailService.leadDetail.industry !== "" && LeadDetailService.leadDetail.industry !== LeadDetailService.leadDetail_tmp.industry) {
                        $update_data.industry = LeadDetailService.leadDetail.industry;
                    }
                    if (LeadDetailService.leadDetail.address !== "" && LeadDetailService.leadDetail.address !== LeadDetailService.leadDetail_tmp.address) {
                        $update_data.address = LeadDetailService.leadDetail.address;
                    }
                    if (LeadDetailService.leadDetail.phone !== "" && LeadDetailService.leadDetail.phone !== LeadDetailService.leadDetail_tmp.phone) {
                        $update_data.phone = LeadDetailService.leadDetail.phone;
                    }
                    if (LeadDetailService.leadDetail.mobile !== "" && LeadDetailService.leadDetail.mobile !== LeadDetailService.leadDetail_tmp.mobile) {
                        $update_data.mobile = LeadDetailService.leadDetail.mobile;
                    }
                    if (LeadDetailService.leadDetail.total_salary !== "" && LeadDetailService.leadDetail.total_salary !== LeadDetailService.leadDetail_tmp.total_salary) {
                        $update_data.total_salary = LeadDetailService.leadDetail.total_salary;
                    }
                    if (LeadDetailService.leadDetail.birthday !== "" && LeadDetailService.leadDetail.birthday !== LeadDetailService.leadDetail_tmp.birthday) {
                        $update_data.birthday = LeadDetailService.leadDetail.birthday;
                    }
                    if (LeadDetailService.leadDetail.gender !== "" && LeadDetailService.leadDetail.gender !== LeadDetailService.leadDetail_tmp.gender) {
                        $update_data.gender = LeadDetailService.leadDetail.gender;
                    }
                    if (LeadDetailService.leadDetail.cmnd !== "" && LeadDetailService.leadDetail.cmnd !== LeadDetailService.leadDetail_tmp.cmnd) {
                        $update_data.cmnd = LeadDetailService.leadDetail.cmnd;
                    }
                    if (LeadDetailService.leadDetail.description !== "" && LeadDetailService.leadDetail.description !== LeadDetailService.leadDetail_tmp.description) {
                        $update_data.description = LeadDetailService.leadDetail.description;
                    }
                    if (LeadDetailService.leadDetail.product_id !== "" && LeadDetailService.leadDetail.product_id !== LeadDetailService.leadDetail_tmp.product_id) {
                        $update_data.product_id = LeadDetailService.leadDetail.product_id;
                        //update product name
                        var tmp = $scope.products_data_tmp1.filter(function (obj) {
                            return obj.productid == LeadDetailService.leadDetail.product_id;
                        });
                        LeadDetailService.leadDetail.product = tmp[0].product_mark;
                    }
                    $update_data.updated_time = $filter('date')(new Date(), 'yyyy/MM/dd HH:mm:ss');
                    console.log($update_data);
                    $http({
                        method: "POST",
                        url: API_URL_2 + 'com=service&elem=vtg_lead&func=updateLeadDetail',
                        data: $update_data,
                        headers: {
                            "content-type": "application/x-www-form-urlencoded"
                        }
                    }).then(
                            function mySuccess(response) {
                                console.log(response.data);
                                $scope.Editdetail.close();
                                $scope.detail.open();
                                $scope.SearchService.loadPage();
                            },
                            function myError(response) {
                                console.log(response);
                            }
                    );
//                    HttpVtgServices.postData(API_URL_2 + 'com=service&elem=vtg_lead&func=updateLeadDetail', $update_data)
//                            .then(function (response) {
//                                console.log(response.data);
//                                $scope.Editdetail.close();
//                                $scope.detail.open();
//                                $scope.SearchService.loadPage();
//                            })
                }
                $scope.lead_id = '';
                $scope.opp_id = 0;
                $scope.activity_id = 0;
                // create activity
                $scope.CreateActivity = function () {
                    document.getElementById('form_validation').onsubmit = function () {
                        ActivityService.style_loading_stt = 1;
                        ActivityService.style_loading = {
                            'pointer-events': 'none',
                            'opacity': '0.4'
                        };
                        var update_data = {
                            'type': ActivityService.activity_info.activity_type,
                            'subject': ActivityService.activity_info.activity_subject,
                            'status': ActivityService.activity_info.activity_status,
                            'response': ActivityService.activity_info.activity_response,
                            'desctition': ActivityService.activity_info.activity_desctition,
                            'startDate': ActivityService.activity_info.activity_startDate,
                            'startTime': ActivityService.activity_info.activity_startTime,
                            'endDate': ActivityService.activity_info.activity_endDate,
                            'endTime': ActivityService.activity_info.activity_endTime,
                            'visibility': ActivityService.activity_info.activity_visibility,
                            'assigned': ActivityService.activity_info.activity_assigned,
                            'parent_id': $scope.lead_id,
                            'token': ActivityService.activity_info.token
                        }
                        $http({
                            method: "POST",
                            url: DOMAIN_VTIGER_2 + "/misv.php?com=service&elem=activity&func=add",
                            data: update_data,
                            headers: {
                                "content-type": "application/x-www-form-urlencoded"
                            }
                        }).then(
                                function mySuccess(response) {
                                    if (response.data.error_code) {
                                        ActivityService.status_response = 0;
                                        ActivityService.opp_response = 1;
                                        ActivityService.msg = response.data.msg;
                                    } else {
                                        ActivityService.status_response = 1;
                                        if (response.data.opp_id) {
                                            ActivityService.opp_response = 1;
                                            $scope.opp_id = response.data.opp_id;
                                            $scope.activity_id = response.data.id;
                                        } else {
                                            ActivityService.opp_response = 0;
                                            $scope.activity_id = response.data.id;
                                        }

                                    }
                                    ActivityService.style_loading_stt = 0;
                                    ActivityService.style_loading = {
                                        'pointer-events': 'auto',
                                        'opacity': '1'
                                    }

                                    $scope.AddActivity.close();
                                    $scope.DialogActivity.open().center();
                                    $scope.SearchService.loadPage();
                                },
                                function myError(response) {
                                    console.log(response);
                                }
                        );
                        console.log(update_data);
                    }

                }
                // Activity 
                var type_data = $scope.selectize_activity_type_options = [];
                var activity_stt = $scope.selectize_activity_status_options = [];
                var activity_res = $scope.selectize_activity_res_options = [];
                var activity_assigned = $scope.selectize_activity_assigned_options = [];
                $scope.activity_status = '';
                $scope.activity_response = '';
                var all_activity = [];
                var all_activity_tmp = [];
                //check lang
                $scope.lg = 'gb';
                $scope.$watch('lang', function (newVal, oldVal) {
                    $scope.lg = newVal;
                    ActivityService.activity_info.activity_response = '';
                    ActivityService.activity_info.activity_status = '';
                    ActivityService.activity_info.activity_type = '';
                    if ($scope.lg == 'gb') {
                        all_activity = all_activity_tmp.gb;
                        if (all_activity) {
                            ActivityService.activity_info.activity_type = 'Call';
                            ActivityService.activity_info.activity_status = 'Contacted';
                            ActivityService.activity_info.activity_response = 'Interested';
                            $scope.selectize_activity_status_options = all_activity['Call']['Status']['data'];
                            $scope.selectize_activity_res_options = all_activity['Call']['Status']['detail']['Contacted'];
                        }
                    } else {
                        all_activity = all_activity_tmp.vi;
                        if (all_activity) {
                            ActivityService.activity_info.activity_type = 'Call';
                            ActivityService.activity_info.activity_status = 'Contacted';
                            ActivityService.activity_info.activity_response = 'Interested';
                            $scope.selectize_activity_status_options = all_activity['Call']['Status']['data'];
                            $scope.selectize_activity_res_options = all_activity['Call']['Status']['detail']['Contacted'];

//                            ActivityService.activity_info.activity_type = 'Call';
//                            ActivityService.activity_info.activity_status = all_activity.Call.Status.data[0].lable;
//                            ActivityService.activity_info.activity_response = all_activity.Call.Status.detail.Contacted[0].lable;
//                            $scope.selectize_activity_status_options = all_activity['Call']['Status']['data'];
//                            $scope.selectize_activity_res_options = all_activity['Call']['Status']['detail']['Contacted'];
                        }

                    }
                    console.log(all_activity);
                }, true);

                $scope.addActivity = function (lead_id) {
                    console.log($scope.lg);
                    $scope.lead_id = lead_id;
                    HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=getDependency', null)
                            .then(function (response) {
                                if ($scope.lg == 'gb') {
                                    var type_data = $scope.selectize_activity_type_options = response.data.gb.data;
                                    all_activity = response.data.gb;
                                    ActivityService.activity_info.activity_type = 'Call';
                                    ActivityService.activity_info.activity_status = 'Contacted';
                                    ActivityService.activity_info.activity_response = 'Interested';
                                    $scope.selectize_activity_status_options = all_activity['Call']['Status']['data'];
                                    $scope.selectize_activity_res_options = all_activity['Call']['Status']['detail']['Contacted'];
                                } else {
                                    var type_data = $scope.selectize_activity_type_options = response.data.vi.data;
                                    all_activity = response.data.vi;

                                    ActivityService.activity_info.activity_type = 'Call';
                                    ActivityService.activity_info.activity_status = 'Contacted';
                                    ActivityService.activity_info.activity_response = 'Interested';
                                    $scope.selectize_activity_status_options = all_activity['Call']['Status']['data'];
                                    $scope.selectize_activity_res_options = all_activity['Call']['Status']['detail']['Contacted'];


//                                    ActivityService.activity_info.activity_type = 'Call';
//                                    ActivityService.activity_info.activity_status = all_activity.Call.Status.data[0].lable;
//                                    ActivityService.activity_info.activity_response = all_activity.Call.Status.detail.Contacted[0].lable;
//                                    $scope.selectize_activity_status_options = all_activity['Call']['Status']['data'];
//                                    $scope.selectize_activity_res_options = all_activity['Call']['Status']['detail']['Contacted'];
                                }

                                console.log(all_activity);
                                all_activity_tmp = response.data;

                            })
                            .catch(function (fallback) {

                            });
                    HttpVtgServices.getData(API_URL_2 + 'com=service&elem=vtg_lead&func=getListAssigned', null)
                            .then(function (response) {
                                var activity_assigned = $scope.selectize_activity_assigned_options = response.data.data;
                                ActivityService.activity_info.activity_assigned = response.data.owner[0].id;
                            })
                }
                console.log(activity_assigned);
                // Activity type
                $scope.selectize_activity_type_config = {
                    maxItems: 1,
                    valueField: 'type',
                    labelField: 'lable',
                    searchField: 'lable',
                    create: false,
                    render: {
                        option: function (type_data, escape) {
                            return  '<div class="option">' +
                                    '<span class="title font_selectize">' + escape(type_data.type) + '</span>' +
                                    '</div>';
                        },
                        item: function (type_data, escape) {
                            return '<div class="item font_selectize">' + escape(type_data.type) + '</div>';
                        }
                    },
                    onChange: function (value) {
                        console.log('onchange: ' + value);
                        ActivityService.activity_info.activity_type = value;
                        if (value === "Call") {
                            var activity_stt = $scope.selectize_activity_status_options = all_activity['Call']['Status']['data'];
                        } else {
                            var activity_stt = $scope.selectize_activity_status_options = all_activity.Meeting.Status.data;
                        }
                        ActivityService.activity_info.activity_status = [activity_stt[0]['status']];
                        console.log(ActivityService.activity_info.activity_status);

                    },
                };
                // Activity status
                $scope.selectize_activity_status_config = {
                    maxItems: 1,
                    valueField: 'status',
                    labelField: 'lable',
                    searchField: 'lable',
                    create: false,
                    render: {
                        option: function (activity_stt, escape) {
                            return  '<div class="option">' +
                                    '<span class="title font_selectize">' + escape(activity_stt.lable) + '</span>' +
                                    '</div>';
                        },
                        item: function (activity_stt, escape) {
                            return '<div class="item font_selectize">' + escape(activity_stt.lable) + '</div>';
                        }
                    },
                    onChange: function (value) {
                        ActivityService.activity_info.activity_status = value;
                        console.log(value);
                        for (x in all_activity.Call.Status.detail) {
                            if (x === value) {
                                var activity_res = $scope.selectize_activity_res_options = all_activity['Call']['Status']['detail'][x];
                            }
                        }
                        for (x in all_activity.Meeting.Status.detail) {
                            if (x === value) {
                                var activity_res = $scope.selectize_activity_res_options = all_activity['Meeting']['Status']['detail'][x];
                            }
                        }
                        console.log(typeof (activity_res));
                        if (typeof (activity_res) !== "undefined") {
                            console.log('1');
                            ActivityService.activity_info.activity_response = [activity_res[0]['response']];
                        } else {
                            console.log('0');
                            ActivityService.activity_info.activity_response = "";
                        }

                    }
                };
                // Activity response
                $scope.selectize_activity_res_config = {
                    maxItems: 1,
                    valueField: 'response',
                    labelField: 'lable',
                    searchField: 'lable',
                    create: false,
                    render: {
                        option: function (activity_res, escape) {
                            return  '<div class="option">' +
                                    '<span class="title font_selectize">' + escape(activity_res.lable) + '</span>' +
                                    '</div>';
                        },
                        item: function (activity_res, escape) {
                            return '<div class="item font_selectize">' + escape(activity_res.lable) + '</div>';
                        }
                    }
                };
                // Activity assigned
                $scope.selectize_activity_assigned_config = {
                    maxItems: 1,
                    valueField: 'id',
                    labelField: 'user_name',
                    searchField: 'user_name',
                    create: false,
                    render: {
                        option: function (activity_assigned, escape) {
                            return  '<div class="option">' +
                                    '<span class="title font_selectize">' + escape(activity_assigned.user_name) + '</span>' +
                                    '</div>';
                        },
                        item: function (activity_assigned, escape) {
                            return '<div class="item font_selectize">' + escape(activity_assigned.user_name) + '</div>';
                        }
                    }
                };
                //change lang
                $scope.input = {
                    type: 'leads.activity.type',
                    subject: 'leads.activity.subject',
                    status: 'leads.activity.status',
                    response: 'leads.activity.response',
                    des: 'leads.activity.des',
                    startDate: 'leads.activity.startDate',
                    endDate: 'leads.activity.endDate',
                    startTime: 'leads.activity.startTime',
                    endTime: 'leads.activity.endTime',
                    assigned: 'leads.activity.assigned',
                    Visibility: 'leads.activity.Visibility',
                }
                $scope.ac = [];
                $scope.$watch('lang', function (newVal, oldVal) {
                    if (angular.isDefined(newVal) && newVal.length > 0) {
                        var tmp_ob = {};
                        $scope.ac = [];
                        angular.forEach($scope.input, function (value, key) {
                            $timeout(function () {
                                $scope.handleTranslate(value).then(function (transValue) {
                                    tmp_ob[key] = transValue
                                })
                            }, 10);
                        });
                        $scope.ac.push(tmp_ob);

                        $timeout(function () {
                            console.log($translate.instant('leads.activity.type'));
                        }, 10);


                    }
                }, true);
                $scope.handleTranslate = function (value) {
                    var deferred = $q.defer();
                    $translate(value)
                            .then(function (translatedValue) {
//                                console.log(translatedValue);
                                deferred.resolve(translatedValue);
                            });
                    return deferred.promise;
                }

                //click to call
                $scope.doClickToCall = function (modulesName, crmid, crm_type, to_phone) {
                    var from_phone = '6077';
                    var isCCA = 'YES';
                    if ($scope.checkFromPhone(from_phone)) {
                        if ($scope.checkToPhone(to_phone)) {
                            if (isCCA == 'YES') {
                                if ($scope.checkCCAToPhone(to_phone) == false) {
                                    to_phone = "9" + to_phone;
                                }

                                if ($scope.isFireFox()) {
                                    window.location = "sip:" + to_phone;
                                } else {
                                    window.open("sip:" + to_phone);
                                }

                                Vtiger_Index_Js.clickToCall(modulesName, crmid, crm_type, to_phone);
                            } else {
                                if ($scope.isFireFox()) {
                                    window.location = "sip:" + to_phone;
                                } else {
                                    window.open("sip:" + to_phone);
                                }
                                Vtiger_Index_Js.clickToCall(modulesName, crmid, crm_type, to_phone);
                            }
                        } else {
                            alert('Phone number is incorrect format, Phone number not include letters, character and less than 13 numbers. Please update and call latter');
                        }
                    } else {
                        alert('Please update correct office phone in user profile to use Click to call feature');
                    }
                    return false;
                }

                $scope.checkFromPhone = function (fromPhone) {

                    var validNumber = "0123456789";

                    if (fromPhone == '' || fromPhone == null) {
                        return false;
                    } else {
                        for (i = 0; i < fromPhone.length; i++) {
                            if (validNumber.indexOf(fromPhone.charAt(i)) == -1) {
                                return false;
                            }
                        }
                    }
                    return true;
                }


                $scope.checkCCAToPhone = function (toPhone) {

                    var validNumber = "9";
                    if (validNumber.indexOf(toPhone.charAt(0)) == -1) {
                        return false;
                    } else {
                        return true;
                    }
                }

                $scope.checkToPhone = function (toPhone) {
                    var validNumber = "0123456789.+-";

                    if (toPhone == '' || toPhone == null || toPhone.length > 13) {
                        return false;
                    } else {
                        for (i = 0; i < toPhone.length; i++) {
                            if (validNumber.indexOf(toPhone.charAt(i)) == -1) {
                                return false;
                            }
                        }
                    }
                    return true;
                }

                $scope.isFireFox = function () {
                    if (navigator.userAgent.indexOf("Firefox") == -1) {
                        return false;
                    } else {
                        return true;
                    }
                }

            }
        ]);
