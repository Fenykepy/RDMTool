'use strict';

/* App module */

var rdmApp = angular.module('rdmApp', [
        'ngRoute',
        'rdmControllers'
]);


// instanciate modules
var rdmControllers = angular.module('rdmControllers', []);


// routes configuration
rdmApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);
        //$locationProvider.hashPrefix('!');
        $routeProvider.
            when('/', {
                templateUrl: 'partials/home.html',
                controller: 'homeCtrl'
            }).
            when('/axial-traction/', {
                templateUrl: 'partials/axial-traction.html',
                controller: 'axialTractionCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
}]);
