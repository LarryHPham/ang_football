import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from '@angular/platform-browser';

//global functions
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//service
import { TransactionsService } from '../../services/transactions.service';
import { ProfileHeaderService } from '../../services/profile-header.service';
import { SeoService } from "../../seo.service";

//interface
import { TitleInputData } from '../../fe-core/components/title/title.component';
import { TransactionTabData } from '../../fe-core/components/transactions/transactions.component';
import { SportPageParameters } from '../../global/global-interface';
import { PaginationParameters } from '../../fe-core/components/pagination-footer/pagination-footer.component';

//libraries
declare var moment: any;



@Component({
    selector: 'transactions-page',
    templateUrl: './app/webpages/transactions-page/transactions.page.html',
})

export class TransactionsPage implements OnInit {
  public scope: string;
  public partnerID: string;
  public teamNameParam: string;
  public teamIdParam: string;
  public limitParam: string;
  public pageNumParam: string;
  public transactionTypeParam: string;
  public paramsub: any;

  profileHeaderData: TitleInputData;
  pageParams: SportPageParameters;

  tabs: Array<TransactionTabData>;

  isError: boolean = false;
  profileName: string;
  sort: string = "desc";
  limit: number;
  pageNum: number;
  selectedTabKey: string;
  listSort: string = "recent";

  transactionsActiveTab: any;
  transactionsData: TransactionTabData;
  transactionFilter1: Array<any>;
  dropdownKey1: string;

  paginationParameters: PaginationParameters;
  selectedTabName: string;

  public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
  public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();

    constructor(
        private router: Router,
        private activateRoute: ActivatedRoute,
        private _transactionsService: TransactionsService,
        private _profileService: ProfileHeaderService,
        private _title: Title,
        private _seoService: SeoService
    ) {
      // this.paramsub = this.activateRoute.params.subscribe(
      //   (param :any)=> {
      //     this.transactionTypeParam = param["type"];
      //     this.teamNameParam = param["teamName"];
      //     this.teamIdParam = param["teamId"];
      //     this.limit = Number(param['limit']);
      //     this.pageNum = Number(param['pageNum']);
      //
      //     //check to see if scope is correct and redirect
      //     this.pageParams = {
      //       teamId: this.teamIdParam ? Number(this.teamIdParam) : null
      //     }
      //
      //     if (this.pageNum === 0) {
      //         this.pageNum = 1; //page index starts at one
      //     }
      //   }
      // )
    } //constructor



    ngOnInit() {
        // this.getProfileInfo();
        // this.selectedTabName = GlobalFunctions.capitalizeFirstLetter(this.transactionTypeParam); // use this function to match url param with display title of tabs
    } //ngOnInit



    // private metaTags(data) {
    //   //create meta description that is below 160 characters otherwise will be truncated
    //   let text3 = data.text3 != null ? data.text3: '';
    //   let text4 = data.text4 != null ? '. '+data.text4: '';
    //   let title = text3 + ' ' + text4;
    //   let metaDesc = text3 + ' ' + text4 + ' as of ' + data.text1;
    //   let link = window.location.href;
    //   let imageUrl;
    //   if(data.imageURL != null && data.imageURL != ""){
    //      imageUrl = data.imageURL;
    //   }else{
    //      imageUrl = GlobalSettings.getmainLogoUrl();
    //   }
    //   this._seoService.setCanonicalLink();
    //   this._seoService.setOgTitle(title);
    //   this._seoService.setOgDesc(metaDesc +". Know more about football.");
    //   this._seoService.setOgType('Website');
    //   this._seoService.setOgUrl();
    //   this._seoService.setOgImage(imageUrl);
    //   this._seoService.setTitle(title);
    //   this._seoService.setMetaDescription(metaDesc);
    //   this._seoService.setMetaRobots('INDEX, FOLLOW');
    // } //metaTags



    getProfileInfo() {
      // if (this.pageParams.teamId) {
      //     this._profileService.getTeamProfile(this.pageParams.teamId)
      //         .subscribe(
      //         data => {
      //             //var stats = data.headerData.stats;
      //             var profileHeaderData = this._profileService.convertTeamPageHeader(this.scope, data, "");
      //             this.profileName = data.headerData.teamMarket + " " + data.headerData.teamName;
      //             this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));
      //             this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
      //             profileHeaderData.text3 = this.selectedTabName + ' - ' + this.profileName;
      //             this.profileHeaderData = profileHeaderData;
      //             this.metaTags(this.profileHeaderData);
      //
      //             var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, data.teamName, this.pageParams.teamId.toString());
      //         },
      //         err => {
      //             this.isError = true;
      //             console.error('Error: transactionsData Profile Header API: ', err);
      //             // this.isError = true;
      //         }
      //         );
      // }
      // else {
      //     this._profileService.getLeagueProfile()
      //         .subscribe(
      //         data => {
      //             this.profileName = this.scope.toUpperCase();
      //             var profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, "");
      //             this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));
      //
      //             this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
      //             profileHeaderData.text3 = this.selectedTabName + ' - ' + this.profileName;
      //             this.profileHeaderData = profileHeaderData;
      //             this.metaTags(this.profileHeaderData);

      //             var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, this.profileName, null);
      //         },
      //         err => {
      //             this.isError = true;
      //             console.error('Error: transactionsData Profile Header API: ', err);
      //             // this.isError = true;
      //         }
      //         )
      // }
    } //getProfileInfo()



    getTransactionsPage() { // Get data based on selected tab
        // var matchingTabs = this.tabs.filter(tab => tab.tabDisplay == this.selectedTabName);
        //
        // if (matchingTabs.length > 0) {
        //     var tab = matchingTabs[0];
        //
        //     this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'page', this.dropdownKey1, 'desc', this.limit, this.pageNum)
        //         .subscribe(
        //         transactionsData => {
        //             if (this.transactionFilter1 == undefined) {
        //                 this.transactionFilter1 = transactionsData.yearArray;
        //                 if (this.dropdownKey1 == null) {
        //                     this.dropdownKey1 = this.transactionFilter1[0].key;
        //                 }
        //             }
        //
        //             this.setPaginationParams(transactionsData);
        //         }, err => {
        //             console.log("Error loading transaction data");
        //         })
        // }
    } //getTransactionsPage()



    transactionsTab(tab) { // set selected tab and route page if necessary
        // var tabRoute;
        // var tabNameFrom = this.selectedTabName; // capture previous value before changing it
        // var tabNameTo = tab.tabDisplay; // newly selected tab
        // this.selectedTabName = tab.tabDisplay;
        //
        // if (tabNameTo != tabNameFrom) { // check if clicked tab is already active
        //     if (this.teamIdParam) {
        //         tabRoute = ["Transactions-page", { teamName: this.teamNameParam, teamId: this.teamIdParam, limit: this.limit, pageNum: 1, type: tab.tabDataKey }];
        //         this.router.navigate(tabRoute);
        //     }
        //     else {
        //         tabRoute = ['Transactions-tdl-page', { limit: 20, pageNum: 1, type: tab.tabDataKey }];
        //         this.router.navigate(tabRoute);
        //     }
        // }
        //
        //
        // this.transactionsActiveTab = tab;
        // this.getTransactionsPage();
    } //transactionsTab(tab)



    transactionsFilterDropdown(filter) {
        // if (this.transactionsActiveTab == null) {
        //     this.transactionsActiveTab = this.transactionsData[0];
        // }
        // this.dropdownKey1 = filter;
        //
        // this.getTransactionsPage();
    } //transactionsFilterDropdown(filter)



    setPaginationParams(input) {
        // var params = this.activateRoute.params; //TODO
        //
        // //path: '/directory/:type/:startsWith/page/:page',
        // var navigationParams = {
        //     limit: params['limit'],
        //     pageNum: params['pageNum']
        // };
        //
        // if (params['scope'] != null) {
        //     navigationParams['scope'] = params['scope'];
        // }
        //
        // if (params['teamId'] != null) {
        //     navigationParams['teamId'] = params['teamId'];
        // }
        //
        // if (params['teamName'] != null) {
        //     navigationParams['teamName'] = params['teamName'];
        // }
        //
        // if (params['type'] != null) {
        //     navigationParams['type'] = params['type'];
        // }
        //
        // var navigationPage = params['teamId'] != null ? 'Transactions-page' : 'Transactions-tdl-page';
        // let max = Math.ceil(input.totalTransactions / this.limit); //NEED Number of entries from API
        //
        // this.paginationParameters = {
        //     index: params['pageNum'] != null ? Number(params['pageNum']) : null,
        //     max: max,
        //     paginationType: 'page',
        //     navigationPage: navigationPage,
        //     navigationParams: navigationParams,
        //     indexKey: 'pageNum'
        // }
    } //setPaginationParams(input)
}
