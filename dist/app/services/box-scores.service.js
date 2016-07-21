System.register(['@angular/core', '@angular/http', '../global/global-functions', '../global/mlb-global-functions', '../global/global-settings'], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, mlb_global_functions_1, global_settings_1;
    var BoxScoresService;
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
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            BoxScoresService = (function () {
                // private _apiToken: string = 'BApA7KEfj';
                // private _headerName: string = 'X-SNT-TOKEN';
                function BoxScoresService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                //Function to set custom headers
                BoxScoresService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    //headers.append(this.headerName, this.apiToken);
                    return headers;
                };
                BoxScoresService.prototype.getBoxScoresService = function (profile, date, teamId) {
                    var _this = this;
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    if (teamId != null) {
                        teamId = '/' + teamId;
                    }
                    else {
                        teamId = '';
                    }
                    //player profile are treated as teams
                    if (profile == 'player') {
                        profile = 'team';
                    }
                    //date needs to be the date coming in AS EST and come back as UTC
                    var callURL = this._apiUrl + '/' + profile + '/boxScores' + teamId + '/' + date;
                    // console.log(callURL);
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        // transform the data to YYYY-MM-DD objects from unix
                        var transformedDate = _this.transformBoxScores(data.data);
                        return {
                            transformedDate: transformedDate
                        };
                    });
                };
                //function  for BoxScoresService to use on profile pages
                BoxScoresService.prototype.getBoxScores = function (boxScoresData, profileName, dateParam, callback) {
                    var _this = this;
                    if (boxScoresData == null) {
                        boxScoresData = {};
                        boxScoresData['transformedDate'] = {};
                    }
                    if (boxScoresData == null || boxScoresData.transformedDate[dateParam.date] == null) {
                        this.getBoxScoresService(dateParam.profile, dateParam.date, dateParam.teamId)
                            .subscribe(function (data) {
                            if (data.transformedDate[dateParam.date] != null) {
                                var currentBoxScores = {
                                    scoreBoard: dateParam.profile != 'league' && data.transformedDate[dateParam.date] != null ? _this.formatScoreBoard(data.transformedDate[dateParam.date][0]) : null,
                                    moduleTitle: _this.moduleHeader(dateParam.date, profileName),
                                    gameInfo: _this.formatGameInfo(data.transformedDate[dateParam.date], dateParam.teamId, dateParam.profile),
                                    schedule: dateParam.profile != 'league' && data.transformedDate[dateParam.date] != null ? _this.formatSchedule(data.transformedDate[dateParam.date][0], dateParam.teamId, dateParam.profile) : null,
                                };
                                currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores : null;
                                callback(data, currentBoxScores);
                            }
                        });
                    }
                    else {
                        if (boxScoresData.transformedDate[dateParam.date] != null) {
                            var currentBoxScores = {
                                scoreBoard: dateParam.profile != 'league' && boxScoresData.transformedDate[dateParam.date] != null ? this.formatScoreBoard(boxScoresData.transformedDate[dateParam.date][0]) : null,
                                moduleTitle: this.moduleHeader(dateParam.date, profileName),
                                gameInfo: this.formatGameInfo(boxScoresData.transformedDate[dateParam.date], dateParam.teamId, dateParam.profile),
                                schedule: dateParam.profile != 'league' && boxScoresData.transformedDate[dateParam.date] != null ? this.formatSchedule(boxScoresData.transformedDate[dateParam.date][0], dateParam.teamId, dateParam.profile) : null,
                            };
                            currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores : null;
                            callback(boxScoresData, currentBoxScores);
                        }
                    }
                };
                /**
                * modifies data to get header data for modules
                */
                BoxScoresService.prototype.moduleHeader = function (date, team) {
                    var moduleTitle;
                    var month = moment(date, "YYYY-MM-DD").tz('America/New_York').format("MMMM");
                    var day = moment(date, "YYYY-MM-DD").tz('America/New_York').format("D");
                    var ordinal = moment(date, "YYYY-MM-DD").tz('America/New_York').format("D");
                    ordinal = '<sup>' + global_functions_1.GlobalFunctions.Suffix(ordinal) + '</sup>';
                    var year = moment(date, "YYYY-MM-DD").tz('America/New_York').format("YYYY");
                    var convertedDate = month + ' ' + day + ordinal + ', ' + year;
                    moduleTitle = "Box Scores - " + team + ': ' + convertedDate;
                    return {
                        moduleTitle: moduleTitle,
                        hasIcon: false,
                        iconClass: '',
                    };
                };
                /**
                * api to grab the dates that have games for box scores
                * sends back => unixdate: true/false
                */
                BoxScoresService.prototype.weekCarousel = function (profile, date, teamId) {
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    if (teamId != null) {
                        teamId = '/' + teamId;
                    }
                    else {
                        teamId = '';
                    }
                    //player profile are treated as teams
                    if (profile == 'player') {
                        profile = 'team';
                    }
                    var callURL = this._apiUrl + '/' + profile + '/gameDatesWeekly' + teamId + '/' + date;
                    // console.log(callURL);
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return data;
                    });
                };
                BoxScoresService.prototype.validateMonth = function (profile, date, teamId) {
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    if (teamId != null) {
                        teamId = '/' + teamId;
                    }
                    else {
                        teamId = '';
                    }
                    //player profile are treated as teams
                    if (profile == 'player') {
                        profile = 'team';
                    }
                    var callURL = this._apiUrl + '/' + profile + '/gameDates' + teamId + '/' + date; //localToEST needs tobe the date coming in AS UNIX
                    // console.log(callURL);
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return data;
                    });
                };
                BoxScoresService.prototype.transformBoxScores = function (boxScores) {
                    var newBoxScores = {};
                    for (var dates in boxScores) {
                        var dayDate = moment(Number(dates)).tz('America/New_York').format('YYYY-MM-DD');
                        if (typeof newBoxScores[dayDate] == 'undefined') {
                            newBoxScores[dayDate] = [];
                            newBoxScores[dayDate].push(boxScores[dates]);
                        }
                        else {
                            newBoxScores[dayDate].push(boxScores[dates]);
                        }
                    }
                    return newBoxScores;
                };
                //TO MATCH HTML the profile client is on will be detected by teamID and a left and right format will be made with the home and away team data
                BoxScoresService.prototype.formatSchedule = function (data, teamId, profile) {
                    var awayData = data.awayTeamInfo;
                    var homeData = data.homeTeamInfo;
                    var left, right;
                    var homeRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
                    var awayRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
                    if (profile == 'team') {
                        if (teamId == homeData.id) {
                            homeRoute = null;
                        }
                        else {
                            awayRoute = null;
                        }
                    }
                    var homeLogo = this.imageData("image-68", "border-logo", global_settings_1.GlobalSettings.getImageUrl(homeData.logo), homeRoute);
                    var awayLogo = this.imageData("image-68", "border-logo", global_settings_1.GlobalSettings.getImageUrl(awayData.logo), awayRoute);
                    right = {
                        homeHex: homeData.colors.split(', ')[0],
                        homeID: homeData.id,
                        homeLocation: homeData.firstName,
                        homeLogo: homeLogo,
                        url: homeRoute,
                        homeLosses: homeData.lossRecord,
                        homeName: homeData.lastName,
                        homeWins: homeData.winRecord
                    };
                    left = {
                        awayHex: awayData.colors.split(', ')[0],
                        awayID: awayData.id,
                        awayLocation: awayData.firstName,
                        awayLogo: awayLogo,
                        url: awayRoute,
                        awayLosses: awayData.lossRecord,
                        awayName: awayData.lastName,
                        awayWins: awayData.winRecord
                    };
                    // convert data given into format needed for the schedule banner on module
                    return {
                        home: [right],
                        away: [left]
                    };
                };
                BoxScoresService.prototype.formatGameInfo = function (game, teamId, profile) {
                    var gameArray = [];
                    var self = this;
                    var twoBoxes = []; // used to put two games into boxes
                    game.forEach(function (data, i) {
                        var info;
                        var awayData = data.awayTeamInfo;
                        var homeData = data.homeTeamInfo;
                        var gameInfo = data.gameInfo;
                        var homeLink = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
                        var awayLink = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
                        var aiContent = data.aiContent != null ? self.formatArticle(data) : null;
                        if (teamId != null && profile == 'team') {
                            if (homeData.id == teamId) {
                                homeLink = null;
                                var link1 = self.imageData('image-45', 'border-1', global_settings_1.GlobalSettings.getImageUrl(homeData.logo));
                                var link2 = self.imageData('image-45', 'border-1', global_settings_1.GlobalSettings.getImageUrl(awayData.logo), awayLink);
                            }
                            else {
                                awayLink = null;
                                var link1 = self.imageData('image-45', 'border-1', global_settings_1.GlobalSettings.getImageUrl(homeData.logo), homeLink);
                                var link2 = self.imageData('image-45', 'border-1', global_settings_1.GlobalSettings.getImageUrl(awayData.logo));
                            }
                        }
                        else {
                            var aiContent = data.aiContent != null ? self.formatArticle(data) : null;
                            var link1 = self.imageData('image-45', 'border-1', global_settings_1.GlobalSettings.getImageUrl(homeData.logo), homeLink);
                            var link2 = self.imageData('image-45', 'border-1', global_settings_1.GlobalSettings.getImageUrl(awayData.logo), awayLink);
                        }
                        var gameDate = data.gameInfo;
                        var homeWin = homeData.winRecord != null ? homeData.winRecord : '#';
                        var homeLoss = homeData.lossRecord != null ? homeData.lossRecord : '#';
                        var awayWin = awayData.winRecord != null ? awayData.winRecord : '#';
                        var awayLoss = awayData.lossRecord != null ? awayData.lossRecord : '#';
                        //determine if a game is live or not and display correct game time
                        var currentTime = new Date().getTime();
                        var inningTitle = '';
                        if (gameInfo.live) {
                            var inningHalf = gameInfo.inningHalf != null ? global_functions_1.GlobalFunctions.toTitleCase(gameInfo.inningHalf) : 'Top';
                            inningTitle = gameInfo.inningsPlayed != null ? inningHalf + " of " + gameInfo.inningsPlayed + global_functions_1.GlobalFunctions.Suffix(gameInfo.inningsPlayed) + " Inning" : '';
                        }
                        else {
                            if ((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live) {
                                inningTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
                            }
                            else {
                                inningTitle = 'Final';
                            }
                        }
                        info = {
                            gameHappened: gameInfo.inningsPlayed != null ? true : false,
                            //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
                            inning: inningTitle,
                            homeData: {
                                homeTeamName: homeData.lastName,
                                homeImageConfig: link1,
                                homeLink: homeLink,
                                homeRecord: homeWin + '-' + homeLoss,
                                runs: homeData.score,
                                hits: homeData.hits,
                                errors: homeData.errors
                            },
                            awayData: {
                                awayTeamName: awayData.lastName,
                                awayImageConfig: link2,
                                awayLink: awayLink,
                                awayRecord: awayWin + '-' + awayLoss,
                                runs: awayData.score,
                                hits: awayData.hits,
                                errors: awayData.errors
                            }
                        };
                        if (teamId != null) {
                            twoBoxes.push({ game: info, aiContent: aiContent });
                        }
                        else {
                            twoBoxes.push({ game: info });
                            if (twoBoxes.length > 1) {
                                gameArray.push(twoBoxes);
                                twoBoxes = [];
                            }
                        }
                        //incase it runs through entire loops and only 2 or less returns then push whatever is left
                        if (game.length == (i + 1) && gameArray.length == 0) {
                            gameArray.push(twoBoxes);
                        }
                    });
                    return gameArray;
                };
                BoxScoresService.prototype.formatArticle = function (data) {
                    var gameInfo = data.gameInfo;
                    var aiContent = data.aiContent;
                    var gameArticle = {};
                    for (var report in aiContent.featuredReport) {
                        gameArticle['report'] = "Read The Report";
                        gameArticle['headline'] = aiContent.featuredReport[report].displayHeadline;
                        gameArticle['articleLink'] = ['Article-pages', { eventType: report, eventID: aiContent.event }];
                        var i = aiContent['home']['images'];
                        var random1 = Math.floor(Math.random() * i.length);
                        var random2 = Math.floor(Math.random() * i.length);
                        gameArticle['images'] = [];
                        if (random1 == random2) {
                            gameArticle['images'].push(i[random1]);
                        }
                        else {
                            gameArticle['images'].push(i[random1]);
                            gameArticle['images'].push(i[random2]);
                        }
                    }
                    return gameArticle;
                };
                BoxScoresService.prototype.formatScoreBoard = function (data) {
                    var awayData = data.awayTeamInfo;
                    var homeData = data.homeTeamInfo;
                    var gameInfo = data.gameInfo;
                    var arrayScores = [];
                    //for live games show the total scored added up for each inning
                    var homeLiveScore = 0;
                    var awayLiveScore = 0;
                    for (var score in data) {
                        if (score != 'aiContent' && score != 'awayTeamInfo' && score != 'homeTeamInfo' && score != 'gameInfo') {
                            arrayScores.push({
                                inning: score.replace('p', ''),
                                scores: data[score]
                            });
                        }
                    }
                    var scoreBoard = {
                        homeLastName: homeData.lastName,
                        awayLastName: awayData.lastName,
                        homeScore: homeData.score,
                        awayScore: awayData.score,
                        scoreArray: arrayScores,
                    };
                    return scoreBoard;
                };
                /**
                 *this function will have inputs of all required fields that are dynamic and output the full
                **/
                BoxScoresService.prototype.imageData = function (imageClass, imageBorder, mainImg, mainImgRoute) {
                    if (typeof mainImg == 'undefined' || mainImg == '') {
                        mainImg = "/app/public/no-image.png";
                    }
                    var image = {
                        imageClass: imageClass,
                        mainImage: {
                            imageUrl: mainImg,
                            urlRouteArray: mainImgRoute,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: imageBorder,
                        },
                    };
                    return image;
                };
                BoxScoresService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], BoxScoresService);
                return BoxScoresService;
            }());
            exports_1("BoxScoresService", BoxScoresService);
        }
    }
});
