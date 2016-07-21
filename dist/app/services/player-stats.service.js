System.register(['@angular/core', '@angular/http', '../global/global-functions', '../global/global-settings', './player-stats.data'], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, global_settings_1, player_stats_data_1;
    var PlayerStatsService;
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
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (player_stats_data_1_1) {
                player_stats_data_1 = player_stats_data_1_1;
            }],
        execute: function() {
            PlayerStatsService = (function () {
                function PlayerStatsService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                PlayerStatsService.prototype.getLinkToPage = function (teamId, teamName) {
                    return ["Player-stats-page", {
                            teamId: teamId,
                            teamName: global_functions_1.GlobalFunctions.toLowerKebab(teamName)
                        }];
                };
                PlayerStatsService.prototype.getModuleTitle = function (teamName) {
                    return "Player Stats - " + teamName;
                };
                PlayerStatsService.prototype.getPageTitle = function (teamName) {
                    return teamName ? "Player Stats - " + teamName : "Player Stats";
                };
                PlayerStatsService.prototype.loadAllTabsForModule = function (teamId, teamName, isTeamProfilePage) {
                    return {
                        moduleTitle: this.getModuleTitle(teamName),
                        pageRouterLink: this.getLinkToPage(teamId, teamName),
                        tabs: this.initializeAllTabs(teamName, isTeamProfilePage)
                    };
                };
                PlayerStatsService.prototype.getStatsTabData = function (tabData, pageParams, tabDataLoaded, maxRows) {
                    var _this = this;
                    if (!tabData || tabData.length <= 1) {
                        console.log("Error getting stats data - invalid tabData object");
                        return;
                    }
                    var standingsTab = tabData[0];
                    var seasonId = tabData[1];
                    if (!seasonId && standingsTab.seasonIds.length > 0) {
                        seasonId = standingsTab.seasonIds[0].key;
                    }
                    var hasData = false;
                    if (standingsTab) {
                        var table = standingsTab.seasonTableData[seasonId];
                        if (table) {
                            standingsTab.isLoaded = true;
                            standingsTab.tableData = table;
                            return;
                        }
                    }
                    standingsTab.isLoaded = false;
                    standingsTab.hasError = false;
                    standingsTab.tableData = null;
                    var tabName = standingsTab.isPitcherTable ? "pitchers" : "batters";
                    var url = this._apiUrl + "/team/seasonStats/" + pageParams.teamId + "/" + tabName + "/" + seasonId;
                    // console.log("url: " + url);
                    this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return _this.setupTableData(standingsTab, pageParams, data.data, maxRows); })
                        .subscribe(function (data) {
                        standingsTab.isLoaded = true;
                        standingsTab.hasError = false;
                        standingsTab.seasonTableData[seasonId] = data;
                        standingsTab.tableData = data;
                        tabDataLoaded(data);
                    }, function (err) {
                        standingsTab.isLoaded = true;
                        standingsTab.hasError = true;
                        console.log("Error getting player stats data");
                    });
                    ;
                };
                PlayerStatsService.prototype.initializeAllTabs = function (teamName, isTeamProfilePage) {
                    var tabs = [];
                    tabs.push(new player_stats_data_1.MLBPlayerStatsTableData(teamName, "Batting", false, true, isTeamProfilePage)); //isPitcher = false, isActive = true
                    tabs.push(new player_stats_data_1.MLBPlayerStatsTableData(teamName, "Pitching", true, false, isTeamProfilePage)); //isPitcher = true, isActive = false
                    return tabs;
                };
                PlayerStatsService.prototype.setupTableData = function (standingsTab, pageParams, data, maxRows) {
                    var table = new player_stats_data_1.MLBPlayerStatsTableModel(data, standingsTab.isPitcherTable);
                    //Limit to maxRows, if necessary
                    if (maxRows !== undefined) {
                        table.rows = table.rows.slice(0, maxRows);
                    }
                    //Set display values
                    table.rows.forEach(function (value, index) {
                        value.displayDate = global_functions_1.GlobalFunctions.formatUpdatedDate(value.lastUpdate, false);
                        value.fullPlayerImageUrl = global_settings_1.GlobalSettings.getImageUrl(value.playerHeadshot);
                        value.fullTeamImageUrl = global_settings_1.GlobalSettings.getImageUrl(value.teamLogo);
                        if (value.backgroundImage) {
                            value.fullBackgroundImageUrl = global_settings_1.GlobalSettings.getBackgroundImageUrl(value.backgroundImage);
                        }
                        //force these fields to numbers:
                        value.batAverage = value.batAverage != null ? Number(value.batAverage) : null;
                        value.batSluggingPercentage = value.batSluggingPercentage != null ? Number(value.batSluggingPercentage) : null;
                        value.batOnBasePercentage = value.batOnBasePercentage != null ? Number(value.batOnBasePercentage) : null;
                        value.pitchEra = value.pitchEra != null ? Number(value.pitchEra) : null;
                        value.whip = value.whip != null ? Number(value.whip) : null;
                    });
                    return table;
                };
                PlayerStatsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], PlayerStatsService);
                return PlayerStatsService;
            }());
            exports_1("PlayerStatsService", PlayerStatsService);
        }
    }
});
