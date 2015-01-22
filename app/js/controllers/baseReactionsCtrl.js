'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('baseReactionsCtrl', ['$scope', 'baseReactionsSrv',
        function($scope, baseReactionsSrv) {

        $scope.reac = baseReactionsSrv;
        $scope.force = baseReactionsSrv.force_group;
        $scope.$parent.sub_title = baseReactionsSrv.title;

        $scope.$watch('reac.ab', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.a_type', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.b_type', baseReactionsSrv.set_reactions);
        
        $scope.$watch('force.effort', baseReactionsSrv.set_reactions);
        $scope.$watch('force.angle', baseReactionsSrv.set_reactions);
        $scope.$watch('force.afh', baseReactionsSrv.set_reactions);
        $scope.$watch('force.afv', baseReactionsSrv.set_reactions);
        $scope.$watch('force.hdir', baseReactionsSrv.set_reactions);
        $scope.$watch('force.vdir', baseReactionsSrv.set_reactions);
        
}]);
