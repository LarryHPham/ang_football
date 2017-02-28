import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from '../router/app.routing';
import { isNode, isBrowser } from "angular2-universal";

//globals
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";

import { SeoService } from "../seo.service";
import { siteKey } from "../siteMap/siteMap";

//services
import { RosterService } from '../services/roster.service';

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

  private metaTags(){
    this._seoService.removeMetaTags();
    this._seoService.setMetaRobots('NOINDEX, FOLLOW');
  } // metaTags

  createSiteMap(scope, teamId){
    let self = this;
    let route = [];
    this.addPlayerPages(scope, teamId);
  }

  //add player pages by using pick a team roster page api call
  //directory page requires multiple pages with letters so too many api calls to use
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
            let pathData: siteKey = {
              path: playerRoute,
              name: self.domainUrl + relPath,
              dataPoints: null,
            }
            // let playerPath = '/sitemap/player/' + player.playerId;
            // let sitePath: siteKey = {
            //   path: [playerPath],
            //   name: self.domainUrl + playerPath,
            //   dataPoints: null,
            // }
            // console.log('adding playerPage', pathData.name);
            self.totalSiteMap.push(pathData);
            // self.totalSiteMap.push(sitePath);

          })
        }
      }catch(e){
        console.warn('Error siteMap failure @ addPlayerPages', e)
      }

    })
  }
}
