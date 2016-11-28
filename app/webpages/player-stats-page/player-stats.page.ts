import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';

//globals
import { GlobalFunctions } from '../../global/global-functions';
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from '../../global/vertical-global-functions';

//interfaces
import { TitleInputData } from "../../fe-core/components/title/title.component";
import { PlayerStatsService } from '../../services/player-stats.service';
import { ProfileHeaderService } from '../../services/profile-header.service';
import { MLBPlayerStatsTableData, MLBPlayerStatsTableModel } from '../../services/player-stats.data';
import { SportPageParameters } from '../../global/global-interface';



@Component({
  selector: 'Player-stats-page',
  templateUrl: './app/webpages/player-stats-page/player-stats.page.html'
})

export class PlayerStatsPage implements OnInit {
  public partnerID: string;
  public scope: string;
  public playerID: number;
  public playerName: string;
  public teamID: number;
  public teamName: string;
  public pageParams: SportPageParameters = {}

  public tabs: Array<MLBPlayerStatsTableData>;

  public titleData: TitleInputData = {
    imageURL: "/app/public/profile_placeholder.png",
    imageRoute: null,
    text1: "Last Updated: [date]",
    text2: "United States",
    text3: "Player Stats",
    icon: "fa fa-map-marker"
  }

  profileLoaded: boolean = false;
  hasError: boolean = false;
  lastUpdatedDateSet: boolean = false;
  tabName: string;



    constructor(
        private activatedRoute: ActivatedRoute,
        private _title: Title,
        private _profileService: ProfileHeaderService,
        private _statsService: PlayerStatsService
    ) {
        // check to see if scope is correct and redirect
        // VerticalGlobalFunctions.scopeRedirect(_router, _params);
        this.activatedRoute.params.subscribe(
          (param :any)=> {
            this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
            this.partnerID = param['partnerID'];
            this.teamID = param['teamID'];
            this.teamName = param['teamName'];
            this.playerID = param["playerID"];
            this.pageParams.playerId = Number(this.playerID);
          }
        )
        var teamId = this.teamID;
        if (teamId !== null && teamId !== undefined) {
            this.pageParams.teamId = Number(teamId);
        }
        if (this.tabName == "undefined") {
            this.tabName = "Passing";
        }
    } //constructor



    ngOnInit() {
        if (this.pageParams.teamId) {
            this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
                data => {
                    this.profileLoaded = true;
                    this.pageParams = data.pageParams;
                    data.teamName=data.headerData.teamMarket?data.headerData.teamMarket+" "+ data.teamName:data.teamName;
                    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, data.teamName, data.pageParams.teamId ? data.pageParams.teamId.toString() : null);
                    this.setupTitleData(teamRoute, data.teamName, data.fullProfileImageUrl);
                    this.tabs = this._statsService.initializeAllTabs(data.teamName, false);
                },
                err => {
                    this.hasError = true;
                    console.log("Error getting player stats data for " + this.pageParams.teamId + ": " + err);
                }
            );
        }
        else {
            this.setupTitleData(["League-page"]);
        }
    } //ngOnInit



    private setupTitleData(route: Array<any>, teamName?: string, imageUrl?: string) {
        var title = this._statsService.getPageTitle(teamName);
        this.titleData = {
            imageURL: imageUrl,
            imageRoute: route,
            text1: "",
            text2: "United States",
            text3: title,
            icon: "fa fa-map-marker"
        };
    } //setupTitleData



    private playerStatsTabSelected(tabData: Array<any>) {
        this._statsService.getStatsTabData(tabData, this.pageParams, data => {
            this.getLastUpdatedDateForPage(data);

            var seasonArray = tabData[0];
            var seasonIds = seasonArray.seasonIds;
            var seasonTab = seasonIds.find(function(e) {
                if (e.value === tabData[1]) {
                    return true;
                }

            });

            if (tabData[0].tabActive == "Special") {
                if (seasonTab) {
                    //console.log("year clicked");
                } else {
                    this.tabName = tabData[1];
                }
            } else {
                this.tabName = tabData[0].tabActive;
            };
            //tabData[0].tabActive!="Special"&&tabData[1]!="2015"||tabData[1]!="2014"?this.tabName=tabData[1]:this.tabName=tabData[0].tabActive;

        });
    } //playerStatsTabSelected



    private getLastUpdatedDateForPage(table: MLBPlayerStatsTableModel) {
        //Getting the first 'lastUpdatedDate' listed in the StandingsData
        if (!this.lastUpdatedDateSet && table && table.rows && table.rows.length > 0) {
            var lastUpdated = table.rows[0].lastUpdated;
            this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
            this.lastUpdatedDateSet = true;
        }
    } //getLastUpdatedDateForPage
}
