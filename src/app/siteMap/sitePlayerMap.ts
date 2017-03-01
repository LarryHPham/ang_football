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
import { ListOfListsService } from "../services/list-of-lists.service";

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
    this.addListPage(scope, playerId);
  }

  addListPage(scope, id?){
    let articleCount = GlobalSettings.siteMapArticleCount;
    let self = this;
    //scope, target, count, pageNumber, id?
    this._listOfListService.getSiteListMap(scope, 'player', articleCount, 1, id)
    .subscribe(data => {
      try{
        let list = data.data[0];
        let pages = Math.ceil(list.listInfo.listCount / articleCount);
        for(var i = 1; i <= pages; i++){
          let listRoute = [self.partnerSite + '/sitemap/' + scope + '/list', 'player', i];
          let relPath = listRoute.join('/').toString();
          if(id){
            relPath += '?id='+id;
          }
          let sitePath: siteKey = {
            path: listRoute,
            name: self.domainUrl + relPath,
            dataPoints: null,
          };
          if(id){
            sitePath.query = {};
            sitePath.query.id = id;
          };
          // console.log('adding addListPage', sitePath.name);
          self.totalSiteMap.push(sitePath);
        }
      }catch(e){
        console.warn('Error siteMap failure @ addListPage', e)
      }
    })
  }

}
