System.register(['@angular/core', '@angular/http', '../global/global-settings', '../global/global-functions', '../global/mlb-global-functions'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, global_settings_1, global_functions_1, mlb_global_functions_1;
    var DirectoryType, DirectoryService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            }],
        execute: function() {
            (function (DirectoryType) {
                DirectoryType[DirectoryType["none"] = 0] = "none";
                DirectoryType[DirectoryType["teams"] = 1] = "teams";
                DirectoryType[DirectoryType["players"] = 2] = "players";
            })(DirectoryType || (DirectoryType = {}));
            exports_1("DirectoryType", DirectoryType);
            DirectoryService = (function () {
                function DirectoryService(http) {
                    this.http = http;
                }
                DirectoryService.prototype.getData = function (pageType, searchParams) {
                    switch (pageType) {
                        case DirectoryType.players:
                            return this.getPlayerData(searchParams);
                        case DirectoryType.teams:
                            return this.getTeamData(searchParams);
                    }
                    return null;
                };
                DirectoryService.prototype.getPlayerData = function (searchParams) {
                    var _this = this;
                    var url = global_settings_1.GlobalSettings.getApiUrl() + '/directory/players';
                    if (searchParams.startsWith) {
                        url += "/" + searchParams.startsWith;
                    }
                    url += "/" + searchParams.listingsLimit + "/" + searchParams.page;
                    // console.log("player directory: " + url);
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        var items = data.data;
                        var firstItem = items.length > 0 ? items[0] : null;
                        return {
                            totalItems: firstItem ? firstItem.resultCount : 0,
                            items: items.map(function (value) { return _this.convertPlayerDataToDirectory(value); })
                        };
                    });
                };
                DirectoryService.prototype.getTeamData = function (searchParams) {
                    var _this = this;
                    var url = global_settings_1.GlobalSettings.getApiUrl() + '/directory/teams';
                    if (searchParams.startsWith) {
                        url += "/" + searchParams.startsWith;
                    }
                    url += "/" + searchParams.listingsLimit + "/" + searchParams.page;
                    // console.log("team directory: " + url);
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        var items = data.data;
                        var firstItem = items.length > 0 ? items[0] : null;
                        return {
                            totalItems: firstItem ? firstItem.resultCount : 0,
                            items: data.data.map(function (value) { return _this.convertTeamDataToDirectory(value); })
                        };
                    });
                };
                //"<a href=''>[Team Name]</a>  |  League:  [American or National]  |  Division: [Division]",
                //"[City], [State]  <i class=\"fa fa-angle-right\"></i>  Stadium: [Stadium Name]"
                DirectoryService.prototype.convertTeamDataToDirectory = function (data) {
                    var location = "N/A";
                    if (data.teamCity && data.teamState) {
                        location = data.teamCity + ", " + data.teamState;
                    }
                    var venue = "N/A";
                    if (data.teamVenue) {
                        venue = data.teamVenue;
                    }
                    return {
                        lastUpdated: data.lastUpdated,
                        mainDescription: [
                            {
                                route: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(data.teamName, data.teamId),
                                text: data.teamName
                            },
                            {
                                text: "League: " + (data.conferenceName ? data.conferenceName : "N/A")
                            },
                            {
                                text: "Division: " + (data.divisionName ? data.divisionName : "N/A")
                            }
                        ],
                        subDescription: [
                            location,
                            "Stadium: " + venue
                        ]
                    };
                };
                //"Last updated: [Day of the week], [Month] [Day], [YYYY]  |   [Timestamp]" +
                //"[Player Name]  |  [Associated Team]  |  Position:  [Position]" +
                //"[City], [State]    Rookie Year: {Rookie Year]"
                DirectoryService.prototype.convertPlayerDataToDirectory = function (data) {
                    var location = "N/A";
                    if (data.city && data.area) {
                        location = data.city + ", " + global_functions_1.GlobalFunctions.stateToAP(data.area);
                    }
                    var positions = "N/A";
                    if (data.position && data.position.length > 0) {
                        positions = data.position.join(", ");
                    }
                    return {
                        lastUpdated: data.lastUpdate,
                        mainDescription: [
                            {
                                route: mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(data.teamName, data.playerName, data.playerId),
                                text: data.playerName
                            },
                            {
                                route: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(data.teamName, data.teamId),
                                text: data.teamName
                            },
                            {
                                text: "Position: " + positions
                            }
                        ],
                        subDescription: [
                            location,
                            "Rookie Year: " + (data.startDate != null ? data.startDate : "N/A")
                        ]
                    };
                };
                DirectoryService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], DirectoryService);
                return DirectoryService;
            }());
            exports_1("DirectoryService", DirectoryService);
        }
    }
});
