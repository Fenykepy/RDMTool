'use strict';

/* service */


var rdmServices = angular.module('rdmServices');

rdmServices.factory('commonValues', ['$http', function ($http) {
    var materialsValuesPromise = $http.get('data/materials.json');
    var materialsCharPromise = $http.get('data/materialsChar.json');
    var durationsPromise = $http.get('data/durations.json');

    return {
        materialsValues: function (callback) {
            materialsValuesPromise.success(callback);
        },
        materialsChar: function (callback) {
            materialsCharPromise.success(callback);
        },
        durations: function (callback) {
            durationsPromise.success(callback);
        },
        service_classes: [1, 2, 3],
        combinaisons: ["Fondamentale", "Accidentelle"]
    }
}]);



rdmServices.factory('element',['$http', function ($http) {    
    var kmod_values, gammaM_values;

    $http.get('data/kmod.json').success(function(data) {
        kmod_values = data;
    });

    $http.get('data/gammaM.json').success(function(data) {
        gammaM_values = data;
    });

    var set_global_section = function () {
        elem.global_section = elem.width * elem.height;
    }

    var set_net_section = function () {
        elem.net_section = elem.global_section - elem.reduction;

    }

    var set_NA = function () {
        elem.NA = (elem.effort * 10) / elem.net_section;
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

    var set_fk = function () {
    }

    var set_fd = function () {
    }


    var elem = {
        reduction: 0,
        global_section: 0,
        net_section: 0,
        set_global_section: set_global_section,
        set_net_section: set_net_section,
        set_NA: set_NA,
        set_kmod: set_kmod,
        set_gammaM: set_gammaM,
        set_fk: set_fk,
        set_fd: set_fd
    }

    return elem;
}]);
