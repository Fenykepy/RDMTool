'use strict';

/* service */


var rdmServices = angular.module('rdmServices');


rdmServices.factory('elementSrv',['$http', function ($http) {    
    var kmod_values, gammaM_values;

    $http.get('data/kmod.json').success(function (data) {
        kmod_values = data;
    });

    $http.get('data/gammaM.json').success(function (data) {
        gammaM_values = data;
    });

    var materials_promise = $http.get('data/materials.json');

    var materials_char_promise = $http.get('data/materialsChar.json');

    var durations_promise = $http.get('data/durations.json');

    var service_classes_promise = $http.get('data/serviceClasses.json');

    var combinaisons_promise = $http.get('data/combinaisons.json');

    var set_global_section = function () {
        if (elem.width && elem.height) {
            elem.global_section = elem.width * elem.height;
        }
    }

    var set_net_section = function () {
        if (elem.global_section) {
            elem.net_section = elem.global_section - elem.reduction;
        }

    }

    var set_sigmad = function () {
        elem.sigmad = (elem.effort * 10) / elem.net_section;
    }

    var set_kc90 = function () {
        if (elem.material == "BMF" || elem.material == "BMR") {
            elem.kc90 = 1.5;
        }else if (elem.material == "BLC") {
            elem.kc90 = 1.75;
        } else {
            elem.kc90 = 1;
        }
    }

    var set_kmod = function () {
        if ((elem.material == "BMF" || elem.material == "BMR" ||
                elem.material == "BLC" || elem.material == "LVL")
                && kmod_values && elem.service_class && elem.duration) {
            var index = "BM-BMR-BLC-LVL";
        } else {
            return;
        }
        elem.kmod = kmod_values[index][elem.service_class - 1][elem.duration];
        set_kc90();
    }

    var set_gammaM = function () {
        if (! elem.material || ! elem.combinaison || ! gammaM_values) {
            return;
        }
        if (elem.combinaison == "Accidentelle") {
            elem.gammaM = gammaM_values['Accidentelle'];
        } else {
            if (elem.material == "BMF" || elem.material == "BMR") {
                var material = "BM";
            } else {
                var material = elem.material;
            }
            elem.gammaM = gammaM_values[material];
        }
    }

    var set_fk = function (key) {
        if (! elem.materials_char || ! elem.material_class || ! elem.material) {
            return;
        }
        elem.fk = elem.materials_char[elem.material][elem.material_class][key];

    }

    var set_fd = function () {
        if (! elem.fk || ! elem.kmod || ! elem.gammaM) {
            return;
        }
        elem.fd = elem.fk * elem.kmod / elem.gammaM;
    }

    var set_fdfinal = function (coefs) {
        if (! elem.fd) {
            return;
        }
        elem.fdfinal = elem.fd;
        for (var coef in coefs) {
            elem.fdfinal = elem.fdfinal * coefs[coef];
        }
    }


    var set_verdict = function () {
        if (! elem.sigmad || ! elem.fdfinal) {
            elem.verdict_bool = null;
            elem.verdict = "";
            return;
        }
        if (elem.fdfinal >= elem.sigmad) {
            elem.verdict_bool = true;
            elem.verdict = "Validé";
        } else {
            elem.verdict_bool = false;
            elem.verdict = "Non validé";
        }
    }


    var reset = function () {
        elem.fk = null;
        elem.fd = null;
        elem.fdfinal = null;
        elem.verdict_bool = null;
        elem.verdict = "";
    }



    var elem = {
        reset: reset,
        reduction: 0,
        set_global_section: set_global_section,
        set_net_section: set_net_section,
        set_sigmad: set_sigmad,
        set_kmod: set_kmod,
        set_gammaM: set_gammaM,
        set_fk: set_fk,
        set_fd: set_fd,
        set_fdfinal: set_fdfinal,
        set_verdict: set_verdict,
        get_materials_values: function (callback) {
            materials_promise.success(callback)
        },
        get_materials_char_values: function (callback) {
            materials_char_promise.success(callback)
        },
        get_durations_values: function (callback) {
            durations_promise.success(callback)
        },
        get_service_classes_values: function (callback) {
            service_classes_promise.success(callback)
        },
        get_combinaisons_values: function (callback) {
            combinaisons_promise.success(callback)
        },


    }

    return elem;
}]);
