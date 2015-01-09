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



rdmServices.factory('element', function () {    
    

    var set_global_section = function () {
        elem.global_section = elem.width * elem.height;
    }

    var set_net_section = function () {
        elem.net_section = elem.global_section - elem.reduction;

    }

    var set_NA = function () {
        elem.NA = (effort * 10) / elem.net_section;
    }

    var set_kmod = function () {
    }

    var set_gammaM = function () {
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
});
