'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('perpendicularCompressionSrv', ['elementSrv',
        function (elementSrv) {

        var set_lef = function () {
            elem.lef = parseInt(elem.base_length);
            if (elem.base_overtaking && elem.base_overtaking >= (elementSrv.height / 3)) {
                elem.lef = elem.lef + 30;
            }

        }

        var set_aef = function () {
            if (! elem.base_length || ! elementSrv.height 
                    || ! elementSrv.width) {
                return;
            }
            set_lef();
            elem.aef = elem.lef * elementSrv.width;
            elementSrv.net_section = elem.aef;
        }

        var elem = {
            title: "Compression perpendiculaire",
            fk_key: "fc90k",
            set_aef: set_aef,
            coefs: [elementSrv.kc90]
        };


        return elem;
}]);
