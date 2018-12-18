/*
* Angular Selectize
* v 1.2.3
* https://github.com/machineboy2045/angular-selectize
*/

/*global $:Selectize */

angular
    .module('selectize', [])
    .value('selectizeConfig', {})
    .directive("selectize", [
        'selectizeConfig',
        '$timeout',
        'ApiServices',
        function (selectizeConfig,$timeout,ApiServices) {
            return {
                restrict: 'EA',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    config: '=?',
                    options: '=?',
                    ngDisabled: '=',
                    ngRequired: '&',
                    apiUrl: '='
                },
                link: function (scope, element, attrs, modelCtrl) {
                    if (!Selectize) {
                        throw new Error("Selectize JavaScript library should be loaded before using this angular module.");
                    }

                    Selectize.defaults.maxItems = null; //default to tag editor
                    Selectize.defaults.hideSelected = true;

                    if(attrs.position) {
                        scope.posBottom = attrs.position;
                    }

                    Selectize.defaults.onDropdownOpen = function($dropdown) {
                        $dropdown
                            .hide()
                            .velocity('slideDown', {
                                begin: function() {
                                    if (typeof scope.posBottom !== 'undefined') {
                                        $dropdown.css({'margin-top':'0'})
                                    }
                                },
                                duration: 200,
                                easing: [ 0.4,0,0.2,1 ]
                            })
                    };
                    Selectize.defaults.onDropdownClose = function($dropdown) {
                        $dropdown
                            .show()
                            .velocity('slideUp', {
                                complete: function() {
                                    if (typeof posBottom !== 'undefined') {
                                        $dropdown.css({'margin-top': ''})
                                    }
                                },
                                duration: 200,
                                easing: [ 0.4,0,0.2,1 ]
                            });
                    };

                    Selectize.defaults.onChange = function() {
                        if(!!$(element).attr('data-parsley-id')) {
                            $(element).parsley().validate();
                        }
                    };

                    Selectize.defaults.onInitialize = function() {
                        if($(element)[0].selectize.isRequired) {
                            $timeout(function() {
                                $(element).prop('required', true);
                            });
                        }
                    };

                    var selectize, config = angular.extend({}, Selectize.defaults, selectizeConfig, scope.config);

                    modelCtrl.$isEmpty = function (val) {
                        return (val === undefined || val === null || !val.length); //override to support checking empty arrays
                    };

                    function createItem(input) {
                        var data = {};
                        data[config.labelField] = input;
                        data[config.valueField] = input;
                        return data;
                    }

                    function toggle(disabled) {
                        disabled ? selectize.disable() : selectize.enable();
                    }

                    var validate = function () {
                        var isInvalid = (scope.ngRequired() || attrs.required || config.required) && modelCtrl.$isEmpty(scope.ngModel);
                        modelCtrl.$setValidity('required', !isInvalid);
                    };

                    function generateOptions(data) {
                        if (!data)
                            return [];

                        data = angular.isArray(data) ? data : [data];

                        return $.map(data, function (opt) {
                            return typeof opt === 'string' ? createItem(opt) : opt;
                        });
                    }

                    function updateSelectize() {
                        validate();

                        selectize.$control.toggleClass('ng-valid', modelCtrl.$valid);
                        selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid);
                        selectize.$control.toggleClass('ng-dirty', modelCtrl.$dirty);
                        selectize.$control.toggleClass('ng-pristine', modelCtrl.$pristine);

                        var value = selectize.items.slice();
                        if (config.maxItems === 1) {
                            value = value[0];
                        }
                        if (!angular.equals(value, scope.ngModel)) {
                            selectize.addOption(generateOptions(scope.ngModel));
                            selectize.setValue(scope.ngModel);
                        }
                    }

                    var onChange = config.onChange,
                        onOptionAdd = config.onOptionAdd;

                    config.onChange = function () {
                        var args = arguments;
                        scope.$evalAsync(function () {
                            var value = selectize.items.slice();
                            if (config.maxItems === 1) {
                                value = value[0];
                            }
                            if (!angular.equals(value, scope.ngModel)) {
                                modelCtrl.$setViewValue(value);
                                if (onChange) {
                                    onChange.apply(this, args);
                                }
                            }
                        });
                    };

                    config.onOptionAdd = function (value, data) {
                        if (scope.options.indexOf(data) === -1)
                            scope.options.push(data);

                        if (onOptionAdd) {
                            onOptionAdd.apply(this, arguments);
                        }
                    };

                    // ngModel (ie selected items) is included in this because if no options are specified, we
                    // need to create the corresponding options for the items to be visible
                    //scope.options = generateOptions((scope.options || config.options || scope.ngModel).slice());

                    scope.generatedOptions = generateOptions( (scope.options || config.options || scope.ngModel).slice() );
                    scope.options.length = 0;
                    scope.generatedOptions.forEach(function (item) {
                        scope.options.push(item);
                    });
                    
                    var angularCallback = config.onInitialize;

                    config.onInitialize = function () {
                        selectize = element[0].selectize;
                        //selectize.addOption(scope.options);
                        selectize.addOption(scope.generatedOptions);
                        selectize.setValue(scope.ngModel);

                        //provides a way to access the selectize element from an
                        //angular controller
                        if (angularCallback) {
                            angularCallback(selectize);
                        }

                        scope.$watch('options', function () {
                            scope.generatedOptions = generateOptions( (scope.options || config.options || scope.ngModel).slice() );
                            scope.options.length = 0;
                            scope.generatedOptions.forEach(function (item) {
                                scope.options.push(item);
                            });
                            selectize.clearOptions();
                            selectize.addOption(scope.generatedOptions);
                            selectize.setValue(scope.ngModel);
                            //selectize.clearOptions();
                            //selectize.addOption(scope.options);
                            //selectize.setValue(scope.ngModel);
                        }, true);

                        scope.$watchCollection('ngModel', updateSelectize);
                        scope.$watch('ngDisabled', toggle);
                    };

                    element.after('<div class="selectize_fix"></div>');

                    element.selectize(config);

                    element.on('$destroy', function () {
                        if (selectize) {
                            selectize.destroy();
                            element = null;
                        }
                    });

                    //toanvd - 24/10/2018

                    /*scope.$watch('ngModel', function(newVal, oldVal) {
                        console.log(oldVal);
                        console.log(newVal);
                        if(newVal != oldVal){
                            if(angular.isDefined(newVal) && newVal.length > 0) {
                                ApiServices.getData(scope.apiUrl, {name : newVal})
                                    .then(function (response) {
                                        console.log(response);
                                        scope.options = response.data;
                                    })
                                    .catch(function (fallback) {
                                        console.log(fallback);
                                    });
                            }
                        }

                    }, true);*/

                    //end toanvd
                }
            };
        }
    ]);

    // tooltip
    Selectize.define('tooltip', function (options) {
        var self = this;
        this.setup = (function () {
            var original = self.setup;
            return function () {
                original.apply(this, arguments);
                var $wrapper = this.$wrapper,
                    $input = this.$input;
                if ($input.attr('title')) {
                    $wrapper
                        .attr('title', $input.attr('title'))
                        .attr('data-uk-tooltip', $input.attr('data-uk-tooltip'));
                }
            };
        })();
    });

    // disable option
    // https://github.com/mondorobot/selectize-disable-options
    Selectize.define('disable_options', function(options) {
        var self = this;

        options = $.extend({
            'disableOptions': []
        }, options);

        self.onFocus = (function() {
            var original = self.onFocus;

            return function() {
                original.apply(this, arguments);

                $.each(options.disableOptions, function(index, option) {
                    self.$dropdown_content.find('[data-value="' + String(option) + '"]').addClass('option-disabled');
                });
            };
        })();

        self.onOptionSelect = (function() {
            var original = self.onOptionSelect;

            return function(e) {
                var value, $target, $option;

                if (e.preventDefault) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                $target = $(e.currentTarget);

                if ($target.hasClass('option-disabled')) {
                    return;
                } else if ($target.hasClass('create')) {
                    self.createItem();
                } else {
                    value = $target.attr('data-value');
                    if (value) {
                        self.lastQuery = null;
                        self.setTextboxValue('');
                        self.addItem(value);
                        if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
                            self.setActiveOption(self.getOption(value));
                        }
                    }

                    self.blur();
                }
                return original.apply(this, arguments);
            };
        })();
    });

    Selectize.define('infinite_scroll', function(options) {
        var self = this
            , page = 1;

        self.infinitescroll = {
            onScroll: function() {
                var scrollBottom = self.$dropdown_content[0].scrollHeight - (self.$dropdown_content.scrollTop() + self.$dropdown_content.height())
                if(scrollBottom < 300){
                    var query = JSON.stringify({
                        search: self.lastValue,
                        page: page
                    })

                    self.$dropdown_content.off('scroll')
                    self.onSearchChange(query)
                }
            }
        };

        self.onFocus = (function() {
            var original = self.onFocus;

            return function() {
                var query = JSON.stringify({
                    search: self.lastValue,
                    page: page
                })

                original.apply(self, arguments);
                self.onSearchChange(query)
            };
        })();

        self.onKeyUp = function(e) {
            var self = this;

            if (self.isLocked) return e && e.preventDefault();
            var value = self.$control_input.val() || '';

            if (self.lastValue !== value) {
                var query = JSON.stringify({
                    search: value,
                    page: page = 1
                });

                self.lastValue = value;
                self.onSearchChange(query);
                self.refreshOptions();
                self.clearOptions();
                self.trigger('type', value);
            }
        };

        self.on('load',function(){
            page++
            self.$dropdown_content.on('scroll', self.infinitescroll.onScroll);
        });

    });