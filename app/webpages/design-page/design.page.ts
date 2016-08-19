import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

import {DraftHistoryModule} from '../../fe-core/modules/draft-history/draft-history.module';

import {StandingsModuleData, StandingsModule} from '../../fe-core/modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';
import {GlobalSettings} from '../../global/global-settings';

import {ProfileHeaderData, ProfileHeaderModule} from '../../fe-core/modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {ArticlesModule} from "../../fe-core/modules/articles/articles.module";
import {ListOfListsModule} from "../../fe-core/modules/list-of-lists/list-of-lists.module";
import {TeamRosterModule} from '../../fe-core/modules/team-roster/team-roster.module';
import {RosterService} from '../../services/roster.service';
import {CommentModule} from '../../fe-core/modules/comment/comment.module';
import {ListOfListsData} from "../../fe-core/modules/list-of-lists/list-of-lists.module";
import {ListOfListsService} from "../../services/list-of-lists.service";

@Component({
    selector: 'Design-page',
    templateUrl: './app/webpages/design-page/design.page.html',
    directives: [DraftHistoryModule, TeamRosterModule, StandingsModule, ProfileHeaderModule, ArticlesModule, ListOfListsModule, CommentModule],
    providers: [StandingsService, ProfileHeaderService, RosterService, ListOfListsService]
})

export class DesignPage implements OnInit {
  pageParams: MLBPageParameters;
  standingsData: StandingsModuleData;
  playerProfileHeaderData: ProfileHeaderData;
  teamProfileHeaderData: ProfileHeaderData;
  leagueProfileHeaderData: ProfileHeaderData;
  listOfListsData: ListOfListsData;
  profileType: string;
  lolDetailedDataArray : any;
  lolDataArray : boolean;
  lolCarouselDataArray : any;

  constructor(
    private _params: RouteParams,
    private _standingsService: StandingsService,
    private _profileService: ProfileHeaderService,
    private _lolService: ListOfListsService,
    private _mlbFunctions: MLBGlobalFunctions) {

    if ( this.pageParams === undefined || this.pageParams === null ) {
      this.pageParams = {
        division: Division.east,
        conference: Conference.american,
        playerId: 95041,
        teamId: Number(_params.get("teamId"))
      };
    }
  }

  ngOnInit() {
    this.setupProfileData();
    this.setupLolData();
  }

  private setupProfileData() {
    this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
      data => {
        this.playerProfileHeaderData = this._profileService.convertToPlayerProfileHeader(data);
      },
      err => {
        console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
      }
    );
    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
      data => {
        this.pageParams = data.pageParams;
        this.teamProfileHeaderData = this._profileService.convertToTeamProfileHeader(data);
        this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);
      },
      err => {
        console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
      }
    );
    this._profileService.getLeagueProfile().subscribe(
      data => {
        this.leagueProfileHeaderData = this._profileService.convertToLeagueProfileHeader(data.headerData);
      },
      err => {
        console.log("Error getting league profile data: " + err);
      }
    );
  }

  private standingsTabSelected(tabData: Array<any>) {
    //only show 5 rows in the module
    this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5)
  }

  private setupLolData() {
    let params = {
      id : "2799",
      limit : 4,
      pageNum : 1,
    }
    this._lolService.getListOfListsService(params, "team", "module")
      .subscribe(
        listOfListsData => {
          this.listOfListsData = listOfListsData;
        },
        err => {
          console.log('Error: listOfListsData API: ', err);
        }
      );
  }

}
