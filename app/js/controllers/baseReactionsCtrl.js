'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('baseReactionsCtrl', ['$scope', 'baseReactionsSrv',
        function($scope, baseReactionsSrv) {

        $scope.reac = baseReactionsSrv;
        $scope.$parent.sub_title = baseReactionsSrv.title;

        $scope.$watch('reac.ab', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.a_type', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.b_type', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.effort', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.angle', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.afh', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.afv', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.hdir', baseReactionsSrv.set_reactions);
        $scope.$watch('reac.vdir', baseReactionsSrv.set_reactions);
}]);
