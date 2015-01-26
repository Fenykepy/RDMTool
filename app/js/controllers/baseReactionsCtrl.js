'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('baseReactionsCtrl', ['$scope', 'baseReactionsSrv',
        function($scope, baseReactionsSrv) {

        $scope.reac = baseReactionsSrv;
        $scope.$parent.sub_title = baseReactionsSrv.title;

        $scope.$watch('reac.ab', baseReactionsSrv.refreshAll);
        $scope.$watch('reac.a_type', baseReactionsSrv.refreshAll);
        $scope.$watch('reac.b_type', baseReactionsSrv.refreshAll);
        
        $scope.$watch('reac.force_group.f.value', baseReactionsSrv.refreshForm);
        $scope.$watch('reac.force_group.f.angle', baseReactionsSrv.refreshForm);
        $scope.$watch('reac.force_group.f.hdir', baseReactionsSrv.refreshForm);
        $scope.$watch('reac.force_group.f.vdir', baseReactionsSrv.refreshForm);
        $scope.$watch('reac.force_group.afh', baseReactionsSrv.refreshForm);
        $scope.$watch('reac.force_group.afv', baseReactionsSrv.refreshForm);
        
}]);
