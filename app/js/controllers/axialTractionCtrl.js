'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('axialTractionCtrl', ['$scope', 'commonValues', 'element',
        function($scope, commonValues, element) {

        var materialsChar;

        commonValues.materialsValues(function (data) {
            $scope.materials = data;
        });

        commonValues.materialsChar(function (data) {
            materialsChar = data;
        });

        commonValues.durations(function (data) {
            $scope.durations = data;
        });

        function set_material_classes () {
            if (! element.material || ! materialsChar) {
                return;
            }
            $scope.material_classes = materialsChar[element.material];
        }


        $scope.service_classes = commonValues.service_classes;
        $scope.combinaisons = commonValues.combinaisons;
        $scope.element = element;

        $scope.$watch('element.material', set_material_classes);
        $scope.$watch('element.width', element.set_global_section);
        $scope.$watch('element.height', element.set_global_section);
        $scope.$watch('element.global_section', element.set_net_section);
        $scope.$watch('element.reduction', element.set_net_section);
        $scope.$watch('element.effort', element.set_NA);
        $scope.$watch('element.net_section', element.set_NA);
        $scope.$watch('element.material', element.set_kmod);
        $scope.$watch('element.service_class', element.set_kmod);
        $scope.$watch('element.duration', element.set_kmod);
        $scope.$watch('element.material', element.set_gammaM);
        $scope.$watch('element.combinaison', element.set_gammaM);
}]);
