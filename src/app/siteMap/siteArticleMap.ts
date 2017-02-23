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
        this.createSiteMap(param.scope);
    })
  } //constructor

  createSiteMap(scope){
    let self = this;
    let route = [];
  }

  //add player pages by using pick a team roster page api call
  //directory page requires multiple pages with letters so too many api calls to use

}
