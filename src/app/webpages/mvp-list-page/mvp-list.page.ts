import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import {Location} from '@angular/common';



//globals
import { VerticalGlobalFunctions } from '../../global/vertical-global-functions';
import { GlobalFunctions } from "../../global/global-functions";
import { GlobalSettings } from "../../global/global-settings";

//services
import { ProfileHeaderService } from '../../services/profile-header.service';
import { ListPageService } from '../../services/list-page.service';
import { SeoService } from "../../seo.service";

//interfaces
import { TitleInputData } from '../../fe-core/components/title/title.component';
import { positionMVPTabData } from '../../services/list-page.service';
import { PaginationParameters } from '../../fe-core/components/pagination-footer/pagination-footer.component';
import { MVPTabData } from '../../fe-core/components/mvp-list/mvp-list.component';
import { FooterStyle } from '../../fe-core/components/module-footer/module-footer.component';
import {isNode} from "angular2-universal";


@Component({
    selector: 'mvp-list-page',
    templateUrl: './mvp-list.page.html'
})

export class MVPListPage implements OnInit {
    @Output() tabSelectedListener = new EventEmitter();

    private paramsub: any;

    scope: string;
    tabs: Array<positionMVPTabData>;
    tabData: any;
    profileHeaderData: TitleInputData;
    paginationParameters: PaginationParameters;
    storedPartnerParam: string;
    positionParam: string;
    position: string;
    tabParam: string;
    pageNum: any;
    queryParams: any;
    isError: boolean = false;
    selectedTabTitle: string;
    globalMVPPosition: string;
    season: number;
    listMax: number = 20;
    filter1: any;
    seasonBase: string;
    selectedTabData: any;

    displayPosition: string;


    public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv().toLowerCase();
    public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
    public collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();

    private profileService: any;

    footerStyle: FooterStyle = {
        ctaBoxClass: " mvp-page-car-footer",
        ctaBtnClass: "",
        hasIcon: true,
    };

    constructor(
      private _location: Location,
      private _router: Router,
      private _activateRoute: ActivatedRoute,
      private _service: ListPageService,
      private _profileService: ProfileHeaderService,
      private _seoService: SeoService,
      @Inject(DOCUMENT) private _document: any
    ) {
        // check to see if scope is correct and redirect
        // VerticalGlobalFunctions.scopeRedirect(_router, _params);
        this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
        this.paramsub = this._activateRoute.params.subscribe(
          (param :any) => {
            this.paginationParameters = null;
            this.scope = param.scope == 'ncaaf' ? 'fbs' : 'nfl';
            this.positionParam = param['type'] ? param['type'] : null;
            this.tabParam = param['tab'] ? param['tab'] : null;
            this.pageNum = param['pageNum'] ? param['pageNum'] : null;

            this.startUp();
          }
        )

        //Initial set for global MVP position
        // this.filter1 = VerticalGlobalFunctions.getMVPdropdown(this.scope);
        // this.globalMVPPosition = this.positionParam;
        // this.position = this.positionParam;

        var date = new Date;
        var compareDate = new Date('09 15 ' + date.getFullYear());
        if (date.getMonth() == compareDate.getMonth() && date.getDate() >= compareDate.getDate()) {
            this.season = date.getFullYear();
        }
        else if (date.getMonth() > compareDate.getMonth()) {
            this.season = date.getFullYear();
        }
        else {
            this.season = (date.getFullYear() - 1);
        }
    } //constructor



    ngOnInit() {
        console.log('---ngOnInit---');
        //Initial load for mvp Data
    }



    startUp() {
        console.log('---startUp---');
        this.displayPosition =  this.positionParam != null ?
                                VerticalGlobalFunctions.convertPositionAbbrvToPlural(this.positionParam) :
                                this.positionParam;
        this.profileService = this._profileService.getLeagueProfile(this.scope)
        .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
            .subscribe(data => {
                console.log('data - ',data);
                this.profileHeaderData = {
                    imageURL: GlobalSettings.getImageUrl(data.headerData.leagueLogo, GlobalSettings._imgPageLogo),
                    imageRoute: ["League-page"],
                    text1: 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
                    text2: 'United States',
                    text3: "Most Valuable Players - " + this.scope.toUpperCase() + " " + this.displayPosition,
                    icon: 'fa fa-map-marker'
                };
                this.seasonBase = data.headerData.seasonBase;
                this.queryParams = {
                    scope: this.scope,
                    target: 'player',
                    position: this.positionParam,
                    statName: this.tabParam,
                    ordering: 'asc',
                    perPageCount: 20,
                    pageNumber: this.pageNum,
                    season: this.season ? this.season : this.seasonBase
                };
                this.loadTabs();
                this.metaTags(this.profileHeaderData);
            }, err => {
                console.log("Error loading profile");
            });
    } //startUp



    private metaTags(data) {
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let text3 = data.text3 != null ? data.text3: '';
      let text4 = data.text4 != null ? '. '+data.text4: '';
      let title = text3 + ' ' + text4;
      let metaDesc = text3 + ' ' + text4 + ' as of ' + data.text1;
      // TODO
      // this._document.title = "testing";
      // console.log("title:::",this._document.title);
      let link;
      if(isNode) {
        link = Zone.current.get('originUrl') + this._location.path(false);
      }else{
        link = window.location.href;
      }
      let imageUrl;
      if(data.imageURL != null && data.imageURL != ""){
         imageUrl = data.imageURL;
      }else{
         imageUrl = GlobalSettings.getmainLogoUrl();
      }
      let keywords = "football";
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaRobots('INDEX, FOLLOW');
      this._seoService.setOgTitle(title);
      this._seoService.setOgDesc(metaDesc +". Know more about football.");
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl();
      this._seoService.setOgImage(imageUrl);
      //Elastic Search
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setPageTitle(title);
      this._seoService.setPageType('List Page');
      this._seoService.setPageUrl();
      this._seoService.setImageUrl(imageUrl);
      this._seoService.setKeyWord(keywords);
    } //metaTags



    loadTabs() {
        console.log('---loadTabs---');
        this.tabs = this._service.getMVPTabs(this.positionParam, 'page');
        try {
          if (this.tabs != null && this.tabs.length > 0) {
              let selectedTab = this.tabs.filter(tab => tab.tabDataKey == this.tabParam)[0];
              this.selectedTabTitle = selectedTab.tabDisplayTitle;
              this.tabData = this.getStandardList(selectedTab);
          }
        }
        catch(e) {
          console.log('Error loading MVP page tabs - ',e);
        }
    } //loadTabs



    //PAGINATION
    //sets the total pages for particular lists to allow client to
    //move from page to page without losing the sorting of the list
    setPaginationParams(input) {
        //path: '/directory/:type/:startsWith/page/:page',
        var navigationParams = {
            position: this.positionParam,
            statName: this.tabParam,
            pageNumber: this.pageNum
        };

        var navigationPage = '/' + this.scope + '/mvp-list';
        let max = Math.ceil(input.listInfo.resultCount / this.listMax); //NEED Number of entries from API

        this.paginationParameters = {
            index: this.pageNum != null ? Number(this.pageNum) : null,
            max: max,
            paginationType: 'page',
            navigationPage: navigationPage,
            navigationParams: navigationParams,
            indexKey: 'pageNumber'
        };
    } //setPaginationParams(input)



    getStandardList(tab) {
        console.log('---getStandardList---');
        this.queryParams.statName = tab.tabDataKey;
        this._service.getListModuleService(tab, this.queryParams)
            .subscribe(
                tab => {
                    if (tab.data.listInfo) {
                        tab.data.listInfo.pageNum = this.pageNum;
                    }
                    this.setPaginationParams(tab.data);
                    return tab;
                },
                err => {
                    this.isError = true;
                    console.log('Error: List MVP API: ', err);
                }
            );
    }

    tabSelected(event) {
        console.log('---tabSelected---');
        console.log('event - ',event);
        var tabRoute;
        var tabNameFrom = this.tabParam; //get the tab we are changing from into a var before we change it
        var tabNameTo = event.tab.tabDataKey;

        // if (this.selectedTabTitle != event.tab.tabDisplayTitle) {
        //     this.queryParams.pageNum = this.pageNum;
        // }
        // if (!event.tab.listData) { //let the page handle the service call if there's no data
        //     this.getStandardList(event.tab);
        // }
        // else {}

        // this.selectedTabTitle = event.tab.tabDisplayTitle;//line added to update the current tab variable when tabs are changed without reloading the page

        //actually redirect the page on tab change to update the URL for deep linking and to fix the pagination bug
        if (tabNameTo != tabNameFrom) {
            tabRoute = [this.storedPartnerParam, this.scope, 'mvp-list', this.positionParam, tabNameTo, '1'];
            this._router.navigate(tabRoute);
        }
        // this.tabs = this.checkToResetTabs(event);

        // if (event.tab != null) {
        //     var matches = this.checkMatchingTabs(event);
        //     this.globalMVPPosition = event.position;
        //
        //     if (matches != null) {
        //         tabRoute = [this.storedPartnerParam, this.scope, 'mvp-list', event.position, matches.tabDataKey, this.pageNum];
        //         this._router.navigate(tabRoute);
        //     }
        // }
    } //tabSelected(tab: positionMVPTabData)



    private positionDropdown(event) {
        // var pageRoute;
        // this.tabs = this.checkToResetTabs(event);
        //
        // if (event.tab != null) {
        //
        //     var matches = this.checkMatchingTabs(event);
        //
        //     this.positionParam = event.position;
        //
        //     if (matches != null) {
        //         this.queryParams = {
        //             scope: this.scope, //TODO change to active scope
        //             target: 'player',
        //             position: event.position,
        //             statName: matches.tabDataKey,
        //             ordering: 'asc',
        //             perPageCount: this.listMax,
        //             pageNumber: this.pageNum,
        //             season: '2015'
        //         }
        //         this.getStandardList(matches);
        //     }
        //     pageRoute = [this.storedPartnerParam, this.scope, 'mvp-list', event.position, matches.tabDataKey, this.pageNum];
        //     this._router.navigate(pageRoute);
        // }
    } //positionDropdown



    private checkToResetTabs(event) {
        let localPosition = event.position;

        if (localPosition != this.positionParam) {
            return this._service.getMVPTabs(event.position, 'page');
        } else {
            return this.tabs;
        } //private checkToResetTabs
    } //private checkToResetTabs



    private checkMatchingTabs(event) {
        let tabRoute;
        let localPosition = event.position;
        let listName = event.tab.tabDataKey;

        if (event.position != this.positionParam) {
            this.tabs[0].isLoaded = false;
            return this.tabs[0];
        } else {
            return this.tabs.filter(tab => tab.tabDataKey == this.queryParams.statName)[0];
        }
    } //private checkMatchingTabs



    ngOnDestroy(){
      this.paramsub.unsubscribe();
      this.profileService.unsubscribe();
    } //ngOnDestroy
}
