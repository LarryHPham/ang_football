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
import { DeepDiveService } from "../services/deep-dive.service";

@Component({
  selector: 'site-video-article-map',
  templateUrl: './siteMap.html'
})

export class SiteVideoArticleMap {

  private partnerSite: any;
  private domainUrl:string;
  private childrenRoutes: any;
  private totalSiteMap:any = [];
  private fullRoster: Array<any>;
  // private displaySiteMap: boolean = false;
  constructor(
    private _deepDiveService: DeepDiveService,
    private router:ActivatedRoute,
    private _seoService: SeoService,
  ) {
    this.router.params.subscribe(
      (param: any) => {
        this.metaTags();
        this.domainUrl = VerticalGlobalFunctions.getPageUrl();
        this.partnerSite = VerticalGlobalFunctions.getWhiteLabel(); // grab partner id
        /*
        ** appRoutes[0] routes for non white labeled sites Touchdownloyal.com
        ** appRoutes[1] routes for white labeled and subdomains  football.  && mytouchdownloyal.
        */
        this.childrenRoutes = this.partnerSite == '' ? appRoutes[0] : appRoutes[1];
        this.createSiteMap(param.scope, param.pageNumber);
    })
  } //constructor

  private metaTags(){
    this._seoService.removeMetaTags();
    this._seoService.setMetaRobots('NOINDEX, FOLLOW');
  } // metaTags

  createSiteMap(scope, page){
    let self = this;
    let route = [];
    this.addAiArticlePage(scope, page);
  }

  addAiArticlePage(scope, page){
    let articleCount = GlobalSettings.siteMapArticleCount;
    let self = this;
    //scope, limit, startNum, state?
    this._deepDiveService.getSiteMapVideoDeepDive(scope, articleCount, page)
    .subscribe(data => {
      try{
        //(scope: string, eventType: string, eventID: string)
        data.videos.forEach(function(article){
          let duplicate = self.totalSiteMap.length > 0 ? self.totalSiteMap.filter(value => value.uniqueId === article.id).length > 0 : false;
          if( (article.league == 'nfl' || article.league == 'ncaaf') && !duplicate ){
            if(article.id){
              let scope = article.league == 'fbs' ? 'ncaaf' : article.league;
              let articleRoute = VerticalGlobalFunctions.formatArticleRoute(scope, 'video', article.id);
              let relPath = articleRoute.join('/').toString();
              let sitePath = SiteMap.createSiteKey(articleRoute, relPath, article.id);
              self.totalSiteMap.push(sitePath);
            }
          }
        })
      }catch(e){
        console.warn('Error siteMap failure @ addAiArticlePage', e)
      }
    })
  }
}
