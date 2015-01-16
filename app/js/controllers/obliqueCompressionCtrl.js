'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('obliqueCompressionCtrl', ['$scope', 'elementSrv',
        'obliqueCompressionSrv', function($scope, elementSrv, obliqueCompressionSrv) {

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


        function material_change () {
            set_material_classes();
            elementSrv.set_kmod();
            elementSrv.set_gammaM();
            obliqueCompressionSrv.set_fdfinal(); // as Kc90 change
        }

        function material_class_change () {
            obliqueCompressionSrv.set_fks();
        }

        
        elementSrv.reset();
        $scope.element = elementSrv;
        $scope.ocomp = obliqueCompressionSrv;
        $scope.$parent.sub_title = obliqueCompressionSrv.title;


        $scope.$watch('element.material', material_change);
        $scope.$watch('element.effort', obliqueCompressionSrv.set_sigmad);
        $scope.$watch('element.service_class', elementSrv.set_kmod);
        $scope.$watch('element.duration', elementSrv.set_kmod);
        $scope.$watch('element.combinaison', elementSrv.set_gammaM);
        $scope.$watch('element.material_class', material_class_change);
        $scope.$watch('element.kmod', obliqueCompressionSrv.set_fds);
        $scope.$watch('element.gammaM', obliqueCompressionSrv.set_fds);

        $scope.$watch('ocomp.base_length', obliqueCompressionSrv.set_base_surface);
        $scope.$watch('ocomp.base_width', obliqueCompressionSrv.set_base_surface);
        $scope.$watch('ocomp.effort_angle', obliqueCompressionSrv.set_fdfinal); 
        $scope.$watch('ocomp.angle_unit', obliqueCompressionSrv.set_fdfinal); 
}]);
