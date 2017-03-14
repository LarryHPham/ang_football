import { Component, OnInit, Input, DoCheck, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';

//global functions
import { GlobalFunctions } from '../../global/global-functions';
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//service
import { RosterService } from '../../services/roster.service';
import { ProfileHeaderService } from '../../services/profile-header.service';
import { SeoService } from "../../seo.service";

//interface
import { TitleInputData } from "../../fe-core/components/title/title.component";
import { RosterTabData } from "../../fe-core/components/roster/roster.component";
import { NFLRosterTabData } from '../../services/roster.data';
import { SportPageParameters } from '../../global/global-interface';



@Component({
    selector: 'Team-roster-page',
    templateUrl: './team-roster.page.html',
})

export class TeamRosterPage {
    public scope: string;
    public scopeParam: string;
    public pageParams: SportPageParameters = {};
    public paramsub: any;
    public storedPartnerParam: string;
    public partnerID: string;
    public pageType: string;
    public teamID: string;
    public teamName: string;
    public tabParam: string;
    public selectedTabKey: string;
    public titleData: TitleInputData;
    public profileLoaded: boolean = false;
    public hasError: boolean = false;
    public footerData = {
        infoDesc: 'Interested in discovering more about this player?',
        text: 'View Profile',
        url: ['Team-roster-page']
    };
    public tabs: Array<NFLRosterTabData>;
    public activeTab: Array<NFLRosterTabData>;

    private profileService: any;

    constructor(
        private router: Router,
        private activateRoute: ActivatedRoute,
        private _profileService: ProfileHeaderService,
        private _rosterService: RosterService,
        private _seoService: SeoService
    ) {
        this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
        this.paramsub = this.activateRoute.params.subscribe(
            (param :any)=> {
                let route = this.router.url.split('/');
                this.pageParams.scope = this.scope;
                this.pageType = this.storedPartnerParam != '' ?
                                route[3] :
                                route[2];
                this.scopeParam = param['scope'];
                this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
                this.partnerID = param['partnerID'];
                this.teamName = param['teamName'];
                this.teamID = param['teamID'];
                this.tabParam = param['tab'];
                this.selectedTabKey = param['tab'];
                if ( this.teamID !== null && this.teamID !== undefined ) {
                    this.pageParams.teamId = Number(this.teamID);
                }
                this.getData();
            }
        )
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
      if(data.imageURL != null && data.imageURL != ""){
         imageUrl = data.imageURL;
      }else{
         imageUrl = GlobalSettings.getmainLogoUrl();
      }

      let keywords = "football";
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
          'es_page_type': 'Team Roster Page',
        },
        {
          'es_keywords': keywords
        },
        {
          'es_image_url':imageUrl
        }
      ])

    } //metaTags



    getData() {
      if ( this.pageParams.teamId ) {
        this.profileService = this._profileService.getTeamProfile(this.pageParams.teamId)
          .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
          .subscribe(
            data => {
              this.profileLoaded = true;
              this.pageParams = data.pageParams;
              data.teamName=data.headerData.teamMarket?data.headerData.teamMarket+" "+ data.teamName:data.teamName;
              this.titleData = this._profileService.convertTeamPageHeader(this.scope, data, this._rosterService.getPageTitle(data.teamName));
              this.metaTags(this.titleData);
              this.setTabs();
              this.getSelectedTab(this.tabParam);
            },
            err => {
              this.hasError = true;
              console.log("Error getting team profile data for " + this.pageParams.teamId, err);
            }
          );
      }
      else {
        //TODO - Load error page since a team is required to show a roster?
      }
    } //getData



    private rosterTabSelected(tabTitle) {
        let newRoute;
        let tabTo = this.tabs.filter(value => value.title == tabTitle);
        let tabFrom = this.activeTab[0].title;
        if ( tabTo[0].title != tabFrom ) {
            newRoute = [this.storedPartnerParam, this.scopeParam, this.pageType, this.teamName, this.teamID, tabTo[0].type];
            this.router.navigate(newRoute);
        }
    } //rosterTabSelected



    private getSelectedTab(tab) {
        if ( this.tabs ) {
            this.activeTab = this.tabs.filter(value => value.type == tab);
            return this.activeTab;
        }
    } //getSelectedTab



    private setTabs() {
        this.tabs = this._rosterService.initializeAllTabs(this.scope, this.teamID, this.pageParams.conference);
    } //setTabs



    ngOnDestroy(){
      this.paramsub.unsubscribe();
      this.profileService.unsubscribe();
    } //ngOnDestroy
}
