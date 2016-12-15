import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TitleInputData } from "../../fe-core/components/title/title.component";
import { GlobalSettings } from '../../global/global-settings';
import { GlobalFunctions } from '../../global/global-functions';
// import { SeoService } from "../../seo.service";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

@Component({
    selector: 'Disclaimer-page',
    templateUrl: './disclaimer.page.html',
})

export class DisclaimerPage {
    public widgetPlace: string = "widgetForPage";
    public pageName: string;
    public pageLinkName: string;
    public contactUsLinkName: string;
    public titleData: any;

    constructor(
      private _title: Title,
      // private _seoService: SeoService,
      public activatedRoute: ActivatedRoute,
      @Inject('req') req: any
    ) {
      //check to see if scope is correct and redirect
      // VerticalGlobalFunctions.scopeRedirect(_router, _params);
      // GlobalSettings.getParentParams(_router, parentParams => this.loadData(parentParams.partnerID));
      this.metaTags();
    }

    ngAfterViewInit(){}



    private metaTags() {
      //create meta description that is below 160 characters otherwise will be truncated
      // let metaDesc = 'Disclaimer page to disclose any information';
      // let link = window.location.href;
      // this._seoService.setCanonicalLink();
      // this._seoService.setOgTitle('Disclaimer');
      // this._seoService.setOgDesc(metaDesc);
      // this._seoService.setOgType('Website');
      // this._seoService.setOgUrl();
      // this._seoService.setOgImage('./app/public/mainLogo.png');
      // this._seoService.setTitle('Disclaimer');
      // this._seoService.setMetaDescription(metaDesc);
      // this._seoService.setMetaRobots('NOINDEX, FOLLOW');
    } //metaTags



    loadData(partnerID:string) {
      this.pageLinkName = GlobalSettings.getHomePage(partnerID).replace(/https?:\/\//, "");

      this.pageName = partnerID ? GlobalSettings.getBasePartnerTitle() : GlobalSettings.getBaseTitle();
      this.titleData = {
          imageURL : GlobalSettings.getSiteLogoUrl(),
          text1: 'Last Updated: Friday, Oct. 28 2016.',
          text2 : ' United States',
          text3 : GlobalFunctions.convertToPossessive(this.pageName) + " Disclaimer",
          text4 : '',
          icon: 'fa fa-map-marker'
      };

      // var subpath = this.activatedRoute.pathFromRoot;
      // this.contactUsLinkName = this.pageLinkName + (subpath.charAt(0) == "/" ? "" : "/") + subpath;
    }
}
