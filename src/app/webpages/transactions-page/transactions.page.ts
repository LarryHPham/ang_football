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
    templateUrl: './transactions.page.html',
})

export class TransactionsPage {
  public scope: string;
  public partnerID: string;
  public tabParam: any;
  public filter1Param: any;
  public teamNameParam: string;
  public teamIdParam: number;
  public limitParam: number;
  public paramsub: any;
  public storedPartnerParam: string;
  public seasonBase: string;

  profileHeaderData: TitleInputData;
  pageParams: any;

  tabs: Array<TransactionTabData>;

  isError: boolean = false;
  profileName: string;
  sort: string = "desc";
  listSort: string = "recent";
  selectedTabKey: string;

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
        this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
        this.paramsub = this.activateRoute.params.subscribe(
            (param :any)=> {
                let route = this.router.url.split('/');
                this.pageParams = param;
                if(this.storedPartnerParam != ''){
                    this.selectedTabName = GlobalFunctions.capitalizeFirstLetter(route[3]);
                } else {
                    this.selectedTabName = GlobalFunctions.capitalizeFirstLetter(route[2]);
                }

                this.scope = param.scope;
                this.tabParam = this.selectedTabName;
                this.filter1Param = param.filter1;
                this.teamNameParam = param.teamName;
                this.teamIdParam = param.teamId;
                this.limitParam = param.limit;
                this.getProfileInfo();
            }
        )
    } //constructor



    ngOnDestroy(){
      this.paramsub.unsubscribe();
    } //ngOnDestroy



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



    getProfileInfo() {
      if (this.pageParams.teamId) {
          this._profileService.getTeamProfile(this.pageParams.teamId)
            .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
            .subscribe(
                data => {
                    var profileHeaderData = this._profileService.convertTeamPageHeader(this.scope, data, "");
                    this.profileName = data.headerData.teamMarket + " " + data.headerData.teamName;
                    profileHeaderData.text3 = this.selectedTabName + ' - ' + this.profileName;
                    this.seasonBase = data.headerData['seasonBase'];
                    this.dropdownKey1 = this.dropdownKey1 ?
                                        this.dropdownKey1 :
                                        this.filter1Param;
                    this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.teamIdParam);
                    this.profileHeaderData = profileHeaderData;
                    this.metaTags(this.profileHeaderData);
                    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, data.teamName, this.teamIdParam.toString());
                    this.getTransactionsPage();
              },
              err => {
                  this.isError = true;
                  console.error('Error: transactionsData Profile Header API: ', err);
                  // this.isError = true;
              }
            );
      }
      else {
          this._profileService.getLeagueProfile()
            .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
            .subscribe(
                data => {
                    var profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, "");
                    this.profileName = this.pageParams.scope.toUpperCase();
                    profileHeaderData.text3 = this.selectedTabName + ' - ' + this.profileName;
                    this.seasonBase = data.headerData['seasonBase'];
                    this.dropdownKey1 = this.dropdownKey1 ?
                                        this.dropdownKey1 :
                                        this.filter1Param;
                    this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.teamIdParam);
                    this.profileHeaderData = profileHeaderData;
                    this.metaTags(this.profileHeaderData);
                    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, this.profileName, null);
                    this.getTransactionsPage();
              },
              err => {
                  this.isError = true;
                  console.error('Error: transactionsData Profile Header API: ', err);
                  // this.isError = true;
              }
            )
      }
    } //getProfileInfo()



    getTransactionsPage() { // Get data based on selected tab
        var matchingTabs = this.tabs.filter(tab => tab.tabDisplay == this.selectedTabName);
        if (matchingTabs.length > 0) {
            var tab = matchingTabs[0];
            this.dropdownKey1 = this.dropdownKey1 ?
                                this.dropdownKey1 :
                                this.filter1Param;
            this._transactionsService.getTransactionsService(tab, this.teamIdParam, 'page', this.dropdownKey1, 'desc', this.limitParam)
                .subscribe(
                transactionsData => {
                    if (this.transactionFilter1 == undefined) {
                        this.transactionFilter1 = transactionsData.yearArray;
                    }
                    tab = transactionsData;
                }, err => {
                    console.log("Error loading transaction data");
                })
        }
    } //getTransactionsPage()



    transactionsTab(tab) { // set selected tab and route page if necessary
        var newRoute;
        var tabNameFrom = this.selectedTabName; // capture previous value before changing it
        var tabNameTo = tab.tabDisplay; // newly selected tab

        if (tabNameTo != tabNameFrom) { // check if clicked tab is already active
            this.selectedTabName = tabNameTo;
            this.transactionsActiveTab = tab;
            newRoute = this.teamIdParam ?
                        [this.storedPartnerParam, this.scope, tabNameTo.toLowerCase(), this.pageParams.filter1, this.teamNameParam, this.teamIdParam, this.limitParam] :
                        [this.storedPartnerParam, this.scope, tabNameTo.toLowerCase(), this.pageParams.filter1, 'league', this.limitParam];
            this.router.navigate(newRoute);
        }
    } //transactionsTab(tab)



    transactionsFilterDropdown(filter) {
        var newRoute;
        var filterFrom = this.filter1Param;
        var filterTo = filter;

        if (filterTo != filterFrom) {
            this.dropdownKey1 = filter;
            newRoute = this.pageParams.teamId ?
                        [this.storedPartnerParam, this.pageParams.scope, this.selectedTabName.toLowerCase() , this.dropdownKey1, this.teamNameParam, this.teamIdParam, this.limitParam] :
                        [this.storedPartnerParam, this.pageParams.scope, this.selectedTabName.toLowerCase() , this.dropdownKey1, 'league', this.limitParam];
            this.router.navigate(newRoute);
        }
    } //transactionsFilterDropdown(filter)



    // setPaginationParams(input) {
    //     var navigationParams;
    //     var navigationPage = this.teamIdParam != null ?
    //                             '/'+this.scope+'/'+this.selectedTabName.toLowerCase()+'/'+this.filter1Param :
    //                             '/'+this.scope+'/'+this.selectedTabName.toLowerCase()+'/'+this.filter1Param+'/league';
    //     let max = Math.ceil(input.totalTransactions / this.limitParam); //NEED Number of entries from API
    //
    //     if(this.teamIdParam){
    //         navigationParams = {
    //             teamName: this.teamNameParam,
    //             teamId: this.teamIdParam,
    //             limit: this.limitParam,
    //             pageNum: this.pageNumParam
    //         }
    //     } else {
    //       navigationParams = {
    //           limit: this.limitParam,
    //           pageNum: this.pageNumParam
    //       }
    //     }
    //     this.paginationParameters = {
    //         index: this.pageNumParam ? this.pageNumParam : null,
    //         max: max,
    //         paginationType: 'page',
    //         navigationPage: navigationPage,
    //         navigationParams: navigationParams,
    //         indexKey: 'pageNum'
    //     }
    // } //setPaginationParams(input)
}
