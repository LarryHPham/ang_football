import {Component, AfterViewInit, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';

//globals
import {GlobalFunctions} from "../../global/global-functions";
import {GlobalSettings} from "../../global/global-settings";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

//services
import {ArticleDataService} from "../../services/article-page-service";
import {DeepDiveService} from '../../services/deep-dive.service';
import {GeoLocation, PartnerHeader} from "../../global/global-service";
import {HeadlineDataService} from "../../services/headline-module-service";
//import {SeoService} from '../../seo.service';

//interfaces
import {Article} from "../../global/global-interface";
import {ArticleData} from "../../global/global-interface";

//libraries
declare var jQuery:any;
declare var moment;

@Component({
    selector: 'article-pages',
    templateUrl: './app/webpages/article-pages/article-pages.page.html'
})

export class ArticlePages implements OnInit {
    public params;
    public trendingData:any;
    public trendingLength:number = 10;
    article:Article;
    articleData:any;
    subRec:any;
    throttle:any;
    copyright:Array<any>;
    images:Array<any>;
    imageData:Array<any>;
    imageLinks:Array<any>;
    imageTitle:Array<any>;
    randomArticles:Array<any>;
    randomHeadlines:Array<any>;
    routeList:Array<any>;
    aiSidekick:boolean = true;
    checkPartner:boolean;
    error:boolean = false;
    hasEventId:boolean = true;
    hasImages:boolean = false;
    hasRun:boolean = false;
    isFantasyReport:boolean = false;
    isSmall:boolean = false;
    isTrendingMax:boolean = false;
    teamId:number;
    articleSubType:string;
    articleType:string;
    eventType:string;
    content:string;
    eventID:string;
    date:string;
    isArticle:string;
    pageIndex:string;
    partnerId:string;
    rawUrl:string;
    title:string;
    type:string;
    scope:string = null;
    partnerID:string;
    geoLocation:string;
    iframeUrl:any;
    batch:number = 1;
    isScroll:number = 0;

    constructor(private _activateRoute:ActivatedRoute,
                private _router:Router,
                private _articleDataService:ArticleDataService,
                private _location:Location,
                //private _seoService:SeoService,
                private _deepDiveService:DeepDiveService,
                private _geoLocation:GeoLocation,
                private _partnerData:PartnerHeader,
                private _headlineDataService:HeadlineDataService) {
        this.subRec = this._activateRoute.params.subscribe(
            (params:any) => {
                this.articleData = null;
                window.scrollTo(0, 0);
                this.scope = params.scope == "nfl" ? "nfl" : "ncaa";
                if (params.partnerID != null) {
                    this.partnerId = params.partnerID;
                }
                this.params = this._activateRoute.params.subscribe(
                    (param:any)=> {
                        this.eventID = param['eventID'];
                        this.eventType = param['eventType'];
                    }
                );
                if (this.eventType == "story") {
                    this.isArticle = 'false';
                    this.getDeepDiveArticle(this.eventID);
                    this.getPartnerHeader();
                }
                if (this.eventType == "video") {
                    this.isArticle = 'false';
                    this.getDeepDiveVideo(this.eventID);
                    this.getPartnerHeader();
                }
                if (this.eventType != 'story' && this.eventType != 'video') {
                    this.isArticle = 'true';
                    this.scope = params.scope;
                    this.type = this.eventType;
                    this.eventType = GlobalFunctions.getApiArticleType(this.eventType);
                    if (this.eventType == "articleType=player-fantasy") {
                        this.isFantasyReport = true;
                    }
                    this.getArticles();
                }
                this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
                this.rawUrl = window.location.href;
            }
        );
    }

    getArticles() {
        this._articleDataService.getArticle(this.eventID, this.eventType, this.partnerId, this.scope, this.isFantasyReport)
            .subscribe(
                Article => {
                    try {
                        if (Article['data'].length > 0) {
                            if (this.isFantasyReport) {
                                this.eventID = Article['data'][0].event_id;
                                this.eventID != null ? this.hasEventId = true : this.hasEventId = false;
                            }
                            this.parseLinks(Article['data'][0]['article_data']['route_config'], Article['data'][0]['article_data']['article']);
                            var articleType = GlobalFunctions.getArticleType(this.type);
                            this.articleType = articleType[1];
                            this.articleSubType = articleType[2];
                            this.isSmall = window.innerWidth < 640;
                            this.rawUrl = window.location.href;
                            this.pageIndex = articleType[0];
                            this.title = Article['data'][0]['article_data'].title;
                            this.date = GlobalFunctions.sntGlobalDateFormatting(Article['data'][0]['article_data'].publication_date * 1000, "timeZone");
                            this.articleData = Article['data'][0]['article_data'];
                            if (this.eventType != "articleType=player-fantasy" || Article['data'][0].team_id != null) {
                                this.teamId = Article['data'][0].team_id;
                            } else {
                                this.teamId = Article['data'][0]['article_data']['metadata'].team_id;
                            }
                            this.metaTags(Article['data'][0]);
                            if (Article['data'][0]['article_data']['images'] != null) {
                                this.getCarouselImages(Article['data'][0]['article_data']['images']);
                            } else {
                                this.hasImages = false;
                            }
                            this.imageLinks = this.getImageLinks(Article['data'][0]['article_data']);
                            if (this.hasEventId) {
                                this.getRecommendedArticles();
                            }
                            this.getTrendingArticles(10, this.eventID);
                        }
                    } catch (e) {
                        this.error = true;
                        var self = this;
                        setTimeout(function () {
                            //removes error page from browser history
                            self._location.replaceState('/');
                            //returns user to previous page
                            self._router.navigateByUrl('Default-home');
                        }, 5000);
                    }
                },
                err => {
                    this.error = true;
                    var self = this;
                    setTimeout(function () {
                        //removes error page from browser history
                        self._location.replaceState('/');
                        //returns user to previous page
                        self._router.navigateByUrl('Default-home');
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
        if (routeData) {
            routeData.forEach(function (val) {
                if (val.route_type == "tdl_team") {
                    routes = {
                        index: val.paragraph_index,
                        name: val.display,
                        route: VerticalGlobalFunctions.formatTeamRoute(self.scope, val.display, val.id),
                        searchParameter: "<ng2-route>" + val.display + "<\s*/?ng2-route>",
                    };
                } else {
                    routes = {
                        index: val.paragraph_index,
                        name: val.display,
                        route: VerticalGlobalFunctions.formatPlayerRoute(self.scope, val.team_name, val.display, val.id),
                        searchParameter: "<ng2-route>" + val.display + "<\s*/?ng2-route>",
                    };
                }
                fullRoutes.push(routes);
            });
            this.routeList = fullRoutes;
        } else {
            this.routeList = [];
        }
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
                            } else if (i == self.routeList.length - 1) {
                                complexArray = [
                                    {text: placeHolder},
                                    {text: "<br><br>", class: "line-break"}
                                ];
                                articleData[index] = newParagraph.concat(complexArray);
                                newParagraph = [];
                                placeHolder = null;
                            } else {
                                complexArray = [
                                    {text: placeHolder},
                                    {text: "<br><br>", class: "line-break"}
                                ];
                            }
                            if (complexArray[0].text == null) {
                                complexArray = [
                                    {text: val},
                                    {text: "<br><br>", class: "line-break"}
                                ];
                                articleData[index] = newParagraph.concat(complexArray);
                                newParagraph = [];
                                placeHolder = null;
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
        if (this.eventType != "story" && this.eventType != "video") {
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
                                    var eventId = eventType != "player-fantasy" ? HeadlineData[rand].event_id.toString() : HeadlineData[rand].article_id.toString();
                                    result.push(ArticlePages.getRandomArticles(HeadlineData[rand], eventType, eventId, this.scope));
                                    HeadlineData.splice(rand, 1);
                                }
                            }
                        }
                        this.randomHeadlines = result;
                    }
                );
        } else {
            var startNum = Math.floor((Math.random() * 8) + 1);
            //needed to uppercase for ai to grab data correctly
            this._deepDiveService.getRecArticleData(this.scope, this.geoLocation, startNum, 3)
                .subscribe(data => {
                    this.randomHeadlines = this._deepDiveService.transformToRecArticles(data);
                });
        }
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
            images = data['images'];
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
        var self = this;
        if (this.articleType == "playerRoster") {
            data['article'].forEach(function (val) {
                if (val['player_roster_module']) {
                    let playerUrl = VerticalGlobalFunctions.formatPlayerRoute(self.scope, val['player_roster_module'].team_name, val['player_roster_module'].name, val['player_roster_module'].id);
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
                    let urlPlayerLeft = VerticalGlobalFunctions.formatPlayerRoute(self.scope, val.team_name, val.name, val.id);
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
                    let urlPlayerRight = VerticalGlobalFunctions.formatPlayerRoute(self.scope, val.team_name, val.name, val.id);
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
                    let urlTeamLeftTop = VerticalGlobalFunctions.formatTeamRoute(self.scope, val['game_module'].home_team_name, val['game_module'].home_team_id);
                    let urlTeamRightTop = VerticalGlobalFunctions.formatTeamRoute(self.scope, val['game_module'].away_team_name, val['game_module'].away_team_id);
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
                    let urlTeamLeftBottom = VerticalGlobalFunctions.formatTeamRoute(self.scope, val['game_module'].home_team_name, val['game_module'].home_team_id);
                    let urlTeamRightBottom = VerticalGlobalFunctions.formatTeamRoute(self.scope, val['game_module'].away_team_name, val['game_module'].away_team_id);
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
                    let urlFirstTeam = VerticalGlobalFunctions.formatTeamRoute(self.scope, val['team_record_module'].name, val['team_record_module'].id);
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
                    let urlSecondTeam = VerticalGlobalFunctions.formatTeamRoute(self.scope, val['team_record_module'].name, val['team_record_module'].id);
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

    private getTrendingArticles(count, currentArticleId) {
        if (this.eventType != "story" && this.eventType != "video") {
            this._headlineDataService.getAiTrendingData(count, this.scope).subscribe(
                data => {
                    if (!this.hasRun) {
                        this.hasRun = true;
                        this.trendingData = this.transformTrending(data['data'], currentArticleId);
                        if (data.article_count == this.trendingLength) {
                            this.trendingLength = this.trendingLength + 10
                        } else {
                            this.isTrendingMax = true;
                            jQuery('.loading-more').css('display', 'none');
                        }
                    }
                }
            )
        }
        else {
            this._deepDiveService.getDeepDiveBatchService(this.scope, count, 1, this.geoLocation).subscribe(
                data => {
                    if (!this.hasRun) {
                        this.hasRun = true;
                        this.trendingData = this.transformTrending(data, currentArticleId);
                        if (data.article_count == this.trendingLength) {
                            this.trendingLength = this.trendingLength + 10
                        } else {
                            this.isTrendingMax = true;
                            jQuery('.loading-more').css('display', 'none');
                        }
                    }
                }
            )
        }
    }

    transformTrending(data, currentArticleId) {
        var articles = [];
        var self = this;
        data.forEach(function (val) {
            var articleData;
            if (self.eventType != "story" && self.eventType != "video") {
                if (val.event_id != currentArticleId) {
                    val["date"] = GlobalFunctions.sntGlobalDateFormatting(moment.unix(Number(val.last_updated)), "timeZone");
                    articleData = {
                        author: val['author'],
                        publisher: val['publisher'],
                        title: val.title,
                        date: val["date"],
                        teaser: val.teaser,
                        eventId: val.event_id,
                        eventType: "pregame-report",
                        image: GlobalSettings.getImageUrl(val.image_url),
                        url: VerticalGlobalFunctions.formatArticleRoute(self.scope, val.article_type, val.event_id),
                        rawUrl: window.location.protocol + "//" + window.location.host + "/" + self.scope + "/articles/pregame-report/" + val.event_id
                    };
                }
            } else {
                if (val.id != currentArticleId) {
                    val["date"] = GlobalFunctions.sntGlobalDateFormatting(moment.unix(Number(val.publishedDate)/1000), "timeZone");
                    articleData = {
                        author: val['author'],
                        publisher: val['publisher'],
                        title: val.title,
                        date: val["date"],
                        teaser: val.teaser,
                        eventId: val.id,
                        eventType: "story",
                        image: GlobalSettings.getImageUrl(val.imagePath),
                        url: VerticalGlobalFunctions.formatArticleRoute(val.league, 'story', val.id),
                        rawUrl: window.location.protocol + "//" + window.location.host + "/" + self.scope + "/articles/story/" + val.id
                    };
                }
            }
            if (articleData != null) {
                articles.push(articleData);
            }
        });
        return articles;
    }

    private trendingScroll(event) {
        if (!this.isTrendingMax) {
            this.hasRun = false;
            if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop() && this.trendingLength <= 100) {
                this.batch = this.batch + 1;
                this.getTrendingArticles(this.trendingLength, this.eventID);
            }
        }
    }


    getImages(imageList) {
        imageList.sort(function () {
            return 0.5 - Math.random()
        });
        return this.images = imageList;
    }

    static getRandomArticles(recommendations, pageIndex, eventID, scope) {
        var articles = {
            title: recommendations.title,
            eventType: pageIndex,
            eventID: eventID,
            images: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(recommendations.image_url),
            date: GlobalFunctions.sntGlobalDateFormatting(recommendations.last_updated * 1000, "dayOfWeek"),
            articleUrl: VerticalGlobalFunctions.formatArticleRoute(scope, pageIndex, eventID),
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

    ngAfterViewInit() {
        // to run the resize event on load
        try {
            window.dispatchEvent(new Event('load'));
        } catch (e) {
            //to run resize event on IE
            var resizeEvent = document.createEvent('UIEvents');
            resizeEvent.initUIEvent('load', true, false, window, 0);
            window.dispatchEvent(resizeEvent);
        }
    }

    private getDeepDiveArticle(articleID) {
        this._deepDiveService.getDeepDiveArticleService(articleID).subscribe(
            data => {
                if (data.data.imagePath == null || data.data.imagePath == undefined || data.data.imagePath == "") {
                    this.imageData = ["/app/public/stockphoto_bb_1.jpg", "/app/public/stockphoto_bb_2.jpg"];
                    this.copyright = ["USA Today Sports Images", "USA Today Sports Images"];
                    this.imageTitle = ["", ""];
                } else {
                    this.imageData = [GlobalSettings.getImageUrl(data.data.imagePath)];
                    this.copyright = ["USA Today Sports Images"];
                    this.imageTitle = [""];
                }
                this.metaTags(data);
                this.articleData = data.data;

                this.date = GlobalFunctions.sntGlobalDateFormatting(moment.unix(this.articleData.publishedDate / 1000), "timeZone");
                this.getRecommendedArticles();
            }
        )
    }

    private getDeepDiveVideo(articleID) {
        this._deepDiveService.getDeepDiveVideoService(articleID).subscribe(
            data => {
                this.articleData = data.data;
                this.date = this.formatDate(this.articleData.pubDate);
                this.metaTags(data);
                this.iframeUrl = this.articleData.videoLink;
                this.getRecommendedArticles();
            }
        )
    }

    private metaTags(data) {
        //create meta description that is below 160 characters otherwise will be truncated
        //if (this.isArticle == 'true') {
        //    var teams = [];
        //    var players = [];
        //    let headerData = data['article_data']['metadata'];
        //    let metaDesc = data['article_data'].meta_headline;
        //    let link = window.location.href;
        //    if (headerData['team_name']) {
        //        headerData['team_name'].forEach(function (val) {
        //            teams.push(val);
        //        });
        //    }
        //    if (headerData['player_name']) {
        //        headerData['player_name'].forEach(function (val) {
        //            players.push(val);
        //        });
        //    }
        //    let playerNameMeta = players.join(',');
        //    let teamNameMeta = teams.join(',');
        //    let title = data.title;
        //    let image = data.image_url;
        //    let relevancyStart = headerData['relevancy_start_date'];
        //    let relevancyEnd = headerData['relevancy_end_date'];
        //
        //    this._seoService.setCanonicalLink(this.params, this._router);
        //    this._seoService.setOgTitle(title);
        //    this._seoService.setOgDesc(metaDesc);
        //    this._seoService.setOgType('Website');
        //    this._seoService.setOgUrl(link);
        //    this._seoService.setOgImage(image);
        //    this._seoService.setTitle(title);
        //    this._seoService.setMetaDescription(metaDesc);
        //    //this._seoService.setPlayerNames(playerNameMeta);
        //    //this._seoService.setTeamNames(teamNameMeta);
        //    //this._seoService.setStartDate(relevancyStart);
        //    //this._seoService.setEndDate(relevancyEnd);
        //    //this._seoService.setIsArticle(this.isArticle);
        //    this._seoService.setMetaRobots('INDEX, NOFOLLOW');
        //} else {
        //    let metaDesc;
        //    if (data.data.teaser != null) {
        //        metaDesc = data.data.teaser;
        //    } else {
        //        metaDesc = data.data.description;
        //    }
        //    let link = window.location.href;
        //    let image;
        //    if (this.imageData != null) {
        //        image = this.imageData[0];
        //    } else {
        //        image = data.data.thumbnail;
        //    }
        //
        //    this._seoService.setCanonicalLink(this.params, this._router);
        //    this._seoService.setOgTitle(data.data.title);
        //    this._seoService.setOgDesc(metaDesc);
        //    this._seoService.setOgType('Website');
        //    this._seoService.setOgUrl(link);
        //    this._seoService.setOgImage(image);
        //    this._seoService.setTitle(data.data.title);
        //    this._seoService.setMetaDescription(metaDesc);
        //    this._seoService.setMetaRobots('INDEX, NOFOLLOW');
        //}
    }

    getGeoLocation() {
        var defaultState = 'ca';
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                    this.geoLocation = geoLocationData[0].state;
                    this.geoLocation = this.geoLocation.toLowerCase();
                },
                err => {
                    this.geoLocation = defaultState;
                });
    }

    getPartnerHeader() {//Since it we are receiving
        if (this.partnerID != null) {
            this._partnerData.getPartnerData(this.partnerID)
                .subscribe(
                    partnerScript => {
                        //super long way from partner script to get location using geo location api
                        var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
                        state = state.toLowerCase();
                        this.geoLocation = state;
                    }
                );
        } else {
            this.getGeoLocation();
        }
    }

    formatDate(date) {
        return GlobalFunctions.sntGlobalDateFormatting(date, "timeZone");
    }

    ngOnDestroy() {
        this.subRec.unsubscribe();
    }
}
