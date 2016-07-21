System.register(['@angular/core', '@angular/common', '@angular/router-deprecated', "../../components/carousels/images-media-carousel/images-media-carousel.component", "../../components/articles/shareLinks/shareLinks.component", "../../components/articles/article-content/article-content.component", "../../components/articles/recommendations/recommendations.component", "../../components/articles/trending/trending.component", "../../components/articles/disqus/disqus.component", "../../components/loading/loading.component", "../../global/global-article-page-service", "../../global/mlb-global-functions", "../../components/sidekick-wrapper-ai/sidekick-wrapper-ai.component", "../../global/global-settings", "../../components/articles/sidekick-container/sidekick-container.component"], function(exports_1, context_1) {
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
    var core_1, common_1, router_deprecated_1, images_media_carousel_component_1, shareLinks_component_1, article_content_component_1, recommendations_component_1, trending_component_1, disqus_component_1, loading_component_1, global_article_page_service_1, mlb_global_functions_1, sidekick_wrapper_ai_component_1, global_settings_1, sidekick_container_component_1;
    var ArticlePages;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (images_media_carousel_component_1_1) {
                images_media_carousel_component_1 = images_media_carousel_component_1_1;
            },
            function (shareLinks_component_1_1) {
                shareLinks_component_1 = shareLinks_component_1_1;
            },
            function (article_content_component_1_1) {
                article_content_component_1 = article_content_component_1_1;
            },
            function (recommendations_component_1_1) {
                recommendations_component_1 = recommendations_component_1_1;
            },
            function (trending_component_1_1) {
                trending_component_1 = trending_component_1_1;
            },
            function (disqus_component_1_1) {
                disqus_component_1 = disqus_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (global_article_page_service_1_1) {
                global_article_page_service_1 = global_article_page_service_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (sidekick_wrapper_ai_component_1_1) {
                sidekick_wrapper_ai_component_1 = sidekick_wrapper_ai_component_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (sidekick_container_component_1_1) {
                sidekick_container_component_1 = sidekick_container_component_1_1;
            }],
        execute: function() {
            ArticlePages = (function () {
                function ArticlePages(_params, _router, _articleDataService, _location) {
                    var _this = this;
                    this._params = _params;
                    this._router = _router;
                    this._articleDataService = _articleDataService;
                    this._location = _location;
                    this.error = false;
                    this.hasImages = false;
                    this.aiSidekick = true;
                    window.scrollTo(0, 0);
                    this.eventID = _params.get('eventID');
                    this.eventType = _params.get('eventType');
                    if (this.eventType == "upcoming-game") {
                        this.eventType = "upcoming";
                    }
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) {
                        if (partnerID != null) {
                            _this.partnerId = partnerID.replace("-", ".");
                        }
                        _this.getArticles();
                    });
                }
                ArticlePages.prototype.getArticles = function () {
                    var _this = this;
                    this.getArticleType();
                    this._articleDataService.getArticleData(this.eventID, this.eventType, this.partnerId)
                        .subscribe(function (ArticleData) {
                        var pageIndex = Object.keys(ArticleData)[0];
                        _this.getCarouselImages(ArticleData[pageIndex]['images']);
                        _this.articleData = ArticleData[pageIndex];
                        _this.title = ArticleData[pageIndex].displayHeadline;
                        _this.date = ArticleData[pageIndex].dateline;
                        _this.comment = ArticleData[pageIndex].commentHeader;
                        _this.imageLinks = _this.getImageLinks(ArticleData[pageIndex]);
                        _this.teamId = ArticleData[pageIndex].teamId;
                        ArticlePages.setMetaTag(_this.articleData.metaHeadline);
                    }, function (err) {
                        _this.error = true;
                        var self = _this;
                        setTimeout(function () {
                            //removes errored page from browser history
                            self._location.replaceState('/');
                            //returns user to previous page
                            self._location.back();
                        }, 5000);
                    });
                    this._articleDataService.getRecommendationsData(this.eventID)
                        .subscribe(function (HeadlineData) {
                        _this.pageIndex = _this.eventType;
                        _this.eventID = HeadlineData.event;
                        _this.recommendedImageData = HeadlineData['home'].images.concat(HeadlineData['away'].images);
                        _this.getRandomArticles(HeadlineData, _this.pageIndex, _this.eventID, _this.recommendedImageData);
                    });
                    this._articleDataService.getTrendingData()
                        .subscribe(function (TrendingData) {
                        _this.getTrendingArticles(TrendingData);
                    });
                };
                ArticlePages.prototype.getTrendingArticles = function (data) {
                    var articles = [];
                    var images = [];
                    Object.keys(data).forEach(function (val, index) {
                        if (val != "meta-data") {
                            articles[index - 1] = {
                                title: data[val].displayHeadline,
                                date: data[val].dateline + " EST",
                                content: data[val].article[0],
                                eventId: data['meta-data']['current'].eventId,
                                eventType: val,
                                url: mlb_global_functions_1.MLBGlobalFunctions.formatArticleRoute(val, data['meta-data']['current'].eventId)
                            };
                        }
                    });
                    Object.keys(data['meta-data']['images']).forEach(function (val, index) {
                        images[index] = data['meta-data']['images'][val];
                    });
                    this.trendingImages = images[0].concat(images[1]);
                    articles.sort(function () {
                        return 0.5 - Math.random();
                    });
                    this.trendingData = articles;
                };
                ArticlePages.prototype.getCarouselImages = function (data) {
                    var images = [];
                    var copyData = [];
                    var description = [];
                    var imageCount = 10;
                    var image;
                    var copyright;
                    var title;
                    if (this.articleType == "gameModule") {
                        if (Object.keys(data).length == 4) {
                            imageCount = 5;
                        }
                    }
                    else if (this.articleType == "playerRoster") {
                        imageCount = 2;
                    }
                    try {
                        if (Object.keys(data).length > 0) {
                            for (var id in data) {
                                data[id].forEach(function (val, index) {
                                    if (index < imageCount) {
                                        image = val['image'];
                                        copyright = val['copyright'];
                                        title = val['title'];
                                        images.push(image);
                                        copyData.push(copyright);
                                        description.push(title);
                                    }
                                });
                            }
                            this.imageData = images;
                            this.copyright = copyData;
                            this.imageTitle = description;
                        }
                        else {
                            this.imageData = null;
                            this.copyright = null;
                            this.imageTitle = null;
                        }
                        this.hasImages = true;
                    }
                    catch (err) {
                        this.hasImages = false;
                    }
                };
                ArticlePages.prototype.getImageLinks = function (data) {
                    var hoverText = "<p>View</p><p>Profile</p>";
                    var links = [];
                    if (this.articleType == "playerRoster") {
                        data['article'].forEach(function (val) {
                            if (val['playerRosterModule']) {
                                var playerUrl = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val['playerRosterModule'].teamName, val['playerRosterModule'].name, val['playerRosterModule'].id);
                                var teamUrl = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val['playerRosterModule'].teamName, val['playerRosterModule'].teamId);
                                val['player'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['playerRosterModule']['headshot'],
                                        urlRouteArray: playerUrl,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                val['logo'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['playerRosterModule'].teamLogo,
                                        urlRouteArray: teamUrl,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                links.push(val['player'], val['logo']);
                            }
                        });
                        return links;
                    }
                    if (this.articleType == 'playerComparison') {
                        data['article'][2]['playerComparisonModule'].forEach(function (val, index) {
                            if (index == 0) {
                                var urlPlayerLeft = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.name, val.id);
                                var urlTeamLeft = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                                val['imageLeft'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['headshot'],
                                        urlRouteArray: urlPlayerLeft,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                val['imageLeftSub'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val.teamLogo,
                                        urlRouteArray: urlTeamLeft,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                links.push(val['imageLeft'], val['imageLeftSub']);
                            }
                            if (index == 1) {
                                var urlPlayerRight = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.name, val.id);
                                var urlTeamRight = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                                val['imageRight'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['headshot'],
                                        urlRouteArray: urlPlayerRight,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                val['imageRightSub'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val.teamLogo,
                                        urlRouteArray: urlTeamRight,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                links.push(val['imageRight'], val['imageRightSub']);
                            }
                        });
                        return links;
                    }
                    if (this.articleType == 'gameModule') {
                        data['article'].forEach(function (val, index) {
                            if (index == 1 && val['gameModule']) {
                                var urlTeamLeftTop = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val['gameModule'].homeTeamName, val['gameModule'].homeTeamId);
                                var urlTeamRightTop = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val['gameModule'].awayTeamName, val['gameModule'].awayTeamId);
                                val['teamLeft'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['gameModule'].homeTeamLogo,
                                        urlRouteArray: urlTeamLeftTop,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                val['teamRight'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['gameModule'].awayTeamLogo,
                                        urlRouteArray: urlTeamRightTop,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                links.push(val['teamLeft'], val['teamRight']);
                            }
                            if (index == 5 && val['gameModule']) {
                                var urlTeamLeftBottom = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val['gameModule'].homeTeamName, val['gameModule'].homeTeamId);
                                var urlTeamRightBottom = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val['gameModule'].awayTeamName, val['gameModule'].awayTeamId);
                                val['teamLeft'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['gameModule'].homeTeamLogo,
                                        urlRouteArray: urlTeamLeftBottom,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                val['teamRight'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['gameModule'].awayTeamLogo,
                                        urlRouteArray: urlTeamRightBottom,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                links.push(val['teamLeft'], val['teamRight']);
                            }
                        });
                        return links;
                    }
                    if (this.articleType == 'teamRecord') {
                        var isFirstTeam = true;
                        data['article'].forEach(function (val) {
                            if (val['teamRecordModule'] && isFirstTeam) {
                                var urlFirstTeam = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val['teamRecordModule'].name, val['teamRecordModule'].id);
                                val['imageTop'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['teamRecordModule'].logo,
                                        urlRouteArray: urlFirstTeam,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                links.push(val['imageTop']);
                                return isFirstTeam = false;
                            }
                            if (val['teamRecordModule'] && !isFirstTeam) {
                                var urlSecondTeam = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val['teamRecordModule'].name, val['teamRecordModule'].id);
                                val['imageBottom'] = {
                                    imageClass: "image-121",
                                    mainImage: {
                                        imageUrl: val['teamRecordModule'].logo,
                                        urlRouteArray: urlSecondTeam,
                                        hoverText: hoverText,
                                        imageClass: "border-logo"
                                    }
                                };
                                links.push(val['imageBottom']);
                            }
                        });
                        return links;
                    }
                };
                ArticlePages.prototype.getImages = function (imageList) {
                    imageList.sort(function () {
                        return 0.5 - Math.random();
                    });
                    return this.images = imageList;
                };
                ArticlePages.prototype.getRandomArticles = function (recommendations, pageIndex, eventID, recommendedImageData) {
                    this.getImages(recommendedImageData);
                    var articles;
                    var recommendArr = [];
                    var imageCount = 0;
                    var self = this;
                    Object.keys(recommendations.leftColumn).forEach(function (val) {
                        if (pageIndex != val) {
                            switch (val) {
                                case 'about-the-teams':
                                case 'historical-team-statistics':
                                case 'last-matchup':
                                case 'starting-lineup-home':
                                case 'starting-lineup-away':
                                case 'injuries-home':
                                case 'injuries-away':
                                case 'upcoming-game':
                                    articles = {
                                        title: recommendations.leftColumn[val].displayHeadline,
                                        eventType: val,
                                        eventID: eventID,
                                        images: self.images[imageCount],
                                    };
                                    recommendArr.push(articles);
                                    imageCount++;
                                    break;
                            }
                        }
                    });
                    articles = [];
                    Object.keys(recommendations.rightColumn).forEach(function (val) {
                        if (pageIndex != val) {
                            switch (val) {
                                case 'pitcher-player-comparison':
                                case 'catcher-player-comparison':
                                case 'first-base-player-comparison':
                                case 'second-base-player-comparison':
                                case 'third-base-player-comparison':
                                case 'shortstop-player-comparison':
                                case 'left-field-player-comparison':
                                case 'center-field-player-comparison':
                                case 'right-field-player-comparison':
                                case 'outfield-most-putouts':
                                case 'outfielder-most-hits':
                                case 'outfield-most-home-runs':
                                case 'infield-most-hits':
                                case 'infield-most-home-runs':
                                case 'infield-best-batting-average':
                                case 'infield-most-putouts':
                                    articles = {
                                        title: recommendations.rightColumn[val].displayHeadline,
                                        eventType: val,
                                        eventID: eventID,
                                        images: self.images[imageCount],
                                    };
                                    recommendArr.push(articles);
                                    imageCount++;
                                    break;
                            }
                        }
                    });
                    recommendArr.sort(function () {
                        return 0.5 - Math.random();
                    });
                    this.randomHeadlines = recommendArr;
                    this.images = recommendations['home'].images;
                };
                ArticlePages.prototype.getArticleType = function () {
                    switch (this.eventType) {
                        case 'about-the-teams':
                            this.articleType = 'teamRecord';
                            this.articleSubType = 'about';
                            break;
                        case 'historical-team-statistics':
                            this.articleType = 'teamRecord';
                            this.articleSubType = 'history';
                            break;
                        case 'last-matchup':
                            this.articleType = 'teamRecord';
                            this.articleSubType = 'last';
                            break;
                        case 'starting-lineup-home':
                        case 'starting-lineup-away':
                        case 'injuries-home':
                        case 'injuries-away':
                            this.articleType = 'playerRoster';
                            break;
                        case 'pitcher-player-comparison':
                            this.articleType = 'playerComparison';
                            this.articleSubType = 'pitcher';
                            break;
                        case 'catcher-player-comparison':
                        case 'first-base-player-comparison':
                        case 'second-base-player-comparison':
                        case 'third-base-player-comparison':
                        case 'shortstop-player-comparison':
                        case 'left-field-player-comparison':
                        case 'center-field-player-comparison':
                        case 'right-field-player-comparison':
                        case 'outfield-most-putouts':
                        case 'outfielder-most-hits':
                        case 'outfield-most-home-runs':
                        case 'infield-most-hits':
                        case 'infield-most-home-runs':
                        case 'infield-best-batting-average':
                        case 'infield-most-putouts':
                            this.articleType = 'playerComparison';
                            break;
                        case 'pregame-report':
                        case 'third-inning-report':
                        case 'fifth-inning-report':
                        case 'Seventh-inning-stretch-report':
                        case 'postgame-report':
                            this.articleType = 'gameReport';
                            break;
                        case 'upcoming':
                            this.articleType = 'gameModule';
                            break;
                    }
                    return this.articleType;
                };
                ArticlePages.setMetaTag = function (metaData) {
                    if (metaData !== null) {
                        var metaTag = document.createElement('meta');
                        metaTag.name = 'description';
                        metaTag.content = metaData;
                        document.head.appendChild(metaTag);
                    }
                };
                ArticlePages.prototype.ngOnInit = function () {
                };
                ArticlePages = __decorate([
                    core_1.Component({
                        selector: 'article-pages',
                        templateUrl: './app/webpages/article-pages/article-pages.page.html',
                        directives: [
                            sidekick_wrapper_ai_component_1.SidekickWrapperAI,
                            router_deprecated_1.ROUTER_DIRECTIVES,
                            images_media_carousel_component_1.ImagesMedia,
                            shareLinks_component_1.ShareLinksComponent,
                            article_content_component_1.ArticleContentComponent,
                            recommendations_component_1.RecommendationsComponent,
                            disqus_component_1.DisqusComponent,
                            loading_component_1.LoadingComponent,
                            trending_component_1.TrendingComponent,
                            sidekick_container_component_1.SidekickContainerComponent
                        ]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, global_article_page_service_1.ArticleDataService, common_1.Location])
                ], ArticlePages);
                return ArticlePages;
            }());
            exports_1("ArticlePages", ArticlePages);
        }
    }
});
