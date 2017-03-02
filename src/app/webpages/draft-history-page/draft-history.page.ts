import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

//globals
import { GlobalFunctions } from '../../global/global-functions';
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { ProfileHeaderService } from '../../services/profile-header.service';
import { SeoService } from "../../seo.service";
import { DraftHistoryTab, DraftHistoryService } from '../../services/draft-history.service';

//interfaces
import { IProfileData } from "../../fe-core/modules/profile-header/profile-header.module";
import { TitleInputData } from '../../fe-core/components/title/title.component';
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';

@Component({
    selector: 'draft-history-page',
    templateUrl: './draft-history.page.html'
})

export class DraftHistoryPage {
    public scope: string;
    public partnerID: string;
    public tabParam: string;
    public teamNameParam: string;
    public teamIdParam: number;
    public filter1Param: string;
    public paramsub: any;
    public storedPartnerParam: string;
    public seasonBase: string;
    public pageType: string;
    public pageParams: any;

    public dropdownKey1: string;
    public tabs: any;
    private sortOptions: Array<any> = [{key: '1', value: 'Ascending'}, {key: '2', value: 'Descending'}];
    private currentIndex: number = 0;
    public paginationIndex: number = 20;
    public type: 'page';
    private carouselDataArray: Array<Array<SliderCarouselInput>>;
    public detailedData: any;

    private whatProfile: string = "Draft History";
    private profileHeaderData: TitleInputData;
    private profileData: IProfileData;
    private isError: boolean = false;

    private draftHistoryService: any;
    private profileService: any;

    constructor(
        private _title: Title,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _profileService: ProfileHeaderService,
        private _seoService: SeoService,
        private _draftService:DraftHistoryService
    ) {
        this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
        this.paramsub = this._activateRoute.params.subscribe(
            (param: any) => {
                let route = this._router.url.split('/');
                this.pageParams = param;
                this.pageType = this.storedPartnerParam != '' ?
                                route[3] :
                                route[2];
                this.scope = param.scope == 'ncaaf' ? 'fbs' : 'nfl';
                this.tabParam = param.tab;
                this.teamNameParam = param.teamName;
                this.teamIdParam = param.teamId;
                this.filter1Param = param.filter1;
                this.getProfileInfo();
            }
        ) //this.paramsub
    } //constructor



    private metaTags(data) {
        //This call will remove all meta tags from the head.
        this._seoService.removeMetaTags();
        //create meta description that is below 160 characters otherwise will be truncated
        let text3 = data.text3 != null ? data.text3: '';
        let text4 = data.text4 != null ? '. '+data.text4: '';
        let title = text3 + ' ' + text4;
        let metaDesc = text3 + ' ' + text4 + ' as of ' + data.text1;
        let imageUrl;
        if (data.imageURL != null && data.imageURL != "") {
            imageUrl = data.imageURL;
        } else {
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
        this._seoService.setPageType('Draft History Page');
        this._seoService.setPageUrl();
        this._seoService.setImageUrl(imageUrl);
        this._seoService.setKeyWord(keywords);
    } //metaTags



    getProfileInfo() {
        if (this.teamIdParam) {
            this.profileService = this._profileService.getTeamProfile(this.teamIdParam)
                .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
                .subscribe(
                    data => {
                        var pageNameForTitle = this.whatProfile + " - " + data.profileName;
                        data.profileName = data.headerData.teamMarket ?
                                            data.headerData.teamMarket + " " + data.profileName :
                                            data.profileName;
                        this.profileHeaderData = this._profileService.convertTeamPageHeader(this.scope, data, pageNameForTitle);
                        this.profileData = data;
                        this.seasonBase = data.headerData['seasonBase'];
                        this.dropdownKey1 = this.dropdownKey1 ?
                                            this.dropdownKey1 :
                                            this.filter1Param;
                        this.tabs = this._draftService.getDraftHistoryTabs(this.profileData);
                        this.metaTags(this.profileHeaderData);
                        this.getDraftHistoryPage();
                    },
                    err => {
                        this.isError = true;
                        console.log('Error: draftData Profile Header API: ', err);
                    }
                );
        }
        else {
            this.profileService = this._profileService.getLeagueProfile()
                .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
                .subscribe(
                    data => {
                        // this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.headerData.leagueAbbreviatedName));
                        this.profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, data.headerData.leagueAbbreviatedName + ' ' + this.whatProfile);
                        this.profileData = data;
                        this.seasonBase = data.headerData['seasonBase'];
                        this.dropdownKey1 = this.dropdownKey1 ?
                                            this.dropdownKey1 :
                                            this.filter1Param;
                        this.tabs = this._draftService.getDraftHistoryTabs(this.profileData);
                        this.metaTags(this.profileHeaderData);
                        this.getDraftHistoryPage();
                    },
                    err => {
                        this.isError = true;
                        console.log('Error: draftData Profile Header API: ', err);
                    }
                );
        }
    } //getProfileInfo



    getDraftHistoryPage() {
        var matchingTabs = this.tabs ?
                            this.tabs.filter(tab => tab.tabKey == this.tabParam) :
                            null;
        if (matchingTabs) {
            var tab = matchingTabs[0];
            this.dropdownKey1 = this.filter1Param == 'desc' ? '2' : '1';
            this.draftHistoryService = this._draftService.getDraftHistoryService(this.profileData, tab, this.currentIndex, this.type, this.dropdownKey1, this.paginationIndex)
                .subscribe(
                    draftData => {
                      tab.isLoaded = true;
                      tab.detailedDataArray = draftData.detailedDataArray;
                      tab.carouselDataArray = draftData.carouselDataArray;
                      this.carouselDataArray = tab.carouselDataArray;
                    },
                    err => {
                      tab.isLoaded = true;
                      this.isError = true;
                      console.log('Error: draftData API: ', err);
                  }
                )
        }
    } //getDraftHistoryPage



    draftHistoryTab(tab) {
        let newRoute;
        let tabNameFrom = this.tabParam;
        let tabNameTo = tab;
        if (tabNameTo != tabNameFrom) {
            newRoute = this.teamIdParam ?
                        [this.storedPartnerParam, this.pageParams.scope, this.pageType, tabNameTo.toLowerCase(), this.teamNameParam, this.teamIdParam, this.pageParams.filter1] :
                        [this.storedPartnerParam, this.pageParams.scope, this.pageType, tabNameTo.toLowerCase(), 'league', this.pageParams.filter1];
            this._router.navigate(newRoute);
        }
    } //draftHistoryTab



    draftHistoryFilterDropdown(filter) {
        let activeFilter = filter == 1 ? 'asc' : 'desc';
        let newRoute;
        let filterFrom = this.filter1Param;
        let filterTo = activeFilter;
        if (filterTo != filterFrom) {
            newRoute = this.teamIdParam ?
                        [this.storedPartnerParam, this.pageParams.scope, this.pageType, this.tabParam, this.teamNameParam, this.teamIdParam, activeFilter] :
                        [this.storedPartnerParam, this.pageParams.scope, this.pageType, this.tabParam, 'league', activeFilter];
            this._router.navigate(newRoute);
        }
    } //draftHistoryFilterDropdown



    ngOnDestroy(){
      this.paramsub.unsubscribe();
      this.draftHistoryService.unsubscribe();
      this.profileService.unsubscribe();
    } //ngOnDestroy
}
