/*
*  Altair Admin AngularJS
*/
;"use strict";

var altairApp = angular.module('altairApp', [
    'ui.router',
    'oc.lazyLoad',
    'ngSanitize',
    'ngRetina',
    'ncy-angular-breadcrumb',
    'ConsoleLogger',
    //'ngStorage',
    'swxLocalStorage',
    'bw.paging',
    'ngCookies',
    'tmh.dynamicLocale',
    'pascalprecht.translate'
]);

altairApp.constant('variables', {
    header_main_height: 48,
    easing_swiftOut: [ 0.4,0,0.2,1 ],
    bez_easing_swiftOut: $.bez([ 0.4,0,0.2,1 ])
    //BYPASS_AUTH: 1
});

altairApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.youtube.com/**',
        'https://w.soundcloud.com/**'
    ]);
});

// breadcrumbs
altairApp.config(function($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        prefixStateName: 'restricted.dashboard',
        templateUrl: 'app/templates/breadcrumbs.tpl.html'
    });
});

/* detect IE */
function detectIE(){var a=window.navigator.userAgent,b=a.indexOf("MSIE ");if(0<b)return parseInt(a.substring(b+5,a.indexOf(".",b)),10);if(0<a.indexOf("Trident/"))return b=a.indexOf("rv:"),parseInt(a.substring(b+3,a.indexOf(".",b)),10);b=a.indexOf("Edge/");return 0<b?parseInt(a.substring(b+5,a.indexOf(".",b)),10):!1};

altairApp.run(["$rootScope", "$state", "$interval","$localStorage","$http","BYPASS_AUTH","API_URL",
    function ($rootScope, $state, $interval,$localStorage,$http,BYPASS_AUTH,API_URL) {

   if(parseInt(BYPASS_AUTH) !== 1 && $rootScope.toState.name !== 'login'){
       var user = $localStorage.get('user');
       if (!angular.isDefined(user)) {
           $http({
               method: "GET",
               url: API_URL + 'com=service&elem=vtg_user_info&func=getUserInfo',
               params: null
           }).then(
               function mySucces(response) {
                   //console.log(response);
                   if (angular.isDefined(response.data)) {
                       $localStorage.put('user', response.data, 1);
                   } else {
                       $localStorage.remove('user');
                       $localStorage.remove('token');
                       $state.go('login');
                   }
               },
               function myError(response) {
                   console.log(response);
                   $localStorage.remove('user');
                   $localStorage.remove('token');
                   //if (response.status === 401) {
                       $state.go('login');
                   //}
               }
           );
       }
   }

}]);

/* Run Block */
altairApp
    .run([
        '$rootScope',
        '$state',
        '$stateParams',
        '$http',
        '$window',
        '$timeout',
        'preloaders',
        'variables',
        function ($rootScope, $state, $stateParams,$http,$window, $timeout,variables) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeSuccess', function () {

                //console.log('stateChangeSuccess');

                // scroll view to top
                $("html, body").animate({
                    scrollTop: 0
                }, 200);

                if(detectIE()) {
                    $('svg,canvas,video').each(function () {
                        $(this).css('height', 0);
                    });
                };

                $timeout(function() {
                    $rootScope.pageLoading = false;
                },300);

                $timeout(function() {
                    $rootScope.pageLoaded = true;
                    $rootScope.appInitialized = true;
                    // wave effects
                    $window.Waves.attach('.md-btn-wave,.md-fab-wave', ['waves-button']);
                    $window.Waves.attach('.md-btn-wave-light,.md-fab-wave-light', ['waves-button', 'waves-light']);
                    if(detectIE()) {
                        $('svg,canvas,video').each(function() {
                            var $this = $(this),
                                height = $(this).attr('height'),
                                width = $(this).attr('width');

                            if(height) {
                                $this.css('height', height);
                            }
                            if(width) {
                                $this.css('width', width);
                            }
                            var peity = $this.prev('.peity_data,.peity');
                            if(peity.length) {
                                peity.peity().change()
                            }
                        });
                    }
                },600);

            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, toStateParams) {

                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;
                $rootScope.fromState = fromState;

                // main search
                $rootScope.mainSearchActive = false;
                // secondary sidebar
                $rootScope.sidebar_secondary = false;
                $rootScope.secondarySidebarHiddenLarge = false;

                if($($window).width() < 1220 ) {
                    // hide primary sidebar
                    $rootScope.primarySidebarActive = false;
                    $rootScope.hide_content_sidebar = false;
                }
                if(!toParams.hasOwnProperty('hidePreloader')) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                }

            });

            // fastclick (eliminate the 300ms delay between a physical tap and the firing of a click event on mobile browsers)
            FastClick.attach(document.body);

            // get version from package.json
            $http.get('./package.json').then(function onSuccess(response) {
                $rootScope.appVer = response.version;
            });

            // modernizr
            $rootScope.Modernizr = Modernizr;

            // get window width
            var w = angular.element($window);
            $rootScope.largeScreen = w.width() >= 1220;

            w.on('resize', function() {
                return $rootScope.largeScreen = w.width() >= 1220;
            });

            // show/hide main menu on page load
            $rootScope.primarySidebarOpen = $rootScope.largeScreen;

            // hide primary sidebar - toanvd
            //$rootScope.primarySidebarOpen = false;

            $rootScope.pageLoading = true;

            // wave effects
            $window.Waves.init();
        }
    ])
    .run(['PrintToConsole', function(PrintToConsole) {
        PrintToConsole.active = false;
    }]);
