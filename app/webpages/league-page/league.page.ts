import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";

// interfaces
import { IProfileData, ProfileHeaderData, PlayerProfileHeaderData } from "../../fe-core/modules/profile-header/profile-header.module";

// services
import { ProfileHeaderService} from '../../services/profile-header.service';
import { VideoService } from "../../services/video.service";

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

    private profileHeaderData:ProfileHeaderData;
    private profileData:IProfileData;
    public isProfilePage:boolean = true;
    public profileType:string = "league";
    public profileName:string = "TDL";

    private dateParam:any;
    private eventStatus: string;

    private firstVideo:string;
    private videoData:any;

    private batchLoadIndex: number = 1;

    constructor(
      private _router:Router,
      private activateRoute:ActivatedRoute,
      private _profileService: ProfileHeaderService,
      private _videoBatchService:VideoService
    ) {
      var currentUnixDate = new Date().getTime();

      this.paramsub= this.activateRoute.params.subscribe(
            (param :any)=> {
              this.partnerID = param['partnerID'];
              this.scope = param['scope'] != null ? param['scope'] : 'nfl';
            }
      );

      this.dateParam ={
        profile:'league',//current profile page
        teamId: this.scope,
        date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')// date: '2016-09-11
      }

      this.setupProfileData(this.partnerID, this.scope);
    }

    ngOnInit() { console.log('League page'); }

    private setupProfileData(partnerID, scope) {
      console.log('---setUpProfileData function---');
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

    private getBoxScores(dateParams?) {
    } //getBoxScores

    private getSchedulesData(status, year?, week?) {
    } //getSchedulesData

    // function to lazy load page sections
    private onScroll(event) {
      this.batchLoadIndex = GlobalFunctions.lazyLoadOnScroll(event, this.batchLoadIndex);
      return;
    } //onScroll

  }
