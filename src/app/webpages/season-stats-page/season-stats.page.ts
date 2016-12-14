import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
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
    templateUrl: './app/webpages/season-stats-page/season-stats.page.html'
})

export class SeasonStatsPage implements OnInit {
  public paramsub: any;
  public partnerID: string;
  public scope: string;
  public playerID: number;
  public pageParams: SportPageParameters = {}

  public widgetPlace: string = "widgetForPage";
  public tabs: Array<SportSeasonStatsTabData>;

  public profileLoaded: boolean = false;

  public hasError: boolean = false;

  public titleData: TitleInputData;

    constructor(
      private activatedRoute: ActivatedRoute,
      private _profileService: ProfileHeaderService,
      private _seasonStatsPageService: SeasonStatsPageService,
      private _title: Title,
      private _seoService: SeoService
    ) {
      this.paramsub = this.activatedRoute.params.subscribe(
        (param :any)=> {
          this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
          this.partnerID = param['partnerID'];
          this.playerID = param["playerID"];
          this.pageParams.playerId = Number(this.playerID);
        }
      )
    } //constructor



    ngOnInit() {
        if (this.pageParams.playerId) {
            this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
                data => {
                    this.profileLoaded = true;
                    this.pageParams = data.pageParams;
                    this.pageParams['scope'] = this.scope;
                    // this._title.setTitle(GlobalSettings.getPageTitle("Season Stats", data.headerData.playerFullName));
                    this.setupTitleData(data.fullProfileImageUrl, data.headerData.teamFullName, data.pageParams.playerId.toString(), data.headerData.playerFullName);
                    this.tabs = this._seasonStatsPageService.initializeAllTabs(this.pageParams);
                },
                err => {
                    this.hasError = true;

                    console.log("Error getting season stats data: " + err);
                }
            );
        }
    } //ngOnInit



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
        this._seasonStatsPageService.getSeasonStatsTabData(tab, this.pageParams, data => {
            this.getLastUpdatedDateForPage(data);
        });
    } //seasonStatsTabSelected



    private getLastUpdatedDateForPage(data: SportSeasonStatsTableData[]) {
        if (data && data.length > 0 &&
            data[0].tableData && data[0].tableData.rows &&
            data[0].tableData.rows.length > 0) {
            var lastUpdated = data[0].tableData.rows[0].lastUpdated;
            this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
        }
    } //getLastUpdatedDateForPage
}
