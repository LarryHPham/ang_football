System.register(['../components/custom-table/table-data.component', '../components/carousels/slider-carousel/slider-carousel.component', '../global/mlb-global-functions', '../global/global-functions', '../global/global-settings'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var table_data_component_1, slider_carousel_component_1, mlb_global_functions_1, global_functions_1, global_settings_1;
    var MLBSeasonStatsTableData, MLBSeasonStatsTabData, MLBSeasonStatsTableModel;
    return {
        setters:[
            function (table_data_component_1_1) {
                table_data_component_1 = table_data_component_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            MLBSeasonStatsTableData = (function () {
                function MLBSeasonStatsTableData(title, season, year, table) {
                    this.groupName = title;
                    this.season = season;
                    this.year = year;
                    this.tableData = table;
                }
                return MLBSeasonStatsTableData;
            }());
            exports_1("MLBSeasonStatsTableData", MLBSeasonStatsTableData);
            MLBSeasonStatsTabData = (function () {
                function MLBSeasonStatsTabData(title, tabName, season, year, isActive) {
                    this.title = title;
                    this.tabName = tabName;
                    this.season = season;
                    this.year = year;
                    this.isActive = isActive;
                }
                MLBSeasonStatsTabData.prototype.convertToCarouselItem = function (item, index) {
                    var playerData = item.playerInfo != null ? item.playerInfo : null;
                    var playerRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(playerData.teamName, playerData.playerName, playerData.playerId.toString());
                    var playerRouteText = {
                        route: playerRoute,
                        text: playerData.playerName
                    };
                    var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(playerData.teamName, playerData.teamId);
                    var teamRouteText = {
                        route: teamRoute,
                        text: playerData.teamName,
                        class: 'text-heavy'
                    };
                    return slider_carousel_component_1.SliderCarousel.convertToCarouselItemType1(index, {
                        backgroundImage: global_settings_1.GlobalSettings.getBackgroundImageUrl(playerData.liveImage),
                        copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                        subheader: [item.seasonId + " Season Stats Report"],
                        profileNameLink: playerRouteText,
                        description: ["Team: ", teamRouteText],
                        lastUpdatedDate: global_functions_1.GlobalFunctions.formatUpdatedDate(playerData.lastUpdate),
                        circleImageUrl: global_settings_1.GlobalSettings.getImageUrl(playerData.playerHeadshot),
                        circleImageRoute: playerRoute
                    });
                };
                return MLBSeasonStatsTabData;
            }());
            exports_1("MLBSeasonStatsTabData", MLBSeasonStatsTabData);
            MLBSeasonStatsTableModel = (function () {
                function MLBSeasonStatsTableModel(rows, isPitcher) {
                    this.selectedKey = "";
                    this.rows = rows;
                    if (this.rows === undefined || this.rows === null) {
                        this.rows = [];
                    }
                    else if (rows.length > 0) {
                    }
                    isPitcher = this.rows[0]['playerInfo'].position[0].charAt(0) == "P" ? true : false;
                    this.isPitcher = isPitcher;
                    if (this.isPitcher) {
                        this.columns = [{
                                headerValue: "Year",
                                columnClass: "date-column",
                                isNumericType: true,
                                sortDirection: 1,
                                key: "year"
                            }, {
                                headerValue: "Team",
                                columnClass: "image-column",
                                isNumericType: false,
                                key: "team"
                            }, {
                                headerValue: "W/L",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "wl"
                            }, {
                                headerValue: "IP",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "ip"
                            }, {
                                headerValue: "SO",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "so"
                            }, {
                                headerValue: "ERA",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "era"
                            }, {
                                headerValue: "H",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "ph"
                            }, {
                                headerValue: "ER",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "er"
                            }, {
                                headerValue: "BB",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "pbb"
                            }, {
                                headerValue: "WHIP",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "whip"
                            }];
                    }
                    else {
                        this.columns = [{
                                headerValue: "Year",
                                columnClass: "date-column",
                                isNumericType: true,
                                key: "year"
                            }, {
                                headerValue: "Team",
                                columnClass: "image-column",
                                isNumericType: false,
                                key: "team"
                            }, {
                                headerValue: "R",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "r"
                            }, {
                                headerValue: "H",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "h"
                            }, {
                                headerValue: "HR",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "hr"
                            }, {
                                headerValue: "RBI",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "rbi"
                            }, {
                                headerValue: "BB",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "bb"
                            }, {
                                headerValue: "AVG",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "avg"
                            }, {
                                headerValue: "OBP",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "obp"
                            }, {
                                headerValue: "SLG",
                                columnClass: "data-column",
                                isNumericType: true,
                                key: "slg"
                            }];
                    }
                    ;
                }
                MLBSeasonStatsTableModel.prototype.setSelectedKey = function (key) {
                    this.selectedKey = key;
                };
                MLBSeasonStatsTableModel.prototype.getSelectedKey = function () {
                    return this.selectedKey;
                };
                MLBSeasonStatsTableModel.prototype.setRowSelected = function (rowIndex) {
                    if (rowIndex >= 0 && rowIndex < this.rows.length) {
                        this.selectedKey = this.rows[rowIndex].playerInfo.playerId;
                    }
                    else {
                        this.selectedKey = null;
                    }
                };
                MLBSeasonStatsTableModel.prototype.isRowSelected = function (item, rowIndex) {
                    return null;
                };
                MLBSeasonStatsTableModel.prototype.getCellData = function (item, column) {
                    var display = "";
                    var sort = null;
                    var link = undefined;
                    var isTotalColumn = item['sectionStat'] != null;
                    switch (column.key) {
                        case "year":
                            display = item.seasonId;
                            sort = item.seasonId;
                            break;
                        case "team":
                            if (isTotalColumn) {
                                display = (item['sectionStat'] == "Average" ? "Total Average" : "Total").toUpperCase() + ":";
                            }
                            else {
                                display = item.teamInfo.teamName;
                                link = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(item.teamInfo.teamName, item.teamInfo.teamId);
                            }
                            sort = item.teamInfo.teamName;
                            break;
                        case "wl":
                            display = item.pitchWins != null && Number(item.pitchLosses) != null ? Number(item.pitchWins).toFixed(0) + "/" + Number(item.pitchLosses).toFixed(0) : null;
                            var wins = item.pitchWins + "";
                            var losses = item.pitchLosses + "";
                            sort = ('00000' + wins).substr(wins.length) + "/" + ('00000' + losses).substr(losses.length); //pad with zeros
                            break;
                        case "ip":
                            display = item.pitchInningsPitched != null ? Number(item.pitchInningsPitched).toFixed(1) : null;
                            sort = item.pitchInningsPitched;
                            break;
                        case "so":
                            display = item.pitchStrikeouts != null ? Number(item.pitchStrikeouts).toFixed(0) : null;
                            sort = item.pitchStrikeouts;
                            break;
                        case "era":
                            display = item.pitchEra != null ? Number(item.pitchEra).toFixed(2) : null;
                            sort = item.pitchEra;
                            break;
                        case "ph":
                            display = item.pitchHits != null ? Number(item.pitchHits).toFixed(0) : null;
                            sort = item.pitchHits;
                            break;
                        case "er":
                            display = item.pitchEarnedRuns != null ? Number(item.pitchEarnedRuns).toFixed(0) : null;
                            sort = item.pitchEarnedRuns;
                            break;
                        case "pbb":
                            display = item.pitchBasesOnBalls != null ? Number(item.pitchBasesOnBalls).toFixed(0) : null;
                            sort = item.pitchBasesOnBalls;
                            break;
                        case "whip":
                            display = item.pitchWhip != null ? Number(item.pitchWhip).toFixed(2) : null;
                            sort = item.pitchWhip;
                            break;
                        case "r":
                            display = item.batHomeRuns != null ? Number(item.batHomeRuns).toFixed(2) : null;
                            sort = item.batHomeRuns;
                            break;
                        case "h":
                            display = item.batHits != null ? Number(item.batHits).toFixed(2) : null;
                            sort = item.batHits;
                            break;
                        case "hr":
                            display = item.batHomeRuns != null ? Number(item.batHomeRuns).toFixed(2) : null;
                            sort = item.batHomeRuns;
                            break;
                        case "rbi":
                            display = item.batRbi != null ? Number(item.batRbi).toFixed(2) : null;
                            sort = item.batRbi;
                            break;
                        case "bb":
                            display = item.batBasesOnBalls != null ? Number(item.batBasesOnBalls).toFixed(0) : null;
                            sort = item.batBasesOnBalls;
                            break;
                        case "avg":
                            display = item.batAverage != null ? Number(item.batAverage).toFixed(2) : null;
                            sort = item.batAverage;
                            break;
                        case "obp":
                            display = item.batOnBasePercentage != null ? Number(item.batOnBasePercentage).toFixed(2) : null;
                            sort = item.batOnBasePercentage;
                            break;
                        case "slg":
                            display = item.batSluggingPercentage != null ? Number(item.batSluggingPercentage).toFixed(2) : null;
                            sort = item.batSluggingPercentage;
                            break;
                    }
                    display = display != null ? display : "N/A";
                    if (isTotalColumn) {
                        sort = null; // don't sort total column
                    }
                    return new table_data_component_1.CellData(display, sort, link);
                };
                return MLBSeasonStatsTableModel;
            }());
            exports_1("MLBSeasonStatsTableModel", MLBSeasonStatsTableModel);
        }
    }
});
