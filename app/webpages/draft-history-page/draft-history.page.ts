import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalSettings} from "../../global/global-settings";
import {TitleComponent, TitleInputData} from '../../fe-core/components/title/title.component';
import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {ErrorComponent} from "../../fe-core/components/error/error.component";
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {DraftHistoryComponent} from "../../fe-core/components/draft-history/draft-history.component";
import {IProfileData, ProfileHeaderService} from '../../services/profile-header.service';
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

@Component({
    selector: 'draft-history-page',
    templateUrl: './app/webpages/draft-history-page/draft-history.page.html',
    directives: [SidekickWrapper, ErrorComponent, LoadingComponent, DraftHistoryComponent, BackTabComponent, TitleComponent, ResponsiveWidget],
    providers: [ProfileHeaderService, Title]
})

export class DraftHistoryPage implements OnInit{
  whatProfile:string = "Draft History";

  profileHeaderData: TitleInputData;

  profileData: IProfileData;

  isError: boolean = false;

  constructor(private _profileService:ProfileHeaderService,
              private params: RouteParams,
              private _router: Router,
              private _title: Title) {
            //check to see if scope is correct and redirect
            VerticalGlobalFunctions.scopeRedirect(_router, params);
    // _title.setTitle(GlobalSettings.getPageTitle(this.whatProfile));
  }

  ngOnInit() {
    let teamId = null;
    if ( this.params.get('teamId') != null ) {
      teamId = Number(this.params.get('teamId'));
    }

    if ( teamId ) {
      this._profileService.getTeamProfile(teamId)
      .subscribe(
          data => {
            // this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.teamName));
              data.profileName=data.headerData.teamMarket?data.headerData.teamMarket+" "+ data.profileName:data.profileName;
            var pageNameForTitle = this.whatProfile + " - " + data.profileName;
            this.profileHeaderData = this._profileService.convertTeamPageHeader(data, pageNameForTitle);
            this.profileData = data;
          },
          err => {
            this.isError= true;
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
            this.isError= true;
              console.log('Error: draftData Profile Header API: ', err);
          }
      );
    }
  }
}
