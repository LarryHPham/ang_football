System.register(['../components/custom-table/table-data.component', '../global/mlb-global-functions', '../global/global-functions', '../global/global-settings', '../global/global-gradient'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var table_data_component_1, mlb_global_functions_1, global_functions_1, global_settings_1, global_gradient_1;
    var MLBScheduleTabData, MLBSchedulesTableData, MLBSchedulesTableModel;
    return {
        setters:[
            function (table_data_component_1_1) {
                table_data_component_1 = table_data_component_1_1;
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
            function (global_gradient_1_1) {
                global_gradient_1 = global_gradient_1_1;
            }],
        execute: function() {
            MLBScheduleTabData = (function () {
                function MLBScheduleTabData(title, isActive) {
                    this.title = title;
                    this.isActive = isActive;
                    this.sections = [];
                }
                return MLBScheduleTabData;
            }());
            exports_1("MLBScheduleTabData", MLBScheduleTabData);
            MLBSchedulesTableData = (function () {
                function MLBSchedulesTableData(title, table, currentTeamProfile) {
                    this.groupName = title;
                    this.tableData = table;
                    this.currentTeamProfile = currentTeamProfile;
                }
                MLBSchedulesTableData.prototype.updateCarouselData = function (item, index) {
                    var displayNext = '';
                    if (item.eventStatus == 'pre-event') {
                        var displayNext = 'Next Game:';
                    }
                    else {
                        var displayNext = 'Previous Game:';
                    }
                    var teamRouteAway = this.currentTeamProfile == item.awayTeamId ? null : mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(item.awayTeamName, item.awayTeamId);
                    var teamRouteHome = this.currentTeamProfile == item.homeTeamId ? null : mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(item.homeTeamName, item.homeTeamId);
                    var colors = global_gradient_1.Gradient.getColorPair(item.awayTeamColors.split(','), item.homeTeamColors.split(','));
                    return {
                        index: index,
                        displayNext: displayNext,
                        backgroundGradient: global_gradient_1.Gradient.getGradientStyles(colors),
                        displayTime: moment(item.startDateTimestamp).tz('America/New_York').format('dddd MMMM Do, YYYY | h:mm A') + " ET",
                        detail1Data: 'Home Stadium:',
                        detail1Value: item.homeTeamVenue,
                        detail2Value: item.homeTeamCity + ', ' + item.homeTeamState,
                        imageConfig1: {
                            imageClass: "image-125",
                            mainImage: {
                                imageUrl: global_settings_1.GlobalSettings.getImageUrl(item.awayTeamLogo),
                                urlRouteArray: teamRouteAway,
                                hoverText: "<p>View</p><p>Profile</p>",
                                imageClass: "border-5"
                            }
                        },
                        imageConfig2: {
                            imageClass: "image-125",
                            mainImage: {
                                imageUrl: global_settings_1.GlobalSettings.getImageUrl(item.homeTeamLogo),
                                urlRouteArray: teamRouteHome,
                                hoverText: "<p>View</p><p>Profile</p>",
                                imageClass: "border-5"
                            }
                        },
                        teamUrl1: teamRouteAway,
                        teamUrl2: teamRouteHome,
                        teamName1: item.awayTeamName,
                        teamName2: item.homeTeamName,
                        teamLocation1: item.awayTeamCity + ', ' + item.awayTeamState,
                        teamLocation2: item.homeTeamCity + ', ' + item.homeTeamState,
                        teamRecord1: item.awayRecord,
                        teamRecord2: item.homeRecord,
                    };
                };
                return MLBSchedulesTableData;
            }());
            exports_1("MLBSchedulesTableData", MLBSchedulesTableData);
            MLBSchedulesTableModel = (function () {
                function MLBSchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage) {
                    this.selectedKey = "";
                    //find if current team is home or away and set the name to the current objects name
                    this.curTeam = teamId ? teamId.toString() : null;
                    this.isTeamProfilePage = isTeamProfilePage;
                    if (eventStatus === 'pre-event') {
                        this.columns = [{
                                headerValue: "DATE",
                                columnClass: "date-column",
                                sortDirection: 1,
                                isNumericType: true,
                                key: "date"
                            }, {
                                headerValue: "TIME",
                                columnClass: "date-column",
                                ignoreSort: true,
                                key: "t"
                            }, {
                                headerValue: "AWAY",
                                columnClass: "image-column location-column",
                                key: "away"
                            }, {
                                headerValue: "HOME",
                                columnClass: "image-column location-column",
                                key: "home"
                            }, {
                                headerValue: "GAME SUMMARY",
                                columnClass: "summary-column",
                                ignoreSort: true,
                                key: "gs"
                            }];
                    }
                    else {
                        if (typeof teamId == 'undefined') {
                            this.columns = [
                                {
                                    headerValue: "AWAY",
                                    columnClass: "image-column location-column2",
                                    isNumericType: false,
                                    key: "away"
                                }, {
                                    headerValue: "HOME",
                                    columnClass: "image-column location-column2",
                                    isNumericType: false,
                                    key: "home"
                                }, {
                                    headerValue: "RESULTS",
                                    columnClass: "data-column results-column",
                                    isNumericType: false,
                                    ignoreSort: true,
                                    key: "r"
                                }, {
                                    headerValue: "GAME SUMMARY",
                                    columnClass: "summary-column",
                                    ignoreSort: true,
                                    key: "gs"
                                }];
                        }
                        else {
                            this.columns = [{
                                    headerValue: "DATE",
                                    columnClass: "date-column",
                                    sortDirection: -1,
                                    isNumericType: true,
                                    key: "date"
                                }, {
                                    headerValue: "TIME",
                                    columnClass: "date-column",
                                    ignoreSort: true,
                                    key: "t"
                                }, {
                                    headerValue: "OPPOSING TEAM",
                                    columnClass: "image-column location-column2",
                                    isNumericType: false,
                                    key: 'opp'
                                }, {
                                    headerValue: "RESULT",
                                    columnClass: "data-column wl-column",
                                    isNumericType: false,
                                    key: "wl"
                                }, {
                                    headerValue: "W/L",
                                    columnClass: "data-column record-column",
                                    isNumericType: true,
                                    key: "rec"
                                }, {
                                    headerValue: "GAME SUMMARY",
                                    columnClass: "summary-column",
                                    ignoreSort: true,
                                    key: "gs"
                                }];
                        }
                    }
                    this.rows = rows;
                    if (this.rows === undefined || this.rows === null) {
                        this.rows = [];
                    }
                }
                MLBSchedulesTableModel.prototype.setSelectedKey = function (key) {
                    this.selectedKey = key;
                };
                MLBSchedulesTableModel.prototype.getSelectedKey = function () {
                    return this.selectedKey;
                };
                MLBSchedulesTableModel.prototype.setRowSelected = function (rowIndex) {
                    if (rowIndex >= 0 && rowIndex < this.rows.length) {
                        this.selectedKey = this.rows[rowIndex].eventId;
                    }
                    else {
                        this.selectedKey = null;
                    }
                };
                MLBSchedulesTableModel.prototype.isRowSelected = function (item, rowIndex) {
                    return this.selectedKey == item.eventId;
                };
                MLBSchedulesTableModel.prototype.getCellData = function (item, column) {
                    var display = "";
                    var sort = null;
                    var link = null;
                    var imageUrl = null;
                    var isLocation = false;
                    var hdrColumnKey = column.key;
                    if (column.key == "opp") {
                        hdrColumnKey = this.curTeam == item.homeTeamId ? "away" : "home";
                    }
                    switch (hdrColumnKey) {
                        case "date":
                            display = global_functions_1.GlobalFunctions.formatDateWithAPMonth(item.startDateTimestamp, "", "D");
                            sort = item.startDateTimestamp;
                            break;
                        case "t":
                            if (item.eventStatus != 'cancelled') {
                                display = moment(item.startDateTimestamp).tz('America/New_York').format('h:mm') + " <sup> " + moment(item.startDateTimestamp).tz('America/New_York').format('A') + " </sup>";
                            }
                            else {
                                display = "Cancelled";
                            }
                            sort = item.startDateTimestamp;
                            break;
                        case "away":
                            isLocation = true;
                            display = item.awayTeamLastName.length > 10 ? item.awayTeamNickname : item.awayTeamLastName;
                            sort = item.awayTeamLastName;
                            imageUrl = global_settings_1.GlobalSettings.getImageUrl(item.awayTeamLogo);
                            if (!this.isTeamProfilePage || this.curTeam != item.awayTeamId) {
                                link = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(item.awayTeamName, item.awayTeamId);
                            }
                            break;
                        case "home":
                            isLocation = true;
                            display = item.homeTeamLastName.length > 10 ? item.homeTeamNickname : item.homeTeamLastName;
                            sort = item.homeTeamLastName;
                            imageUrl = global_settings_1.GlobalSettings.getImageUrl(item.homeTeamLogo);
                            if (!this.isTeamProfilePage || this.curTeam != item.homeTeamId) {
                                link = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(item.homeTeamName, item.homeTeamId);
                            }
                            break;
                        case "gs":
                            var partnerCheck = global_settings_1.GlobalSettings.getHomeInfo();
                            if (item.eventStatus != 'cancelled') {
                                var status = item.eventStatus === 'pre-event' ? "Pregame" : (item.eventStatus === 'post-event' ? "Postgame" : null);
                                if (status) {
                                    // console.log("partnerCheck", partnerCheck);
                                    if (partnerCheck.isPartner) {
                                        display = "<a href='" + '/' + partnerCheck.partnerName + item.reportUrlMod + "'>" + status + " Report <i class='fa fa-angle-right'><i></a>";
                                    }
                                    else {
                                        display = "<a href='" + item.reportUrlMod + "'>" + status + " Report <i class='fa fa-angle-right'><i></a>";
                                    }
                                }
                            }
                            sort = item.eventStatus;
                            break;
                        case "r":
                            if (!item.homeTeamAbbreviation) {
                                item.homeTeamAbbreviation = "N/A";
                            }
                            if (!item.awayTeamAbbreviation) {
                                item.awayTeamAbbreviation = "N/A";
                            }
                            //whomever wins the game then their text gets bolded as winner
                            var home = item.homeTeamAbbreviation + " " + item.homeScore;
                            var away = item.awayTeamAbbreviation + " " + item.awayScore;
                            if (item.homeOutcome == 'win') {
                                home = "<span class='text-heavy'>" + home + "</span>";
                                sort = Number(item.homeScore);
                            }
                            else if (item.awayOutcome == 'win') {
                                away = "<span class='text-heavy'>" + away + "</span>";
                                sort = Number(item.awayScore);
                            }
                            else {
                                sort = Number(item.awayScore);
                            }
                            display = home + " - " + away;
                            break;
                        case "wl":
                            //shows the current teams w/l of the current game
                            var scoreHome = Number(item.homeScore);
                            var scoreAway = Number(item.awayScore);
                            if (scoreHome > scoreAway) {
                                display = item.homeOutcome.charAt(0).toUpperCase() + " " + scoreHome + " - " + scoreAway;
                                sort = (scoreHome / scoreHome + scoreAway);
                            }
                            else {
                                display = item.homeOutcome.charAt(0).toUpperCase() + " " + scoreAway + " - " + scoreHome;
                                sort = (scoreHome / scoreHome + scoreAway);
                            }
                            break;
                        case "rec":
                            //shows the record of the current teams game at that time
                            display = item.targetTeamWinsCurrent + " - " + item.targetTeamLossesCurrent;
                            if (Number(item.targetTeamWinsCurrent) > Number(item.targetTeamLossesCurrent)) {
                                sort = (Number(item.targetTeamWinsCurrent) / (Number(item.targetTeamLossesCurrent) + (Number(item.targetTeamWinsCurrent))));
                            }
                            else {
                                sort = (Number(item.targetTeamLossesCurrent) / (Number(item.targetTeamWinsCurrent) + (Number(item.targetTeamLossesCurrent))));
                            }
                            break;
                    }
                    if (isLocation) {
                        display = "<span class='location-wrap'>" + display + "</span>";
                    }
                    else if (display == null) {
                        display = "N/A";
                    }
                    return new table_data_component_1.CellData(display, sort, link, imageUrl);
                };
                return MLBSchedulesTableModel;
            }());
            exports_1("MLBSchedulesTableModel", MLBSchedulesTableModel);
        }
    }
});
