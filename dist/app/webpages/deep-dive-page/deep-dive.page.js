System.register(['@angular/core', '../../modules/tile-stack/tile-stack.module', '../../modules/article-stack/article-stack.module', '../../modules/video-stack/video-stack.module', '../../modules/carousel-dive/carousel-dive.module', '../../services/deep-dive.service', '../../components/articles/recommendations/recommendations.component', '../../components/sidekick-wrapper/sidekick-wrapper.component', '../../components/box-article/box-article.component', '../../services/schedules.service', '../../modules/widget/widget-carousel.module', '../../modules/side-scroll-schedules/side-scroll-schedules.module', '../../modules/box-scores/box-scores.module', '../../services/box-scores.service', "../../global/global-settings", '@angular/router-deprecated'], function(exports_1, context_1) {
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
    var core_1, tile_stack_module_1, article_stack_module_1, video_stack_module_1, carousel_dive_module_1, deep_dive_service_1, recommendations_component_1, sidekick_wrapper_component_1, box_article_component_1, schedules_service_1, widget_carousel_module_1, side_scroll_schedules_module_1, box_scores_module_1, box_scores_service_1, global_settings_1, router_deprecated_1;
    var DeepDivePage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (tile_stack_module_1_1) {
                tile_stack_module_1 = tile_stack_module_1_1;
            },
            function (article_stack_module_1_1) {
                article_stack_module_1 = article_stack_module_1_1;
            },
            function (video_stack_module_1_1) {
                video_stack_module_1 = video_stack_module_1_1;
            },
            function (carousel_dive_module_1_1) {
                carousel_dive_module_1 = carousel_dive_module_1_1;
            },
            function (deep_dive_service_1_1) {
                deep_dive_service_1 = deep_dive_service_1_1;
            },
            function (recommendations_component_1_1) {
                recommendations_component_1 = recommendations_component_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (box_article_component_1_1) {
                box_article_component_1 = box_article_component_1_1;
            },
            function (schedules_service_1_1) {
                schedules_service_1 = schedules_service_1_1;
            },
            function (widget_carousel_module_1_1) {
                widget_carousel_module_1 = widget_carousel_module_1_1;
            },
            function (side_scroll_schedules_module_1_1) {
                side_scroll_schedules_module_1 = side_scroll_schedules_module_1_1;
            },
            function (box_scores_module_1_1) {
                box_scores_module_1 = box_scores_module_1_1;
            },
            function (box_scores_service_1_1) {
                box_scores_service_1 = box_scores_service_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            DeepDivePage = (function () {
                function DeepDivePage(_router, _deepDiveData, _boxScores, _schedulesService, ngZone) {
                    var _this = this;
                    this._router = _router;
                    this._deepDiveData = _deepDiveData;
                    this._boxScores = _boxScores;
                    this._schedulesService = _schedulesService;
                    this.ngZone = ngZone;
                    this.scroll = true;
                    this.ssMax = 7;
                    this.callCount = 1;
                    this.isHomeRunZone = false;
                    this.profileName = "MLB";
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
                        var partnerHome = global_settings_1.GlobalSettings.getHomeInfo().isHome && global_settings_1.GlobalSettings.getHomeInfo().isPartner;
                        _this.isHomeRunZone = partnerHome;
                    });
                    //constantly check the size of the browser width and run the size check function
                    window.onresize = function (e) {
                        // current use is box scores
                        _this.checkSize();
                    };
                }
                //api for Schedules
                DeepDivePage.prototype.getSideScroll = function () {
                    var _this = this;
                    var self = this;
                    this._schedulesService.setupSlideScroll(this.sideScrollData, 'league', 'pre-event', (20 + this.callCount), this.callCount, function (sideScrollData) {
                        if (_this.sideScrollData == null) {
                            _this.sideScrollData = sideScrollData;
                            _this.scrollLength = sideScrollData.length;
                            _this.callCount++;
                        }
                        else {
                            // sideScrollData.forEach(function(val,i){
                            //   self.sideScrollData.push(val);
                            // })
                            _this.scrollLength = sideScrollData.length;
                            _this.callCount++;
                        }
                    });
                };
                DeepDivePage.prototype.scrollCheck = function (event) {
                    var maxScroll = this.sideScrollData.length;
                    this.scrollLength = this.sideScrollData.length - this.ssMax;
                    if (event >= (maxScroll - this.ssMax)) {
                        this.getSideScroll();
                    }
                };
                //api for BOX SCORES
                DeepDivePage.prototype.getBoxScores = function (dateParams) {
                    var _this = this;
                    if (dateParams != null) {
                        this.dateParam = dateParams;
                    }
                    this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, function (boxScoresData, currentBoxScores) {
                        _this.boxScoresData = boxScoresData;
                        _this.currentBoxScores = currentBoxScores;
                    });
                };
                DeepDivePage.prototype.checkSize = function () {
                    var width = window.outerWidth;
                    var height = window.outerHeight;
                    if (width <= 640) {
                        this.scroll = false;
                        this.maxHeight = 'auto';
                    }
                    else if (width > 640) {
                        this.scroll = true;
                        this.maxHeight = 650;
                    }
                };
                DeepDivePage.prototype.getRecommendationData = function () {
                    var _this = this;
                    this._deepDiveData.getAiArticleData()
                        .subscribe(function (data) {
                        _this.recommendationData = _this._deepDiveData.transformToRecArticles(data);
                    });
                };
                DeepDivePage.prototype.getArticleStackData = function () {
                    var _this = this;
                    this._deepDiveData.getDeepDiveService()
                        .subscribe(function (data) {
                        _this.boxArticleData = _this._deepDiveData.transformToBoxArticle(data);
                    });
                };
                DeepDivePage.prototype.ngOnInit = function () {
                    this.getRecommendationData();
                    this.checkSize();
                    this.getBoxScores(this.dateParam);
                    this.getSideScroll();
                    this.getArticleStackData();
                };
                DeepDivePage.prototype.ngDoCheck = function () {
                };
                DeepDivePage = __decorate([
                    core_1.Component({
                        selector: 'deep-dive-page',
                        templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',
                        directives: [
                            router_deprecated_1.ROUTER_DIRECTIVES,
                            sidekick_wrapper_component_1.SidekickWrapper,
                            widget_carousel_module_1.WidgetCarouselModule,
                            side_scroll_schedules_module_1.SideScrollSchedule,
                            box_scores_module_1.BoxScoresModule,
                            tile_stack_module_1.TileStackModule,
                            article_stack_module_1.ArticleStackModule,
                            video_stack_module_1.VideoStackModule,
                            carousel_dive_module_1.CarouselDiveModule,
                            box_article_component_1.BoxArticleComponent,
                            recommendations_component_1.RecommendationsComponent
                        ],
                        providers: [box_scores_service_1.BoxScoresService, schedules_service_1.SchedulesService, deep_dive_service_1.DeepDiveService],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, deep_dive_service_1.DeepDiveService, box_scores_service_1.BoxScoresService, schedules_service_1.SchedulesService, core_1.NgZone])
                ], DeepDivePage);
                return DeepDivePage;
            }());
            exports_1("DeepDivePage", DeepDivePage);
        }
    }
});
