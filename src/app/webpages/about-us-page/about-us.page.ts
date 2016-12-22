import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//globals
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";
import { GlobalSettings } from '../../global/global-settings';
import { GlobalFunctions } from '../../global/global-functions';

//services
// import { SeoService } from "../../seo.service";
import { AboutUsService } from '../../services/about-us.service';

//interfaces
import { SportPageParameters } from "../../fe-core/interfaces/global-interface";
import { CircleImageData } from "../../fe-core/components/images/image-data";
import { TitleInputData } from "../../fe-core/components/title/title.component";

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
    templateUrl: './about-us.page.html',
})

export class AboutUsPage {
    public scope: string;
    public storedPartnerParam: string;

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
      private activatedRoute: ActivatedRoute,
      private _service: AboutUsService,
      // private _seoService: SeoService
    ) {
      this.activatedRoute.params.subscribe(
          (param :any)=> {
            this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';

            this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
            this.loadData(this.storedPartnerParam, this.scope)
          }
      );
    } //constructor



    ngAfterViewInit(){
      this.metaTags();
    }



    private metaTags() {
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc = 'About Us, learn about football, NFL, NCAAF players and team';
      // this._seoService.setCanonicalLink();
      // this._seoService.setOgTitle('About Us');
      // this._seoService.setOgDesc(metaDesc);
      // this._seoService.setOgType('Website');
      // this._seoService.setOgUrl();
      // this._seoService.setOgImage('./app/public/mainLogo.png');
      // this._seoService.setTitle('About Us');
      // this._seoService.setMetaDescription(metaDesc);
      // this._seoService.setMetaRobots('INDEX, FOLLOW');
    } //metaTags



    loadData(partnerID?:string, scope?:string) {
        this._service.getData(partnerID, scope).subscribe(
          data => this.setupAboutUsData(data),
          err => {
            console.log("Error getting About Us data: " + err);
          }
        );
    } //loadData



    setupAboutUsData(data:AboutUsModel) {
      console.log(data);
      if ( data !== undefined && data !== null ) {
        this.auBlocks = data.blocks;
        this.auHeaderTitle = data.headerTitle;
        this.titleData = data.titleData;
        this.auContent = data.content;
      }
    } //setupAboutUsData
}
