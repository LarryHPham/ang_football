System.register(['@angular/core', '@angular/http', '../global/mlb-global-functions', '../global/global-functions', '../global/global-settings', '../components/carousels/slider-carousel/slider-carousel.component', './season-stats-page.data'], function(exports_1, context_1) {
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
    var core_1, http_1, mlb_global_functions_1, global_functions_1, global_settings_1, slider_carousel_component_1, season_stats_page_data_1;
    var SeasonStatsService, SeasonStatsPageService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            },
            function (season_stats_page_data_1_1) {
                season_stats_page_data_1 = season_stats_page_data_1_1;
            }],
        execute: function() {
            SeasonStatsService = (function () {
                function SeasonStatsService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                    this.pitchingFields = ["pitchWins", "pitchInningsPitched", "pitchStrikeouts", "pitchEra", "pitchHits"];
                    this.battingFields = ["batHomeRuns", "batAverage", "batRbi", "batHits", "batBasesOnBalls"];
                }
                SeasonStatsService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    return headers;
                };
                SeasonStatsService.prototype.getLinkToPage = function (playerId, playerName) {
                    return ["Season-stats-page", {
                            playerId: playerId,
                            fullName: global_functions_1.GlobalFunctions.toLowerKebab(playerName)
                        }];
                };
                SeasonStatsService.prototype.getPlayerStats = function (playerId) {
                    var _this = this;
                    var url = this._apiUrl + "/player/seasonStats/" + playerId;
                    // console.log("player stats: " + url);
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return _this.formatData(data.data); });
                };
                SeasonStatsService.prototype.formatData = function (data) {
                    if (!data || !data.playerInfo) {
                        return null;
                    }
                    var fields = data.playerInfo.position[0].charAt(0) == "P" ? this.pitchingFields : this.battingFields;
                    var playerInfo = data.playerInfo;
                    var stats = data.stats;
                    //Check to see if the position list contains pitcher abbreviation
                    //in order to select the appropriate fields
                    var isPitcher = playerInfo.position.filter(function (item) { return item == "P"; }).length > 0;
                    var seasonStatTabs = [];
                    var curYear = new Date().getFullYear();
                    //Load 4 years worth of data, starting from current year
                    for (var year = curYear; year > curYear - 4; year--) {
                        var strYear = year.toString();
                        seasonStatTabs.push(this.getTabData(strYear, data, playerInfo.playerName, isPitcher, year == curYear));
                    }
                    //Load "Career Stats" data
                    seasonStatTabs.push(this.getTabData("Career", data, playerInfo.playerName, isPitcher));
                    return {
                        tabs: seasonStatTabs,
                        profileName: playerInfo.playerName,
                        carouselDataItem: SeasonStatsService.getCarouselData(playerInfo, curYear.toString()),
                        pageRouterLink: this.getLinkToPage(Number(playerInfo.playerId), playerInfo.playerName),
                        playerInfo: playerInfo
                    };
                };
                SeasonStatsService.prototype.getBarData = function (stats, isCareer, isPitcher) {
                    if (stats.player !== undefined) {
                        var statsToInclude = isPitcher ? this.pitchingFields : this.battingFields;
                        var bars = [];
                        for (var index in statsToInclude) {
                            var fieldName = statsToInclude[index];
                            var infoBox = null;
                            //catch no stat data
                            var worstValue = stats.worst[fieldName] != undefined ? stats.worst[fieldName] : null;
                            var leaderValue = stats.leader[fieldName] != undefined ? stats.leader[fieldName] : null;
                            var playerValue = stats.player[fieldName] != undefined ? stats.player[fieldName] : null;
                            var dataPoints = [];
                            //Set up data points
                            if (isCareer) {
                                dataPoints = [{
                                        value: this.formatValue(fieldName, playerValue),
                                        color: '#BC1624'
                                    }];
                            }
                            else {
                                var avgValue = stats.average[fieldName] != null ? stats.average[fieldName] : 'N/A';
                                var infoIcon = 'fa-info-circle';
                                dataPoints = [{
                                        value: this.formatValue(fieldName, playerValue),
                                        color: '#BC1624',
                                        fontWeight: '800'
                                    },
                                    {
                                        value: this.formatValue(fieldName, avgValue),
                                        color: '#444444',
                                    }];
                                //Set up info box only for non-career tabs
                                if (leaderValue == null) {
                                    console.log("Error - leader value is null for " + fieldName);
                                }
                                else if (leaderValue.players && leaderValue.players.length > 0) {
                                    var firstPlayer = leaderValue.players[0];
                                    var playerName = firstPlayer.firstName + ' ' + firstPlayer.playerLastName;
                                    var linkToPlayer = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(firstPlayer.teamName, playerName, firstPlayer.playerId);
                                    infoBox = [{
                                            teamName: firstPlayer.teamLastName,
                                            playerName: playerName,
                                            infoBoxImage: {
                                                imageClass: "image-40",
                                                mainImage: {
                                                    imageUrl: global_settings_1.GlobalSettings.getImageUrl(firstPlayer.playerHeadshot),
                                                    imageClass: "border-1",
                                                    urlRouteArray: linkToPlayer,
                                                    hoverText: "<i class='fa fa-mail-forward infobox-list-fa'></i>",
                                                },
                                            },
                                            routerLinkPlayer: linkToPlayer,
                                            routerLinkTeam: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(firstPlayer.teamName, firstPlayer.teamId),
                                        }];
                                }
                            }
                            bars.push({
                                title: this.getKeyDisplayTitle(fieldName),
                                data: dataPoints,
                                minValue: worstValue != null ? Number(this.formatValue(fieldName, worstValue.statValue)) : null,
                                maxValue: leaderValue != null ? Number(this.formatValue(fieldName, leaderValue.statValue)) : null,
                                info: infoIcon != null ? infoIcon : null,
                                infoBoxDetails: infoBox,
                                qualifierLabel: SeasonStatsService.getQualifierLabel(fieldName)
                            });
                        }
                        return bars;
                    }
                };
                SeasonStatsService.prototype.getTabData = function (seasonId, data, playerName, isPitcher, isCurrYear) {
                    var legendValues;
                    var subTitle;
                    var tabTitle;
                    var longSeasonName; // for display in the carousel and module title
                    var isCareer = seasonId.toLowerCase() == "career";
                    var bars = this.getBarData(data.stats[seasonId.toLowerCase()], isCareer, isPitcher);
                    if (isCareer) {
                        tabTitle = "Career Stats";
                        subTitle = tabTitle;
                        longSeasonName = "Career";
                        legendValues = [
                            { title: playerName, color: '#BC2027' },
                            { title: "Stat High", color: "#E1E1E1" }
                        ];
                    }
                    else {
                        if (isCurrYear) {
                            tabTitle = "Current Season";
                            subTitle = tabTitle;
                            longSeasonName = tabTitle;
                        }
                        else {
                            tabTitle = seasonId;
                            subTitle = seasonId + " Season";
                            longSeasonName = subTitle;
                        }
                        legendValues = [
                            { title: playerName, color: '#BC2027' },
                            { title: 'MLB Average', color: '#444444' },
                            { title: "MLB Leader", color: "#E1E1E1" }
                        ];
                    }
                    return {
                        longSeasonName: longSeasonName,
                        tabTitle: tabTitle,
                        comparisonLegendData: {
                            legendTitle: [
                                { text: subTitle, class: 'text-heavy' },
                                { text: ' Stats' }
                            ],
                            legendValues: legendValues
                        },
                        tabData: bars
                    };
                };
                SeasonStatsService.getCarouselData = function (playerInfo, longSeasonName) {
                    if (!playerInfo) {
                        return null;
                    }
                    var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(playerInfo.teamName, playerInfo.teamId);
                    var teamRouteText = {
                        route: teamRoute,
                        text: playerInfo.teamName,
                        class: 'text-heavy'
                    };
                    var playerRouteText = {
                        text: playerInfo.playerName
                    };
                    return slider_carousel_component_1.SliderCarousel.convertToCarouselItemType1(1, {
                        backgroundImage: global_settings_1.GlobalSettings.getBackgroundImageUrl(playerInfo.liveImage),
                        copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                        subheader: [longSeasonName + " Stats Report"],
                        profileNameLink: playerRouteText,
                        description: ["Team: ", teamRouteText],
                        lastUpdatedDate: global_functions_1.GlobalFunctions.formatUpdatedDate(playerInfo.lastUpdate),
                        circleImageUrl: global_settings_1.GlobalSettings.getImageUrl(playerInfo.playerHeadshot),
                        circleImageRoute: null,
                    });
                };
                SeasonStatsService.getQualifierLabel = function (key) {
                    switch (key) {
                        case "pitchBasesOnBalls":
                        case "pitchHits":
                        case "pitchEra":
                        case "pitchEarnedRuns":
                        case "pitchHomeRunsAllowed":
                            return "A lower number indicates a stronger performance.";
                        default:
                            return null;
                    }
                };
                SeasonStatsService.prototype.getKeyDisplayTitle = function (key) {
                    switch (key) {
                        case "batHomeRuns": return "Home Runs (HR)";
                        case "batAverage": return "Batting Average (BA)";
                        case "batRbi": return "Runs Batted In (RBI)";
                        case "batHits": return "Hits (H)";
                        case "batBasesOnBalls": return "Walks (BB)";
                        case "pitchWins": return "Wins";
                        case "pitchInningsPitched": return "Innings Pitched (IP)";
                        case "pitchStrikeouts": return "Strike Outs (SO)";
                        case "pitchEra": return "ERA";
                        case "pitchHits": return "Hits";
                        default: return null;
                    }
                };
                SeasonStatsService.prototype.formatValue = function (fieldName, value) {
                    if (value == null) {
                        return null;
                    }
                    switch (fieldName) {
                        case "batAverage": return Number(value).toFixed(3);
                        case "pitchInningsPitched": return Number(value).toFixed(1);
                        case "pitchEra": return Number(value).toFixed(2);
                        case "batHomeRuns":
                        case "batRbi":
                        case "batHits":
                        case "batBasesOnBalls":
                        case "pitchWins":
                        case "pitchStrikeouts":
                        case "pitchHits":
                        default: return Number(value).toFixed(0);
                    }
                };
                SeasonStatsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], SeasonStatsService);
                return SeasonStatsService;
            }());
            exports_1("SeasonStatsService", SeasonStatsService);
            SeasonStatsPageService = (function () {
                function SeasonStatsPageService(http, _mlbFunctions) {
                    this.http = http;
                    this._mlbFunctions = _mlbFunctions;
                }
                SeasonStatsPageService.prototype.getPageTitle = function (pageParams, playerName) {
                    var pageTitle = "Season Stats";
                    if (playerName) {
                        pageTitle = "Season Stats - " + playerName;
                    }
                    return pageTitle;
                };
                SeasonStatsPageService.prototype.initializeAllTabs = function (pageParams) {
                    var tabs = [];
                    var curYear = new Date().getFullYear();
                    var year = curYear;
                    var playerName = pageParams['playerName'];
                    var possessivePlayer = global_functions_1.GlobalFunctions.convertToPossessive(playerName);
                    //create tabs for season stats from current year of MLB and back 3 years
                    for (var i = 0; i < 4; i++) {
                        var title_1 = year == curYear ? 'Current Season' : year.toString();
                        var tabName_1 = possessivePlayer + " " + title_1 + " Stats";
                        tabs.push(new season_stats_page_data_1.MLBSeasonStatsTabData(title_1, tabName_1, null, year.toString(), i == 0));
                        year--;
                    }
                    //also push in last the career stats tab
                    var title = 'Career Stats';
                    var tabName = possessivePlayer + " Career Stats";
                    tabs.push(new season_stats_page_data_1.MLBSeasonStatsTabData(title, tabName, null, 'career', false));
                    return tabs;
                };
                SeasonStatsPageService.prototype.getSeasonStatsTabData = function (seasonStatsTab, pageParams, onTabsLoaded, maxRows) {
                    var _this = this;
                    var playerId = pageParams.playerId;
                    //example url: http://dev-homerunloyal-api.synapsys.us/player/statsDetail/96652
                    var url = global_settings_1.GlobalSettings.getApiUrl() + "/player/statsDetail/" + playerId;
                    seasonStatsTab.isLoaded = false;
                    seasonStatsTab.hasError = false;
                    this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return _this.setupTabData(seasonStatsTab, data.data, pageParams.teamId, maxRows); })
                        .subscribe(function (data) {
                        seasonStatsTab.isLoaded = true;
                        seasonStatsTab.hasError = false;
                        seasonStatsTab.sections = data;
                        onTabsLoaded(data);
                    }, function (err) {
                        seasonStatsTab.isLoaded = true;
                        seasonStatsTab.hasError = true;
                        console.log("Error getting season stats data", err);
                    });
                };
                SeasonStatsPageService.prototype.setupTabData = function (seasonStatsTab, apiData, playerId, maxRows) {
                    var seasonTitle;
                    var sectionTable;
                    var sections = [];
                    var totalRows = 0;
                    var seasonKey = seasonStatsTab.year;
                    var tableData = {};
                    //run through each object in the api and set the title of only the needed season for the table regular and post season
                    for (var season in apiData) {
                        switch (season) {
                            case 'regularSeason':
                                seasonTitle = "Regular Season";
                                break;
                            case 'postSeason':
                                seasonTitle = "Post Season";
                                break;
                            default:
                                break;
                        }
                        // we only care about the tables that meet the switch cases being regular and post season
                        if (seasonTitle != null) {
                            //set the section table to season
                            sectionTable = apiData[season];
                            //section Table now need to be set to sectionYear which are each of the different stats for each season of that [YEAR] being 'total' and 'average' NOTE: 'total' is being sent back as 'stat'
                            if (seasonKey == 'career') {
                                var sectionTitle = void 0;
                                var sectionStat;
                                //look for the career total and grab all the stats for the players career
                                for (var statType in sectionTable[seasonKey]) {
                                    switch (statType) {
                                        case 'averages':
                                            sectionStat = "Average";
                                            sectionTitle = seasonTitle + " " + sectionStat;
                                            break;
                                        case 'stats':
                                            sectionStat = "Total";
                                            sectionTitle = seasonTitle + " " + sectionStat;
                                            break;
                                        default:
                                            break;
                                    }
                                    //run through each object in the api and set the title of only the needed section for the table averages and stats 'total'
                                    if (sectionTitle != null) {
                                        var sectionData = [];
                                        for (var year in sectionTable) {
                                            sectionTable[year][statType].playerInfo = apiData.playerInfo;
                                            sectionTable[year][statType].teamInfo = sectionTable[year].teamInfo != null ? sectionTable[year].teamInfo : {};
                                            if (year != 'career') {
                                                sectionData.push(sectionTable[year][statType]);
                                            }
                                        }
                                        sectionTable['career'][statType]['seasonId'] = 'Career';
                                        sectionTable['career'][statType]['sectionStat'] = sectionStat;
                                        sectionData.push(sectionTable['career'][statType]);
                                        //sort by season id and put career at the end
                                        sections.push(this.setupTableData(sectionTitle, seasonKey, sectionData, maxRows));
                                    } //END OF SECTION TITLE IF STATEMENT
                                } //END OF SEASON YEAR FOR LOOP
                            }
                            else {
                                var sectionYear = sectionTable[seasonKey];
                                if (sectionYear != null) {
                                    var sectionTitle = void 0;
                                    for (var statType in sectionYear) {
                                        switch (statType) {
                                            case 'averages':
                                                sectionTitle = seasonTitle + " " + "Average";
                                                break;
                                            case 'stats':
                                                sectionTitle = seasonTitle + " " + "Total";
                                                break;
                                            default:
                                                break;
                                        }
                                        //run through each object in the api and set the title of only the needed section for the table averages and stats 'total'
                                        if (sectionTitle != null) {
                                            var sectionData = sectionYear[statType];
                                            sectionData.playerInfo = apiData.playerInfo;
                                            sectionData.teamInfo = sectionYear.teamInfo != null ? sectionYear.teamInfo : {};
                                            sections.push(this.setupTableData(sectionTitle, seasonKey, sectionData, maxRows));
                                        } //END OF SECTION TITLE IF STATEMENT
                                    } //END OF SEASON YEAR FOR LOOP
                                } //end of season year if check
                            } //end of season key check
                        } //END OF SEASON TITLE IF STATEMENT
                    } //END OF SEASON FOR LOOP
                    // this.convertAPIData(apiData.regularSeason, tableData);
                    return sections;
                };
                SeasonStatsPageService.prototype.setupTableData = function (season, year, rows, maxRows) {
                    var tableName;
                    var self = this;
                    //convert object coming in into array
                    if (year == 'career') {
                        var rowArray = rows;
                    }
                    else {
                        var rowArray = [];
                        rowArray.push(rows);
                    }
                    tableName = season;
                    var table = new season_stats_page_data_1.MLBSeasonStatsTableModel(rowArray, true); // set if pitcher to true
                    return new season_stats_page_data_1.MLBSeasonStatsTableData(tableName, season, year, table);
                };
                SeasonStatsPageService.prototype.getKeyValue = function (key, data) {
                    if (data[key] == null) {
                        data[key] = {};
                    }
                    switch (key) {
                        case "batHomeRuns": return data[key];
                        case "batAverage": return data[key];
                        case "batRbi": return data[key];
                        case "batHits": return data[key];
                        case "batBasesOnBalls": return data[key];
                        case "batOnBasePercentage": return data[key];
                        case "batRunsScored": return data[key];
                        case "batSluggingPercentage": return data[key];
                        case "pitchWins": return data[key];
                        case "pitchInningsPitched": return data[key];
                        case "pitchStrikeouts": return data[key];
                        case "pitchEra": return data[key];
                        case "pitchHits": return data[key];
                        case "pitchLosses": return data[key];
                        case "pitchEarnedRuns": return data[key];
                        case "pitchBasesOnBalls": return data[key];
                        case "pitchWhip": return data[key];
                        default: return '0';
                    }
                };
                SeasonStatsPageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, mlb_global_functions_1.MLBGlobalFunctions])
                ], SeasonStatsPageService);
                return SeasonStatsPageService;
            }());
            exports_1("SeasonStatsPageService", SeasonStatsPageService);
        }
    }
});
