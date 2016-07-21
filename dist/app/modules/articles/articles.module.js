System.register(['@angular/core', "../../components/articles/article-schedule/article-schedule.component", "../../components/articles/main-article/main-article.component", "../../components/articles/sub-article/sub-article.component", "../../components/articles/head-to-head-articles/head-to-head-articles.component", "../../components/module-header/module-header.component", "../../global/global-ai-headline-module-service", "@angular/router-deprecated", "../../components/loading/loading.component", "../../global/mlb-global-functions"], function(exports_1, context_1) {
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
    var core_1, article_schedule_component_1, main_article_component_1, sub_article_component_1, head_to_head_articles_component_1, module_header_component_1, global_ai_headline_module_service_1, router_deprecated_1, router_deprecated_2, loading_component_1, mlb_global_functions_1;
    var ArticlesModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (article_schedule_component_1_1) {
                article_schedule_component_1 = article_schedule_component_1_1;
            },
            function (main_article_component_1_1) {
                main_article_component_1 = main_article_component_1_1;
            },
            function (sub_article_component_1_1) {
                sub_article_component_1 = sub_article_component_1_1;
            },
            function (head_to_head_articles_component_1_1) {
                head_to_head_articles_component_1 = head_to_head_articles_component_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (global_ai_headline_module_service_1_1) {
                global_ai_headline_module_service_1 = global_ai_headline_module_service_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
                router_deprecated_2 = router_deprecated_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            }],
        execute: function() {
            ArticlesModule = (function () {
                function ArticlesModule(_params, _headlineDataService) {
                    this._params = _params;
                    this._headlineDataService = _headlineDataService;
                    this.league = false;
                    this.error = false;
                    this.headerInfo = {
                        moduleTitle: "",
                        hasIcon: false,
                        iconClass: ""
                    };
                    window.scrollTo(0, 0);
                    this.teamID = _params.get('teamId');
                    this.getArticles();
                }
                ArticlesModule.prototype.getArticles = function () {
                    var _this = this;
                    this._headlineDataService.getAiHeadlineData(this.teamID)
                        .subscribe(function (HeadlineData) {
                        _this.headlineData = HeadlineData['featuredReport'];
                        _this.leftColumnData = HeadlineData['leftColumn'];
                        _this.headToHeadData = HeadlineData['rightColumn'];
                        _this.imageData = HeadlineData['home'].images.concat(HeadlineData['away'].images);
                        _this.eventID = HeadlineData.event;
                        _this.scheduleHomeData = HeadlineData['home'];
                        _this.scheduleAwayData = HeadlineData['away'];
                        _this.getHeaderData(HeadlineData);
                        _this.getSchedule(_this.scheduleHomeData, _this.scheduleAwayData);
                        _this.getMainArticle(_this.headlineData, _this.imageData, _this.eventID);
                        _this.getLeftColumnArticles(_this.leftColumnData, _this.imageData, _this.eventID);
                        _this.getHeadToHeadArticles(_this.headToHeadData, _this.eventID);
                    }, function (err) {
                        _this.error = true;
                        console.log("Error loading AI headline data for " + _this.teamID, err);
                    });
                };
                ArticlesModule.prototype.getHeaderData = function (data) {
                    moment.tz.add('America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0');
                    var dateString = moment.tz(moment.unix(data.timestamp), 'America/New_York').format("MM/DD/YYYY");
                    var isToday = moment(dateString).isSame(moment().tz('America/New_York'), 'day');
                    var isPost = moment(dateString).isBefore(moment().tz('America/New_York'), 'day');
                    if (isPost) {
                        this.headerInfo.moduleTitle = "Post Gameday Matchup Against the " + (this.teamID == data.home.id ? data.away.location + ' ' + data.away.name : data.home.location + ' ' + data.home.name);
                    }
                    else {
                        this.headerInfo.moduleTitle = (isToday ? "Today's" : moment.unix(data.timestamp).format("dddd") + "'s") + " Gameday Matchup Against the " + (this.teamID == data.home.id ? data.away.location + ' ' + data.away.name : data.home.location + ' ' + data.home.name);
                    }
                };
                ArticlesModule.convertToETMoment = function (easternDateString) {
                    return moment(moment(easternDateString).format("MM/DD/YYYY"), "America/New_York");
                };
                ;
                ArticlesModule.prototype.getSchedule = function (homeData, awayData) {
                    var homeArr = [];
                    var awayArr = [];
                    var val = [];
                    var homeName = homeData.location + ' ' + homeData.name;
                    var awayName = awayData.location + ' ' + awayData.name;
                    val['homeID'] = homeData.id;
                    val['homeLocation'] = homeData.location;
                    val['homeName'] = homeData.name.toLowerCase() != "diamondbacks" ? homeData.name : "D'backs";
                    val['homeHex'] = homeData.hex;
                    if (this.teamID == homeData.id) {
                        val['homeLogo'] = {
                            imageClass: "image-68",
                            mainImage: {
                                imageUrl: homeData.logo,
                                imageClass: "border-logo"
                            },
                            subImages: []
                        };
                    }
                    else {
                        var homeLink = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(homeName, homeData.id);
                        val['url'] = homeLink;
                        val['homeLogo'] = {
                            imageClass: "image-68",
                            mainImage: {
                                imageUrl: homeData.logo,
                                urlRouteArray: homeLink,
                                hoverText: "<i class='fa fa-mail-forward'></i>",
                                imageClass: "border-logo"
                            },
                            subImages: []
                        };
                    }
                    val['homeWins'] = homeData.wins;
                    val['homeLosses'] = homeData.losses;
                    homeArr.push(val);
                    val = [];
                    val['awayID'] = awayData.id;
                    val['awayLocation'] = awayData.location;
                    val['awayName'] = awayData.name.toLowerCase() != "diamondbacks" ? awayData.name : "D'backs";
                    val['awayHex'] = awayData.hex;
                    if (this.teamID == awayData.id) {
                        val['awayLogo'] = {
                            imageClass: "image-68",
                            mainImage: {
                                imageUrl: awayData.logo,
                                imageClass: "border-logo"
                            },
                            subImages: []
                        };
                    }
                    else {
                        var awayLink = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(awayName, awayData.id);
                        val['url'] = awayLink;
                        val['awayLogo'] = {
                            imageClass: "image-68",
                            mainImage: {
                                imageUrl: awayData.logo,
                                urlRouteArray: awayLink,
                                hoverText: "<i class='fa fa-mail-forward'></i>",
                                imageClass: "border-logo"
                            },
                            subImages: []
                        };
                    }
                    val['awayWins'] = awayData.wins;
                    val['awayLosses'] = awayData.losses;
                    awayArr.push(val);
                    this.homeData = homeArr;
                    this.awayData = awayArr;
                };
                ArticlesModule.prototype.getImages = function (imageList, articleType) {
                    imageList.sort(function () {
                        return 0.5 - Math.random();
                    });
                    if (articleType == 'main') {
                        this.mainImage = imageList[0];
                    }
                    if (articleType == 'sub') {
                        return this.subImages = imageList;
                    }
                };
                ArticlesModule.prototype.getMainArticle = function (headlineData, imageData, eventID) {
                    var pageIndex = Object.keys(headlineData)[0];
                    headlineData = headlineData[Object.keys(headlineData)[0]];
                    this.mainTitle = headlineData.displayHeadline;
                    if (this.mainTitle.length >= 85) {
                        this.titleFontSize = "font-size: 16px;";
                    }
                    this.eventType = pageIndex;
                    this.mainEventID = eventID;
                    var articleContent = headlineData.article[0];
                    var maxLength = 235;
                    var trimmedArticle = articleContent.substring(0, maxLength);
                    this.mainContent = trimmedArticle.substr(0, Math.min(trimmedArticle.length, trimmedArticle.lastIndexOf(" ")));
                    var articleType = 'main';
                    this.getImages(imageData, articleType);
                };
                ArticlesModule.prototype.getLeftColumnArticles = function (leftColumnData, imageData, eventID) {
                    var articleType = 'sub';
                    var articles;
                    this.getImages(imageData, articleType);
                    var articleArr = [];
                    var imageCount = 0;
                    var self = this;
                    Object.keys(leftColumnData).forEach(function (val) {
                        switch (val) {
                            case 'about-the-teams':
                            case 'historical-team-statistics':
                            case 'last-matchup':
                            case 'starting-lineup-home':
                            case 'starting-lineup-away':
                            case 'injuries-home':
                            case 'injuries-away':
                            case 'upcoming-game':
                                imageCount++;
                                articles = {
                                    title: leftColumnData[val].displayHeadline,
                                    eventType: val,
                                    eventID: eventID,
                                    images: self.subImages[imageCount]
                                };
                                articleArr.push(articles);
                                break;
                        }
                    });
                    articleArr.sort(function () {
                        return 0.5 - Math.random();
                    });
                    this.randomLeftColumn = articleArr;
                };
                ArticlesModule.prototype.getHeadToHeadArticles = function (headToHeadData, eventID) {
                    var articleArr = [];
                    var articles;
                    Object.keys(headToHeadData).forEach(function (val) {
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
                                    title: headToHeadData[val].displayHeadline,
                                    eventType: val,
                                    eventID: eventID
                                };
                                articleArr.push(articles);
                                break;
                        }
                    });
                    articleArr.sort(function () {
                        return 0.5 - Math.random();
                    });
                    if (articleArr.length == 10) {
                        articleArr.shift();
                        articleArr.pop();
                    }
                    else if (articleArr.length == 9) {
                        articleArr.pop();
                    }
                    this.arrLength = articleArr.length - 1;
                    this.randomHeadToHead = articleArr;
                };
                ArticlesModule.prototype.ngOnInit = function () {
                };
                ArticlesModule = __decorate([
                    core_1.Component({
                        selector: 'articles-module',
                        templateUrl: './app/modules/articles/articles.module.html',
                        directives: [
                            module_header_component_1.ModuleHeader,
                            router_deprecated_2.ROUTER_DIRECTIVES,
                            article_schedule_component_1.ArticleScheduleComponent,
                            main_article_component_1.ArticleMainComponent,
                            sub_article_component_1.ArticleSubComponent,
                            head_to_head_articles_component_1.HeadToHeadComponent,
                            loading_component_1.LoadingComponent
                        ],
                        inputs: [],
                        providers: [],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, global_ai_headline_module_service_1.HeadlineDataService])
                ], ArticlesModule);
                return ArticlesModule;
            }());
            exports_1("ArticlesModule", ArticlesModule);
        }
    }
});
