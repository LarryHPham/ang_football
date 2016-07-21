System.register(['@angular/core', '@angular/http', "../global/global-functions", "../global/global-settings"], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, global_settings_1;
    var DailyUpdateService;
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
            }],
        execute: function() {
            DailyUpdateService = (function () {
                function DailyUpdateService(http) {
                    this.http = http;
                }
                DailyUpdateService.prototype.getErrorData = function () {
                    return {
                        hasError: true,
                        type: "",
                        wrapperStyle: {},
                        lastUpdateDate: "",
                        chart: null,
                        fullBackgroundImageUrl: "",
                        seasonStats: []
                    };
                };
                DailyUpdateService.prototype.getTeamDailyUpdate = function (teamId) {
                    var _this = this;
                    //http://dev-homerunloyal-api.synapsys.us/team/dailyUpdate/2800
                    var url = global_settings_1.GlobalSettings.getApiUrl() + '/team/dailyUpdate/' + teamId;
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return _this.formatTeamData(data.data, teamId); });
                };
                DailyUpdateService.prototype.formatTeamData = function (data, teamId) {
                    if (!data) {
                        throw new Error("Error! Data is null from Team Daily Update API");
                    }
                    //Setting up season stats
                    var stats = [];
                    if (data.seasonStats && data.seasonStats.length > 0) {
                        var apiSeasonStats = data.seasonStats[0];
                        var record = "N/A";
                        if (apiSeasonStats.totalWins != null && apiSeasonStats.totalLosses != null) {
                            record = apiSeasonStats.totalWins + "-" + apiSeasonStats.totalLosses;
                        }
                        stats = [
                            {
                                name: "Win Loss Record",
                                value: record,
                                icon: "fa-trophy"
                            },
                            {
                                name: "Hits",
                                value: apiSeasonStats.batHits != null ? apiSeasonStats.batHits : "N/A",
                                icon: "fa-batt-and-ball" //TODO: use 'baseball and bat' icon
                            },
                            {
                                name: "Earned Runs Average",
                                value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) : "N/A",
                                icon: "fa-batter" //TODO: use 'batter swinging' icon
                            },
                            {
                                name: "Runs Batted In",
                                value: apiSeasonStats.batRbi != null ? Number(apiSeasonStats.batRbi) : "N/A",
                                icon: "fa-batter-alt" //TODO: get 'batter standing' icon
                            }
                        ];
                    }
                    //Setting up chart info
                    var seriesOne = {
                        name: "Runs For",
                        key: "teamRuns"
                    };
                    var seriesTwo = {
                        name: "Runs Against",
                        key: "opponentRuns"
                    };
                    var chart = this.getChart(data, seriesOne, seriesTwo);
                    this.getPostGameArticle(data);
                    if (chart) {
                        return {
                            hasError: false,
                            lastUpdateDate: data.lastUpdated ? global_functions_1.GlobalFunctions.formatUpdatedDate(data.lastUpdated) : "",
                            fullBackgroundImageUrl: global_settings_1.GlobalSettings.getBackgroundImageUrl(data.backgroundImage),
                            type: "Team",
                            wrapperStyle: {},
                            seasonStats: stats,
                            chart: chart,
                            postGameArticle: this.postGameArticleData
                        };
                    }
                    else {
                        return null;
                    }
                };
                DailyUpdateService.prototype.getPlayerDailyUpdate = function (playerId) {
                    var _this = this;
                    //http://dev-homerunloyal-api.synapsys.us/player/dailyUpdate/2800
                    var url = global_settings_1.GlobalSettings.getApiUrl() + '/player/dailyUpdate/' + playerId;
                    // console.log("getting daily update for player " + playerId + ": " + url);
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return _this.formatPlayerData(data.data, playerId); });
                };
                DailyUpdateService.prototype.formatPlayerData = function (data, playerId) {
                    if (!data) {
                        throw new Error("Error! Data is null from Player Daily Update API");
                    }
                    //Setting up season stats
                    var stats = [];
                    if (data.seasonStats && data.seasonStats.length > 0) {
                        var apiSeasonStats = data.seasonStats[0];
                        stats = data.pitcher ? this.getPitcherStats(apiSeasonStats) : this.getBatterStats(apiSeasonStats);
                    }
                    //Setting up chart info
                    var seriesOne;
                    var seriesTwo;
                    if (data.pitcher) {
                        seriesOne = {
                            name: "Earned Runs",
                            key: "pitchEarnedRuns"
                        };
                        seriesTwo = {
                            name: "Hits",
                            key: "pitchHits"
                        };
                    }
                    else {
                        seriesOne = {
                            name: "Runs",
                            key: "batRunsScored"
                        };
                        seriesTwo = {
                            name: "Hits",
                            key: "batHits"
                        };
                    }
                    var chart = this.getChart(data, seriesOne, seriesTwo);
                    this.getPostGameArticle(data);
                    if (this.postGameArticleData.text && this.postGameArticleData.text.length > 0) {
                        var tempText = this.postGameArticleData.text.join(" ");
                        this.postGameArticleData.text = [tempText];
                    }
                    if (chart) {
                        return {
                            hasError: false,
                            lastUpdateDate: data.lastUpdated ? global_functions_1.GlobalFunctions.formatUpdatedDate(data.lastUpdated) : "",
                            fullBackgroundImageUrl: global_settings_1.GlobalSettings.getBackgroundImageUrl(data.backgroundImage),
                            type: "Player",
                            wrapperStyle: { 'padding-bottom': '10px' },
                            seasonStats: stats,
                            chart: chart,
                            postGameArticle: this.postGameArticleData
                        };
                    }
                    else {
                        return null;
                    }
                };
                DailyUpdateService.prototype.getPitcherStats = function (apiSeasonStats) {
                    var record = "N/A";
                    if (apiSeasonStats.pitchWins != null && apiSeasonStats.pitchLosses != null) {
                        record = apiSeasonStats.pitchWins + "-" + apiSeasonStats.pitchLosses;
                    }
                    return [
                        {
                            name: "Win Loss Record",
                            value: record,
                            icon: "fa-trophy"
                        },
                        {
                            name: "Innings Pitched",
                            value: apiSeasonStats.pitchInningsPitched != null ? apiSeasonStats.pitchInningsPitched : "N/A",
                            icon: "fa-baseball-diamond" //TODO: get 'baseball field' icon
                        },
                        {
                            name: "Strike Outs",
                            value: apiSeasonStats.pitchStrikeouts != null ? apiSeasonStats.pitchStrikeouts : "N/A",
                            icon: "fa-baseball-crest" //TODO: get '2 baseball bats' icon
                        },
                        {
                            name: "Earned Runs Average",
                            value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) : "N/A",
                            icon: "fa-batter" //TODO: use 'batter swinging' icon
                        }
                    ];
                };
                DailyUpdateService.prototype.getBatterStats = function (apiSeasonStats) {
                    var batOnBasePercentage = "N/A";
                    if (apiSeasonStats.batOnBasePercentage != null) {
                        var value = Number(apiSeasonStats.batOnBasePercentage) * 100;
                        batOnBasePercentage = value.toFixed(0) + "%";
                    }
                    var batAverage = "N/A";
                    if (apiSeasonStats.batOnBasePercentage != null) {
                        var value = Number(apiSeasonStats.batAverage) * 100;
                        batAverage = value.toFixed(0) + "%";
                    }
                    return [
                        {
                            name: "Home Runs",
                            value: apiSeasonStats.batHomeRuns != null ? apiSeasonStats.batHomeRuns : "N/A",
                            icon: "fa-base-lg" //TODO: get 'homeplate' icon
                        },
                        {
                            name: "Batting Average",
                            value: batAverage,
                            icon: "fa-batt-and-ball" //TODO: get 'baseball and bat' icon
                        },
                        {
                            name: "Runs Batted In",
                            value: apiSeasonStats.batRbi != null ? apiSeasonStats.batRbi : "N/A",
                            icon: "fa-batter-alt" //TODO: get 'batter standing' icon
                        },
                        {
                            name: "On Base Percentage",
                            value: batOnBasePercentage,
                            icon: "fa-percentage-alt"
                        }
                    ];
                };
                DailyUpdateService.prototype.getPostGameArticle = function (data) {
                    var articleData = {};
                    articleData['eventId'] = data.recentGames[0].eventId != null ? data.recentGames[0].eventId : null;
                    articleData['teamId'] = data.recentGames[0].teamId != null ? data.recentGames[0].teamId : null;
                    articleData['url'] = articleData['eventId'] != null ? ['Article-pages', { eventType: 'postgame-report', eventID: articleData['eventId'] }] : ['Error-page'];
                    articleData['pubDate'] = data['postgame-report'].dateline != null ? data['postgame-report'].dateline : null;
                    articleData['headline'] = data['postgame-report'].displayHeadline != null ? data['postgame-report'].displayHeadline : null;
                    articleData['text'] = data['postgame-report'].article != null && data['postgame-report'].article.length > 0 ? data['postgame-report'].article : null;
                    articleData['img'] = data['postgame-report'].images != null && data['postgame-report'].images[articleData['teamId']] != null && data['postgame-report'].images[articleData['teamId']].length > 0 ? data['postgame-report'].images[articleData['teamId']][0] : null;
                    this.postGameArticleData = articleData;
                };
                DailyUpdateService.prototype.getChart = function (data, seriesOne, seriesTwo) {
                    if (data.recentGames && data.recentGames.length > 0) {
                        var chart = {
                            categories: [],
                            dataSeries: [{
                                    name: seriesOne.name,
                                    values: []
                                },
                                {
                                    name: seriesTwo.name,
                                    values: []
                                }]
                        };
                        data.recentGames.forEach(function (item, index) {
                            chart.categories.push("vs " + item.opponentTeamName); //TODO: Should this link to the team?
                            chart.dataSeries[0].values.push(item[seriesOne.key] != null ? Number(item[seriesOne.key]) : null);
                            chart.dataSeries[1].values.push(item[seriesTwo.key] != null ? Number(item[seriesTwo.key]) : null);
                        });
                        return chart;
                    }
                    else {
                        return null;
                    }
                };
                DailyUpdateService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], DailyUpdateService);
                return DailyUpdateService;
            }());
            exports_1("DailyUpdateService", DailyUpdateService);
        }
    }
});
