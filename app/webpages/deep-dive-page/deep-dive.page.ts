import { Component, OnInit, OnDestroy } from '@angular/core';
// import { SchedulesService } from '../../services/schedules.service';
// import { DeepDiveService } from '../../services/deep-dive.service';
import { ActivatedRoute } from '@angular/router';
// import { GlobalSettings } from "../../global/global-settings";
// import { GlobalFunctions } from "../../global/global-functions";
// import { GeoLocation } from "../../global/global-service";

// import { SectionNameData } from "../../fe-core/interfaces/deep-dive.data";

declare var moment;
declare var jQuery: any;

@Component({
    selector: "deep-dive-page",
    templateUrl: 'app/webpages/deep-dive-page/deep-dive-page.html',
})

export class DeepDivePage implements OnInit {
    scope: string;
    //side scroller
    sideScrollData: any;
    scrollLength: number = 0;

    selectedLocation: string = "san%20francisco-ca"; // default city for weather if geolocation returns nothin
    boxScoresTempVar: string = "nfl";

    tcxVars: any;

    topScope: string;
    changeScopeVar: string;

    safeCall: boolean = true;
    ssMax: number;
    callCount: number = 1;
    callLimit: number = 25;
    scopeList: Array<string>;
    currentCategory:string;
    blockIndex: number = 1;
    deepDiveType: string;
    category: string;
    //Used for route subscription and unsubscribing when view is destroyed (double check since angular2 does it for you)
    routeSubscription:any;
    // sectionName: SectionNameData;
    sectionNameIcon: string;
    sectionNameTitle: string = this.category;
    geoLocation:string;

    carouselGraph:any;
    carouselVideo:any;
    carouselData: any;

    constructor(
      // private _schedulesService:SchedulesService,
      // private _deepDiveData: DeepDiveService,
      private _activatedRoute: ActivatedRoute,
      // private _geoLocation: GeoLocation
    ) {
      // var categoryBlocks;
      // if(GlobalSettings.getHomeInfo().isHome){
      //   categoryBlocks = this.homePageBlocks;
      // }
    }

    ngOnInit(){
      console.log('test');
    }

  }
