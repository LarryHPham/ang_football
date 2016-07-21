System.register(['@angular/core', '@angular/router-deprecated', "../components/footer/footer.component", "../components/header/header.component", "../webpages/home-page/home-page.page", "../webpages/about-us-page/about-us.page", "../webpages/directory-page/directory.page", "../webpages/contactus-page/contactus.page", "../webpages/disclaimer-page/disclaimer.page", "../webpages/error-page/error-page.page", '../webpages/search-page/search.page', "../webpages/team-page/team.page", "../webpages/mlb-page/mlb.page", "../webpages/player-page/player.page", "../webpages/player-stats-page/player-stats.page", "../webpages/team-roster/team-roster.page", "../webpages/list-page/list.page", "../webpages/schedules-page/schedules.page", "../webpages/draft-history-page/draft-history.page", "../webpages/season-stats-page/season-stats.page", "../webpages/standings-page/standings.page", "../webpages/article-pages/article-pages.page", "../webpages/list-of-lists-page/list-of-lists.page", "../webpages/transactions-page/transactions.page", "../webpages/mvp-list-page/mvp-list.page", "../global/global-article-page-service", "../global/global-ai-headline-module-service", "../webpages/module-page/module.page", "../webpages/images-test-page/images-test.page", "../webpages/design-page/design.page", "../global/global-service", "../pipes/safe.pipe", "../global/global-settings", "../webpages/deep-dive-page/deep-dive.page"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, footer_component_1, header_component_1, home_page_page_1, about_us_page_1, directory_page_1, contactus_page_1, disclaimer_page_1, error_page_page_1, search_page_1, team_page_1, mlb_page_1, player_page_1, player_stats_page_1, team_roster_page_1, list_page_1, schedules_page_1, draft_history_page_1, season_stats_page_1, standings_page_1, article_pages_page_1, list_of_lists_page_1, transactions_page_1, mvp_list_page_1, global_article_page_service_1, global_ai_headline_module_service_1, module_page_1, images_test_page_1, design_page_1, global_service_1, safe_pipe_1, safe_pipe_2, global_settings_1, deep_dive_page_1;
    var MyAppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (footer_component_1_1) {
                footer_component_1 = footer_component_1_1;
            },
            function (header_component_1_1) {
                header_component_1 = header_component_1_1;
            },
            function (home_page_page_1_1) {
                home_page_page_1 = home_page_page_1_1;
            },
            function (about_us_page_1_1) {
                about_us_page_1 = about_us_page_1_1;
            },
            function (directory_page_1_1) {
                directory_page_1 = directory_page_1_1;
            },
            function (contactus_page_1_1) {
                contactus_page_1 = contactus_page_1_1;
            },
            function (disclaimer_page_1_1) {
                disclaimer_page_1 = disclaimer_page_1_1;
            },
            function (error_page_page_1_1) {
                error_page_page_1 = error_page_page_1_1;
            },
            function (search_page_1_1) {
                search_page_1 = search_page_1_1;
            },
            function (team_page_1_1) {
                team_page_1 = team_page_1_1;
            },
            function (mlb_page_1_1) {
                mlb_page_1 = mlb_page_1_1;
            },
            function (player_page_1_1) {
                player_page_1 = player_page_1_1;
            },
            function (player_stats_page_1_1) {
                player_stats_page_1 = player_stats_page_1_1;
            },
            function (team_roster_page_1_1) {
                team_roster_page_1 = team_roster_page_1_1;
            },
            function (list_page_1_1) {
                list_page_1 = list_page_1_1;
            },
            function (schedules_page_1_1) {
                schedules_page_1 = schedules_page_1_1;
            },
            function (draft_history_page_1_1) {
                draft_history_page_1 = draft_history_page_1_1;
            },
            function (season_stats_page_1_1) {
                season_stats_page_1 = season_stats_page_1_1;
            },
            function (standings_page_1_1) {
                standings_page_1 = standings_page_1_1;
            },
            function (article_pages_page_1_1) {
                article_pages_page_1 = article_pages_page_1_1;
            },
            function (list_of_lists_page_1_1) {
                list_of_lists_page_1 = list_of_lists_page_1_1;
            },
            function (transactions_page_1_1) {
                transactions_page_1 = transactions_page_1_1;
            },
            function (mvp_list_page_1_1) {
                mvp_list_page_1 = mvp_list_page_1_1;
            },
            function (global_article_page_service_1_1) {
                global_article_page_service_1 = global_article_page_service_1_1;
            },
            function (global_ai_headline_module_service_1_1) {
                global_ai_headline_module_service_1 = global_ai_headline_module_service_1_1;
            },
            function (module_page_1_1) {
                module_page_1 = module_page_1_1;
            },
            function (images_test_page_1_1) {
                images_test_page_1 = images_test_page_1_1;
            },
            function (design_page_1_1) {
                design_page_1 = design_page_1_1;
            },
            function (global_service_1_1) {
                global_service_1 = global_service_1_1;
            },
            function (safe_pipe_1_1) {
                safe_pipe_1 = safe_pipe_1_1;
                safe_pipe_2 = safe_pipe_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (deep_dive_page_1_1) {
                deep_dive_page_1 = deep_dive_page_1_1;
            }],
        execute: function() {
            MyAppComponent = (function () {
                function MyAppComponent(_partnerData, _params) {
                    this._partnerData = _partnerData;
                    this._params = _params;
                    this.isHomeRunZone = false;
                    var parentParams = _params.params;
                    if (parentParams['partner_id'] !== null) {
                        this.partnerID = parentParams['partner_id'];
                        this.getPartnerHeader();
                    }
                    this.hideHeader = global_settings_1.GlobalSettings.getHomeInfo().hide;
                }
                MyAppComponent.prototype.getHeaderHeight = function () {
                    var pageHeader = document.getElementById('pageHeader');
                    if (pageHeader != null) {
                        return pageHeader.offsetHeight;
                    }
                };
                MyAppComponent.prototype.getPartnerHeader = function () {
                    var _this = this;
                    this._partnerData.getPartnerData(this.partnerID)
                        .subscribe(function (partnerScript) {
                        _this.partnerData = partnerScript;
                        _this.partnerScript = _this.partnerData['results'].header.script;
                    });
                };
                MyAppComponent.prototype.ngDoCheck = function () {
                    var checkHeight = this.getHeaderHeight();
                    if (this.shiftContainer != (checkHeight + 'px')) {
                        this.shiftContainer = checkHeight + 'px';
                    }
                };
                MyAppComponent.prototype.ngAfterViewChecked = function () {
                    this.shiftContainer = this.getHeaderHeight() + 'px';
                };
                MyAppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-house',
                        templateUrl: './app/app-webpage/app.webpage.html',
                        directives: [
                            //Components for Main Layout
                            header_component_1.HeaderComponent,
                            footer_component_1.FooterComponent,
                            //Routing Directives
                            router_deprecated_1.RouterOutlet,
                            router_deprecated_1.ROUTER_DIRECTIVES
                        ],
                        providers: [global_article_page_service_1.ArticleDataService, global_ai_headline_module_service_1.HeadlineDataService, global_service_1.PartnerHeader],
                        pipes: [safe_pipe_1.SanitizeHtml, safe_pipe_2.SanitizeStyle]
                    }),
                    router_deprecated_1.RouteConfig([
                        //Home Page
                        {
                            path: '/',
                            name: 'Home-page',
                            component: deep_dive_page_1.DeepDivePage,
                            useAsDefault: true
                        },
                        {
                            path: '/pick-a-team',
                            name: 'Pick-team-page',
                            component: home_page_page_1.PickTeamPage,
                        },
                        //Profile Pages
                        {
                            path: '/mlb',
                            name: 'MLB-page',
                            component: mlb_page_1.MLBPage,
                        },
                        {
                            path: '/t/:teamName/:teamId',
                            name: 'Team-page',
                            component: team_page_1.TeamPage,
                        },
                        {
                            path: '/p/:teamName/:fullName/:playerId',
                            name: 'Player-page',
                            component: player_page_1.PlayerPage,
                        },
                        //Misc. Pages
                        {
                            path: '/dir/:type/:startsWith/page/:page',
                            name: 'Directory-page-starts-with',
                            component: directory_page_1.DirectoryPage,
                        },
                        {
                            path: '/about',
                            name: 'About-us-page',
                            component: about_us_page_1.AboutUsPage,
                        },
                        {
                            path: '/contactus',
                            name: 'Contact-us-page',
                            component: contactus_page_1.ContactUsPage,
                        },
                        {
                            path: '/disclaimer',
                            name: 'Disclaimer-page',
                            component: disclaimer_page_1.DisclaimerPage,
                        },
                        {
                            path: '/s/:query',
                            name: 'Search-page',
                            component: search_page_1.SearchPage
                        },
                        //Module Pages
                        {
                            path: '/mvp-list/:type/:pageNum',
                            name: 'MVP-list-page',
                            component: mvp_list_page_1.MVPListPage
                        },
                        {
                            path: '/mvp-list/:type/:tab/:pageNum',
                            name: 'MVP-list-tab-page',
                            component: mvp_list_page_1.MVPListPage
                        },
                        {
                            path: '/schedules/mlb/:pageNum',
                            name: 'Schedules-page-league',
                            component: schedules_page_1.SchedulesPage
                        },
                        {
                            path: '/schedules/mlb/:tab/:pageNum',
                            name: 'Schedules-page-league-tab',
                            component: schedules_page_1.SchedulesPage
                        },
                        {
                            path: '/schedules/:teamName/:teamId/:pageNum',
                            name: 'Schedules-page-team',
                            component: schedules_page_1.SchedulesPage
                        },
                        {
                            path: '/schedules/:teamName/:tab/:teamId/:pageNum',
                            name: 'Schedules-page-team-tab',
                            component: schedules_page_1.SchedulesPage
                        },
                        {
                            path: '/standings',
                            name: 'Standings-page',
                            component: standings_page_1.StandingsPage
                        },
                        {
                            path: '/standings/:type',
                            name: 'Standings-page-league',
                            component: standings_page_1.StandingsPage
                        },
                        {
                            path: '/standings/:type/:teamName/:teamId',
                            name: 'Standings-page-team',
                            component: standings_page_1.StandingsPage
                        },
                        {
                            path: '/list/:query',
                            name: 'Dynamic-list-page',
                            component: list_page_1.ListPage
                        },
                        {
                            path: '/list/:profile/:listname/:sort/:conference/:division/:limit/:pageNum',
                            name: 'List-page',
                            component: list_page_1.ListPage
                        },
                        {
                            path: '/draft-history',
                            name: 'Draft-history-mlb-page',
                            component: draft_history_page_1.DraftHistoryPage
                        },
                        {
                            path: '/draft-history/:teamName/:teamId',
                            name: 'Draft-history-page',
                            component: draft_history_page_1.DraftHistoryPage
                        },
                        {
                            path: '/transactions/:teamName/:teamId/:limit/:pageNum',
                            name: 'Transactions-page',
                            component: transactions_page_1.TransactionsPage
                        },
                        {
                            path: '/transactions/league/:limit/:pageNum',
                            name: 'Transactions-mlb-page',
                            component: transactions_page_1.TransactionsPage
                        },
                        {
                            path: '/team-roster/:teamName/:teamId',
                            name: 'Team-roster-page',
                            component: team_roster_page_1.TeamRosterPage
                        },
                        {
                            path: '/season-stats/:fullName/:playerId',
                            name: 'Season-stats-page',
                            component: season_stats_page_1.SeasonStatsPage
                        },
                        {
                            path: '/p-stats/:teamName/:teamId',
                            name: 'Player-stats-page',
                            component: player_stats_page_1.PlayerStatsPage
                        },
                        {
                            path: '/articles/:eventType/:eventID',
                            name: 'Article-pages',
                            component: article_pages_page_1.ArticlePages
                        },
                        {
                            path: '/list-of-lists/:scope/:type/:id/:limit/:pageNum',
                            name: 'List-of-lists-page-scoped',
                            component: list_of_lists_page_1.ListOfListsPage
                        },
                        {
                            path: '/list-of-lists/:type/:id/:limit/:pageNum',
                            name: 'List-of-lists-page',
                            component: list_of_lists_page_1.ListOfListsPage
                        },
                        {
                            path: '/list-of-lists/league/:limit/:pageNum',
                            name: 'List-of-lists-league-page',
                            component: list_of_lists_page_1.ListOfListsPage
                        },
                        //Error pages and error handling
                        {
                            path: '/error',
                            name: 'Error-page',
                            component: error_page_page_1.ErrorPage
                        },
                        {
                            path: '/not-found',
                            name: 'NotFound-page',
                            component: error_page_page_1.ErrorPage
                        },
                        {
                            path: '/*path',
                            redirectTo: ['NotFound-page']
                        },
                        // Test Pages - TODO: remove after testing
                        {
                            path: '/modules/:teamID',
                            name: 'Module-page',
                            component: module_page_1.ModulePage
                        },
                        {
                            path: '/design/:teamId',
                            name: 'Design-page',
                            component: design_page_1.DesignPage,
                        },
                        {
                            path: '/images-test',
                            name: 'Images-test-page',
                            component: images_test_page_1.ImagesTestPage,
                        }
                    ]), 
                    __metadata('design:paramtypes', [global_service_1.PartnerHeader, router_deprecated_1.RouteParams])
                ], MyAppComponent);
                return MyAppComponent;
            }());
            exports_1("MyAppComponent", MyAppComponent);
        }
    }
});
