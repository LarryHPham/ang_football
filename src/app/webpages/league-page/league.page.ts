import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { ProfileHeaderService} from '../../services/profile-header.service';
import { VideoService } from "../../services/video.service";
import { BoxScoresService } from "../../services/box-scores.service";
import { SchedulesService } from "../../services/schedules.service";
import { StandingsService } from "../../services/standings.service";
import { TransactionsService } from "../../services/transactions.service";
import { ArticleDataService } from "../../services/article-page-service";
import { ListPageService, positionMVPTabData } from '../../services/list-page.service';
import { ComparisonStatsService } from '../../services/comparison-stats.service';
import { ImagesService } from "../../services/carousel.service";
import { DykService } from '../../services/dyk.service';
import { FaqService } from '../../services/faq.service';
import { ListOfListsService } from "../../services/list-of-lists.service";
import { NewsService } from "../../services/news.service";
import { TwitterService } from "../../services/twitter.service";
import { SeoService } from "../../seo.service";

//interfaces
import { IProfileData, ProfileHeaderData, PlayerProfileHeaderData } from "../../fe-core/modules/profile-header/profile-header.module";
import { SportPageParameters } from "../../fe-core/interfaces/global-interface";
import { ComparisonModuleData } from '../../fe-core/modules/comparison/comparison.module';
import { StandingsModuleData } from '../../fe-core/modules/standings/standings.module';
import { TransactionModuleData } from "../../fe-core/modules/transactions/transactions.module";
import { dykModuleData } from "../../fe-core/modules/dyk/dyk.module";
import { faqModuleData } from "../../fe-core/modules/faq/faq.module";
import { HeadlineData } from "../../global/global-interface";
import { twitterModuleData } from "../../fe-core/modules/twitter/twitter.module";

// Libraries
declare var moment;

@Component({
    selector: 'League-page',
    templateUrl: './league.page.html'
})

export class LeaguePage{
    public partnerID: string;
    public scope: string;
    public paramsub: any;
    public storedPartnerParam: string;

    private headlineData:HeadlineData;
    private pageParams:SportPageParameters = {};

    private profileHeaderData:ProfileHeaderData;
    private profileData:IProfileData;
    public isProfilePage:boolean = true;
    public profileType:string = "league";
    public profileName:string = "TDL";

    private eventStatus: string;

    private firstVideo:string;
    private videoData:any;

    private boxScoresData:any;
    private currentBoxScores:any;
    private dateParam:any;

    private schedulesData:any;
    private scheduleParams:any;
    private scheduleFilter1:Array<any>;
    private scheduleFilter2:Array<any>;
    private selectedFilter1:string
    private selectedFilter2:string;
    private isFirstNum:number = 0;

    private standingsData:StandingsModuleData;

    private transactionsData: TransactionModuleData;
    private transactionsActiveTab: any;
    private transactionFilter1: Array<any>;
    private transactionModuleFooterParams: any;
    private dropdownKey1: string;

    private positionParams: any;
    private positionData: Array<positionMVPTabData>;
    private globalMVPPosition:any;
    private filter1:any;
    private isFirstRun: boolean = true;
    private listMax:number = 10;
    public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
    public collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();
    public positionNameDisplay: string;

    private comparisonModuleData: ComparisonModuleData;

    private imageData:Array<any>;
    private copyright:any;
    private imageTitle:any;

    private dykData: Array<dykModuleData>;

    private faqData: Array<faqModuleData>;

    private listOfListsData:Object; // paginated data to be displayed

    private newsDataArray: Array<Object>;

    private twitterData: Array<twitterModuleData>;

    private batchLoadIndex: number = 1;

    constructor(
      private activatedRoute: ActivatedRoute,
      private _profileService: ProfileHeaderService,
      private _videoBatchService: VideoService,
      private _boxScores: BoxScoresService,
      private _schedulesService: SchedulesService,
      private _standingsService:StandingsService,
      private _transactionsService: TransactionsService,
      private _listService: ListPageService,
      private _comparisonService: ComparisonStatsService,
      private _imagesService: ImagesService,
      private _dykService: DykService,
      private _faqService: FaqService,
      private _lolService: ListOfListsService,
      private _articleDataService:ArticleDataService,
      private _newsService: NewsService,
      private _twitterService: TwitterService,
      private _seoService: SeoService
    ) {

      var currentUnixDate = new Date().getTime();

      this.paramsub = this.activatedRoute.params.subscribe(
            (param :any)=> {
              this.pageParams = param;
              this.partnerID = param['partnerID'];
              this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';
            }
      );

      this.dateParam ={
        scope:'league',//current profile page
        teamId: this.scope == 'ncaaf' ? 'fbs' : this.scope,
        date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')// date: '2016-09-11
      }

      this.setupProfileData(this.partnerID, this.scope);
      this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
    }

    private setupProfileData(partnerID, scope) {

      this._profileService.getLeagueProfile(scope).subscribe(
        data => {

          //---Batch 1 Load---//
          this.metaTags(data);
          this.profileData = data;
          this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data.headerData);
          this.profileName = this.scope == 'fbs'? 'NCAAF':this.scope.toUpperCase(); //leagueShortName
          this.getLeagueHeadlines();

          setTimeout(() => { // defer loading everything below the fold
            //---Batch 2 Load---//
            this.getLeagueVideoBatch(7,1,1,0,GlobalSettings.getScope(scope));
            this.getBoxScores(this.dateParam);
            this.eventStatus = 'pregame';
            this.getSchedulesData(this.eventStatus);//grab pre event data for upcoming games

            //---Batch 3 Load---//
            this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams, this.profileType);
            this.transactionsActiveTab = "Transactions";
            this.transactionsData = this._transactionsService.loadAllTabsForModule(this.scope.toUpperCase(), this.transactionsActiveTab);

            //---Batch 4 Load---//
            this.globalMVPPosition = 'cb'; //Initial position to display in MVP
            this.filter1 = VerticalGlobalFunctions.getMVPdropdown(this.scope);
            this.positionData = this._listService.getMVPTabs(this.globalMVPPosition, 'module');
            if ( this.positionData && this.positionData.length > 0 ) {
              //default params
              this.positionDropdown({
                  tab: this.positionData[0],
                  position: this.globalMVPPosition
              });
            };
            this.setupComparisonData();
            this.getImages(this.imageData);

            //---Batch 5 Load---//
            this.getDykService(this.profileType);
            this.getFaqService(this.profileType);
            this.setupListOfListsModule();

            //---Batch 6 Load---//
            this.getNewsService();
            this.getTwitterService(this.profileType, partnerID, scope);

          }, 2000);
        }
      )
    } //setupProfileData



    private metaTags(data){
      //create meta description that is below 160 characters otherwise will be truncated
      let header = data.headerData;
      let title = header.leagueFullName;
      let metaDesc =  header.leagueFullName + ' loyal to ' + header.totalTeams + ' teams ' + 'and ' + header.totalPlayers + ' players.';
      let image = GlobalSettings.getImageUrl(header.leagueLogo) ? GlobalSettings.getImageUrl(header.leagueLogo) : 'http://images.synapsys.us'+header.leagueLogo;
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaRobots('Index, Follow');
      this._seoService.setOgTitle(title);
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl();
      this._seoService.setOgImage(image);
    } // metaTags



    private getLeagueVideoBatch(numItems, startNum, pageNum, first, scope, teamID?) {
      this._videoBatchService.getVideoBatchService(numItems, startNum, pageNum, first, scope)
        .subscribe(data => {
            this.firstVideo = data.data[first].videoLink;
            this.videoData = this._videoBatchService.transformVideoStack(data.data.slice(1));
        },
        err => {
            console.log("Error getting video data");
        });
    } //getLeagueVideoBatch



    private getBoxScores(dateParams?) {
        if ( dateParams != null ) {
            this.dateParam = dateParams;
        }
        this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
            this.boxScoresData = boxScoresData;
            this.currentBoxScores = currentBoxScores;
        })
    }
    //getBoxScores



    //api for League Headline Module
    private getLeagueHeadlines() {
        var scope = this.scope;
        if (scope == "ncaa") {
            scope = "ncaaf";
        }
        this._articleDataService.getAiHeadlineDataLeague(null, scope)
            .subscribe(
                HeadlineData => {
                    this.headlineData = HeadlineData;
                },
                err => {
                    console.log("Error loading AI headline data for League Page", err);
                }
            )
    }

    //grab tab to make api calls for post of pregame table
    private scheduleTab(tab) {
        this.isFirstNum = 0;
        if(tab == 'Upcoming Games'){
          this.eventStatus = 'pregame';
          this.getSchedulesData(this.eventStatus, null);
        }else if(tab == 'Previous Games'){
          this.eventStatus = 'postgame';
          this.getSchedulesData(this.eventStatus, this.selectedFilter1,this.selectedFilter2);
        }else{
          this.eventStatus = 'postgame';
          this.getSchedulesData(this.eventStatus, this.selectedFilter1,this.selectedFilter2);// fall back just in case no status event is present
        }
    } //scheduleTab
    private filterDropdown(filter){
        let filterChange = false;
        if(filter.value == 'filter1' && this.eventStatus == 'postgame' &&   this.selectedFilter1 != filter.key && this.scheduleFilter1 != null){
          this.selectedFilter1 = filter.key;
          this.selectedFilter2 = this.scheduleFilter2['data'][0].key;//reset weeks to first in dropdown
          filterChange = true;
        }
        if(filter.value == 'filter2' && this.selectedFilter2 != filter.key && this.scheduleFilter2 != null){
          this.selectedFilter2 = filter.key;
          filterChange = true;
        }
        if(this.selectedFilter2 != null && this.selectedFilter1 == null){
          this.selectedFilter1 = new Date().getFullYear().toString();
        }
        if(filterChange){
          this.getSchedulesData(this.eventStatus, this.selectedFilter1, this.selectedFilter2);
        }
    } //filterDropdown
    private getSchedulesData(status, year?, week?) {
      var limit = 5;
      if(status == 'postgame'){
        limit = 3;
      }
      if(typeof year == 'undefined'){
        year = new Date().getFullYear();
      }
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'league', status, limit, 1, this.pageParams.teamId, (schedulesData) => {
        if(status == 'pregame' || status == 'created'){
          this.scheduleFilter1 = null;
        }else{
          if(this.scheduleFilter1 == null){// only replaces if the current filter is not empty
            this.scheduleFilter1 = schedulesData.seasons;
          }
        }
        if(schedulesData.carData.length > 0){
          this.scheduleFilter2 = schedulesData.weeks;
        }else{
          this.scheduleFilter2 = null;
        }
        this.schedulesData = schedulesData;

        this.scheduleParams = {
          scope: this.scope,
          teamName: 'league',
          teamID: null,
          year: this.selectedFilter1 != null ? this.selectedFilter1 : null,
          tab : status == 'pregame' ? 'pregame' : 'postgame',
          pageNum: 1,
        }

      }, year, week) // isTeamProfilePage = true
    } //getSchedulesData



    private standingsTabSelected(tabData: Array<any>) {
      //only show 5 rows in the module
      this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5,this.dateParam.profile);
    } //standingsTabSelected
    private standingsFilterSelected(tabData: Array<any>) {
      this.scope = this.scope;
      this._standingsService.getStandingsTabData(tabData, this.pageParams, data => {
      }, 5 , this.dateParam.profile);
    } //standingsFilterSelected



    private transactionsTab(tab) {
        this.transactionsActiveTab = tab;
        this.getTransactionsData();
    } //transactionsTab
    private transactionsFilterDropdown(filter) {
      if ( this.transactionsActiveTab == null ) {
        this.transactionsActiveTab = this.transactionsData[0];
      }
      this.dropdownKey1 = filter;
      this.getTransactionsData();
    } //transactionsFilterDropdown
    private getTransactionsData() {
      this._transactionsService.getTransactionsService(this.transactionsActiveTab, this.pageParams.teamId, 'page', this.dropdownKey1)
      .subscribe(
          transactionsData => {
            //create footer call to action (CTA) link
            if ( this.transactionFilter1 == undefined ) {
              this.transactionFilter1 = transactionsData.yearArray;
              if(this.dropdownKey1 == null){
                this.dropdownKey1 = this.transactionFilter1[0].key;
              }
            }
            this.transactionModuleFooterParams = [this.storedPartnerParam, this.scope, transactionsData.tabDataKey, 'league', 20, 1];
            this.transactionsData.tabs.filter(tab => tab.tabDataKey == this.transactionsActiveTab.tabDataKey)[0] = transactionsData;
          },
          err => {
          console.log('Error: transactionsData API: ', err);
          }
      );
      // pass transaction page route params to module filter, so set module footer route
    } //getTransactionsData



    private positionDropdown(event) {
      this.positionData = this.checkToResetTabs(event);

      if(event.tab != null){

        var matches = this.checkMatchingTabs(event);

        this.globalMVPPosition = event.position;
        var date = new Date;
        var season;
        var compareDate = new Date('09 15 ' + date.getFullYear());
        if (date.getMonth() == compareDate.getMonth() && date.getDate() >= compareDate.getDate()) {
          season = date.getFullYear();
        }
        else if (date.getMonth() > compareDate.getMonth()) {
          season = date.getFullYear();
        }
        else {
          season = (date.getFullYear() - 1);
        }
        if(matches != null){
          this.positionParams = {
            scope:  this.scope, //TODO change to active scope
            target: 'player',
            position: event.position,
            statName: matches.tabDataKey,
            ordering: 'asc',
            perPageCount: this.listMax,
            pageNumber: 1,
            season: season
          }
          this.positionNameDisplay = VerticalGlobalFunctions.convertPositionAbbrvToPlural(this.positionParams.position);
          this.getMVPService(matches, this.positionParams);
        }
      }
    } //positionDropdown

    //function to check if selected position in dropdown is currently active
    private checkToResetTabs(event) {
      let localPosition = event.position;

      if ( localPosition != this.globalMVPPosition ) {
        return this._listService.getMVPTabs(event.position, 'module');
      } else {
        return this.positionData;
      } //private checkToResetTabs
    } //checkToResetTabs

    //function to check if selected position in dropdown is currently active
    private checkMatchingTabs(event) {
      let localPosition = event.position;
      let listName = event.tab.tabDataKey;
      if( event.position != this.globalMVPPosition && this.positionData != [] ){
        this.positionData[0].isLoaded = false;
        return this.positionData[0];
      } else {
        return this.positionData.filter(tab => tab.tabDataKey == listName)[0];
      }
    } //checkMatchingTabs

    getMVPService(tab, params){
      if( this.isFirstRun ) {
        this.isFirstRun = false;
        this._listService.getListModuleService(tab, params)
          .subscribe(updatedTab => {
            //do nothing?
            var matches = this.positionData.filter(list => list.tabDataKey == params.listname);
            matches[0] = updatedTab;
            this.isFirstRun = true;
          }, err => {
            tab.isLoaded = true;
            console.log('Error: Loading MVP Pitchers: ', err);
          })
      }
    } //getMVPService



    private setupComparisonData() {
      this._comparisonService.getInitialPlayerStats(this.scope, this.pageParams).subscribe(
        data => {
          this.comparisonModuleData = data;
        },
        err => {
          console.log("Error getting comparison data", err);
        });
    } //setupComparisonData



    private getImages(imageData) {
      this._imagesService.getImages(this.profileType, this.scope)
        .subscribe(data => {
          return this.imageData = data.imageArray, this.copyright = data.copyArray, this.imageTitle = data.titleArray;
        },
        err => {
          console.log("Error getting image data" + err);
        });
    } //getImages



    private getDykService(profileType) {
      this._dykService.getDykService(this.profileType, this.scope)
        .subscribe(data => {
          this.dykData = data;
        },
        err => {
          console.log("Error getting did you know data");
        });
    } //getDykService



    private getFaqService(profileType) {
      this._faqService.getFaqService(this.profileType, this.scope)
        .subscribe(data => {
            this.faqData = data;
        },
        err => {
            console.log("Error getting faq data for mlb", err);
        });
   } //getFaqService



    private setupListOfListsModule() {
      let params = {
        //  targetId : 11621,
        limit : 4,
        pageNum : 1,
        scope: this.scope
      }
      this._lolService.getListOfListsService(params, "league", "module")
        .subscribe(
          listOfListsData => {
            this.listOfListsData = listOfListsData.listData;
            // this.listOfListsData["id"] = this.pageParams.teamId;
            // this.listOfListsData["type"] = "league";
          },
          err => {
            console.log('Error: listOfListsData API: ', err);
          }
      );
    } //setupListOfListsModule



    private getNewsService() {
      let params = {
        limit : 10,
        pageNum : 1,
        id: ''
      }
      let scope = GlobalSettings.getScope(this.scope);
      this._newsService.getNewsService(scope, params, "league", "module")
        .subscribe(data => {
          this.newsDataArray = data.news;
        },
        err => {
          console.log("Error getting news data");
      });
    } //getNewsService



    private getTwitterService(profileType, partnerID, scope) {
      this.scope = scope;
      this.partnerID = partnerID;
      this.isProfilePage = true;
      this.profileType = 'league';

      this._twitterService.getTwitterService(this.profileType, this.partnerID, this.scope)
        .subscribe(data => {
          this.twitterData = data;
        },
        err => {
          console.log("Error getting twitter data");
        });
    } //getTwitterService



    // function to lazy load page sections
    private onScroll(event) {
      this.batchLoadIndex = GlobalFunctions.lazyLoadOnScroll(event, this.batchLoadIndex);
      return;
    } //onScroll

  }
