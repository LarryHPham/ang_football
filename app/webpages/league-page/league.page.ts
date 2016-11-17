import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";

// interfaces
import { IProfileData, ProfileHeaderData, PlayerProfileHeaderData } from "../../fe-core/modules/profile-header/profile-header.module";
import { SportPageParameters } from "../../fe-core/interfaces/global-interface";

// services
import { ProfileHeaderService} from '../../services/profile-header.service';
import { VideoService } from "../../services/video.service";
import { BoxScoresService } from "../../services/box-scores.service";
import { SchedulesService } from "../../services/schedules.service";

// Libraries
declare var moment;

@Component({
    selector: 'League-page',
    templateUrl: './app/webpages/league-page/league.page.html'
})

export class LeaguePage implements OnInit {
    public partnerID: string;
    public scope: string;
    public paramsub;

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
    private scheduleFilter1:Array<any>;
    private scheduleFilter2:Array<any>;
    private selectedFilter1:string
    private selectedFilter2:string;
    private isFirstNum:number = 0;

    private batchLoadIndex: number = 1;

    constructor(
      private _router:Router,
      private activateRoute: ActivatedRoute,
      private _profileService: ProfileHeaderService,
      private _videoBatchService: VideoService,
      private _boxScores: BoxScoresService,
      private _schedulesService: SchedulesService
    ) {
      var currentUnixDate = new Date().getTime();

      this.paramsub= this.activateRoute.params.subscribe(
            (param :any)=> {
              this.partnerID = param['partnerID'];
              this.scope = param['scope'] != null ? param['scope'] : 'nfl';
            }
      );

      // OLD from TDL
      // this.dateParam ={
      //   profile:'league',
      //   teamId: this.scope,
      //   date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')// date: '2016-09-11
      // }

      this.dateParam ={
        scope:'league',//current profile page
        teamId: this.scope,
        date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')// date: '2016-09-11
      }

      this.setupProfileData(this.partnerID, this.scope);
    }

    ngOnInit() { console.log('League page'); }

    private setupProfileData(partnerID, scope) {
      this._profileService.getLeagueProfile(scope).subscribe(
        data => {

          //---Batch 1 Load---//
          this.metaTags(data);
          this.profileData = data;
          this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data.headerData);
          this.profileName = this.scope == 'fbs'? 'NCAAF':this.scope.toUpperCase(); //leagueShortName

          setTimeout(() => { // defer loading everything below the fold

            //---Batch 2 Load---//
            this.getLeagueVideoBatch(7,1,1,0,this.scope);
            this.getBoxScores(this.dateParam);
            this.eventStatus = 'pregame';
            this.getSchedulesData(this.eventStatus);//grab pre event data for upcoming games

            //---Batch 3 Load---//
            //this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams, this.scope, this.dateParam.profile);
          });
        }
      )
    } //setupProfileData

    private metaTags(data){
    } //metaTags

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
      }, year, week) // isTeamProfilePage = true
    } //getSchedulesData

    // function to lazy load page sections
    private onScroll(event) {
      this.batchLoadIndex = GlobalFunctions.lazyLoadOnScroll(event, this.batchLoadIndex);
      return;
    } //onScroll

  }
