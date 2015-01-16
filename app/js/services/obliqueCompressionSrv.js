'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('obliqueCompressionSrv', ['elementSrv', 'anglesSrv',
        function (elementSrv, anglesSrv) {

        var set_verdict = function () {
            elementSrv.fdfinal = elem.fdfinal;
            elementSrv.sigmad = elem.sigmad;
            elementSrv.set_verdict();
        }

        var set_sigmad = function () {
            if (! elem.base_surface || ! elementSrv.effort) {
                return;
            }
            elem.sigmad = (elementSrv.effort * 10) / elem.base_surface;
            set_verdict();
        }

        var set_base_surface = function () {
            if (! elem.base_length || ! elem.base_width) {
                return;
            }
            elem.base_surface = elem.base_length * elem.base_width;
            set_sigmad();
        }

        var set_fdfinal = function () {
            if ( ! elem.f0d || ! elem.f90d || ! elementSrv.kc90 ||
                    ! elem.effort_angle || ! elem.angle_unit) {
                return;
            }
            if (elem.angle_unit == "Degrés") {
                // convert angle from degres to rad
                var alpha = anglesSrv.deg2rad(elem.effort_angle);
            } else {
                var alpha = elem.effort_angle;
            }

            elem.fdfinal = elem.f0d / 
                ((elem.f0d / (elementSrv.kc90 * elem.f90d) * Math.pow(Math.sin(alpha), 2))
                 + Math.pow(Math.cos(alpha), 2));
            
            set_verdict();
        }

        var set_fds = function () {
            elementSrv.fk = elem.f0k;
            elem.f0d = elementSrv.set_fd();
            elementSrv.fk = elem.f90k;
            elem.f90d = elementSrv.set_fd();

            // set fdfinal
            set_fdfinal();
        }

        var set_fks = function () {
            elem.f0k = elementSrv.set_fk("fc0k");
            elem.f90k = elementSrv.set_fk("fc90k");
            set_fds();
        }
    


        var elem = {
            title: "Compression oblique",
            angle_units: anglesSrv.units,
            set_base_surface: set_base_surface,
            set_sigmad: set_sigmad,
            set_fks: set_fks,
            set_fds: set_fds,
            set_fdfinal: set_fdfinal
        };


        return elem;
}]);
