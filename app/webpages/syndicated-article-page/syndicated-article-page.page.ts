// import {Component, AfterViewInit,Input} from '@angular/core';
// import {Location} from '@angular/common';
// import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
// import {ImagesMedia} from "../../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
// import {ShareLinksComponent} from "../../fe-core/components/articles/share-links/share-links.component";
// import {RecommendationsComponent} from "../../fe-core/components/articles/recommendations/recommendations.component";
// import {DisqusComponent} from "../../fe-core/components/articles/disqus/disqus.component";
// import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
// import {DeepDiveService} from '../../services/deep-dive.service'
// import {GlobalFunctions} from "../../global/global-functions";
// import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
// import {SidekickWrapperAI} from "../../fe-core/components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
// import {GlobalSettings} from "../../global/global-settings";
// import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';
// import {SanitizeRUrl, SanitizeHtml} from "../../fe-core/pipes/safe.pipe";
// import {GeoLocation} from "../../global/global-service";
// import {PartnerHeader} from "../../global/global-service";
// import {SeoService} from "../../seo.service";
// import {TrendingComponent} from "../../fe-core/components/articles/trending/trending.component";
// import {WidgetModule} from "../../fe-core/modules/widget/widget.module";
//
//
// declare var jQuery:any;
// declare var moment;
//
// @Component({
//     selector: 'syndicated-article-page',
//     templateUrl: './app/webpages/syndicated-article-page/syndicated-article-page.page.html',
//     directives: [
//         SidekickWrapperAI,
//         ROUTER_DIRECTIVES,
//         ImagesMedia,
//         ShareLinksComponent,
//         RecommendationsComponent,
//         DisqusComponent,
//         LoadingComponent,
//         TrendingComponent,
//         ResponsiveWidget,
//         WidgetModule
//     ],
//     providers: [DeepDiveService, GeoLocation, PartnerHeader],
//     pipes: [SanitizeRUrl, SanitizeHtml]
// })
//
// export class SyndicatedArticlePage{
//   public partnerID: string;
//   checkPartner: boolean;
//   public geoLocation:string;
//
//   public widgetPlace: string = "widgetForPage";
//   public articleData: any;
//   public recomendationData: any;
//   public eventID: string;
//   public articleType: string;
//   public imageData: Array<string>;
//   public imageTitle: Array<string>;
//   public copyright: Array<string>;
//   public scope: string;
//   public constructorControl: boolean = true;
//   private subRec;
//   rawUrl:string;
//   iframeUrl: any;
//   constructor(
//     private _params:RouteParams,
//     private _router:Router,
//     private _deepdiveservice:DeepDiveService,
//     private _geoLocation:GeoLocation,
//     private _partnerData: PartnerHeader,
//     private _seoService: SeoService
//     ){
//       //check to see if scope is correct and redirect
//       VerticalGlobalFunctions.scopeRedirect(_router, _params);
//       GlobalSettings.getParentParams(_router, parentParams => {
//         if(this.constructorControl){
//           this.eventID = this._params.get('eventID');
//           this.articleType = this._params.get('articleType');
//           this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
//
//           if (this.articleType == "story") {
//             this.getDeepDiveArticle(this.eventID);
//           }
//           else {
//             this.getDeepDiveVideo(this.eventID);
//           }
//
//           this.scope = parentParams.scope == "nfl" ? "nfl" : "ncaa";
//           if (parentParams.partnerID != null) {
//             this.partnerID = parentParams.partnerID;
//             this.getPartnerHeader();
//           }else{
//             this.getGeoLocation();
//           }
//             this.constructorControl = false;
//         }
//         this.rawUrl = window.location.href;
//       });
//     }
//
//     ngAfterViewInit(){
//       // to run the resize event on load
//       try {
//         window.dispatchEvent(new Event('load'));
//       }catch(e){
//         //to run resize event on IE
//         var resizeEvent = document.createEvent('UIEvents');
//         resizeEvent.initUIEvent('load', true, false, window, 0);
//         window.dispatchEvent(resizeEvent);
//       }
//     }
//
//     private getDeepDiveArticle(articleID) {
//       this._deepdiveservice.getDeepDiveArticleService(articleID).subscribe(
//         data => {
//
//           if (data.data.imagePath == null || data.data.imagePath == undefined || data.data.imagePath == "") {
//             this.imageData  = ["/app/public/stockphoto_bb_1.jpg", "/app/public/stockphoto_bb_2.jpg"];
//             this.copyright = ["USA Today Sports Images", "USA Today Sports Images"];
//             this.imageTitle = ["", ""];
//           }
//           else {
//             this.imageData = [GlobalSettings.getImageUrl(data.data.imagePath)];
//             this.copyright = ["USA Today Sports Images"];
//             this.imageTitle = [""];
//           }
//           this.metaTags(data);
//           this.articleData = data.data;
//           this.articleData.publishedDate = GlobalFunctions.sntGlobalDateFormatting(moment.unix(this.articleData.publishedDate/1000),"timeZone");
//         }
//       )
//     }
//     private getDeepDiveVideo(articleID){
//       this._deepdiveservice.getDeepDiveVideoService(articleID).subscribe(
//         data => {
//           this.articleData = data.data;
//           this.metaTags(data);
//             this.iframeUrl = this.articleData.videoLink;
//         }
//       )
//     }
//
//     private metaTags(data){
//       //create meta description that is below 160 characters otherwise will be truncated
//       let metaDesc;
//       if(data.data.teaser != null){
//         metaDesc = data.data.teaser;
//       }else{
//         metaDesc = data.data.description;
//       }
//
//       let link = window.location.href;
//       let image;
//       if(this.imageData != null){
//         image = this.imageData[0];
//       }else{
//         image = data.data.thumbnail;
//       }
//
//       this._seoService.setCanonicalLink(this._params.params, this._router);
//       this._seoService.setOgTitle(data.data.title);
//       this._seoService.setOgDesc(metaDesc);
//       this._seoService.setOgType('Website');
//       this._seoService.setOgUrl(link);
//       this._seoService.setOgImage(image);
//       this._seoService.setTitle(data.data.title);
//       this._seoService.setMetaDescription(metaDesc);
//       this._seoService.setMetaRobots('INDEX, NOFOLLOW');
//     }
//
//     getGeoLocation() {
//         var defaultState = 'ca';
//         this._geoLocation.getGeoLocation()
//             .subscribe(
//                 geoLocationData => {
//                     this.geoLocation = geoLocationData[0].state;
//                     this.geoLocation = this.geoLocation.toLowerCase();
//                     this.callModules();
//
//                 },
//                 err => {
//                     this.geoLocation = defaultState;
//                     this.callModules();
//                 }
//             );
//     }
//     callModules(){
//         this.getRecomendationData();
//     }
//
//     getPartnerHeader(){//Since it we are receiving
//       if(this.partnerID!= null){
//         this._partnerData.getPartnerData(this.partnerID)
//         .subscribe(
//           partnerScript => {
//             //super long way from partner script to get location using geo location api
//             var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
//             state = state.toLowerCase();
//             this.geoLocation = state;
//
//             this.getRecomendationData()
//           }
//         );
//       }else{
//         this.getGeoLocation();
//       }
//     }
//
//     getRecomendationData(){
//       var startNum=Math.floor((Math.random() * 49) + 1);
//        //needed to uppoercase for ai to grab data correctly
//         this.subRec= this._deepdiveservice.getRecArticleData(this.scope, this.geoLocation,startNum, 3)
//           .subscribe(data => {
//             this.recomendationData = this._deepdiveservice.transformToRecArticles(data);
//           });
//     }
//     ngOnDestroy(){
//         this.subRec.unsubscribe();
//     }
//
//     formatDate(date) {
//         return GlobalFunctions.sntGlobalDateFormatting(date,"timeZone");
//     }
//
// }
