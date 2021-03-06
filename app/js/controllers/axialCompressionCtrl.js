'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('axialCompressionCtrl', ['$scope', 'elementSrv',
        'axialCompressionSrv', function($scope, elementSrv, axialCompressionSrv) {

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
        axialCompressionSrv.get_liaisons_values(function (data) {
                $scope.liaisons = data;
        });



        function set_material_classes () {
            if (! elementSrv.material || ! elementSrv.materials_char) {
                return;
            }
            $scope.material_classes = elementSrv.materials_char[elementSrv.material];
        }

        function height_change () {
            elementSrv.set_global_section();
            axialCompressionSrv.set_base();
        }

        var width_change = height_change;

        function material_change () {
            set_material_classes();
            elementSrv.set_kmod();
            elementSrv.set_gammaM();
            elementSrv.set_fk(axialCompressionSrv.fk_key);
        }

        function material_class_change () {
            elementSrv.set_fk(axialCompressionSrv.fk_key);
        }

        function fd_change () {
            if ( axialCompressionSrv.kcbase) {
                elementSrv.set_fdfinal(axialCompressionSrv.coefs);
            }
        }

        function effort_change() {
            elementSrv.set_sigmad();
        }

        var net_section_change = effort_change;



        var kcbase_change = fd_change;

        
        elementSrv.reset();
        $scope.element = elementSrv;
        $scope.compression = axialCompressionSrv;
        $scope.$parent.sub_title = axialCompressionSrv.title;


        $scope.$watch('element.material', material_change);
        $scope.$watch('element.width', width_change);
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
        $scope.$watch('element.fdfinal', elementSrv.set_verdict);
        $scope.$watch('element.sigmad', elementSrv.set_verdict);
        $scope.$watch('element.length', axialCompressionSrv.set_lef);
        $scope.$watch('compression.m', axialCompressionSrv.set_lef);
        $scope.$watch('compression.base', axialCompressionSrv.set_base);
        $scope.$watch('compression.lef', axialCompressionSrv.set_lambdabase);
        $scope.$watch('compression.ibase', axialCompressionSrv.set_lambdabase);
        $scope.$watch('compression.kcbase', kcbase_change);


}]);
