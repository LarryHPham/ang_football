import {Component, AfterViewInit, OnInit} from '@angular/core';
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
import {SanitizeRUrl, SanitizeHtml} from "../../fe-core/pipes/safe.pipe";

import {DeepDiveService} from '../../services/deep-dive.service';
import {GeoLocation} from "../../global/global-service";
import {PartnerHeader} from "../../global/global-service";

declare var jQuery:any;
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
        WidgetModule
    ],
    providers: [DeepDiveService, GeoLocation, PartnerHeader],
    pipes: [SanitizeRUrl, SanitizeHtml]
})

export class ArticlePages implements OnInit {
    article:Article;
    articleData:any;
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
    checkPartner:boolean;
    error:boolean = false;
    hasEventId:boolean = true;
    hasImages:boolean = false;
    isFantasyReport:boolean = false;
    isSmall:boolean = false;
    teamId:number;
    eventType:string;
    articleSubType:string;
    content:string;
    eventID:string;
    date:string;
    pageIndex:string;
    partnerId:string;
    rawUrl:string;
    title:string;
    scope:string = null;
    constructorControl: boolean = true;
    partnerID: string;
    geoLocation:string;
    iframeUrl: any;
    constructor(private _params:RouteParams,
                private _router:Router,
                private _articleDataService:ArticleDataService,
                private _location:Location,
                private _seoService:SeoService,
                private _deepDiveService:DeepDiveService,
                private _geoLocation:GeoLocation,
                private _partnerData: PartnerHeader) {
        //check to see if scope is correct and redirect
        VerticalGlobalFunctions.scopeRedirect(_router, _params);
        window.scrollTo(0, 0);
        GlobalSettings.getParentParams(_router, parentParams => {
          if(this.constructorControl){
            this.scope = parentParams.scope == "nfl" ? "nfl" : "ncaa";
            if (parentParams.partnerID != null) {
              this.partnerId = parentParams.partnerID;
            }
            this.eventID = _params.get('eventID');
            this.eventType = _params.get('eventType');
            if (this.eventType == "story") {
              this.getDeepDiveArticle(this.eventID);
            }
            if (this.eventType == "video") {
              this.getDeepDiveVideo(this.eventID);
            }
            if(this.eventType != 'story' && this.eventType != 'video'){
              this.getArticles();
            }
            if (this.eventType == "upcoming-game") {
              this.eventType = "upcoming";
            }
            this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
            if (this.eventType == "player-fantasy") {
              this.isFantasyReport = true;
            }
            this.rawUrl = window.location.href;
            this.constructorControl = false;
          }
        });
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
                        var eventType = [];
                        if (Article['data'][0].article_type_id != null) {
                            eventType = GlobalFunctions.getArticleType(Article['data'][0].article_type_id, true);
                        } else {
                            eventType = GlobalFunctions.getArticleType(Article['data'][0].article_subtype_id, false);
                        }
                        this.eventType = eventType[1];
                        this.articleSubType = eventType[2];
                        this.isSmall = window.innerWidth < 640;
                        this.pageIndex = eventType[0];
                        this.title = Article['data'][0]['article_data'][this.pageIndex].displayHeadline;
                        this.date = GlobalFunctions.sntGlobalDateFormatting(Article['data'][0]['article_data'][this.pageIndex].dateline,"timeZone");
                        this.articleData = Article['data'][0]['article_data'][this.pageIndex];
                        this.teamId = Article['data'][0]['article_data'][this.pageIndex].teamId;
                        if (this.teamId == null) {
                            this.teamId = Article['data'][0]['article_data'][this.pageIndex]['metadata'].homeTeamId;
                        }
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
              });
    }

    getCarouselImages(data) {
        var images = [];
        var imageArray = [];
        var copyArray = [];
        var titleArray = [];

        if (this.eventType == "game-module" || this.eventType == "team-record") {
            images = data['home_images'].concat(data['away_images']);
        } else if (this.eventType == "playerRoster") {
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
        if (this.eventType == "playerRoster") {
            data['article'].forEach(function (val) {
                if (val['playerRosterModule']) {
                    let playerUrl = VerticalGlobalFunctions.formatPlayerRoute(val['playerRosterModule'].teamName, val['playerRosterModule'].name, val['playerRosterModule'].id);
                    val['player'] = {
                        imageClass: "image-122",
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
        if (this.eventType == 'playerComparison') {
            data['article'][2]['playerComparisonModule'].forEach(function (val, index) {
                if (index == 0) {
                    let urlPlayerLeft = VerticalGlobalFunctions.formatPlayerRoute(val.teamName, val.name, val.id);
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
                    let urlPlayerRight = VerticalGlobalFunctions.formatPlayerRoute(val.teamName, val.name, val.id);
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
        if (this.eventType == 'gameModule') {
            data['article'].forEach(function (val, index) {
                if (index == 1 && val['gameModule']) {
                    var shortDate = val['gameModule'].eventDate;
                    shortDate = shortDate.substr(shortDate.indexOf(",") + 1);
                    let urlTeamLeftTop = VerticalGlobalFunctions.formatTeamRoute(val['gameModule'].homeTeamName, val['gameModule'].homeTeamId);
                    let urlTeamRightTop = VerticalGlobalFunctions.formatTeamRoute(val['gameModule'].awayTeamName, val['gameModule'].awayTeamId);
                    val['teamLeft'] = {
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].homeTeamLogo),
                            urlRouteArray: urlTeamLeftTop,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-122",
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
                        imageClass: "image-122",
                        mainImage: {
                            imageUrl: GlobalSettings.getImageUrl(val['gameModule'].homeTeamLogo),
                            urlRouteArray: urlTeamLeftBottom,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-122",
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
        if (this.eventType == 'teamRecord') {
            var isFirstTeam = true;
            data['article'].forEach(function (val) {
                if (val['teamRecordModule'] && isFirstTeam) {
                    let urlFirstTeam = VerticalGlobalFunctions.formatTeamRoute(val['teamRecordModule'].name, val['teamRecordModule'].id);
                    val['imageTop'] = {
                        imageClass: "image-122",
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
                        imageClass: "image-122",
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
    ngAfterViewInit(){
      // to run the resize event on load
      try {
        window.dispatchEvent(new Event('load'));
      }catch(e){
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
            this.imageData  = ["/app/public/stockphoto_bb_1.jpg", "/app/public/stockphoto_bb_2.jpg"];
            this.copyright = ["USA Today Sports Images", "USA Today Sports Images"];
            this.imageTitle = ["", ""];
          } else {
            this.imageData = [GlobalSettings.getImageUrl(data.data.imagePath)];
            this.copyright = ["USA Today Sports Images"];
            this.imageTitle = [""];
          }
          this.metaTags(data);
          this.articleData = data.data;
          this.date = GlobalFunctions.sntGlobalDateFormatting(moment.unix(this.articleData.publishedDate/1000),"timeZone");
        }
      )
    }
    private getDeepDiveVideo(articleID){
      this._deepDiveService.getDeepDiveVideoService(articleID).subscribe(
        data => {
          this.articleData = data.data;
          this.date = this.formatDate(this.articleData.pubDate);
          this.metaTags(data);
            this.iframeUrl = this.articleData.videoLink;
        }
      )
    }

    private metaTags(data){
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc;
      if(data.data.teaser != null){
        metaDesc = data.data.teaser;
      }else{
        metaDesc = data.data.description;
      }

      let link = window.location.href;
      let image;
      if(this.imageData != null){
        image = this.imageData[0];
      }else{
        image = data.data.thumbnail;
      }

      this._seoService.setCanonicalLink(this._params.params, this._router);
      this._seoService.setOgTitle(data.data.title);
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl(link);
      this._seoService.setOgImage(image);
      this._seoService.setTitle(data.data.title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setMetaRobots('INDEX, NOFOLLOW');
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

    getPartnerHeader(){//Since it we are receiving
      if(this.partnerID!= null){
        this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            //super long way from partner script to get location using geo location api
            var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
            state = state.toLowerCase();
            this.geoLocation = state;
          }
        );
      }else{
        this.getGeoLocation();
      }
    }
    formatDate(date) {
        return GlobalFunctions.sntGlobalDateFormatting(date,"timeZone");
    }
    ngOnDestroy(){
        // this.subRec.unsubscribe();
    }

}
