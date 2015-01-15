'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('axialCompressionSrv', ['$http', 'elementSrv',
        function ($http, elementSrv) {
        var liaisons_promise = $http.get('data/liaisons.json');

        var set_lef = function () {
            if (! elementSrv.length || ! elem.m) {
                return;
            }
            elem.lef = elementSrv.length * elem.m;
        }

        function set_ibase () {
            elem.ibase = elem.base_value / Math.sqrt(12);
        }

        function set_betac () {
            if (elementSrv.material == "BLC" || elementSrv.material == "LVL") {
                elem.betac = 0.1;
            } else {
                elem.betac = 0.2;
            }
        }

        function set_kbase () {
            set_betac();
            elem.kbase = 0.5 * ( 1 + (elem.betac * (elem.lambdarelbase - 0.3)) + Math.pow(elem.lambdarelbase, 2));
        }

        function set_kcbase () {
            set_kbase();
            elem.kcbase = 1 / (elem.kbase + Math.sqrt(
                    Math.pow(elem.kbase, 2) - Math.pow(elem.lambdarelbase, 2)
                ));
            elem.coefs = [elem.kcbase];

        }

        function set_lambdarelbase () {
            elem.e005 = elementSrv.materials_char[elementSrv.material][elementSrv.material_class]["e005"] * 1000;
            elem.lambdarelbase = (elem.lef /( elem.ibase * Math.PI)) * Math.sqrt(
                    elementSrv.fk/elem.e005);
            if (elem.lambdarelbase <= 0.3) {
                elem.kcbase = 1;
                elem.coefs = [1];
                elem.flamb_bool = true;
                elem.flamb = "Pas de flambement";
            } else {
                set_kcbase();
                elem.flamb_bool = false;
                elem.flamb = "Risque de flambement";
            }
        }


        var set_lambdabase = function () {
            if (! elem.lef || ! elem.ibase) {
                return;
            }
            elem.lambdabase = elem.lef / elem.ibase;
            if (elem.lambdabase > 120) {
                elem.meca = "Élancement mécanique trop important";
                elem.meca_bool = false;
            } else {
                elem.meca = "Élancement mécanique correct";
                elem.meca_bool = true;
            }
            set_lambdarelbase();
        }



        var set_base = function () {
            if (elem.base == "y" && elementSrv.height) {
                elem.base_value = elementSrv.height;
            } else if (elem.base == "z" && elementSrv.width) {
                elem.base_value = elementSrv.width;
            } else { return; }
            set_ibase();
        }


        var elem = {
            title: "Compression axiale",
            fk_key: "fc0k",
            bases: {"y": "hauteur (y)", "z": "largeur (z)"},
            set_lef: set_lef,
            set_base: set_base,
            set_lambdabase: set_lambdabase,
            set_kcbase: set_kcbase,
            get_liaisons_values: function (callback) {
                liaisons_promise.success(callback)
            }
        };

        return elem;
}]);
