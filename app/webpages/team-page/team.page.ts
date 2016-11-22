import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { ProfileHeaderService} from '../../services/profile-header.service';
import { DailyUpdateService } from "../../services/daily-update.service";

//interfaces
import { Division, Conference, SportPageParameters } from '../../global/global-interface';
import { IProfileData, ProfileHeaderData } from "../../fe-core/modules/profile-header/profile-header.module";
import { DailyUpdateData } from "../../fe-core/modules/daily-update/daily-update.module";

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

  private profileData: IProfileData;
  private profileName:string;
  private profileHeaderData:ProfileHeaderData;

  private ptabName:string;

  constructor(
    private activateRoute: ActivatedRoute,
    private _profileService: ProfileHeaderService,
    private _dailyUpdateService: DailyUpdateService,
    // private dailyUpdateData: DailyUpdateData
  ) {
    var currDate = new Date();
    var currentUnixDate = new Date().getTime();

    this.paramsub = this.activateRoute.params.subscribe(
      (param :any)=> {
        this.teamID = param['teamID'];
        this.partnerID = param['partnerID'];
        this.scope = param['scope'] != null ? param['scope'] : 'nfl';
      }
    ) //this.paramsub

    this.dateParam = {
      profile: 'team',//current profile page
      teamId: this.teamID, // teamId if it exists
      date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
    } //this.dateParam

    this.setupProfileData(this.partnerID,this.scope);
  }

  ngOnInit() {
    this.ptabName="Passing";
  }

  private setupProfileData(partnerID, scope) {
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
        this.dailyUpdateModule(this.pageParams.teamId);
      }
    )
  } //setupProfileData

  private metaTags(data){
  } //metaTags

  private dailyUpdateModule(teamId: number) {}
}
