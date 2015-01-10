'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('axialTractionSrv', ['$http', 'elementSrv',
        function ($http, elementSrv) {
        var kh_values, kh;

        $http.get('data/kh.json').success(function(data) {
            kh_values = data;
        });

        var set_kh = function () {
            elem.kh = 1;
            elem.coefs = [elem.kh];
            if (! kh_values || ! elementSrv.material || ! elementSrv.height) {
                return;
            }
            var value = kh_values[elementSrv.material]['trac'];
            if (elementSrv.material == 'LVL') {
                if ( ! elementSrv.lvl_power) { return; }
                value['power'] = elementSrv.lvl_power;
            }
            if (elementSrv.height <= value['min_height']) {
                var x = Math.pow(value['min_height'] / elementSrv.height,
                        value['power']);
                if (x < value['minkh']) {
                    elem.kh = x;
                } else {
                    elem.kh = value['minkh'];
                }
            }
            elem.coefs = [elem.kh];
        }

        var elem = {
            fk_key: "ft0k",
            set_kh: set_kh,
        }


        return elem;
}]);
