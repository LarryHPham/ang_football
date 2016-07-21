System.register(['@angular/core', '@angular/http', '../global/global-interface', '../global/mlb-global-functions', '../global/global-functions', './standings.data', '../global/global-settings'], function(exports_1, context_1) {
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
    var core_1, http_1, global_interface_1, mlb_global_functions_1, global_functions_1, standings_data_1, global_settings_1;
    var StandingsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (global_interface_1_1) {
                global_interface_1 = global_interface_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (standings_data_1_1) {
                standings_data_1 = standings_data_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            StandingsService = (function () {
                function StandingsService(http, _mlbFunctions) {
                    this.http = http;
                    this._mlbFunctions = _mlbFunctions;
                }
                StandingsService.prototype.getLinkToPage = function (pageParams, teamName) {
                    var pageName = "Standings-page";
                    var pageValues = {};
                    if (pageParams.teamId && teamName) {
                        pageValues["teamId"] = pageParams.teamId;
                        pageValues["teamName"] = global_functions_1.GlobalFunctions.toLowerKebab(teamName);
                        pageValues["type"] = "team";
                        pageName += "-team";
                    }
                    else if (pageParams.conference != null) {
                        pageValues["type"] = global_interface_1.Conference[pageParams.conference];
                        pageName += "-league";
                    }
                    return [pageName, pageValues];
                };
                StandingsService.prototype.getModuleTitle = function (pageParams, teamName) {
                    var groupName = this.formatGroupName(pageParams.conference, pageParams.division);
                    var moduletitle = groupName + " Standings";
                    if (teamName) {
                        moduletitle += " - " + teamName;
                    }
                    return moduletitle;
                };
                StandingsService.prototype.getPageTitle = function (pageParams, teamName) {
                    var groupName = this.formatGroupName(pageParams.conference, pageParams.division);
                    var pageTitle = "MLB Standings Breakdown";
                    if (teamName) {
                        pageTitle = "MLB Standings - " + teamName;
                    }
                    return pageTitle;
                };
                StandingsService.prototype.loadAllTabsForModule = function (pageParams, currentTeamId, currentTeamName) {
                    return {
                        moduleTitle: this.getModuleTitle(pageParams, currentTeamName),
                        pageRouterLink: this.getLinkToPage(pageParams, currentTeamName),
                        tabs: this.initializeAllTabs(pageParams, currentTeamId ? currentTeamId.toString() : null)
                    };
                };
                StandingsService.prototype.initializeAllTabs = function (pageParams, currentTeamId) {
                    var tabs = [];
                    if (pageParams.conference === undefined || pageParams.conference === null) {
                        //Is an MLB page: show MLB, then American, then National
                        tabs.push(this.createTab(true, currentTeamId));
                        tabs.push(this.createTab(false, currentTeamId, global_interface_1.Conference.american));
                        tabs.push(this.createTab(false, currentTeamId, global_interface_1.Conference.national));
                    }
                    else if (pageParams.division === undefined || pageParams.division === null) {
                        //Is a League page: show All Divisions, then American, then National
                        tabs.push(this.createTab(false, currentTeamId));
                        tabs.push(this.createTab(pageParams.conference === global_interface_1.Conference.american, currentTeamId, global_interface_1.Conference.american));
                        tabs.push(this.createTab(pageParams.conference === global_interface_1.Conference.national, currentTeamId, global_interface_1.Conference.national));
                    }
                    else {
                        //Is a Team page: show team's division, then team's league, then MLB
                        tabs.push(this.createTab(true, currentTeamId, pageParams.conference, pageParams.division));
                        tabs.push(this.createTab(false, currentTeamId, pageParams.conference));
                        tabs.push(this.createTab(false, currentTeamId));
                    }
                    return tabs;
                };
                StandingsService.prototype.getStandingsTabData = function (tabData, pageParams, onTabsLoaded, maxRows) {
                    var _this = this;
                    if (!tabData || tabData.length < 2) {
                        throw new Error("Invalid tabData for standings");
                    }
                    var standingsTab = tabData[0];
                    var selectedKey = tabData[1];
                    if (selectedKey == null) {
                        selectedKey = pageParams.teamId;
                    }
                    if (standingsTab && (!standingsTab.sections || standingsTab.sections.length == 0)) {
                        var url = global_settings_1.GlobalSettings.getApiUrl() + "/standings";
                        if (standingsTab.conference !== undefined) {
                            url += "/" + global_interface_1.Conference[standingsTab.conference];
                        }
                        standingsTab.isLoaded = false;
                        standingsTab.hasError = false;
                        this.http.get(url)
                            .map(function (res) { return res.json(); })
                            .map(function (data) { return _this.setupTabData(standingsTab, data.data, maxRows); })
                            .subscribe(function (data) {
                            standingsTab.isLoaded = true;
                            standingsTab.hasError = false;
                            standingsTab.sections = data;
                            if (selectedKey) {
                                standingsTab.setSelectedKey(selectedKey);
                            }
                            onTabsLoaded(data);
                        }, function (err) {
                            standingsTab.isLoaded = true;
                            standingsTab.hasError = true;
                            console.log("Error getting standings data");
                        });
                    }
                };
                StandingsService.prototype.createTab = function (selectTab, teamId, conference, division) {
                    var title = this.formatGroupName(conference, division) + " Standings";
                    return new standings_data_1.MLBStandingsTabData(title, conference, division, selectTab, teamId);
                };
                StandingsService.prototype.setupTabData = function (standingsTab, apiData, maxRows) {
                    var sections = [];
                    var totalRows = 0;
                    if (standingsTab.conference !== null && standingsTab.conference !== undefined &&
                        standingsTab.division !== null && standingsTab.division !== undefined) {
                        //get only the single division
                        var conferenceKey = global_interface_1.Conference[standingsTab.conference];
                        var divisionKey = global_interface_1.Division[standingsTab.division];
                        var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
                        sections.push(this.setupTableData(standingsTab.currentTeamId, standingsTab.conference, standingsTab.division, divData, maxRows, false));
                    }
                    else {
                        //other load all provided divisions
                        for (var conferenceKey in apiData) {
                            for (var divisionKey in apiData[conferenceKey]) {
                                var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
                                var table = this.setupTableData(standingsTab.currentTeamId, global_interface_1.Conference[conferenceKey], global_interface_1.Division[divisionKey], divData, maxRows, true);
                                totalRows += table.tableData.rows.length;
                                if (maxRows && totalRows > maxRows) {
                                    break; //don't add more divisions
                                }
                                sections.push(table);
                            }
                            if (maxRows && totalRows > maxRows) {
                                break; //don't add more conferences
                            }
                        }
                    }
                    return sections;
                };
                StandingsService.prototype.setupTableData = function (teamId, conference, division, rows, maxRows, includeTableName) {
                    var groupName = this.formatGroupName(conference, division);
                    //Limit to maxRows, if necessary
                    if (maxRows !== undefined) {
                        rows = rows.slice(0, maxRows);
                    }
                    //Set display values
                    rows.forEach(function (value, index) {
                        value.groupName = groupName;
                        value.displayDate = global_functions_1.GlobalFunctions.formatUpdatedDate(value.lastUpdated, false);
                        value.fullImageUrl = global_settings_1.GlobalSettings.getImageUrl(value.imageUrl);
                        value.fullBackgroundImageUrl = global_settings_1.GlobalSettings.getBackgroundImageUrl(value.backgroundImage);
                        //Make sure numbers are numbers.
                        value.totalWins = Number(value.totalWins);
                        value.totalLosses = Number(value.totalLosses);
                        value.winPercentage = Number(value.winPercentage);
                        value.gamesBack = Number(value.gamesBack);
                        value.streakCount = Number(value.streakCount);
                        value.batRunsScored = Number(value.batRunsScored);
                        value.pitchRunsAllowed = Number(value.pitchRunsAllowed);
                    });
                    var tableName = this.formatGroupName(conference, division, true);
                    var table = new standings_data_1.MLBStandingsTableModel(rows, teamId);
                    return new standings_data_1.MLBStandingsTableData(includeTableName ? tableName : "", conference, division, table);
                };
                /**
                 * - Returns the group/league name based on the given conference and division values
                 *
                 * @example
                 * // "American League"
                 * formatGroupName(Conference.american)
                 *
                 * @example
                 * // "MLB"
                 * formatGroupName()
                 *
                 * @example
                 * // "American League East"
                 * formatGroupName(Conference.american, Division.east)
                 *
                 * @param {Conference} conference - (Optional)
                 *                                - Expected if {division} is included.
                 * @param {Division} division - (Optional)
                 * @returns {string}
                 *
                 */
                StandingsService.prototype.formatGroupName = function (conference, division, makeDivisionBold) {
                    if (conference !== undefined && conference !== null) {
                        var leagueName = global_functions_1.GlobalFunctions.toTitleCase(global_interface_1.Conference[conference]) + " League";
                        if (division !== undefined && division !== null) {
                            var divisionName = global_functions_1.GlobalFunctions.toTitleCase(global_interface_1.Division[division]);
                            return leagueName + " " + (makeDivisionBold ? "<span class='text-heavy'>" + divisionName + "</span>" : divisionName);
                        }
                        else {
                            return leagueName;
                        }
                    }
                    else {
                        return "MLB";
                    }
                };
                StandingsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, mlb_global_functions_1.MLBGlobalFunctions])
                ], StandingsService);
                return StandingsService;
            }());
            exports_1("StandingsService", StandingsService);
        }
    }
});
