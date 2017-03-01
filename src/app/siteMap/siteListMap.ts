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
    private _seoService: SeoService,
  ) {
    this.router.params.subscribe(
      (param: any) => {
        this.router.queryParams.subscribe(
          (queryParam: any) => {
            console.log(param);
            console.log(queryParam);
            this.metaTags();
            this.domainUrl = VerticalGlobalFunctions.getPageUrl();
            this.partnerSite = VerticalGlobalFunctions.getWhiteLabel(); // grab partner id
            /*
            ** appRoutes[0] routes for non white labeled sites Touchdownloyal.com
            ** appRoutes[1] routes for white labeled and subdomains  football.  && mytouchdownloyal.
            */
            this.childrenRoutes = this.partnerSite == '' ? appRoutes[0] : appRoutes[1];
            this.createSiteMap(param.scope, param.profile, param.pageNumber, queryParam.id);
          })
    })
  } //constructor

  metaTags(){
    this._seoService.removeMetaTags();
    this._seoService.setMetaRobots('NOINDEX, FOLLOW');
  } // metaTags

  createSiteMap(scope, profile, page, id?){
    let self = this;
    let route = [];
    this.addListPage(scope, profile, page, id);
  }

  addListPage(scope, profile, page, id?){
    let articleCount = GlobalSettings.siteMapArticleCount;
    let self = this;
    //scope, target, count, pageNumber, id?
    this._listOfListService.getSiteListMap(scope, profile, articleCount, page, id)
    .subscribe(data => {
      try{
        data.data.forEach(function(list){
          list.listInfo.seasons.forEach(function(season){
            let target = profile == 'league' ? 'team' : profile; // only two types of target list types

            //NEEDED since league sends back an single obj for targetData but player and team sends back array of objects
            let statName = profile == 'team' || profile == 'player' ? list.targetData[0]['statType'] : list.targetData['statType'];
            let listype = profile == 'team' || profile == 'player' ? list.targetData[0]['rankType'] : list.targetData['rankType'];;

            //remove text to grab actualy statName without player or team in front of stat
            if (listype == "team") {
              statName = statName.replace('team_','');
            }
            if (listype == "player") {
              statName = statName.replace('player_','');
            }
            let ordering = list.listInfo.ordering;
            let listRoute = [self.partnerSite + '/' + scope + '/list', target, statName, season, ordering];
            let relPath = listRoute.join('/').toString();
            let sitePath: siteKey = {
              path: listRoute,
              name: self.domainUrl + relPath,
              dataPoints: null,
            };
            // console.log('adding addListPage', sitePath.name);
            self.totalSiteMap.push(sitePath);
          })//end of season
        })// end of data.data

      }catch(e){
        console.warn('Error siteMap failure @ addListPage', e)
      }
    })
  }
}
