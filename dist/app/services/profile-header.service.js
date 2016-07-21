System.register(['@angular/core', '@angular/http', '../global/global-settings', '../global/global-functions', '../global/mlb-global-functions', '../global/global-interface'], function(exports_1, context_1) {
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
    var core_1, http_1, global_settings_1, global_functions_1, mlb_global_functions_1, global_interface_1;
    var ProfileHeaderService;
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
            },
            function (global_interface_1_1) {
                global_interface_1 = global_interface_1_1;
            }],
        execute: function() {
            ProfileHeaderService = (function () {
                function ProfileHeaderService(http) {
                    this.http = http;
                }
                ProfileHeaderService.prototype.getPlayerProfile = function (playerId) {
                    var url = global_settings_1.GlobalSettings.getApiUrl() + '/player/profileHeader/' + playerId;
                    // console.log("player profile url: " + url);
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        var headerData = data.data;
                        if (!headerData.info) {
                            return null;
                        }
                        //Forcing values to be numbers (all stats values should be numbers)
                        if (headerData.stats) {
                            for (var key in headerData.stats) {
                                headerData.stats[key] = Number(headerData.stats[key]);
                            }
                        }
                        return {
                            pageParams: {
                                teamId: headerData.info.teamId,
                                teamName: headerData.info.teamName,
                                playerId: headerData.info.playerId,
                                playerName: headerData.info.playerName
                            },
                            fullBackgroundImageUrl: global_settings_1.GlobalSettings.getBackgroundImageUrl(headerData.info.backgroundImage),
                            fullProfileImageUrl: global_settings_1.GlobalSettings.getImageUrl(headerData.info.playerHeadshot),
                            headerData: headerData,
                            profileName: headerData.info.playerName,
                            profileId: headerData.info.playerId.toString(),
                            profileType: "player"
                        };
                    });
                };
                ProfileHeaderService.prototype.getTeamProfile = function (teamId) {
                    var url = global_settings_1.GlobalSettings.getApiUrl() + '/team/profileHeader/' + teamId;
                    // console.log("team profile url: " + url);
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        var headerData = data.data;
                        //Setting up conference and division values
                        var confKey = "", divKey = "";
                        if (headerData.stats) {
                            if (headerData.stats.conference && headerData.stats.conference.name) {
                                confKey = headerData.stats.conference.name.toLowerCase();
                            }
                            if (headerData.stats.division && headerData.stats.division.name) {
                                divKey = headerData.stats.division.name.toLowerCase();
                            }
                        }
                        //Forcing values to be numbers
                        if (headerData.stats.batting) {
                            headerData.stats.batting.average = Number(headerData.stats.batting.average);
                            headerData.stats.batting.runsScored = Number(headerData.stats.batting.runsScored);
                            headerData.stats.batting.homeRuns = Number(headerData.stats.batting.homeRuns);
                        }
                        if (headerData.stats.pitching) {
                            headerData.stats.pitching.era = Number(headerData.stats.pitching.era);
                        }
                        var teamName = headerData.teamFirstName + " " + headerData.teamLastName;
                        return {
                            pageParams: {
                                teamId: headerData.stats.teamId,
                                teamName: headerData.stats.teamName,
                                division: global_interface_1.Division[divKey],
                                conference: global_interface_1.Conference[confKey],
                            },
                            fullBackgroundImageUrl: global_settings_1.GlobalSettings.getBackgroundImageUrl(headerData.backgroundImage),
                            fullProfileImageUrl: global_settings_1.GlobalSettings.getImageUrl(headerData.profileImage),
                            headerData: headerData,
                            teamName: teamName,
                            profileName: headerData.stats.teamName,
                            profileId: headerData.stats.teamId.toString(),
                            profileType: "team"
                        };
                    });
                };
                ProfileHeaderService.prototype.getMLBProfile = function () {
                    var url = global_settings_1.GlobalSettings.getApiUrl() + '/league/profileHeader';
                    // console.log("mlb profile url: " + url);
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        var leagueData = data.data;
                        leagueData.profileNameShort = "MLB";
                        leagueData.profileNameLong = "Major League Baseball";
                        //Forcing values to be numbers
                        leagueData.totalDivisions = Number(leagueData.totalDivisions);
                        leagueData.totalLeagues = Number(leagueData.totalLeagues);
                        leagueData.totalPlayers = Number(leagueData.totalPlayers);
                        leagueData.totalTeams = Number(leagueData.totalTeams);
                        return {
                            headerData: leagueData,
                            profileName: leagueData.profileNameShort,
                            profileId: null,
                            profileType: "league"
                        };
                    });
                };
                ProfileHeaderService.prototype.convertTeamPageHeader = function (data, pageName) {
                    var description = data.headerData.description;
                    var stats = data.headerData.stats;
                    if (!stats) {
                        return null;
                    }
                    if (typeof pageName == 'undefined') {
                        pageName = '';
                    }
                    var teamId = data.pageParams.teamId ? data.pageParams.teamId.toString() : null;
                    return {
                        imageURL: data.fullProfileImageUrl,
                        imageRoute: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(data.teamName, teamId),
                        text1: 'Last Updated:' + global_functions_1.GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
                        text2: 'United States',
                        text3: pageName,
                        icon: 'fa fa-map-marker'
                    };
                };
                ProfileHeaderService.prototype.convertMLBHeader = function (data, pageName) {
                    return {
                        imageURL: global_settings_1.GlobalSettings.getImageUrl(data.logo),
                        imageRoute: ["MLB-page"],
                        text1: 'Last Updated:' + global_functions_1.GlobalFunctions.formatUpdatedDate(data.lastUpdated),
                        text2: 'United States',
                        text3: pageName,
                        icon: 'fa fa-map-marker'
                    };
                };
                ProfileHeaderService.prototype.convertToPlayerProfileHeader = function (data) {
                    if (!data.headerData || !data.headerData.info) {
                        return null;
                    }
                    var headerData = data.headerData;
                    var stats = headerData.stats;
                    var info = headerData.info;
                    var formattedStartDate = info.draftYear ? info.draftYear : "N/A"; //[September 18, 2015]
                    var formattedYearsInMLB = "N/A"; //[one]
                    var firstSentence = "";
                    var yearPluralStr = "years";
                    if (info.draftYear && info.draftTeam) {
                        var currentYear = (new Date()).getFullYear();
                        var yearsInMLB = (currentYear - Number(info.draftYear));
                        formattedYearsInMLB = global_functions_1.GlobalFunctions.formatNumber(yearsInMLB);
                        if (yearsInMLB == 1) {
                            yearPluralStr = "year";
                        }
                        firstSentence = "<span class='text-heavy'>" + info.playerName +
                            "</span> started his MLB career in <span class='text-heavy'>" + formattedStartDate +
                            "</span> for the <span class='text-heavy'>" + info.draftTeam +
                            "</span>, accumulating <span class='text-heavy'>" + formattedYearsInMLB +
                            "</span> " + yearPluralStr + " in the MLB. ";
                    }
                    else {
                        firstSentence = "<span class='text-heavy'>" + info.playerName +
                            "</span> currently plays for the <span class='text-heavy'>" + info.teamName +
                            "</span>. ";
                    }
                    var location = "N/A"; //[Wichita], [Kan.]
                    if (info.city && info.area) {
                        location = info.city + ", " + info.area;
                    }
                    var formattedBirthDate = "N/A"; //[October] [3], [1991]
                    if (info.birthDate) {
                        var date = moment(info.birthDate);
                        formattedBirthDate = global_functions_1.GlobalFunctions.formatAPMonth(date.month()) + date.format(" D, YYYY");
                    }
                    var formattedAge = info.age ? info.age.toString() : "N/A";
                    var formattedHeight = mlb_global_functions_1.MLBGlobalFunctions.formatHeightWithFoot(info.height); //[6-foot-11]
                    var formattedWeight = info.weight ? info.weight.toString() : "N/A";
                    var description = firstSentence + "<span class='text-heavy'>" + info.playerName +
                        "</span> was born in <span class='text-heavy'>" + location +
                        "</span> on <span class='text-heavy'>" + formattedBirthDate +
                        "</span> and is <span class='text-heavy'>" + formattedAge +
                        "</span> years old. He stands at <span class='text-heavy'>" + formattedHeight +
                        "</span>, <span class='text-heavy'>" + formattedWeight +
                        "</span> pounds.";
                    var dataPoints;
                    var isPitcher = headerData.info.position.filter(function (value) { return value === "P"; }).length > 0;
                    if (isPitcher) {
                        var formattedEra = null;
                        if (stats && stats.era != null) {
                            if (stats.era > 1) {
                                formattedEra = stats.era.toPrecision(3);
                            }
                            else {
                                formattedEra = stats.era.toPrecision(2);
                            }
                        }
                        dataPoints = [
                            {
                                label: "Wins/Losses",
                                labelCont: "for the current season",
                                value: (stats && stats.wins != null && stats.losses != null) ? stats.wins + " - " + stats.losses : null
                            },
                            {
                                label: "Innings Pitched",
                                labelCont: "for the current season",
                                value: (stats && stats.inningsPitched != null) ? stats.inningsPitched.toString() : null
                            },
                            {
                                label: "Strikeouts",
                                labelCont: "for the current season",
                                value: (stats && stats.strikeouts != null) ? stats.strikeouts.toString() : null
                            },
                            {
                                label: "Earned Run Average",
                                labelCont: "for the current season",
                                value: formattedEra
                            }
                        ];
                    }
                    else {
                        dataPoints = [
                            {
                                label: "Home Runs",
                                labelCont: "for the current season",
                                value: (stats && stats.homeRuns != null) ? stats.homeRuns.toString() : null
                            },
                            {
                                label: "Batting Average",
                                labelCont: "for the current season",
                                value: (stats && stats.average != null) ? stats.average.toPrecision(3) : null
                            },
                            {
                                label: "RBIs",
                                labelCont: "for the current season",
                                value: (stats && stats.rbi != null) ? stats.rbi.toString() : null
                            },
                            {
                                label: "Hits",
                                labelCont: "for the current season",
                                value: (stats && stats.hits != null) ? stats.hits.toString() : null
                            }
                        ];
                    }
                    var header = {
                        profileName: info.playerName,
                        profileImageUrl: data.fullProfileImageUrl,
                        backgroundImageUrl: data.fullBackgroundImageUrl,
                        profileTitleFirstPart: info.playerFirstName,
                        profileTitleLastPart: info.playerLastName,
                        lastUpdatedDate: info.lastUpdate,
                        description: description,
                        topDataPoints: [
                            {
                                label: "Team",
                                value: info.teamName,
                                routerLink: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(info.teamName, info.teamId.toString())
                            },
                            {
                                label: "Jersey Number",
                                value: info.uniformNumber ? info.uniformNumber.toString() : null
                            },
                            {
                                label: "Position",
                                value: info.position ? info.position.join(",") : null
                            }
                        ],
                        bottomDataPoints: dataPoints
                    };
                    return header;
                };
                ProfileHeaderService.prototype.convertToTeamProfileHeader = function (data) {
                    var headerData = data.headerData;
                    var stats = data.headerData.stats;
                    if (!stats) {
                        return null;
                    }
                    //The [Atlanta Braves] play in [Turner Field] located in [Atlanta, GA]. The [Atlanta Braves] are part of the [NL East].
                    var location = "N/A";
                    if (headerData.teamCity && headerData.teamState) {
                        location = headerData.teamCity + ", " + headerData.teamState;
                    }
                    var group = "N/A";
                    if (stats.division && stats.conference) {
                        group = mlb_global_functions_1.MLBGlobalFunctions.formatShortNameDivison(stats.conference.name, stats.division.name);
                    }
                    var venue = headerData.teamVenue ? headerData.teamVenue : "N/A";
                    var description = "The <span class='text-heavy'>" + stats.teamName +
                        "</span> play in <span class='text-heavy'>" + venue +
                        "</span> located in <span class='text-heavy'>" + location +
                        "</span>. The <span class='text-heavy'>" + stats.teamName +
                        "</span> are part of the <span class='text-heavy'>" + group +
                        "</span>.";
                    var formattedEra = null;
                    if (stats.pitching) {
                        if (stats.pitching.era > 1) {
                            formattedEra = stats.pitching.era.toPrecision(3);
                        }
                        else {
                            formattedEra = stats.pitching.era.toPrecision(2);
                        }
                    }
                    var header = {
                        profileName: stats.teamName,
                        profileImageUrl: data.fullProfileImageUrl,
                        backgroundImageUrl: data.fullBackgroundImageUrl,
                        profileTitleFirstPart: data.headerData.teamFirstName,
                        profileTitleLastPart: data.headerData.teamLastName,
                        lastUpdatedDate: data.headerData.lastUpdated,
                        description: description,
                        topDataPoints: [
                            {
                                label: "Division",
                                value: stats.division ? stats.division.name : null
                            },
                            {
                                label: "Rank",
                                value: stats.division ? stats.division.rank : null
                            },
                            {
                                label: "Record",
                                value: stats.totalWins + " - " + stats.totalLosses
                            }
                        ],
                        bottomDataPoints: [
                            {
                                label: "Batting Average",
                                labelCont: "for the current season",
                                value: stats.batting ? stats.batting.average.toPrecision(3) : null
                            },
                            {
                                label: "Runs",
                                labelCont: "for the current season",
                                value: stats.batting ? stats.batting.runsScored.toString() : null
                            },
                            {
                                label: "Home Runs",
                                labelCont: "for the current season",
                                value: stats.batting ? stats.batting.homeRuns.toString() : null
                            },
                            {
                                label: "Earned Run Average",
                                labelCont: "for the current season",
                                value: formattedEra
                            }
                        ]
                    };
                    return header;
                };
                ProfileHeaderService.prototype.convertToLeagueProfileHeader = function (data) {
                    //The MLB consists of [30] teams and [####] players. These teams and players are divided across [two] leagues and [six] divisions.
                    var city = data.city != null ? data.city : "N/A";
                    var state = data.state != null ? data.state : "N/A";
                    data.backgroundImage = global_settings_1.GlobalSettings.getBackgroundImageUrl(data.backgroundImage);
                    var description = "The MLB consists of " + global_functions_1.GlobalFunctions.formatNumber(data.totalTeams) +
                        " teams and " + global_functions_1.GlobalFunctions.formatNumber(data.totalPlayers) + " players. " +
                        "These teams and players are divided across " + global_functions_1.GlobalFunctions.formatNumber(data.totalLeagues) +
                        " leagues and " + global_functions_1.GlobalFunctions.formatNumber(data.totalDivisions) + " divisions.";
                    var location = "N/A";
                    if (data.city && data.state) {
                        location = city + ", " + state;
                    }
                    var header = {
                        profileName: "MLB",
                        profileImageUrl: global_settings_1.GlobalSettings.getImageUrl(data.logo),
                        backgroundImageUrl: data.backgroundImage,
                        profileTitleFirstPart: "",
                        profileTitleLastPart: "Major League Baseball",
                        lastUpdatedDate: data.lastUpdated,
                        description: description,
                        topDataPoints: [
                            {
                                label: "League Headquarters",
                                value: location
                            },
                            {
                                label: "Founded In",
                                value: data.foundingDate
                            }
                        ],
                        bottomDataPoints: [
                            {
                                label: "Total Teams:",
                                value: data.totalTeams != null ? data.totalTeams.toString() : null
                            },
                            {
                                label: "Total Players:",
                                value: data.totalPlayers != null ? data.totalPlayers.toString() : null
                            },
                            {
                                label: "Total Divisions:",
                                value: data.totalDivisions != null ? data.totalDivisions.toString() : null
                            },
                            {
                                label: "Total Leagues:",
                                value: data.totalLeagues != null ? data.totalLeagues.toString() : null
                            }
                        ]
                    };
                    return header;
                };
                ProfileHeaderService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ProfileHeaderService);
                return ProfileHeaderService;
            }());
            exports_1("ProfileHeaderService", ProfileHeaderService);
        }
    }
});
