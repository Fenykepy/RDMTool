'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('baseReactionsSrv', ['anglesSrv', function (anglesSrv) {
    // supported base types :
    var base_types = ["Appui glissant", "Rotule"];

 
    // forces directions
    // right arrow, left arrow
    // up arrow, down arrow
    var h_directions = ["\u2192", "\u2190"];
    var v_directions = ["\u2191", "\u2193"];
    
    
    var set_dir = function (rel_effort, directions ) {
        /* return right or up arrow if effort is positive
         * and left or down arrow if effort is negative
         */
        if (rel_effort < 0) {
            return directions[1];
        } else {
            return directions[0];
        }
    };

    var decompose_angle = function () {
        /*
         * decompose a force arriving with given angle
         * into one horizontal and one vertical force.
         */
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

    var set_sign = function () {
        /*
         * take a non signed effort value and give it a sign
         * function of its direction
         */
        if (elem.fh > 0 && elem.hdir == h_directions[1]) {
            elem.fhrel = - elem.fh;
        } else {
            elem.fhrel = elem.fh;
        }
        if (elem.fv > 0 && elem.vdir == v_directions[1]) {
            elem.fvrel = - elem.fv;
        } else {
            elem.fvrel = elem.fv;
        }
    };

    var unset_sign = function (effort) {
        /*
         * take a signed effort value and return it's non signed version
         */
        if (effort < 0) {
            return - effort;
        }
        return effort;
    };

    var set_h_reaction = function () {
        /*
         * set rah and rbh base reactions in function
         * of base types.
         */
        if (elem.a_type == base_types[0]) {
            elem.rah = 0;
            elem.rbh = elem.fh;
            elem.rbhrel = - elem.fhrel;
            elem.rbhdir = set_dir(elem.rbhrel, h_directions);
        } else {
            elem.rbh = 0;
            elem.rah = elem.fh;
            elem.rahrel = - elem.fhrel;
            elem.rahdir = set_dir(elem.rahrel, h_directions);
        }
    };

    var convert_moment_sign = function (effort, vertical) {
        /*
         * vertical: boolean, true if effort is vertical.
         *          false otherwise
         */
        // force is vertical and before A
        if (vertical && elem.afh < 0) { return - effort; }
        // force is horizontal and upper AB
        if (! vertical && elem.afv > 0) { return - effort; }
        
        // all other cases, sign doesn't move
        return effort;
    };

    var set_rbv = function () {
        var x;
        var fh = convert_moment_sign(elem.fhrel, false);
        var fv = convert_moment_sign(elem.fvrel, true);

        x = - (fh * elem.afv + fv * elem.afh ) / elem.ab;

        elem.rbvrel = convert_moment_sign(x, true);
        elem.rbvdir = set_dir(elem.rbvrel, v_directions);
        elem.rbv = unset_sign(elem.rbvrel);
    };


    var set_rav = function () {
        elem.ravrel = - (elem.rbvrel + elem.fvrel);
        elem.ravdir = set_dir(elem.ravrel, v_directions);
        elem.rav = unset_sign(elem.ravrel);
    };


    var set_reactions = function () {
        elem.failure = null; 
        elem.warnings = [];

        if (! elem.ab || ! elem.a_type || ! elem.b_type ||
            ! elem.effort || ! elem.angle || isNaN(elem.afh) ||
            isNaN(elem.afv) || ! elem.hdir || ! elem.vdir) {
            return false;
        }

        // if there is a horizontal force and both base are simple, raise error
        if (elem.angle && elem.angle != 90 &&
                elem.a_type == base_types[0] && elem.b_type == base_types[0]) {
            elem.failure = "Une rotule est nécessaire";
            elem.fv = elem.fh = null;
            return false;
        }
        // warning if two rotules are specified
        if (elem.a_type == elem.b_type && elem.a_type == base_types[1] &&
                elem.angle != 90) {
            elem.warnings.push("Une seule rotule est nécessaire");
        }
        // warning if there's one rotule and angle is 90
        if ((elem.a_type == base_types[1] || elem.b_type == base_types[1]) &&
                elem.angle == 90) {
            elem.warnings.push("Pas de rotule nécessaire");
        }
        
        decompose_angle();
        set_sign();
        set_h_reaction();
        set_rbv();
        set_rav();
        return true;
    };


    var set_total_reactions = function () {
        var rahtot = 0;
        var ravtot = 0;
        var rbhtot = 0;
        var rbvtot = 0;

        for (var i=0; i < elem.forces.length; i++) {
            rahtot = rahtot + elem.forces[i].rahrel;
            ravtot = ravtot + elem.forces[i].ravrel;
            rbhtot = rbhtot + elem.forces[i].rbhrel;
            rbvtot = rbvtot + elem.forces[i].rbvrel;
        }
        
        // set unsigned bases reactions
        elem.rahtot = unset_sign(rahtot);
        elem.ravtot = unset_sign(ravtot);
        elem.rbhtot = unset_sign(rbhtot);
        elem.rbvtot = unset_sign(rbvtot);

        // set base_reactions directions
        elem.rahtotdir = set_dir(rahtot, h_directions);
        elem.ravtotdir = set_dir(ravtot, v_directions);
        elem.rbhtotdir = set_dir(rbhtot, h_directions);
        elem.rbvtotdir = set_dir(rbvtot, v_directions);
    };


    var reset_force_form = function () {
        console.log('reset_force_form');
        elem.effort = null;
        elem.angle = null;
        elem.afh = null;
        elem.afv = null;
        elem.vdir = null;
        elem.hdir = null;
        elem.fvrel = null;
        elem.fhrel = null;
        elem.fh = null;
        elem.fv = null;
        elem.rahrel = null;
        elem.ravrel = null;
        elem.rah = null;
        elem.rav = null;
        elem.rahdir = null;
        elem.ravdir = null;
        elem.rbhrel = null;
        elem.rbvrel = null;
        elem.rbh = null;
        elem.rbv = null;
        elem.rbhdir = null;
        elem.rbvdir = null;
    };

    var remove_force = function (force_index) {
        /*
         * remove a given force object from elem.forces array
         */
        // remove item from array
        elem.forces.splice(force_index, 1);
        // compute again total base reactions
        set_total_reactions();
    }

    var add_force = function () {
        console.log('add_force');
        var result = set_reactions();
        if (! result) { 
            console.log('add_force result is false');
            return false;
        }
        var force = {
            effort: elem.effort,
            angle: elem.angle,
            afh: elem.afh,
            afv: elem.afv,
            fvdir: elem.vdir,
            fhdir: elem.hdir,
            fvrel: elem.fvrel,
            fhrel: elem.fhrel,
            fh: elem.fh,
            fv: elem.fv,
            rah: elem.rah,
            rav: elem.rav,
            rahrel: elem.rahrel,
            ravrel: elem.ravrel,
            rahdir: elem.rahdir,
            ravdir: elem.ravdir,
            rbh: elem.rbh,
            rbv: elem.rbv,
            rbhrel: elem.rbhrel,
            rbvrel: elem.rbvrel,
            rbhdir: elem.rbhdir,
            rbvdir: elem.rbvdir
        };
        elem.forces.push(force);
        reset_force_form();
        set_total_reactions();
    }

    var elem = {
        title: "Réactions d'appui",
        forces: [],
        base_types: base_types,
        h_directions: h_directions,
        v_directions: v_directions,
        set_reactions: set_reactions,
        add_force: add_force,
        remove_force: remove_force
    };


    return elem;
}]);
