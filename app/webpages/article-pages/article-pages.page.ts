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
    ]
})

export class ArticlePages implements OnInit {
    article:Article;
    articleData:ArticleData;
    randomHeadlines:Array<any>;
    imageData:any;
    images:Array<any>;
    eventID:string;
    eventType:string;
    title:string;
    date:string;
    content:string;
    comment:string;
    pageIndex:string;
    articleType:string;
    articleSubType:string;
    imageLinks:Array<any>;
    recommendedImageData:any;
    copyright:any;
    imageTitle:any;
    teamId:number;
    trendingData:Array<any>;
    trendingImages:Array<any>;
    error:boolean = false;
    hasImages:boolean = false;
    aiSidekick:boolean = true;
    partnerId:string;
    isSmall:boolean = false;
    rawUrl:string;
    randomArticles:string;
    scope:string = null;

    constructor(private _params:RouteParams,
                private _router:Router,
                private _articleDataService:ArticleDataService,
                private _location:Location) {
        window.scrollTo(0, 0);
        GlobalSettings.getParentParams(_router, parentParams => {
            this.scope = parentParams.scope == "nfl" ? "nfl" : "ncaa";
            if (parentParams.partnerID != null) {
                this.partnerId = parentParams.partnerID;
            }
            this.getArticles();
        });
        this.eventID = _params.get('eventID');
        this.eventType = _params.get('eventType');
        if (this.eventType == "upcoming-game") {
            this.eventType = "upcoming";
        }
    }

    getArticles() {
        this._articleDataService.getArticle(this.eventID, this.eventType, this.partnerId, this.scope)
            .subscribe(
                Article => {
                    if (Article['data'].length > 0) {
                        var articleType = [];
                        if (Article['data'][0].article_type_id != null) {
                            articleType = GlobalFunctions.getArticleType(Article['data'][0].article_type_id, true);
                        } else {
                            articleType = GlobalFunctions.getArticleType(Article['data'][0].article_subtype_id, false);
                        }
                        this.articleType = articleType[1];
                        this.articleSubType = articleType[2];
                        this.isSmall = window.innerWidth <= 640;
                        this.rawUrl = window.location.href;
                        this.pageIndex = articleType[0];
                        this.title = Article['data'][0]['article_data'][this.pageIndex].displayHeadline;
                        this.date = Article['data'][0]['article_data'][this.pageIndex].dateline;
                        this.comment = Article['data'][0]['article_data'][this.pageIndex].commentHeader;
                        this.articleData = Article['data'][0]['article_data'][this.pageIndex];
                        //this.teamId = ArticleData[pageIndex].teamId; turn on once ai billboard is wired up for football
                        this.teamId = 2808;
                        ArticlePages.setMetaTag(this.articleData.metaHeadline);
                        //this.getCarouselImages(ArticleData[pageIndex]['images']);
                        //this.imageLinks = this.getImageLinks(ArticleData[pageIndex]);
                    }
                },
                err => {
                    this.error = true;
                    var self = this;
                    console.log('Error loading article data, ', err);
                    setTimeout(function () {
                        //removes error page from browser history
                        self._location.replaceState('/');
                        //returns user to previous page
                        self._location.back();
                    }, 5000);
                }
            );
        this.randomArticles = GlobalFunctions.getRandomArticles(this.randomArticles, this.scope, this.eventType);
        var random = [];
        for (var i = 0; i < 3; i++) {
            this._articleDataService.getRecommendationsData(this.eventID, this.randomArticles[i], this.scope)
                .subscribe(
                    HeadlineData => {
                        if (HeadlineData['data'].length > 0) {
                            if (HeadlineData['data'][0].article_type_id != null) {
                                var index = GlobalFunctions.getArticleType(HeadlineData['data'][0].article_type_id, true);
                            } else {
                                var index = GlobalFunctions.getArticleType(HeadlineData['data'][0].article_subtype_id, false);
                            }
                            this.eventID = HeadlineData['data'][0].event_id.toString();
                            this.recommendedImageData = "derp";
                            random.push(ArticlePages.getRandomArticles(HeadlineData['data'][0], index[0], this.eventID));
                        }
                    }
                );
        }
        this.randomHeadlines = random;
        //if (this.articleTitle != undefined) {
        //    this._headlineDataService.getAiHeadlineDataLeague()
        //        .subscribe(
        //            TrendingData => {
        //                console.log(TrendingData);
        //                this.getTrendingArticles(TrendingData);
        //            }
        //        );
        //}
    }

    //Possible fix for partner site link issues.
    //parseLinks(data) {
    //    try {
    //        data['article'].map(function (val, index) {
    //            var strToParse = val.match("<a href=" + "(.*?)" + "</a>");
    //            if (strToParse != null) {
    //                var urlInfo = strToParse[1].split("/");
    //                if (urlInfo[1] == "player") {
    //                    var url = VerticalGlobalFunctions.formatPlayerRoute(urlInfo[2], urlInfo[3], urlInfo[4].slice(0, 5));
    //                } else if (urlInfo[1] == "team") {
    //                    var url = VerticalGlobalFunctions.formatTeamRoute(urlInfo[2], urlInfo[3].slice(0, 4));
    //                }
    //                data['article'][index] = val.replace(strToParse[0], url);
    //            }
    //        });
    //    } catch (err) {
    //    }
    //}

    getCarouselImages(data) {
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
        } else if (this.articleType == "playerRoster") {
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
                            imageUrl: val['playerRosterModule']['headshot'],
                            urlRouteArray: playerUrl,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['playerSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['playerRosterModule']['headshot'],
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
                            imageUrl: val['headshot'],
                            urlRouteArray: urlPlayerLeft,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageLeftSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['headshot'],
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
                            imageUrl: val['headshot'],
                            urlRouteArray: urlPlayerRight,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageRightSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['headshot'],
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
                            imageUrl: val['gameModule'].homeTeamLogo,
                            urlRouteArray: urlTeamLeftTop,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['gameModule'].awayTeamLogo,
                            urlRouteArray: urlTeamRightTop,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamLeftSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['gameModule'].homeTeamLogo,
                            urlRouteArray: urlTeamLeftTop,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRightSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['gameModule'].awayTeamLogo,
                            urlRouteArray: urlTeamRightTop,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['teamLeft'], val['teamRight'], val['teamLeftSmall'], val['teamRightSmall'], shortDate);
                }
                if (index == 5 && val['gameModule']) {
                    var shortDate = val['gameModule'].eventDate;
                    shortDate = shortDate.substr(shortDate.indexOf(",") + 1);
                    let urlTeamLeftBottom = VerticalGlobalFunctions.formatTeamRoute(val['gameModule'].homeTeamName, val['gameModule'].homeTeamId);
                    let urlTeamRightBottom = VerticalGlobalFunctions.formatTeamRoute(val['gameModule'].awayTeamName, val['gameModule'].awayTeamId);
                    val['teamLeft'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['gameModule'].homeTeamLogo,
                            urlRouteArray: urlTeamLeftBottom,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['gameModule'].awayTeamLogo,
                            urlRouteArray: urlTeamRightBottom,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamLeftSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['gameModule'].homeTeamLogo,
                            urlRouteArray: urlTeamLeftBottom,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRightSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['gameModule'].awayTeamLogo,
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
                            imageUrl: val['teamRecordModule'].logo,
                            urlRouteArray: urlFirstTeam,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageTopSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['teamRecordModule'].logo,
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
                            imageUrl: val['teamRecordModule'].logo,
                            urlRouteArray: urlSecondTeam,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['imageBottomSmall'] = {
                        imageClass: "image-71",
                        mainImage: {
                            imageUrl: val['teamRecordModule'].logo,
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
            //images: self.images[imageCount],
            date: recommendations.last_updated,
            keyword: "BASEBALL"
        };
        return articles;
    }

    static setMetaTag(metaData) {
        if (metaData !== null) {
            var metaTag = document.createElement('meta');
            metaTag.name = 'description';
            metaTag.content = metaData;
            document.head.appendChild(metaTag);
        }
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
