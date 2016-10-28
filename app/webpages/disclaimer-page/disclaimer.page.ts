import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Injector} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {TitleComponent} from '../../fe-core/components/title/title.component';
import {WidgetModule} from "../../fe-core/modules/widget/widget.module";
import {TitleInputData} from "../../fe-core/components/title/title.component";
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
import {SeoService} from "../../seo.service";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

@Component({
    selector: 'Disclaimer-page',
    templateUrl: './app/webpages/disclaimer-page/disclaimer.page.html',

    directives: [SidekickWrapper, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES, ResponsiveWidget],
    providers: [Title],
})

export class DisclaimerPage {
    public widgetPlace: string = "widgetForPage";
    public pageName: string;
    public pageLinkName: string;
    public contactUsLinkName: string;
    public titleData: TitleInputData;

    constructor(
      private _router:Router,
      private _title: Title,
      private _params: RouteParams,
      private _seoService: SeoService
    ) {
      //check to see if scope is correct and redirect
      VerticalGlobalFunctions.scopeRedirect(_router, _params);
      GlobalSettings.getParentParams(_router, parentParams => this.loadData(parentParams.partnerID));
    }

    ngAfterViewInit(){
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc = 'Disclaimer page to disclose any information';
      let link = window.location.href;

      this._seoService.setCanonicalLink(this._params.params, this._router);
      this._seoService.setOgTitle('Disclaimer');
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl(link);
      this._seoService.setOgImage('./app/public/mainLogo.png');
      this._seoService.setTitle('Disclaimer');
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setMetaRobots('NOINDEX, FOLLOW');
    }

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

      var subpath = this._router.generate(["Contact-us-page"]).toRootUrl();
      this.contactUsLinkName = this.pageLinkName + (subpath.charAt(0) == "/" ? "" : "/") + subpath;
    }
}
