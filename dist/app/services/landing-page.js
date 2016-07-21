System.register(['@angular/core', '@angular/http', '../global/global-settings', '../global/mlb-global-functions'], function(exports_1, context_1) {
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
    var core_1, http_1, global_settings_1, mlb_global_functions_1;
    var LandingPageService;
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
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            }],
        execute: function() {
            LandingPageService = (function () {
                function LandingPageService(http, _mlbGlobalFunctions) {
                    this.http = http;
                    this._mlbGlobalFunctions = _mlbGlobalFunctions;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                LandingPageService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    return headers;
                };
                LandingPageService.prototype.getLandingPageService = function () {
                    var _this = this;
                    var headers = this.setToken();
                    var fullUrl = this._apiUrl + "/landingPage/teams";
                    return this.http.get(fullUrl, {
                        headers: headers
                    })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return {
                            league: _this.landingData(data.data)
                        };
                    });
                }; // getLandingPageservice ends
                LandingPageService.prototype.landingData = function (data) {
                    var self = this;
                    var leagueArray = [];
                    var teamArray = [];
                    for (var league in data) {
                        var divisionArray = [];
                        for (var division in data[league]) {
                            var div = data[league][division];
                            div.forEach(function (val, index) {
                                val.teamFirstName = val.teamFirstName.toUpperCase();
                                val.teamLastName = val.teamLastName.replace("Diamondbacks", "D-backs");
                                var teamName = val.teamFirstName + ' ' + val.teamLastName;
                                val.teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(teamName, val.teamId.toString());
                                val.imageData = {
                                    imageClass: "image-100",
                                    mainImage: {
                                        imageUrl: global_settings_1.GlobalSettings.getImageUrl(val.teamLogo),
                                        urlRouteArray: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(teamName, val.teamId.toString()),
                                        hoverText: "<i class='fa fa-mail-forward home-team-image-fa'></i>",
                                        imageClass: "border-3"
                                    }
                                };
                            }); //finish converting each team
                            divisionArray.push({
                                displayName: division.toUpperCase(),
                                dataArray: div
                            });
                        }
                        leagueArray.push({
                            displayName: "<span class='text-heavy'>" + league.toUpperCase() + " LEAGUE</span> TEAMS<span class='text-heavy'>:</span>",
                            dataArray: divisionArray
                        });
                    }
                    return leagueArray;
                };
                LandingPageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, mlb_global_functions_1.MLBGlobalFunctions])
                ], LandingPageService);
                return LandingPageService;
            }());
            exports_1("LandingPageService", LandingPageService); // LandingPageService ends
        }
    }
});
