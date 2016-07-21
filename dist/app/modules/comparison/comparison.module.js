System.register(['@angular/core', '../../components/module-header/module-header.component', '../../components/comparison-tile/comparison-tile.component', '../../components/comparison-bar/comparison-bar.component', '../../components/comparison-legend/comparison-legend.component', '../../components/tabs/tabs.component', '../../components/tabs/tab.component', '../../components/error/data-box/data-box.component', '../../global/global-settings', '../../global/global-functions', '../../global/mlb-global-functions', '../../global/global-gradient'], function(exports_1, context_1) {
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
    var core_1, module_header_component_1, comparison_tile_component_1, comparison_bar_component_1, comparison_legend_component_1, tabs_component_1, tab_component_1, data_box_component_1, global_settings_1, global_functions_1, mlb_global_functions_1, global_gradient_1;
    var ComparisonModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (comparison_tile_component_1_1) {
                comparison_tile_component_1 = comparison_tile_component_1_1;
            },
            function (comparison_bar_component_1_1) {
                comparison_bar_component_1 = comparison_bar_component_1_1;
            },
            function (comparison_legend_component_1_1) {
                comparison_legend_component_1 = comparison_legend_component_1_1;
            },
            function (tabs_component_1_1) {
                tabs_component_1 = tabs_component_1_1;
            },
            function (tab_component_1_1) {
                tab_component_1 = tab_component_1_1;
            },
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
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
            function (global_gradient_1_1) {
                global_gradient_1 = global_gradient_1_1;
            }],
        execute: function() {
            ComparisonModule = (function () {
                function ComparisonModule() {
                    this.moduleHeaderData = {
                        moduleTitle: 'Comparison vs. Competition - [Batter Name]',
                        hasIcon: false,
                        iconClass: ''
                    };
                    this.tabs = [];
                    this.noDataMessage = "Sorry, there are no values for this season.";
                    var year = new Date().getFullYear();
                    this.tabs.push({
                        tabTitle: "Current Season",
                        seasonId: year.toString(),
                        barData: []
                    });
                    for (var i = 0; i < 3; i++) {
                        year--;
                        this.tabs.push({
                            tabTitle: year.toString(),
                            seasonId: year.toString(),
                            barData: []
                        });
                    }
                    this.tabs.push({
                        tabTitle: "Career Stats",
                        seasonId: "careerStats",
                        barData: []
                    });
                }
                ComparisonModule.prototype.ngOnInit = function () {
                };
                ComparisonModule.prototype.ngOnChanges = function () {
                    var _this = this;
                    if (this.modelData) {
                        this.teamList = this.modelData.teamList;
                        if (this.modelData.playerLists && this.modelData.playerLists.length >= 2) {
                            this.teamOnePlayerList = this.modelData.playerLists[0].playerList;
                            this.teamTwoPlayerList = this.modelData.playerLists[1].playerList;
                        }
                        if (this.modelData.data && this.tabs) {
                            this.formatData(this.modelData.data);
                            this.modelData.loadTeamList(function (teamList) {
                                _this.teamList = teamList;
                                _this.loadPlayerList(0, _this.modelData.data.playerOne.teamId);
                                _this.loadPlayerList(1, _this.modelData.data.playerTwo.teamId);
                            });
                        }
                    }
                    if (this.profileName) {
                        this.moduleHeaderData.moduleTitle = 'Comparison vs. Competition - ' + this.profileName;
                    }
                };
                //TODO-CJP: think about passing of data and creating a list of players rather than player one and player two
                ComparisonModule.prototype.formatData = function (data) {
                    this.comparisonTileDataOne = this.setupTile(data.playerOne);
                    this.comparisonTileDataTwo = this.setupTile(data.playerTwo);
                    this.gradient = global_gradient_1.Gradient.getGradientStyles([data.playerOne.mainTeamColor, data.playerTwo.mainTeamColor], 1);
                    var selectedTab;
                    for (var i = 0; i < this.tabs.length; i++) {
                        if (!this.selectedTabTitle && i == 0) {
                            selectedTab = this.tabs[i];
                        }
                        else if (this.selectedTabTitle && this.tabs[i].tabTitle == this.selectedTabTitle) {
                            selectedTab = this.tabs[i];
                        }
                        this.tabs[i].barData = data.bars[this.tabs[i].seasonId];
                    }
                    if (!selectedTab) {
                        return;
                    }
                    var legendTitle = selectedTab.tabTitle == "Career Stats" ? selectedTab.tabTitle : selectedTab.seasonId + " Season";
                    this.comparisonLegendData = {
                        legendTitle: [
                            {
                                text: legendTitle,
                                class: 'text-heavy'
                            },
                            {
                                text: ' Breakdown',
                            },
                            {
                                text: '*Qualified players only',
                                class: 'comparison-legend-title-sub'
                            }
                        ],
                        legendValues: [
                            {
                                title: data.playerOne.playerName,
                                // color: data.playerOne.mainTeamColor
                                color: '#BC1624'
                            },
                            {
                                title: data.playerTwo.playerName,
                                // color: data.playerTwo.mainTeamColor
                                color: '#444444'
                            },
                            {
                                title: "Stat High",
                                color: "#e1e1e1"
                            },
                        ]
                    };
                };
                ComparisonModule.prototype.setupTile = function (player) {
                    var playerRoute = null;
                    var teamRoute = null;
                    if (this.profileType != "player" || this.profileId != player.playerId) {
                        playerRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(player.teamName, player.playerName, player.playerId);
                    }
                    if (this.profileType != "team" || this.profileId != player.teamId) {
                        teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(player.teamName, player.teamId);
                    }
                    return {
                        dropdownOneKey: player.teamId,
                        dropdownTwoKey: player.playerId,
                        imageConfig: {
                            imageClass: "image-150",
                            mainImage: {
                                imageUrl: global_settings_1.GlobalSettings.getImageUrl(player.playerHeadshot),
                                urlRouteArray: playerRoute,
                                hoverText: "<p>View</p><p>Profile</p>",
                                imageClass: "border-med"
                            },
                            subImages: [
                                // {
                                // imageUrl: GlobalSettings.getImageUrl(player.teamLogo),
                                // urlRouteArray: MLBGlobalFunctions.formatTeamRoute(player.teamName, player.teamId),
                                // hoverText: "<i class='fa fa-mail-forward'></i>",
                                // imageClass: "image-50-sub image-round-lower-right"
                                // },
                                {
                                    text: "#" + player.uniformNumber,
                                    imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                                }
                            ],
                        },
                        titleUrl: playerRoute,
                        title: player.playerName,
                        description: ["Position: ",
                            { text: player.position.join(', '), class: 'text-heavy' },
                            { text: "<br>", class: "line-break" },
                            "Team: ",
                            {
                                text: player.teamName,
                                route: teamRoute,
                                class: 'text-heavy'
                            }
                        ],
                        data: [
                            {
                                data: player.height.split("-").join("'") + "\"",
                                key: 'Height'
                            },
                            {
                                data: player.weight + "<sup>lbs</sup>",
                                key: 'Weight'
                            },
                            {
                                data: player.age.toString(),
                                key: 'Age'
                            },
                            {
                                data: player.yearsExperience + "<sup>" + global_functions_1.GlobalFunctions.Suffix(player.yearsExperience) + "</sup>",
                                key: 'Season'
                            },
                        ]
                    };
                };
                /**
                 * @param {number} tileIndex - 0 : left tile
                 *                           - 1 : right tile
                 * @param value an object containing
                 *  - {number} dropdownIndex: 0 = left dropdown or team list, 1 right dropdown or player list
                 *  - {string} key - The key selected in the dropdown
                 */
                ComparisonModule.prototype.tileDropdownSwitched = function (tileIndex, value) {
                    var dropdownIndex = value.dropdownIndex;
                    var key = value.key;
                    if (dropdownIndex == 0) {
                        this.loadPlayerList(tileIndex, key);
                        this.loadPlayer(tileIndex, key);
                    }
                    else if (dropdownIndex == 1) {
                        //load new player list and comparison stats
                        this.loadPlayer(tileIndex, null, key);
                    }
                };
                ComparisonModule.prototype.loadPlayerList = function (tileIndex, teamId) {
                    var _this = this;
                    if (tileIndex == 0) {
                        this.selectedTeamOne = teamId;
                    }
                    else {
                        this.selectedTeamTwo = teamId;
                    }
                    this.modelData.loadPlayerList(tileIndex, teamId, function (playerList) {
                        if (tileIndex == 0) {
                            _this.teamOnePlayerList = playerList;
                        }
                        else {
                            _this.teamTwoPlayerList = playerList;
                        }
                    });
                };
                ComparisonModule.prototype.loadPlayer = function (tileIndex, teamId, playerId) {
                    var _this = this;
                    this.modelData.loadPlayer(tileIndex, teamId, playerId, function (bars) {
                        _this.modelData.data.bars = bars;
                        _this.formatData(_this.modelData.data);
                    });
                };
                ComparisonModule.prototype.tabSelected = function (tabTitle) {
                    this.selectedTabTitle = tabTitle;
                    var selectedTabs = this.tabs.filter(function (tab) {
                        return tab.tabTitle == tabTitle;
                    });
                    if (selectedTabs.length > 0) {
                        var tab = selectedTabs[0];
                        if (tabTitle == "Career Stats") {
                            this.comparisonLegendData.legendTitle[0].text = tabTitle;
                            this.noDataMessage = "Sorry, there are no career stats available for these players.";
                        }
                        else {
                            this.comparisonLegendData.legendTitle[0].text = tab.seasonId + " Season";
                            this.noDataMessage = "Sorry, there are no statistics available for " + tab.seasonId + ".";
                        }
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ComparisonModule.prototype, "modelData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ComparisonModule.prototype, "profileName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ComparisonModule.prototype, "profileId", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ComparisonModule.prototype, "profileType", void 0);
                ComparisonModule = __decorate([
                    core_1.Component({
                        selector: 'comparison-module',
                        templateUrl: './app/modules/comparison/comparison.module.html',
                        directives: [module_header_component_1.ModuleHeader, comparison_tile_component_1.ComparisonTile, comparison_bar_component_1.ComparisonBar, comparison_legend_component_1.ComparisonLegend, tabs_component_1.Tabs, tab_component_1.Tab, data_box_component_1.NoDataBox]
                    }), 
                    __metadata('design:paramtypes', [])
                ], ComparisonModule);
                return ComparisonModule;
            }());
            exports_1("ComparisonModule", ComparisonModule);
        }
    }
});
