import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalFunctions } from '../../global/global-functions';
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//interfaces
import { NavigationData, Link } from '../../global/global-interface';
import { DirectoryItems, DirectoryModuleData } from '../../fe-core/modules/directory/directory.data';
import { DirectoryModule } from '../../fe-core/modules/directory/directory.module';
import { PaginationParameters } from '../../fe-core/components/pagination-footer/pagination-footer.component';

//services
import { DirectoryService, DirectoryType, DirectorySearchParams } from '../../services/directory.service';
import { FooterService } from '../../services/footer.service';
import { SeoService } from "../../seo.service";
import {isBrowser} from "angular2-universal";



@Component({
    selector: 'Directory-page',
    templateUrl: './directory.page.html'
})

export class DirectoryPage {
  public data: DirectoryModuleData;

  public partnerID:string;
  public scope: string;
  public startsWith: string;
  public type: string;
  public page: string;
  public pageParams: any;

  public currentPage: number = 1;
  public newlyAdded: boolean = false;
  public listingsLimit: number = 20;
  public maxPages: number;
  public isError: boolean = false;
  public pageType: DirectoryType;
  public _sportLeagueAbbrv: string;

  public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
  public collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();

  paginationParameters:PaginationParameters;

  navLists: Array<Link>;

  constructorControl:boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _footerService: FooterService,
    private _directoryService: DirectoryService,
    private _title: Title,
    private _seoService: SeoService
  ) {
    // check to see if scope is correct and redirect
    // VerticalGlobalFunctions.scopeRedirect(_router, params);
    this.activatedRoute.params.subscribe(
      (param :any)=> {
        this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
        this.partnerID = param['partnerID'];
        this.type = param['type'];
        this.startsWith = param['startsWith'];
        this.page = param['page'];

        this.currentPage = Number(this.page);

        this.pageParams = {
          scope: this.scope,
          type: this.type,
          startsWith: this.startsWith,
          page: this.page
        } //pageParams

        if (this.scope == 'fbs') {
          this._sportLeagueAbbrv = GlobalSettings.getCollegeDivisionFullAbbrv();
        } else {
          this._sportLeagueAbbrv = GlobalSettings.getSportLeagueAbbrv();
        }

        switch ( this.type ) {
          case "players":
          this.pageType = DirectoryType.players;
          this.getNav(this._sportLeagueAbbrv, "player");
          break;

          case "teams":
          this.pageType = DirectoryType.teams;
          this.getNav(this._sportLeagueAbbrv, "team");
          break;

          default:
          this.pageType = DirectoryType.none;
          break;
        }

        if ( this.startsWith !== undefined && this.startsWith !== null ) {
          this.newlyAdded = this.startsWith.toLowerCase() === "new";
          this.startsWith = !this.newlyAdded && this.startsWith.length > 0 ? this.startsWith[0] : undefined;
        }

        if ( this.currentPage === 0 ) {
          this.currentPage = 1; //page index starts at one
        }
      }
    )





    this.metaTags();
    this.constructorControl = false;
  } //constructor



  private metaTags() {
    //This call will remove all meta tags from the head.
    this._seoService.removeMetaTags();
    let startsWith = this.startsWith;
    if ( startsWith !== undefined && startsWith !== null ) {
      this.newlyAdded = startsWith.toLowerCase() === "new";
      this.startsWith = !this.newlyAdded && startsWith.length > 0 ? startsWith[0] : undefined;
    }

    //create meta description that is below 160 characters otherwise will be truncated
    let metaDesc = 'Directory of all the players and team profiles for the NFL and NCAAF starting with the letter ' + startsWith.toUpperCase();
    let title = this.type.charAt(0).toUpperCase() + this.type.slice(1) + ' Directory: ' + startsWith.toUpperCase();
    let image = GlobalSettings.getmainLogoUrl();
    this._seoService.setTitle(title);
    this._seoService.setMetaDescription(metaDesc);
    this._seoService.setCanonicalLink();
    this._seoService.setMetaRobots('INDEX, FOLLOW');
    this._seoService.setOgTitle(title);
    this._seoService.setOgDesc(metaDesc);
    this._seoService.setOgType('Website');
    this._seoService.setOgUrl();
    this._seoService.setOgImage(image);
  } //metaTags



  getDirectoryData() {
    let params: DirectorySearchParams = {
      page: this.currentPage,
      listingsLimit: this.listingsLimit,
      startsWith: this.startsWith,
      newlyAdded: this.newlyAdded
    }
    this._directoryService.getData(this.scope, this.pageType, params)
      .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
      .subscribe(
          data => this.setupData(data),
          err => {
              console.log('Error - Getting directory listings: ', err);
              this.isError = true;
          }
      );
  } //getDirectoryData



  setPaginationParams(input) {
      var info = input;
      var params = this.pageParams;
      //path: '/directory/:type/:startsWith/page/:page',
      var navigationParams = {
        type: params['type'],
        startsWith:this.startsWith,
        page: 'page'
      };
      let scopeLink = this.scope.toLowerCase() == this.collegeDivisionAbbrv.toLowerCase() ?
                      this.collegeDivisionFullAbbrv.toLowerCase() :
                      this.scope.toLowerCase();

      var navigationPage = '/' + scopeLink + '/directory';
      let max = Math.ceil(info.totalItems/this.listingsLimit);
      this.paginationParameters = {
        index: params['page'] != null ? Number(params['page']) : null,
        max: max,
        paginationType: 'page',
        navigationPage: navigationPage,
        navigationParams: navigationParams,
        indexKey: 'pageNumber'
      };
  } //setPaginationParams



  newIndex(index){
    this.currentPage = index;
  } //newIndex



  setupData(listings: DirectoryItems) {
    let pageParams = {
      type: DirectoryType[this.pageType]
    };

    let lowerCaseType = "";
    let titleCaseType = "";

    switch ( this.pageType ) {
      case DirectoryType.players:
        lowerCaseType = "player";
        titleCaseType = "Player";
        break;

      case DirectoryType.teams:
        lowerCaseType = "team";
        titleCaseType = "Team";
        break;

      default:
        lowerCaseType = "[type]";
        titleCaseType = "[Type]";
        break;
    }
    let directoryListTitle = "Latest " + this._sportLeagueAbbrv + " " + titleCaseType + " Profiles in the Nation.";
    let noResultsMessage = "Sorry, there are no results for " + titleCaseType + "s";
    let pagingDescription = titleCaseType + " profiles";
    let navTitle = "Browse all " + lowerCaseType + " profiles from A to Z";
    let pageName = "Directory-page-starts-with";

    if ( this.startsWith !== undefined && this.startsWith !== null && this.startsWith.length > 0 ) {
      pageParams["startsWith"] = this.startsWith;
      noResultsMessage = "Sorry, there are no results for " + titleCaseType + "s starting with the letter '" + this.startsWith + "'";
    }
    let data:DirectoryModuleData = {
      pageName: pageName,
      breadcrumbList: [{
        text: "United States"
      }],
      directoryListTitle: directoryListTitle,
      hasListings: false,
      noResultsMessage: noResultsMessage,
      listingItems: null,
      listingsLimit: this.listingsLimit,
      navigationData: {
        title: navTitle,
        links: this.navLists ? this.navLists : null
      },
      pagingDescription: pagingDescription,
      pageParams: pageParams
    };

    if(listings !== undefined && listings !== null ) {
      // this.setupPaginationParameters(data);
      data.hasListings = listings.items.length > 0;
      data.listingItems = listings;
    }
    else {
      data.hasListings = false;
      data.listingItems = null;
    }

    this.data = data;

    //generate pagingation parameters for pagination footer
    this.setPaginationParams(listings);
  } //setupData



  getNav(scope, profile) {
    this._footerService.getFooterService(scope, profile)
    .subscribe(data => {
      this.navLists = data;
      this.getDirectoryData();
    },
    err => {
      console.log("Error getting navigation data");
    });
  } //getNav
}
