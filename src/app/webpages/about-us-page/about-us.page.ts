import { Component, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//globals
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";
import { GlobalSettings } from '../../global/global-settings';
import { GlobalFunctions } from '../../global/global-functions';

//services
import { SeoService } from "../../seo.service";
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
      private _activatedRoute: ActivatedRoute,
      private _router: Router,
      private _service: AboutUsService,
      private _seoService: SeoService
    ) {
      this._activatedRoute.params.subscribe(
          (param :any)=> {
            this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';
            this.storedPartnerParam = GlobalSettings.storedPartnerId();
            this.loadData(this.storedPartnerParam, this.scope)
          }
      );
    } //constructor

    ngAfterViewInit(){

    }

    private metaTags(data) {
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let title = 'About Us';
      let metaDesc = data[0];
      let image = GlobalSettings.getmainLogoUrl();
      let link = this._seoService.getPageUrl();
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaTags([
        {
          'og:title': title,
        },
        {
          'og:description': metaDesc,
        },
        {
          'og:type':'website',
        },
        {
          'og:url':link,
        },
        {
          'og:image': image,
        },
        {
          'es_page_title': title,
        },
        {
          'es_page_url': link
        },
        {
          'es_description': metaDesc,
        },
        {
          'es_page_type': 'About us page',
        },
        {
          'es_keywords': 'football, Touchdown loyal, about us'
        },
        {
          'es_image_url':image
        }
      ]);

      this._seoService.setMetaRobots('INDEX, FOLLOW');

    } //metaTags

    loadData(partnerID?:string, scope?:string) {
        this._service.getData(partnerID, scope)
        .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
        .subscribe(
          data => {
            this.setupAboutUsData(data);
          },
          err => {
            console.log("Error getting About Us data: " + err);
          },
        );
    } //loadData

    setupAboutUsData(data:AboutUsModel) {
      if ( data !== undefined && data !== null ) {
        this.auBlocks = data.blocks;
        this.auHeaderTitle = data.headerTitle;
        this.titleData = data.titleData;
        this.auContent = data.content;
      }
      this.metaTags(this.auContent);
    } //setupAboutUsData
}
