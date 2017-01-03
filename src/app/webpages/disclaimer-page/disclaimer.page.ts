import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Injector } from '@angular/core';

import { TitleInputData } from "../../fe-core/components/title/title.component";
import { GlobalSettings } from '../../global/global-settings';
import { GlobalFunctions } from '../../global/global-functions';
import { SeoService } from "../../seo.service";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

@Component({
    selector: 'Disclaimer-page',
    templateUrl: './disclaimer.page.html'
})

export class DisclaimerPage {
    public scope: string;
    public storedPartnerParam: string;

    public widgetPlace: string = "widgetForPage";
    public pageName: string;
    public pageLinkName: string;
    public contactLink: Array<any>;
    public contactUsLinkName: string;
    public titleData: TitleInputData;

    constructor(
      private _seoService: SeoService,
      public activatedRoute: ActivatedRoute
    ) {
      this.activatedRoute.params.subscribe(
        (param :any)=> {
          this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';
        }
      );
      this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
      this.loadData(this.storedPartnerParam);
      this.metaTags();
    }

    ngAfterViewInit(){}



    private metaTags() {
      //create meta description that is below 160 characters otherwise will be truncated
      let title = 'Disclaimer';
      let metaDesc = 'Disclaimer page to disclose any information';
      let image = GlobalSettings.getmainLogoUrl();
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaRobots('NOINDEX, FOLLOW');
      this._seoService.setOgTitle(title);
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl();
      this._seoService.setOgImage(image);
    } //metaTags



    loadData(partnerID:string) {
      this.pageLinkName = GlobalSettings.getHomePage(partnerID).replace(/https?:\/\//, "");

      this.pageName = partnerID != '/' ? GlobalSettings.getBasePartnerTitle() : GlobalSettings.getBaseTitle();
      this.titleData = {
          imageURL : GlobalSettings.getSiteLogoUrl(),
          text1: 'Last Updated: Friday, Oct. 28 2016.',
          text2 : ' United States',
          text3 : GlobalFunctions.convertToPossessive(this.pageName) + " Disclaimer",
          text4 : '',
          icon: 'fa fa-map-marker'
      };

      var subpath = this.activatedRoute.pathFromRoot;
      this.contactLink = [partnerID, this.scope, 'contact-us'];
      this.contactUsLinkName = this.pageLinkName + '/' + this.scope + '/contact-us';
    }
}
