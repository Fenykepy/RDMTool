'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('baseReactionsCtrl', ['$scope', 'baseReactionsSrv',
        function($scope, baseReactionsSrv) {

        $scope.reac = baseReactionsSrv;
        $scope.force = baseReactionsSrv.force_group;
        $scope.$parent.sub_title = baseReactionsSrv.title;

        $scope.$watch('reac.ab', baseReactionsSrv.refreshAll);
        $scope.$watch('reac.a_type', baseReactionsSrv.refreshAll);
        $scope.$watch('reac.b_type', baseReactionsSrv.refreshAll);
        
        $scope.$watch('force.f.value', baseReactionsSrv.refreshForm);
        $scope.$watch('force.f.angle', baseReactionsSrv.refreshForm);
        $scope.$watch('force.f.hdir', baseReactionsSrv.refreshForm);
        $scope.$watch('force.f.vdir', baseReactionsSrv.refreshForm);
        $scope.$watch('force.afh', baseReactionsSrv.refreshForm);
        $scope.$watch('force.afv', baseReactionsSrv.refreshForm);
        
}]);
