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
                this.h = Math.cos(alpha) * this.value;
                this.v = Math.sin(alpha) * this.value;
            }
        };

        function get_signed (force, dir) {
            /* return signed value of force, 
             * in function of it's direction
             */
            //console.log('get_signed');
            //console.log(dir);
            //console.log(force);
            if (dir) { return force }
            else { return - force }
        };

        this._set_force = function (value, sens) {
            console.log('value:' + value);
            console.log('sens:' + sens);
            console.log(this);
            if (value < 0) {
                this[sens] = - value;
                this[sens + "dir"] = false;
            } else {
                this[sens] = value;
                this[sens + "dir"] = true;
            }
        };

        // returned signed value of h
        this.get_signed_h = function () { return get_signed(this.h, this.hdir); };
        // returned signed value of v
        this.get_signed_v = function () { return get_signed(this.v, this.vdir); };
        // set value of h and hdir
        this.set_h = function (x) { this._set_force(x, "h");
            console.log('this.h:' + this.h);
            console.log('this.hdir:' + this.hdir);
        };
        // set value of v and vdir
        this.set_v = function (x) { this._set_force(x, "v"); };
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
            console.log('set_base_reactions');
            // if some data miss, return
            if ( isNaN(elem.ab) || ! elem.a_type || ! elem.b_type ||
                ! this.f.value || isNaN(this.f.angle) || isNaN(this.afh) ||
                isNaN(this.afv)) {
                console.log('return false');
                console.log(this);
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
            this._set_rah_rbh_reactions();
            this._set_rbv_reaction();
            this._set_rav_reaction();

            return true;
        };

        this._set_rah_rbh_reactions = function () {
            console.log('set_rah_rbh_reactions');
            /* set rah and rbh in function of base types. */
            if (elem.a_type == base_types[0]) {
                console.log(this.f.get_signed_h());
                this.ra.h = 0;
                this.rb.set_h(this.f.get_signed_h());
            } else {
                this.ra.set_h(this.f.get_signed_h());
                this.rb.h = 0;
            }
            console.log(this.rb.h);
            console.log(this.ra.h);
        };

        this._set_rbv_reaction = function () {
            console.log('set_rbv_reactions');
            var x;
            var fh = this._convert_moment_sign(this.f.h, false);
            var fv = this._convert_moment_sign(this.f.v, true);

            x = - ((fh * this.afv + fv * this.afh ) / elem.ab);
            this.rb.set_v(this._convert_moment_sign(x, true));

        };

        this._set_rav_reaction = function () {
            console.log('set_rav_reaction');
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
            if (! vertical && this.afv > 0) { return - value; }

            // all other cases, sign doesn't change
            return value;
        };
    };



    var set_total_reactions = function (refresh) {
        console.log('set_total_reactions');
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
                console.log('set_total_reactions');
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
        console.log('removeForceGroup');
        /*
         * remove a given force object from elem.forces array
         */
        // remove item from array
        elem.force_groups.splice(force_group_index, 1);
        // compute again total base reactions
        set_total_reactions();
    };


    var addForceGroup = function () {
        console.log('addForceGroup');
        var result = elem.force_group.set_base_reactions();
        if (! result) { 
            return false;
        }
        elem.force_groups.push(elem.force_group);
        elem.force_group = new ForceGroup();
        set_total_reactions();
    };


    var refreshForm = function () {
        // compute current force_group base reactions
        console.log('refreshForm');
        elem.force_group.set_base_reactions();
        
    }


    var refreshAll = function () {
        console.log('refreshAll');
        elem.failure = null;
        elem.warnings = [];
        // compute total base reactions recomputing all partials base reactions
        set_total_reactions(true);
        // compute form base_reactions
        refreshForm()
    };


    var elem = {
        title: "Réactions d'appui",
        ab: 0,
        ra: new Force(),
        rb: new Force(),
        a_type: base_types[0],
        b_type: base_types[0],
        force_group: new ForceGroup(),
        force_groups: [],
        base_types: base_types,
        h_directions: h_directions,
        v_directions: v_directions,
        addForceGroup: addForceGroup,
        removeForceGroup: removeForceGroup,
        refreshForm: refreshForm,
        refreshAll: refreshAll
    };


    return elem;
}]);
