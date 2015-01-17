'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('baseReactionsSrv', ['anglesSrv', function (anglesSrv) {
    // supported base types :
    var base_types = ["Appui simple", "Rotule"];

 
    // forces directions
    var h_directions = ["\u2192", "\u2190"];
    var v_directions = ["\u2191", "\u2193"];
    
    // reverse force direction
    var reverseDir = function (dir, directions) {
        if (dir == directions[0]) {
            return directions[1];
        } else {
            return directions[0];
        }
    }

    var decompose_angle = function () {
        if (elem.angle == 90) {
            elem.fh = 0;
            elem.fv = elem.effort;
        } else if (elem.angle == 0) {
            elem.fh = elem.effort;
            elem.fv = 0;
        } else {
            var alpha = anglesSrv.deg2rad(elem.angle);
            elem.fh = Math.sin(alpha) * elem.effort;
            elem.fv = Math.cos(alpha) * elem.effort;
        }
    };

    var set_h_reaction = function () {
        if (elem.a_type == base_types[0]) {
            elem.rah = 0;
            elem.rbh = elem.fh;
            elem.rbhdir = reverseDir(elem.hdir, h_directions);
        } else {
            elem.rbh = 0;
            elem.rah = elem.fh;
            elem.rahdir = reverseDir(elem.hdir, h_directions);
        }
    }

    var set_rb = function () {

    }


    var set_reactions = function () {
        elem.failure = null; 
        elem.warnings = [];

        // if there is a horizontal force and both base are simple, raise error
        if (elem.angle && elem.angle != 90 &&
                elem.a_type == base_types[0] && elem.b_type == base_types[0]) {
            elem.failure = "Une rotule est nécessaire";
            elem.fv = elem.fh = null;
            return;
        }

        if (! elem.ab || ! elem.a_type || ! elem.b_type ||
            ! elem.effort || ! elem.angle || ! elem.afh ||
            ! elem.afv || ! elem.hdir || ! elem.vdir) {
            return;
        }
        
        decompose_angle();
        set_h_reaction();

    };

    var elem = {
        title: "Réactions d'appui",
        base_types: base_types,
        h_directions: h_directions,
        v_directions: v_directions,
        set_reactions: set_reactions,
        warnings: []
    };


    return elem;
}]);
