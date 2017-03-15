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
import { ListOfListsService } from "../services/list-of-lists.service";
import { ProfileHeaderService } from '../services/profile-header.service';
import { ArticleDataService } from "../services/article-page-service";

@Component({
  selector: 'site-player-map',
  templateUrl: './siteMap.html'
})

export class SitePlayerMap {

  private partnerSite: any;
  private domainUrl:string;
  private childrenRoutes: any;
  private totalSiteMap:any = [];
  private fullRoster: Array<any>;
  // private displaySiteMap: boolean = false;
  constructor(
    private router:ActivatedRoute,
    private _seoService: SeoService,
    private _listOfListService: ListOfListsService,
    private _profileService: ProfileHeaderService,
    private _fantasyService: ArticleDataService,
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
        this.createSiteMap(param.scope, param.playerId);
    })
  } //constructor

  metaTags(){
    this._seoService.removeMetaTags();
    this._seoService.setMetaRobots('NOINDEX, FOLLOW');
  } // metaTags

  createSiteMap(scope, playerId){
    let self = this;
    let route = [];
    this.addPlayerModulePages(scope, playerId);
    this.addPlayerFantasy(scope, playerId);
  }

  addPlayerModulePages(scope, id){
    try{
      this._profileService.getPlayerProfile(id)
      .subscribe(data => {
          //SeasonStats
          let seasonStatsRoute = [this.partnerSite + '/' + scope + '/season-stats', GlobalFunctions.toLowerKebab(data.headerData.playerFullName), id];
          let seasonStatsPath = seasonStatsRoute.join('/').toString();
          let sitePath = SiteMap.createSiteKey(seasonStatsRoute, seasonStatsPath);
          this.totalSiteMap.push(sitePath);
        });
    }catch(e){
      console.log('No Player Module Data');
    }
  }

  addPlayerFantasy(scope, id){
    try{
      if(scope == 'nfl'){
        this._fantasyService.getFantasyReport(id)
        .subscribe(data => {
          if(data != null){
            let relPath = data.articleUrl.join('/').toString();
            let sitePath = SiteMap.createSiteKey(data.articleUrl, relPath);
            this.totalSiteMap.push(sitePath);
          }
        });
      }
    }catch(e){
      console.log('No Player Fantasy Data');
    }
  }
}
