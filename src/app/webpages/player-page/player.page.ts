//angular core libraries
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//global functions
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";
import { isBrowser, isNode } from "angular2-universal";

//services
import { ProfileHeaderService } from '../../services/profile-header.service';
import { DailyUpdateService } from "../../services/daily-update.service";
import { ArticleDataService } from "../../services/article-page-service";
import { BoxScoresService } from '../../services/box-scores.service';
import { SchedulesService } from '../../services/schedules.service';
import { StandingsService } from '../../services/standings.service';
import { SeasonStatsService } from '../../services/season-stats.service';
import { ComparisonStatsService } from '../../services/comparison-stats.service';
import { ImagesService } from "../../services/carousel.service";
import { DykService } from '../../services/dyk.service';
import { FaqService } from '../../services/faq.service';
import { ListOfListsService } from "../../services/list-of-lists.service";
import { NewsService } from '../../services/news.service';
import { TwitterService } from '../../services/twitter.service';
import { SeoService } from "../../seo.service";

//interfaces
import { Division, Conference, SportPageParameters } from '../../global/global-interface';
import { IProfileData, ProfileHeaderData } from '../../fe-core/modules/profile-header/profile-header.module';
import { DailyUpdateData } from "../../fe-core/modules/daily-update/daily-update.module";
import { StandingsModuleData } from '../../fe-core/modules/standings/standings.module';
import { TDLStandingsTabdata } from '../../services/standings.data';
import { ComparisonModuleData } from '../../fe-core/modules/comparison/comparison.module';
import { dykModuleData } from "../../fe-core/modules/dyk/dyk.module";
import { faqModuleData } from "../../fe-core/modules/faq/faq.module";
import { twitterModuleData } from "../../fe-core/modules/twitter/twitter.module";
import { ModuleHeaderData } from "../../fe-core/components/module-header/module-header.component";

//Libraries
declare var moment;

@Component({
  selector: 'Player-page',
  templateUrl: './player.page.html',
})

export class PlayerPage{
  public currentUnixDate = new Date().getTime();
  private constructorControl:boolean = true;
  public partnerID: string;
  public storedPartnerParam: string;
  public scope: any;
  private teamName: any;
  private fullName: string;
  private playerID: number;
  private storeSubscriptions: any = [];
  public routeSubscriptions: any;
  public pageParams: SportPageParameters;
  private teamID: any;
  private dateParam: any;
  public seasonBase: string;

  public imageConfig: any;

  private profileData: IProfileData;
  private profileName: any;
  private profileHeaderData: ProfileHeaderData;
  private profileType:string = "player";
  private isProfilePage:boolean = true;

  private dailyUpdateData: any;

  private modHeadData:ModuleHeaderData;
  private footerData:any;
  private fantasyData: any;
  private isError: boolean = false;

  private boxScoresData:any;
  private currentBoxScores:any;

  private schedulesData: any;
  private scheduleFilter1: Array<any>;
  private selectedFilter1: string;
  private eventStatus: string;
  private isFirstRun: number = 0;

  private standingsData: StandingsModuleData;

  private seasonStatsData: any;

  private comparisonModuleData: ComparisonModuleData;

  private imageData: Array<any>;
  private copyright: any;
  private imageTitle: any;

  private dykData: Array<dykModuleData>;

  private faqData: Array<faqModuleData>;

  private listOfListsData: Object; // paginated data to be displayed

  private newsDataArray: Array<Object>;

  private twitterData: Array<twitterModuleData>;

  private batchLoadIndex:any;
  private hasError:any;

  constructor(
    private activateRoute: ActivatedRoute,
    private _profileService: ProfileHeaderService,
    private _dailyUpdateService: DailyUpdateService,
    private _fantasyService: ArticleDataService,
    private _boxScores: BoxScoresService,
    private _schedulesService: SchedulesService,
    private _standingsService: StandingsService,
    private _seasonStatsService: SeasonStatsService,
    private _comparisonService: ComparisonStatsService,
    private _imagesService: ImagesService,
    private _dykService: DykService,
    private _faqService: FaqService,
    private _lolService: ListOfListsService,
    private _newsService: NewsService,
    private _twitterService: TwitterService,
    private _seoService: SeoService
  ) {
    this.routeSubscriptions = this.activateRoute.params.subscribe(
      (param: any) => {
        this.resetSubscription();
        this.routeChangeResets();

        this.scope = param['scope'] != null ? param['scope'] : 'nfl';
        this.teamName = param['teamName'];
        this.fullName = param['fullName'];
        this.playerID = param['playerID'];
        this.pageParams = { playerId: this.playerID }

        this.storedPartnerParam = GlobalSettings.storedPartnerId();
        this.setupPlayerProfileData();
      }
    );

  } //constructor

  //// This function contains values that need to be manually reset when navigatiing from player page to player page
  routeChangeResets() {
    this.dateParam = null;
    this.profileHeaderData = null;
    this.boxScoresData = null;
    this.currentBoxScores = null;
    this.batchLoadIndex = 1;
    if(isBrowser){
      window.scrollTo(0, 0);
    }
  } //routeChangeResets

  ngOnDestroy(){
    this._seoService.removeApplicationJSON('page');
    this._seoService.removeApplicationJSON('json');

    if(this.routeSubscriptions){
      this.routeSubscriptions.unsubscribe();
    }
    this.resetSubscription();
  } //ngOnDestroy

  private resetSubscription(){
    if(this.storeSubscriptions){
      var numOfSubs = this.storeSubscriptions.length;

      for( var i = 0; i < numOfSubs; i++ ){
        if(this.storeSubscriptions[i]){
          this.storeSubscriptions[i].unsubscribe();
        }
      }
    }
  }

  private setupPlayerProfileData() {
    this.storeSubscriptions.push(this._profileService.getPlayerProfile(this.playerID).subscribe(
      data => {
        this.seasonBase = data.headerData['seasonBase'];
        this.metaTags(data);
        this.pageParams = data.pageParams;
        this.pageParams['partnerRoute'] = this.storedPartnerParam;
        this.pageParams['scope'] = this.scope;
        this.profileName = data.headerData.playerFullName;
        this.teamName = data.headerData.teamFullName;
        this.teamID = data.headerData.teamId;

        this.pageParams['teamID'] = this.teamID;
        this.pageParams['teamName'] = this.teamName;
        this.dateParam = {
          scope: 'player',
          teamId: this.teamID, // teamId if it exists
          date: moment.tz(this.currentUnixDate, 'America/New_York').format('YYYY-MM-DD')
        } //this.dateParam

        this.profileHeaderData = this._profileService.convertToPlayerProfileHeader(data, this.scope);
        this.dailyUpdateModule(this.playerID);

        setTimeout(() => {  // defer loading everything below the fold
          //--Batch 2--//
          if (this.scope.toLocaleLowerCase() == "nfl") {
            this.getFantasyData(this.pageParams.playerId);
          }
          this.getBoxScores(this.dateParam);
          this.eventStatus = this.eventStatus == null ? 'pregame' : this.eventStatus;
          this.getSchedulesData(this.eventStatus);//grab pregame data for upcoming games

          //--Batch 3--//
          this.standingsData = this._standingsService.loadAllTabsForModule(data.pageParams, this.scope, null, this.teamName);
          this.setupSeasonstatsData();
          this.setupComparisonData();

          //--Batch 4--//
          this.getImages(this.imageData);
          this.getDykService();
          this.getFaqService();

          //--Batch 5--//
          this.setupListOfListsModule();
          this.getNewsService();
          this.getTwitterService();
        }, 2000);
      },
      err => {
        this.hasError = true;
        console.log("Error getting player profile data for " + this.playerID + ": " + err);
      }
    ));
  } //setupPlayerProfileData

  private metaTags(data) {
    //This call will remove all meta tags from the head.
    this._seoService.removeMetaTags();
    // //create meta description that is below 160 characters otherwise will be truncated
    let header = data.headerData;
    let metaDesc =  header.description;
    let title = header.teamMarket + ' ' + header.teamName;
    let image = header.playerHeadshotUrl;
    let record = '';
    if (header.leagueRecord != null) {
      record = header.leagueRecord;
    let recordArr = record.split('-');
      record = "(" + recordArr[0] + "-" + recordArr[1] + ")";
    }
    let color = header.color != null ? header.color.split(',')[0]:'#2d3e50';
    //grab domain for json schema
    let domainSite;
    if(GlobalSettings.getHomeInfo().isPartner && !GlobalSettings.getHomeInfo().isSubdomainPartner){
      domainSite = GlobalSettings._proto + "//" + Zone.current.get('originUrl') + Zone.current.get('requestUrl');
    }else{
      domainSite = GlobalSettings._proto + "//" + Zone.current.get('originUrl') + Zone.current.get('requestUrl');
    }

    title = title  + ' ' + record;
    this._seoService.setTitle(title);
    this._seoService.setMetaDescription(metaDesc);
    this._seoService.setCanonicalLink();
    this._seoService.setMetaRobots('Index, Follow');
    this._seoService.setOgTitle(title);
    this._seoService.setOgDesc(metaDesc);
    this._seoService.setOgType('Website');
    this._seoService.setOgUrl();
    this._seoService.setOgImage(image);

    //manually generate team schema for team page until global funcation can be created
    let teamSchema = `
    {
      "@context": "http://schema.org",
      "@type": "SportsTeam",
      "name": "`+header.teamMarket + ' ' + header.teamName+`",
    }`;

    //manually generate json schema for BreadcrumbList
    let jsonSchema = `
    {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@id": "`+domainSite+"/"+this.scope.toLowerCase()+"/pick-a-team"+`",
        "name": "`+this.scope.toUpperCase()+`"
      }
    },{
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@id": "`+domainSite+"?league="+header.divisionName+`",
        "name": "`+header.divisionName+`"
      }
    },{
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@id": "`+domainSite+`",
        "name": "`+header.teamMarket + ' ' + header.teamName+`"
        }
      }]
    }`;
    this._seoService.setApplicationJSON(teamSchema, 'page');
    this._seoService.setApplicationJSON(jsonSchema, 'json');
  } //metaTags

  private dailyUpdateModule(playerId: number) {
    this.imageConfig = this._dailyUpdateService.getImageConfig();
    this.storeSubscriptions.push(this._dailyUpdateService.getPlayerDailyUpdate(playerId)
      .finally(() => GlobalFunctions.setPreboot() ) // call preboot after last piece of data is returned on page (of first batch)
      .subscribe(data => {
        this.dailyUpdateData = data;
      },
      err => {
        this.dailyUpdateData = this._dailyUpdateService.getErrorData();
        console.log("Error getting daily update data", err);
      }));
  } //dailyUpdateModule



  private getFantasyData(playerId) {
    try {
      this.storeSubscriptions.push(this._fantasyService.getFantasyReport(playerId)
        .subscribe(data => {
          if (data != null) {
            if (playerId == data.playerId) {
              this.fantasyData = data;
              this.modHeadData = {
                moduleTitle: "Fantasy Report - " + this.profileHeaderData.profileName,
                hasIcon: false,
                iconClass: '',
              };
              this.footerData = {
                infoDesc: 'Want to see more of the Fantasy Report?',
                text: 'VIEW FANTASY REPORT',
                url: data.articleUrl,
                smalltext: 'READ MORE'
              };
            }
          }
          else {
            this.isError = true;
          }
        }));
    } catch (e) {
      this.isError = true;
    }
  } //getFantasyData



  private getBoxScores(dateParams?) {
    if (dateParams != null) {
      this.dateParam = dateParams;
    }
    this.storeSubscriptions.push(this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
      this.boxScoresData = boxScoresData;
      this.currentBoxScores = currentBoxScores;
    }))
  } //getBoxScores



  private scheduleTab(tab) {
    this.isFirstRun = 0;
    if (tab == 'Upcoming Games') {
      this.eventStatus = 'pregame';
      this.getSchedulesData(this.eventStatus, null);
    } else if (tab == 'Previous Games') {
      this.eventStatus = 'postgame';
      this.getSchedulesData(this.eventStatus, this.selectedFilter1);
    } else {
      this.eventStatus = 'postgame';
      this.getSchedulesData(this.eventStatus, this.selectedFilter1);// fall back just in case no status event is present
    }
  } //scheduleTab
  private filterDropdown(filter) {
    let tabCheck = 0;
    if (this.eventStatus == 'postgame') {
      tabCheck = -1;
    }
    if (this.isFirstRun > tabCheck) {
      if(filter.key != this.selectedFilter1){
        this.selectedFilter1 = filter.key;
        this.getSchedulesData(this.eventStatus, this.selectedFilter1);
      }
    }
    this.isFirstRun++;
  } //filterDropdown
  private getSchedulesData(status, year?) {
    var limit = 5;
    this.storeSubscriptions.push(this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'player', status, limit, 1, this.teamID, (schedulesData) => {
      if (status == 'pregame') {
        this.scheduleFilter1 = null;
      } else {
        this.scheduleFilter1 = schedulesData.seasons;
      }
      this.schedulesData = schedulesData;
    }, year)) //year if null will return current year and if no data is returned then subract 1 year and try again
  } //getSchedulesData



  private standingsTabSelected(tabData: Array<any>) {
    //only show 5 rows in the module;
    this.pageParams.scope = this.scope;
    this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {
    }, 5);
  } //standingsTabSelected
  private standingsFilterSelected(tabData: Array<any>) {
    this.pageParams.scope = this.scope;
    this._standingsService.getStandingsTabData(tabData, this.pageParams, data => {
    }, 5);
  } //standingsFilterSelected



  private setupSeasonstatsData() {
    this.storeSubscriptions.push(this._seasonStatsService.getPlayerStats(Number(this.pageParams.playerId), this.scope, this.seasonBase)
      .subscribe(
        data => {
          this.seasonStatsData = data;
        },
        err => {
          console.log("Error getting season stats data for " + this.pageParams.playerId, err);
        }));
  } //setupSeasonstatsData



  private setupComparisonData() {
    this.storeSubscriptions.push(this._comparisonService.getInitialPlayerStats(this.scope, this.pageParams).subscribe(
      data => {
        this.comparisonModuleData = data;
      },
      err => {
        console.log("Error getting comparison data for " + this.pageParams.playerId, err);
      }));
  } //setupComparisonData



  private getImages(imageData) {
    this.storeSubscriptions.push(this._imagesService.getImages(this.profileType, this.pageParams.playerId)
      .subscribe(data => {
        if (data.imageArray.length <= 0) {
          return this.imageData = null;
        } else {
          return this.imageData = data.imageArray, this.copyright = data.copyArray, this.imageTitle = data.titleArray;
        }
      },
      err => {
        console.log("Error getting image data" + err);
      }));
  } //getImages



  private getDykService() {
    this.storeSubscriptions.push(this._dykService.getDykService(this.profileType, this.pageParams.playerId)
      .subscribe(data => {
        this.dykData = data;
      },
      err => {
        console.log("Error getting did you know data");
      }));
  } //getDykService



  private getFaqService() {
    this.storeSubscriptions.push(this._faqService.getFaqService(this.profileType, this.pageParams.playerId)
      .subscribe(data => {
        this.faqData = data;
      },
      err => {
        console.log("Error getting faq data for player", err);
      }));
  } //getFaqService



  private setupListOfListsModule() {
    let params = {
      targetId: this.pageParams.playerId,
      limit: 5,
      pageNum: 1,
      scope: this.scope
    }
    this.storeSubscriptions.push(this._lolService.getListOfListsService(params, "player", "module")
      .subscribe(
        listOfListsData => {
          if (listOfListsData != null) {
            this.listOfListsData = listOfListsData.listData;
          }
          // this.listOfListsData["type"] = "player";
          // this.listOfListsData["id"] = this.pageParams.playerId;
        },
        err => {
          console.log('Error: listOfListsData API: ', err);
        }
      ));
    } //setupListOfListsModule



    private getNewsService() {
      let params = {
        limit: 10,
        pageNum: 1,
        id: this.pageParams.teamId
      }
      this.storeSubscriptions.push(this._newsService.getNewsService(this.scope, params, 'player', 'module')
        .subscribe(data => {
          this.newsDataArray = data.news;
        },
        err => {
          console.log("Error getting news data");
        }));
    } //getNewsService



    private getTwitterService() {
      this.storeSubscriptions.push(this._twitterService.getTwitterService("team", this.pageParams.teamId) //getting team twitter information for now
        .subscribe(data => {
          this.twitterData = data;
        },
        err => {
          console.log("Error getting twitter data");
        }));
    } //getTwitterService

  // function to lazy load page sections
  private onScroll(event) {
    this.batchLoadIndex = GlobalFunctions.lazyLoadOnScroll(event, this.batchLoadIndex);
    return;
  }
}
