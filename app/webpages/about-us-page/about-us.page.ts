import {Component, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {TitleComponent} from '../../fe-core/components/title/title.component';
import {WidgetModule} from "../../fe-core/modules/widget/widget.module";

import {AboutUsService} from '../../services/about-us.service';
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {TitleInputData} from "../../fe-core/components/title/title.component";
import {CircleImage} from "../../fe-core/components/images/circle-image";
import {CircleImageData} from "../../fe-core/components/images/image-data";
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
import {SeoService} from "../../seo.service";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

export interface AuBlockData {
  iconClass?: string;
  link?: {
    imageConfig: CircleImageData;
    route: Array<any>;
  }
  titleText:string;
  dataText:string;
}

export interface AboutUsModel {
    blocks: Array<AuBlockData>;
    headerTitle: string;
    titleData: TitleInputData;
    content: Array<string>;
}

@Component({
    selector: 'About-us-page',
    templateUrl: './app/webpages/about-us-page/about-us.page.html',
    directives: [SidekickWrapper, CircleImage, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES, ResponsiveWidget],
    providers: [AboutUsService, Title],
})

export class AboutUsPage {
    public widgetPlace: string = "widgetForPage";
    public auHeaderTitle: string = "What is the site about?";

    public auBlocks: Array<AuBlockData> = [];

    public auContent: Array<string> = [];

    public content: string;

    public titleData: TitleInputData = {
        imageURL : GlobalSettings.getSiteLogoUrl(),
        text1: 'Last Updated: [date]',
        text2: 'United States',
        text3: 'Want to learn more?',
        text4: '',
        icon: 'fa fa-map-marker'
    }

    public divisionID: string;
    public activeDivision: string;
    public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
    public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();

    constructor(
      private _router:Router,
      private _service: AboutUsService,
      private _seoService: SeoService,
      private _params: RouteParams
    ) {
      //check to see if scope is correct and redirect
      VerticalGlobalFunctions.scopeRedirect(_router, _params);
        GlobalSettings.getParentParams(_router, parentParams =>{
          this.loadData(parentParams.partnerID, parentParams.scope)
        });
    }

    ngAfterViewInit(){
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc = 'About Us, learn about football, NFL, NCAAF players and team';
      let link = window.location.href;
      this._seoService.setCanonicalLink(this._params.params, this._router);
      this._seoService.setOgTitle('About Us');
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('image');
      this._seoService.setOgUrl(link);
      this._seoService.setOgImage('./app/public/mainLogo.png');
      this._seoService.setTitle('About Us');
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setMetaRobots('INDEX, FOLLOW');
    }
    loadData(partnerID?:string, scope?:string) {
        this._service.getData(partnerID, scope).subscribe(
          data => this.setupAboutUsData(data),
          err => {
            console.log("Error getting About Us data: " + err);
          }
        );
    }

    setupAboutUsData(data:AboutUsModel) {
      if ( data !== undefined && data !== null ) {
        this.auBlocks = data.blocks;
        this.auHeaderTitle = data.headerTitle;
        this.titleData = data.titleData;
        this.auContent = data.content;
      }
    }
}
