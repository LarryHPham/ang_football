import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';

//global functions
import { GlobalSettings } from '../../global/global-settings';
import { GlobalFunctions } from '../../global/global-functions';
import { VerticalGlobalFunctions } from '../../global/vertical-global-functions';

//services
import { ProfileHeaderService } from '../../services/profile-header.service';
import { StandingsService } from '../../services/standings.service';
//import seo service here to overwrite the one done in title.component
// import {SeoService} from "../../seo.service";

//interfaces
import { Division, Conference, SportPageParameters } from '../../global/global-interface';
import { GlossaryData } from "../../fe-core/components/glossary/glossary.component";
import { TitleInputData } from "../../fe-core/components/title/title.component";
import { CircleImageData, ImageData } from "../../fe-core/components/images/image-data";
import { TDLStandingsTabdata, VerticalStandingsTableData } from '../../services/standings.data';



declare var moment;
@Component({
    selector: 'Standings-page',
    templateUrl: './app/webpages/standings-page/standings.page.html',
})

export class StandingsPage {
  public paramsub: any;
  public partnerID: string;
  public scope: string;
  public type: string;
  public teamID: number;
  public pageParams: SportPageParameters = {};

  public tabs: Array<TDLStandingsTabdata>;
  public titleData: TitleInputData;
  public profileLoaded: boolean = false;
  public hasError: boolean = false;
  public glossary: Array<GlossaryData>;
  public seasonsArray: Array<any>;
  public profileData: any;
  private runMeta: boolean = false;
  private constructorControl: boolean = true;

    constructor(
      private activateRoute: ActivatedRoute,
      private _profileService: ProfileHeaderService,
      private _standingsService: StandingsService,
    ) {
      this.paramsub = this.activateRoute.params.subscribe(
        (param :any)=> {
          this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';
          this.partnerID = param['partnerID'];
          this.type = param['type'];
          this.teamID = param['teamID'];
          if (this.type !== null && this.type !== undefined) {
              this.type = this.type.toLowerCase();
              this.pageParams.conference = Conference[this.type];
          }
          if (this.type == "team" && this.teamID !== null && this.teamID !== undefined) {
              this.pageParams.teamId = Number(this.teamID);
          }

          this.pageParams.scope = this.scope;
          this.getTabs();
          this.getGlossaryValue();
        }
      )
    } //constructor



    getGlossaryValue(): Array<GlossaryData> {
        if (this.scope == 'fbs') {
            this.glossary = [
                {
                    key: "<span class='text-heavy'>W/L/T</span>",
                    value: "Total Wins"
                },
                {
                    key: "<span class='text-heavy'>CONF</span>",
                    value: "Conference Record"
                },
                {
                    key: "<span class='text-heavy'>STRK</span>",
                    value: "Current Streak"
                },
                {
                    key: "<span class='text-heavy'>HM</span>",
                    value: "Home Record"
                },
                {
                    key: "<span class='text-heavy'>RD</span>",
                    value: "Road Record"
                },
                {
                    key: "<span class='text-heavy'>PF</span>",
                    value: "Total Points For"
                },
                {
                    key: "<span class='text-heavy'>PA</span>",
                    value: "Total Points Against"
                },
                {
                    key: "<span class='text-heavy'>RANK</span>",
                    value: "Team Rank"
                }
            ]
        } else {
            this.glossary = [
                {
                    key: "<span class='text-heavy'>W/L/T</span>",
                    value: "Total Wins"
                },
                {
                    key: "<span class='text-heavy'>PCT</span>",
                    value: "Winning Percentage"
                },
                {
                    key: "<span class='text-heavy'>DIV</span>",
                    value: "Division Record"
                },
                {
                    key: "<span class='text-heavy'>CONF</span>",
                    value: "Conference Record"
                },
                {
                    key: "<span class='text-heavy'>STRK</span>",
                    value: "Current Streak"
                },
                {
                    key: "<span class='text-heavy'>PF</span>",
                    value: "Total Points For"
                },
                {
                    key: "<span class='text-heavy'>PA</span>",
                    value: "Total Points Against"
                }
            ]
        }
        return this.glossary;
    } //getGlossaryValue



    getTabs() {
        this.getGlossaryValue();
        if (this.pageParams.teamId) {
            this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
                data => {
                    this.profileLoaded = true;
                    this.pageParams = data.pageParams;
                    this.pageParams.scope = this.scope;
                    var teamFullName = data.headerData.teamMarket + ' ' + data.headerData.teamName;
                    var title = this._standingsService.getPageTitle(this.pageParams, teamFullName);
                    this.titleData = this._profileService.convertTeamPageHeader(this.scope, data, title)
                    this.profileData = data;
                    this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
                    this.metaTags(this.profileData);
                },
                err => {
                    this.hasError = true;
                    console.log("Error getting team profile data for " + this.pageParams.teamId, err);
                }
            );
        }
        else {
            var title = this._standingsService.getPageTitle(this.pageParams, null);
            this.titleData = {
                imageURL: GlobalSettings.getSiteLogoUrl(),
                imageRoute: ["League-page"],
                text1: "",
                text2: "United States",
                text3: title,
                icon: "fa fa-map-marker"
            };
            //for Seo purposes
            this.profileData = {
                headerData: {
                    teamMarket: this.scope.toUpperCase() + ' League',
                    teamName: null,
                    backgroundUrl: GlobalSettings.getSiteLogoUrl(),
                    lastUpdated: GlobalFunctions.formatUpdatedDate(new Date(), false),
                }
            }
            this.metaTags(this.profileData);
            this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
        }
    } //getTabs



    private metaTags(data) {
      //   let header, metaDesc, link, title, ogTitle, image, titleName;
      //
      //   //create meta description that is below 160 characters otherwise will be truncated
      //   header = data.headerData;
      //   titleName = header.teamName != null ? header.teamMarket + ' ' + header.teamName : header.teamMarket;
      //   titleName = titleName.replace(/FBS/g, "NCAAF");
      //   title = titleName + ' Standings';
      //   ogTitle = titleName;
      //   metaDesc = 'Standings for ' + titleName + ' as of ' + GlobalFunctions.formatUpdatedDate(header.lastUpdated, false);
      //   link = window.location.href;
      //   image = GlobalSettings.getImageUrl(header.backgroundUrl);
      //
      //   this._seoService.setCanonicalLink(this._params.params, this._router);
      //   this._seoService.setOgTitle(ogTitle);
      //   this._seoService.setOgDesc(metaDesc);
      //   this._seoService.setOgType('Website');
      //   this._seoService.setOgUrl(link);
      //   this._seoService.setOgImage(image);
      //   this._seoService.setTitleNoBase(title);
      //   this._seoService.setMetaDescription(metaDesc);
      //   this._seoService.setMetaRobots('Index, Follow');
      //
      //   if (header.teamId != null) {
      //       //grab domain for json schema
      //       let domainSite;
      //       if (GlobalSettings.getHomeInfo().isPartner && !GlobalSettings.getHomeInfo().isSubdomainPartner) {
      //           domainSite = "https://" + window.location.hostname + '/' + GlobalSettings.getHomeInfo().partnerName;
      //       } else {
      //           domainSite = "https://" + window.location.hostname;
      //       }
      //
      //       //manually generate team schema for team page until global funcation can be created
      //       let teamSchema = `
      // {
      //   "@context": "http://schema.org",
      //   "@type": "SportsTeam",
      //   "name": "`+ titleName + `",
      // }`;
      //
      //       //manually generate json schema for BreadcrumbList
      //       let jsonSchema = `
      // {
      //   "@context": "http://schema.org",
      //   "@type": "BreadcrumbList",
      //   "itemListElement": [{
      //     "@type": "ListItem",
      //     "position": 1,
      //     "item": {
      //       "@id": "`+ domainSite + "/" + this.scope.toLowerCase() + "/pick-a-team" + `",
      //       "name": "`+ this.scope.toUpperCase() + `"
      //     }
      //   },{
      //     "@type": "ListItem",
      //     "position": 2,
      //     "item": {
      //       "@id": "`+ window.location.href + `",
      //       "name": "`+ titleName + 'Standings' + `"
      //     }
      //   }]
      // }`;
      //       this._seoService.setApplicationJSON(teamSchema, 'page');
      //       this._seoService.setApplicationJSON(jsonSchema, 'json');
      //   }
    }
    ngOnDestroy() {
        // this._seoService.removeApplicationJSON('page');
        // this._seoService.removeApplicationJSON('json');
    }



    private standingsTabSelected(tabData: Array<any>) {
        this.pageParams.scope = this.scope;
        this._standingsService.getStandingsTabData(tabData, this.pageParams, data => {
            this.getLastUpdatedDateForPage(data);
        });
    } //standingsTabSelected



    private standingsFilterSelected(tabData: Array<any>) {
        this.pageParams.scope = this.scope;
        this._standingsService.getStandingsTabData(tabData, this.pageParams, data => {
            this.getLastUpdatedDateForPage(data);
        });
    } //standingsFilterSelected



    private getLastUpdatedDateForPage(data: VerticalStandingsTableData[]) {
        //Getting the first 'lastUpdatedDate' listed in the StandingsData
        if (data && data.length > 0 &&
            data[0].tableData && data[0].tableData.rows &&
            data[0].tableData.rows.length > 0) {
            var lastUpdated = data[0].tableData.rows[0].lastUpdated;
            this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
        }
    } //getLastUpdatedDateForPage
}
