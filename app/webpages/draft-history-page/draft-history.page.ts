import {Component, OnInit} from '@angular/core';

import {GlobalSettings} from "../../global/global-settings";
import {TitleInputData} from '../../fe-core/components/title/title.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

@Component({
    selector: 'draft-history-page',
    templateUrl: './app/webpages/draft-history-page/draft-history.page.html',
})

export class DraftHistoryPage implements OnInit {
    whatProfile: string = "Draft History";

    profileHeaderData: TitleInputData;

    profileData: any;

    isError: boolean = false;

    constructor(
        private _profileService: ProfileHeaderService
    ) {
        //check to see if scope is correct and redirect
        // VerticalGlobalFunctions.scopeRedirect(_router, params);
        // _title.setTitle(GlobalSettings.getPageTitle(this.whatProfile));
    }

    ngOnInit() {
        // let teamId = null;
        // if ( this.params.get('teamId') != null ) {
        //   teamId = Number(this.params.get('teamId'));
        // }
        //
        // if ( teamId ) {
        //   this._profileService.getTeamProfile(teamId)
        //   .subscribe(
        //       data => {
        //         // this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.teamName));
        //           data.profileName=data.headerData.teamMarket?data.headerData.teamMarket+" "+ data.profileName:data.profileName;
        //         var pageNameForTitle = this.whatProfile + " - " + data.profileName;
        //         this.profileHeaderData = this._profileService.convertTeamPageHeader(data, pageNameForTitle);
        //         this.profileData = data;
        //       },
        //       err => {
        //         this.isError= true;
        //           console.log('Error: draftData Profile Header API: ', err);
        //       }
        //   );
        // }
        // else {
        //   this._profileService.getLeagueProfile()
        //   .subscribe(
        //       data => {
        //         // this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.headerData.leagueAbbreviatedName));
        //         this.profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, data.headerData.leagueAbbreviatedName + ' ' + this.whatProfile);
        //         this.profileData = data;
        //       },
        //       err => {
        //         this.isError= true;
        //           console.log('Error: draftData Profile Header API: ', err);
        //       }
        //   );
        // }
    }
}
