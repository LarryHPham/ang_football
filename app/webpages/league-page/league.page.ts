import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";

// interfaces
import { IProfileData, ProfileHeaderData, PlayerProfileHeaderData } from '../../services/profile-header.service';

// services
import { ProfileHeaderService} from '../../services/profile-header.service';

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
    public profileName:string = "TDL";

    private dateParam:any;
    private eventStatus: string;


    constructor(
      private _router:Router,
      private activateRoute:ActivatedRoute,
      private _profileService: ProfileHeaderService
    ) {
      var currentUnixDate = new Date().getTime();

      this.paramsub= this.activateRoute.params.subscribe(
            (param :any)=> {
              this.partnerID = param['partnerID'];
              this.scope = param['scope'];
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
          //this.profileName = this.scope == 'fbs'? 'NCAAF':this.scope.toUpperCase(); //leagueShortName

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

    private getLeagueVideoBatch(numItems, startNum, pageNum, first, scope, teamID?){
    } //getLeagueVideoBatch

    private getBoxScores(dateParams?) {
    } //getBoxScores

    private getSchedulesData(status, year?, week?) {
    } //getSchedulesData

  }
