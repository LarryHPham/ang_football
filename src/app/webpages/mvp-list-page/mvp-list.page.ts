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
    scopeDisplay: string;
    tabs: Array<positionMVPTabData>;
    tabData: any;
    profileHeaderData: TitleInputData;
    paginationParameters: PaginationParameters;
    storedPartnerParam: string;
    positionParam: string;
    position: string;
    tabParam: string;
    pageTypeParam: string;
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
            let route = this._router.url.split('/');
            this.pageTypeParam = this.storedPartnerParam != '' ? route[3] : route[2];
            this.paginationParameters = null;
            this.scopeDisplay = param.scope.toUpperCase(),
            this.scope = param.scope == 'ncaaf' ? 'fbs' : 'nfl';
            this.positionParam = param['type'] ? param['type'] : null;
            this.tabParam = param['tab'] ? param['tab'] : null;
            this.pageNum = param['pageNum'] ? param['pageNum'] : null;

            this.startUp();
          }
        );

        //Initial set for global MVP position
        this.filter1 = VerticalGlobalFunctions.getMVPdropdown(this.scope);
        // this.globalMVPPosition = this.positionParam;
        // this.position = this.positionParam;
    } //constructor



    ngOnInit() {}



    startUp() {
        this.displayPosition =  this.positionParam != null ?
                                VerticalGlobalFunctions.convertPositionAbbrvToPlural(this.positionParam) :
                                this.positionParam;
        this.profileService = this._profileService.getLeagueProfile(this.scope)
        .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
            .subscribe(data => {
                this.profileHeaderData = {
                    imageURL: GlobalSettings.getImageUrl(data.headerData.leagueLogo, GlobalSettings._imgPageLogo),
                    imageRoute: ["League-page"],
                    text1: 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
                    text2: 'United States',
                    text3: "Most Valuable Players - " + this.scopeDisplay + " " + this.displayPosition,
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
                    season: this.seasonBase
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
      let link;
      if(isNode) {
        link = GlobalSettings._globalSiteUrl + this._location.path(false);
      }else{
        link = window.location.href;
      }
      let imageUrl;
      if(data.imageURL != null && data.imageURL != ""){
         imageUrl = data.imageURL;
      }else{
         imageUrl = GlobalSettings.getmainLogoUrl();
      }
      let keywords = "football, list page";
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaRobots('INDEX, FOLLOW');

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
          'og:image': imageUrl,
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
          'es_page_type': 'MVP List page',
        },
        {
          'es_keywords': keywords
        },
        {
          'es_image_url':imageUrl
        }
      ])
    } //metaTags



    loadTabs() {
        this.tabs = this._service.getMVPTabs(this.positionParam, 'page');
        try {
          if (this.tabs != null && this.tabs.length > 0) {
              let selectedTab = this.tabs.filter(tab => tab.tabDataKey == this.tabParam)[0];
              this.selectedTabTitle = selectedTab.tabDisplayTitle;
              this.getStandardList(selectedTab);
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
        this.queryParams.statName = tab.tabDataKey;
        this._service.getListModuleService(tab, this.queryParams)
            .subscribe(
                tab => {
                    if (tab.data.listInfo) {
                        tab.data.listInfo.pageNum = this.pageNum;
                    }
                    this.setPaginationParams(tab.data);
                    this.tabData = tab;
                    return tab;
                },
                err => {
                    this.isError = true;
                    console.log('Error: List MVP API: ', err);
                }
            );
    } //getStandardList



    tabSelected(event) {
        let tabRoute;
        let tabNameFrom = this.tabParam; //get the tab we are changing from into a var before we change it
        let tabNameTo = event.tabDataKey;

        if (tabNameTo != tabNameFrom) {
            tabRoute = [this.storedPartnerParam, this.scope, this.pageTypeParam, this.positionParam, tabNameTo, '1'];
            this._router.navigate(tabRoute);
        }
    } //tabSelected(tab: positionMVPTabData)



    private positionDropdown(event) {
        let positionRoute;
        let positionFrom = this.positionParam;
        let positionTo = event.position;
        let activeTab;
        this.tabs = this.checkToResetTabs(event);

        if ( positionTo != positionFrom ) {
            activeTab = this.tabs[0];
            this._service.getMVPTabs(event.position, 'page');
            positionRoute = [this.storedPartnerParam, this.scope, this.pageTypeParam, positionTo, activeTab.tabDataKey, '1' ];
            this._router.navigate(positionRoute);
        }
    } //positionDropdown



    private checkToResetTabs(event) {
        let localPosition = event.position;
        if (localPosition != this.positionParam) {
            return this._service.getMVPTabs(event.position, 'page');
        } else {
            return this.tabs;
        } //private checkToResetTabs
    } //private checkToResetTabs



    ngOnDestroy(){
      this.paramsub.unsubscribe();
      this.profileService.unsubscribe();
    } //ngOnDestroy
}
