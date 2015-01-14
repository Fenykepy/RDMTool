'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('mainCtrl', ['$scope', '$http',
        function($scope, $http) {

            $scope.sub_title = "Le calcul de structure en ligne";

}]);
