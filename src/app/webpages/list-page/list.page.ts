import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalFunctions } from "../../global/global-functions";
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//interfaces
import { DetailListInput } from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import { ModuleFooterData, FooterStyle } from '../../fe-core/components/module-footer/module-footer.component';
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import { TitleInputData } from '../../fe-core/components/title/title.component';
// import { PaginationParameters } from '../../fe-core/components/pagination-footer/pagination-footer.component';

//services
import { ListPageService } from '../../services/list-page.service';
import { ProfileHeaderService } from '../../services/profile-header.service';
// import { DynamicWidgetCall } from "../../services/dynamic-list-page.service";
import { SeoService } from "../../seo.service";


@Component({
  selector: 'list-page',
  templateUrl: './list.page.html'
})

export class ListPage {
  public partnerID: string;
  public scope: string;

  public pageParams: any;
  private showLoading = true;
  private batchLoadIndex: number = 1;
  private season: number;

  detailedDataArray: Array<DetailListInput> = [];
  carouselDataArray: Array<SliderCarouselInput> = [];
  footerData: ModuleFooterData;
  profileHeaderData: TitleInputData;
  footerStyle: FooterStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass: "list-footer-btn",
    hasIcon: true,
  };
  paginationParameters: any;
  isError: boolean = false;
  tw: string;
  sw: string;
  input: string;
  sortSeason: Array<any>;
  sortSeasonSelected: string;
  dropdownCounter: number = 0;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private listService: ListPageService,
    private _profileService: ProfileHeaderService,
    // private dynamicWidget: DynamicWidgetCall,
    private _title: Title,
    private _seoService: SeoService
  ) {
    // check to see if scope is correct and redirect
    this.activatedRoute.params.subscribe(
      (param: any) => {
        this.detailedDataArray = [];
        this.carouselDataArray = [];

        this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
        this.partnerID = param['partnerID'];
        this.pageParams = param;
        this.season = param.season ? param.season : null;
        this.getStandardList(this.pageParams, this.batchLoadIndex, this.pageParams.season);
      }
    )
  } //constructor

  //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
  setPaginationParams(input) {

  } //setPaginationParams

  getStandardList(urlParams, pageNum, season?) {
    let self = this;
    var errorMessage = "Sorry, we do not currently have any data for this list";
    this.showLoading = true;
    this.listService.getListPageService(urlParams, errorMessage, this.scope, pageNum, season)
      .finally(() => {
        GlobalSettings.setPreboot();
        this.showLoading = false;
      }) // call preboot after last piece of data is returned on page
      .subscribe(
      list => {
        if (list) {
          this.profileHeaderData = list.profHeader;
          var navigationParams = {
            target: this.pageParams.target,
            statName: this.pageParams.statName,
            season: this.pageParams.season,
            ordering: this.pageParams.ordering,
          };
          this.paginationParameters = navigationParams;


          this.metaTags(this.profileHeaderData);
          if (list.listData.length != 0) {//makes sure it only runs once
            list.listData.forEach(function(val, i) {
              self.detailedDataArray.push(val);
            })
            list.carData.forEach(function(val, i) {
              self.carouselDataArray.push(val);
            })
          }
          // this.setPaginationParams(list.pagination);
          this.sortSeason = list.seasons;
          this.sortSeasonSelected = season;
        }
      },
      err => {
        this.isError = true;
        console.log('Error: list API: ', err);
        // this.isError = true;
      });
  } //getStandardList

  private metaTags(data) {
    //This call will remove all meta tags from the head.
    this._seoService.removeMetaTags();
    //create meta description that is below 160 characters otherwise will be truncated
    let text3 = data.text3 != null ? data.text3 : '';
    let text4 = data.text4 != null ? '. ' + data.text4 : '';
    let title = text3 + ' ' + text4;
    let metaDesc = text3 + ' ' + text4 + ' as of ' + data.text1;
    let imageUrl;
    if (data.imageURL != null && data.imageURL != "") {
      imageUrl = data.imageURL;
    } else {
      imageUrl = GlobalSettings.getmainLogoUrl();
    }
    this._seoService.setTitle(title);
    this._seoService.setMetaDescription(metaDesc);
    this._seoService.setCanonicalLink();
    this._seoService.setMetaRobots('INDEX, FOLLOW');
    this._seoService.setOgTitle(title);
    this._seoService.setOgDesc(metaDesc + ". Know more about football.");
    this._seoService.setOgType('Website');
    this._seoService.setOgUrl();
    this._seoService.setOgImage(imageUrl);
  } //metaTags

  newIndex(index) {
    this.pageParams.pageNumber = index;
  } //newIndex

  dropdownChanged(event) {
      this.paginationParameters['season'] = event;
      var navigationPage = VerticalGlobalFunctions.getWhiteLabel() + '/' + this.pageParams.scope + '/list';

      let route = [navigationPage];

      for(var obj in this.paginationParameters){
        route.push(this.paginationParameters[obj]);
      };
      this._router.navigate(event);
      //':scope/list/:target/:statName/:season/:ordering/:perPageCount/:pageNumber'
      // this.getStandardList(this.pageParams, this.batchLoadIndex, event);
  } //dropdownChanged

  // function to lazy load page sections
  private onScroll(event) {
    let num = GlobalFunctions.lazyLoadOnScroll(event, this.batchLoadIndex);
    if (num != this.batchLoadIndex && !this.showLoading) {
      this.batchLoadIndex = num;
      this.getStandardList(this.pageParams, this.batchLoadIndex, this.season);
    }
    return;
  }
}
