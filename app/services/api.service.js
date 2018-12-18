altairApp

        .service('ApiServices', function ($http, $q, Message, $localStorage, $state, HttpServices) {

            var self = {

                'getData': function (url, params) {

                    HttpServices.getData(API_URL + url, params)
                        .then(function (response) {
                            console.log(response);
                            return response;
                        })
                        .catch(function (fallback) {
                            return fallback;
                        });
                }

            };

            return self;

        })

        ;