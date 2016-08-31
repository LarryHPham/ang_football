///<reference path="../../../node_modules/rxjs/Observable.d.ts"/>
import {Component, OnInit, Injectable} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalFunctions} from "../../global/global-functions";
import {Division, Conference, SportPageParameters} from '../../global/global-interface';
import {GlobalSettings} from "../../global/global-settings";
import {LoadingComponent} from '../../fe-core/components/loading/loading.component';
import {ErrorComponent} from '../../fe-core/components/error/error.component';

import {CommentModule} from '../../fe-core/modules/comment/comment.module';
import {HeadlineComponent} from '../../fe-core/components/headline/headline.component';



import {ArticlesModule} from "../../fe-core/modules/articles/articles.module";

import {TwitterModule, twitterModuleData} from "../../fe-core/modules/twitter/twitter.module";
import {TwitterService} from '../../services/twitter.service';

import {DYKModule, dykModuleData} from "../../fe-core/modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../fe-core/modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {BoxScoresModule} from '../../fe-core/modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {ComparisonModule, ComparisonModuleData} from '../../fe-core/modules/comparison/comparison.module';
import {ComparisonStatsService} from '../../services/comparison-stats.service';

import {StandingsModule, StandingsModuleData} from '../../fe-core/modules/standings/standings.module';
import {TDLStandingsTabdata} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {SchedulesService} from '../../services/schedules.service';
import {SchedulesModule} from '../../fe-core/modules/schedules/schedules.module';

import {TeamRosterModule, RosterModuleData} from '../../fe-core/modules/team-roster/team-roster.module';
import {RosterService} from '../../services/roster.service';
import {TeamRosterData} from '../../services/roster.data';

import {ProfileHeaderData, ProfileHeaderModule} from '../../fe-core/modules/profile-header/profile-header.module';
import {IProfileData, ProfileHeaderService} from '../../services/profile-header.service';

import {NewsModule} from '../../fe-core/modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {PlayerStatsModule, PlayerStatsModuleData} from '../../fe-core/modules/player-stats/player-stats.module';
import {PlayerStatsService} from '../../services/player-stats.service'
import {MLBPlayerStatsTableData} from '../../services/player-stats.data'

//module | interface | service
import {DraftHistoryModule} from '../../fe-core/modules/draft-history/draft-history.module';

import {ImagesMedia} from "../../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import {ImagesService} from "../../services/carousel.service";

import {ListOfListsModule} from "../../fe-core/modules/list-of-lists/list-of-lists.module";
import {ListOfListsService} from "../../services/list-of-lists.service";

import {TransactionsModule, TransactionModuleData} from "../../fe-core/modules/transactions/transactions.module";
import {TransactionsService} from "../../services/transactions.service";
import {DailyUpdateModule} from "../../fe-core/modules/daily-update/daily-update.module";
import {DailyUpdateService, DailyUpdateData} from "../../services/daily-update.service";

import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";

import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
import {VideoModule} from "../../fe-core/modules/video/video.module";
import {VideoService} from "../../services/video.service";
import {HeadlineDataService} from "../../global/global-ai-headline-module-service";
import {HeadlineData} from "../../global/global-interface";

declare var moment;

@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html',
    directives: [
        SidekickWrapper,
        VideoModule,
        LoadingComponent,
        ErrorComponent,
        DailyUpdateModule,
        SchedulesModule,
        BoxScoresModule,
        DraftHistoryModule,
        HeadlineComponent,
        ProfileHeaderModule,
        StandingsModule,
        CommentModule,
        DYKModule,
        FAQModule,
        TwitterModule,
        ComparisonModule,
        TeamRosterModule,
        NewsModule,
        ArticlesModule,
        ImagesMedia,
        ListOfListsModule,
        PlayerStatsModule,
        TransactionsModule,
        ResponsiveWidget
    ],
    providers: [
      VideoService,
      BoxScoresService,
      SchedulesService,
      StandingsService,
      ProfileHeaderService,
      RosterService,
      ListOfListsService,
      ImagesService,
      NewsService,
      FaqService,
      DykService,
      PlayerStatsService,
      TransactionsService,
      ComparisonStatsService,
      DailyUpdateService,
      TwitterService,
      Title
    ]
})

export class TeamPage implements OnInit {
    public widgetPlace: string = "widgetForModule";
    headerData:any;
    pageParams:SportPageParameters;
    partnerID:string = null;
    scope:string = null;
    hasError: boolean = false;
    headlineError:boolean = false;
    headlineData:HeadlineData;
    profileHeaderData:ProfileHeaderData;
    profileData:IProfileData;
    comparisonModuleData: ComparisonModuleData;
    standingsData: StandingsModuleData;
    playerStatsData: PlayerStatsModuleData;
    rosterData: RosterModuleData<TeamRosterData>;
    dailyUpdateData: DailyUpdateData;
    firstVideo:string;
    videoData:any;
    imageData:Array<any>;
    copyright:any;
    imageTitle: any;
    profileType:string = "team";
    isProfilePage:boolean = true;
    // draftHistoryData:any;

    boxScoresData:any;
    currentBoxScores:any;
    dateParam:any;

    transactionsData:TransactionModuleData;
    // currentYear: any;

    schedulesData:any;


    profileName:string;
    listOfListsData:Object; // paginated data to be displayed
    newsDataArray: Array<Object>;
    faqData: Array<faqModuleData>;
    dykData: Array<dykModuleData>;
    twitterData: Array<twitterModuleData>;

    constructor(private _params:RouteParams,
                private _router:Router,
                private _title: Title,
                private _standingsService:StandingsService,
                private _boxScores:BoxScoresService,
                private _schedulesService:SchedulesService,
                private _profileService:ProfileHeaderService,
                private _lolService: ListOfListsService,
                private _transactionsService:TransactionsService,
                private _imagesService:ImagesService,
                private _playerStatsService: PlayerStatsService,
                private _rosterService: RosterService,
                private _newsService: NewsService,
                private _faqService: FaqService,
                private _dykService: DykService,
                private _twitterService: TwitterService,
                private _comparisonService: ComparisonStatsService,
                private _dailyUpdateService: DailyUpdateService,
                private _headlineDataService:HeadlineDataService,
                private _videoBatchService: VideoService) {
        this.pageParams = {
            teamId: Number(_params.get("teamId"))
        };

        GlobalSettings.getParentParams(_router, parentParams => {
            this.partnerID = parentParams.partnerID;
            this.scope = parentParams.scope;

            var currDate = new Date();
            var currentUnixDate = currDate.getTime();
            //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
            this.dateParam ={
              profile:'team',//current profile page
              teamId:this.pageParams.teamId, // teamId if it exists
              // date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
              date: '2015-09-03'
            }
            this.setupProfileData(this.partnerID,this.scope);
        });
    }

    ngOnInit() {

    }

    /**
     *
     * Profile Header data is needed to fill in data info for other modules.
     * It is required to synchronously aquire data first before making any asynchronous
     * calls from other modules.
     *
     **/
    private setupProfileData(partnerID, scope) {

        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
            data => {
                /*** About the [Team Name] ***/
                this.pageParams = data.pageParams;
                this.profileData = data;
                this.profileName = data.teamName;
                this._title.setTitle(GlobalSettings.getPageTitle(this.profileName));
                this.profileHeaderData = this._profileService.convertToTeamProfileHeader(data);

                this.dailyUpdateModule(this.pageParams.teamId);
                this.getHeadlines(this.headlineData);

                /*** Keep Up With Everything [Team Name] ***/
                this.getBoxScores(this.dateParam);
                this.getSchedulesData('postgame');//grab pregame data for upcoming games
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams, this.pageParams.teamId, data.teamName);
                this.rosterData = this._rosterService.loadAllTabsForModule(this.pageParams.teamId, data.teamName, this.pageParams.conference, true, data.headerData.teamMarket);
                this.playerStatsData = this._playerStatsService.loadAllTabsForModule(this.pageParams.teamId, data.teamName, true);
                this.transactionsData = this._transactionsService.loadAllTabsForModule(data.teamName, this.pageParams.teamId);
                //this.loadMVP
                this.setupComparisonData();

                /*** Other [League Name] Content You May Love ***/
                this.getImages(this.imageData);
                this.getDykService();
                this.getFaqService();
                this.setupListOfListsModule();
                this.getNewsService();
                this.getTeamVideoBatch(7, 1, 1, 0, scope,this.pageParams.teamId);

                /*** Interact With [League Name]’s Fans ***/
                this.getTwitterService();
            },
            err => {
                this.hasError = true;
                console.log("Error getting team profile data for " + this.pageParams.teamId, err);
            }
        );
    }

    private dailyUpdateModule(teamId: number) {
        this._dailyUpdateService.getTeamDailyUpdate(teamId)
            .subscribe(data => {
                this.dailyUpdateData = data;
            },
            err => {
                this.dailyUpdateData = this._dailyUpdateService.getErrorData();
                console.log("Error getting daily update data", err);
            });
    }

    private getTeamVideoBatch(numItems, startNum, pageNum, first, scope, teamID?){
       // if(teamID)
        this._videoBatchService.getVideoBatchService(numItems, startNum, pageNum, first, scope, teamID)
            .subscribe(data => {

                this.firstVideo = data.data[first].videoLink;
                this.videoData = data.data.slice(1);

            },
                err => {

                    console.log("Error getting video data");
                }

        );

    }

    private getTwitterService() {
        this._twitterService.getTwitterService(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                this.twitterData = data;
            },
            err => {
                console.log("Error getting twitter data");
            });
    }

    private getDykService() {
        this._dykService.getDykService(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                this.dykData = data;
            },
            err => {
                console.log("Error getting did you know data");
            });
    }

    private getFaqService() {
        this._faqService.getFaqService(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                    this.faqData = data;
                },
                err => {
                    console.log("Error getting faq data for team", err);
                });
    }

    private getNewsService() {
        this._newsService.getNewsService(this.profileName)
            .subscribe(data => {
                this.newsDataArray = data.news;
            },
            err => {
                console.log("Error getting news data");
            });
    }

    //api for Headline Module
    private getHeadlines(){
        if (this.scope == "ncaaf") {
            this.scope = "ncaa";
        }
        this._headlineDataService.getAiHeadlineData(this.scope.toUpperCase(), this.pageParams.teamId)
            .subscribe(
                HeadlineData => {
                    this.headlineData = HeadlineData;
                },
                err => {
                    this.headlineError = true;
                    console.log("Error loading AI headline data for " + this.pageParams.teamId, err);
                }
            )
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

    //grab tab to make api calls for post of pregame table
    private scheduleTab(tab) {
        if(tab == 'Upcoming Games'){
            this.getSchedulesData('pregame');
        }else if(tab == 'Previous Games'){
            this.getSchedulesData('postgame');
        }else{
            this.getSchedulesData('postgame');// fall back just in case no status event is present
        }
    }

    //api for Schedules
    private getSchedulesData(status){
      var limit = 5;
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'team', status, limit, 1, this.pageParams.teamId, (schedulesData) => {
        this.schedulesData = schedulesData;
      }) // isTeamProfilePage = true
    }

    private getImages(imageData) {
        this._imagesService.getImages(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                    return this.imageData = data.imageArray, this.copyright = data.copyArray, this.imageTitle = data.titleArray;
                },
                err => {
                    console.log("Error getting image data" + err);
                });
    }

    private setupComparisonData() {
        this._comparisonService.getInitialPlayerStats(this.pageParams).subscribe(
            data => {
                this.comparisonModuleData = data;
            },
            err => {
                console.log("Error getting comparison data for "+ this.pageParams.teamId, err);
            });
    }

    private standingsTabSelected(tabData: Array<any>) {
        //only show 5 rows in the module
        this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5);
    }

    private playerStatsTabSelected(tabData: Array<any>) {
         //only show 4 rows in the module
        this._playerStatsService.getStatsTabData(tabData, this.pageParams, data => {}, 5);
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

    setupListOfListsModule() {
        let params = {
          id : this.pageParams.teamId,
          limit : 5,
          pageNum : 1
        }
        this._lolService.getListOfListsService(params, "team", "module")
            .subscribe(
                listOfListsData => {
                    this.listOfListsData = listOfListsData.listData;
                    this.listOfListsData["type"] = "team";
                    this.listOfListsData["id"] = this.pageParams.teamId;
                },
                err => {
                    console.log('Error: listOfListsData API: ', err);
                }
            );
    }
}
