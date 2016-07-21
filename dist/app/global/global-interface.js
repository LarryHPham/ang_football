System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Conference, Division, Season;
    return {
        setters:[],
        execute: function() {
            (function (Conference) {
                Conference[Conference["american"] = 0] = "american";
                Conference[Conference["national"] = 1] = "national";
            })(Conference || (Conference = {}));
            exports_1("Conference", Conference); //to get string value: Conference[myValue], where myValues is a Conference value
            (function (Division) {
                Division[Division["east"] = 0] = "east";
                Division[Division["west"] = 1] = "west";
                Division[Division["central"] = 2] = "central";
            })(Division || (Division = {}));
            exports_1("Division", Division); //to get string value: Year[myValue], where myValues is a Year value
            (function (Season) {
                Season[Season["regularSeason"] = 0] = "regularSeason";
                Season[Season["postSeason"] = 1] = "postSeason";
            })(Season || (Season = {}));
            exports_1("Season", Season); //TODO - regularSeason, postSeason
        }
    }
});
/*ABOVE IS ARTICLE MODULE TEST INTERFACE*/
