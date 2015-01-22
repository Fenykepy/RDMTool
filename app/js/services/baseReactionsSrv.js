'use strict';

/* service */

var rdmServices = angular.module('rdmServices');

rdmServices.factory('baseReactionsSrv', ['anglesSrv', function (anglesSrv) {
    // supported base types :
    var base_types = ["Appui glissant", "Rotule"];

 
    // forces directions
    // right arrow, left arrow
    // up arrow, down arrow
    var h_directions = [
        { key: true, value: "\u2192" },
        { key: false, value: "\u2190" }
    ];
    var v_directions = [
        { key: true, value: "\u2191" },
        { key: false, value: "\u2193"}
    ];

    function Force() {
        this.value = 0; // value of force (unsigned)
        this.angle = 0; // in degres
        this.h = 0; // horizontal value of force (unsigned)
        this.v = 0; // vertical value of force (unsigned)
        this.hdir = true; // true if positive (right)
        this.vdir = true; // true if positive (up)
        this.decompose_angle = function () {
            /*
             * decompose value of force into one horizontal
             * and one vertical force.
             */
            if (this.angle == 0) {
                this.h = this.value;
                this.v = 0;
            } else if (this.angle == 90) {
                this.h = 0;
                this.v = this.value;
            } else {
                // convert angle from degres to radians
                var alpha = anglesSrv.deg2rad(this.angle);
                // decompose force
                this.h = Math.sin(alpha) * this.effort;
                this.v = Math.cos(alpha) * this.effort;
            }
        };

        function get_signed (force, dir) {
            /* return signed value of force, 
             * in function of it's direction
             */
            if (dir) { return force }
            else { return - force }
        };

        function set_force (value, force, dir) {
            if (value < 0) {
                force = - value;
                dir = false;
            } else {
                force = value;
                dir = true;
            }
        };

        // returned signed value of h
        this.get_signed_h = get_signed(this.h, this.hdir);
        // returned signed value of v
        this.get_signed_v = get_signed(this.v, this.vdir);
        // set value of h and hdir
        this.set_h = function (x) { set_force(x, this.h, this.hdir); };
        // set value of v and vdir
        this.set_v = function (x) { set_force(x, this.v, this.vdir); };
    }

    function ForceGroup () {
        /* 
         * a group of forces composed by one applyed force
         * and it's two base reactions.
         */
        this.f = new Force();
        this.ra = new Force();
        this.rb = new Force();
        this.afh = 0; // A-F horizontal distance
        this.afv = 0; // A-F vertical distance
        this.set_base_reactions = function () {
            // if some data miss, return
            if (! elem.ab || ! elem.a_type || ! elem.b_type ||
                ! this.f.value || ! this.f.angle || isNaN(this.afh) ||
                isNaN(this.afv)) {
                return false;
            }
            // if there is a horizontal force and both bases are simple,
            // raise an error
            if (this.f.angle && this.f.angle != 90 &&
                elem.a_type == base_types[0] && elem.b_type == base_types[0]) {
                elem.failure = "Une rotule est nécessaire";
                return false;
            }
            // warning if two rotules are specified
            if (elem.a_type == elem.b_type && elem.b_type == base_types[1]) {
                elem.warnings.push("Une seule rotule est nécessaire");
            }

            this.f.decompose_angle();
            this._set_rah_rbh();
            this._set_rbv_reaction();
            this._set_rav_reaction();

            return true;
        };

        this._set_rah_rbh = function () {
            /* set rah and rbh in function of base types. */
            if (elem.a_type == base_types[0]) {
                this.ra.h = 0;
                this.rb.set_h(this.f.get_signed_h());
            } else {
                this.ra.set_h(this.f.get_signed_h());
                this.rb.h = 0;
            }
        };

        this._set_rbv = function () {
            var x;
            var fh = this.convert_moment_h_sign(this.f.h, false);
            var fv = this.convert_moment_v_sign(this.f.v, true);

            x = - (fh * this.afv + fv * this.afh ) / elem.ab);
            this.rb.set_v(this.convert_moment_v_sign(x, true));

        };

        this._set_rav = function () {
            this.ra.set_v(
                    - (this.rb.get_signed_v() + this.f.get_signed_v())
            );
        };

        this._convert_moment_sign = function (value, vertical) {
            /*
             * value : signed force intensity.
             * vertical: boolean, true if effort is vertical.
             *                  false otherwise
             */
            // force is vertical and before A
            if (vertical && this.afh < 0) { return - value; }
            // force is horizontal and upper AB
            if (! vertical && this.afv > 0) { return - effort; }

            // all other cases, sign doesn't change
            return effort;
        };
    };



    var set_total_reactions = function (refresh) {
        /*
         * refresh: boolean, true if forces in force_groups
         * must be set again.
         */
        var rah = 0;
        var rav = 0;
        var rbh = 0;
        var rbv = 0;

        for (var i=0; i < elem.force_groups.length; i++) {
            if (refresh) {
                elem.force_groups[i].set_base_reactions();
            };
            rah = rah + elem.force_groups[i].ra.get_signed_h();
            rav = rav + elem.force_groups[i].ra.get_signed_v();
            rbh = rbh + elem.force_groups[i].rb.get_signed_h();
            rbv = rbv + elem.force_groups[i].rb.get_signed_v();
        }
        
        // set bases reactions
        elem.ra.set_v(rav);
        elem.ra.set_h(rah);
        elem.rb.set_v(rbv);
        elem.rb.set_h(rbh);
    };


    var removeForceGroup = function (force_group_index) {
        /*
         * remove a given force object from elem.forces array
         */
        // remove item from array
        elem.force_groups.splice(force_group_index, 1);
        // compute again total base reactions
        set_total_reactions();
    };


    var addForceGroup = function () {
        var result = elem.force_group.set_base_reactions();
        if (! result) { 
            return false;
        }
        elem.forces.push(elem.force_group);
        elem.force_group = new ForceGroup();
        set_total_reactions();
    };

    var refreshAll = function () {
        // compute total base reactions recomputing all partials base reactions
        set_total_reactions(true);
        // compute form base_reactions
        elem.force_group.set_base_reactions();
    };


    var elem = {
        title: "Réactions d'appui",
        ra: new Force(),
        rb: new Force(),
        force_group: new ForceGroup(),
        force_groups: [],
        base_types: base_types,
        h_directions: h_directions,
        v_directions: v_directions,
        addForceGroup: addForceGroup,
        removeForceGroup: removeForceGroup,
        refreshAll: refreshAll
    };


    return elem;
}]);
