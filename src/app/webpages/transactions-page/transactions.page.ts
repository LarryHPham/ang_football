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

export class TransactionsPage{
  public scope: string;
  public partnerID: string;
  public teamNameParam: string;
  public teamIdParam: string;
  public limitParam: string;
  public pageNumParam: string;
  public transactionTypeParam: string;
  public paramsub: any;
  public storedPartnerParam: string;
  public seasonBase: string;

  profileHeaderData: TitleInputData;
  pageParams: any;

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
      this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();

      this.paramsub = this.activateRoute.params.subscribe(
        (param :any)=> {
          let route = this.router.url.split('/');
          if(this.storedPartnerParam != '/'){
            this.selectedTabName = GlobalFunctions.capitalizeFirstLetter(route[3]);
          }else{
            this.selectedTabName = GlobalFunctions.capitalizeFirstLetter(route[2]);
          }
          //check to see if scope is correct and redirect
          this.pageParams = param;

          if (this.pageNum === 0) {
              this.pageNum = 1; //page index starts at one
          }
          this.getProfileInfo();
        }
      )
    } //constructor

    ngOnDestroy(){
      this.paramsub.unsubscribe();
    }
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



    getProfileInfo() {
      if (this.pageParams.teamId) {
          this._profileService.getTeamProfile(this.pageParams.teamId)
              .subscribe(
              data => {
                this.seasonBase = data.headerData['seasonBase'];
                  //var stats = data.headerData.stats;
                  var profileHeaderData = this._profileService.convertTeamPageHeader(this.scope, data, "");
                  this.profileName = data.headerData.teamMarket + " " + data.headerData.teamName;
                  // this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));
                  this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
                  profileHeaderData.text3 = this.selectedTabName + ' - ' + this.profileName;
                  this.profileHeaderData = profileHeaderData;
                  this.metaTags(this.profileHeaderData);

                  var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, data.teamName, this.pageParams.teamId.toString());
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
              .subscribe(
              data => {
                  this.seasonBase = data.headerData['seasonBase'];
                  var profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, "");
                  this.profileName = this.pageParams.scope.toUpperCase();
                  // this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));

                  this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
                  profileHeaderData.text3 = this.selectedTabName + ' - ' + this.profileName;
                  this.profileHeaderData = profileHeaderData;
                  this.metaTags(this.profileHeaderData);

                  var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, this.profileName, null);
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
            if(this.dropdownKey1 == null){
              this.dropdownKey1 = this.seasonBase;
            }
            this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'page', this.dropdownKey1, 'desc', this.limit, this.pageNum)
                .subscribe(
                transactionsData => {
                    if (this.transactionFilter1 == undefined) {
                        this.transactionFilter1 = transactionsData.yearArray;
                    }

                    tab = transactionsData;
                    this.setPaginationParams(transactionsData);
                }, err => {
                    console.log("Error loading transaction data");
                })
        }
    } //getTransactionsPage()



    transactionsTab(tab) { // set selected tab and route page if necessary
        var tabRoute;
        var tabNameFrom = this.selectedTabName; // capture previous value before changing it
        var tabNameTo = tab.tabDisplay; // newly selected tab

        if (tabNameTo != tabNameFrom) { // check if clicked tab is already active
          this.selectedTabName = tabNameTo;
          this.transactionsActiveTab = tab;
            if (this.pageParams.teamId) {
                tabRoute = [this.pageParams.scope, tabNameTo.toLowerCase(), this.pageParams.teamName, this.pageParams.teamId, 20, 1];
                this.router.navigate(tabRoute);
            }
            else {
                tabRoute = [this.pageParams.scope, tabNameTo.toLowerCase(), 'league', 20, 1];
                this.router.navigate(tabRoute);
            }
        }
        this.getTransactionsPage();
    } //transactionsTab(tab)



    transactionsFilterDropdown(filter) {
        if (this.transactionsActiveTab == null) {
            this.transactionsActiveTab = this.transactionsData;
        }
        this.dropdownKey1 = filter;
        this.getTransactionsPage();
    } //transactionsFilterDropdown(filter)



    setPaginationParams(input) {
        var params = this.pageParams; //TODO

        //path: '/directory/:type/:startsWith/page/:page',
        var navigationParams;

        var navigationPage = params['teamId'] != null ? '/'+params.scope+'/'+this.selectedTabName.toLowerCase() : '/'+params.scope+'/'+this.selectedTabName.toLowerCase()+'/league';
        let max = Math.ceil(input.totalTransactions / this.limit); //NEED Number of entries from API

        if(params['teamId']){
          navigationParams = {
              teamName: params['teamName'],
              teamId: params['teamId'],
              limit: params['limit'],
              pageNum: params['pageNum']
          };
        }else{
          navigationParams = {
              limit: params['limit'],
              pageNum: params['pageNum']
          };
        }
        this.paginationParameters = {
            index: params['pageNum'] != null ? Number(params['pageNum']) : null,
            max: max,
            paginationType: 'page',
            navigationPage: navigationPage,
            navigationParams: navigationParams,
            indexKey: 'pageNum'
        }
    } //setPaginationParams(input)
}
