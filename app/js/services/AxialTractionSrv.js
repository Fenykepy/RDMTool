'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('axialTraction', ['$http', 'element' 'commonValues',
        function ($http, element, commonValues) {
        var kh_values;

        $http.get('data/kh.json').success(function(data) {
            kh_values = data;
        }

        var set_kh = function () {
            elem.kh = 1;
            if (! kh_values || ! element.material) {
                return;
            }
            var value = kh_values[element.material]['trac'];
            if (element.material == 'LVL') {
                if ( ! element.lvl_power) { return; }
                value['power'] = element.lvl_power;
            }
            if (element.height <= value['min_height']) {
                var x = Math.pow(value['min_height'] / element.height,
                        value['power']);
                if (x < value['minkh']) {
                    elem.kh = ;
                } else {
                    elem.kh = value['minkh'];
                }
            }
        }

        var set_fk = function () {
            element.fk = "ft0k";
        }

        var set_ft0dkh () {
            elem.ft0dkh = elem
        }

        var set_verdict = function () {
        }

        var elem = {
            set_fk: set_fk,
            set_kh: set_kh,
            set_ft0dkh: set_ft0dkh,
            set_verdict: set_verdict
        }

        return elem;
}]);
