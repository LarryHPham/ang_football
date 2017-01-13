import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

//globals
import { GlobalFunctions } from '../../global/global-functions';
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { ProfileHeaderService } from '../../services/profile-header.service';
import { SeoService } from "../../seo.service";

//interfaces
import { IProfileData } from "../../fe-core/modules/profile-header/profile-header.module";
import { TitleInputData } from '../../fe-core/components/title/title.component';

@Component({
    selector: 'draft-history-page',
    templateUrl: './draft-history.page.html'
})

export class DraftHistoryPage implements OnInit {
    public partnerID: string;
    public scope: string;
    public teamID: number;
    public teamName: string;
    public paramsub: any;

    private whatProfile: string = "Draft History";
    private profileHeaderData: TitleInputData;
    private profileData: IProfileData;
    private isError: boolean = false;

    constructor(
        private activateRoute: ActivatedRoute,
        private _profileService: ProfileHeaderService,
        private _title: Title,
        private _seoService: SeoService
    ) {
        this.paramsub = this.activateRoute.params.subscribe(
            (param: any) => {
              this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
              this.partnerID = param['partnerID'];
              this.teamName = param['teamName'];
              this.teamID = param['teamID'];
            }
        ) //this.paramsub
    } //constructor



    ngOnInit() {
        let teamId = null;
        if (this.teamID != null) {
            teamId = Number(this.teamID);
        }

        if (teamId) {
            this._profileService.getTeamProfile(teamId)
              .finally(() => GlobalFunctions.setPreboot() ) // call preboot after last piece of data is returned on page
              .subscribe(
              data => {
                  // this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.teamName));
                  data.profileName = data.headerData.teamMarket ? data.headerData.teamMarket + " " + data.profileName : data.profileName;
                  var pageNameForTitle = this.whatProfile + " - " + data.profileName;
                  this.profileHeaderData = this._profileService.convertTeamPageHeader(this.scope, data, pageNameForTitle);
                  this.profileData = data;
                  this.metaTags(this.profileHeaderData);
              },
              err => {
                this.isError = true;
                console.log('Error: draftData Profile Header API: ', err);
              }
            );
        }
        else {
            this._profileService.getLeagueProfile()
              .finally(() => GlobalFunctions.setPreboot() ) // call preboot after last piece of data is returned on page
              .subscribe(
              data => {
                  // this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.headerData.leagueAbbreviatedName));
                  this.profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, data.headerData.leagueAbbreviatedName + ' ' + this.whatProfile);
                  this.profileData = data;
                  this.metaTags(this.profileHeaderData);
              },
              err => {
                  this.isError = true;
                  console.log('Error: draftData Profile Header API: ', err);
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
      let imageUrl;
      if(data.imageURL != null && data.imageURL != ""){
         imageUrl = data.imageURL;
      }else{
         imageUrl = GlobalSettings.getmainLogoUrl();
      }
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaRobots('INDEX, FOLLOW');
      this._seoService.setOgTitle(title);
      this._seoService.setOgDesc(metaDesc +". Know more about football.");
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl();
      this._seoService.setOgImage(imageUrl);
    } //metaTags
}
