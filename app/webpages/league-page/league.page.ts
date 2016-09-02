import {Component, OnInit} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {LoadingComponent} from '../../fe-core/components/loading/loading.component';
import {ErrorComponent} from '../../fe-core/components/error/error.component';

import {TwitterModule, twitterModuleData} from "../../fe-core/modules/twitter/twitter.module";
import {TwitterService} from '../../services/twitter.service';

import {ComparisonModule, ComparisonModuleData} from '../../fe-core/modules/comparison/comparison.module';
import {ComparisonStatsService} from '../../services/comparison-stats.service';

import {CommentModule} from '../../fe-core/modules/comment/comment.module';

import {DYKModule, dykModuleData} from "../../fe-core/modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../fe-core/modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {BoxScoresModule} from '../../fe-core/modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {StandingsModule, StandingsModuleData} from '../../fe-core/modules/standings/standings.module';
import {TDLStandingsTabdata} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {SchedulesModule} from '../../fe-core/modules/schedules/schedules.module';
import {SchedulesService} from '../../services/schedules.service';

import {MVPModule} from '../../fe-core/modules/mvp/mvp.module';
import {ListPageService, positionMVPTabData} from '../../services/list-page.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../fe-core/modules/profile-header/profile-header.module';
import {IProfileData, ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, SportPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';

import {HeadlineComponent} from '../../fe-core/components/headline/headline.component';

import {DraftHistoryModule} from '../../fe-core/modules/draft-history/draft-history.module';

import {NewsModule} from '../../fe-core/modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {TransactionsModule, TransactionModuleData} from "../../fe-core/modules/transactions/transactions.module";
import {TransactionsService} from "../../services/transactions.service";

import {ListOfListsModule} from "../../fe-core/modules/list-of-lists/list-of-lists.module";
import {ListOfListsService} from "../../services/list-of-lists.service";

import {GlobalSettings} from "../../global/global-settings";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";

import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
import {VideoModule} from "../../fe-core/modules/video/video.module";
import {VideoService} from "../../services/video.service";

declare var moment;

@Component({
    selector: 'League-page',
    templateUrl: './app/webpages/league-page/league.page.html',
    directives: [
        VideoModule,
        SidekickWrapper,
        LoadingComponent,
        ErrorComponent,
        MVPModule,
        SchedulesModule,
        BoxScoresModule,
        HeadlineComponent,
        ProfileHeaderModule,
        StandingsModule,
        CommentModule,
        DYKModule,
        DraftHistoryModule,
        FAQModule,
        TwitterModule,
        ComparisonModule,
        TransactionsModule,
        NewsModule,
        ListOfListsModule,
        ImagesMedia,
        ResponsiveWidget
      ],
    providers: [
        VideoService,
        BoxScoresService,
        SchedulesService,
        ListPageService,
        StandingsService,
        ProfileHeaderService,
        ImagesService,
        NewsService,
        FaqService,
        DykService,
        ComparisonStatsService,
        TwitterService,
        TransactionsService,
        ListOfListsService,
        Title
      ]
})

export class LeaguePage implements OnInit {
    public widgetPlace: string = "widgetForModule";

    pageParams:SportPageParameters = {};
    partnerID:string = null;
    hasError: boolean = false;

    standingsData:StandingsModuleData;

    profileHeaderData:ProfileHeaderData;

    profileData:IProfileData;

    comparisonModuleData: ComparisonModuleData;

    transactionsData:TransactionModuleData;

    boxScoresData:any;
    currentBoxScores:any;
    dateParam:any;

    firstVideo:string;
    videoData:any;

    positionParams: any;
    positionData: Array<positionMVPTabData>;
    globalMVPPosition:any;

    imageData:Array<any>;
    copyright:any;
    imageTitle:any;
    isProfilePage:boolean = true;
    profileType:string = "league";
    profileName:string = "TDL";
    listMax:number = 10;
    listOfListsData:Object; // paginated data to be displayed
    newsDataArray: Array<Object>;
    faqData: Array<faqModuleData>;
    dykData: Array<dykModuleData>;
    twitterData: Array<twitterModuleData>;

    schedulesData:any;
    scheduleFilter1:Array<any>;
    scheduleFilter2:Array<any>;
    selectedFilter1:string
    selectedFilter2:string;
    eventStatus: string;

    public scope: string;
    public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv().toLowerCase();
    public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();


    constructor(private _router:Router,
                private _title: Title,
                private _standingsService:StandingsService,
                private _boxScores:BoxScoresService,
                private _profileService:ProfileHeaderService,
                private _schedulesService:SchedulesService,
                private _imagesService:ImagesService,
                private _newsService: NewsService,
                private _faqService: FaqService,
                private _dykService: DykService,
                private _twitterService: TwitterService,
                private _comparisonService: ComparisonStatsService,
                private _transactionsService: TransactionsService,
                private _lolService: ListOfListsService,
                private listService:ListPageService,
                private videoBatchService:VideoService,
                private _params: RouteParams) {
        _title.setTitle(GlobalSettings.getPageTitle("TDL"));

        GlobalSettings.getParentParams(this._router, parentParams => {
            this.partnerID = parentParams.partnerID;
            this.scope = parentParams.scope;

            //for boxscores
            var currentUnixDate = new Date().getTime();
            //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
            this.dateParam ={
              profile:'league',//current profile page
              teamId: this.scope,
              // date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
              date: '2016-09-11'
            }
            this.setupProfileData(this.partnerID, this.scope);
        });
    }

    ngOnInit() {}

    private setupProfileData(partnerID, scope) {

        this._profileService.getLeagueProfile(scope).subscribe(
            data => {

            ///*** About TDL ***/
                this.profileData = data;
                this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data.headerData);
                this.profileName = "TDL"; //leagueShortName

                /*** Keep Up With Everything TDL ***/
                // this.getBoxScores(this.dateParam);
                this.eventStatus = 'pregame';
                this.getSchedulesData(this.eventStatus);//grab pre event data for upcoming games
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);

                this.transactionsData = this._transactionsService.loadAllTabsForModule(data.profileName);

                //Initial position to display in MVP
                this.globalMVPPosition = 'cb';
                this.positionData = this.listService.getMVPTabs(this.globalMVPPosition, 'module');
                if ( this.positionData && this.positionData.length > 0 ) {
                  //default params
                  this.positionDropdown({
                      tab: this.positionData[0],
                      position: this.globalMVPPosition
                  });
                }

                this.setupComparisonData();

                /*** Keep Up With Everything TDL ***/
                this.getImages(this.imageData);
                this.getNewsService();
                this.getFaqService(this.profileType);
                this.setupListOfListsModule();
                this.getDykService(this.profileType);
                this.getLeagueVideoBatch(7,1,1,0,scope);
                this.getTwitterService(this.profileType, partnerID, scope);
             },
            err => {
                this.hasError = true;
                console.log("Error getting team profile data for mlb", err);
            }

        );
    }
    //grab tab to make api calls for post of pregame table
    private scheduleTab(tab) {
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
    }
    private filterDropdown(filter){
      if(filter.value == 'filter1'){
        this.selectedFilter1 = filter.key;
      }
      if(filter.value == 'filter2'){
        this.selectedFilter2 = filter.key;
      }
      this.getSchedulesData(this.eventStatus, this.selectedFilter1, this.selectedFilter2);
    }

    //api for Schedules
    private getSchedulesData(status, year?, week?){
      var limit = 5;
      if(status == 'postgame'){
        limit = 3;
      }
      if(typeof year == 'undefined'){
        year == new Date().getFullYear();
      }
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'league', status, limit, 1, this.pageParams.teamId, (schedulesData) => {
        if(status == 'pregame'){
          this.scheduleFilter1=null;
        }else{
          if(this.scheduleFilter1 == null){// only replaces if the current filter is not empty
            this.scheduleFilter1 = schedulesData.seasons;
          }
        }
        if(this.scheduleFilter2 == null){
          this.scheduleFilter2 = schedulesData.weeks;
        }
        this.schedulesData = schedulesData;
      }, year, week) // isTeamProfilePage = true
    }




    private getLeagueVideoBatch(numItems, startNum, pageNum, first, scope, teamID?){

        this.videoBatchService.getVideoBatchService(numItems, startNum, pageNum, first, scope)
            .subscribe(data => {

                    this.firstVideo = data.data[first].videoLink;
                    this.videoData = data.data.slice(1);

                },
                err => {

                    console.log("Error getting video data");
                }

            );

    }

    private transactionsTab(tab) {
        this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'module')
        .subscribe(
            transactionsData => {
                //do nothing
            },
            err => {
            console.log('Error: transactionsData API: ', err);
            }
        );
    }

    private getTwitterService(profileType, partnerID, scope) {
        this.scope = scope;
        this.partnerID = partnerID;
        this.isProfilePage = true;
        this.profileType = 'league';
        this.profileName = "NFL";

        this._twitterService.getTwitterService(this.profileType, this.partnerID, this.scope)
            .subscribe(data => {
                this.twitterData = data;
            },
            err => {
                console.log("Error getting twitter data");
            });
    }

    private getDykService(profileType) {
      this._dykService.getDykService(this.profileType, this.scope)
          .subscribe(data => {
                this.dykData = data;
            },
            err => {
                console.log("Error getting did you know data");
            });
  }

    private getFaqService(profileType) {
      this._faqService.getFaqService(this.profileType, this.scope)
        .subscribe(data => {
            this.faqData = data;
        },
        err => {
            console.log("Error getting faq data for mlb", err);
        });
   }

    private setupListOfListsModule() {
        let params = {
          limit : 4,
          pageNum : 1
        }
        this._lolService.getListOfListsService(params, "league", "module")
            .subscribe(
                listOfListsData => {
                    this.listOfListsData = listOfListsData.listData;
                    this.listOfListsData["type"] = "league";
                },
                err => {
                    console.log('Error: listOfListsData API: ', err);
                }
            );
    }

    private getNewsService() {
        this._newsService.getNewsService('Major League Baseball')
            .subscribe(data => {
                this.newsDataArray = data.news;
            },
            err => {
                console.log("Error getting news data");
            });
    }

    //api for BOX SCORES
    private getBoxScores(dateParams?) {
        if ( dateParams != null ) {
            this.dateParam = dateParams;
        }
        this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
            this.boxScoresData = boxScoresData;
            this.currentBoxScores = currentBoxScores;
        })
    }

    private getImages(imageData) {
        this._imagesService.getImages(this.profileType, this.scope)
            .subscribe(data => {
                    return this.imageData = data.imageArray, this.copyright = data.copyArray, this.imageTitle = data.titleArray;
                },
                err => {
                    console.log("Error getting image data" + err);
                });
    }

    private setupComparisonData() {
        this._comparisonService.getInitialPlayerStats(this.scope, this.pageParams).subscribe(
            data => {
                this.comparisonModuleData = data;
            },
            err => {
                console.log("Error getting comparison data", err);
            });
    }

    private standingsTabSelected(tabData: Array<any>) {
        //only show 5 rows in the module
        this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5);
    }

    private positionDropdown(event) {

      this.positionData = this.checkToResetTabs(event);

      if(event.tab != null){

        var matches = this.checkMatchingTabs(event);

        this.globalMVPPosition = event.position;

        if(matches != null){
          this.positionParams = {
            scope:  this.scope, //TODO change to active scope
            target: 'player',
            position: event.position,
            statName: matches.tabDataKey,
            ordering: 'asc',
            perPageCount: this.listMax,
            pageNumber: 1
          }
        }
      }
    }

    //function to check if selected position in dropdown is currently active
    private checkMatchingTabs(event) {

      let localPosition = event.position;
      let listName = event.tab.tabDataKey;

      if(event.position != this.globalMVPPosition){
        this.positionData[0].isLoaded = false;
        return this.positionData[0];
      }else{
        return this.positionData.filter(tab => tab.tabDataKey == listName)[0];
      }
    }

    //function to check if selected position in dropdown is currently active
    private checkToResetTabs(event) {

      let localPosition = event.position;

      if ( localPosition != this.globalMVPPosition ) {
        return this.listService.getMVPTabs(event.position, 'module');
      } else {
        return this.positionData;
      } //private checkToResetTabs
    }

    getMVPService(tab, params){
      this.listService.getListModuleService(tab, params)
          .subscribe(updatedTab => {
              //do nothing?
              var matches = this.positionData.filter(list => list.tabDataKey == params.listname);
              matches[0] = updatedTab;
          }, err => {
              tab.isLoaded = true;
              console.log('Error: Loading MVP Pitchers: ', err);
          })
    }
}
