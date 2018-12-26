altairApp
    .service('productService',
        function ($rootScope, $q, $http, API_URL, HttpServices, $filter) {
            var self = {
                'page': 1,
                'limit': 15,
                'table': [],
                'startDate': null,
                'endDate': null,
                'branch': null,
                'ordering': 'id',
                'error': null,
                'type': null,
                'exportData': {
                    cols: [],
                    rows: []
                },
                'style_loading': {
                    'pointer-events': 'auto',
                    'opacity': '1'
                },
                'loadPage': function (group) {
                    $rootScope.content_preloader_show();
                    self.load({
                        "start": self.startDate != null && self.startDate.length > 0 ? self.convert_search_date(self.startDate,1) + " 00:00:00" : null,
                        "end": self.endDate != null && self.endDate.length > 0 ? self.convert_search_date(self.endDate,1) + " 23:59:59": null,
                        "branch": self.branch != null && self.branch.length > 0 ? self.branch : null,
                        "group": group
                    });
                },
                'load': function (params) {
                    console.log(params);
                    HttpServices.getData(API_URL + 'com=service&elem=vtg_957&func=doSearch', params)
                        .then(function (response) {
                            self.table = response.data;
                            //console.log(self.table);
                            self.exportData.rows = response.data;
                            $rootScope.content_preloader_hide();
                            self.style_loading = {
                                'pointer-events': 'auto',
                                'opacity': '1'
                            };
                        })
                        .catch(function (fallback) {

                        });
                },
                'doSearch': function (group) {
                    $rootScope.content_preloader_show();
                    self.style_loading = {
                        'pointer-events': 'none',
                        'opacity': '0.4'
                    };
                    self.load({
                        "start": self.startDate != null && self.startDate.length > 0 ? self.convert_search_date(self.startDate,1) + " 00:00:00" : null,
                        "end": self.endDate != null && self.endDate.length > 0 ? self.convert_search_date(self.endDate,1) + " 23:59:59": null,
                        "branch": self.branch != null && self.branch.length > 0 ? self.branch : null,
                        "group": group
                    });
                },
                'convert_search_date': function (data,num) {
                    var date = new Date(data.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                    //console.log(date);
                    //console.log(date.getDate());
                    //console.log(date.getMonth());

                    var day = date.getDate();if(day.toString().length < 2) day = '0'+day.toString();
                    var month = date.getMonth()+num;if(month.toString().length < 2) month = '0'+month.toString();
                    //console.log(day);
                    //console.log(month);

                    var date_convert  = date.getFullYear() + '/' + month + '/' +  day;
                    return date_convert;
                }
            };
            return self;
        });