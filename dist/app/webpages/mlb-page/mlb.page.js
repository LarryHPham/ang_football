System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../components/loading/loading.component', '../../components/error/error.component', '../../modules/about-us/about-us.module', "../../modules/likeus/likeus.module", "../../modules/twitter/twitter.module", '../../services/twitter.service', '../../modules/comparison/comparison.module', '../../services/comparison-stats.service', '../../modules/share/share.module', '../../modules/comment/comment.module', "../../modules/dyk/dyk.module", '../../services/dyk.service', "../../modules/faq/faq.module", '../../services/faq.service', '../../modules/box-scores/box-scores.module', '../../services/box-scores.service', '../../modules/standings/standings.module', '../../services/standings.service', '../../modules/schedules/schedules.module', '../../services/schedules.service', '../../modules/mvp/mvp.module', '../../services/list-page.service', '../../modules/profile-header/profile-header.module', '../../services/profile-header.service', '../../global/global-functions', '../../components/headline/headline.component', '../../modules/draft-history/draft-history.module', '../../modules/news/news.module', '../../services/news.service', "../../modules/transactions/transactions.module", "../../services/transactions.service", "../../modules/list-of-lists/list-of-lists.module", "../../services/list-of-lists.service", "../../global/global-settings", "../../services/carousel.service", "../../components/carousels/images-media-carousel/images-media-carousel.component", "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, loading_component_1, error_component_1, about_us_module_1, likeus_module_1, twitter_module_1, twitter_service_1, comparison_module_1, comparison_stats_service_1, share_module_1, comment_module_1, dyk_module_1, dyk_service_1, faq_module_1, faq_service_1, box_scores_module_1, box_scores_service_1, standings_module_1, standings_service_1, schedules_module_1, schedules_service_1, mvp_module_1, list_page_service_1, profile_header_module_1, profile_header_service_1, global_functions_1, headline_component_1, draft_history_module_1, news_module_1, news_service_1, transactions_module_1, transactions_service_1, list_of_lists_module_1, list_of_lists_service_1, global_settings_1, carousel_service_1, images_media_carousel_component_1, sidekick_wrapper_component_1, responsive_widget_component_1;
    var MLBPage;
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
            function (twitter_module_1_1) {
                twitter_module_1 = twitter_module_1_1;
            },
            function (twitter_service_1_1) {
                twitter_service_1 = twitter_service_1_1;
            },
            function (comparison_module_1_1) {
                comparison_module_1 = comparison_module_1_1;
            },
            function (comparison_stats_service_1_1) {
                comparison_stats_service_1 = comparison_stats_service_1_1;
            },
            function (share_module_1_1) {
                share_module_1 = share_module_1_1;
            },
            function (comment_module_1_1) {
                comment_module_1 = comment_module_1_1;
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
            function (standings_module_1_1) {
                standings_module_1 = standings_module_1_1;
            },
            function (standings_service_1_1) {
                standings_service_1 = standings_service_1_1;
            },
            function (schedules_module_1_1) {
                schedules_module_1 = schedules_module_1_1;
            },
            function (schedules_service_1_1) {
                schedules_service_1 = schedules_service_1_1;
            },
            function (mvp_module_1_1) {
                mvp_module_1 = mvp_module_1_1;
            },
            function (list_page_service_1_1) {
                list_page_service_1 = list_page_service_1_1;
            },
            function (profile_header_module_1_1) {
                profile_header_module_1 = profile_header_module_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (headline_component_1_1) {
                headline_component_1 = headline_component_1_1;
            },
            function (draft_history_module_1_1) {
                draft_history_module_1 = draft_history_module_1_1;
            },
            function (news_module_1_1) {
                news_module_1 = news_module_1_1;
            },
            function (news_service_1_1) {
                news_service_1 = news_service_1_1;
            },
            function (transactions_module_1_1) {
                transactions_module_1 = transactions_module_1_1;
            },
            function (transactions_service_1_1) {
                transactions_service_1 = transactions_service_1_1;
            },
            function (list_of_lists_module_1_1) {
                list_of_lists_module_1 = list_of_lists_module_1_1;
            },
            function (list_of_lists_service_1_1) {
                list_of_lists_service_1 = list_of_lists_service_1_1;
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
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            MLBPage = (function () {
                function MLBPage(_router, _title, _standingsService, _boxScores, _profileService, _schedulesService, _imagesService, _newsService, _faqService, _dykService, _twitterService, _comparisonService, _transactionsService, _lolService, listService) {
                    var _this = this;
                    this._router = _router;
                    this._title = _title;
                    this._standingsService = _standingsService;
                    this._boxScores = _boxScores;
                    this._profileService = _profileService;
                    this._schedulesService = _schedulesService;
                    this._imagesService = _imagesService;
                    this._newsService = _newsService;
                    this._faqService = _faqService;
                    this._dykService = _dykService;
                    this._twitterService = _twitterService;
                    this._comparisonService = _comparisonService;
                    this._transactionsService = _transactionsService;
                    this._lolService = _lolService;
                    this.listService = listService;
                    this.widgetPlace = "widgetForModule";
                    this.pageParams = {};
                    this.partnerID = null;
                    this.hasError = false;
                    this.isProfilePage = true;
                    this.profileType = "league";
                    this.profileName = "MLB";
                    this.listMax = 10;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("MLB"));
                    // this.currentYear = new Date().getFullYear();
                    //for boxscores
                    var currentUnixDate = new Date().getTime();
                    //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
                    this.dateParam = {
                        profile: 'league',
                        teamId: null,
                        date: moment.tz(currentUnixDate, 'America/New_York').format('YYYY-MM-DD')
                    };
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) {
                        _this.partnerID = partnerID;
                    });
                }
                MLBPage.prototype.ngOnInit = function () {
                    this.setupProfileData();
                };
                MLBPage.prototype.setupProfileData = function () {
                    var _this = this;
                    this._profileService.getMLBProfile().subscribe(function (data) {
                        /*** About MLB ***/
                        _this.profileData = data;
                        _this.profileHeaderData = _this._profileService.convertToLeagueProfileHeader(data.headerData);
                        _this.profileName = "MLB";
                        /*** Keep Up With Everything MLB ***/
                        _this.getBoxScores(_this.dateParam);
                        _this.getSchedulesData('pre-event'); //grab pre event data for upcoming games
                        _this.standingsData = _this._standingsService.loadAllTabsForModule(_this.pageParams);
                        _this.transactionsData = _this._transactionsService.loadAllTabsForModule(data.profileName);
                        _this.batterData = _this.listService.getMVPTabs('batter', 'module');
                        if (_this.batterData && _this.batterData.length > 0) {
                            _this.batterTab(_this.batterData[0]);
                        }
                        _this.pitcherData = _this.listService.getMVPTabs('pitcher', 'module');
                        if (_this.pitcherData && _this.pitcherData.length > 0) {
                            _this.pitcherTab(_this.pitcherData[0]);
                        }
                        _this.setupComparisonData();
                        /*** Keep Up With Everything MLB ***/
                        _this.setupShareModule();
                        _this.getImages(_this.imageData);
                        _this.getNewsService();
                        _this.getFaqService(_this.profileType);
                        _this.setupListOfListsModule();
                        _this.getDykService(_this.profileType);
                        _this.getTwitterService(_this.profileType);
                    }, function (err) {
                        _this.hasError = true;
                        console.log("Error getting team profile data for mlb", err);
                    });
                };
                //grab tab to make api calls for post of pre event table
                MLBPage.prototype.scheduleTab = function (tab) {
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
                MLBPage.prototype.getSchedulesData = function (status) {
                    var _this = this;
                    var limit = 5;
                    if (status == 'post-event') {
                        limit = 3;
                    }
                    this._schedulesService.getSchedulesService('league', status, limit, 1)
                        .subscribe(function (data) {
                        _this.schedulesData = data;
                    }, function (err) {
                        console.log("Error getting Schedules Data");
                    });
                };
                MLBPage.prototype.transactionsTab = function (tab) {
                    this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'module')
                        .subscribe(function (transactionsData) {
                        //do nothing
                    }, function (err) {
                        console.log('Error: transactionsData API: ', err);
                    });
                };
                MLBPage.prototype.getTwitterService = function (profileType) {
                    var _this = this;
                    this.isProfilePage = true;
                    this.profileType = 'league';
                    this.profileName = "MLB";
                    this._twitterService.getTwitterService(this.profileType)
                        .subscribe(function (data) {
                        _this.twitterData = data;
                    }, function (err) {
                        console.log("Error getting twitter data");
                    });
                };
                MLBPage.prototype.getDykService = function (profileType) {
                    var _this = this;
                    this._dykService.getDykService(this.profileType)
                        .subscribe(function (data) {
                        _this.dykData = data;
                    }, function (err) {
                        console.log("Error getting did you know data");
                    });
                };
                MLBPage.prototype.getFaqService = function (profileType) {
                    var _this = this;
                    this._faqService.getFaqService(this.profileType)
                        .subscribe(function (data) {
                        _this.faqData = data;
                    }, function (err) {
                        console.log("Error getting faq data for mlb", err);
                    });
                };
                MLBPage.prototype.setupListOfListsModule = function () {
                    var _this = this;
                    var params = {
                        limit: 4,
                        pageNum: 1
                    };
                    this._lolService.getListOfListsService(params, "league", "module")
                        .subscribe(function (listOfListsData) {
                        _this.listOfListsData = listOfListsData.listData;
                        _this.listOfListsData["type"] = "league";
                    }, function (err) {
                        console.log('Error: listOfListsData API: ', err);
                    });
                };
                MLBPage.prototype.getNewsService = function () {
                    var _this = this;
                    this._newsService.getNewsService('Major League Baseball')
                        .subscribe(function (data) {
                        _this.newsDataArray = data.news;
                    }, function (err) {
                        console.log("Error getting news data");
                    });
                };
                //api for BOX SCORES
                MLBPage.prototype.getBoxScores = function (dateParams) {
                    var _this = this;
                    if (dateParams != null) {
                        this.dateParam = dateParams;
                    }
                    this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, function (boxScoresData, currentBoxScores) {
                        _this.boxScoresData = boxScoresData;
                        _this.currentBoxScores = currentBoxScores;
                    });
                };
                MLBPage.prototype.getImages = function (imageData) {
                    var _this = this;
                    this._imagesService.getImages(this.profileType)
                        .subscribe(function (data) {
                        return _this.imageData = data.imageArray, _this.copyright = data.copyArray, _this.imageTitle = data.titleArray;
                    }, function (err) {
                        console.log("Error getting image data" + err);
                    });
                };
                MLBPage.prototype.setupComparisonData = function () {
                    var _this = this;
                    this._comparisonService.getInitialPlayerStats(this.pageParams).subscribe(function (data) {
                        _this.comparisonModuleData = data;
                    }, function (err) {
                        console.log("Error getting comparison data for mlb", err);
                    });
                };
                MLBPage.prototype.standingsTabSelected = function (tabData) {
                    //only show 5 rows in the module
                    this._standingsService.getStandingsTabData(tabData, this.pageParams, function (data) { }, 5);
                };
                MLBPage.prototype.setupShareModule = function () {
                    var profileHeaderData = this.profileHeaderData;
                    var imageUrl = !profileHeaderData.profileImageUrl ? global_settings_1.GlobalSettings.getImageUrl("/mlb/players/no-image.png") : profileHeaderData.profileImageUrl;
                    var shareText = !profileHeaderData.profileName ?
                        'Share This Profile Below' :
                        'Share ' + global_functions_1.GlobalFunctions.convertToPossessive(profileHeaderData.profileName) + ' Profile Below:';
                    this.shareModuleInput = {
                        imageUrl: imageUrl,
                        shareText: shareText
                    };
                };
                //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
                MLBPage.prototype.batterTab = function (tab) {
                    this.batterParams = {
                        profile: 'player',
                        listname: tab.tabDataKey,
                        sort: 'asc',
                        conference: 'all',
                        division: 'all',
                        limit: this.listMax,
                        pageNum: 1
                    };
                    this.listService.getListModuleService(tab, this.batterParams)
                        .subscribe(function (updatedTab) {
                        //do nothing?
                    }, function (err) {
                        tab.isLoaded = true;
                        console.log('Error: Loading MVP Batters: ', err);
                    });
                };
                //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
                MLBPage.prototype.pitcherTab = function (tab) {
                    this.pitcherParams = {
                        profile: 'player',
                        listname: tab.tabDataKey,
                        sort: 'asc',
                        conference: 'all',
                        division: 'all',
                        limit: this.listMax,
                        pageNum: 1
                    };
                    this.listService.getListModuleService(tab, this.pitcherParams)
                        .subscribe(function (updatedTab) {
                        //do nothing?
                    }, function (err) {
                        tab.isLoaded = true;
                        console.log('Error: Loading MVP Pitchers: ', err);
                    });
                };
                MLBPage = __decorate([
                    core_1.Component({
                        selector: 'MLB-page',
                        templateUrl: './app/webpages/mlb-page/mlb.page.html',
                        directives: [
                            sidekick_wrapper_component_1.SidekickWrapper,
                            loading_component_1.LoadingComponent,
                            error_component_1.ErrorComponent,
                            mvp_module_1.MVPModule,
                            schedules_module_1.SchedulesModule,
                            box_scores_module_1.BoxScoresModule,
                            headline_component_1.HeadlineComponent,
                            profile_header_module_1.ProfileHeaderModule,
                            standings_module_1.StandingsModule,
                            comment_module_1.CommentModule,
                            dyk_module_1.DYKModule,
                            draft_history_module_1.DraftHistoryModule,
                            faq_module_1.FAQModule,
                            likeus_module_1.LikeUs,
                            twitter_module_1.TwitterModule,
                            comparison_module_1.ComparisonModule,
                            share_module_1.ShareModule,
                            transactions_module_1.TransactionsModule,
                            news_module_1.NewsModule,
                            about_us_module_1.AboutUsModule,
                            list_of_lists_module_1.ListOfListsModule,
                            images_media_carousel_component_1.ImagesMedia,
                            responsive_widget_component_1.ResponsiveWidget
                        ],
                        providers: [
                            box_scores_service_1.BoxScoresService,
                            schedules_service_1.SchedulesService,
                            list_page_service_1.ListPageService,
                            standings_service_1.StandingsService,
                            profile_header_service_1.ProfileHeaderService,
                            carousel_service_1.ImagesService,
                            news_service_1.NewsService,
                            faq_service_1.FaqService,
                            dyk_service_1.DykService,
                            comparison_stats_service_1.ComparisonStatsService,
                            twitter_service_1.TwitterService,
                            transactions_service_1.TransactionsService,
                            list_of_lists_service_1.ListOfListsService,
                            platform_browser_1.Title
                        ]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, platform_browser_1.Title, standings_service_1.StandingsService, box_scores_service_1.BoxScoresService, profile_header_service_1.ProfileHeaderService, schedules_service_1.SchedulesService, carousel_service_1.ImagesService, news_service_1.NewsService, faq_service_1.FaqService, dyk_service_1.DykService, twitter_service_1.TwitterService, comparison_stats_service_1.ComparisonStatsService, transactions_service_1.TransactionsService, list_of_lists_service_1.ListOfListsService, list_page_service_1.ListPageService])
                ], MLBPage);
                return MLBPage;
            }());
            exports_1("MLBPage", MLBPage);
        }
    }
});
