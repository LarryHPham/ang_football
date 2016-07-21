System.register(['@angular/core', '@angular/http', '../global/global-functions', '../services/roster.data', '../global/global-settings'], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, roster_data_1, global_settings_1;
    var RosterService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (roster_data_1_1) {
                roster_data_1 = roster_data_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            RosterService = (function () {
                function RosterService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                    this._tabTypes = ['full', 'pitchers', 'catchers', 'fielders', 'hitters'];
                }
                RosterService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    return headers;
                };
                RosterService.prototype.initializeAllTabs = function (teamId, conference, maxRows, isTeamProfilePage) {
                    var _this = this;
                    return this._tabTypes.map(function (type) { return new roster_data_1.MLBRosterTabData(_this, teamId, type, conference, maxRows, isTeamProfilePage); });
                };
                RosterService.prototype.getRosterTabData = function (rosterTab) {
                    var _this = this;
                    var teamId = rosterTab.teamId;
                    var type = rosterTab.type;
                    rosterTab.isLoaded = false;
                    rosterTab.hasError = false;
                    var fullUrl = this._apiUrl + "/team/roster/" + teamId;
                    //console.log("loading full team roster: "+ fullUrl);
                    return this.http.get(fullUrl, { headers: this.setToken() })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        _this.fullRoster = data.data;
                        return data.data;
                    });
                }; //getRosterService ends
                RosterService.prototype.loadAllTabsForModule = function (teamId, teamName, conference, isTeamProfilePage) {
                    return {
                        moduleTitle: this.getModuleTitle(teamName),
                        pageRouterLink: this.getLinkToPage(teamId, teamName),
                        tabs: this.initializeAllTabs(teamId.toString(), conference, 5, isTeamProfilePage)
                    };
                };
                RosterService.prototype.getModuleTitle = function (teamName) {
                    var moduletitle = "Team Roster";
                    if (teamName) {
                        moduletitle += " - " + teamName;
                    }
                    return moduletitle;
                };
                RosterService.prototype.getPageTitle = function (teamName) {
                    var pageTitle = "Team Roster";
                    if (teamName) {
                        pageTitle = "Team Roster - " + teamName;
                    }
                    return pageTitle;
                };
                RosterService.prototype.getLinkToPage = function (teamId, teamName) {
                    var pageName = "Team-roster-page";
                    var pageValues = {
                        teamName: global_functions_1.GlobalFunctions.toLowerKebab(teamName),
                        teamId: teamId
                    };
                    return [pageName, pageValues];
                };
                RosterService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], RosterService);
                return RosterService;
            }());
            exports_1("RosterService", RosterService);
        }
    }
});
