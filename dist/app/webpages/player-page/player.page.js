System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../components/loading/loading.component', '../../components/error/error.component', '../../modules/about-us/about-us.module', "../../modules/likeus/likeus.module", "../../modules/dyk/dyk.module", '../../services/dyk.service', "../../modules/faq/faq.module", '../../services/faq.service', '../../modules/box-scores/box-scores.module', '../../services/box-scores.service', "../../modules/twitter/twitter.module", '../../services/twitter.service', '../../services/season-stats.service', '../../modules/season-stats/season-stats.module', '../../modules/comparison/comparison.module', '../../services/comparison-stats.service', '../../modules/comment/comment.module', '../../modules/standings/standings.module', '../../services/standings.service', '../../modules/profile-header/profile-header.module', '../../services/profile-header.service', '../../modules/share/share.module', '../../components/headline/headline.component', '../../modules/news/news.module', '../../services/news.service', '../../modules/schedules/schedules.module', '../../services/schedules.service', "../../global/global-settings", "../../services/carousel.service", "../../components/carousels/images-media-carousel/images-media-carousel.component", "../../global/global-functions", "../../services/list-of-lists.service", "../../modules/list-of-lists/list-of-lists.module", "../../modules/daily-update/daily-update.module", "../../services/daily-update.service", "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, loading_component_1, error_component_1, about_us_module_1, likeus_module_1, dyk_module_1, dyk_service_1, faq_module_1, faq_service_1, box_scores_module_1, box_scores_service_1, twitter_module_1, twitter_service_1, season_stats_service_1, season_stats_module_1, comparison_module_1, comparison_stats_service_1, comment_module_1, standings_module_1, standings_service_1, profile_header_module_1, profile_header_service_1, share_module_1, headline_component_1, news_module_1, news_service_1, schedules_module_1, schedules_service_1, global_settings_1, carousel_service_1, images_media_carousel_component_1, global_functions_1, list_of_lists_service_1, list_of_lists_module_1, daily_update_module_1, daily_update_service_1, sidekick_wrapper_component_1, responsive_widget_component_1;
    var PlayerPage;
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
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (about_us_module_1_1) {
                about_us_module_1 = about_us_module_1_1;
            },
            function (likeus_module_1_1) {
                likeus_module_1 = likeus_module_1_1;
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
            function (twitter_module_1_1) {
                twitter_module_1 = twitter_module_1_1;
            },
            function (twitter_service_1_1) {
                twitter_service_1 = twitter_service_1_1;
            },
            function (season_stats_service_1_1) {
                season_stats_service_1 = season_stats_service_1_1;
            },
            function (season_stats_module_1_1) {
                season_stats_module_1 = season_stats_module_1_1;
            },
            function (comparison_module_1_1) {
                comparison_module_1 = comparison_module_1_1;
            },
            function (comparison_stats_service_1_1) {
                comparison_stats_service_1 = comparison_stats_service_1_1;
            },
            function (comment_module_1_1) {
                comment_module_1 = comment_module_1_1;
            },
            function (standings_module_1_1) {
                standings_module_1 = standings_module_1_1;
            },
            function (standings_service_1_1) {
                standings_service_1 = standings_service_1_1;
            },
            function (profile_header_module_1_1) {
                profile_header_module_1 = profile_header_module_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (share_module_1_1) {
                share_module_1 = share_module_1_1;
            },
            function (headline_component_1_1) {
                headline_component_1 = headline_component_1_1;
            },
            function (news_module_1_1) {
                news_module_1 = news_module_1_1;
            },
            function (news_service_1_1) {
                news_service_1 = news_service_1_1;
            },
            function (schedules_module_1_1) {
                schedules_module_1 = schedules_module_1_1;
            },
            function (schedules_service_1_1) {
                schedules_service_1 = schedules_service_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (carousel_service_1_1) {
                carousel_service_1 = carousel_service_1_1;
            },
            function (images_media_carousel_component_1_1) {
                images_media_carousel_component_1 = images_media_carousel_component_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (list_of_lists_service_1_1) {
                list_of_lists_service_1 = list_of_lists_service_1_1;
            },
            function (list_of_lists_module_1_1) {
                list_of_lists_module_1 = list_of_lists_module_1_1;
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
            PlayerPage = (function () {
                function PlayerPage(_params, _router, _title, _standingsService, _boxScores, _schedulesService, _profileService, _imagesService, _newsService, _faqService, _dykService, _lolService, _twitterService, _seasonStatsService, _comparisonService, _dailyUpdateService) {
                    var _this = this;
                    this._params = _params;
                    this._router = _router;
                    this._title = _title;
                    this._standingsService = _standingsService;
                    this._boxScores = _boxScores;
                    this._schedulesService = _schedulesService;
                    this._profileService = _profileService;
                    this._imagesService = _imagesService;
                    this._newsService = _newsService;
                    this._faqService = _faqService;
                    this._dykService = _dykService;
                    this._lolService = _lolService;
                    this._twitterService = _twitterService;
                    this._seasonStatsService = _seasonStatsService;
                    this._comparisonService = _comparisonService;
                    this._dailyUpdateService = _dailyUpdateService;
                    this.widgetPlace = "widgetForModule";
                    this.partnerID = null;
                    this.hasError = false;
                    this.profileType = "player";
                    this.isProfilePage = true;
                    this.pageParams = {
                        playerId: Number(_params.get("playerId"))
                    };
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) {
                        _this.partnerID = partnerID;
                    });
                }
                PlayerPage.prototype.ngOnInit = function () {
                    this.setupPlayerProfileData();
                };
                PlayerPage.prototype.setupPlayerProfileData = function () {
                    var _this = this;
                    this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(function (data) {
                        /*** About [Player Name] ***/
                        _this.pageParams = data.pageParams;
                        _this.profileName = data.headerData.info.playerName;
                        _this.teamName = data.headerData.info.teamName;
                        _this.teamId = data.headerData.info.teamId;
                        _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle(_this.profileName));
                        _this.profileHeaderData = _this._profileService.convertToPlayerProfileHeader(data);
                        _this.setupTeamProfileData();
                        _this.dailyUpdateModule(_this.pageParams.playerId);
                        //get current date for box-scores
                        var currentUnixDate = new Date().getTime();
                        _this.dateParam = {
                            profile: 'player',
                            teamId: _this.teamId,
                            date: moment.tz(currentUnixDate, 'America/New_York').format('YYYY-MM-DD')
                        };
                        _this.getBoxScores(_this.dateParam);
                        /*** Keep Up With Everything [Player Name] ***/
                        _this.getSchedulesData('pre-event'); //grab pre event data for upcoming games
                        _this.setupSeasonstatsData();
                        _this.setupComparisonData();
                        /*** Other [League Name] Content You May Love ***/
                        _this.getImages(_this.imageData);
                        _this.getDykService();
                        _this.getFaqService();
                        _this.setupListOfListsModule();
                        _this.getNewsService();
                        /*** Interact With [League Name]’s Fans ***/
                        _this.setupShareModule();
                        _this.getTwitterService();
                    }, function (err) {
                        _this.hasError = true;
                        console.log("Error getting player profile data for " + _this.pageParams.playerId + ": " + err);
                    });
                };
                PlayerPage.prototype.dailyUpdateModule = function (playerId) {
                    var _this = this;
                    this._dailyUpdateService.getPlayerDailyUpdate(playerId)
                        .subscribe(function (data) {
                        _this.dailyUpdateData = data;
                    }, function (err) {
                        _this.dailyUpdateData = _this._dailyUpdateService.getErrorData();
                        console.log("Error getting daily update data", err);
                    });
                };
                //grab tab to make api calls for post of pre event table
                PlayerPage.prototype.scheduleTab = function (tab) {
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
                PlayerPage.prototype.setupSeasonstatsData = function () {
                    var _this = this;
                    this._seasonStatsService.getPlayerStats(this.pageParams.playerId)
                        .subscribe(function (data) {
                        _this.seasonStatsData = data;
                    }, function (err) {
                        console.log("Error getting season stats data for " + _this.pageParams.playerId, err);
                    });
                };
                //api for Schedules
                PlayerPage.prototype.getSchedulesData = function (status) {
                    var _this = this;
                    var limit = 5;
                    if (status == 'post-event') {
                        limit = 3;
                    }
                    this._schedulesService.getSchedulesService('team', status, limit, 1, false, this.pageParams.teamId) // isTeamProfilePage = false
                        .subscribe(function (data) {
                        _this.schedulesData = data;
                    }, function (err) {
                        console.log("Error getting Schedules Data");
                    });
                };
                PlayerPage.prototype.getTwitterService = function () {
                    var _this = this;
                    this._twitterService.getTwitterService("team", this.pageParams.teamId) //getting team twitter information for now
                        .subscribe(function (data) {
                        _this.twitterData = data;
                    }, function (err) {
                        console.log("Error getting twitter data");
                    });
                };
                PlayerPage.prototype.getDykService = function () {
                    var _this = this;
                    this._dykService.getDykService(this.profileType, this.pageParams.playerId)
                        .subscribe(function (data) {
                        _this.dykData = data;
                    }, function (err) {
                        console.log("Error getting did you know data");
                    });
                };
                PlayerPage.prototype.getFaqService = function () {
                    var _this = this;
                    this._faqService.getFaqService(this.profileType, this.pageParams.playerId)
                        .subscribe(function (data) {
                        _this.faqData = data;
                    }, function (err) {
                        console.log("Error getting faq data for player", err);
                    });
                };
                PlayerPage.prototype.getNewsService = function () {
                    var _this = this;
                    this._newsService.getNewsService(this.profileName)
                        .subscribe(function (data) {
                        _this.newsDataArray = data.news;
                    }, function (err) {
                        console.log("Error getting news data");
                    });
                };
                //api for BOX SCORES
                //function for MLB/Team Profiles
                PlayerPage.prototype.getBoxScores = function (dateParams) {
                    var _this = this;
                    if (dateParams != null) {
                        this.dateParam = dateParams;
                    }
                    this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, function (boxScoresData, currentBoxScores) {
                        _this.boxScoresData = boxScoresData;
                        _this.currentBoxScores = currentBoxScores;
                    });
                };
                PlayerPage.prototype.getImages = function (imageData) {
                    var _this = this;
                    this._imagesService.getImages(this.profileType, this.pageParams.playerId)
                        .subscribe(function (data) {
                        return _this.imageData = data.imageArray, _this.copyright = data.copyArray, _this.imageTitle = data.titleArray;
                    }, function (err) {
                        console.log("Error getting image data" + err);
                    });
                };
                //This gets team-specific data such as
                // conference and division
                PlayerPage.prototype.setupTeamProfileData = function () {
                    var _this = this;
                    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(function (data) {
                        _this.standingsData = _this._standingsService.loadAllTabsForModule(data.pageParams, null, data.teamName);
                    }, function (err) {
                        console.log("Error getting player profile data for " + _this.pageParams.playerId + ": " + err);
                    });
                };
                PlayerPage.prototype.standingsTabSelected = function (tabData) {
                    //only show 5 rows in the module;
                    this._standingsService.getStandingsTabData(tabData, this.pageParams, function (data) { }, 5);
                };
                PlayerPage.prototype.setupComparisonData = function () {
                    var _this = this;
                    this._comparisonService.getInitialPlayerStats(this.pageParams).subscribe(function (data) {
                        _this.comparisonModuleData = data;
                    }, function (err) {
                        console.log("Error getting comparison data for " + _this.pageParams.playerId, err);
                    });
                };
                PlayerPage.prototype.setupShareModule = function () {
                    var profileHeaderData = this.profileHeaderData;
                    var imageUrl = typeof profileHeaderData.profileImageUrl === 'undefined' || profileHeaderData.profileImageUrl === null ? global_settings_1.GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
                    var shareText = typeof profileHeaderData.profileName === 'undefined' || profileHeaderData.profileName === null ?
                        'Share This Profile Below' :
                        'Share ' + global_functions_1.GlobalFunctions.convertToPossessive(profileHeaderData.profileName) + ' Profile Below:';
                    this.shareModuleInput = {
                        imageUrl: imageUrl,
                        shareText: shareText
                    };
                };
                PlayerPage.prototype.setupListOfListsModule = function () {
                    var _this = this;
                    var params = {
                        id: this.pageParams.playerId,
                        limit: 5,
                        pageNum: 1
                    };
                    this._lolService.getListOfListsService(params, "player", "module")
                        .subscribe(function (listOfListsData) {
                        _this.listOfListsData = listOfListsData.listData;
                        _this.listOfListsData["type"] = "player";
                        _this.listOfListsData["id"] = _this.pageParams.playerId;
                    }, function (err) {
                        console.log('Error: listOfListsData API: ', err);
                    });
                };
                PlayerPage = __decorate([
                    core_1.Component({
                        selector: 'Player-page',
                        templateUrl: './app/webpages/player-page/player.page.html',
                        directives: [
                            sidekick_wrapper_component_1.SidekickWrapper,
                            loading_component_1.LoadingComponent,
                            error_component_1.ErrorComponent,
                            schedules_module_1.SchedulesModule,
                            box_scores_module_1.BoxScoresModule,
                            profile_header_module_1.ProfileHeaderModule,
                            standings_module_1.StandingsModule,
                            headline_component_1.HeadlineComponent,
                            comment_module_1.CommentModule,
                            dyk_module_1.DYKModule,
                            faq_module_1.FAQModule,
                            likeus_module_1.LikeUs,
                            twitter_module_1.TwitterModule,
                            season_stats_module_1.SeasonStatsModule,
                            comparison_module_1.ComparisonModule,
                            news_module_1.NewsModule,
                            share_module_1.ShareModule,
                            about_us_module_1.AboutUsModule,
                            list_of_lists_module_1.ListOfListsModule,
                            daily_update_module_1.DailyUpdateModule,
                            images_media_carousel_component_1.ImagesMedia,
                            responsive_widget_component_1.ResponsiveWidget
                        ],
                        providers: [
                            box_scores_service_1.BoxScoresService,
                            schedules_service_1.SchedulesService,
                            standings_service_1.StandingsService,
                            profile_header_service_1.ProfileHeaderService,
                            carousel_service_1.ImagesService,
                            news_service_1.NewsService,
                            faq_service_1.FaqService,
                            dyk_service_1.DykService,
                            list_of_lists_service_1.ListOfListsService,
                            season_stats_service_1.SeasonStatsService,
                            comparison_stats_service_1.ComparisonStatsService,
                            daily_update_service_1.DailyUpdateService,
                            twitter_service_1.TwitterService,
                            platform_browser_1.Title
                        ],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, platform_browser_1.Title, standings_service_1.StandingsService, box_scores_service_1.BoxScoresService, schedules_service_1.SchedulesService, profile_header_service_1.ProfileHeaderService, carousel_service_1.ImagesService, news_service_1.NewsService, faq_service_1.FaqService, dyk_service_1.DykService, list_of_lists_service_1.ListOfListsService, twitter_service_1.TwitterService, season_stats_service_1.SeasonStatsService, comparison_stats_service_1.ComparisonStatsService, daily_update_service_1.DailyUpdateService])
                ], PlayerPage);
                return PlayerPage;
            }());
            exports_1("PlayerPage", PlayerPage);
        }
    }
});
