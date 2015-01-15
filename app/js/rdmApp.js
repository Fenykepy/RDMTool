'use strict';

/* App module */

var rdmApp = angular.module('rdmApp', [
        'ngRoute',
        'rdmControllers',
        'rdmServices'
]);


// instanciate modules
var rdmControllers = angular.module('rdmControllers', []);
var rdmServices = angular.module('rdmServices', []);


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
            when('/axial-compression/', {
                templateUrl: 'partials/axial-compression.html',
                controller: 'axialCompressionCtrl'
            }).
            when('/perpendicular-compression/', {
                templateUrl: 'partials/perpendicular-compression.html',
                controller: 'perpendicularCompressionCtrl'
            }).
            when('/oblique-compression/', {
                templateUrl: 'partials/oblique-compression.html',
                controller: 'obliqueCompressionCtrl'
            }).
            when('/shearing-force/', {
                templateUrl: 'partials/shearing.html',
                controller: 'shearingCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
}]);
