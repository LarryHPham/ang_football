System.register(['../components/custom-table/table-data.component', '../components/carousels/slider-carousel/slider-carousel.component', '../global/global-interface', '../global/global-functions', '../global/mlb-global-functions', '../global/global-settings'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var table_data_component_1, slider_carousel_component_1, global_interface_1, global_functions_1, mlb_global_functions_1, global_settings_1;
    var MLBRosterTabData, RosterTableModel;
    return {
        setters:[
            function (table_data_component_1_1) {
                table_data_component_1 = table_data_component_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            },
            function (global_interface_1_1) {
                global_interface_1 = global_interface_1_1;
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
            MLBRosterTabData = (function () {
                function MLBRosterTabData(_service, teamId, type, conference, maxRows, isTeamProfilePage) {
                    this._service = _service;
                    this.isLoaded = false;
                    this.hasError = false;
                    this.type = type;
                    this.teamId = teamId;
                    this.maxRows = maxRows;
                    this.errorMessage = "Sorry, there is no roster data available.";
                    this.isTeamProfilePage = isTeamProfilePage;
                    if (this.type == "hitters" && conference == global_interface_1.Conference.national) {
                        this.hasError = true;
                        this.errorMessage = "This team is a National League team and has no designated hitters.";
                    }
                    switch (type) {
                        case "full":
                            this.title = "Full Roster";
                            break;
                        case "pitchers":
                            this.title = "Pitchers";
                            break;
                        case "catchers":
                            this.title = "Catchers";
                            break;
                        case "fielders":
                            this.title = "Fielders";
                            break;
                        case "hitters":
                            this.title = "Hitters";
                            break;
                    }
                }
                MLBRosterTabData.prototype.loadData = function () {
                    var _this = this;
                    if (!this.tableData) {
                        if (!this._service.fullRoster) {
                            this._service.getRosterTabData(this).subscribe(function (data) {
                                //Limit to maxRows, if necessary
                                var rows = _this.filterRows(data);
                                _this.tableData = new RosterTableModel(rows);
                                _this.isLoaded = true;
                                _this.hasError = false;
                            }, function (err) {
                                _this.isLoaded = true;
                                _this.hasError = true;
                                console.log("Error getting roster data", err);
                            });
                        }
                        else {
                            var rows = this.filterRows(this._service.fullRoster);
                            this.tableData = new RosterTableModel(rows);
                            this.isLoaded = true;
                            this.hasError = false;
                        }
                    }
                };
                MLBRosterTabData.prototype.filterRows = function (data) {
                    var rows;
                    if (this.type != "full") {
                        rows = data[this.type];
                    }
                    else {
                        rows = [];
                        for (var type in data) {
                            data[type].forEach(function (player) {
                                if (rows.filter(function (row) { return row.playerId == player.playerId; }).length == 0) {
                                    rows.push(player);
                                }
                            });
                        }
                    }
                    rows = rows.sort(function (a, b) {
                        return Number(b.salary) - Number(a.salary);
                    });
                    if (this.maxRows !== undefined) {
                        rows = rows.slice(0, this.maxRows);
                    }
                    return rows;
                };
                MLBRosterTabData.prototype.convertToCarouselItem = function (val, index) {
                    var playerRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.playerName, val.playerId);
                    var teamRoute = this.isTeamProfilePage ? null : mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                    var curYear = new Date().getFullYear();
                    // var formattedHeight = MLBGlobalFunctions.formatHeightWithFoot(val.height);
                    var formattedSalary = "N/A";
                    if (val.salary != null) {
                        formattedSalary = "$" + global_functions_1.GlobalFunctions.nFormatter(Number(val.salary));
                    }
                    var playerNum = val.uniformNumber != null ? "<span class='text-heavy'>No. " + val.uniformNumber + "</span>," : "";
                    var playerHeight = val.height != null ? "<span class='text-heavy'>" + val.height + "</span>, " : "";
                    var playerWeight = val.weight != null ? "<span class='text-heavy'>" + val.weight + "</span> " : "";
                    var playerSalary = " makes <span class='text-heavy'>" + formattedSalary + "</span> per year.";
                    var playerLinkText = {
                        route: playerRoute,
                        text: val.playerName,
                        class: 'text-heavy'
                    };
                    var teamLinkText = {
                        route: teamRoute,
                        text: val.teamName,
                        class: 'text-heavy'
                    };
                    return slider_carousel_component_1.SliderCarousel.convertToCarouselItemType1(index, {
                        backgroundImage: global_settings_1.GlobalSettings.getBackgroundImageUrl(val.backgroundImage),
                        copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                        subheader: [curYear + ' TEAM ROSTER'],
                        profileNameLink: playerLinkText,
                        description: [
                            playerLinkText,
                            " plays ", "<span class='text-heavy'>" + val.position.join(', '), "</span>", 'for the ',
                            teamLinkText,
                            'wears <span class="text-heavy">' + playerNum + '</span> is ' + playerHeight + playerWeight + " and " + playerSalary
                        ],
                        lastUpdatedDate: global_functions_1.GlobalFunctions.formatUpdatedDate(val.lastUpdate),
                        circleImageUrl: global_settings_1.GlobalSettings.getImageUrl(val.playerHeadshot),
                        circleImageRoute: playerRoute,
                    });
                };
                return MLBRosterTabData;
            }());
            exports_1("MLBRosterTabData", MLBRosterTabData);
            RosterTableModel = (function () {
                function RosterTableModel(rows) {
                    this.columns = [{
                            headerValue: "Player",
                            columnClass: "image-column",
                            key: "name"
                        }, {
                            headerValue: "Pos.",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "pos"
                        }, {
                            headerValue: "Height",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "ht"
                        }, {
                            headerValue: "Weight",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "wt"
                        }, {
                            headerValue: "Age",
                            columnClass: "data-column",
                            isNumericType: true,
                            key: "age"
                        }, {
                            headerValue: "Salary",
                            columnClass: "data-column",
                            isNumericType: true,
                            sortDirection: -1,
                            key: "sal"
                        }
                    ];
                    this.selectedKey = "";
                    this.rows = rows;
                    if (this.rows === undefined || this.rows === null) {
                        this.rows = [];
                    }
                }
                RosterTableModel.prototype.setSelectedKey = function (key) {
                    this.selectedKey = key;
                };
                RosterTableModel.prototype.getSelectedKey = function () {
                    return this.selectedKey;
                };
                RosterTableModel.prototype.setRowSelected = function (rowIndex) {
                    if (rowIndex >= 0 && rowIndex < this.rows.length) {
                        this.selectedKey = this.rows[rowIndex].playerId;
                    }
                    else {
                        this.selectedKey = null;
                    }
                };
                RosterTableModel.prototype.isRowSelected = function (item, rowIndex) {
                    return this.selectedKey == item.playerId;
                };
                RosterTableModel.prototype.getCellData = function (item, column) {
                    var display = null;
                    var sort = null;
                    var link = null;
                    var imageUrl = null;
                    var displayAsRawText = false;
                    switch (column.key) {
                        case "name":
                            display = item.playerName;
                            sort = item.playerLastName + ', ' + item.playerFirstName;
                            link = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(item.teamName, item.playerName, item.playerId);
                            imageUrl = global_settings_1.GlobalSettings.getImageUrl(item.playerHeadshot);
                            break;
                        case "pos":
                            display = typeof item.position[0] != null ? item.position.join(', ') : null;
                            sort = item.position != null ? item.position.toString() : null;
                            break;
                        case "ht":
                            display = item.height != null ? mlb_global_functions_1.MLBGlobalFunctions.formatHeight(item.height) : null;
                            displayAsRawText = true;
                            sort = item.heightInInches != null ? Number(item.heightInInches) : null;
                            break;
                        case "wt":
                            display = item.weight != null ? item.weight + " lbs." : null;
                            sort = item.weight != null ? Number(item.weight) : null;
                            break;
                        case "age":
                            display = item.age != null ? item.age.toString() : null;
                            sort = item.age != null ? Number(item.age) : null;
                            break;
                        case "sal":
                            display = item.salary != null ? "$" + global_functions_1.GlobalFunctions.nFormatter(Number(item.salary)) : null;
                            sort = item.salary != null ? Number(item.salary) : null;
                            break;
                    }
                    if (display == null) {
                        display = "N/A";
                    }
                    return new table_data_component_1.CellData(display, sort, link, imageUrl, displayAsRawText);
                };
                return RosterTableModel;
            }());
            exports_1("RosterTableModel", RosterTableModel);
        }
    }
});
