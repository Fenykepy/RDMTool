'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('shearingCtrl', ['$scope', 'elementSrv',
        'shearingSrv', function($scope, elementSrv, shearingSrv) {

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
            shearingSrv.set_he();
        }

        function width_change () {
            elementSrv.set_global_section();
            shearingSrv.set_net_section();
        }

        function material_change () {
            set_material_classes();
            elementSrv.set_kmod();
            elementSrv.set_gammaM();
            elementSrv.set_fk(shearingSrv.fk_key);
            shearingSrv.set_kn();
        }

        function material_class_change () {
            elementSrv.set_fk(shearingSrv.fk_key);
        }

        function fd_change () {
            elementSrv.set_fdfinal([shearingSrv.kv]);
        }

        function effort_change () {
            elementSrv.set_sigmad(shearingSrv.sigmad_coef);
        }

        function reduction_height_change () {
            shearingSrv.set_he();
            shearingSrv.set_reduction_angle();
        }

        var kv_change = fd_change;
        
        elementSrv.reset();
        $scope.element = elementSrv;
        $scope.shearing = shearingSrv;
        $scope.$parent.sub_title = shearingSrv.title;



        $scope.$watch('element.material', material_change);
        $scope.$watch('element.width', width_change);
        $scope.$watch('element.height', height_change);
        $scope.$watch('element.reduction', shearingSrv.set_net_section);
        $scope.$watch('element.effort', effort_change);
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


        $scope.$watch('shearing.reduction_height', reduction_height_change);
        $scope.$watch('shearing.reduction_grade_length', shearingSrv.set_reduction_angle);
        $scope.$watch('shearing.height_full', shearingSrv.set_he);
        $scope.$watch('element.global_section', shearingSrv.set_net_section);
        $scope.$watch('shearing.reduction_place', shearingSrv.set_kv);
        $scope.$watch('shearing.base_length', shearingSrv.set_kv);
        $scope.$watch('shearing.kv', kv_change);
        


}]);
