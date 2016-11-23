import {Component, OnInit, Input, DoCheck, OnChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Title} from '@angular/platform-browser';

//interface
import {TitleInputData} from "../../fe-core/components/title/title.component";
import {RosterTabData} from "../../fe-core/components/roster/roster.component";
import {NFLRosterTabData} from '../../services/roster.data';
import {SportPageParameters} from '../../global/global-interface';

//service
import {RosterService} from '../../services/roster.service';
import {ProfileHeaderService} from '../../services/profile-header.service';

//global functions
import {GlobalFunctions} from '../../global/global-functions';
import {GlobalSettings} from "../../global/global-settings";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

@Component({
    selector: 'Team-roster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',
})

export class TeamRosterPage implements OnInit {
    public pageParams: SportPageParameters = {}
    public titleData: TitleInputData;
    public profileLoaded: boolean = false;
    public hasError: boolean = false;
    scope: string;
    public footerData = {
        infoDesc: 'Interested in discovering more about this player?',
        text: 'View Profile',
        url: ['Team-roster-page']
    };
    public tabs: Array<NFLRosterTabData>;
    private selectedTabTitle: string;

    constructor(
        private _profileService: ProfileHeaderService,
        private _rosterService: RosterService
    ) {

        //check to see if scope is correct and redirect
        // VerticalGlobalFunctions.scopeRedirect(_router, _params);
        // let teamId = _params.get("teamId");
        // if ( teamId !== null && teamId !== undefined ) {
        //   this.pageParams.teamId = Number(teamId);
        // }
        // GlobalSettings.getParentParams(_router, parentParams => {
        //     this.scope = parentParams.scope;
        //     this.pageParams.scope = this.scope;
        //     this.getData();
        // });
    }

    ngOnInit() {
    }

    getData() {
        // if ( this.pageParams.teamId ) {
        //   this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        //     data => {
        //       this.profileLoaded = true;
        //       this.pageParams = data.pageParams;
        //         data.teamName=data.headerData.teamMarket?data.headerData.teamMarket+" "+ data.teamName:data.teamName;
        //       this.titleData = this._profileService.convertTeamPageHeader(data, this._rosterService.getPageTitle(data.teamName));
        //       this.setupRosterData();
        //     },
        //     err => {
        //       this.hasError = true;
        //       console.log("Error getting team profile data for " + this.pageParams.teamId, err);
        //     }
        //   );
        // }
        // else {
        //   //TODO - Load error page since a team is required to show a roster?
        // }
    }

    private setupRosterData() {
        // this.tabs = this._rosterService.initializeAllTabs(this.scope, this.pageParams.teamId.toString(), this.pageParams.conference);
    }
}
