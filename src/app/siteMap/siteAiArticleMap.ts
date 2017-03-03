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
import { ArticleDataService } from "../services/article-page-service";

@Component({
  selector: 'site-aiarticle-map',
  templateUrl: './siteMap.html'
})

export class SiteAiArticleMap {

  private partnerSite: any;
  private domainUrl:string;
  private childrenRoutes: any;
  private totalSiteMap:any = [];
  private fullRoster: Array<any>;
  // private displaySiteMap: boolean = false;
  constructor(
    private _articleService: ArticleDataService,
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
        this.createSiteMap(param.scope);
    })
  } //constructor

  private metaTags(){
    this._seoService.removeMetaTags();
    this._seoService.setMetaRobots('NOINDEX, FOLLOW');
  } // metaTags

  createSiteMap(scope){
    let self = this;
    let route = [];
    this.addAiArticlePage(scope);
  }

  addAiArticlePage(scope){
    let articleCount = GlobalSettings.siteMapArticleCount;
    let self = this;
    this._articleService.getArticleTotal(scope)
    .subscribe(data => {
      try{
        //(scope: string, eventType: string, eventID: string)
        data.data.forEach(function(article){
          if( article.scope == 'nfl' || article.scope == 'ncaaf' ){
            if(article.event_id){
              let articleRoute = VerticalGlobalFunctions.formatArticleRoute(article.scope, article.article_type, article.event_id);
              let relPath = articleRoute.join('/').toString();
              let sitePath = SiteMap.createSiteKey(articleRoute, relPath, article.event_id);
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
