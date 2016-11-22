//angular core libraries
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

//interfaces
import {ProfileHeaderData} from '../../fe-core/modules/profile-header/profile-header.module';
import {DailyUpdateData} from "../../fe-core/modules/daily-update/daily-update.module";
// import {SportPageParameters} from '../../global/global-interface';
// import {dykModuleData} from "../../fe-core/modules/dyk/dyk.module";
// import {faqModuleData} from "../../fe-core/modules/faq/faq.module";
// import {twitterModuleData} from "../../fe-core/modules/twitter/twitter.module";
// import {ComparisonModuleData} from '../../fe-core/modules/comparison/comparison.module';
// import {StandingsModuleData} from '../../fe-core/modules/standings/standings.module';
// import {TDLStandingsTabdata} from '../../services/standings.data';

//services
import {ProfileHeaderService} from '../../services/profile-header.service';
import {DailyUpdateService} from "../../services/daily-update.service";
// import {DykService} from '../../services/dyk.service';
// import {FaqService} from '../../services/faq.service';
// import {BoxScoresService} from '../../services/box-scores.service';
// import {TwitterService} from '../../services/twitter.service';
// import {SeasonStatsService} from '../../services/season-stats.service';
// import {ComparisonStatsService} from '../../services/comparison-stats.service';
// import {StandingsService} from '../../services/standings.service';
// import {NewsService} from '../../services/news.service';
// import {SchedulesService} from '../../services/schedules.service';
// import {ImagesService} from "../../services/carousel.service";
// import {ListOfListsService} from "../../services/list-of-lists.service";
// import {FantasyService} from "../../services/fantasy.service";

//global functions
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
// import {SeoService} from "../../seo.service";

declare var moment;
declare var jQuery: any; //used for scroll event

@Component({
  selector: 'Player-page',
  templateUrl: './app/webpages/player-page/player.page.html',
})

export class PlayerPage{
  private paramsub: any;
  private scope: any;
  private dateParam: any;

  private profileName: any;
  private playerID: any;
  private teamID: any;
  private teamName: any;

  private profileHeaderData: any;
  private dailyUpdateData: any;

  private imageConfig:any;
  private batchLoadIndex:any;
  private hasError:any;

  constructor(
    private activateRoute: ActivatedRoute,
    private _profileService: ProfileHeaderService,
    private _dailyUpdateService: DailyUpdateService
  ) {
    this.paramsub = this.activateRoute.params.subscribe(
      (param: any) => {
        this.playerID = param['playerID'];
        this.scope = param['scope'] != null ? param['scope'] : 'nfl';

        this.setupPlayerProfileData();
      }
    )
  }

  private setupPlayerProfileData() {
    this._profileService.getPlayerProfile(this.playerID).subscribe(
      data => {
        /*** About [Player Name] ***/
        // this.metaTags(data);
        // this.pageParams = data.pageParams;
        this.profileName = data.headerData.playerFullName;
        this.teamName = data.headerData.teamFullName;
        this.teamID = data.headerData.teamId;

        this.profileHeaderData = this._profileService.convertToPlayerProfileHeader(data);
        this.dailyUpdateModule(this.playerID);

        //get current date for box-scores
        var currentUnixDate = new Date().getTime();
        this.dateParam = {
          profile: 'player',
          teamId: this.teamID, // teamId if it exists
          date: moment.tz(currentUnixDate, 'America/New_York').format('YYYY-MM-DD')
          // date: '2015-09-11'
        };

      },
      err => {
        this.hasError = true;
        console.log("Error getting player profile data for " + this.playerID + ": " + err);
      }
    );
  }

  ngOnDestroy() {
  }

  private dailyUpdateModule(playerId: number) {
    this.imageConfig = this._dailyUpdateService.getImageConfig();
    this._dailyUpdateService.getPlayerDailyUpdate(playerId)
      .subscribe(data => {
        this.dailyUpdateData = data;
      },
      err => {
        this.dailyUpdateData = this._dailyUpdateService.getErrorData();
        console.log("Error getting daily update data", err);
      });
  }

  // function to lazy load page sections
  private onScroll(event) {
    this.batchLoadIndex = GlobalFunctions.lazyLoadOnScroll(event, this.batchLoadIndex);
    return;
  }
}
