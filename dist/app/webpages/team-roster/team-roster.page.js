System.register(['@angular/core', "@angular/router-deprecated", '@angular/platform-browser', '../../components/backtab/backtab.component', "../../components/title/title.component", "../../components/roster/roster.component", "../../global/global-settings", '../../services/roster.service', '../../services/profile-header.service', "../../components/sidekick-wrapper/sidekick-wrapper.component"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, backtab_component_1, title_component_1, roster_component_1, global_settings_1, roster_service_1, profile_header_service_1, sidekick_wrapper_component_1;
    var TeamRosterPage;
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
            function (roster_component_1_1) {
                roster_component_1 = roster_component_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (roster_service_1_1) {
                roster_service_1 = roster_service_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            }],
        execute: function() {
            TeamRosterPage = (function () {
                function TeamRosterPage(_params, _title, _profileService, _rosterService) {
                    this._params = _params;
                    this._title = _title;
                    this._profileService = _profileService;
                    this._rosterService = _rosterService;
                    this.pageParams = {};
                    this.profileLoaded = false;
                    this.hasError = false;
                    this.footerData = {
                        infoDesc: 'Interested in discovering more about this player?',
                        text: 'View Profile',
                        url: ['Team-roster-page']
                    };
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Team Roster"));
                    var teamId = _params.get("teamId");
                    if (teamId !== null && teamId !== undefined) {
                        this.pageParams.teamId = Number(teamId);
                    }
                }
                TeamRosterPage.prototype.ngOnInit = function () {
                    this.getData();
                };
                TeamRosterPage.prototype.getData = function () {
                    var _this = this;
                    if (this.pageParams.teamId) {
                        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(function (data) {
                            _this.profileLoaded = true;
                            _this.pageParams = data.pageParams;
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Team Roster", data.teamName));
                            _this.titleData = _this._profileService.convertTeamPageHeader(data, _this._rosterService.getPageTitle(data.teamName));
                            _this.setupRosterData();
                        }, function (err) {
                            _this.hasError = true;
                            console.log("Error getting team profile data for " + _this.pageParams.teamId, err);
                        });
                    }
                    else {
                    }
                };
                TeamRosterPage.prototype.setupRosterData = function () {
                    this.tabs = this._rosterService.initializeAllTabs(this.pageParams.teamId.toString(), this.pageParams.conference);
                };
                TeamRosterPage = __decorate([
                    core_1.Component({
                        selector: 'Team-roster-page',
                        templateUrl: './app/webpages/team-roster/team-roster.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, roster_component_1.RosterComponent],
                        providers: [roster_service_1.RosterService, profile_header_service_1.ProfileHeaderService, platform_browser_1.Title],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, platform_browser_1.Title, profile_header_service_1.ProfileHeaderService, roster_service_1.RosterService])
                ], TeamRosterPage);
                return TeamRosterPage;
            }());
            exports_1("TeamRosterPage", TeamRosterPage);
        }
    }
});
