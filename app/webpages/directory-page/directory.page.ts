import {Component} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalFunctions} from '../../global/global-functions';
import {GlobalSettings} from "../../global/global-settings";
import {NavigationData, Link} from '../../global/global-interface';
import {DirectoryService, DirectoryType, DirectorySearchParams} from '../../services/directory.service';
import {PagingData, DirectoryProfileItem, DirectoryItems, DirectoryModuleData} from '../../fe-core/modules/directory/directory.data';
import {DirectoryModule} from '../../fe-core/modules/directory/directory.module';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {FooterService} from '../../services/footer.service';
import {PaginationFooter, PaginationParameters} from '../../fe-core/components/pagination-footer/pagination-footer.component';
import {SeoService} from "../../seo.service";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

@Component({
    selector: 'Directory-page',
    templateUrl: './app/webpages/directory-page/directory.page.html',
    directives: [PaginationFooter, SidekickWrapper, DirectoryModule],
    providers: [DirectoryService, Title, FooterService]
})

export class DirectoryPage {
  public data: DirectoryModuleData;

  public partnerID:string;
  public scope: string;

  public currentPage: number = 1;

  public startsWith: string;

  public newlyAdded: boolean = false;

  public listingsLimit: number = 20;

  public maxPages: number;

  public isError: boolean = false;

  public pageType: DirectoryType;

  public _sportLeagueAbbrv: string;

  paginationParameters:PaginationParameters;

  navLists: Array<Link>;

  constructorControl:boolean = true;

  constructor(
    private _footerService: FooterService,
    private _params: RouteParams,
    private _directoryService: DirectoryService,
    private _title: Title,
    private _router: Router,
    private _seoService: SeoService
  ) {
    //check to see if scope is correct and redirect
    VerticalGlobalFunctions.scopeRedirect(_router, _params);
    GlobalSettings.getParentParams(_router, parentParams => {
      if(this.constructorControl){
        this.partnerID = parentParams.partnerID;
        this.scope = parentParams.scope;
        var page = _params.get("page");
        this.currentPage = Number(page);
        var type = _params.get("type");
        if(this.scope == 'fbs'){
          this._sportLeagueAbbrv = GlobalSettings.getCollegeDivisionFullAbbrv();
        } else {
          this._sportLeagueAbbrv = GlobalSettings.getSportLeagueAbbrv();
        }
        switch ( type ) {
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

        let startsWith = _params.get("startsWith");
        if ( startsWith !== undefined && startsWith !== null ) {
          this.newlyAdded = startsWith.toLowerCase() === "new";
          this.startsWith = !this.newlyAdded && startsWith.length > 0 ? startsWith[0] : undefined;
        }

        if ( this.currentPage === 0 ) {
          this.currentPage = 1; //page index starts at one
        }

        //create meta description that is below 160 characters otherwise will be truncated
        let metaDesc = 'Directory of all the players and team profiles for the NFL and NCAAF starting with the letter ' + startsWith.toUpperCase();
        let link = window.location.href;
        let title = type.charAt(0).toUpperCase() + type.slice(1) + ' Directory';

        this._seoService.setCanonicalLink(this._params.params, this._router);
        this._seoService.setOgTitle(title + ' - ' + startsWith);
        this._seoService.setOgDesc(metaDesc);
        this._seoService.setOgType('image');
        this._seoService.setOgUrl(link);
        this._seoService.setOgImage('https://touchdownloyal.com/app/public/mainLogo.jpg');
        this._seoService.setTitle(title);
        this._seoService.setMetaDescription(metaDesc);
        this._seoService.setMetaRobots('INDEX, FOLLOW');

        this.constructorControl = false;
      }
    });
  }

  getDirectoryData() {
    window.scrollTo(0, 0);

    let params: DirectorySearchParams = {
      page: this.currentPage,
      listingsLimit: this.listingsLimit,
      startsWith: this.startsWith,
      newlyAdded: this.newlyAdded
    }
    this._directoryService.getData(this.scope, this.pageType, params)
      .subscribe(
          data => this.setupData(data),
          err => {
              console.log('Error - Getting directory listings: ', err);
              this.isError = true;
          }
      );
  }

  setPaginationParams(input) {
      var info = input;
      var params = this._params.params;
      //path: '/directory/:type/:startsWith/page/:page',
      var navigationParams = {
        type: params['type'],
        startsWith:this.startsWith,
        page: this.currentPage,
      };

      var navigationPage = this.data ? "Directory-page-starts-with" : "Error-page";
      let max = Math.ceil(info.totalItems/this.listingsLimit);
      this.paginationParameters = {
        index: params['page'] != null ? Number(params['page']) : null,
        max: max,
        paginationType: 'page',
        navigationPage: navigationPage,
        navigationParams: navigationParams,
        indexKey: 'page'
      };
  }

  newIndex(index){
    this.currentPage = index;
    window.scrollTo(0, 0);
  }


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
    ;
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
  }

  getNav(scope, profile) {
    this._footerService.getFooterService(scope, profile)
    .subscribe(data => {
      this.navLists = data;
      this.getDirectoryData();
    },
    err => {
      console.log("Error getting navigation data");
    });
  }
}
