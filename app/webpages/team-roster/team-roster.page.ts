import { Component, OnInit, Input, DoCheck, OnChanges } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';

//global functions
import { GlobalFunctions } from '../../global/global-functions';
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//service
import { RosterService } from '../../services/roster.service';
import { ProfileHeaderService } from '../../services/profile-header.service';

//interface
import { TitleInputData } from "../../fe-core/components/title/title.component";
import { RosterTabData } from "../../fe-core/components/roster/roster.component";
import { NFLRosterTabData } from '../../services/roster.data';
import { SportPageParameters } from '../../global/global-interface';



@Component({
    selector: 'Team-roster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',
})

export class TeamRosterPage implements OnInit {
    public scope: string;
    public partnerID: string;
    public teamID: string;
    public pageParams: SportPageParameters = {}
    public paramsub: any;

    public titleData: TitleInputData;
    public profileLoaded: boolean = false;
    public hasError: boolean = false;
    public footerData = {
        infoDesc: 'Interested in discovering more about this player?',
        text: 'View Profile',
        url: ['Team-roster-page']
    };
    public tabs: Array<NFLRosterTabData>;
    private selectedTabTitle: string;

    constructor(
        private activateRoute: ActivatedRoute,
        private _profileService: ProfileHeaderService,
        private _rosterService: RosterService
    ) {
      this.paramsub = this.activateRoute.params.subscribe(
        (param :any)=> {
          this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
          this.pageParams.scope = this.scope;
          this.partnerID = param['partnerID'];
          this.teamID = param['teamID'];
          if ( this.teamID !== null && this.teamID !== undefined ) {
            this.pageParams.teamId = Number(this.teamID);
          }
        }
      )

      this.getData();
    } //constructor



    ngOnInit() {}



    getData() {
      if ( this.pageParams.teamId ) {
        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
          data => {
            this.profileLoaded = true;
            this.pageParams = data.pageParams;
              data.teamName=data.headerData.teamMarket?data.headerData.teamMarket+" "+ data.teamName:data.teamName;
            this.titleData = this._profileService.convertTeamPageHeader(this.scope, data, this._rosterService.getPageTitle(data.teamName));
            this.setupRosterData();
          },
          err => {
            this.hasError = true;
            console.log("Error getting team profile data for " + this.pageParams.teamId, err);
          }
        );
      }
      else {
        //TODO - Load error page since a team is required to show a roster?
      }
    } //getData



    private setupRosterData() {
        this.tabs = this._rosterService.initializeAllTabs(this.scope, this.pageParams.teamId.toString(), this.pageParams.conference);
    } //setupRosterData
}
