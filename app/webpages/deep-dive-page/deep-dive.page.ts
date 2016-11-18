import { Component, OnInit, Input, NgZone } from '@angular/core';
import {Title} from '@angular/platform-browser';
import { DeepDiveService } from '../../services/deep-dive.service';
// import {SchedulesService} from '../../services/schedules.service';
import { PartnerHeader } from "../../global/global-service";
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { GeoLocation } from "../../global/global-service";
import { ResponsiveWidget } from '../../fe-core/components/responsive-widget/responsive-widget.component';
import { ArticleStackModule } from '../../fe-core/modules/article-stack/article-stack.module';

import { ActivatedRoute } from '@angular/router';
// import {SeoService} from '../../seo.service';
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//window declarions of global functions from library scripts
declare var moment;
// declare var jQuery: any;

@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html'
})

export class DeepDivePage{
    public widgetPlace: string = "widgetForPage";

    //page variables
    scope: string = 'nfl';
    scopeDisplayed:any;
    sidescrollScope:string;
    partnerID: string;
    partnerData:any;
    profileName:string;
    geoLocation:string;
    isPartner: string = "";

    sideScrollIcon:string;
    sideScrollData: any;
    scrollLength: number;
    ssMax:number = 9;
    callCount:number = 1;
    callLimit:number = 9;
    safeCall: boolean = true;
    //for carousel
    carouselData: any;
    videoData:any;
    toggleData:any;
    blockIndex: number = 0;
    changeScopeVar: string = "";
​    constructorControl: boolean = true;

    firstStackTop: any;
    firstStackRow: any;

    private isPartnerZone: boolean = false;
    private _routeSubscription: any;

    constructor(
      private _activatedRoute:ActivatedRoute,
      private _title: Title,
      private _deepDiveData: DeepDiveService,
      // private _schedulesService:SchedulesService,
      private _geoLocation:GeoLocation,
      private _partnerData: PartnerHeader,
      // private _seoService: SeoService,
      public ngZone:NgZone,
      // private _params:RouteParams
    ){
      this._activatedRoute.params.subscribe(
          (params:any) => {
              console.log('Partner:',params);
              this.scope = params.scope;
              this.toggleData = this.scope == 'home' ? [this.getToggleInfo()] : null;
              // GlobalSettings.storePartnerId(params.partner_id);
              this.getGeoLocation();
          }
      );
      //check to see if scope is correct and redirect
      // VerticalGlobalFunctions.scopeRedirect(_router, _params);
      // needs to get Geolocation first
      // this._routeSubscription = GlobalSettings.getParentParams(this._router, parentParams => {
      //   if(this.constructorControl){
      //     this.partnerID = parentParams.partnerID;
      //     this.scope = parentParams.scope;
      //     this.scopeNameDisplay(this.scope);
      //     this.changeScopeVar = this.scope;
      //     this.profileName = this.scope == 'fbs'? 'NCAAF':this.scope.toUpperCase();
      //     var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
      //     if (window.location.pathname == "/" + GlobalSettings.getHomeInfo().partnerName && GlobalSettings.getHomeInfo().isPartner && !GlobalSettings.getHomeInfo().isSubdomainPartner) {
      //       let relPath = this.getRelativePath(this._router);
      //       //_router.navigate([relPath+'Partner-home',{scope:'nfl',partnerId:GlobalSettings.getHomeInfo().partnerName}]);
      //       window.location.pathname = "/" + GlobalSettings.getHomeInfo().partnerName + "/nfl";
      //     }
      //

      //
      //     this.isPartnerZone = partnerHome;
      //     if(this.partnerID != null && this.partnerID != 'football'){
      //       this.getPartnerHeader();
      //       this.isPartner = "partner";
      //     }else{
            // this.getGeoLocation();
      //     }
      //     this.setMetaTags()
      //     this.constructorControl = false;
      //
      //   }
      // });
    }

    ngOnDestroy(){
      this._routeSubscription.unsubscribe();
    }

    scopeNameDisplay(scope){
      scope = scope.toLowerCase();
        switch(scope){
          case 'nfl':
            this.scopeDisplayed = {
                scope:'Football',
                text: 'Upcoming NFL Games'
            };
          break;
          case 'fbs':
          case 'ncaaf':
            this.scopeDisplayed = {
                scope:'Football',
                text: 'Upcoming NCAAF Games'
            }
          break;
          case 'all':
          case 'football':
          case 'home':
            this.scopeDisplayed = {
                scope:'Football',
                text: null
            };
          break;
          default:
            this.scopeDisplayed = {
                scope:'Football',
                text: 'Upcoming NFL Games'
            }
          break;
        }
    }

    // setMetaTags(){
    //   //create meta description that is below 160 characters otherwise will be truncated
    //   let metaDesc = GlobalSettings.getPageTitle('Dive into the most recent news on Football and read the latest articles about your favorite fooball team.', 'Deep Dive');
    //   let link = window.location.href;
    //
    //   // this._seoService.setCanonicalLink(this._params.params, this._router);
    //   this._seoService.setOgTitle('Deep Dive');
    //   this._seoService.setOgDesc(metaDesc);
    //   this._seoService.setOgType('Website');
    //   this._seoService.setOgUrl(link);
    //   this._seoService.setOgImage('./app/public/mainLogo.png');
    //   this._seoService.setTitle('Deep Dive');
    //   this._seoService.setMetaDescription(metaDesc);
    //   this._seoService.setMetaRobots('Index, Follow');
    // }

    getToggleInfo(){
      let toggleData = {
        'nfl':{
          title: 'Loyal to the NFL?',
          subtext: 'Stay up to date with everything NFL.',
          scope:'NFL',
          image: VerticalGlobalFunctions.getRandomToggleCarouselImage().nfl,
          buttonClass:'carousel_toggle-button',
          buttonText: 'Visit the NFL Section',
          buttonScope: 'nfl'
        },
        'ncaaf':{
          title: 'Loyal to the NCAA?',
          subtext: 'Stay up to date with everything NCAA.',
          scope:'NCAA',
          image: VerticalGlobalFunctions.getRandomToggleCarouselImage().ncaaf,
          buttonClass:'carousel_toggle-button',
          buttonText: 'Visit the College Section',
          buttonScope: 'ncaaf'
        },
        'midImage': './app/public/icon-t-d-l.svg',
      }
      return toggleData;
    }

    // //api for Schedules
    // private getSideScroll(){
    //   let self = this;
    //   if(this.safeCall && this.scope != 'home'){
    //     this.safeCall = false;
    //     this.changeScopeVar = this.changeScopeVar.toLowerCase();
    //     let changeScope = this.changeScopeVar == 'ncaaf'?'fbs':this.changeScopeVar;
    //     this._schedulesService.setupSlideScroll(this.sideScrollData, changeScope, 'league', 'pregame', this.callLimit, this.callCount, (sideScrollData) => {
    //       if(this.sideScrollData == null){
    //         this.sideScrollData = sideScrollData;
    //       }
    //       else{
    //         sideScrollData.forEach(function(val,i){
    //           self.sideScrollData.push(val);
    //         })
    //       }
    //       this.safeCall = true;
    //       this.callCount++;
    //       this.scrollLength = this.sideScrollData.length;
    //     }, null, null)
    //   }
    // }

    changeScope($event) {
      // this.scopeNameDisplay($event);
      // var partnerHome = GlobalSettings.getHomeInfo().isPartner && !GlobalSettings.getHomeInfo().isSubdomainPartner;
      // let relPath = this.getRelativePath(this._router);
      // if(partnerHome){
      //   this._router.navigate([relPath+'Partner-home',{scope:$event.toLowerCase(),partner_id:GlobalSettings.getHomeInfo().partnerName}]);
      //   // window.location.pathname = "/" + GlobalSettings.getHomeInfo().partnerName + "/"+$event.toLowerCase();
      // }else{
      //   this._router.navigate([relPath+'Default-home',{scope:$event.toLowerCase()}]);
      //   // window.location.pathname = "/"+$event.toLowerCase();
      // }

      // if($event == this.changeScopeVar){
      //   this.getSideScroll();
      // }else{
      //   this.changeScopeVar = $event;
      //   this.callCount = 1;
      //   this.sideScrollData = null;
      //   this.getSideScroll();
      // }
    }

    private scrollCheck(event){
      let maxScroll = this.sideScrollData.length;
      if(event >= (maxScroll - this.ssMax)){
      //  this.getSideScroll();
      }
    }

    private getDeepDiveVideoBatch(){
        this._deepDiveData.getDeepDiveVideoBatchService(this.scope, '1', '1', this.geoLocation).subscribe(
          data => {
            this.videoData = this._deepDiveData.transformVideoStack(data.data);
          }
        )
      }

    private getDataCarousel() {
      this._deepDiveData.getCarouselData(this.scope, this.carouselData, '15', '1', this.geoLocation, (carData)=>{
        this.carouselData = carData;
      })
    }

    getPartnerHeader(){//Since it we are receiving
      if(this.partnerID != null){
        this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            if(partnerScript['results'] != null){
              this.partnerData = partnerScript;
              //super long way from partner script to get location using geo location api
              var state;
              if (partnerScript['results']['location']['realestate']['location']['city'][0]) {
                state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
                state = state.toLowerCase();
                this.geoLocation = state;
                this.callModules();
              }
              else {
                this.getGeoLocation();
              }
            }else{//IF BAD PARTNER ID IS INPUTED AN NO RESULTS COME BACK FROM SUBSCRIBE THEN REDIRECT TO DEFAULT 'football' partner id which will just run geo location and not grab partnerID
              // let relpath = GlobalFunctions.routerRelPath(this._router);
              // let badLinkRedirect = {
              //   partner_id: 'football',
              //   scope: 'home'
              // };
              // this._router.navigate([relpath+'Partner-home',badLinkRedirect, 'Home-page']);
            }
          }
        );
      }else{
        this.getGeoLocation();
      }
    }

    //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
    getGeoLocation() {
      var defaultState = 'ca';
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                  this.geoLocation = geoLocationData[0].state;
                  this.geoLocation = this.geoLocation.toLowerCase();
                  this.callModules();
                },
                err => {
                  this.geoLocation = defaultState;
                  this.callModules();
                }
            );
    }

    getFirstArticleStackData(){
      this._deepDiveData.getDeepDiveBatchService(this.scope, this.callLimit, 1, this.geoLocation)
          .subscribe(data => {
            this.firstStackTop = this._deepDiveData.transformToArticleStack([data[0]]);
          },
          err => {
                console.log("Error getting first article stack data");
          });
      this._deepDiveData.getDeepDiveAiBatchService(this.scope, 'postgame-report', 1, this.callLimit, this.geoLocation)
          .subscribe(data => {
            this.firstStackRow = this._deepDiveData.transformToAiArticleRow(data);
          },
          err => {
              console.log("Error getting first AI article batch data");
          });
    }

    callModules(){
      this.getDataCarousel();
      this.getDeepDiveVideoBatch();
      // this.getSideScroll();
      this.getFirstArticleStackData();
    }

    // function to lazy load page sections
    private onScroll(event) {
      this.blockIndex = GlobalFunctions.lazyLoadOnScroll(event, this.blockIndex);
      return;
    }
}
