import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { ProfileHeaderService} from '../../services/profile-header.service';
import { DailyUpdateService } from "../../services/daily-update.service";
import { HeadlineDataService } from "../../services/headline-module-service";
import { BoxScoresService } from "../../services/box-scores.service";
import { SchedulesService } from '../../services/schedules.service';
import { StandingsService } from "../../services/standings.service";

//interfaces
import { Division, Conference, SportPageParameters } from '../../global/global-interface';
import { IProfileData, ProfileHeaderData } from "../../fe-core/modules/profile-header/profile-header.module";
import { DailyUpdateData } from "../../fe-core/modules/daily-update/daily-update.module";
import { HeadlineData } from "../../global/global-interface";
import { StandingsModuleData } from '../../fe-core/modules/standings/standings.module';

//Libraries
declare var moment;
declare var jQuery: any; //used for scroll event



@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html'
})

export class TeamPage implements OnInit {
  private constructorControl:boolean = true;
  public partnerID: string;
  public scope: string;
  public paramsub;
  private teamID: number;
  private pageParams:SportPageParameters;
  private dateParam:any;

  public imageConfig: any;

  private profileData: IProfileData;
  private profileName:string;
  private profileHeaderData:ProfileHeaderData;

  private headlineData:HeadlineData;
  private headlineError:boolean = false;

  private dailyUpdateData: DailyUpdateData;

  private boxScoresData:any;
  private currentBoxScores:any;

  private schedulesData:any;
  private scheduleFilter1:Array<any>;
  private selectedFilter1:string;
  private eventStatus: any;
  private isFirstRun:number = 0;

  private standingsData:StandingsModuleData;

  private ptabName:string;

  constructor(
    private activateRoute: ActivatedRoute,
    private _profileService: ProfileHeaderService,
    private _dailyUpdateService: DailyUpdateService,
    private _headlineDataService:HeadlineDataService,
    private _boxScores: BoxScoresService,
    private _schedulesService:SchedulesService,
    private _standingsService:StandingsService
  ) {
    var currDate = new Date();
    var currentUnixDate = new Date().getTime();

    this.imageConfig = this._dailyUpdateService.getImageConfig();

    this.paramsub = this.activateRoute.params.subscribe(
      (param :any)=> {
        this.teamID = param['teamID'];
        this.partnerID = param['partnerID'];
        this.scope = param['scope'] != null ? param['scope'] : 'nfl';

        this.setupProfileData(this.partnerID, this.scope, this.teamID);
      }
    ) //this.paramsub

    this.dateParam = {
      scope: 'team',//current profile page
      teamId: this.teamID, // teamId if it exists
      date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
    } //this.dateParam
  }

  ngOnInit() {
    this.ptabName="Passing";
  }

  private setupProfileData(partnerID, scope, teamID?) {
    this._profileService.getTeamProfile(this.teamID).subscribe(
      data => {
        this.metaTags(data);
        this.pageParams = data.pageParams;
        this.profileData = data;
        let headerData = data.headerData != null ? data.headerData : null;
        this.profileName = data.teamName;
        if(headerData.teamMarket != null){
          this.profileName = headerData.teamMarket;
          this.profileName = headerData.teamName != null ? this.profileName + ' ' + headerData.teamName : this.profileName;
        }
        this.profileHeaderData = this._profileService.convertToTeamProfileHeader(data);
        this.dailyUpdateModule(teamID);

        setTimeout(() => { // defer loading everything below the fold
          //---Batch 2---//
          this.getHeadlines();
          this.getBoxScores(this.dateParam);

          //---Batch 3---//
          this.eventStatus = 'pregame';
          this.getSchedulesData(this.eventStatus);//grab pregame data for upcoming games
          this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams, this.scope, this.pageParams.teamId.toString(), data.headerData.teamMarket + ' ' + data.teamName);

        }, 2000);
      }
    )
  } //setupProfileData

  private metaTags(data){
  } //metaTags



  private dailyUpdateModule(teamId: number) {
    this._dailyUpdateService.getTeamDailyUpdate(teamId)
      .subscribe(data => {
        this.dailyUpdateData = data;
        this.getBoxScores(this.dateParam);
      },
      err => {
        this.dailyUpdateData = this._dailyUpdateService.getErrorData();
        console.log("Error getting daily update data", err);
    });
  } //dailyUpdateModule



  private getHeadlines(){
    this._headlineDataService.getAiHeadlineData(this.scope, this.pageParams.teamId)
      .subscribe(
        HeadlineData => {
          this.headlineData = HeadlineData.data;
          this.headlineError = HeadlineData.data.status != "Success";
        },
        err => {
          console.log("Error loading AI headline data for " + this.pageParams.teamId, err);
        }
    )
  } //getHeadlines



  private getBoxScores(dateParams?) {
    if ( dateParams != null ) {
      this.dateParam = dateParams;
    }
    this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
      this.boxScoresData = boxScoresData;
      this.currentBoxScores = currentBoxScores;
    })
  } //getBoxScores



  private scheduleTab(tab) {
      this.isFirstRun = 0;
        if(tab == 'Upcoming Games'){
          this.eventStatus = 'pregame';
          this.getSchedulesData(this.eventStatus, null);
        }else if(tab == 'Previous Games'){
          this.eventStatus = 'postgame';
          this.getSchedulesData(this.eventStatus, this.selectedFilter1);
        }else{
          this.eventStatus = 'postgame';
          this.getSchedulesData(this.eventStatus, this.selectedFilter1);// fall back just in case no status event is present
        }
    } //scheduleTab
    private filterDropdown(filter){
      let tabCheck = 0;
      if(this.eventStatus == 'postgame'){
        tabCheck = -1;
      }
      if(this.isFirstRun > tabCheck){
        this.selectedFilter1 = filter.key;
        this.getSchedulesData(this.eventStatus, this.selectedFilter1);
      }
      this.isFirstRun++;
    } //filterDropdown
    private getSchedulesData(status, year?){
      var limit = 5;
      if(status == 'pregame'){
        this.selectedFilter1 = null;
      }
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'team', status, limit, 1, this.pageParams.teamId, (schedulesData) => {
        if(status == 'pregame'){
          this.scheduleFilter1=null;
        }else{
          if(this.scheduleFilter1 == null){// only replaces if the current filter is not empty
            this.scheduleFilter1 = schedulesData.seasons;
          }
        }
        this.schedulesData = schedulesData;
      }, year) //year if null will return current year and if no data is returned then subract 1 year and try again
    } //getSchedulesData



    private standingsTabSelected(tabData: Array<any>) {
        //only show 5 rows in the module
        this.pageParams.scope = this.scope;
        this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5);
    } //standingsTabSelected
    private standingsFilterSelected(tabData: Array<any>) {
      this.pageParams.scope = this.scope;
      this._standingsService.getStandingsTabData(tabData, this.pageParams, data => {
      }, 5);
    } //standingsFilterSelected



}
