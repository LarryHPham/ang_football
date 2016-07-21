System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', "../../global/global-functions", "../../global/global-settings", '../../components/loading/loading.component', '../../components/error/error.component', '../../modules/comment/comment.module', "../../modules/likeus/likeus.module", '../../components/headline/headline.component', '../../modules/about-us/about-us.module', "../../modules/articles/articles.module", "../../modules/twitter/twitter.module", '../../services/twitter.service', '../../modules/share/share.module', "../../modules/dyk/dyk.module", '../../services/dyk.service', "../../modules/faq/faq.module", '../../services/faq.service', '../../modules/box-scores/box-scores.module', '../../services/box-scores.service', '../../modules/comparison/comparison.module', '../../services/comparison-stats.service', '../../modules/standings/standings.module', '../../services/standings.service', '../../services/schedules.service', '../../modules/schedules/schedules.module', '../../modules/team-roster/team-roster.module', '../../services/roster.service', '../../modules/profile-header/profile-header.module', '../../services/profile-header.service', '../../modules/news/news.module', '../../services/news.service', '../../modules/player-stats/player-stats.module', '../../services/player-stats.service', '../../modules/draft-history/draft-history.module', "../../components/carousels/images-media-carousel/images-media-carousel.component", "../../services/carousel.service", "../../modules/list-of-lists/list-of-lists.module", "../../services/list-of-lists.service", "../../modules/transactions/transactions.module", "../../services/transactions.service", "../../modules/daily-update/daily-update.module", "../../services/daily-update.service", "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, global_functions_1, global_settings_1, loading_component_1, error_component_1, comment_module_1, likeus_module_1, headline_component_1, about_us_module_1, articles_module_1, twitter_module_1, twitter_service_1, share_module_1, dyk_module_1, dyk_service_1, faq_module_1, faq_service_1, box_scores_module_1, box_scores_service_1, comparison_module_1, comparison_stats_service_1, standings_module_1, standings_service_1, schedules_service_1, schedules_module_1, team_roster_module_1, roster_service_1, profile_header_module_1, profile_header_service_1, news_module_1, news_service_1, player_stats_module_1, player_stats_service_1, draft_history_module_1, images_media_carousel_component_1, carousel_service_1, list_of_lists_module_1, list_of_lists_service_1, transactions_module_1, transactions_service_1, daily_update_module_1, daily_update_service_1, sidekick_wrapper_component_1, responsive_widget_component_1;
    var TeamPage;
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
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (comment_module_1_1) {
                comment_module_1 = comment_module_1_1;
            },
            function (likeus_module_1_1) {
                likeus_module_1 = likeus_module_1_1;
            },
            function (headline_component_1_1) {
                headline_component_1 = headline_component_1_1;
            },
            function (about_us_module_1_1) {
                about_us_module_1 = about_us_module_1_1;
            },
            function (articles_module_1_1) {
                articles_module_1 = articles_module_1_1;
            },
            function (twitter_module_1_1) {
                twitter_module_1 = twitter_module_1_1;
            },
            function (twitter_service_1_1) {
                twitter_service_1 = twitter_service_1_1;
            },
            function (share_module_1_1) {
                share_module_1 = share_module_1_1;
            },
            function (dyk_module_1_1) {
                dyk_module_1 = dyk_module_1_1;
            },
            function (dyk_service_1_1) {
                dyk_service_1 = dyk_service_1_1;
            },
            function (faq_module_1_1) {
                faq_module_1 = faq_module_1_1;
            },
            function (faq_service_1_1) {
                faq_service_1 = faq_service_1_1;
            },
            function (box_scores_module_1_1) {
                box_scores_module_1 = box_scores_module_1_1;
            },
            function (box_scores_service_1_1) {
                box_scores_service_1 = box_scores_service_1_1;
            },
            function (comparison_module_1_1) {
                comparison_module_1 = comparison_module_1_1;
            },
            function (comparison_stats_service_1_1) {
                comparison_stats_service_1 = comparison_stats_service_1_1;
            },
            function (standings_module_1_1) {
                standings_module_1 = standings_module_1_1;
            },
            function (standings_service_1_1) {
                standings_service_1 = standings_service_1_1;
            },
            function (schedules_service_1_1) {
                schedules_service_1 = schedules_service_1_1;
            },
            function (schedules_module_1_1) {
                schedules_module_1 = schedules_module_1_1;
            },
            function (team_roster_module_1_1) {
                team_roster_module_1 = team_roster_module_1_1;
            },
            function (roster_service_1_1) {
                roster_service_1 = roster_service_1_1;
            },
            function (profile_header_module_1_1) {
                profile_header_module_1 = profile_header_module_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (news_module_1_1) {
                news_module_1 = news_module_1_1;
            },
            function (news_service_1_1) {
                news_service_1 = news_service_1_1;
            },
            function (player_stats_module_1_1) {
                player_stats_module_1 = player_stats_module_1_1;
            },
            function (player_stats_service_1_1) {
                player_stats_service_1 = player_stats_service_1_1;
            },
            function (draft_history_module_1_1) {
                draft_history_module_1 = draft_history_module_1_1;
            },
            function (images_media_carousel_component_1_1) {
                images_media_carousel_component_1 = images_media_carousel_component_1_1;
            },
            function (carousel_service_1_1) {
                carousel_service_1 = carousel_service_1_1;
            },
            function (list_of_lists_module_1_1) {
                list_of_lists_module_1 = list_of_lists_module_1_1;
            },
            function (list_of_lists_service_1_1) {
                list_of_lists_service_1 = list_of_lists_service_1_1;
            },
            function (transactions_module_1_1) {
                transactions_module_1 = transactions_module_1_1;
            },
            function (transactions_service_1_1) {
                transactions_service_1 = transactions_service_1_1;
            },
            function (daily_update_module_1_1) {
                daily_update_module_1 = daily_update_module_1_1;
            },
            function (daily_update_service_1_1) {
                daily_update_service_1 = daily_update_service_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            TeamPage = (function () {
                function TeamPage(_params, _router, _title, _standingsService, _boxScores, _schedulesService, _profileService, _lolService, _transactionsService, _imagesService, _playerStatsService, _rosterService, _newsService, _faqService, _dykService, _twitterService, _comparisonService, _dailyUpdateService) {
                    var _this = this;
                    this._params = _params;
                    this._router = _router;
                    this._title = _title;
                    this._standingsService = _standingsService;
                    this._boxScores = _boxScores;
                    this._schedulesService = _schedulesService;
                    this._profileService = _profileService;
                    this._lolService = _lolService;
                    this._transactionsService = _transactionsService;
                    this._imagesService = _imagesService;
                    this._playerStatsService = _playerStatsService;
                    this._rosterService = _rosterService;
                    this._newsService = _newsService;
                    this._faqService = _faqService;
                    this._dykService = _dykService;
                    this._twitterService = _twitterService;
                    this._comparisonService = _comparisonService;
                    this._dailyUpdateService = _dailyUpdateService;
                    this.widgetPlace = "widgetForModule";
                    this.partnerID = null;
                    this.hasError = false;
                    this.profileType = "team";
                    this.isProfilePage = true;
                    this.pageParams = {
                        teamId: Number(_params.get("teamId"))
                    };
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) {
                        _this.partnerID = partnerID;
                    });
                }
                TeamPage.prototype.ngOnInit = function () {
                    var currDate = new Date();
                    //   this.currentYear = currDate.getFullYear();
                    var currentUnixDate = currDate.getTime();
                    //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
                    this.dateParam = {
                        profile: 'team',
                        teamId: this.pageParams.teamId,
                        date: moment.tz(currentUnixDate, 'America/New_York').format('YYYY-MM-DD')
                    };
                    this.setupProfileData();
                };
                /**
                 *
                 * Profile Header data is needed to fill in data info for other modules.
                 * It is required to synchronously aquire data first before making any asynchronous
                 * calls from other modules.
                 *
                 **/
                TeamPage.prototype.setupProfileData = function () {
                    var _this = this;
                    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(function (data) {
                        /*** About the [Team Name] ***/
                        _this.pageParams = data.pageParams;
                        _this.profileData = data;
                        _this.profileName = data.teamName;
                        _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle(_this.profileName));
                        _this.profileHeaderData = _this._profileService.convertToTeamProfileHeader(data);
                        _this.dailyUpdateModule(_this.pageParams.teamId);
                        /*** Keep Up With Everything [Team Name] ***/
                        _this.getBoxScores(_this.dateParam);
                        _this.getSchedulesData('pre-event'); //grab pre event data for upcoming games
                        _this.standingsData = _this._standingsService.loadAllTabsForModule(_this.pageParams, _this.pageParams.teamId, data.teamName);
                        _this.rosterData = _this._rosterService.loadAllTabsForModule(_this.pageParams.teamId, data.teamName, _this.pageParams.conference, true);
                        _this.playerStatsData = _this._playerStatsService.loadAllTabsForModule(_this.pageParams.teamId, data.teamName, true);
                        _this.transactionsData = _this._transactionsService.loadAllTabsForModule(data.teamName, _this.pageParams.teamId);
                        //this.loadMVP
                        _this.setupComparisonData();
                        /*** Other [League Name] Content You May Love ***/
                        _this.getImages(_this.imageData);
                        _this.getDykService();
                        _this.getFaqService();
                        _this.setupListOfListsModule();
                        _this.getNewsService();
                        /*** Interact With [League Name]’s Fans ***/
                        _this.getTwitterService();
                        _this.setupShareModule();
                    }, function (err) {
                        _this.hasError = true;
                        console.log("Error getting team profile data for " + _this.pageParams.teamId, err);
                    });
                };
                TeamPage.prototype.dailyUpdateModule = function (teamId) {
                    var _this = this;
                    this._dailyUpdateService.getTeamDailyUpdate(teamId)
                        .subscribe(function (data) {
                        _this.dailyUpdateData = data;
                    }, function (err) {
                        _this.dailyUpdateData = _this._dailyUpdateService.getErrorData();
                        console.log("Error getting daily update data", err);
                    });
                };
                TeamPage.prototype.getTwitterService = function () {
                    var _this = this;
                    this._twitterService.getTwitterService(this.profileType, this.pageParams.teamId)
                        .subscribe(function (data) {
                        _this.twitterData = data;
                    }, function (err) {
                        console.log("Error getting twitter data");
                    });
                };
                TeamPage.prototype.getDykService = function () {
                    var _this = this;
                    this._dykService.getDykService(this.profileType, this.pageParams.teamId)
                        .subscribe(function (data) {
                        _this.dykData = data;
                    }, function (err) {
                        console.log("Error getting did you know data");
                    });
                };
                TeamPage.prototype.getFaqService = function () {
                    var _this = this;
                    this._faqService.getFaqService(this.profileType, this.pageParams.teamId)
                        .subscribe(function (data) {
                        _this.faqData = data;
                    }, function (err) {
                        console.log("Error getting faq data for team", err);
                    });
                };
                TeamPage.prototype.getNewsService = function () {
                    var _this = this;
                    this._newsService.getNewsService(this.profileName)
                        .subscribe(function (data) {
                        _this.newsDataArray = data.news;
                    }, function (err) {
                        console.log("Error getting news data");
                    });
                };
                //api for BOX SCORES
                TeamPage.prototype.getBoxScores = function (dateParams) {
                    var _this = this;
                    if (dateParams != null) {
                        this.dateParam = dateParams;
                    }
                    this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, function (boxScoresData, currentBoxScores) {
                        _this.boxScoresData = boxScoresData;
                        _this.currentBoxScores = currentBoxScores;
                    });
                };
                //grab tab to make api calls for post of pre event table
                TeamPage.prototype.scheduleTab = function (tab) {
                    if (tab == 'Upcoming Games') {
                        this.getSchedulesData('pre-event');
                    }
                    else if (tab == 'Previous Games') {
                        this.getSchedulesData('post-event');
                    }
                    else {
                        this.getSchedulesData('post-event'); // fall back just in case no status event is present
                    }
                };
                //api for Schedules
                TeamPage.prototype.getSchedulesData = function (status) {
                    var _this = this;
                    var limit = 5;
                    this._schedulesService.getSchedulesService('team', status, limit, 1, true, this.pageParams.teamId) // isTeamProfilePage = true
                        .subscribe(function (data) {
                        _this.schedulesData = data;
                    }, function (err) {
                        console.log("Error getting Schedules Data");
                    });
                };
                TeamPage.prototype.getImages = function (imageData) {
                    var _this = this;
                    this._imagesService.getImages(this.profileType, this.pageParams.teamId)
                        .subscribe(function (data) {
                        return _this.imageData = data.imageArray, _this.copyright = data.copyArray, _this.imageTitle = data.titleArray;
                    }, function (err) {
                        console.log("Error getting image data" + err);
                    });
                };
                TeamPage.prototype.setupComparisonData = function () {
                    var _this = this;
                    this._comparisonService.getInitialPlayerStats(this.pageParams).subscribe(function (data) {
                        _this.comparisonModuleData = data;
                    }, function (err) {
                        console.log("Error getting comparison data for " + _this.pageParams.teamId, err);
                    });
                };
                TeamPage.prototype.standingsTabSelected = function (tabData) {
                    //only show 5 rows in the module
                    this._standingsService.getStandingsTabData(tabData, this.pageParams, function (data) { }, 5);
                };
                TeamPage.prototype.playerStatsTabSelected = function (tabData) {
                    //only show 4 rows in the module
                    this._playerStatsService.getStatsTabData(tabData, this.pageParams, function (data) { }, 5);
                };
                TeamPage.prototype.setupShareModule = function () {
                    var profileHeaderData = this.profileHeaderData;
                    var imageUrl = !profileHeaderData.profileImageUrl ? global_settings_1.GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
                    var shareText = !profileHeaderData.profileName ?
                        'Share This Profile Below' :
                        'Share ' + global_functions_1.GlobalFunctions.convertToPossessive(profileHeaderData.profileName) + ' Profile Below:';
                    this.shareModuleInput = {
                        imageUrl: imageUrl,
                        shareText: shareText
                    };
                };
                TeamPage.prototype.transactionsTab = function (tab) {
                    this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'module')
                        .subscribe(function (transactionsData) {
                        //do nothing
                    }, function (err) {
                        console.log('Error: transactionsData API: ', err);
                    });
                };
                TeamPage.prototype.setupListOfListsModule = function () {
                    var _this = this;
                    var params = {
                        id: this.pageParams.teamId,
                        limit: 5,
                        pageNum: 1
                    };
                    this._lolService.getListOfListsService(params, "team", "module")
                        .subscribe(function (listOfListsData) {
                        _this.listOfListsData = listOfListsData.listData;
                        _this.listOfListsData["type"] = "team";
                        _this.listOfListsData["id"] = _this.pageParams.teamId;
                    }, function (err) {
                        console.log('Error: listOfListsData API: ', err);
                    });
                };
                TeamPage = __decorate([
                    core_1.Component({
                        selector: 'Team-page',
                        templateUrl: './app/webpages/team-page/team.page.html',
                        directives: [
                            sidekick_wrapper_component_1.SidekickWrapper,
                            loading_component_1.LoadingComponent,
                            error_component_1.ErrorComponent,
                            daily_update_module_1.DailyUpdateModule,
                            schedules_module_1.SchedulesModule,
                            box_scores_module_1.BoxScoresModule,
                            draft_history_module_1.DraftHistoryModule,
                            headline_component_1.HeadlineComponent,
                            profile_header_module_1.ProfileHeaderModule,
                            standings_module_1.StandingsModule,
                            comment_module_1.CommentModule,
                            dyk_module_1.DYKModule,
                            faq_module_1.FAQModule,
                            likeus_module_1.LikeUs,
                            twitter_module_1.TwitterModule,
                            comparison_module_1.ComparisonModule,
                            share_module_1.ShareModule,
                            team_roster_module_1.TeamRosterModule,
                            news_module_1.NewsModule,
                            about_us_module_1.AboutUsModule,
                            articles_module_1.ArticlesModule,
                            images_media_carousel_component_1.ImagesMedia,
                            list_of_lists_module_1.ListOfListsModule,
                            player_stats_module_1.PlayerStatsModule,
                            transactions_module_1.TransactionsModule,
                            responsive_widget_component_1.ResponsiveWidget
                        ],
                        providers: [
                            box_scores_service_1.BoxScoresService,
                            schedules_service_1.SchedulesService,
                            standings_service_1.StandingsService,
                            profile_header_service_1.ProfileHeaderService,
                            roster_service_1.RosterService,
                            list_of_lists_service_1.ListOfListsService,
                            carousel_service_1.ImagesService,
                            news_service_1.NewsService,
                            faq_service_1.FaqService,
                            dyk_service_1.DykService,
                            player_stats_service_1.PlayerStatsService,
                            transactions_service_1.TransactionsService,
                            comparison_stats_service_1.ComparisonStatsService,
                            daily_update_service_1.DailyUpdateService,
                            twitter_service_1.TwitterService,
                            platform_browser_1.Title
                        ]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, platform_browser_1.Title, standings_service_1.StandingsService, box_scores_service_1.BoxScoresService, schedules_service_1.SchedulesService, profile_header_service_1.ProfileHeaderService, list_of_lists_service_1.ListOfListsService, transactions_service_1.TransactionsService, carousel_service_1.ImagesService, player_stats_service_1.PlayerStatsService, roster_service_1.RosterService, news_service_1.NewsService, faq_service_1.FaqService, dyk_service_1.DykService, twitter_service_1.TwitterService, comparison_stats_service_1.ComparisonStatsService, daily_update_service_1.DailyUpdateService])
                ], TeamPage);
                return TeamPage;
            }());
            exports_1("TeamPage", TeamPage);
        }
    }
});
