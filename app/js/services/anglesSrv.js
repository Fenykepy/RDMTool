'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('anglesSrv', [ function () {
    // supported units :
    var units = ["Degrés", "Radians"];
    
    var deg2rad = function (deg) {
        /* convert a angle from degres to radians
         * deg: number in degres (0 - 360);
         * return: number in radians
         */
        if (! deg || deg > 360) {
            console.log("anglesSrv.deg2rad: input error:" + deg);
            return false;
        }
        return deg * Math.PI / 180;
    };

    var rad2deg = function (rad) {
        /* convert a angle from radians to degres
         * rad: number in radians (0 - 2PI)
         * return: number in degres
         */
        if (! rad || rad > 2 * Math.PI) {
            console.log("anglesSrv.rad2deg: input error:" + rad);
            return false;
        }
        return rad * 180 / Math.PI; 
    };

    var elem = {
        units: units,
        deg2rad: deg2rad,
        rad2deg: rad2deg
    };


    return elem;
}]);
