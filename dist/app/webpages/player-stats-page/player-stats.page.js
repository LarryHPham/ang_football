System.register(['@angular/core', "@angular/router-deprecated", '@angular/platform-browser', "../../components/backtab/backtab.component", "../../components/title/title.component", "../../components/player-stats/player-stats.component", '../../components/loading/loading.component', '../../components/error/error.component', '../../components/dropdown/dropdown.component', '../../services/player-stats.service', '../../services/profile-header.service', '../../global/global-functions', "../../global/global-settings", '../../global/mlb-global-functions', "../../components/sidekick-wrapper/sidekick-wrapper.component"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, backtab_component_1, title_component_1, player_stats_component_1, loading_component_1, error_component_1, dropdown_component_1, player_stats_service_1, profile_header_service_1, global_functions_1, global_settings_1, mlb_global_functions_1, sidekick_wrapper_component_1;
    var PlayerStatsPage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (title_component_1_1) {
                title_component_1 = title_component_1_1;
            },
            function (player_stats_component_1_1) {
                player_stats_component_1 = player_stats_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (dropdown_component_1_1) {
                dropdown_component_1 = dropdown_component_1_1;
            },
            function (player_stats_service_1_1) {
                player_stats_service_1 = player_stats_service_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            }],
        execute: function() {
            PlayerStatsPage = (function () {
                function PlayerStatsPage(_params, _title, _profileService, _statsService) {
                    this._params = _params;
                    this._title = _title;
                    this._profileService = _profileService;
                    this._statsService = _statsService;
                    this.pageParams = {};
                    this.titleData = {
                        imageURL: "/app/public/profile_placeholder.png",
                        imageRoute: null,
                        text1: "Last Updated: [date]",
                        text2: "United States",
                        text3: "Player Stats",
                        icon: "fa fa-map-marker"
                    };
                    this.profileLoaded = false;
                    this.hasError = false;
                    this.lastUpdatedDateSet = false;
                    this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Player Stats"));
                    var teamId = _params.get("teamId");
                    if (teamId !== null && teamId !== undefined) {
                        this.pageParams.teamId = Number(teamId);
                    }
                }
                PlayerStatsPage.prototype.ngOnInit = function () {
                    var _this = this;
                    if (this.pageParams.teamId) {
                        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(function (data) {
                            _this.profileLoaded = true;
                            _this.pageParams = data.pageParams;
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Player Stats", data.teamName));
                            var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(data.teamName, data.pageParams.teamId ? data.pageParams.teamId.toString() : null);
                            _this.setupTitleData(teamRoute, data.teamName, data.fullProfileImageUrl);
                            _this.tabs = _this._statsService.initializeAllTabs(data.teamName, false);
                        }, function (err) {
                            _this.hasError = true;
                            console.log("Error getting player stats data for " + _this.pageParams.teamId + ": " + err);
                        });
                    }
                    else {
                        this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Player Stats", "MLB"));
                        this.setupTitleData(["MLB-page"]);
                    }
                };
                PlayerStatsPage.prototype.setupTitleData = function (route, teamName, imageUrl) {
                    var title = this._statsService.getPageTitle(teamName);
                    this.titleData = {
                        imageURL: imageUrl,
                        imageRoute: route,
                        text1: "",
                        text2: "United States",
                        text3: title,
                        icon: "fa fa-map-marker"
                    };
                };
                PlayerStatsPage.prototype.playerStatsTabSelected = function (tabData) {
                    var _this = this;
                    this._statsService.getStatsTabData(tabData, this.pageParams, function (data) {
                        _this.getLastUpdatedDateForPage(data);
                    });
                };
                PlayerStatsPage.prototype.getLastUpdatedDateForPage = function (table) {
                    //Getting the first 'lastUpdatedDate' listed in the StandingsData
                    if (!this.lastUpdatedDateSet && table && table.rows && table.rows.length > 0) {
                        var lastUpdated = table.rows[0].lastUpdate;
                        this.titleData.text1 = "Last Updated: " + global_functions_1.GlobalFunctions.formatUpdatedDate(lastUpdated, false);
                        this.lastUpdatedDateSet = true;
                    }
                };
                PlayerStatsPage = __decorate([
                    core_1.Component({
                        selector: 'Player-stats-page',
                        templateUrl: './app/webpages/player-stats-page/player-stats.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, player_stats_component_1.PlayerStatsComponent, loading_component_1.LoadingComponent, error_component_1.ErrorComponent, dropdown_component_1.DropdownComponent],
                        providers: [profile_header_service_1.ProfileHeaderService, player_stats_service_1.PlayerStatsService],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, platform_browser_1.Title, profile_header_service_1.ProfileHeaderService, player_stats_service_1.PlayerStatsService])
                ], PlayerStatsPage);
                return PlayerStatsPage;
            }());
            exports_1("PlayerStatsPage", PlayerStatsPage);
        }
    }
});
