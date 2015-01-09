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
            if (! $scope.material || ! materialsChar) {
                return;
            }
            $scope.material_classes = materialsChar[$scope.material];
            console.log($scope.material_classes);
        }


        $scope.service_classes = commonValues.service_classes;
        $scope.combinaisons = commonValues.combinaisons;

        $scope.$watch('material', set_material_classes);
        $scope.$watch('element.width', element.set_global_section);
        $scope.$watch('element.height', element.set_global_section);
        $scope.$watch('element.global_section', element.set_net_section);
        $scope.$watch('element.reduction', element.set_net_section);



        $scope.element = element;
}]);
