System.register(['../components/custom-table/table-data.component', '../components/carousels/slider-carousel/slider-carousel.component', '../global/mlb-global-functions', '../global/global-functions', '../global/global-settings'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var table_data_component_1, slider_carousel_component_1, mlb_global_functions_1, global_functions_1, global_settings_1;
    var MLBStandingsTableData, MLBStandingsTabData, MLBStandingsTableModel;
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
            MLBStandingsTableData = (function () {
                function MLBStandingsTableData(title, conference, division, table) {
                    this.groupName = title;
                    this.conference = conference;
                    this.division = division;
                    this.tableData = table;
                }
                return MLBStandingsTableData;
            }());
            exports_1("MLBStandingsTableData", MLBStandingsTableData);
            MLBStandingsTabData = (function () {
                function MLBStandingsTabData(title, conference, division, isActive, teamId) {
                    this.title = title;
                    this.conference = conference;
                    this.division = division;
                    this.isActive = isActive;
                    this.currentTeamId = teamId;
                }
                MLBStandingsTabData.prototype.getSelectedKey = function () {
                    if (!this.sections)
                        return "";
                    var key = "";
                    this.sections.forEach(function (section) {
                        var table = section.tableData;
                        if (table.selectedKey != null && table.selectedKey != "") {
                            key = table.selectedKey;
                        }
                    });
                    return key;
                };
                MLBStandingsTabData.prototype.setSelectedKey = function (key) {
                    this.selectedKey = key;
                    if (!this.sections)
                        return;
                    this.sections.forEach(function (section) {
                        var table = section.tableData;
                        if (table.rows.filter(function (row) { return row.teamId == key; }).length > 0) {
                            table.selectedKey = key;
                        }
                        else {
                            table.selectedKey = "";
                        }
                    });
                };
                MLBStandingsTabData.prototype.convertToCarouselItem = function (item, index) {
                    var teamRoute = null;
                    if (this.currentTeamId != item.teamId) {
                        teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(item.teamName, item.teamId.toString());
                    }
                    var teamNameLink = {
                        route: teamRoute,
                        text: item.teamName
                    };
                    return slider_carousel_component_1.SliderCarousel.convertToCarouselItemType1(index, {
                        backgroundImage: item.fullBackgroundImageUrl,
                        copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                        subheader: [item.seasonId + " Season " + item.groupName + " Standings"],
                        profileNameLink: teamNameLink,
                        description: [
                            "The ", teamNameLink,
                            " are currently <span class='text-heavy'>ranked " + item.rank + global_functions_1.GlobalFunctions.Suffix(item.rank) +
                                "</span>" + " in the <span class='text-heavy'>" + item.groupName +
                                "</span>, with a record of " + "<span class='text-heavy'>" + item.totalWins + " - " + item.totalLosses +
                                "</span>."
                        ],
                        lastUpdatedDate: item.displayDate,
                        circleImageUrl: item.fullImageUrl,
                        circleImageRoute: teamRoute
                    });
                };
                return MLBStandingsTabData;
            }());
            exports_1("MLBStandingsTabData", MLBStandingsTabData);
            MLBStandingsTableModel = (function () {
                function MLBStandingsTableModel(rows, teamId) {
                    // title: string;
                    this.columns = [{
                            headerValue: "Team Name",
                            columnClass: "image-column",
                            key: "name"
                        }, {
                            headerValue: "W",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "w"
                        }, {
                            headerValue: "L",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "l"
                        }, {
                            headerValue: "PCT",
                            columnClass: "data-column",
                            isNumericType: true,
                            sortDirection: -1,
                            key: "pct"
                        }, {
                            headerValue: "GB",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "gb"
                        }, {
                            headerValue: "RS",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "rs"
                        }, {
                            headerValue: "RA",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "ra"
                        }, {
                            headerValue: "STRK",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "strk"
                        }];
                    this.selectedKey = "";
                    this.rows = rows;
                    if (this.rows === undefined || this.rows === null) {
                        this.rows = [];
                    }
                    this.currentTeamId = teamId;
                }
                MLBStandingsTableModel.prototype.setSelectedKey = function (key) {
                    this.selectedKey = key ? key.toString() : key;
                };
                MLBStandingsTableModel.prototype.getSelectedKey = function () {
                    return this.selectedKey;
                };
                MLBStandingsTableModel.prototype.setRowSelected = function (rowIndex) {
                    if (rowIndex >= 0 && rowIndex < this.rows.length) {
                        this.selectedKey = this.rows[rowIndex].teamId;
                    }
                    else {
                        this.selectedKey = null;
                    }
                };
                MLBStandingsTableModel.prototype.isRowSelected = function (item, rowIndex) {
                    return this.selectedKey == item.teamId;
                };
                MLBStandingsTableModel.prototype.getCellData = function (item, column) {
                    var display = null;
                    var sort = null;
                    var link = null;
                    var imageUrl = null;
                    switch (column.key) {
                        case "name":
                            display = item.teamName;
                            sort = item.teamName;
                            if (item.teamId != this.currentTeamId) {
                                link = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(item.teamName, item.teamId.toString());
                            }
                            imageUrl = item.fullImageUrl;
                            break;
                        case "w":
                            display = item.totalWins != null ? item.totalWins.toString() : null;
                            sort = item.totalWins;
                            break;
                        case "l":
                            display = item.totalLosses != null ? item.totalLosses.toString() : null;
                            sort = item.totalLosses;
                            break;
                        case "pct":
                            display = item.winPercentage != null ? item.winPercentage.toPrecision(3) : null;
                            sort = item.winPercentage;
                            break;
                        case "gb":
                            display = item.gamesBack != null ? item.gamesBack.toString() : null;
                            sort = item.gamesBack;
                            break;
                        case "rs":
                            display = item.batRunsScored != null ? item.batRunsScored.toString() : null;
                            sort = item.batRunsScored;
                            break;
                        case "ra":
                            display = item.pitchRunsAllowed != null ? item.pitchRunsAllowed.toString() : null;
                            sort = item.pitchRunsAllowed;
                            break;
                        case "strk":
                            if (item.streakCount != null && item.streakType) {
                                var str = item.streakCount.toString();
                                display = (item.streakType == "loss" ? "L-" : "W-") + item.streakCount.toString();
                                sort = (item.streakType == "loss" ? -1 : 1) * item.streakCount;
                            }
                            break;
                    }
                    if (display == null) {
                        display = "N/A";
                    }
                    return new table_data_component_1.CellData(display, sort, link, imageUrl);
                };
                return MLBStandingsTableModel;
            }());
            exports_1("MLBStandingsTableModel", MLBStandingsTableModel);
        }
    }
});
