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
import { ArticleDataService } from "../services/article-page-service";

@Component({
  selector: 'site-article-map',
  templateUrl: './siteMap.html'
})

export class SiteArticleMap {

  private partnerSite: any;
  private domainUrl:string;
  private childrenRoutes: any;
  private totalSiteMap:any = [];
  private fullRoster: Array<any>;
  // private displaySiteMap: boolean = false;
  constructor(
    private _articleService: ArticleDataService,
    private router:ActivatedRoute,
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

        console.log(this.router);
        console.log('domainUrl',this.domainUrl);
        console.log('partnerSite',this.partnerSite);
        this.createSiteMap(param.pageNumber);
    })
  } //constructor

  createSiteMap(pageNumber){
    let self = this;
    let route = [];
    this.addAiArticlePage(pageNumber)
  }

  addAiArticlePage(page){
    let articleCount = GlobalSettings.siteMapArticleCount;
    let self = this;
    this._articleService.getAllAiArticle(articleCount, page)
    .subscribe(data => {
      try{
        console.log(data);
        //(scope: string, eventType: string, eventID: string)
        data.data.forEach(function(article){
          if(article.scope == 'nfl' || article.scope == 'ncaaf'){
            let articleRoute = VerticalGlobalFunctions.formatArticleRoute(article.scope, article.article_type, article.article_id);
            let relPath = articleRoute.join('/').toString();
            let sitePath: siteKey = {
              path: articleRoute,
              name: self.domainUrl + relPath,
              dataPoints: null,
            };
            console.log('adding addAiArticlePage', sitePath.name);
            self.totalSiteMap.push(sitePath);
          }
        })
      }catch(e){
        console.warn('Error siteMap failure @ addAiArticlePage', e)
      }
    })
  }
}
