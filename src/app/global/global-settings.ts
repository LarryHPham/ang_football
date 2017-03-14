import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctions } from './global-functions';
import { isBrowser, isNode, prebootComplete } from 'angular2-universal';
import { defaultOptions } from 'preboot';

declare var Zone;

@Injectable()

export class GlobalSettings {
    // hardCoded for ServerSide (isNode);
    private static _env = 'qa';// isNode ? 'prod' : window.location.hostname.split('.')[0];//TODO currently server side is hardcoded to make Prod calls
    public static _proto = isNode ? 'http:' : window.location.protocol;//TODO currently server side is hardcoding protocol

    private static _newsUrl:string = 'newsapi.synapsys.us';
    private static _partnerId:string;

    private static _apiUrl:string = '-touchdownloyal-api.synapsys.us';
    private static _articleDataUrl:string = "-touchdownloyal-ai.synapsys.us/";
    private static _tcxArticleUrl:string = '-article-library.synapsys.us/';

    private static _partnerApiUrl: string = 'synapview.synapsys.us/synapview/?action=get_header_data&vertical=sports&domain=';
    private static _widgetUrl: string = 'w1.synapsys.us';
    private static _geoUrl: string = 'waldo.synapsys.us';

    private static _dynamicApiUrl: string = 'dw.synapsys.us/list_creator_api.php';

    public static _imageUrl:string = 'images.synapsys.us';
    private static _homepageUrl:string = '.touchdownloyal.com';
    private static _homepageLinkName:string = 'touchdownloyal';
    private static _partnerHomepageUrl:string = '.mytouchdownzone.com';
    private static _partnerHomepageLinkName:string = 'mytouchdownzone';

    //links from our share providers that do not change
    private static _siteTwitterUrl:string = '//twitter.com/home?status=';
    private static _siteFacebookUrl:string = '//www.facebook.com/sharer/sharer.php?u=';
    private static _siteLinkedinUrl:string = '//www.linkedin.com/shareArticle?mini=true&url=&title=&summary=&source=';
    private static _siteGoogleUrl:string = '//plus.google.com/share?url=';
    private static _verticalFacebook: string = '//www.facebook.com/TCX-382018522187919';
    private static _verticalTwitter: string = '//twitter.com/tcxmedia';

    private static _baseTitle: string = "Touchdown Loyal";
    private static _basePartnerTitle: string = "My Touchdown Zone";
    private static _sportName: string ="football";

    private static _sportLeagueAbbrv: string ="NFL";
    private static _sportLeagueFull: string ="National Football League";
    private static _sportLeagueChampionship: string = "Superbowl";
    private static _sportLeagueSegments: string = "Divisions";

    private static _collegeDivisionAbbrv: string="FBS";
    private static _collegeDivisionFullAbbrv: string="NCAAF";
    private static _collegeLeagueFull: string ="National Collegiate Athletic Association Football";
    private static _collegeDivisionChampionship: string = "National Championships";
    private static _collegeDivisionSegments: string = "Conferences";

    private static _estYear: string = " 2016";
    private static _copyrightInfo: string = "USA Today Sports Images";

    private static _mainLogo: string = "/app/public/mainLogo.jpg";
    public static _mainPageUrl: string = "touchdownloyal.com";
    public static mainIcon : string = GlobalSettings.getImageUrl("/01/logos/football/2017/01/logos_football_01.svg", 85);
    public static fallBackIcon : string = GlobalSettings.getImageUrl("/01/logos/football/2017/02/logos_football_01.png", 85);
    public static _defaultStockImage: string = GlobalSettings.getImageUrl("/TDL/stock_images/TDL_Stock-3.png");// default stock image on the server for FOOTBALL

    private static _currentRouteParams: any;
    private static _router: any;

    private static prebootFired:boolean = false;

    static siteMapArticleCount: number = 500;

    static _imgSmLogo: number = 45;
    static _imgMdLogo: number = 70;
    static _imgLgLogo: number = 150;
    static _imgPickTeam: number = 100;
    static _imgProfileLogo: number = 125;
    static _imgAiBoxScore: number = 130;
    static _imgTrending: number = 615;
    static _imgRecommend: number = 750;
    static _deepDiveSm: number = 85;
    static _deepDiveRec: number = 360;
    static _deepDiveTileStack: number = 365;
    static _deepDiveBoxScore: number = 600;
    static _deepDiveMd: number = 750;
    static _deepDiveLg: number = 935;
    static _imgPageLogo: number = 85;
    static _carouselImg: number = 1240;

    static getEnv(env:string):string {
      if (env == "localhost"){
          env = "dev";
      }
      if (env != "dev" && env !="qa"){
          env = "prod";
      }

      //env = "prod"; //TODO remove only used for testing

      return env;
    }

    static isProd():boolean {
      if( this.getEnv(this._env) == "prod" ){
        return true;
      }else{
        return false;
      }
    }

    static synapsysENV(env:string):string {
      if (env == "localhost" || env == 'dev' || env == 'qa'){//remove qa when we have qa env setup
          env = "dev-";
      }else{
        env = '';
      }
      return env;
    }

    static storePartnerId(partnerId) {
      this._partnerId = partnerId;
    }

    static getDynamicWidet():string {
        return this._proto + "//" + this._dynamicApiUrl;
    }

    static getApiUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._apiUrl;
    }

    static getPartnerApiUrl(partnerID):string {
      return this._proto + "//"+ this.synapsysENV(this._env) + this._partnerApiUrl + partnerID;
    }

    static getGeoLocation():string {
      return this._proto + "//" + this.synapsysENV(this._env) + this._geoUrl;
    }

    static widgetUrl():string {
        return this._proto + "//" + this._widgetUrl;
    }

    static getmainLogoUrl(): string{
        return this._proto + "//" + this._mainPageUrl + this._mainLogo;
    }

    static resizeImage(width:number){
        var resizePath;
        width = width > 1920 ? 1920 : width;//width limit to 1920 if larger
        if (isBrowser) {
          let r = window.devicePixelRatio;
          width = width * r;
        }
        resizePath = "?width=" + width;
        if (width < 100) {//increase quality if smaller than 100, default is set to 70
          resizePath += "&quality=90";
        }
        return resizePath;
    }

    //include bypass parameter if you want the image to be served on server side (meta tag images)
    static getImageUrl(relativePath, width:number=1920):string {
      var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + this._imageUrl + relativePath: GlobalSettings.fallBackIcon;
      if (relativePath != null && relativePath != "") {
        relPath += this.resizeImage(width);
      }
      return relPath;
    }

    static getBackgroundImageUrl(relativePath):string {
        var relPath = relativePath != null ? this._proto + "//" + this._imageUrl + relativePath: './app/public/drk-linen.png';
        return relPath;
    }

    static getArticleUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._tcxArticleUrl;
    }

    static getArticleDataUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleDataUrl;
    }

    static getNewsUrl():string {
        return this._proto + "//" + this._newsUrl;
    }

    static getHomePageLinkName() {
      return this._homepageLinkName;
    }

    static getPartnerHomePageLinkName() {
      return this._partnerHomepageLinkName;
    }

    static setRouter(router){
      this._router = router;
    }

    static storedPartnerId(partnerId?) {
      if(partnerId != null && this._partnerId == null){
        this._partnerId = partnerId;
      }
      return this._partnerId;
    }

    static getHomePage(partnerId: string, includePartnerId?: boolean) {
      var linkEnv = this._env != 'localhost' && this._env != "touchdownloyal" && this._env != "mytouchdownzone" && this._env != "football" ? this._env:'www';
        if ( partnerId ) {
            return this._proto + "//" + linkEnv + this._partnerHomepageUrl + (partnerId || includePartnerId ? "/" + partnerId : "");
        }
        else {
            return this._proto + "//" + linkEnv + this._homepageUrl;
        }
    }

    static getHomeInfo(){
      //grabs the domain name of the site and sees if it is our partner page
      var partner = false;
      var isHome = false;
      var hide = false;
      var hostname = isNode ? GlobalSettings._proto + "//" + Zone.current.get('originUrl') : window.location.hostname;
      var partnerPage = /mytouchdownzone/.test(hostname) || /^football\./.test(hostname);
      var name = isNode ? Zone.current.get('requestUrl') : window.location.pathname.split('/')[1];
      var isSubdomainPartner = /^football\./.test(hostname);
      //PLEASE REVISIT and change
      if(partnerPage && (name == '' || name == 'deep-dive')){
        hide = false;
        isHome = true;
      }else if(!partnerPage && (name == '' || name == 'deep-dive')){
        hide = false;
        isHome = true;
      }else{
        hide = false;
        isHome = false;
      }

      if(partnerPage){
        partner = partnerPage;
      }
      return {
        isPartner: partner,
        hide:hide,
        isHome:isHome,
        partnerName: name,
        isSubdomainPartner: isSubdomainPartner
      };
    }

    static getSiteLogoUrl():string {
        return "app/public/mainLogo.jpg";
    }

    static getScopeNow() {
      var url = isNode ? Zone.current.get('requestUrl') : window.location.pathname;
      // var url = window.top.location.pathname; //TODO
      var scope = this._sportLeagueAbbrv;
      var majorLeague = this._sportLeagueAbbrv.toLowerCase();
      var minorLeagueFull = this._collegeDivisionFullAbbrv.toLowerCase();
      var minorLeague = this._collegeDivisionAbbrv.toLowerCase();
      if (url.includes(majorLeague)) {
        scope = majorLeague;
      }
      else if (url.includes(minorLeagueFull) || url.includes(minorLeague)) {
        scope = minorLeagueFull;
      }
      return scope;
    }


    //converts URL route scope from NCAAF to FBS
    //NCAAF is for display purpose and returning FBS is for API requirements
    //lowercase is for common practice
    static getScope(scope?) {
      switch(scope) {
        case ( this.getCollegeDivisionFullAbbrv().toLowerCase() ) :
        case ( this.getCollegeDivisionFullAbbrv() ) :
        return this.getCollegeDivisionAbbrv().toLowerCase();

        default:
        return scope.toLowerCase();
      }
    }

    static getPageTitle(subtitle?: string, profileName?: string) {
      if(this.getHomeInfo().isPartner){
        this._baseTitle = this._basePartnerTitle;
      }
        return this._baseTitle +
            (profileName && profileName.length > 0 ? " - " + profileName : "") +
            (subtitle && subtitle.length > 0 ? " - " + subtitle : "");
    }

    static getBaseTitle() {
      return this._baseTitle;
    }

    static getBasePartnerTitle() {
      return this._basePartnerTitle;
    }

    static getSportLeagueAbbrv() {
      return this._sportLeagueAbbrv;
    }
    static getSportLeagueFull() {
      return this._sportLeagueFull;
    }
    static getCollegeLeagueFull() {
      return this._collegeLeagueFull;
    }
    static getSportLeagueChampionship() {
      return this._sportLeagueChampionship;
    }
    static getSportLeagueSegments() {
      return this._sportLeagueSegments;
    }

    static getCollegeDivisionAbbrv() {
      return this._collegeDivisionAbbrv;
    }
    static getCollegeDivisionFullAbbrv() {
      return this._collegeDivisionFullAbbrv;
    }
    static getCollegeDivisionChampionship() {
      return this._collegeDivisionChampionship;
    }
    static getCollegeDivisionSegments() {
      return this._collegeDivisionSegments;
    }
    static getCopyrightInfo() {
        return this._copyrightInfo;
    }
    static getVerticalFB() {
        return this._verticalFacebook;
    }
    static getVerticalTwitter() {
        return this._verticalTwitter;
    }
    static getSiteTwitterUrl(shareUrl: string) {
      return this._siteTwitterUrl + shareUrl;
    }
    static getSiteFacebookUrl(shareUrl: string) {
      return this._siteFacebookUrl + shareUrl;
    }
    static getLinkedInUrl(shareUrl: string) {
      return this._siteLinkedinUrl + shareUrl;
	  }
    static getSiteGoogleUrl(shareUrl: string) {
      return this._siteGoogleUrl + shareUrl;
	  }
    static getSportName() {
      return this._sportName;
    }
    static getEstYear() {
      return this._estYear;
    }

    // function sets custom selectors for gap-events between SSR and CSR
    static setCustomPrebootSelectors() {
      var defaultSelectors = defaultOptions.eventSelectors; // default selectors include 'input,textarea, select, option, button'

      var customSelectors = [
        {
          selector: 'div',
          events: [ 'click' ]
        },
        {
          selector: 'span',
          events: [ 'click' ]
        },
        {
          selector: 'a',
          events: [ 'click' ]
        }
      ];
      defaultSelectors.push.apply(defaultSelectors, customSelectors);
    }

    // function is to fire preboot for angular universal, fires the transition of server-side view to client view
    static setPreboot() {
      if (isNode) {
        this.setCustomPrebootSelectors();
      }
      else if(isBrowser && !this.prebootFired) {
        setTimeout(function () {
          prebootComplete();
          this.prebootFired = true;
        }, 400);
      }
    } //setPreboot

}
