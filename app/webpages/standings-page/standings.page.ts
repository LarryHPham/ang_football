import {Component, OnInit, Input} from '@angular/core';
import {RouteParams} from "@angular/router-deprecated";
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from "../../fe-core/components/backtab/backtab.component";
import {GlossaryComponent, GlossaryData} from "../../fe-core/components/glossary/glossary.component";

import {TitleComponent, TitleInputData} from "../../fe-core/components/title/title.component";
import {CircleImageData, ImageData} from "../../fe-core/components/images/image-data";
import {StandingsComponent} from "../../fe-core/components/standings/standings.component";
import {LoadingComponent} from '../../fe-core/components/loading/loading.component';
import {ErrorComponent} from '../../fe-core/components/error/error.component';

import {ProfileHeaderService} from '../../services/profile-header.service';
import {StandingsService} from '../../services/standings.service';
import {MLBStandingsTabData,MLBStandingsTableData} from '../../services/standings.data';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'Standings-page',
    templateUrl: './app/webpages/standings-page/standings.page.html',
    directives: [GlossaryComponent, SidekickWrapper, BackTabComponent, TitleComponent, StandingsComponent, LoadingComponent, ErrorComponent],
    providers: [StandingsService, ProfileHeaderService, Title],
})

export class StandingsPage implements OnInit {
  public tabs: Array<MLBStandingsTabData>;
  public pageParams: MLBPageParameters = {}
  public titleData: TitleInputData;
  public profileLoaded: boolean = false;
  public hasError: boolean = false;
  public glossary: Array<GlossaryData>;
  constructor(private _params: RouteParams,
              private _title: Title,
              private _profileService: ProfileHeaderService,
              private _standingsService: StandingsService,
              private _mlbFunctions: MLBGlobalFunctions) {
    _title.setTitle(GlobalSettings.getPageTitle("Standings"));

    var type = _params.get("type");
    if ( type !== null && type !== undefined ) {
      type = type.toLowerCase();
      this.pageParams.conference = Conference[type];
    }
    var teamId = _params.get("teamId");
    if ( type == "team" && teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
    }
  }
  getGlossaryValue():Array<GlossaryData>{
    this.glossary = [
        {
          terms: "<span class='text-heavy'>W/L/T:</span> Total Wins",
        },
        {
          terms: "<span class='text-heavy'>CONF:</span> Conference Record",
        },
        {
          terms: "<span class='text-heavy'>STRK:</span> Streak",
        },
        {
          terms: "<span class='text-heavy'>HM:</span> Home",
        },
        {
          terms: "<span class='text-heavy'>RD:</span> Road",
        },
        {
          terms: "<span class='text-heavy'>PF:</span> Value 6",
        },
        {
          terms: "<span class='text-heavy'>PA:</span> Points Allowed",
        },
        {
          terms: "<span class='text-heavy'>RANK</span> Team Rank",
        }
      ]
    return this.glossary;
  }
  ngOnInit() {
    this.getGlossaryValue();
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.profileLoaded = true;
          this.pageParams = data.pageParams;
          this._title.setTitle(GlobalSettings.getPageTitle("Standings", data.teamName));

          var title = this._standingsService.getPageTitle(this.pageParams, data.teamName);
          this.titleData = this._profileService.convertTeamPageHeader(data, title)
          this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
        },
        err => {
          this.hasError = true;
          console.log("Error getting team profile data for " + this.pageParams.teamId, err);
        }
      );
    }
    else {
      this._title.setTitle(GlobalSettings.getPageTitle("Standings", "NFL"));//TODO
      var title = this._standingsService.getPageTitle(this.pageParams, null);
      this.titleData = this.titleData = {
        imageURL: GlobalSettings.getSiteLogoUrl(),
        imageRoute: ["League-page"],
        text1: "",
        text2: "United States",
        text3: title,
        icon: "fa fa-map-marker"
      }
      this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
    }
  }

  private standingsTabSelected(tabData: Array<any>) {
    this._standingsService.getStandingsTabData(tabData, this.pageParams, data => {
      this.getLastUpdatedDateForPage(data);
    });
  }

  private getLastUpdatedDateForPage(data: MLBStandingsTableData[]) {
      //Getting the first 'lastUpdatedDate' listed in the StandingsData
      if ( data && data.length > 0 &&
        data[0].tableData && data[0].tableData.rows &&
        data[0].tableData.rows.length > 0 ) {
          var lastUpdated = data[0].tableData.rows[0].lastUpdated;
          this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
      }
  }
}
