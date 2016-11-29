import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalFunctions } from "../../global/global-functions";
import { GlobalSettings } from "../../global/global-settings";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

//interfaces
import { DetailListInput } from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import { ModuleFooterData, FooterStyle } from '../../fe-core/components/module-footer/module-footer.component';
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import { TitleInputData } from '../../fe-core/components/title/title.component';
import { PaginationParameters } from '../../fe-core/components/pagination-footer/pagination-footer.component';

//services
import { ListPageService } from '../../services/list-page.service';
import { ProfileHeaderService } from '../../services/profile-header.service';
import { DynamicWidgetCall } from "../../services/dynamic-list-page.service";


@Component({
    selector: 'list-page',
    templateUrl: './app/webpages/list-page/list.page.html'
})

export class ListPage implements OnInit {
  public partnerID: string;
  public scope: string;
  public target: string;
  public statName: string;
  public season: string;
  public ordering: string;
  public perPageCount: number;
  public pageNumber: number;
  public query: string;
  public pageParams: any;

    detailedDataArray: Array<DetailListInput>;
    carouselDataArray: Array<SliderCarouselInput>;
    footerData: ModuleFooterData;
    profileHeaderData: TitleInputData;
    footerStyle: FooterStyle = {
        ctaBoxClass: "list-footer",
        ctaBtnClass: "list-footer-btn",
        hasIcon: true,
    };
    paginationParameters: PaginationParameters;
    isError: boolean = false;
    tw: string;
    sw: string;
    input: string;
    sortSeason: Array<any>;
    sortSeasonSelected: string;
    dropdownCounter: number = 0;

    constructor(
        private activatedRoute: ActivatedRoute,
        private listService: ListPageService,
        private _profileService: ProfileHeaderService,
        private dynamicWidget: DynamicWidgetCall,
        private _title: Title
    ) {
      // check to see if scope is correct and redirect
      // VerticalGlobalFunctions.scopeRedirect(_router, params);
      this.activatedRoute.params.subscribe(
        (param :any)=> {
          this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
          this.partnerID = param['partnerID'];
          this.target = param['target'];
          this.statName = param['statName'];
          this.season = param['season'];
          this.ordering = param['ordering'];
          this.perPageCount = param['perPageCount'];
          this.pageNumber = param['pageNumber'];
          this.query = param['query'];
        }
      )

      this.pageParams = {
        scope: this.scope,
        target: this.target,
        statName: this.statName,
        season: this.season,
        ordering: this.ordering,
        perPageCount:this.perPageCount,
        pageNumber: this.pageNumber,
        query: this.query
      }

      if ( this.query != null ) {
          let query = this.query;
          // Setup this way in case we want to switch out null with some default values
          let twArr = query.match(/tw-(.*?)(\+|$)/);
          this.tw = twArr != null && twArr.length > 1 ? twArr[1] : null;
          let swArr = query.match(/sw-(.*?)(\+|$)/);
          this.sw = swArr != null && swArr.length > 1 ? swArr[1] : null;
          // input always needs to be last item
          let inputArr = query.match(/input-(.*)/);
          this.input = inputArr != null && inputArr.length > 1 ? inputArr[1] : null;
          this.pageNumber = 1;
      }
    } //constructor



    getListPage(urlParams) {
      if (urlParams.query != null) {
        this.getDynamicList();
      } else {
        this.getStandardList(urlParams, urlParams.season);
      }
    } //getListPage



    //PAGINATION
    //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
    setPaginationParams(input) {
        var info = input.listInfo;
        var navigationParams = {
            pageNumber: this.pageNumber,
            statName: this.statName,
            season: this.season,
            ordering: this.ordering,
            perPageCount: this.perPageCount,
            target: this.target,
        };
        var navigationPage = this.detailedDataArray ? "List-page" : "Error-page";

        this.paginationParameters = {
            index: this.pageNumber != null ? Number(this.pageNumber) : null,
            max: Number(input.pageCount),
            paginationType: 'page',
            navigationPage: navigationPage,
            navigationParams: navigationParams,
            indexKey: 'pageNumber'
        };
    } //setPaginationParams



    setDynamicPagination(input) {
        var navigationParams = {
            query: this.query
        };

        var navigationPage = this.detailedDataArray ? "Dynamic-list-page" : "Error-page";

        this.paginationParameters = {
            index: this.pageNumber,
            max: Number(input.pageCount),
            paginationType: 'page',
            navigationPage: navigationPage,
            navigationParams: navigationParams,
            indexKey: 'pageNum'
        };
    } //setDynamicPagination



    getStandardList(urlParams, season?) {
        var errorMessage = "Sorry, we do not currently have any data for this list";
        this.listService.getListPageService(urlParams, errorMessage, this.scope, season)
            .subscribe(
            list => {
                // this._title.setTitle(GlobalSettings.getPageTitle(list.listDisplayName, "Lists"));
                this.profileHeaderData = list.profHeader;
                if (list.listData.length == 0) {//makes sure it only runs once
                    this.detailedDataArray = null;
                } else {
                    this.detailedDataArray = list.listData;
                }
                this.setPaginationParams(list.pagination);
                this.carouselDataArray = list.carData;
                this.sortSeason = list.seasons;
                this.sortSeasonSelected = season;
            },
            err => {
                this.isError = true;
                console.log('Error: list API: ', err);
                // this.isError = true;
            }
            );
    } //getStandardList



    getDynamicList() {
        if (!this.tw) {
            // Not enough parameter : display error message
            this.isError = true;
            return;
        }
        this.dynamicWidget.getWidgetData(this.tw, this.sw, this.input)
            .subscribe(
            list => {
                // this._title.setTitle(GlobalSettings.getPageTitle(list.listDisplayTitle, "Lists"));
                this.profileHeaderData = list.profHeader;
                if (list.listData.length == 0) {//makes sure it only runs once
                    this.detailedDataArray = null;
                } else {
                    this.detailedDataArray = list.listData;
                }
                this.setDynamicPagination(list.pagination);
                this.carouselDataArray = list.carData;
            },

            err => {
                this.isError = true;
                console.log(err);
            }
            );
    } //getDynamicList



    newIndex(index) {
        // this.pageNumber = index;
        // window.scrollTo(0, 0);
    } //newIndex



    ngOnInit() {
        this._profileService.getLeagueProfile()
            .subscribe(data => {
                this.getListPage(this.pageParams);
            }, err => {
                console.log("Error loading profile");
            });
        var date = new Date();
        var dateStr = (Number(date.getFullYear()) - 1).toString() + " / " + date.getFullYear();
        this.sortSeason = [
            { key: (Number(date.getFullYear()) - 1).toString(), value: dateStr }
        ];
    } //ngOnInit



    dropdownChanged(event) {
        if (this.dropdownCounter > 0) {
            this.getStandardList(this.pageParams, event);
        }
        this.dropdownCounter++;
    } //dropdownChanged
}
