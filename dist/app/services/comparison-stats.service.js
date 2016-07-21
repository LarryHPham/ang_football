System.register(['@angular/core', '@angular/http', '../global/global-settings', '../global/global-gradient', './season-stats.service'], function(exports_1, context_1) {
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
    var core_1, http_1, global_settings_1, global_gradient_1, season_stats_service_1;
    var SeasonStats, MLBComparisonModuleData, ComparisonStatsService;
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
            function (global_gradient_1_1) {
                global_gradient_1 = global_gradient_1_1;
            },
            function (season_stats_service_1_1) {
                season_stats_service_1 = season_stats_service_1_1;
            }],
        execute: function() {
            SeasonStats = (function () {
                function SeasonStats() {
                }
                return SeasonStats;
            }());
            exports_1("SeasonStats", SeasonStats);
            MLBComparisonModuleData = (function () {
                function MLBComparisonModuleData(_service) {
                    this._service = _service;
                }
                MLBComparisonModuleData.prototype.loadTeamList = function (listLoaded) {
                    var _this = this;
                    if (this.teamList == null) {
                        throw new Error("teamList has not been initialized");
                    }
                    // there will be at most two teams in the list on inital load,
                    // so the list should only be reloaded if there are two or fewer
                    // teams in the list
                    if (!this.teamList || this.teamList.length <= 2) {
                        this._service.getTeamList().subscribe(function (data) {
                            _this.teamList = data;
                            listLoaded(_this.teamList);
                        }, function (err) {
                            console.log("Error loading team list for comparison module", err);
                        });
                    }
                    else {
                        listLoaded(this.teamList);
                    }
                };
                MLBComparisonModuleData.prototype.loadPlayerList = function (index, newTeamId, listLoaded) {
                    if (this.playerLists == null || this.playerLists.length < 2) {
                        throw new Error("playerLists has not been initialized or does not have enough items");
                    }
                    if (index > 2) {
                        index = index % 2;
                    }
                    var teamData = this.playerLists[index];
                    if (newTeamId != teamData.teamId || !teamData.playerList || teamData.playerList.length <= 1) {
                        teamData.teamId = newTeamId;
                        teamData.playerList = [];
                        this._service.getPlayerList(newTeamId).subscribe(function (data) {
                            teamData.playerList = data;
                            //TODO - widen dropdown to
                            // teamData.playerList[1].value += "Something longer than ever";
                            listLoaded(teamData.playerList);
                        }, function (err) {
                            console.log("Error loading player list for " + newTeamId + " for the comparison module", err);
                        });
                    }
                    else {
                        listLoaded(teamData.playerList);
                    }
                };
                MLBComparisonModuleData.prototype.loadPlayer = function (index, teamId, playerId, statsLoaded) {
                    if (index > 2) {
                        index = index % 2;
                    }
                    this._service.getSinglePlayerStats(index, this.data, teamId, playerId).subscribe(function (bars) {
                        statsLoaded(bars);
                    }, function (err) {
                        console.log("Error loading player comparison stats", err);
                    });
                };
                return MLBComparisonModuleData;
            }());
            exports_1("MLBComparisonModuleData", MLBComparisonModuleData);
            ComparisonStatsService = (function () {
                function ComparisonStatsService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                    this.pitchingFields = [
                        "pitchWins",
                        "pitchInningsPitched",
                        "pitchStrikeouts",
                        "pitchEra",
                        // "pitchSaves",
                        "pitchHits",
                        "pitchEarnedRuns",
                        "pitchHomeRunsAllowed",
                        "pitchBasesOnBalls"
                    ];
                    this.battingFields = [
                        "batHomeRuns", "batAverage", "batRbi",
                        "batHits", "batBasesOnBalls", "batOnBasePercentage",
                        "batDoubles", "batTriples"
                    ];
                }
                ComparisonStatsService.prototype.getInitialPlayerStats = function (pageParams) {
                    var _this = this;
                    var teamId = pageParams.teamId != null ? pageParams.teamId.toString() : null;
                    var playerId = pageParams.playerId != null ? pageParams.playerId.toString() : null;
                    return this.callPlayerComparisonAPI(teamId, playerId, function (data) {
                        if (data == null) {
                            console.log("Error: No valid comparison data for " + (pageParams.playerId != null ? " player " + playerId + " in " : "") + " team " + teamId);
                            return null;
                        }
                        data.playerOne.statistics = _this.formatPlayerData(data.playerOne.playerId, data.data);
                        data.playerTwo.statistics = _this.formatPlayerData(data.playerTwo.playerId, data.data);
                        data.bestStatistics = _this.formatPlayerData("statHigh", data.data);
                        data.worstStatistics = _this.formatPlayerData("statLow", data.data);
                        data.bars = _this.createComparisonBars(data);
                        var team1Data = {
                            teamId: data.playerOne.teamId,
                            playerList: [{ key: data.playerOne.playerId, value: data.playerOne.playerName }]
                        };
                        var team2Data = {
                            teamId: data.playerTwo.teamId,
                            playerList: [{ key: data.playerTwo.playerId, value: data.playerTwo.playerName }]
                        };
                        var moduleData = new MLBComparisonModuleData(_this);
                        moduleData.data = data;
                        moduleData.teamList = [
                            { key: data.playerOne.teamId, value: data.playerOne.teamName },
                            { key: data.playerTwo.teamId, value: data.playerTwo.teamName }
                        ];
                        moduleData.playerLists = [
                            team1Data,
                            team2Data
                        ];
                        return moduleData;
                    });
                };
                ComparisonStatsService.prototype.getSinglePlayerStats = function (index, existingData, teamId, playerId) {
                    var _this = this;
                    return this.callPlayerComparisonAPI(teamId, playerId, function (apiData) {
                        apiData.playerOne.statistics = _this.formatPlayerData(apiData.playerOne.playerId, apiData.data);
                        if (index == 0) {
                            existingData.playerOne = apiData.playerOne;
                        }
                        else {
                            existingData.playerTwo = apiData.playerOne;
                        }
                        return _this.createComparisonBars(existingData);
                    });
                };
                ComparisonStatsService.prototype.getPlayerList = function (teamId) {
                    var _this = this;
                    //http://dev-homerunloyal-api.synapsys.us/team/comparisonRoster/2800
                    var playersUrl = this._apiUrl + "/team/comparisonRoster/" + teamId;
                    return this.http.get(playersUrl)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return _this.formatPlayerList(data.data);
                        ;
                    });
                };
                ComparisonStatsService.prototype.getTeamList = function () {
                    var _this = this;
                    var teamsUrl = this._apiUrl + "/team/comparisonTeamList";
                    // console.log("teams url: " + teamsUrl);
                    return this.http.get(teamsUrl)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return _this.formatTeamList(data.data);
                    });
                };
                ComparisonStatsService.prototype.callPlayerComparisonAPI = function (teamId, playerId, dataLoaded) {
                    var url = this._apiUrl + "/player/comparison/";
                    if (playerId) {
                        //http://dev-homerunloyal-api.synapsys.us/player/comparison/player/95622
                        url += "player/" + playerId;
                    }
                    else if (teamId) {
                        //http://dev-homerunloyal-api.synapsys.us/player/comparison/team/2800
                        url += "team/" + teamId;
                    }
                    else {
                        //http://dev-homerunloyal-api.synapsys.us/player/comparison/league
                        url += "league";
                    }
                    //console.log("getting player stats: " + url);
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return dataLoaded(data.data);
                    });
                };
                /*
                teamItem {
                  teamId: string;
                  teamFirstName: string;
                  teamLastName: string;
                  teamLogo: string;
                }
                */
                ComparisonStatsService.prototype.formatTeamList = function (teamList) {
                    return teamList.map(function (team) {
                        var teamName = team.teamFirstName + " " + team.teamLastName;
                        return { key: team.teamId, value: teamName };
                    });
                };
                ComparisonStatsService.prototype.formatPlayerList = function (playerList) {
                    var list = [];
                    Array.prototype.push.apply(list, this.formatPlayerPositionList("Pitchers", playerList.pitchers));
                    Array.prototype.push.apply(list, this.formatPlayerPositionList("Catchers", playerList.catchers));
                    Array.prototype.push.apply(list, this.formatPlayerPositionList("Fielders", playerList.fielders));
                    Array.prototype.push.apply(list, this.formatPlayerPositionList("Batters", playerList.batters));
                    return list;
                };
                ComparisonStatsService.prototype.formatPlayerPositionList = function (description, playerList) {
                    var dropdownList = [];
                    if (playerList && playerList.length > 0) {
                        dropdownList.push({ key: "", value: description, class: "dropdown-grp-lbl", preventSelection: true });
                        Array.prototype.push.apply(dropdownList, playerList.map(function (player) {
                            if (player.playerId)
                                return { key: player.playerId, value: player.playerName, class: "dropdown-grp-item", preventSelection: false };
                            else
                                return { key: player.player_id, value: player.player_name, class: "dropdown-grp-item" };
                        }));
                    }
                    return dropdownList;
                };
                ComparisonStatsService.prototype.formatPlayerData = function (playerId, data) {
                    var stats = {};
                    for (var seasonId in data) {
                        var seasonData = data[seasonId];
                        var seasonStats = new SeasonStats();
                        var isValidStats = false;
                        for (var key in seasonData) {
                            var value = seasonData[key];
                            if (key == "isCurrentSeason") {
                                seasonStats.isCurrentSeason = value;
                            }
                            else if (value != null) {
                                if (value["statHigh"] != null) {
                                    isValidStats = true;
                                }
                                seasonStats[key] = value[playerId] != null ? Number(value[playerId]) : null;
                            }
                            else {
                                seasonStats[key] = null;
                            }
                        }
                        if (isValidStats) {
                            stats[seasonId] = seasonStats;
                        }
                    }
                    return stats;
                };
                ComparisonStatsService.prototype.createComparisonBars = function (data) {
                    var fields = data.playerOne.position[0].charAt(0) == "P" ? this.pitchingFields : this.battingFields;
                    var colors = global_gradient_1.Gradient.getColorPair(data.playerOne.teamColors, data.playerTwo.teamColors);
                    data.playerOne.mainTeamColor = colors[0];
                    data.playerTwo.mainTeamColor = colors[1];
                    var bars = {};
                    for (var seasonId in data.bestStatistics) {
                        var bestStats = data.bestStatistics[seasonId];
                        var worstStats = data.worstStatistics[seasonId];
                        var playerOneStats = data.playerOne.statistics[seasonId];
                        var playerTwoStats = data.playerTwo.statistics[seasonId];
                        var seasonBarList = [];
                        for (var i = 0; i < fields.length; i++) {
                            var key = fields[i];
                            var title = ComparisonStatsService.getKeyDisplayTitle(key);
                            seasonBarList.push({
                                title: title,
                                data: [{
                                        value: playerOneStats != null ? this.getNumericValue(key, playerOneStats[key]) : null,
                                        // color: data.playerOne.mainTeamColor
                                        color: '#BC1624'
                                    },
                                    {
                                        value: playerTwoStats != null ? this.getNumericValue(key, playerTwoStats[key]) : null,
                                        // color: data.playerTwo.mainTeamColor,
                                        color: '#444444'
                                    }],
                                minValue: worstStats != null ? this.getNumericValue(key, worstStats[key]) : null,
                                maxValue: bestStats != null ? this.getNumericValue(key, bestStats[key]) : null,
                                qualifierLabel: season_stats_service_1.SeasonStatsService.getQualifierLabel(key)
                            });
                        }
                        bars[seasonId] = seasonBarList;
                    }
                    return bars;
                };
                ComparisonStatsService.getKeyDisplayTitle = function (key) {
                    switch (key) {
                        case "batHomeRuns": return "Home Runs";
                        case "batAverage": return "Batting Average";
                        case "batRbi": return "RBIs";
                        case "batSluggingPercentage": return "Slugging Percentage";
                        case "batHits": return "Hits";
                        case "batBasesOnBalls": return "Walks";
                        case "batOnBasePercentage": return "On Base Percentage";
                        case "batDoubles": return "Doubles";
                        case "batTriples": return "Triples";
                        case "pitchEra": return "Earned Run Average";
                        case "pitchWins": return "Wins";
                        case "pitchLosses": return "Losses";
                        case "pitchStrikeouts": return "Strikeouts";
                        case "pitchInningsPitched": return "Innings Pitched";
                        case "pitchBasesOnBalls": return "Walks Thrown";
                        case "pitchWhip": return "WHIP";
                        case "pitchSaves": return "Saves";
                        case "pitchIpa": return "IPA";
                        case "pitchHits": return "Hits Against Pitcher";
                        case "pitchEarnedRuns": return "Earned Runs Against Pitcher";
                        case "pitchHomeRunsAllowed": return "Home Runs Against Pitcher";
                        default: return null;
                    }
                };
                ComparisonStatsService.prototype.getNumericValue = function (key, value) {
                    if (value == null)
                        return null;
                    var num = Number(value);
                    switch (key) {
                        case "batAverage": return Number(num.toFixed(3));
                        case "batOnBasePercentage": return Number(num.toFixed(3));
                        case "pitchEra": return Number(num.toFixed(2));
                        default: return num;
                    }
                };
                ComparisonStatsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ComparisonStatsService);
                return ComparisonStatsService;
            }());
            exports_1("ComparisonStatsService", ComparisonStatsService);
        }
    }
});
