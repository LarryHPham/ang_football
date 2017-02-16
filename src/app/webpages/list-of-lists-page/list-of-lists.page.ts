import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//interfaces
import { DetailListInput } from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import { TitleInputData } from '../../fe-core/components/title/title.component';
import { PaginationParameters } from "../../fe-core/components/pagination-footer/pagination-footer.component";
import { IListOfListsItem } from "../../fe-core/components/list-of-lists-item/list-of-lists-item.component";

//services
import { ListOfListsService } from "../../services/list-of-lists.service";
import { ProfileHeaderService } from '../../services/profile-header.service';
import { SeoService } from "../../seo.service";

declare var moment:any;

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './list-of-lists.page.html'
})

export class ListOfListsPage {
  public partnerID: string;
  public scope: string;
  public pageParams: any;
  private batchLoadIndex: number = 1;
  private showLoading = true;

  errorData             : string;
  detailedDataArray     : Array<IListOfListsItem> = []; //variable that is just a list of the detailed DataArray
  carouselDataArray     : Array<SliderCarouselInput> = [];
  profileName           : string;
  isError               : boolean = false;
  pageType              : string; // [player,team]
  id                    : string; // [playerId, teamId]
  limit                 : string; // pagination limit
  pageNum               : string; // page of pages to show

  paginationSize        : number = 20;
  index                 : number = 0;
  paginationParameters  : PaginationParameters;
  titleData             : TitleInputData;

    constructor(
        private activatedRoute: ActivatedRoute,
        private listService:ListOfListsService,
        private _profileService: ProfileHeaderService,
        private _title: Title,
        private _seoService: SeoService
    ) {
      // check to see if scope is correct and redirect
      // VerticalGlobalFunctions.scopeRedirect(_router, params);
      this.activatedRoute.params.subscribe(
        (param :any)=> {
          //if the activated route changes then reset all important variables
          this.detailedDataArray = [];
          this.carouselDataArray = [];

          this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
          this.partnerID = param['partnerID'];
          this.pageParams = param;

          //determine if a team or league list of list page is needed to be called
          if ( this.pageParams.target == null ) {
            this.pageParams.target = "league";
            this._profileService.getLeagueProfile()
            .subscribe(data => {
              this.getListOfListsPage(this.pageParams, this.batchLoadIndex, GlobalSettings.getImageUrl(data.headerData.leagueLogo));
            }, err => {
              console.log("Error loading profile");
            });
          } else{
            this.getListOfListsPage(this.pageParams, this.batchLoadIndex);
          }
        }
      )
    } //constructor

    getListOfListsPage(urlParams, pageNumber, logoUrl?: string) {
      let self = this;
        this.showLoading = true;
        this.listService.getListOfListsService(urlParams, urlParams.target, "page", pageNumber)
          .finally(() => {
            GlobalSettings.setPreboot();
            this.showLoading = false;
          } ) // call preboot after last piece of data is returned on page
          .subscribe(
            list => {
              if(list){
                if(list.listData.length != 0){
                  list.listData.forEach(function(val, i){
                    self.detailedDataArray.push(val);
                  })
                  list.carData.forEach(function(val, i){
                    self.carouselDataArray.push(val);
                  })
                }
                // this.setPaginationParams(list.pagination);

                var profileName = "League";
                var profileRoute = ['/' + urlParams.scope, 'league'];
                var profileImage = logoUrl ? logoUrl : GlobalSettings.getSiteLogoUrl();

                var listTargetData;

                if (urlParams.target != 'league') {
                  listTargetData = list.targetData[0];
                }
                else {
                  listTargetData = list.targetData;
                }

                switch ( urlParams.target ) {
                  case "player":
                  profileName = listTargetData.playerFirstName + " " + listTargetData.playerLastName;
                  profileRoute = VerticalGlobalFunctions.formatPlayerRoute(this.scope, listTargetData.teamName, profileName, listTargetData.playerId);
                  profileImage = GlobalSettings.getImageUrl(listTargetData.playerHeadshotUrl);
                  break;

                  case "team":
                  profileName = listTargetData.teamName;
                  profileRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, listTargetData.teamName, listTargetData.teamId);
                  profileImage = GlobalSettings.getImageUrl(listTargetData.teamLogo);
                  break;

                  default: break;
                }

                this.profileName = profileName
                this.titleData = {
                  imageURL : profileImage,
                  imageRoute: profileRoute,
                  text1 : 'Last Updated: ' + GlobalFunctions.sntGlobalDateFormatting(list.lastUpdated,'defaultDate'),
                  text2 : ' United States',
                  text3 : 'Top lists - ' + this.profileName,
                  icon: 'fa fa-map-marker'
                };
                this.metaTags(this.titleData);
              }

            },
            err => {
                this.isError= true;
                console.log('Error: ListOfLists API: ', err);
            }
          );
    } //getListOfListsPage

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

    // function to lazy load page sections
    private onScroll(event) {
      let num = GlobalFunctions.lazyLoadOnScroll(event, this.batchLoadIndex);
      if( num != this.batchLoadIndex && !this.showLoading){
        this.batchLoadIndex = num;
        this.getListOfListsPage(this.pageParams, this.batchLoadIndex);
      }
      return;
    }

}
