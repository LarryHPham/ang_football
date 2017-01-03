import {Component, AfterViewInit, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import { isBrowser } from 'angular2-universal';

//globals
import {GlobalFunctions} from "../../global/global-functions";
import {GlobalSettings} from "../../global/global-settings";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

//services
import {ArticleDataService} from "../../services/article-page-service";
import {DeepDiveService} from '../../services/deep-dive.service';
import {GeoLocation} from "../../global/global-service";
import {HeadlineDataService} from "../../services/headline-module-service";
import { SeoService } from '../../seo.service';

//interfaces
import {Article} from "../../global/global-interface";
import {ArticleData} from "../../global/global-interface";

//libraries
declare var jQuery:any;
declare var moment;

@Component({
    selector: 'article-pages',
    templateUrl: './article-pages.page.html'
})

export class ArticlePages implements OnInit {
    public params;
    public trendingData:any;
    public isArticle:boolean = false;
    article:Article;
    articleData:any;
    subRec:any;
    trendingArticles:any;
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
    showLoading:boolean = true;
    teamId:number;
    trendingLength:number;
    articleSubType:string;
    articleType:string;
    eventType:string;
    content:string;
    eventID:string;
    date:string;
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
                private _seoService:SeoService,
                private _deepDiveService:DeepDiveService,
                private _geoLocation:GeoLocation,
                private _headlineDataService:HeadlineDataService) {
        this.subRec = this._activateRoute.params.subscribe(
            (params:any) => {
              if(isBrowser){
                window.scrollTo(0, 0);
                this.rawUrl = window.location.href;
              }
                this.articleData = null;
                this.trendingData = null;
                this.trendingLength = 10;
                this.isTrendingMax = false;
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
                if (this.eventType == "story" || this.eventType == "video") {
                    this.isArticle = false;
                    this.eventType == "story" ? this.getDeepDiveArticle(this.eventID) : this.getDeepDiveVideo(this.eventID);
                    this.getGeoLocation();
                }
                if (this.eventType != 'story' && this.eventType != 'video') {
                    this.isArticle = true;
                    this.scope = params.scope;
                    this.type = this.eventType;
                    this.eventType = GlobalFunctions.getApiArticleType(this.eventType);
                    if (this.eventType == "articleType=player-fantasy") {
                        this.isFantasyReport = true;
                    }
                    this.getArticles();
                }
                this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
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
                            if(isBrowser){
                              this.isSmall = window.innerWidth < 640;
                              this.rawUrl = window.location.href;
                            }
                            this.pageIndex = articleType[0];
                            this.title = Article['data'][0]['article_data'].title;
                            this.date = GlobalFunctions.sntGlobalDateFormatting(Article['data'][0]['article_data'].publication_date * 1000, "timeZone");
                            this.articleData = Article['data'][0]['article_data'];
                            this.teamId = (this.eventType != "articleType=player-fantasy" || Article['data'][0].team_id != null) ?
                                Article['data'][0].team_id : Article['data'][0]['article_data']['metadata'].team_id;
                            this.metaTags(Article['data'][0]);
                            Article['data'][0]['article_data']['images'] != null ?
                                this.getCarouselImages(Article['data'][0]['article_data']['images']) : this.hasImages = false;
                            this.imageLinks = this.getImageLinks(Article['data'][0]['article_data']);
                            if (this.hasEventId) {
                                this.getRecommendedArticles();
                            }
                            this.isTrendingMax = false;
                            this.getTrendingArticles(this.eventID);
                        }
                    } catch (e) {
                        this.error = true;
                        var self = this;
                        setTimeout(function () {
                            //removes error page from browser history
                            self._location.replaceState('/');
                            //returns user to previous page
                            self._router.navigateByUrl('/home');
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
                        self._router.navigateByUrl('/home');
                    }, 5000);
                }
            );
    }

    static complexArraySetup(arrayData, type):any {
        if (type == 'empty') {
            return [{text: "empty"}]
        } else if (type == 'basic') {
            return [{text: arrayData}, {text: "<br><br>", class: "line-break"}]
        } else if (type == 'route') {
            return [arrayData.length == 3 ? {text: arrayData[2],} : '', {text: arrayData[0], route: arrayData[1]}]
        }
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
                routes = {
                    index: val.paragraph_index,
                    name: val.display,
                    route: val.route_type == "tdl_team" ? VerticalGlobalFunctions.formatTeamRoute(self.scope, val.display, val.id) : VerticalGlobalFunctions.formatPlayerRoute(self.scope, val.team_name, val.display, val.id),
                    searchParameter: "<ng2-route>" + val.display + "<\s*/?ng2-route>",
                };
                fullRoutes.push(routes);
            });
            this.routeList = fullRoutes;
        } else {
            this.routeList = [];
        }
        articleData.forEach(function (val, index) {
            if (typeof val != "object") {
                if (val == "") {
                    complexArray = ArticlePages.complexArraySetup(null, 'empty');
                    articleData[index] = newParagraph.concat(complexArray);
                } else {
                    complexArray = ArticlePages.complexArraySetup(val, 'basic');
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
                                    complexArray = ArticlePages.complexArraySetup([self.routeList[i].name, self.routeList[i].route, paragraph.split(stringSearch)[0]], 'route');
                                } else {
                                    complexArray = ArticlePages.complexArraySetup([self.routeList[i].name, self.routeList[i].route], 'route');
                                }
                                placeHolder = paragraph.split(stringSearch)[1];
                                newParagraph = newParagraph.concat(complexArray);
                                if (i == self.routeList.length - 1) {
                                    complexArray = ArticlePages.complexArraySetup(placeHolder, 'basic');
                                    articleData[index] = newParagraph.concat(complexArray);
                                    newParagraph = [];
                                    placeHolder = null;
                                }
                            } else if (i == self.routeList.length - 1) {
                                complexArray = ArticlePages.complexArraySetup(placeHolder, 'basic');
                                articleData[index] = newParagraph.concat(complexArray);
                                newParagraph = [];
                                placeHolder = null;
                            } else {
                                complexArray = ArticlePages.complexArraySetup(placeHolder, 'basic');
                            }
                            if (complexArray[0].text == null) {
                                complexArray = ArticlePages.complexArraySetup(val, 'basic');
                                articleData[index] = newParagraph.concat(complexArray);
                                newParagraph = [];
                                placeHolder = null;
                            }
                        } else {
                            if (placeHolder != null) {
                                if (placeHolder.charAt(0) != "," && placeHolder.charAt(0) != "." && placeHolder.charAt(0) != "'") {
                                    complexArray = ArticlePages.complexArraySetup(placeHolder, 'basic');
                                } else {
                                    complexArray = ArticlePages.complexArraySetup(placeHolder, 'basic');
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
            data.forEach(function (val, index) {
                if (!~val.image_url.indexOf('stock_images')) {
                    imageArray.push(VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(val['image_url']));
                    copyArray.push(val['image_copyright']);
                    titleArray.push(val['image_title']);
                } else if (~val.image_url.indexOf('stock_images') && index == 0) {
                    imageArray.push(VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(val['image_url']));
                    copyArray.push(val['image_copyright']);
                    titleArray.push(val['image_title']);
                }
            });
            this.imageData = imageArray ? imageArray : null;
            this.copyright = imageArray ? copyArray : null;
            this.imageTitle = imageArray ? titleArray : null;
            this.hasImages = true;
        } catch (err) {
            this.hasImages = false;
        }
    }

    static getProfileImages(routeArray, url, size) {
        return {
            imageClass: size,
            mainImage: {
                imageUrl: url,
                urlRouteArray: routeArray,
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "border-logo"
            }
        };
    }

    processLinks(imageData, dataType, type) {
        var isFirstTeam = true;
        var imageLinkArray = [];
        var self = this;
        imageData.forEach(function (val, index) {
            if (type == 'roster') {
                if (val[dataType]) {
                    var routeArray = VerticalGlobalFunctions.formatPlayerRoute(self.scope, val[dataType].team_name, val[dataType].name, val[dataType].id);
                    var url = GlobalSettings.getImageUrl(val[dataType]['headshot']);
                    val['image1'] = ArticlePages.getProfileImages(routeArray, url, "image-122");
                    val['image2'] = ArticlePages.getProfileImages(routeArray, url, "image-71");
                    imageLinkArray.push(val['image1'], val['image2']);
                }
            }
            if (type == 'compare' || type == 'teamRecord' || type == 'game_module') {
                let topCondition = (type == 'compare') ? index == 0 : (type == 'teamRecord') ? val[dataType] && isFirstTeam : index == 1 && val[dataType];
                let bottomCondition = (type == 'compare') ? index == 1 : (type == 'teamRecord') ? val[dataType] && !isFirstTeam : index == 4 && val[dataType];
                if (topCondition) {
                    if (type == 'compare' || type == 'teamRecord') {
                        if (type == 'compare') {
                            var routeArray = VerticalGlobalFunctions.formatPlayerRoute(self.scope, val.team_name, val.name, val.id);
                            var url = GlobalSettings.getImageUrl(val['headshot']);
                        } else if (type == 'teamRecord') {
                            var routeArray = VerticalGlobalFunctions.formatTeamRoute(self.scope, val[dataType].name, val[dataType].id);
                            var url = GlobalSettings.getImageUrl(val[dataType].logo);
                        }
                        val['image1'] = ArticlePages.getProfileImages(routeArray, url, "image-122");
                        val['image2'] = ArticlePages.getProfileImages(routeArray, url, "image-71");
                        imageLinkArray.push(val['image1'], val['image2']);
                        isFirstTeam = false;
                    } else {
                        var shortDate = val[dataType].event_date.substr(val[dataType].event_date.indexOf(",") + 1);
                        var urlTeamLeftTop = VerticalGlobalFunctions.formatTeamRoute(self.scope, val[dataType].home_team_name, val[dataType].home_team_id);
                        var urlTeamRightTop = VerticalGlobalFunctions.formatTeamRoute(self.scope, val[dataType].away_team_name, val[dataType].away_team_id);
                        var homeUrl = GlobalSettings.getImageUrl(val[dataType].home_team_logo);
                        var awayUrl = GlobalSettings.getImageUrl(val[dataType].away_team_logo);
                        val['image1'] = ArticlePages.getProfileImages(urlTeamLeftTop, homeUrl, "image-122");
                        val['image2'] = ArticlePages.getProfileImages(urlTeamRightTop, awayUrl, "image-122");
                        val['image3'] = ArticlePages.getProfileImages(urlTeamLeftTop, homeUrl, "image-71");
                        val['image4'] = ArticlePages.getProfileImages(urlTeamRightTop, awayUrl, "image-71");
                        imageLinkArray.push(val['image1'], val['image2'], val['image3'], val['image4'], shortDate);
                    }
                }
                if (bottomCondition) {
                    if (type == 'compare' || type == 'teamRecord') {
                        if (type == 'compare') {
                            var routeArray = VerticalGlobalFunctions.formatPlayerRoute(self.scope, val.team_name, val.name, val.id);
                            var url = GlobalSettings.getImageUrl(val['headshot']);
                        } else {
                            var routeArray = VerticalGlobalFunctions.formatTeamRoute(self.scope, val[dataType].name, val[dataType].id);
                            var url = GlobalSettings.getImageUrl(val[dataType].logo);
                        }
                        val['image3'] = ArticlePages.getProfileImages(routeArray, url, "image-122");
                        val['image4'] = ArticlePages.getProfileImages(routeArray, url, "image-71");
                        imageLinkArray.push(val['image3'], val['image4']);
                    } else {
                        var shortDate = val[dataType].event_date.substr(val[dataType].event_date.indexOf(",") + 1);
                        var urlTeamLeftBottom = VerticalGlobalFunctions.formatTeamRoute(self.scope, val[dataType].home_team_name, val[dataType].home_team_id);
                        var urlTeamRightBottom = VerticalGlobalFunctions.formatTeamRoute(self.scope, val[dataType].away_team_name, val[dataType].away_team_id);
                        var homeUrl = GlobalSettings.getImageUrl(val[dataType].home_team_logo);
                        var awayUrl = GlobalSettings.getImageUrl(val[dataType].away_team_logo);
                        val['image1'] = ArticlePages.getProfileImages(urlTeamLeftBottom, homeUrl, "image-122");
                        val['image2'] = ArticlePages.getProfileImages(urlTeamRightBottom, awayUrl, "image-122");
                        val['image3'] = ArticlePages.getProfileImages(urlTeamLeftBottom, homeUrl, "image-71");
                        val['image4'] = ArticlePages.getProfileImages(urlTeamRightBottom, awayUrl, "image-71");
                        imageLinkArray.push(val['image1'], val['image2'], val['image3'], val['image4'], shortDate);
                    }
                }
            }
        });
        return imageLinkArray
    }

    getImageLinks(data) {
        switch (this.articleType) {
            case "playerRoster":
                return this.processLinks(data['article'], 'player_roster_module', 'roster');
            case "playerComparison":
                return this.processLinks(data['article'][2]['player_comparison_module'], 'player_comparison_module', 'compare');
            case "teamRecord":
                return this.processLinks(data['article'], 'team_record_module', 'teamRecord');
            case "game_module":
                return this.processLinks(data['article'], 'game_module', 'game_module');
        }
    }

    private getTrendingArticles(currentArticleId) {
        var getData = this.isArticle ? this._headlineDataService.getAiTrendingData(this.trendingLength, this.scope) :
            this._deepDiveService.getDeepDiveBatchService(this.scope, this.trendingLength, 1, this.geoLocation);
        this.trendingArticles = getData.subscribe(
            data => {
                if (!this.hasRun) {
                    this.hasRun = true;
                    this.trendingData = this.isArticle ? this.transformTrending(data['data'], currentArticleId) :
                        this.transformTrending(data, currentArticleId);
                    if ((data.article_count % 10 == 0 || data.length % 10 == 0) && this.trendingData) {
                        this.trendingLength = this.trendingLength + 10;
                    } else {
                        this.isTrendingMax = true;
                        this.showLoading = false;
                    }
                }
            });
    }

    transformTrending(data, currentArticleId) {
      if(isBrowser){
        var articles = [];
        var self = this;
        data.forEach(function (val) {
          var articleData;
          if (val.event_id != currentArticleId) {
            val["date"] = self.isArticle ? GlobalFunctions.sntGlobalDateFormatting(moment.unix(Number(val.last_updated)), "timeZone") :
            GlobalFunctions.sntGlobalDateFormatting(moment.unix(Number(val.publishedDate) / 1000), "timeZone");
            articleData = {
              author: val['author'],
              publisher: val['publisher'],
              title: val.title,
              date: val["date"],
              teaser: val.teaser,
              eventId: self.isArticle ? val.event_id : val.id,
              eventType: self.isArticle ? "postgame-report" : "story",
              image: self.isArticle ? GlobalSettings.getImageUrl(val.image_url) : GlobalSettings.getImageUrl(val.imagePath),
              url: self.isArticle ? VerticalGlobalFunctions.formatArticleRoute(self.scope, val.article_type, val.event_id) :
              VerticalGlobalFunctions.formatArticleRoute(val.league, 'story', val.id),
              rawUrl: self.isArticle ?
              window.location.protocol + "//" + window.location.host + "/" + self.scope + "/articles/postgame-report/" + val.event_id :
              window.location.protocol + "//" + window.location.host + "/" + self.scope + "/articles/story/" + val.id
            };
            if (articleData != null) {
              articles.push(articleData);
            }
          }
        });
        return articles;
      }
    }

    private trendingScroll(event) {
        if (!this.isTrendingMax) {
            this.hasRun = false;
            if(isBrowser){
              if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
                this.showLoading = true;
                this.batch = this.batch + 1;
                this.getTrendingArticles(this.eventID);
              }
            }
        }
    }

    static getRandomArticles(recommendations, pageIndex, eventID, scope) {
        var articles = {
            title: recommendations.title,
            eventType: pageIndex,
            eventID: eventID,
            images: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(recommendations.image_url),
            date: GlobalFunctions.sntGlobalDateFormatting(recommendations.last_updated * 1000, "dayOfWeek"),
            articleUrl: VerticalGlobalFunctions.formatArticleRoute(scope, pageIndex, eventID),
            keyword: recommendations.keywords[0].toUpperCase()
        };
        return articles;
    }

    ngOnInit() {
      if(isBrowser){
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

    ngAfterViewInit() {
      if(isBrowser){
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
                this.getTrendingArticles(this.eventID);
            }
        )
    }

    private getDeepDiveVideo(articleID) {
        this._deepDiveService.getDeepDiveVideoService(articleID).subscribe(
            data => {
                this.articleData = data.data;
                this.date = GlobalFunctions.sntGlobalDateFormatting(this.articleData.pubDate, "timeZone");
                this.metaTags(data);
                this.iframeUrl = this.articleData.videoLink;
                this.getRecommendedArticles();
            }
        )
    }

    private metaTags(data) {
        // //create meta description that is below 160 characters otherwise will be truncated
        var metaData = this.isArticle ? data : data.data;
        let image;
        var keyword = this.isArticle ? "keywords" : "keyword";
        var teams = [];
        var players = [];
        var searchString;
        var searchArray = [];
        // let link = window.location.href;
        if (this.isArticle) {
            var headerData = data['article_data']['metadata'];
            var metaDesc = data['article_data'].meta_headline;
            if (headerData['team_name'] && headerData['team_name'].constructor === Array) {
                headerData['team_name'].forEach(function (val) {
                    searchArray.push(val);
                    teams.push(val);
                });
            }
            if (headerData['player_name'] && headerData['player_name'].constructor === Array) {
                headerData['player_name'].forEach(function (val) {
                    searchArray.push(val);
                    players.push(val);
                });
            }
        }
        if (metaData[keyword] && metaData[keyword].constructor === Array) {
            metaData[keyword].forEach(function (val) {
                searchArray.push(val);
            });
            searchString = searchArray.join(',');
        } else {
            searchString = metaData[keyword];
        }
        if (this.imageData != null) {
            image = this.imageData[0];
        } else {
            image = this.isArticle ? metaData.image_url : metaData.thumbnail;
        }
        this._seoService.setTitle(metaData.title);
        this._seoService.setMetaDescription(metaDesc);
        this._seoService.setCanonicalLink();
        this._seoService.setMetaRobots('INDEX, NOFOLLOW');
        this._seoService.setOgTitle(metaData.title);
        this._seoService.setOgDesc(metaDesc);
        this._seoService.setOgType('Website');
        this._seoService.setOgUrl();
        this._seoService.setOgImage(image);
        this._seoService.setStartDate(this.isArticle ? headerData['relevancy_start_date'].toString() : metaData.publishedDate.toString());
        this._seoService.setEndDate(this.isArticle ? headerData['relevancy_end_date'].toString() : metaData.publishedDate.toString());
        this._seoService.setIsArticle(this.isArticle.toString());
        this._seoService.setSearchType("article");
        this._seoService.setSource(this.isArticle ? metaData.source : "TCA");
        this._seoService.setArticleId(this.eventID);
        this._seoService.setArticleTitle(metaData.title);
        this._seoService.setKeyword(this.isArticle ? metaData['keywords'].toString() : metaData.keyword.toString());
        this._seoService.setPublishedDate(this.isArticle ? metaData['article_data'].publication_date.toString() : metaData.publishedDate.toString());
        this._seoService.setAuthor(metaData.author);
        this._seoService.setPublisher(metaData.publisher);
        this._seoService.setImageUrl(image);
        this._seoService.setArticleTeaser(this.isArticle ? metaData.teaser.replace(/<ng2-route>|<\/ng2-route>/g, '').toString() : metaData.teaser.toString());
        this._seoService.setArticleUrl();
        this._seoService.setArticleType(this.isArticle ? metaData.article_type.toString() : this.scope.toString());
        this._seoService.setSearchString(searchString);
    } //metaTags

    getGeoLocation() {
        var defaultState = 'ca';
        this._geoLocation.grabLocation()
            .subscribe(
                res => {
                    this.geoLocation = res.state.toLowerCase();
                    this.geoLocation = this.geoLocation.toLowerCase();
                },
                err => {
                    this.geoLocation = defaultState;
                });
    } //getGeoLocation

    ngOnDestroy() {
        if (!this.error) {
            this.subRec.unsubscribe();
            this.trendingArticles.unsubscribe();
        }
    }
}
