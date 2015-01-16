'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('axialTractionCtrl', ['$scope', 'elementSrv',
        'axialTractionSrv', function($scope, elementSrv, axialTractionSrv) {

        elementSrv.get_materials_values(function (data) {
                $scope.materials = data;
        });

        elementSrv.get_materials_char_values(function (data) {
                elementSrv.materials_char = data;
        });

        elementSrv.get_durations_values(function (data) {
                $scope.durations = data;
        });

        elementSrv.get_service_classes_values(function (data) {
                $scope.service_classes = data;
        });

        elementSrv.get_combinaisons_values(function (data) {
                $scope.combinaisons = data;
        });



        function set_material_classes () {
            if (! elementSrv.material || ! elementSrv.materials_char) {
                return;
            }
            $scope.material_classes = elementSrv.materials_char[elementSrv.material];
        }

        function height_change () {
            elementSrv.set_global_section();
            axialTractionSrv.set_kh();
        }

        function material_change () {
            set_material_classes();
            elementSrv.set_kmod();
            elementSrv.set_gammaM();
            axialTractionSrv.set_kh();
            elementSrv.set_fk(axialTractionSrv.fk_key);
        }

        function material_class_change () {
            elementSrv.set_fk(axialTractionSrv.fk_key);
        }

        function fd_change () {
            elementSrv.set_fdfinal(axialTractionSrv.coefs);
        }

        function effort_change() {
            elementSrv.set_sigmad();
        }

        var net_section_change = effort_change;

        var kh_change = fd_change;
        
        //axialTractionSrv.reset();
        $scope.element = elementSrv;
        $scope.traction = axialTractionSrv;
        $scope.$parent.sub_title = axialTractionSrv.title;
        $scope.reset = function () {
            //axialTractionSrv.reset;
            console.log('reset');
        }



        $scope.$watch('element.material', material_change);
        $scope.$watch('element.width', elementSrv.set_global_section);
        $scope.$watch('element.height', height_change);
        $scope.$watch('element.global_section', elementSrv.set_net_section);
        $scope.$watch('element.reduction', elementSrv.set_net_section);
        $scope.$watch('element.effort', effort_change);
        $scope.$watch('element.net_section', net_section_change);
        $scope.$watch('element.service_class', elementSrv.set_kmod);
        $scope.$watch('element.duration', elementSrv.set_kmod);
        $scope.$watch('element.combinaison', elementSrv.set_gammaM);
        $scope.$watch('element.material_class', material_class_change);
        $scope.$watch('element.fk', elementSrv.set_fd);
        $scope.$watch('element.kmod', elementSrv.set_fd);
        $scope.$watch('element.gammaM', elementSrv.set_fd);
        $scope.$watch('element.fd', fd_change);
        $scope.$watch('traction.kh', kh_change);
        $scope.$watch('element.fdfinal', elementSrv.set_verdict);
        $scope.$watch('element.sigmad', elementSrv.set_verdict);

}]);
