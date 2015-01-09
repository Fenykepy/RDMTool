'use strict';

/* controller */

var rdmControllers = angular.module('rdmControllers');

rdmControllers.controller('axialTractionCtrl', ['$scope', '$http',
        function($scope, $http) {
        $scope.height = "";
        $scope.base = "";
        $scope.reduction = 0;
        $scope.section_global = "";
        $scope.section_net = "";
        $scope.material_classes = [];
        $scope.service_classes = [1,2,3];
        $scope.durations = [];
        $scope.exposant_lvl = "";
        $scope.combinaisons = ["Fondamentale", "Accidentelle"];
        
        // set section
        function set_section_global () {
            $scope.section_global = $scope.height * $scope.base;
        };

        function set_section_net () {
            $scope.section_net = $scope.section_global - $scope.reduction;
        };

        function set_NA () {
            $scope.NA = ($scope.effort * 10) / $scope.section_net;
        };

        // set kh
        function set_kh () {
            $scope.kh = 1;
            if (!$scope.kh_values || !$scope.material) {
                return;
            }
            var value = $scope.kh_values[$scope.material]['trac'];
            if ($scope.material == 'LVL') {
                value['power'] = $scope.exposant_lvl;
            }
            if ($scope.height <= value['min_height']) {
                var x = Math.pow(value['min_height']/$scope.height, value['power']);
                if (x < value['minkh']) {
                    $scope.kh = x;
                } else { 
                    $scope.kh = value['minkh'];
                }
            }
        };

        // set material class
        function set_material_class () {
            if ($scope.material) {
                console.log($scope.material);
                $http.get('data/' + $scope.material + '.json').success(function(data) {
                    $scope.material_classes = data;
                });
            }
        }

        // set kmod
        function set_kmod () {
            if (! $scope.service_class || ! $scope.duration || ! $scope.material) {
                return;
            }
            if ($scope.material == "BMF" || $scope.material == "BMR" || $scope.material == "BLC" ||
                    $scope.material == "lvl") {
                var index = "BM-BMR-BLC-LVL";
            } else {
                return;
            }
            $scope.kmod = $scope.kmod_values[index][$scope.service_class - 1][$scope.duration];
        }

        // set gammaM
        function set_gammaM () {
            if (! $scope.material || ! $scope.combinaison || ! $scope.gammaM_values) {
                return;
            }
            if ($scope.combinaison == $scope.combinaisons[1]) {
                $scope.gammaM = $scope.gammaM_values['Accidentelle'];
            } else {
                if ($scope.material == "BMF" || $scope.material == "BMR") {
                    var material = "BM";
                } else {
                    var material = $scope.material;
                }
                $scope.gammaM = $scope.gammaM_values[material];
            }
        };
        
        // set_ft0k
        function set_ft0k () {
            if (! $scope.materials_char || ! $scope.material_class) {
                return;
            }
            $scope.ft0k = $scope.materials_char[$scope.material_class]["ft0k"];
        }

        // set_ft0d
        function set_ft0d () {
            if (! $scope.ft0k || ! $scope.kmod || ! $scope.gammaM ) {
                return;
            }
            $scope.ft0d = $scope.ft0k * $scope.kmod / $scope.gammaM;
        }

        // set ft0dkh
        function set_ft0dkh () {
            if (! $scope.ft0d || ! $scope.kh ) {
                return;
            }
            $scope.ft0dkh = $scope.ft0d * $scope.kh;
        };

        // set verdict
        function set_verdict () {
            if (! $scope.ft0dkh || ! $scope.NA ) {
                return;
            }
            console.log('na');
            console.log($scope.NA);
            console.log('ft0dkh');
            console.log($scope.ft0dkh);
            if ($scope.ft0dkh >= $scope.NA) {
                $scope.verdict_bool = true;
                $scope.verdict = "Validé";
            } else {
                $scope.verdit_bool = false;
                $scope.verdict = "Non validé";
            }
        };

        function section_net_change () {
            set_NA();
            set_kh();
        };

        function material_change () {
            set_material_class();
            set_kh();
            set_kmod();
            set_gammaM();
        };

        function duration_change () {
            set_kmod();
        };

        function service_class_change () {
            set_kmod();
        };



        $scope.$watch('height', set_section_global);
        $scope.$watch('base', set_section_global);
        $scope.$watch('reduction', set_section_net);
        $scope.$watch('section_global', set_section_net);
        $scope.$watch('section_net', section_net_change);
        $scope.$watch('exposant_lvl', set_kh);
        $scope.$watch('material', material_change);
        $scope.$watch('effort', set_NA);
        $scope.$watch('duration', duration_change);
        $scope.$watch('material_class', set_ft0k);
        $scope.$watch('service_class', service_class_change);
        $scope.$watch('combinaison', set_gammaM);
        $scope.$watch('ft0k', set_ft0d);
        $scope.$watch('kmod', set_ft0d);
        $scope.$watch('gammaM', set_ft0d);
        $scope.$watch('ft0d', set_ft0dkh);
        $scope.$watch('kh', set_ft0dkh);
        $scope.$watch('ft0dkh', set_verdict);
        $scope.$watch('NA', set_verdict);

        // get materials
        $http.get('data/materials.json').success(function(data) {
            $scope.materials = data;
        });
        // get durations
        $http.get('data/durations.json').success(function(data) {
            $scope.durations = data;
        });
        // get kh values
        $http.get('data/kh.json').success(function(data) {
            $scope.kh_values = data;
        });
        // get kmod values
        $http.get('data/kmod.json').success(function(data) {
            $scope.kmod_values = data;
        });
        // get gammaM values
        $http.get('data/gammaM.json').success(function(data) {
            $scope.gammaM_values = data;
        });
        // get materials chars values
        $http.get('data/character.json').success(function(data) {
            $scope.materials_char = data;
        });
}]);
