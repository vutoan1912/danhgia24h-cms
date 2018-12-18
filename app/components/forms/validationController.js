angular
    .module('altairApp')
    .controller('validationCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        function ($scope,$rootScope,$timeout) {

            var $formValidate = $('#form_validation');
            console.log($formValidate)
            $formValidate
                .parsley({
                    'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
                })
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });

            $scope.selectize_val_options = [
                { value: 'press', label: 'Press' },
                { value: 'net', label: 'Internet' },
                { value: 'mouth', label: 'Word of mouth' },
                { value: 'other', label: 'Other...' }
            ];

            $scope.selectize_val_config = {
                maxItems: 1,
                valueField: 'value',
                labelField: 'label',
                create: false,
                placeholder: 'Choose...'
            };

            // datepicker callback
            $('#val_birth').on('hide.uk.datepicker', function() {
                $formValidate.parsley().validate();
            });

        }
    ]);