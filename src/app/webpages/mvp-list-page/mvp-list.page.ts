import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

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

@Component({
    selector: 'mvp-list-page',
    templateUrl: './app/webpages/mvp-list-page/mvp-list.page.html'
})

export class MVPListPage implements OnInit {

    @Output() tabSelectedListener = new EventEmitter();

    scope: string;
    tabs: Array<positionMVPTabData>;
    profileHeaderData: TitleInputData;
    paginationParameters: PaginationParameters;
    storedPartnerParam: string;
    listType: string;
    position: string;
    tab: string;
    pageNum: any;
    queryParams: any;
    isError: boolean = false;
    selectedTabName: string;
    globalMVPPosition: string;
    season: number;
    listMax: number = 20;
    filter1: any;

    displayPosition: string;

    public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv().toLowerCase();
    public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
    public collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();

    footerStyle: FooterStyle = {
        ctaBoxClass: " mvp-page-car-footer",
        ctaBtnClass: "",
        hasIcon: true,
    };

    constructor(
      private router: Router,
      private activateRoute: ActivatedRoute,
      private _service: ListPageService,
      private _profileService: ProfileHeaderService,
      private _title: Title,
      private _seoService: SeoService
    ) {
        // check to see if scope is correct and redirect
        // VerticalGlobalFunctions.scopeRedirect(_router, _params);

        this.activateRoute.params.subscribe(
          (param :any) => {
            this.paginationParameters = null;

            this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
            this.listType = param['type'] ? param['type'] : null;
            this.tab = param['tab'] ? param['tab'] : null;
            this.pageNum = param['pageNum'] ? param['pageNum'] : null;
            this.startUp();
          }
        )

        //Initial set for global MVP position
        this.filter1 = VerticalGlobalFunctions.getMVPdropdown(this.scope);
        this.globalMVPPosition = this.listType;
        this.position = this.listType;

        var date = new Date;
        var season;
        var compareDate = new Date('09 15 ' + date.getFullYear());
        if (date.getMonth() == compareDate.getMonth() && date.getDate() >= compareDate.getDate()) {
            season = date.getFullYear();
        }
        else if (date.getMonth() > compareDate.getMonth()) {
            season = date.getFullYear();
        }
        else {
            season = (date.getFullYear() - 1);
        }

        //Initial load for mvp Data
        this.queryParams = {
            scope: this.scope, //TODO change to active scope
            target: 'player',
            position: this.listType,
            statName: this.tab,
            ordering: 'asc',
            perPageCount: 20,
            pageNumber: this.pageNum,
            season: season
        };

        this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
    } //constructor



    ngOnInit() {
        this.position = this.listType;
    }



    startUp() {
        if (this.scope == this.collegeDivisionAbbrv.toLowerCase()) {
            this.scope = this.collegeDivisionFullAbbrv;
        }

        this.displayPosition = this.listType != null ? VerticalGlobalFunctions.convertPositionAbbrvToPlural(this.listType) : this.globalMVPPosition;

        // this.profileHeaderData = {
        //     imageURL: GlobalSettings.getSiteLogoUrl(), //TODO
        //     imageRoute: ["League-page"],
        //     text1: 'Last Updated: ',//+ GlobalFunctions.formatUpdatedDate(data.listData[0].lastUpdate),
        //     text2: 'United States',
        //     text3: "Most Valuable Players - " + this.scope.toUpperCase() + " " + this.displayPosition,
        //     icon: 'fa fa-map-marker'
        // };

        this._profileService.getLeagueProfile(this.scope)
            .subscribe(data => {
                this.profileHeaderData = {
                    imageURL: GlobalSettings.getImageUrl(data.headerData.leagueLogo),
                    imageRoute: ["League-page"],
                    text1: 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
                    text2: 'United States',
                    text3: "Most Valuable Players - " + this.scope.toUpperCase() + " " + this.displayPosition,
                    icon: 'fa fa-map-marker'
                };
                this.loadTabs();
                this.metaTags(this.profileHeaderData);
            }, err => {
                console.log("Error loading profile");
            });
    } //startUp



    private metaTags(data) {
      //create meta description that is below 160 characters otherwise will be truncated
      let text3 = data.text3 != null ? data.text3: '';
      let text4 = data.text4 != null ? '. '+data.text4: '';
      let title = text3 + ' ' + text4;
      let metaDesc = text3 + ' ' + text4 + ' as of ' + data.text1;
      let link = window.location.href;
      let imageUrl;
      if(data.imageURL != null && data.imageURL != ""){
         imageUrl = data.imageURL;
      }else{
         imageUrl = GlobalSettings.getmainLogoUrl();
      }
      this._seoService.setCanonicalLink();
      this._seoService.setOgTitle(title);
      this._seoService.setOgDesc(metaDesc +". Know more about football.");
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl();
      this._seoService.setOgImage(imageUrl);
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setMetaRobots('INDEX, FOLLOW');
    } //metaTags



    loadTabs() {
        this.tabs = this._service.getMVPTabs(this.listType, 'page');
        if (this.tabs != null && this.tabs.length > 0) {

            var selectedTab = this.tabs.filter(tab => tab.tabDataKey == this.queryParams.statName)[0];
            if (this.queryParams.statName) {
                var matchingTabs = this.tabs.filter(tab => tab.tabDataKey == this.queryParams.statName);

                if (matchingTabs.length > 0) {
                    selectedTab = matchingTabs[0];
                }
            }
            this.selectedTabName = selectedTab.tabDisplayTitle;

            this.getStandardList(selectedTab);
        }
    }

    //PAGINATION
    //sets the total pages for particular lists to allow client to
    //move from page to page without losing the sorting of the list
    setPaginationParams(input) {
        //path: '/directory/:type/:startsWith/page/:page',
        var navigationParams = {
            position: this.listType,
            statName: this.tab,
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

    getStandardList(tab: positionMVPTabData) {

        this.queryParams.statName = tab.tabDataKey;

        this._service.getListModuleService(tab, this.queryParams)
            .subscribe(
            tab => {
                if (tab.data.listInfo) {
                    tab.data.listInfo.pageNum = this.pageNum;
                }
                this.setPaginationParams(tab.data);
            },
            err => {
                this.isError = true;
                console.log('Error: List MVP API: ', err);
            }
            );
    }

    tabSelected(event) {
        var tabRoute;
        var tabNameFrom = this.selectedTabName; //get the tab we are changing from into a var before we change it
        var tabNameTo = event.tab.tabDisplayTitle;

        if (this.selectedTabName != event.tab.tabDisplayTitle) {
            this.queryParams.pageNum = this.pageNum;
        }
        if (!event.tab.listData) { //let the page handle the service call if there's no data
            this.getStandardList(event.tab);
        }
        else {

        }
        this.selectedTabName = event.tab.tabDisplayTitle;//line added to update the current tab variable when tabs are changed without reloading the page

        //actually redirect the page on tab change to update the URL for deep linking and to fix the pagination bug
        if (tabNameTo !== tabNameFrom) {
            tabRoute = [this.storedPartnerParam, this.scope, 'mvp-list', event.position, event.tab.tabDataKey, this.pageNum];
            this.router.navigate(tabRoute);
        }
        this.tabs = this.checkToResetTabs(event);

        if (event.tab != null) {
            var matches = this.checkMatchingTabs(event);
            this.globalMVPPosition = event.position;

            if (matches != null) {
                tabRoute = [this.storedPartnerParam, this.scope, 'mvp-list', event.position, matches.tabDataKey, this.pageNum];
                this.router.navigate(tabRoute);
            }
        }
    } //tabSelected(tab: positionMVPTabData)



    private positionDropdown(event) {
        var pageRoute;
        this.tabs = this.checkToResetTabs(event);

        if (event.tab != null) {

            var matches = this.checkMatchingTabs(event);

            this.globalMVPPosition = event.position;

            if (matches != null) {
                this.queryParams = {
                    scope: this.scope, //TODO change to active scope
                    target: 'player',
                    position: event.position,
                    statName: matches.tabDataKey,
                    ordering: 'asc',
                    perPageCount: this.listMax,
                    pageNumber: this.pageNum,
                    season: '2015'
                }
                this.getStandardList(matches);
            }
            pageRoute = [this.storedPartnerParam, this.scope, 'mvp-list', event.position, matches.tabDataKey, this.pageNum];
            this.router.navigate(pageRoute);
        }
    } //positionDropdown



    private checkToResetTabs(event) {
        let localPosition = event.position;

        if (localPosition != this.globalMVPPosition) {
            return this._service.getMVPTabs(event.position, 'page');
        } else {
            return this.tabs;
        } //private checkToResetTabs
    } //private checkToResetTabs



    private checkMatchingTabs(event) {
        let tabRoute;
        let localPosition = event.position;
        let listName = event.tab.tabDataKey;

        if (event.position != this.globalMVPPosition) {
            this.tabs[0].isLoaded = false;
            return this.tabs[0];
        } else {
            return this.tabs.filter(tab => tab.tabDataKey == this.queryParams.statName)[0];
        }
    } //private checkMatchingTabs
}
