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

@Component({
  selector: 'site-list-article-map',
  templateUrl: './siteMap.html'
})

export class SiteListMap {

  private partnerSite: any;
  private domainUrl:string;
  private childrenRoutes: any;
  private totalSiteMap:any = [];
  private fullRoster: Array<any>;
  // private displaySiteMap: boolean = false;
  constructor(
    private _listOfListService: ListOfListsService,
    private router:ActivatedRoute,
    private _seoService: SeoService
  ) {
    this.router.params.subscribe(
      (param: any) => {
        this.router.queryParams.subscribe(
          (queryParam: any) => {
            this.metaTags();
            this.domainUrl = VerticalGlobalFunctions.getPageUrl();
            this.partnerSite = VerticalGlobalFunctions.getWhiteLabel(); // grab partner id
            /*
            ** appRoutes[0] routes for non white labeled sites Touchdownloyal.com
            ** appRoutes[1] routes for white labeled and subdomains  football.  && mytouchdownloyal.
            */
            this.childrenRoutes = this.partnerSite == '' ? appRoutes[0] : appRoutes[1];
            this.createSiteMap(param.scope, param.profile);
          })
    })
  } //constructor

  metaTags(){
    this._seoService.removeMetaTags();
    this._seoService.setMetaRobots('NOINDEX, FOLLOW');
  } // metaTags

  createSiteMap(scope, profile){
    let self = this;
    let route = [];
    this.addListPage(scope, profile);
  }

  addListPage(scope, profile){
    let self = this;
    //scope, profile, position
    let positions = VerticalGlobalFunctions.getMVPdropdown(scope);
    positions.forEach(function(position){
      self._listOfListService.getSiteListMap(scope, profile, position.key.toUpperCase())
      .subscribe(data => {
        try{
          let listInfo = data.data;
          let listData = data.data.listData;
          listData.forEach(function(list){
            list.listInfo.seasons.forEach(function(season){
              let ordering = list.listInfo.ordering;
              let listRoute = [self.partnerSite + '/' + listInfo.affiliation + '/list', list.listInfo.rankType, list.listInfo.statType, season, list.listInfo.ordering];
              let relPath = listRoute.join('/').toString();
              let sitePath = SiteMap.createSiteKey(listRoute, relPath);
              self.totalSiteMap.push(sitePath);
            })//end of season
          })// end of data.data

        }catch(e){
          console.warn('Error siteMap failure @ addListPage', e)
        }
      })
    })
  }
}
