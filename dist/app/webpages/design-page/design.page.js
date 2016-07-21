System.register(['@angular/core', '@angular/router-deprecated', '../../global/global-interface', '../../global/mlb-global-functions', '../../modules/draft-history/draft-history.module', '../../modules/standings/standings.module', '../../services/standings.service', '../../global/global-settings', '../../modules/profile-header/profile-header.module', '../../services/profile-header.service', '../../modules/about-us/about-us.module', "../../modules/articles/articles.module", "../../modules/list-of-lists/list-of-lists.module", '../../modules/team-roster/team-roster.module', '../../services/roster.service', '../../modules/share/share.module', "../../modules/likeus/likeus.module", '../../modules/comment/comment.module', "../../services/list-of-lists.service"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, global_interface_1, mlb_global_functions_1, draft_history_module_1, standings_module_1, standings_service_1, global_settings_1, profile_header_module_1, profile_header_service_1, about_us_module_1, articles_module_1, list_of_lists_module_1, team_roster_module_1, roster_service_1, share_module_1, likeus_module_1, comment_module_1, list_of_lists_service_1;
    var DesignPage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (global_interface_1_1) {
                global_interface_1 = global_interface_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (draft_history_module_1_1) {
                draft_history_module_1 = draft_history_module_1_1;
            },
            function (standings_module_1_1) {
                standings_module_1 = standings_module_1_1;
            },
            function (standings_service_1_1) {
                standings_service_1 = standings_service_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (profile_header_module_1_1) {
                profile_header_module_1 = profile_header_module_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (about_us_module_1_1) {
                about_us_module_1 = about_us_module_1_1;
            },
            function (articles_module_1_1) {
                articles_module_1 = articles_module_1_1;
            },
            function (list_of_lists_module_1_1) {
                list_of_lists_module_1 = list_of_lists_module_1_1;
            },
            function (team_roster_module_1_1) {
                team_roster_module_1 = team_roster_module_1_1;
            },
            function (roster_service_1_1) {
                roster_service_1 = roster_service_1_1;
            },
            function (share_module_1_1) {
                share_module_1 = share_module_1_1;
            },
            function (likeus_module_1_1) {
                likeus_module_1 = likeus_module_1_1;
            },
            function (comment_module_1_1) {
                comment_module_1 = comment_module_1_1;
            },
            function (list_of_lists_service_1_1) {
                list_of_lists_service_1 = list_of_lists_service_1_1;
            }],
        execute: function() {
            DesignPage = (function () {
                function DesignPage(_params, _standingsService, _profileService, _lolService, _mlbFunctions) {
                    this._params = _params;
                    this._standingsService = _standingsService;
                    this._profileService = _profileService;
                    this._lolService = _lolService;
                    this._mlbFunctions = _mlbFunctions;
                    this.shareModuleInput = {
                        imageUrl: global_settings_1.GlobalSettings.getSiteLogoUrl()
                    };
                    if (this.pageParams === undefined || this.pageParams === null) {
                        this.pageParams = {
                            division: global_interface_1.Division.east,
                            conference: global_interface_1.Conference.american,
                            playerId: 95041,
                            teamId: Number(_params.get("teamId"))
                        };
                    }
                }
                DesignPage.prototype.ngOnInit = function () {
                    this.setupProfileData();
                    this.setupLolData();
                };
                DesignPage.prototype.setupProfileData = function () {
                    var _this = this;
                    this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(function (data) {
                        _this.playerProfileHeaderData = _this._profileService.convertToPlayerProfileHeader(data);
                    }, function (err) {
                        console.log("Error getting player profile data for " + _this.pageParams.playerId + ": " + err);
                    });
                    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(function (data) {
                        _this.pageParams = data.pageParams;
                        _this.teamProfileHeaderData = _this._profileService.convertToTeamProfileHeader(data);
                        _this.standingsData = _this._standingsService.loadAllTabsForModule(_this.pageParams);
                    }, function (err) {
                        console.log("Error getting team profile data for " + _this.pageParams.teamId + ": " + err);
                    });
                    this._profileService.getMLBProfile().subscribe(function (data) {
                        _this.leagueProfileHeaderData = _this._profileService.convertToLeagueProfileHeader(data.headerData);
                    }, function (err) {
                        console.log("Error getting league profile data: " + err);
                    });
                };
                DesignPage.prototype.standingsTabSelected = function (tabData) {
                    //only show 5 rows in the module
                    this._standingsService.getStandingsTabData(tabData, this.pageParams, function (data) { }, 5);
                };
                DesignPage.prototype.setupLolData = function () {
                    var _this = this;
                    var params = {
                        id: "2799",
                        limit: 4,
                        pageNum: 1,
                    };
                    this._lolService.getListOfListsService(params, "team", "module")
                        .subscribe(function (listOfListsData) {
                        _this.listOfListsData = listOfListsData;
                    }, function (err) {
                        console.log('Error: listOfListsData API: ', err);
                    });
                };
                DesignPage = __decorate([
                    core_1.Component({
                        selector: 'Design-page',
                        templateUrl: './app/webpages/design-page/design.page.html',
                        directives: [draft_history_module_1.DraftHistoryModule, team_roster_module_1.TeamRosterModule, about_us_module_1.AboutUsModule, standings_module_1.StandingsModule, profile_header_module_1.ProfileHeaderModule, articles_module_1.ArticlesModule, list_of_lists_module_1.ListOfListsModule, share_module_1.ShareModule, likeus_module_1.LikeUs, comment_module_1.CommentModule],
                        providers: [standings_service_1.StandingsService, profile_header_service_1.ProfileHeaderService, roster_service_1.RosterService, list_of_lists_service_1.ListOfListsService]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, standings_service_1.StandingsService, profile_header_service_1.ProfileHeaderService, list_of_lists_service_1.ListOfListsService, mlb_global_functions_1.MLBGlobalFunctions])
                ], DesignPage);
                return DesignPage;
            }());
            exports_1("DesignPage", DesignPage);
        }
    }
});
