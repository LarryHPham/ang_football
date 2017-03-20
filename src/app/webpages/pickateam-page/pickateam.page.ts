import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isBrowser} from 'angular2-universal';

//globals
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from '../../global/global-functions';
import {VerticalGlobalFunctions} from '../../global/vertical-global-functions';

//services
import { SeoService } from "../../seo.service";
import {GeoLocation} from "../../global/global-service";
import {PickateamPageService} from '../../services/pickateam.service';

//interfaces
import {ImageData,CircleImageData} from '../../fe-core/components/images/image-data';
import {SearchInput} from '../../ui-modules/search/search.component';

export interface homePageData {
  imageData: CircleImageData;
  location: string;
  divisionName: string;
  teamName: string;
  geoLocation:string;
}

export interface newsCarouselData {
  newsTitle: string;
  newsSubTitle: string;
  routerInfo: Array<any>;
}

@Component({
    selector: 'pickateam-page',
    templateUrl: './pickateam.page.html',
})

export class PickTeamPage{
    public teamData: Array<homePageData>;
    public listData: Array<newsCarouselData>;
    public displayData: Object;

    public _sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
    public _sportLeagueSegments: string = GlobalSettings.getSportLeagueSegments();

    public _collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
    public _collegeDivisonFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();
    public _collegeDivisionSegments: string = GlobalSettings.getCollegeDivisionSegments();

    public activeDivision: string;
    public activeDivisionSegments: string;

    public imgHero1: string = "http://images.synapsys.us/TDL/stock_images/TDL_Stock-5.png";
    public imgIcon1: string = "/app/public/homePage_icon1.png";
    public imageTile1: string = "/app/public/iphone.png";
    public imageTile2: string = "/app/public/ipad.png";
    public imageTile3: string = "/app/public/MLB_Schedule_Image.jpg";
    public homeHeading1: string;
    public homeSubHeading1: string;
    public homeHeading2: string;
    public homeLocationHeading: string;
    public homeFeaturesTile1: string;
    public homeFeaturesTile3: string;
    public homeFeaturesTile4: string;
    public homeFeaturesButton1: string;
    public homeFeaturesButton3: string;
    public homeFeaturesButton4: string;
    public routerInfo1 = ['Standings-page'];
    public buttonFullList: string = "See The Full List";
    public teams: any;
    public counter: number = 0;
    public max:number = 3;
    public searchInput: SearchInput = {
         placeholderText: "Search for a player or team...",
         hasSuggestions: true
     };
    private isPartnerZone: boolean = false;
    public gridDivCol: string;
    public gridLMain: string;
    public gridFeaturesCol: string;
    public width: number;

    public partnerData: any;
    public partnerID: string;
    public geoLocationState:string;
    public geoLocationCity: string;

    public scope: string;

    private _routeSubscription: any;

    constructor(
      private _pickateamPageService: PickateamPageService,
      private _geoLocation:GeoLocation,
      private _activatedRoute: ActivatedRoute,
      private _router: Router,
      private _seoService: SeoService
    ) {
      this._routeSubscription = this._activatedRoute.params.subscribe(
        (param :any)=> {
        var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
        this.isPartnerZone = partnerHome;

        this.scope = param.scope;

        //check if there is a cached dataset available for geolocation
        this._geoLocation.grabLocation().subscribe( res => {
          this.setLocationHeaderString(res.state);
          this.getData(this.scope, res.state);
          //set the active league variables based on scope
          if ( this.scope == this._collegeDivisonFullAbbrv.toLowerCase() ) {
            this.activeDivision = this._collegeDivisonFullAbbrv;
            this.activeDivisionSegments = this._sportLeagueSegments;
          }
          else {
            this.activeDivision = this._sportLeagueAbbrv;
            this.activeDivisionSegments = this._collegeDivisionSegments;
          }

          this.homeHeading1 = "Stay Loyal to Your Favorite " + this.activeDivision + " Team";
          this.homeSubHeading1 = "Find the sports information you need to show your loyalty";
          this.homeHeading2 = "PICK YOUR FAVORITE <span class='text-heavy'>" + this.activeDivision + " TEAM</span>";
          this.homeFeaturesTile1 = this.activeDivision + " Standings";
          this.homeFeaturesTile3 = this.activeDivision + " Scores";
          this.homeFeaturesTile4 = this.activeDivision + " Schedules";
          this.homeFeaturesButton1 = "View " + this.activeDivision + " Standings";
          this.homeFeaturesButton3 = "View " + this.activeDivision + " Scores";
          this.homeFeaturesButton4 = "View " + this.activeDivision + " Schedules";

          this.metaTags();
        })
      });
    } //constructor



    private metaTags() {
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc = GlobalSettings.getPageTitle('Pick a team near you or search for your favorite football team or player.', 'Pick A Team');
      let title = 'Pick A Team';
      let image = GlobalSettings.getmainLogoUrl();

      let keywords = "football, pick a team";
      let link = this._seoService.getPageUrl();
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaRobots('Index, Follow');
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
          'es_page_type': 'Pick a Team page',
        },
        {
          'es_keywords': keywords,
        },
        {
          'es_image_url':image,
        }
      ])
    } //metaTags



    setLocationHeaderString(state) {
      //only set for NCAAF
      if ( this.scope.toLowerCase() == this._collegeDivisonFullAbbrv.toLowerCase() ) {
        this.homeLocationHeading = 'Showing '+this._collegeDivisonFullAbbrv+ ' Football '+ this._collegeDivisionSegments + '<span class="location-designation"> located around <i ng-reflect-class-name="fa fa-map-marker" class="fa fa-map-marker"></i> ' + '<span class="location-title">' + GlobalFunctions.fullstate(state) + '</span>';
      }
    } //setLocationHeaderString



    getData(scope, geoLocation?){
      this._pickateamPageService.getLandingPageService(scope, geoLocation)
      .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
      .subscribe(data => {
        this.teams = data.league;
      })
      var sampleImage = "./app/public/placeholder-location.jpg";
    } //getData



    ngOnDestroy(){
      this._routeSubscription.unsubscribe();
    }
}
