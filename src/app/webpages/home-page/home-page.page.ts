import {Component, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//globals
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from '../../global/global-functions';
import {VerticalGlobalFunctions} from '../../global/vertical-global-functions';

//services
import { SeoService } from "../../seo.service";
import {GeoLocation} from "../../global/global-service";
import {LandingPageService} from '../../services/landing-page';

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
    selector: 'home-page',
    templateUrl: './app/webpages/home-page/home-page.page.html',
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

    public imgHero1: string = "http://images.synapsys.us/TDL/stock_images/TDL_Stock-2.png";
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
      private _landingPageService: LandingPageService,
      private _geoLocation:GeoLocation,
      private activateRoute: ActivatedRoute,
      private _seoService: SeoService
    ) {
      this._routeSubscription = this.activateRoute.params.subscribe(
        (param :any)=> {
        var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
        this.isPartnerZone = partnerHome;

        this.scope = param.scope;
        this.getGeoLocation(this.scope);

        //set the active league variables based on scope
        if ( this.scope == this._collegeDivisionAbbrv.toLowerCase() ) {
          this.activeDivision = this._collegeDivisonFullAbbrv;
          this.activeDivisionSegments = this._collegeDivisionSegments;
        }
        else {
          this.activeDivision = this._sportLeagueAbbrv;
          this.activeDivisionSegments = this._sportLeagueSegments;
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
      }); //GlobalSettings.getParentParams
    } //constructor



    private metaTags() {
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc = GlobalSettings.getPageTitle('Pick a team near you or search for your favorite football team or player.', 'Pick A Team');
      let link = window.location.href;

      this._seoService.setCanonicalLink();
      this._seoService.setOgTitle('Pick A Team');
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl();
      this._seoService.setOgImage('./app/public/mainLogo.png');
      this._seoService.setTitle('Pick A Team');
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setMetaRobots('Index, Follow');
    } //metaTags



    ngOnDestroy(){
      this._routeSubscription.unsubscribe();
    }

    left(){
      var counter = this.counter;
      counter--;

      //make a check to see if the array is below 0 change the array to the top level
      if(counter < 0){
        this.counter = (this.max - 1);
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    right(){
      var counter = this.counter;
      counter++;
      //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
      if(counter == this.max){
        this.counter = 0;
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    //this is where the angular2 decides what is the main image
    changeMain(num){
      if ( num < this.listData.length ) {
        this.displayData = this.listData[num];
      }
    }

    setLocationHeaderString(state) {
      //only set for NCAAF
      if ( this.scope == this._collegeDivisionAbbrv.toLowerCase() ) {
        this.homeLocationHeading = 'Showing '+this.activeDivision+ ' Football '+ this.activeDivisionSegments.toLowerCase() + '<span class="location-designation"> located around <i ng-reflect-class-name="fa fa-map-marker" class="fa fa-map-marker"></i> ' + '<span class="location-title">' + GlobalFunctions.fullstate(state) + '</span>';
      }
    }


    getGeoLocation(scope) {
      var defaultState = 'ca';
      this._geoLocation.grabLocation()
        .subscribe(
          res => {
            this.geoLocationState = res.state;
            this.geoLocationCity = res.city;

            this.setLocationHeaderString(this.geoLocationState);

            this.getData(scope, this.geoLocationState);
          },
          err => {
            this.geoLocationState = defaultState;
          }
      );
    } //getGeoLocation

    getData(scope, geoLocation?){
      this._landingPageService.getLandingPageService(scope, geoLocation)
        .subscribe(data => {
          this.teams = data.league;
        })
      var sampleImage = "./app/public/placeholder-location.jpg";
    } //getData
}
