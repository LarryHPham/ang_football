System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', "../../global/global-settings", '../../components/title/title.component', '../../components/backtab/backtab.component', "../../components/loading/loading.component", "../../components/error/error.component", "../../components/sidekick-wrapper/sidekick-wrapper.component", "../../components/draft-history/draft-history.component", '../../services/profile-header.service', '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, global_settings_1, title_component_1, backtab_component_1, loading_component_1, error_component_1, sidekick_wrapper_component_1, draft_history_component_1, profile_header_service_1, responsive_widget_component_1;
    var DraftHistoryPage;
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
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (title_component_1_1) {
                title_component_1 = title_component_1_1;
            },
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (draft_history_component_1_1) {
                draft_history_component_1 = draft_history_component_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            DraftHistoryPage = (function () {
                function DraftHistoryPage(_profileService, params, _title) {
                    this._profileService = _profileService;
                    this.params = params;
                    this._title = _title;
                    this.whatProfile = "Draft History";
                    this.isError = false;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle(this.whatProfile));
                }
                DraftHistoryPage.prototype.ngOnInit = function () {
                    var _this = this;
                    var teamId = null;
                    if (this.params.get('teamId') != null) {
                        teamId = Number(this.params.get('teamId'));
                    }
                    if (teamId) {
                        this._profileService.getTeamProfile(teamId)
                            .subscribe(function (data) {
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Draft History", data.teamName));
                            var pageNameForTitle = data.profileName + " " + data.headerData.stats.seasonId + " - " + _this.whatProfile;
                            _this.profileHeaderData = _this._profileService.convertTeamPageHeader(data, pageNameForTitle);
                            _this.profileData = data;
                        }, function (err) {
                            _this.isError = true;
                            console.log('Error: draftData Profile Header API: ', err);
                        });
                    }
                    else {
                        this._profileService.getMLBProfile()
                            .subscribe(function (data) {
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Draft History", data.headerData.profileNameShort));
                            _this.profileHeaderData = _this._profileService.convertMLBHeader(data.headerData, "MLB's " + _this.whatProfile);
                            _this.profileData = data;
                        }, function (err) {
                            _this.isError = true;
                            console.log('Error: draftData Profile Header API: ', err);
                        });
                    }
                };
                DraftHistoryPage = __decorate([
                    core_1.Component({
                        selector: 'draft-history-page',
                        templateUrl: './app/webpages/draft-history-page/draft-history.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, error_component_1.ErrorComponent, loading_component_1.LoadingComponent, draft_history_component_1.DraftHistoryComponent, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, responsive_widget_component_1.ResponsiveWidget],
                        providers: [profile_header_service_1.ProfileHeaderService, platform_browser_1.Title]
                    }), 
                    __metadata('design:paramtypes', [profile_header_service_1.ProfileHeaderService, router_deprecated_1.RouteParams, platform_browser_1.Title])
                ], DraftHistoryPage);
                return DraftHistoryPage;
            }());
            exports_1("DraftHistoryPage", DraftHistoryPage);
        }
    }
});
