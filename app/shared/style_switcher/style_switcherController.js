angular
    .module('altairApp')
    .controller('style_switcherCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        '$translate', 'JhiLanguageService', 'tmhDynamicLocale','$window',
        function ($timeout, $scope, $rootScope,$translate, JhiLanguageService, tmhDynamicLocale,$window) {

            // language switcher
            /*if($window.localStorage.getItem("lang") !=null){
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
                            '<i style="padding-left: 10px;" class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function(langData, escape) {
                        return '<div class="item"><i style="width: 100px; padding-left: 30px;" class="item-icon flag-' + escape(langData.value).toUpperCase() + '">'+langData.title+'</i></div>';
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
            });*/

        }
    ])
    ;