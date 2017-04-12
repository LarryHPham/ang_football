import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from '@angular/platform-browser';

//globals
import { GlobalFunctions } from '../../global/global-functions';
import { GlobalSettings } from '../../global/global-settings';
import {VerticalGlobalFunctions} from '../../global/vertical-global-functions';

//services
import { ProfileHeaderService } from '../../services/profile-header.service';
import { SeasonStatsPageService } from '../../services/season-stats.service';
import { SeoService } from "../../seo.service";

//interfaces
import { TitleInputData } from "../../fe-core/components/title/title.component";
import { CircleImageData, ImageData } from "../../fe-core/components/images/image-data";
import { SportSeasonStatsTabData, SportSeasonStatsTableData } from '../../services/season-stats-page.data';
import { Season, SportPageParameters } from '../../global/global-interface';



@Component({
    selector: 'Season-stats-page',
    templateUrl: './season-stats.page.html'
})

export class SeasonStatsPage {
    public paramsub: any;
    public storedPartnerParam: string;
    public partnerID: string;
    public scope: string;
    public playerID: number;
    public playerName: string;
    public pageParams: SportPageParameters = {}
    public tabParam: string;

    public selectedTabTitle: string;
    public seasonBase: string;
    public widgetPlace: string = "widgetForPage";
    public tabs: Array<SportSeasonStatsTabData>;
    public profileLoaded: boolean = false;
    public hasError: boolean = false;
    public titleData: TitleInputData;
    public carData: any;

    private profileService: any;
    private seasonStatsService: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private _router: Router,
        private _profileService: ProfileHeaderService,
        private _seasonStatsPageService: SeasonStatsPageService,
        private _title: Title,
        private _seoService: SeoService
    ) {
        this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
        this.paramsub = this.activatedRoute.params.subscribe(
            (param :any)=> {
                this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
                this.partnerID = param['partnerID'];
                this.tabParam = param['tab'];
                this.playerName = param['fullName'];
                this.playerID = param['playerID'];
                this.pageParams.playerId = Number(this.playerID);

                this.setUpPage();
            }
        )
    } //constructor

    private setUpPage() {
        if (this.pageParams.playerId) {
            this.profileService = this._profileService.getPlayerProfile(this.pageParams.playerId)
                .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
                .subscribe(
                    data => {
                        this.profileLoaded = true;
                        this.pageParams = data.pageParams;
                        this.pageParams['scope'] = this.scope;
                        this.seasonBase = data.headerData['seasonBase'] ? data.headerData['seasonBase'] : new Date().getFullYear();
                        this.selectedTabTitle = this.tabParam ? this.tabParam : this.seasonBase;
                        // this._title.setTitle(GlobalSettings.getPageTitle("Season Stats", data.headerData.playerFullName));
                        this.setupTitleData(data.fullProfileImageUrl, data.headerData.teamFullName, data.pageParams.playerId.toString(), data.headerData.playerFullName);
                        this.tabs = this._seasonStatsPageService.initializeAllTabs(this.pageParams, this.selectedTabTitle, this.seasonBase);
                        let activeTab = this.getActiveTab(this.selectedTabTitle);
                        this._seasonStatsPageService.getSeasonStatsTabData(activeTab, this.pageParams, data => {
                            this.carData = data;
                            this.getLastUpdatedDateForPage(data);
                        });
                    },
                    err => {
                        this.hasError = true;
                        console.log("Error getting season stats data: " + err);
                    }
                );
        } // if (this.pageParams.playerId)
    }



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

        let keywords = "football, touchdownloyal, season stats";
        let link = this._seoService.getPageUrl();
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
            'es_page_type': 'Season Stats Page',
            },
            {
            'es_keywords': keywords
            },
            {
            'es_image_url':imageUrl
            }
        ])
    } //metaTags



    private setupTitleData(imageUrl: string, teamName: string, playerId: string, playerName: string) {
        var profileLink = ["/home"];
        if (playerId) {
            profileLink = VerticalGlobalFunctions.formatPlayerRoute(this.scope, teamName, playerName, playerId);
        }
        var title = this._seasonStatsPageService.getPageTitle(this.pageParams, playerName);
        this.titleData = {
            imageURL: imageUrl,
            imageRoute: profileLink,
            text1: "",
            text2: "United States",
            text3: title,
            icon: "fa fa-map-marker"
        };
        this.metaTags(this.titleData);
    } //setupTitleData



    private seasonStatsTabSelected(tab: SportSeasonStatsTabData) {
        let newRoute;
        let tabNameFrom = this.selectedTabTitle; // capture previous value before changing it
        let tabNameTo = tab.year; // newly selected tab

        if ( tabNameTo != tabNameFrom ) {
            this.selectedTabTitle = tabNameTo;
            newRoute = [this.storedPartnerParam, this.scope, 'season-stats', this.selectedTabTitle, this.playerName, this.playerID];
            this._router.navigate(newRoute);
        }
    } //seasonStatsTabSelected



    private getActiveTab(tabTitle) {
        let selectedSeason;
        if ( tabTitle == 'Current Season' ) { selectedSeason = this.tabs[0].year }
        else if ( tabTitle == 'Career Stats' ) { selectedSeason = 'career' }
        else { selectedSeason = tabTitle }
        var matchingTabs = this.tabs.filter(value => value.year === selectedSeason);
        return matchingTabs[0];
    } //getActiveTab



    private getLastUpdatedDateForPage(data: SportSeasonStatsTableData[]) {
        if (data && data.length > 0 &&
            data[0].tableData && data[0].tableData.rows &&
            data[0].tableData.rows.length > 0) {
            var lastUpdated = data[0].tableData.rows[0].lastUpdated;
            this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
        }
    } //getLastUpdatedDateForPage



    ngOnDestroy(){
      this.paramsub.unsubscribe();
      this.profileService.unsubscribe();
    } //ngOnDestroy
}
