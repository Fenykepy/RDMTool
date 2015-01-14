'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('homeCtrl', ['$scope', '$http',
        function($scope, $http) {
        
        $scope.$parent.sub_title = "Le calcul de structure en ligne";

}]);
