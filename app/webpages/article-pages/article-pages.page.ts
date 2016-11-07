import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ImagesMedia} from "../../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import {ShareLinksComponent} from "../../fe-core/components/articles/share-links/share-links.component";
import {ArticleContentComponent} from "../../fe-core/components/articles/article-content/article-content.component";
import {RecommendationsComponent} from "../../fe-core/components/articles/recommendations/recommendations.component";
import {TrendingComponent} from "../../fe-core/components/articles/trending/trending.component";
import {DisqusComponent} from "../../fe-core/components/articles/disqus/disqus.component";
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {Article} from "../../global/global-interface";
import {ArticleData} from "../../global/global-interface";
import {ArticleDataService} from "../../global/global-article-page-service";
import {GlobalFunctions} from "../../global/global-functions";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
import {SidekickWrapperAI} from "../../fe-core/components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
import {GlobalSettings} from "../../global/global-settings";
import {SidekickContainerComponent} from "../../fe-core/components/articles/sidekick-container/sidekick-container.component";
import {HeadlineDataService} from "../../global/global-ai-headline-module-service";
import {SeoService} from '../../seo.service';
import {WidgetModule} from "../../fe-core/modules/widget/widget.module";
import {ComplexInnerHtml} from "../../fe-core/components/complex-inner-html/complex-inner-html.component";
import {find} from "rxjs/operator/find";

declare var moment;

@Component({
    selector: 'article-pages',
    templateUrl: './app/webpages/article-pages/article-pages.page.html',
    directives: [
        SidekickWrapperAI,
        ROUTER_DIRECTIVES,
        ImagesMedia,
        ShareLinksComponent,
        ArticleContentComponent,
        RecommendationsComponent,
        DisqusComponent,
        LoadingComponent,
        TrendingComponent,
        SidekickContainerComponent,
        WidgetModule,
        ComplexInnerHtml
    ],
})

export class ArticlePages implements OnInit {
    article:Article;
    articleData:ArticleData;
    copyright:Array<any>;
    images:Array<any>;
    imageData:Array<any>;
    imageLinks:Array<any>;
    imageTitle:Array<any>;
    randomArticles:Array<any>;
    randomHeadlines:Array<any>;
    routeList:Array<any>;
    trendingData:Array<any>;
    trendingImages:Array<any>;
    aiSidekick:boolean = true;
    checkPartner:boolean;
    error:boolean = false;
    hasEventId:boolean = true;
    hasImages:boolean = false;
    isFantasyReport:boolean = false;
    isSmall:boolean = false;
    teamId:number;
    articleType:string;
    articleSubType:string;
    content:string;
    comment:string;
    eventID:string;
    eventType:string;
    date:string;
    pageIndex:string;
    partnerId:string;
    rawUrl:string;
    title:string;
    scope:string = null;
    constructorControl: boolean = true;
    constructor(private _params:RouteParams,
                private _router:Router,
                private _articleDataService:ArticleDataService,
                private _location:Location,
                private _seoService:SeoService) {
        //check to see if scope is correct and redirect
        VerticalGlobalFunctions.scopeRedirect(_router, _params);
        window.scrollTo(0, 0);
        GlobalSettings.getParentParams(_router, parentParams => {
            if (this.constructorControl) {
                this.scope = parentParams.scope == "nfl" ? "nfl" : "ncaa";
                if (parentParams.partnerID != null) {
                    this.partnerId = parentParams.partnerID;
                }
                this.getArticles();
                this.constructorControl = false;
            }
        });
        this.eventID = _params.get('eventID');
        this.eventType = GlobalFunctions.getApiArticleType(_params.get('eventType'));
        this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
        if (this.eventType == "player-fantasy") {
            this.isFantasyReport = true;
        }
    }

    getArticles() {
        this._articleDataService.getArticle(this.eventID, this.eventType, this.partnerId, this.scope, this.isFantasyReport)
            .subscribe(
                Article => {
                    if (Article['data'].length > 0) {
                        if (this.isFantasyReport) {
                            this.eventID = Article['data'][0].event_id;
                            this.eventID != null ? this.hasEventId = true : this.hasEventId = false;
                        }
                        this.parseLinks(Article['data'][0]['article_data']['route_config'], Article['data'][0]['article_data']['article']);
                        var articleType = GlobalFunctions.getArticleType(this._params.get('eventType'));
                        this.articleType = articleType[1];
                        this.articleSubType = articleType[2];
                        this.isSmall = window.innerWidth < 640;
                        this.rawUrl = window.location.href;
                        this.pageIndex = articleType[0];
                        this.title = Article['data'][0]['article_data'][this.pageIndex].displayHeadline;
                        this.date = GlobalFunctions.sntGlobalDateFormatting(Article['data'][0]['article_data'].publication_date,"timeZone");
                        this.comment = Article['data'][0]['article_data'].comment_header;
                        this.articleData = Article['data'][0]['article_data'];
                        this.teamId = Article['data'][0]['article_data'].teamId;

                        //create meta description that is below 160 characters otherwise will be truncated
                        let metaDesc = Article['data'][0].meta_headline;
                        let link = window.location.href;
                        let image = GlobalSettings.getImageUrl(Article['data'][0]['article_data']['images'][0].image_url);
                        this._seoService.setCanonicalLink(this._params.params, this._router);
                        this._seoService.setOgTitle(this.title);
                        this._seoService.setOgDesc(metaDesc);
                        this._seoService.setOgType('Website');
                        this._seoService.setOgUrl(link);
                        this._seoService.setOgImage(image);
                        this._seoService.setTitle(this.title);
                        this._seoService.setMetaDescription(metaDesc);
                        this._seoService.setMetaRobots('INDEX, FOLLOW');

                        if (Article['data'][0]['article_data']['images'] != null) {
                            this.getCarouselImages(Article['data'][0]['article_data']['images']);
                        } else {
                            this.hasImages = false;
                        }
                        this.imageLinks = this.getImageLinks(Article['data'][0]['article_data']);
                        if (this.hasEventId) {
                            this.getRecommendedArticles();
                        }
                    }
                },
                err => {
                    this.error = true;
                    var self = this;
                    setTimeout(function () {
                        //removes error page from browser history
                        self._location.replaceState('/');
                        //returns user to previous page
                        self._location.back();
                    }, 5000);
                }
            );
    }

    parseLinks(routeData, articleData) {
        var placeHolder = null;
        var routes;
        var fullRoutes = [];
        var newParagraph = [];
        var paragraph;
        var complexArray = [];
        var self = this;
        routeData.forEach(function (val) {
            if (val.route_type == "tdl_team") {
                routes = {
                    index: val.paragraph_index,
                    name: val.display,
                    route: VerticalGlobalFunctions.formatTeamRoute(val.display, val.id),
                    searchParameter: "<ng2-route>" + val.display + "<\s*/?ng2-route>",
                };
            } else {
                routes = {
                    index: val.paragraph_index,
                    name: val.display,
                    route: VerticalGlobalFunctions.formatPlayerRoute(val.team_name, val.display, val.id),
                    searchParameter: "<ng2-route>" + val.display + "<\s*/?ng2-route>",
                };
            }
            fullRoutes.push(routes);
        });
        this.routeList = fullRoutes;
        articleData.forEach(function (val, index) {
            if (typeof val != "object") {
                if (val == "") {
                    complexArray = [
                        {text: "empty"}
                    ];
                    articleData[index] = newParagraph.concat(complexArray);
                } else {
                    complexArray = [
                        {text: val},
                        {text: "<br><br>", class: "line-break"}
                    ];
                    articleData[index] = complexArray;
                    for (var i = 0; i < self.routeList.length; i++) {
                        if (index == self.routeList[i].index) {
                            var stringSearch = new RegExp(self.routeList[i].searchParameter);
                            if (placeHolder == null) {
                                paragraph = val;
                            } else {
                                paragraph = placeHolder;
                            }
                            if (paragraph.split(stringSearch)[1]) {
                                if (paragraph.split(stringSearch)[0] != "") {
                                    complexArray = [
                                        {text: paragraph.split(stringSearch)[0]},
                                        {
                                            text: self.routeList[i].name,
                                            route: self.routeList[i].route
                                        }
                                    ];
                                } else {
                                    complexArray = [
                                        {
                                            text: self.routeList[i].name,
                                            route: self.routeList[i].route
                                        }
                                    ];
                                }
                                placeHolder = paragraph.split(stringSearch)[1];
                                newParagraph = newParagraph.concat(complexArray);
                                if (i == self.routeList.length - 1) {
                                    complexArray = [
                                        {text: placeHolder},
                                        {text: "<br><br>", class: "line-break"}
                                    ];
                                    articleData[index] = newParagraph.concat(complexArray);
                                    newParagraph = [];
                                    placeHolder = null;
                                }
                            } else {
                                complexArray = [
                                    {text: placeHolder},
                                    {text: "<br><br>", class: "line-break"}
                                ];
                            }
                        } else {
                            if (placeHolder != null) {
                                if (placeHolder.charAt(0) != "," && placeHolder.charAt(0) != "." && placeHolder.charAt(0) != "'") {
                                    complexArray = [
                                        {text: placeHolder},
                                        {text: "<br><br>", class: "line-break"}
                                    ];
                                } else {
                                    complexArray = [
                                        {specialText: placeHolder},
                                        {text: "<br><br>", class: "line-break"}
                                    ];
                                }
                                articleData[index] = newParagraph.concat(complexArray);
                                newParagraph = [];
                                placeHolder = null;
                            }
                        }
                    }
                }
            }
        });
    }

    getRecommendedArticles() {
        this.randomArticles = GlobalFunctions.getRandomArticles(this.randomArticles, this.scope, this.eventType);
        var result = [];
        this._articleDataService.getRecommendationsData(this.eventID, this.scope)
            .subscribe(
                HeadlineData => {
                    HeadlineData = HeadlineData.data;
                    if (HeadlineData.length) {
                        for (var i = 3; i > result.length && HeadlineData.length;) {
                            let j = HeadlineData.length;
                            let rand = Math.floor(Math.random() * j);
                            if (HeadlineData[rand].article_data != null) {
                                var eventType = HeadlineData[rand]['article_data'].report_type;
                                var eventId = eventType != "player-fantasy" ? HeadlineData[rand].event_id.toString() : HeadlineData[rand].id.toString();
                                result.push(ArticlePages.getRandomArticles(HeadlineData[rand], eventType, eventId));
                                HeadlineData.splice(rand, 1);
                            }
                        }
                    }
                    this.randomHeadlines = result;
                }
            );
    }

    getCarouselImages(data) {
        var images = [];
        var imageArray = [];
        var copyArray = [];
        var titleArray = [];

        if (this.articleType == "game-module" || this.articleType == "team-record") {
            images = data['home_images'].concat(data['away_images']);
        } else if (this.articleType == "playerRoster") {
            images = data['home_images'];
        } else if (this.isFantasyReport) {
            images = data['home_images'].concat(data['player_images']);
        } else {
            images = data['away_images'];
        }
        data.sort(function () {
            return 0.5 - Math.random()
        });
        try {
            data.forEach(function (val) {
                imageArray.push(VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(val['image_url']));
                copyArray.push(val['image_copyright']);
                titleArray.push(val['image_title']);
            });
            if (imageArray) {
                this.imageData = imageArray;
                this.copyright = copyArray;
                this.imageTitle = titleArray;
            } else {
                this.imageData = null;
                this.copyright = null;
                this.imageTitle = null;
            }
            this.hasImages = true;
        } catch (err) {
            this.hasImages = false;
        }
    }

    getImageLinks(data) {
        var links = [];
        if (this.articleType == "playerRoster") {
            data['article'].forEach(function (val) {
                if (val['player_roster_module']) {
                    let playerUrl = VerticalGlobalFunctions.formatPlayerRoute(val['player_roster_module'].team_name, val['player_roster_module'].name, val['player_roster_module'].id);
                    val['player'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['player_roster_module']['headshot']),
                            urlRouteArray: playerUrl,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }

                    };
                    val['playerSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['player_roster_module']['headshot']),
                            urlRouteArray: playerUrl,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['player'], val['playerSmall']);
                }
            });
            return links;
        }
        if (this.articleType == 'playerComparison') {
            data['article'][2]['player_comparison_module'].forEach(function (val, index) {
                if (index == 0) {
                    let urlPlayerLeft = VerticalGlobalFunctions.formatPlayerRoute(val.team_name, val.name, val.id);
                    val['imageLeft'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['headshot']),
                            urlRouteArray: urlPlayerLeft,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageLeftSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['headshot']),
                            urlRouteArray: urlPlayerLeft,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageLeft'], val['imageLeftSmall']);
                }
                if (index == 1) {
                    let urlPlayerRight = VerticalGlobalFunctions.formatPlayerRoute(val.team_name, val.name, val.id);
                    val['imageRight'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['headshot']),
                            urlRouteArray: urlPlayerRight,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageRightSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['headshot']),
                            urlRouteArray: urlPlayerRight,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageRight'], val['imageRightSmall']);
                }
            });
            return links;
        }
        if (this.articleType == 'game_module') {
            data['article'].forEach(function (val, index) {
                if (index == 1 && val['game_module']) {
                    var shortDate = val['game_module'].event_date;
                    shortDate = shortDate.substr(shortDate.indexOf(",") + 1);
                    let urlTeamLeftTop = VerticalGlobalFunctions.formatTeamRoute(val['game_module'].home_team_name, val['game_module'].home_team_id);
                    let urlTeamRightTop = VerticalGlobalFunctions.formatTeamRoute(val['game_module'].away_team_name, val['game_module'].away_team_id);
                    val['teamLeft'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['game_module'].home_team_logo),
                            urlRouteArray: urlTeamLeftTop,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['game_module'].away_team_logo),
                            urlRouteArray: urlTeamRightTop,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamLeftSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['game_module'].home_team_logo),
                            urlRouteArray: urlTeamLeftTop,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRightSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['game_module'].away_team_logo),
                            urlRouteArray: urlTeamRightTop,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['teamLeft'], val['teamRight'], val['teamLeftSmall'], val['teamRightSmall'], shortDate);
                }
                if (index == 4 && val['game_module']) {
                    var shortDate = val['game_module'].event_date;
                    shortDate = shortDate.substr(shortDate.indexOf(",") + 1);
                    let urlTeamLeftBottom = VerticalGlobalFunctions.formatTeamRoute(val['game_module'].home_team_name, val['game_module'].home_team_id);
                    let urlTeamRightBottom = VerticalGlobalFunctions.formatTeamRoute(val['game_module'].away_team_name, val['game_module'].away_team_id);
                    val['teamLeft'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['game_module'].home_team_logo),
                            urlRouteArray: urlTeamLeftBottom,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['game_module'].away_team_logo),
                            urlRouteArray: urlTeamRightBottom,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamLeftSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['game_module'].home_team_logo),
                            urlRouteArray: urlTeamLeftBottom,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRightSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['game_module'].away_team_logo),
                            urlRouteArray: urlTeamRightBottom,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['teamLeft'], val['teamRight'], val['teamLeftSmall'], val['teamRightSmall'], shortDate);
                }
            });
            return links;
        }
        if (this.articleType == 'teamRecord') {
            var isFirstTeam = true;
            data['article'].forEach(function (val) {
                if (val['team_record_module'] && isFirstTeam) {
                    let urlFirstTeam = VerticalGlobalFunctions.formatTeamRoute(val['team_record_module'].name, val['team_record_module'].id);
                    val['imageTop'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['team_record_module'].logo),
                            urlRouteArray: urlFirstTeam,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageTopSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['team_record_module'].logo),
                            urlRouteArray: urlFirstTeam,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageTop'], val['imageTopSmall']);
                    return isFirstTeam = false;
                }
                if (val['team_record_module'] && !isFirstTeam) {
                    let urlSecondTeam = VerticalGlobalFunctions.formatTeamRoute(val['team_record_module'].name, val['team_record_module'].id);
                    val['imageBottom'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['team_record_module'].logo),
                            urlRouteArray: urlSecondTeam,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageBottomSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['team_record_module'].logo),
                            urlRouteArray: urlSecondTeam,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageBottom'], val['imageBottomSmall']);
                }
            });
            return links;
        }
    }

    getImages(imageList) {
        imageList.sort(function () {
            return 0.5 - Math.random()
        });
        return this.images = imageList;
    }

    static getRandomArticles(recommendations, pageIndex, eventID) {
        var articles = {
            title: recommendations.title,
            eventType: pageIndex,
            eventID: eventID,
            images: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(recommendations.image_url),
            date: GlobalFunctions.sntGlobalDateFormatting(recommendations.last_updated,"dayOfWeek"),
            keyword: "FOOTBALL"
        };
        return articles;
    }

    ngOnInit() {
        //This has to be resize to trigger the takeover update
        try {
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            //to run resize event on IE
            var resizeEvent = document.createEvent('UIEvents');
            resizeEvent.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(resizeEvent);
        }
    }
}
