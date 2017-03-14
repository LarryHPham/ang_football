import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from '../router/app.routing';
import { isNode, isBrowser } from "angular2-universal";

//globals
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";

import { SeoService } from "../seo.service";
import { SiteMap, siteKey } from "../siteMap/siteMap";

//services
import { RosterService } from '../services/roster.service';
import { ListOfListsService } from "../services/list-of-lists.service";
import { ProfileHeaderService } from '../services/profile-header.service';

@Component({
  selector: 'site-team-map',
  templateUrl: './siteMap.html'
})

export class SiteTeamMap {

  private partnerSite: any;
  private domainUrl:string;
  private childrenRoutes: any;
  private totalSiteMap:any = [];
  private fullRoster: Array<any>;
  // private displaySiteMap: boolean = false;
  constructor(
    private router:ActivatedRoute,
    private _rosterService: RosterService,
    private _seoService: SeoService,
    private _listOfListService: ListOfListsService,
    private _profileService: ProfileHeaderService,
  ) {
    this.router.params.subscribe(
      (param: any) => {
        this.domainUrl = VerticalGlobalFunctions.getPageUrl();
        this.partnerSite = VerticalGlobalFunctions.getWhiteLabel(); // grab partner id
        /*
        ** appRoutes[0] routes for non white labeled sites Touchdownloyal.com
        ** appRoutes[1] routes for white labeled and subdomains  football.  && mytouchdownloyal.
        */
        this.childrenRoutes = this.partnerSite == '' ? appRoutes[0] : appRoutes[1];
        this.metaTags();
        this.createSiteMap(param.scope, param.teamId);
    })
  } //constructor

  metaTags(){
    this._seoService.removeMetaTags();
    this._seoService.setMetaRobots('NOINDEX, FOLLOW');
  } // metaTags

  createSiteMap(scope, teamId){
    let self = this;
    let route = [];
    this.addPlayerPages(scope, teamId);
    this.addTeamModulePages(scope, teamId);
  }

  addTeamModulePages(scope, id){
    try{
      this._profileService.getTeamProfile(id)
      .subscribe(data => {
        let headerData = data.headerData;
        let teamNameRoute = GlobalFunctions.toLowerKebab(data.profileName);
        let seasonsAmount = 4;

        //create links for all schedules tabs
        //schedules -> pregame, postgame
        for(var i = 0; i < seasonsAmount; i++){
          let schedulesTabs = ['pregame','postgame'];
          let season = Number(headerData.seasonBase) - i;
          for( var s = 0 ; s < 2; s++){
            let scheduleRoute = [this.partnerSite + '/' + scope + '/schedules/'+ teamNameRoute, id, season, schedulesTabs[s], 1];
            let scheduleRelPath = scheduleRoute.join('/').toString();
            let scheduleMap = SiteMap.createSiteKey(scheduleRoute, scheduleRelPath);
            this.totalSiteMap.push(scheduleMap);
          }// end of schedule for loops
        }//end of for loops seasons

        //standings
        let standingsRoute = [this.partnerSite + '/' + scope + '/standings/team/'+ teamNameRoute];
        let standingsRelPath = standingsRoute.join('/').toString();
        let standingsMap = SiteMap.createSiteKey(standingsRoute, standingsRelPath);
        this.totalSiteMap.push(standingsMap);

        //transaction
        // create links for all tabs
        let transactionTabs = ['Transaction', 'Suspensions', 'Injuries'];
        for(var t = 0 ; t < 3; t++){
          let transactionRoute = [this.partnerSite + '/' + scope + '/'+transactionTabs[t]+'/'+ teamNameRoute, id, 20, 1];
          let transactionRelPath = transactionRoute.join('/').toString();
          let transactionMap = SiteMap.createSiteKey(transactionRoute, transactionRelPath);
          this.totalSiteMap.push(transactionMap);
        }

        //roster
        let rosterRoute = [this.partnerSite + '/' + scope + '/team-roster/'+ teamNameRoute, id];
        let rosterRelPath = rosterRoute.join('/').toString();
        let rosterMap = SiteMap.createSiteKey(rosterRoute, rosterRelPath);
        this.totalSiteMap.push(rosterMap);

        //draft history
        let draftRoute = [this.partnerSite + '/' + scope + '/draft-history/'+ teamNameRoute, id];
        let draftRelPath = draftRoute.join('/').toString();
        let draftMap = SiteMap.createSiteKey(draftRoute, draftRelPath);
        this.totalSiteMap.push(draftMap);

        //playerStats
        // nfl/player-stats/new-england-patriots/138
        let playerStatsRoute = [this.partnerSite + '/' + scope + '/player-stats/' + teamNameRoute, id];
        let playerStatsRelPath = playerStatsRoute.join('/').toString();
        let playerStatsMap = SiteMap.createSiteKey(playerStatsRoute, playerStatsRelPath);
        this.totalSiteMap.push(playerStatsMap);

      });
    }catch(e){
      console.log('No Player Module Data');
    }
  }

  addPlayerPages(scope, teamId){
    let self = this;
    let baseRoute = [this.partnerSite + '/' + scope];
    this._rosterService.getTeamRosterData(teamId)
    .subscribe(data => {
      try{
        let fullRoster = [];
        for(var pos in data){
          data[pos].forEach(function(player){
            fullRoster.push(player);
            let teamName = player.teamMarket + ' ' + player.teamName;
            let playerName = player.playerFirstName + ' ' + player.playerLastName;
            //[scope: string, teamName: string, playerFullName:string, playerId: string]
            let playerRoute = VerticalGlobalFunctions.formatPlayerRoute(scope, teamName, playerName, player.playerId);
            let relPath = playerRoute.join('/').toString();
            let pathData = SiteMap.createSiteKey(playerRoute, relPath);
            let playerPath = '/sitemap/' + scope + '/player/' + player.playerId;
            let sitePath = SiteMap.createSiteKey([playerPath], playerPath);
            self.totalSiteMap.push(pathData);
            self.totalSiteMap.push(sitePath);

          })
        }
      }catch(e){
        console.warn('Error siteMap failure @ addPlayerPages', e)
      }
    })
  }

}
