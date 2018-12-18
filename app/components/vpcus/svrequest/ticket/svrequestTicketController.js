angular
    .module('altairApp')
    .controller('svrequestTicketCtrl', [
        '$rootScope',
        '$scope',
        '$rootScope',
        '$timeout',
        'API_URL_2',
        '$localStorage','$translate', '$filter','$window',
        'svrequestTicketService','GR_AF','DOMAIN_VTIGER_2','ROLE_BM',
        function ($rootScope,$scope,$rootScope,$timeout,API_URL_2,$localStorage,$translate,$filter,$window,svrequestTicketService,GR_AF,DOMAIN_VTIGER_2,ROLE_BM) {

            $scope.DOMAIN_VTIGER_2 = DOMAIN_VTIGER_2;
            $scope.disableSearch = false;

            $scope.user = $localStorage.get('user');
            //check group
            $scope.group_name = angular.isDefined($scope.user) && $scope.user != null ? $scope.user.groupname : [];
            $scope.GR_AF = GR_AF;
            $scope.AF = $scope.group_name.includes($scope.GR_AF);
            if(!$scope.AF) $scope.GR_AF = $scope.group_name.length > 0 ? $scope.group_name[0] : null;
            console.log($scope.GR_AF);
            //check role
            $scope.role_name = angular.isDefined($scope.user) && $scope.user != null ? $scope.user.rolename : '';
            $scope.BM = $scope.role_name.includes(ROLE_BM);
            $scope.branch = angular.isDefined($scope.user) && $scope.user != null ? $scope.user.branch : '';
            $scope.dao = angular.isDefined($scope.user) && $scope.user != null ? $scope.user.dao : '';
            $scope.dao = $scope.dao.length > 0 ? $scope.dao : 'N/A';

            //show / hide table column
            $scope.myColumns = ["index","ticketNo","title","status","serviceSubCategory","fullName","dao","cif","idNumber","expectedCloseDate","createdTime","modifiedTime","description","creator","assignedTo","branch","branchName"];
            $scope.myColumnsShow=[];
            $scope.initColumn = function () {
                for (var i=0; i<$scope.myColumns.length-4;i++){
                    $scope.myColumnsShow.push(true);
                }
                for (var i=$scope.myColumns.length - 4; i<$scope.myColumns.length;i++){
                    $scope.myColumnsShow.push(false);
                }
            };
            $scope.initColumn();
            $scope.checkColumnAll = false;
            $scope.handleAllColumn = function () {
                //console.log($scope.checkColumnAll)
                if ($scope.checkColumnAll){
                    for (var i=0; i < $scope.myColumnsShow.length;i++){
                        $scope.myColumnsShow[i] = true;
                    }
                } else {
                    for (var i=0; i < $scope.myColumnsShow.length;i++){
                        $scope.myColumnsShow[i] = false;
                    }
                }
            };
            function checkEveryColumn(value) {
                return value;
            }
            $scope.handleColumn = function () {
                if($scope.myColumnsShow.every(checkEveryColumn)){
                    $scope.checkColumnAll = true;
                }else{
                    $scope.checkColumnAll = false;
                }
            };

            //Selectize switch language
            $scope.show_branch = true;
            $scope.$watch('lang', function(newVal, oldVal) {
                if(newVal != oldVal){
                    if(angular.isDefined(newVal) && newVal.length > 0) {
                        $scope.show_branch = false;
                        $timeout(function(){
                            $translate('service.rq.tickets.fields.placehBranch')
                                .then(function (translatedValue) {
                                    $scope.selectize_branch.placeholder = translatedValue;
                                    $scope.show_branch = true;
                                });
                            $translate('service.rq.tickets.fields.export')
                                .then(function (translatedValue) {
                                    $scope.excel.textButton = translatedValue;
                                });
                        }, 5);

                        //translate column
                        $scope.renderHeader();
                    }
                }
            }, true);

            //Selectize branch
            $scope.selectize_branch = {
                model: null,
                options: [],
                plugins: ['remove_button','infinite_scroll'], //use load event if use service api search - load more
                maxItems: 1,
                valueField: 'branch_code',
                labelField: 'branch_name',
                searchField: 'branch_name',
                placeholder: $filter('translate')('service.rq.tickets.fields.placehBranch'),
                //use load event if use service api search - load more
                url: API_URL_2 + 'com=service&elem=vtg_branch&func=doSearch',
                searchFieldApi: 'name',
                totalCount: 0,
                page: 1,
                limit: 15,
                //end init data for service api search - load more
                create: true,
                render: {
                    option: function (data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(data.branch_name) + '</span>' +
                            '</div>';
                    },
                    item: function (data, escape) {
                        return '<div class="item">' + escape(data.branch_name) + '</div>';
                    }
                },
                //use load event if use service api search - load more
                load: function(query, callback) {
                    query = JSON.parse(query);
                    $scope.selectize_branch.page = query.page || 1;
                    if(!$scope.selectize_branch.totalCount || $scope.selectize_branch.totalCount > ( ($scope.selectize_branch.page - 1) * $scope.selectize_branch.limit) ){
                        $.ajax({
                            url: $scope.selectize_branch.url + '&' + $scope.selectize_branch.searchFieldApi + '=' + query.search  + '&limit=' + $scope.selectize_branch.limit + '&page=' + query.page,
                            type: 'GET',
                            error: function() {
                                callback();
                            },
                            success: function(res) {
                                res = JSON.parse(res);
                                //console.log(res)
                                $scope.selectize_branch.totalCount = res.total_count;
                                callback(res.items);
                            }
                        });
                    } else {
                        callback();
                    }
                }
            };

            //service
            $scope.svrequestTicketService = svrequestTicketService;

            //init datetime
            var d_start = new Date();
            d_start.setMonth(d_start.getMonth() - 1);
            var d_end = new Date();
            $scope.svrequestTicketService.startDate = $filter('date')(d_start, 'dd-MM-yyyy');
            $scope.svrequestTicketService.endDate = $filter('date')(d_end, 'dd-MM-yyyy');

            //console.log($scope.svrequestTicketService.startDate);
            //console.log($scope.svrequestTicketService.endDate);

            $scope.svrequestTicketService.loadPage($scope.GR_AF);

            //verify datetime
            $scope.checkDateRange = function () {
                $scope.disableSearch = false;
                //console.log($scope.svrequestTicketService.startDate);
                //console.log($scope.svrequestTicketService.endDate);
                var date_start = $scope.convert_date_standard($scope.svrequestTicketService.startDate);
                var date_end = $scope.convert_date_standard($scope.svrequestTicketService.endDate);
                //console.log(date_start);
                //console.log(date_end);
                if(date_start > date_end){
                    $scope.disableSearch = true;
                    UIkit.modal.alert('Ngày bắt đầu yêu cầu nhỏ hơn ngày kết thúc !');
                }
                var date_end_3ago = date_end;
                date_end_3ago.setMonth(date_end_3ago.getMonth() - 3);
                //console.log(date_end_3ago)

                if(date_start < date_end_3ago){
                    $scope.disableSearch = true;
                    UIkit.modal.alert('Giới hạn tra cứu trong khoảng 3 tháng !');
                }
            };

            $scope.setBranch = function () {
                $scope.svrequestTicketService.branch = $scope.selectize_branch.model;
                //console.log($scope.svrequestTicketService.branch);
            };

            /*$scope.doExport=function(tableId){
                var exportHref=Excel.tableToExcel(tableId,'ListTickets');
                $timeout(function(){location.href=exportHref;},100); // trigger download
            };*/

            $scope.excel = {
                fileName: "tickets-list",
                sheetName: "tickets-list",
                templateUrl: "app/templates/export/svrequest-tickets-template.html",
                textButton: $filter('translate')('service.rq.tickets.fields.export')
            };

            $scope.renderHeader = function () {
                $scope.svrequestTicketService.exportData.cols = [];
                $timeout(function(){
                    angular.forEach($scope.myColumns, function(value, key){
                        $translate('service.rq.tickets.table.' + value)
                            .then(function (translatedValue) {
                                $scope.svrequestTicketService.exportData.cols[key] = translatedValue;
                            });
                    });
                }, 5);
            };

            // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

            $scope.cutString = function(string){
                if(!string) return '';
                if(string.length > 22){
                    for(var i=22;i<=string.length;i++){
                        if(string[i] == ' ') return string.substring(0, i) + "...";
                    }
                }
                return string;
            };
            
            $scope.showStatus = function (status) {
                if(angular.isDefined(status)){
                    var s = status.trim().toLowerCase();
                    if(s.length == 0) s = 'N/A';
                    return s;
                    /*switch(s) {
                        case "open":
                            return "uk-badge-primary";
                            break;
                        case "closed":
                            return "uk-badge-success";
                            break;
                        case "cancelled":
                            return "uk-badge-danger";
                            break;
                        case "wait for support units":
                            return "uk-badge-warning";
                            break;
                        default:
                            return '';
                    }*/
                }else{
                    return '';
                }
            };

            $scope.convert_date_standard = function (data) {
                var date = new Date(data.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                //console.log(date);
                return date;
            };
        }
    ]);