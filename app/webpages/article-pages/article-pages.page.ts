import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ImagesMedia} from "../../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import {ShareLinksComponent} from "../../fe-core/components/articles/shareLinks/shareLinks.component";
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
        SidekickContainerComponent
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
    trendingData:Array<any>;
    trendingImages:Array<any>;
    aiSidekick:boolean = true;
    error:boolean = false;
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
    checkPartner:boolean;
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
          if(this.constructorControl){
            this.scope = parentParams.scope == "nfl" ? "nfl" : "ncaa";
            if (parentParams.partnerID != null) {
              this.partnerId = parentParams.partnerID;
            }
            this.getArticles();
            this.constructorControl = false;
          }
        });
        this.eventID = _params.get('eventID');
        this.eventType = _params.get('eventType');
        if (this.eventType == "upcoming-game") {
            this.eventType = "upcoming";
        }
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
                        }
                        var articleType = [];
                        if (Article['data'][0].article_type_id != null) {
                            articleType = GlobalFunctions.getArticleType(Article['data'][0].article_type_id, true);
                        } else {
                            articleType = GlobalFunctions.getArticleType(Article['data'][0].article_subtype_id, false);
                            //articleType = [Object.keys(Article.data[0]['article_data'])[0]];
                            //articleType = GlobalFunctions.getArticleType(Article['data'][0].article_type_id, true);
                        }
                        this.articleType = articleType[1];
                        this.articleSubType = articleType[2];
                        //this.articleType = articleType[0];
                        //this.articleSubType = articleType[2];
                        this.isSmall = window.innerWidth < 640;
                        this.rawUrl = window.location.href;
                        this.pageIndex = articleType[0];
                        this.title = Article['data'][0]['article_data'][this.pageIndex].displayHeadline;
                        this.date = GlobalFunctions.sntGlobalDateFormatting(Article['data'][0]['article_data'][this.pageIndex].dateline,"timeZone");
                        this.comment = Article['data'][0]['article_data'][this.pageIndex].commentHeader;
                        this.articleData = Article['data'][0]['article_data'][this.pageIndex];
                        this.teamId = Article['data'][0]['article_data'][this.pageIndex].teamId;

                        //create meta description that is below 160 characters otherwise will be truncated
                        let metaDesc = Article['data'][0].teaser;
                        let link = window.location.href;
                        let image = GlobalSettings.getImageUrl(Article['data'][0]['article_data'][this.pageIndex]['images']['home_images'][0].image_url)
                        this._seoService.setCanonicalLink(this._params.params, this._router);
                        this._seoService.setOgTitle(this.title);
                        this._seoService.setOgDesc(metaDesc);
                        this._seoService.setOgType('Website');
                        this._seoService.setOgUrl(link);
                        this._seoService.setOgImage(image);
                        this._seoService.setTitle(this.title);
                        this._seoService.setMetaDescription(metaDesc);
                        this._seoService.setMetaRobots('INDEX, FOLLOW');

                        if (Article['data'][0]['article_data'][this.pageIndex]['images'] != null) {
                            this.getCarouselImages(Article['data'][0]['article_data'][this.pageIndex]['images']);
                        } else {
                            this.hasImages = false;
                        }
                        this.imageLinks = this.getImageLinks(Article['data'][0]['article_data'][this.pageIndex]);
                        this.getRecommendedArticles();
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
                                var eventType = Object.keys(HeadlineData[rand].article_data)[0];
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
        images.sort(function () {
            return 0.5 - Math.random()
        });
        try {
            images.forEach(function (val) {
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
                if (val['playerRosterModule']) {
                    let playerUrl = VerticalGlobalFunctions.formatPlayerRoute(val['playerRosterModule'].teamName, val['playerRosterModule'].name, val['playerRosterModule'].id);
                    val['player'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['playerRosterModule']['headshot']),
                            urlRouteArray: playerUrl,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }

                    };
                    val['playerSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['playerRosterModule']['headshot']),
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
            data['article'][2]['playerComparisonModule'].forEach(function (val, index) {
                if (index == 0) {
                    let urlPlayerLeft = VerticalGlobalFunctions.formatPlayerRoute(val.teamName, val.name, val.id);
                    val['imageLeft'] = {
                        imageClass: "image-121",
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
                    let urlPlayerRight = VerticalGlobalFunctions.formatPlayerRoute(val.teamName, val.name, val.id);
                    val['imageRight'] = {
                        imageClass: "image-121",
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
        if (this.articleType == 'gameModule') {
            data['article'].forEach(function (val, index) {
                if (index == 1 && val['gameModule']) {
                    var shortDate = val['gameModule'].eventDate;
                    shortDate = shortDate.substr(shortDate.indexOf(",") + 1);
                    let urlTeamLeftTop = VerticalGlobalFunctions.formatTeamRoute(val['gameModule'].homeTeamName, val['gameModule'].homeTeamId);
                    let urlTeamRightTop = VerticalGlobalFunctions.formatTeamRoute(val['gameModule'].awayTeamName, val['gameModule'].awayTeamId);
                    val['teamLeft'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].homeTeamLogo),
                            urlRouteArray: urlTeamLeftTop,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].awayTeamLogo),
                            urlRouteArray: urlTeamRightTop,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamLeftSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].homeTeamLogo),
                            urlRouteArray: urlTeamLeftTop,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRightSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].awayTeamLogo),
                            urlRouteArray: urlTeamRightTop,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['teamLeft'], val['teamRight'], val['teamLeftSmall'], val['teamRightSmall'], shortDate);
                }
                if (index == 4 && val['gameModule']) {
                    var shortDate = val['gameModule'].eventDate;
                    shortDate = shortDate.substr(shortDate.indexOf(",") + 1);
                    let urlTeamLeftBottom = VerticalGlobalFunctions.formatTeamRoute(val['gameModule'].homeTeamName, val['gameModule'].homeTeamId);
                    let urlTeamRightBottom = VerticalGlobalFunctions.formatTeamRoute(val['gameModule'].awayTeamName, val['gameModule'].awayTeamId);
                    val['teamLeft'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].homeTeamLogo),
                            urlRouteArray: urlTeamLeftBottom,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].awayTeamLogo),
                            urlRouteArray: urlTeamRightBottom,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamLeftSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].homeTeamLogo),
                            urlRouteArray: urlTeamLeftBottom,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRightSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].awayTeamLogo),
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
                if (val['teamRecordModule'] && isFirstTeam) {
                    let urlFirstTeam = VerticalGlobalFunctions.formatTeamRoute(val['teamRecordModule'].name, val['teamRecordModule'].id);
                    val['imageTop'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['teamRecordModule'].logo),
                            urlRouteArray: urlFirstTeam,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageTopSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['teamRecordModule'].logo),
                            urlRouteArray: urlFirstTeam,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageTop'], val['imageTopSmall']);
                    return isFirstTeam = false;
                }
                if (val['teamRecordModule'] && !isFirstTeam) {
                    let urlSecondTeam = VerticalGlobalFunctions.formatTeamRoute(val['teamRecordModule'].name, val['teamRecordModule'].id);
                    val['imageBottom'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['teamRecordModule'].logo),
                            urlRouteArray: urlSecondTeam,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageBottomSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['teamRecordModule'].logo),
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
            date: GlobalFunctions.sntGlobalDateFormatting(recommendations.last_updated,"defaultDate"),
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
