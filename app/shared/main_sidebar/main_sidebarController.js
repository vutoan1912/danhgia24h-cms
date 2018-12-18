angular
        .module('altairApp')
        .controller('main_sidebarCtrl', [
            '$timeout',
            '$scope',
            '$rootScope',
            '$translate', 'JhiLanguageService', 'tmhDynamicLocale','$window',
            function ($timeout, $scope, $rootScope,$translate, JhiLanguageService, tmhDynamicLocale,$window) {

                $scope.$on('onLastRepeat', function (scope, element, attrs) {
                    $timeout(function () {
                        if (!$rootScope.miniSidebarActive) {
                            // activate current section
                            $('#sidebar_main').find('.current_section > a').trigger('click');
                        } else {
                            // add tooltips to mini sidebar
                            var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                            tooltip_elem.each(function () {
                                var $this = $(this);

                                $this.attr('title', $this.find('.menu_title').text());
                                UIkit.tooltip($this, {
                                    pos: 'right'
                                });
                            });
                        }
                    })
                });

                // language switcher
                if($window.localStorage.getItem("lang") !=null){
                    $scope.langSwitcherModel = $window.localStorage.getItem("lang");
                } else {
                    $scope.langSwitcherModel = 'gb';
                }
                $scope.langSwitcherOptions = [
                    {id: 1, title: 'English', value: 'gb'},
                    {id: 2, title: 'Tiếng Việt', value: 'vn'}
                ];

                $scope.langSwitcherConfig = {
                    maxItems: 1,
                    render: {
                        option: function(langData, escape) {
                            return  '<div class="option">' +
                                '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                                '<span>' + escape(langData.title) + '</span>' +
                                '</div>';
                        },
                        item: function(langData, escape) {
                            return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                        }
                    },
                    valueField: 'value',
                    labelField: 'title',
                    searchField: 'title',
                    create: false,
                    onInitialize: function(selectize) {
                        $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly',true);
                    },
                    onChange: function(value) {
                        var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                        $translate.use(langKey);
                        tmhDynamicLocale.set(langKey);
                        $window.localStorage.setItem("lang",value);
                        $rootScope.lang = value;
                    }
                };
                $scope.$watch('langSwitcherModel', function() {
                    var value = $scope.langSwitcherModel;
                    var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                    $translate.use(langKey);
                    tmhDynamicLocale.set(langKey);
                    $rootScope.lang = value;
                });

                // menu entries
                $scope.sections = [
                    {
                        id: 0,
                        title: 'Dashboard',
                        icon: '&#xE871;',
                        link: 'restricted.dashboard'
                    },
                    {
                        id: 1,
                        title: 'Mailbox',
                        icon: '&#xE158;',
                        link: 'restricted.pages.mailbox'
                    },
                    {
                        id: 2,
                        title: 'Leads',
                        icon: 'assignment_ind',
                        link: 'restricted.leads.crud'
                        /*submenu: [
                           {
                               title: 'Lead Source',
                               link: 'restricted.leads.crud'
                           },
                           {
                               title: 'List',
                               link: 'restricted.leads.list'
                           }
                        ]*/
                    },
                    {
                        id: 3,
                        title: 'Leads AF',
                        icon: 'account_circle',
                        link: 'restricted.leadscf.crud'
                        /*submenu: [
                           {
                               title: 'Lead Source',
                               link: 'restricted.leads.crud'
                           },
                           {
                               title: 'List',
                               link: 'restricted.leads.list'
                           }
                        ]*/
                    },
                    {
                        id: 4,
                        title: 'Opportunities',
                        icon: '&#xE53E;',
                        link: 'restricted.opportunities.info'
                        /*submenu: [
                           {
                               title: 'Information',
                               link: 'restricted.opportunities.info'
                           }
                        ]*/
                    },
                    {
                        id: 5,
                        title: 'Service Request',
                        icon: 'perm_phone_msg',
                        submenu: [
                            {
                                title: 'Tickets',
                                link: 'restricted.svrequest.ticket'
                            }
                        ]
                    },
                    {
                        id: 6,
                        title: 'AF tool',
                        icon: '&#xE8D2;',
                        submenu: [
                            {
                                title: 'Warning AF',
                                link: 'restricted.tools.toolaf'
                            }
                        ]
                    }
                ];

            }
        ])
        ;