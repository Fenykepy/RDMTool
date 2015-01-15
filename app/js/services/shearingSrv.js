'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('shearingSrv', ['elementSrv',
        function (elementSrv) {

        var reduction_places = {
            "traction": "Zone tendue (généralement la partie inférieure)",
            "compression": "Zone comprimée (généralement la partie supérieure)"
        }

        var set_i = function () {
            elem.i = elem.reduction_grade_length / (elementSrv.height  - elem.he);
        }

        var set_kv = function () {
            if (! elem.he || ! elementSrv.height) { return; }
            // if there are no reduction kv = 1
            if (elem.he == elementSrv.height && elementSrv.reduction == 0) {
                elem.kv = 1;
                return;
            }
            // if reduction is in compressed part or angle is less than 10 %, kv = 1
            if ((elem.reduction_place && elem.reduction_place == "compression") ||
                (elem.reduction_angle && elem.reduction_angle < 10 && elem.reduction_angle > 0)) {
                elem.kv = 1;
                return;
            }
            if (! elem.base_length || ! elem.alpha || ! elem.kn || ! elementSrv.height) {
                return;
            }

            set_i();
            var x = elem.base_length / 2;
            var h = elementSrv.height;
            var kn = elem.kn;
            var a = elem.alpha;
            var i = elem.i;

            var num = (kn * (1 + (1.1 * Math.pow(i, 1.5)) / Math.sqrt(h)))
            var denom = Math.sqrt(h) * ( Math.sqrt(a * (1 - a)) +
                    0.8 * (x / h) * Math.sqrt((1 / a) - Math.pow(a, 2) ) );
            
            var test = num / denom;
            
            elem.kv = Math.min(1, test);
        }


        var set_kn = function () {
            if (! elementSrv.material) { return; }
            var kns = {
                "BMR": 5,
                "BMF": 5,
                "BLC": 6.5
            }

            elem.kn = kns[elementSrv.material];
            set_kv();
        }

        
        var set_alpha = function () {
            elem.alpha = elem.he / elementSrv.height;
            set_kv();
        }

        var set_reduction_angle = function () {
            if (! elem.reduction_height) {
                elem.reduction_angle = "";
                return;
            } else if (! elem.reduction_grade_length || elem.reduction_grade_length == 0) {
                elem.reduction_angle = 0;
                set_kv();
            } else {
                elem.reduction_angle = elem.reduction_height * 100 / elem.reduction_grade_length;
                set_kv();
            }
        }

        var set_net_section = function () {
            if (! elem.he || ! elementSrv.width) {
                return;
            }
                elementSrv.net_section = elem.he * elementSrv.width - elementSrv.reduction;
                elementSrv.set_sigmad(elem.sigmad_coef);
        }

        var set_he = function () {
            if (! elementSrv.height || ! elem.reduction_height) {
                return;
            }
            elem.he = elementSrv.height - elem.reduction_height;
            set_net_section();
            set_alpha();
        }

        var elem = {
            title: "Cisaillement d'effort tranchant",
            fk_key: "fvk",
            reduction_places: reduction_places,
            sigmad_coef: 1.5,
            set_he: set_he,
            set_net_section: set_net_section,
            set_reduction_angle: set_reduction_angle,
            set_kn: set_kn,
            set_kv: set_kv
        };


        return elem;
}]);
