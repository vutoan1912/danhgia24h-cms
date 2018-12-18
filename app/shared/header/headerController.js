angular
        .module('altairApp')
        .controller('main_headerCtrl', [
            '$timeout',
            '$scope',
            '$window',
            '$state',
            'DOMAIN_VTIGER_2',
            '$localStorage',
            'HttpServices',
            'API_URL_2',
            //'$rootScope',
            //'$translate', 'JhiLanguageService', 'tmhDynamicLocale',
            function ($timeout, $scope, $window, $state, DOMAIN_VTIGER_2, $localStorage, HttpServices,API_URL_2) {
                      //$rootScope,$translate, JhiLanguageService, tmhDynamicLocale) {

                $scope.user = $localStorage.get('user');
                $scope.AF   = angular.isDefined($scope.user) && $scope.user != null ? $scope.user.af : false;

                $scope.showNoti = false;

                $scope.user = $localStorage.get('user');
                $scope.uid = angular.isDefined($scope.user) ? $scope.user.userid : 0;
                $scope.DOMAIN_VTIGER_2 = DOMAIN_VTIGER_2;
                HttpServices.getData(API_URL_2 + 'com=service&elem=vtg_user_info&func=getUserName', null)
                        .then(function (response) {
                            console.log(response);
                            $scope.username = response.data.u_name;
                        });

                $scope.logout = function () {
                    $localStorage.remove('user');
                    window.location.replace($scope.DOMAIN_VTIGER_2 + "index.php?module=Users&parent=Settings&action=Logout");
                };

                $scope.user_data = {
                    name: "Anonymous",
                    avatar: "assets/img/avatars/avatar_11_tn.png"
                };

                /*$scope.user_data = {
                    name: "Lue Feest",
                    avatar: "assets/img/avatars/avatar_11_tn.png",
                    alerts: [
                        {
                            "title": "Hic expedita eaque.",
                            "content": "Nemo nemo voluptatem officia voluptatum minus.",
                            "type": "warning"
                        },
                        {
                            "title": "Voluptatibus sed eveniet.",
                            "content": "Tempora magnam aut ea.",
                            "type": "success"
                        },
                        {
                            "title": "Perferendis voluptatem explicabo.",
                            "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                            "type": "danger"
                        },
                        {
                            "title": "Quod minima ipsa.",
                            "content": "Vel dignissimos neque enim ad praesentium optio.",
                            "type": "primary"
                        }
                    ],
                    messages: [
                        {
                            "title": "Reiciendis aut rerum.",
                            "content": "In adipisci amet nostrum natus recusandae animi fugit consequatur.",
                            "sender": "Korbin Doyle",
                            "color": "cyan"
                        },
                        {
                            "title": "Tenetur commodi animi.",
                            "content": "Voluptate aut quis rerum laborum expedita qui eaque doloremque a corporis.",
                            "sender": "Alia Walter",
                            "color": "indigo",
                            "avatar": "assets/img/avatars/avatar_07_tn.png"
                        },
                        {
                            "title": "At quia quis.",
                            "content": "Fugiat rerum aperiam et deleniti fugiat corporis incidunt aut enim et distinctio.",
                            "sender": "William Block",
                            "color": "light-green"
                        },
                        {
                            "title": "Incidunt sunt.",
                            "content": "Accusamus necessitatibus officia porro nisi consectetur dolorem.",
                            "sender": "Delilah Littel",
                            "color": "blue",
                            "avatar": "assets/img/avatars/avatar_02_tn.png"
                        },
                        {
                            "title": "Porro ut.",
                            "content": "Est vitae magni eum expedita odit quisquam natus vel maiores.",
                            "sender": "Amira Hagenes",
                            "color": "amber",
                            "avatar": "assets/img/avatars/avatar_09_tn.png"
                        }
                    ]
                };

                $scope.alerts_length = $scope.user_data.alerts.length;
                $scope.messages_length = $scope.user_data.messages.length;*/

                $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function () {
                    $timeout(function () {
                        $($window).resize();
                    }, 280);
                });

                // autocomplete
                $('.header_main_search_form').on('click', '#autocomplete_results .item', function (e) {
                    e.preventDefault();
                    var $this = $(this);
                    $state.go($this.attr('href'));
                    $('.header_main_search_input').val('');
                });

            }
        ])
        ;