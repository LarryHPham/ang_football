System.register(['@angular/core', '@angular/http', '../global/mlb-global-functions', '../global/global-settings', './schedules.data'], function(exports_1, context_1) {
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
    var core_1, http_1, mlb_global_functions_1, global_settings_1, schedules_data_1;
    var SchedulesService;
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
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (schedules_data_1_1) {
                schedules_data_1 = schedules_data_1_1;
            }],
        execute: function() {
            SchedulesService = (function () {
                // private _apiToken: string = 'BApA7KEfj';
                // private _headerName: string = 'X-SNT-TOKEN';
                function SchedulesService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                SchedulesService.prototype.getLinkToPage = function (pageParams, teamName) {
                    var pageName = "Schedules-page";
                    var pageValues = {};
                    if (pageParams.teamId && teamName) {
                        pageValues["teamId"] = pageParams.teamId;
                        pageValues["teamName"] = teamName;
                        pageName += "-team";
                    }
                    else if (!pageParams.teamId && !teamName) {
                        pageName += "-league";
                    }
                    else {
                    }
                    return [pageName, pageValues];
                }; // Returns all parameters used to get to page of Schedules
                SchedulesService.prototype.getModuleTitle = function (teamName) {
                    var moduletitle = "Weekly Schedules";
                    if (teamName) {
                        moduletitle += " - " + teamName;
                    }
                    else {
                        moduletitle += " - League";
                    }
                    return moduletitle;
                }; // Sets the title of the modules with data returned by schedules
                SchedulesService.prototype.getPageTitle = function (teamName) {
                    var pageTitle = "MLB Schedules Breakdown";
                    if (teamName) {
                        pageTitle = "MLB Schedules - " + teamName;
                    }
                    return pageTitle;
                }; // Sets the title of the Page with data returne by shedules
                //Function to set custom headers
                SchedulesService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    //headers.append(this.headerName, this.apiToken);
                    return headers;
                };
                SchedulesService.prototype.getSchedulesService = function (profile, eventStatus, limit, pageNum, isTeamProfilePage, id, year) {
                    var _this = this;
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    var jsYear = new Date().getFullYear(); //DEFAULT YEAR DATA TO CURRENT YEAR
                    var displayYear;
                    var eventTab = false;
                    if (typeof year == 'undefined') {
                        year = new Date().getFullYear(); //once we have historic data we shall show this
                    }
                    if (jsYear == year) {
                        displayYear = "Current Season";
                    }
                    else {
                        displayYear = year;
                    }
                    //eventType determines which tab is highlighted
                    if (eventStatus == 'pre-event') {
                        eventTab = true;
                    }
                    else {
                        eventTab = false;
                    }
                    var callURL = this._apiUrl + '/' + profile + '/schedule';
                    if (typeof id != 'undefined') {
                        callURL += '/' + id;
                    }
                    callURL += '/' + eventStatus + '/' + limit + '/' + pageNum; //default pagination limit: 5; page: 1
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        var tableData = _this.setupTableData(eventStatus, year, data.data, id, limit, isTeamProfilePage);
                        var tabData = [
                            { display: 'Upcoming Games', data: 'pre-event', disclaimer: 'Times are displayed in ET and are subject to change', season: displayYear, tabData: new schedules_data_1.MLBScheduleTabData(_this.formatGroupName(year, 'pre-event'), eventTab) },
                            { display: 'Previous Games', data: 'post-event', disclaimer: 'Games are displayed by most recent.', season: displayYear, tabData: new schedules_data_1.MLBScheduleTabData(_this.formatGroupName(year, 'post-event'), !eventTab) }
                        ];
                        return {
                            data: tableData,
                            tabs: tabData,
                            carData: _this.setupCarouselData(data.data, tableData[0], limit),
                            pageInfo: {
                                totalPages: data.data[0].totalPages,
                                totalResults: data.data[0].totalResults,
                            }
                        };
                    });
                };
                //possibly simpler version of getting schedules api call
                SchedulesService.prototype.getSchedule = function (profile, eventStatus, limit, pageNum, id, year) {
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    var jsYear = new Date().getFullYear(); //DEFAULT YEAR DATA TO CURRENT YEAR
                    var displayYear;
                    var eventTab = false;
                    if (typeof year == 'undefined') {
                        year = new Date().getFullYear(); //once we have historic data we shall show this
                    }
                    if (jsYear == year) {
                        displayYear = "Current Season";
                    }
                    else {
                        displayYear = year;
                    }
                    //eventType determines which tab is highlighted
                    if (eventStatus == 'pre-event') {
                        eventTab = true;
                    }
                    else {
                        eventTab = false;
                    }
                    var callURL = this._apiUrl + '/' + profile + '/schedule';
                    if (typeof id != 'undefined') {
                        callURL += '/' + id;
                    }
                    callURL += '/' + eventStatus + '/' + limit + '/' + pageNum; //default pagination limit: 5; page: 1
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return data;
                    });
                };
                SchedulesService.prototype.setupSlideScroll = function (data, profile, eventStatus, limit, pageNum, callback) {
                    var _this = this;
                    this.getSchedule('league', eventStatus, limit, pageNum)
                        .subscribe(function (data) {
                        var formattedData = _this.transformSlideScroll(data.data);
                        callback(formattedData);
                    });
                };
                SchedulesService.prototype.transformSlideScroll = function (data) {
                    var self = this;
                    var modifiedArray = [];
                    var newData;
                    //run through and convert data to what is needed for the component
                    data.forEach(function (val, index) {
                        var reportText = 'GAME REPORT';
                        var reportLink = mlb_global_functions_1.MLBGlobalFunctions.formatArticleRoute(val.eventStatus, val.eventId);
                        if (val.eventStatus = 'pre-event') {
                            reportText = 'PRE GAME REPORT';
                        }
                        else if (val.eventStatus == 'post-event') {
                            reportText = 'POST GAME REPORT';
                        }
                        else {
                            reportText = 'MID GAME REPORT';
                        }
                        var date = moment(val.startDateTimestamp).tz('America/New_York').format('MMMM D YYYY');
                        var time = moment(val.startDateTimestamp).tz('America/New_York').format('h:mm A');
                        newData = {
                            date: date + " <i class='fa fa-circle'></i> " + time,
                            awayImageConfig: self.imageData('image-60', 'border-1', global_settings_1.GlobalSettings.getImageUrl(val.awayTeamLogo), mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.awayTeamName, val.awayTeamId)),
                            homeImageConfig: self.imageData('image-60', 'border-1', global_settings_1.GlobalSettings.getImageUrl(val.homeTeamLogo), mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.homeTeamName, val.homeTeamId)),
                            awayTeamName: val.awayTeamLastName,
                            homeTeamName: val.homeTeamLastName,
                            reportDisplay: reportText,
                            reportLink: reportLink ? reportLink : ['Error-page'],
                        };
                        modifiedArray.push(newData);
                    });
                    return modifiedArray;
                };
                //rows is the data coming in
                SchedulesService.prototype.setupTableData = function (eventStatus, year, rows, teamId, maxRows, isTeamProfilePage) {
                    //Limit to maxRows, if necessary
                    if (maxRows !== undefined) {
                        rows = rows.slice(0, maxRows);
                    }
                    var currentTeamProfile = isTeamProfilePage ? teamId : null;
                    //TWO tables are to be made depending on what type of tabs the use is click on in the table
                    if (eventStatus == 'pre-event') {
                        // let tableName = this.formatGroupName(year,eventStatus);
                        var table = new schedules_data_1.MLBSchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage);
                        var tableArray = new schedules_data_1.MLBSchedulesTableData('', table, currentTeamProfile);
                        return [tableArray];
                    }
                    else {
                        var postDate = [];
                        var dateObject = {};
                        // let tableName = this.formatGroupName(year,eventStatus);
                        if (typeof teamId == 'undefined') {
                            var table = new schedules_data_1.MLBSchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage); // there are two types of tables for Post game (team/league) tables
                            rows.forEach(function (val, index) {
                                var splitToDate = moment(val.startDateTimestamp).tz('America/New_York').format('YYYY-MM-DD');
                                if (typeof dateObject[splitToDate] == 'undefined') {
                                    dateObject[splitToDate] = {};
                                    dateObject[splitToDate]['tableData'] = [];
                                    dateObject[splitToDate]['display'] = moment(val.startDateTimestamp).tz('America/New_York').format('dddd MMMM Do, YYYY') + " Games";
                                    dateObject[splitToDate]['tableData'].push(val);
                                }
                                else {
                                    dateObject[splitToDate]['tableData'].push(val);
                                }
                            });
                            for (var date in dateObject) {
                                var newPostModel = new schedules_data_1.MLBSchedulesTableModel(dateObject[date]['tableData'], eventStatus, teamId, isTeamProfilePage);
                                var newPostTable = new schedules_data_1.MLBSchedulesTableData(dateObject[date]['display'], newPostModel, currentTeamProfile);
                                postDate.push(newPostTable);
                            }
                            return postDate;
                        }
                        else {
                            var table = new schedules_data_1.MLBSchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage); // there are two types of tables for Post game (team/league) tables
                            var tableArray = new schedules_data_1.MLBSchedulesTableData('', table, currentTeamProfile);
                            return [tableArray];
                        }
                    }
                };
                SchedulesService.prototype.setupCarouselData = function (origData, tableData, maxRows) {
                    //Limit to maxRows, if necessary
                    if (maxRows !== undefined) {
                        origData = origData.slice(0, maxRows);
                    }
                    var carData = origData.map(function (val, index) {
                        var displayNext = '';
                        if (val.eventStatus == 'pre-event') {
                            var displayNext = 'Next Game:';
                        }
                        else {
                            var displayNext = 'Previous Game:';
                        }
                        if (val.homeTeamWins === null) {
                            val.homeTeamWins = '#';
                        }
                        if (val.homeTeamLosses === null) {
                            val.homeTeamLosses = '#';
                        }
                        if (val.awayTeamWins === null) {
                            val.awayTeamWins = '#';
                        }
                        if (val.awayTeamLosses === null) {
                            val.awayTeamLosses = '#';
                        }
                        // combine together the win and loss of a team to create their record
                        val.homeRecord = val.homeTeamWins + '-' + val.homeTeamLosses; //?? is this really the win and loss
                        val.awayRecord = val.awayTeamWins + '-' + val.awayTeamLosses; //?? is this really the win and loss
                        return tableData.updateCarouselData(val, index); //Use existing conversion function
                    });
                    return carData;
                };
                SchedulesService.prototype.formatGroupName = function (year, eventStatus) {
                    var currentDate = new Date().getFullYear();
                    var games = "";
                    if (eventStatus == 'pre-event') {
                        games = "<span class='text-heavy>Current Season</span> Upcoming Games";
                    }
                    else if (year == currentDate) {
                        games = "<span class='text-heavy>Current Season</span> Previously Played Games";
                    }
                    else {
                        games = year + " Season";
                    }
                    return games;
                };
                SchedulesService.prototype.imageData = function (imageClass, imageBorder, mainImg, mainImgRoute) {
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
                SchedulesService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], SchedulesService);
                return SchedulesService;
            }());
            exports_1("SchedulesService", SchedulesService);
        }
    }
});
