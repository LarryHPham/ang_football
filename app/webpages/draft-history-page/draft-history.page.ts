import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { ProfileHeaderService } from '../../services/profile-header.service';

//interfaces
import { IProfileData } from "../../fe-core/modules/profile-header/profile-header.module";
import { TitleInputData } from '../../fe-core/components/title/title.component';

@Component({
    selector: 'draft-history-page',
    templateUrl: './app/webpages/draft-history-page/draft-history.page.html'
})

export class DraftHistoryPage implements OnInit {
    public partnerID: string;
    public scope: string;
    public teamID: number;
    public teamName: string;
    public paramsub: any;

    private whatProfile: string = "Draft History";
    private profileHeaderData: TitleInputData;
    private profileData: IProfileData;
    private isError: boolean = false;

    constructor(
        private activateRoute: ActivatedRoute,
        private _profileService: ProfileHeaderService,
        private _title: Title) {
        this.paramsub = this.activateRoute.params.subscribe(
            (param: any) => {
              this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';
              this.partnerID = param['partnerID'];
              this.teamName = param['teamName'];
              this.teamID = param['teamID'];
            }
        ) //this.paramsub
    }

    ngOnInit() {
        let teamId = null;
        if (this.teamID != null) {
            teamId = Number(this.teamID);
        }

        if (teamId) {
            this._profileService.getTeamProfile(teamId)
                .subscribe(
                data => {
                    // this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.teamName));
                    data.profileName = data.headerData.teamMarket ? data.headerData.teamMarket + " " + data.profileName : data.profileName;
                    var pageNameForTitle = this.whatProfile + " - " + data.profileName;
                    this.profileHeaderData = this._profileService.convertTeamPageHeader(this.scope, data, pageNameForTitle);
                    this.profileData = data;
                },
                err => {
                    this.isError = true;
                    console.log('Error: draftData Profile Header API: ', err);
                }
                );
        }
        else {
            this._profileService.getLeagueProfile()
                .subscribe(
                data => {
                    // this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.headerData.leagueAbbreviatedName));
                    this.profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, data.headerData.leagueAbbreviatedName + ' ' + this.whatProfile);
                    this.profileData = data;
                },
                err => {
                    this.isError = true;
                    console.log('Error: draftData Profile Header API: ', err);
                }
                );
        }
    }
}
