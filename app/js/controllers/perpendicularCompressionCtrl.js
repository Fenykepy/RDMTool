'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('perpendicularCompressionCtrl', ['$scope', 'elementSrv',
        'perpendicularCompressionSrv', function($scope, elementSrv, perpendicularCompressionSrv) {

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
        }

        function global_section_change () {
            perpendicularCompressionSrv.set_aef();
        }

        function material_change () {
            set_material_classes();
            elementSrv.set_kmod();
            elementSrv.set_gammaM();
            elementSrv.set_fk(perpendicularCompressionSrv.fk_key);
        }

        function material_class_change () {
            elementSrv.set_fk(perpendicularCompressionSrv.fk_key);
        }

        function fd_change () {
            elementSrv.set_fdfinal([elementSrv.kc90]);
        }
        
        var base_length_change = global_section_change;
        var base_overtaking_change = global_section_change;
        
        elementSrv.reset();
        $scope.element = elementSrv;
        $scope.pcomp = perpendicularCompressionSrv;


        $scope.$watch('element.material', material_change);
        $scope.$watch('element.width', elementSrv.set_global_section);
        $scope.$watch('element.height', height_change);
        $scope.$watch('element.global_section', global_section_change);
        $scope.$watch('element.reduction', elementSrv.set_net_section);
        $scope.$watch('element.effort', elementSrv.set_sigmad);
        $scope.$watch('element.net_section', elementSrv.set_sigmad);
        $scope.$watch('element.service_class', elementSrv.set_kmod);
        $scope.$watch('element.duration', elementSrv.set_kmod);
        $scope.$watch('element.combinaison', elementSrv.set_gammaM);
        $scope.$watch('element.material_class', material_class_change);
        $scope.$watch('element.fk', elementSrv.set_fd);
        $scope.$watch('element.kmod', elementSrv.set_fd);
        $scope.$watch('element.gammaM', elementSrv.set_fd);
        $scope.$watch('element.fd', fd_change);
        $scope.$watch('element.fdfinal', elementSrv.set_verdict);
        $scope.$watch('element.sigmad', elementSrv.set_verdict);
        $scope.$watch('pcomp.base_length', base_length_change);
        $scope.$watch('pcomp.base_overtaking', base_overtaking_change);

}]);
