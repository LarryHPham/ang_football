import {Component, AfterViewInit, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {isBrowser} from 'angular2-universal';

//globals
import {GlobalFunctions} from "../../global/global-functions";
import {GlobalSettings} from "../../global/global-settings";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

//services
import {ArticleDataService} from "../../services/article-page-service";
import {DeepDiveService} from '../../services/deep-dive.service';
import {GeoLocation} from "../../global/global-service";
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
  copyright:Array<any>;
  imageData:Array<any>;
  imageTitle:Array<any>;
  randomArticles:Array<any>;
  randomHeadlines:Array<any>;
  aiSidekick:boolean = true;
  checkPartner:boolean;
  error:boolean = false;
  hasRun:boolean = false;
  isFantasyReport:boolean = false;
  isTrendingMax:boolean = false;
  showLoading:boolean = true;
  trendingLength:number;
  eventType:string;
  eventID:string;
  date:string;
  partnerId:string;
  rawUrl:string;
  title:string;
  type:string;
  scope:string = null;
  partnerID:string;
  geoLocation:string;
  iframeUrl:any;
  batch:number = 1;

  constructor(private _activateRoute:ActivatedRoute,
              private _router:Router,
              private _articleDataService:ArticleDataService,
              private _location:Location,
              private _seoService:SeoService,
              private _deepDiveService:DeepDiveService,
              private _geoLocation:GeoLocation) {
    this.subRec = this._activateRoute.params.subscribe(
      (params:any) => {
        this.articleData = null;
        this.trendingData = null;
        this.trendingLength = 10;
        this.isTrendingMax = false;
        this.isFantasyReport = false;
        this.scope = params.scope == "nfl" ? "nfl" : "ncaa";
        if (params.partnerID != null) {
          this.partnerId = params.partnerID;
        }
        this.eventID = params['eventID'];
        this.eventType = params['eventType'];

        if (this.eventType == "story" || this.eventType == "video") {
          this.isArticle = false;
          this.eventType == "story" ? this.getDeepDiveArticle(this.eventID) : this.getDeepDiveVideo(this.eventID);
          this.getGeoLocation();
        }
        if (this.eventType != 'story' && this.eventType != 'video') {
          this.isArticle = true;
          this.scope = params.scope;
          this.type = this.eventType;
          this.eventType = this._articleDataService.getApiArticleType(this.eventType);
          if (this.eventType == "articleType=player-fantasy") {
            this.isFantasyReport = true;
          }
          this.getArticles();
        }
        this.checkPartner = GlobalSettings.getHomeInfo().isPartner;

        if (isBrowser) {
          window.scrollTo(0, 0);
          this.rawUrl = window.location.href;
        }
      }
    );
  }

  getArticles() {
    this._articleDataService.getArticle(this.eventID, this.eventType, this.partnerId, this.scope, this.isFantasyReport, this.type)
      .finally(() => GlobalSettings.setPreboot()) // call preboot after last piece of data is returned on page
      .subscribe(Article => {
          try {
            this.articleData = Article;
            this.date = Article.date;
            if (this.articleData.hasEventId) {
              this.getRecommendedArticles(this.articleData.eventID);
            }
            this.isTrendingMax = false;
            this.getTrendingArticles(this.eventID);
            this.metaTags(this.articleData);
          } catch (e) {
            console.log('Error getArticles Function', e);
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

  getRecommendedArticles(eventId) {
    if (this.eventType != "story" && this.eventType != "video") {
      this.randomArticles = this._articleDataService.getRandomArticles(this.randomArticles, this.scope, this.eventType);
      this._articleDataService.getRecommendationsData(eventId, this.scope)
        .subscribe(data => {
          this.randomHeadlines = data;
        });
    } else {
      var startNum = Math.floor((Math.random() * 8) + 1);
      //needed to uppercase for ai to grab data correctly
      this._deepDiveService.getRecArticleData(this.scope, this.geoLocation, startNum, 3)
        .subscribe(data => {
        });
    }
  }

  private getTrendingArticles(currentArticleId) {
    var getData = this.isArticle ? this._articleDataService.getAiTrendingData(this.trendingLength, this.scope) :
      this._deepDiveService.getDeepDiveBatchService(this.scope, this.trendingLength, 1, this.geoLocation);
    this.trendingArticles = getData.subscribe(
      data => {
        if (!this.hasRun) {
          this.hasRun = true;
          this.trendingData = this.isArticle ? this._articleDataService.transformTrending(data['data'], currentArticleId, this.scope, true) :
            this._articleDataService.transformTrending(data, currentArticleId, this.scope, false);
          if ((data.article_count % 10 == 0 || data.length % 10 == 0) && this.trendingData) {
            this.trendingLength = this.trendingLength + 10;
          } else {
            this.isTrendingMax = true;
            this.showLoading = false;
          }
        }
      });
  }

  private trendingScroll(event) {
    if (!this.isTrendingMax && isBrowser) {
      this.hasRun = false;
      if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
        this.showLoading = true;
        this.batch = this.batch + 1;
        this.getTrendingArticles(this.eventID);
      }
    }
  }

  ngOnInit() {
    if (isBrowser) {
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
    if (isBrowser) {
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
        this.getRecommendedArticles(articleID);
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
        this.getRecommendedArticles(articleID);
      }
    )
  }

  private metaTags(data) {
    //This call will remove all meta tags from the head.
    this._seoService.removeMetaTags();
    //create meta description that is below 160 characters otherwise will be truncated
    var metaData = this.isArticle ? data : data.data;
    let image, metaDesc;
    var teams = [];
    var players = [];
    var searchString;
    var searchArray = [];
    if (this.isArticle) {
      var headerData = data['articleContent']['metadata'];
      metaDesc = data['articleContent'].meta_headline;
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
      if (data['articleContent']['keyword'] && data['articleContent']['keyword'].constructor === Array) {
        data['articleContent']['keyword'].forEach(function (val) {
          searchArray.push(val);
        });
        searchString = searchArray.join(',');
      } else {
        searchArray.push(data['articleContent']['keyword']);
        searchString = searchArray.join(',');
      }
      image = metaData['images']['imageData'][0];
    } else {
      metaDesc = data.title;
      image = GlobalSettings.getImageUrl(metaData.imagePath);
    }
    this._seoService.setCanonicalLink();
    this._seoService.setOgTitle(metaData.title);
    this._seoService.setOgDesc(metaDesc);
    this._seoService.setOgType('Website');
    this._seoService.setOgUrl();
    this._seoService.setOgImage(image);
    this._seoService.setStartDate(this.isArticle ? headerData['relevancy_start_date'] : metaData.publishedDate);
    this._seoService.setEndDate(this.isArticle ? headerData['relevancy_end_date'] : metaData.publishedDate);
    this._seoService.setIsArticle(this.isArticle.toString());
    this._seoService.setSearchType("article");
    this._seoService.setSource(this.isArticle ? "snt_ai" : "TCA");
    this._seoService.setArticleId(this.eventID);
    this._seoService.setArticleTitle(metaData.title);
    this._seoService.setKeyword(this.isArticle ? metaData['articleContent']['keyword'] : metaData.keyword);
    this._seoService.setPublishedDate(this.isArticle ? metaData['articleContent'].publication_date : metaData.publishedDate);
    this._seoService.setAuthor(this.isArticle ? data['articleContent'].author : metaData.author);
    this._seoService.setPublisher(this.isArticle ? data['articleContent'].publisher : metaData.publisher);
    this._seoService.setImageUrl(image);
    this._seoService.setArticleTeaser(this.isArticle ? metaData.teaser.replace(/<ng2-route>|<\/ng2-route>/g, '') : metaData.teaser);
    this._seoService.setArticleUrl();
    this._seoService.setArticleType(this.isArticle ? metaData.articleType : this.scope);
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
