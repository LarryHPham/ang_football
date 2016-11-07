import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {TitleComponent, TitleInputData} from '../../fe-core/components/title/title.component';
import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {TransactionsService} from '../../services/transactions.service';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {ErrorComponent} from "../../fe-core/components/error/error.component";
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {TransactionsComponent, TransactionTabData} from '../../fe-core/components/transactions/transactions.component';
import {SportPageParameters} from '../../global/global-interface';
import {PaginationFooter, PaginationParameters} from '../../fe-core/components/pagination-footer/pagination-footer.component';
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

declare var moment: any;

@Component({
    selector: 'transactions-page',
    templateUrl: './app/webpages/transactions-page/transactions.page.html',
    directives: [PaginationFooter, SidekickWrapper, ErrorComponent, LoadingComponent, BackTabComponent, TitleComponent, TransactionsComponent, ResponsiveWidget],
    providers: [TransactionsService, ProfileHeaderService, Title],
    inputs: []
})

export class TransactionsPage implements OnInit {
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

    public scope: string;
    public partnerID: string;
    public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
    public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();

    private teamNameParam: string;
    private teamIdParam: string;
    private limitParam: string;
    private pageNumParam: string;
    private transactionTypeParam: string;

    constructor(private _router: Router,
        private _transactionsService: TransactionsService,
        private _profileService: ProfileHeaderService,
        private _params: RouteParams,
        private _title: Title) {

        //check to see if scope is correct and redirect
        VerticalGlobalFunctions.scopeRedirect(_router, _params);
        this.pageParams = {
            teamId: _params.get("teamId") ? Number(_params.get("teamId")) : null
        };

        GlobalSettings.getParentParams(this._router, parentParams => {
            this.partnerID = parentParams.partnerID;
            this.scope = parentParams.scope;
        });

        this.teamNameParam = _params.get("teamName");
        this.teamIdParam = _params.get("teamId");
        this.limit = Number(this._params.params['limit']);
        this.pageNum = Number(this._params.params['pageNum']);
        this.transactionTypeParam = _params.get("type");

        if (this.pageNum === 0) {
            this.pageNum = 1; //page index starts at one
        }
    }

    ngOnInit() {
        this.getProfileInfo();
        this.selectedTabName = GlobalFunctions.capitalizeFirstLetter(this.transactionTypeParam); // use this function to match url param with display title of tabs
    }

    getProfileInfo() {
        if (this.pageParams.teamId) {
            this._profileService.getTeamProfile(this.pageParams.teamId)
                .subscribe(
                data => {
                    //var stats = data.headerData.stats;
                    var profileHeaderData = this._profileService.convertTeamPageHeader(data, "");
                    this.profileName = data.headerData.teamMarket + " " + data.headerData.teamName;
                    this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));
                    this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
                    profileHeaderData.text3 = this.tabs[0].tabDisplay + ' - ' + this.profileName;
                    this.profileHeaderData = profileHeaderData;

                    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(data.teamName, this.pageParams.teamId.toString());
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
                    this.profileName = this.scope.toUpperCase();
                    var profileHeaderData = this._profileService.convertLeagueHeader(data.headerData, "");
                    this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));

                    this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
                    profileHeaderData.text3 = this.tabs[0].tabDisplay + ' - ' + this.profileName;
                    this.profileHeaderData = profileHeaderData;

                    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(this.profileName, null);
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
        var matchingTabs = this.tabs.filter(tab => tab.tabDisplay.toLowerCase() == this.selectedTabName.toLowerCase() );

        if (matchingTabs.length > 0) {
            var tab = matchingTabs[0];

            this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'page', this.dropdownKey1, 'desc', this.limit, this.pageNum)
                .subscribe(
                transactionsData => {
                    if (this.transactionFilter1 == undefined) {
                        this.transactionFilter1 =transactionsData.yearArray;
                        if (this.dropdownKey1 == null) {
                            this.dropdownKey1 = this.transactionFilter1[0].key;
                        }
                    }

                    this.setPaginationParams(transactionsData);
                }, err => {
                    console.log("Error loading transaction data");
                })
        }
    } //getTransactionsPage()

    transactionsTab(tab) { // set selected tab and route page if necessary
        var tabRoute;
        var tabNameFrom = this.selectedTabName.toLowerCase(); // capture previous value before changing it
        var tabNameTo = tab.tabDisplay.toLowerCase(); // newly selected tab
        this.selectedTabName = tab.tabDisplay;

        if ( tabNameTo != tabNameFrom ) { // check if clicked tab is already active
            if ( this.teamIdParam ) {
                tabRoute = ["Transactions-page", { teamName: this.teamNameParam, teamId: this.teamIdParam, limit: this.limit, pageNum: 1, type: tab.tabDataKey}];
                this._router.navigate(tabRoute);
            }
            else {
                tabRoute = ['Transactions-tdl-page',{limit:20, pageNum: 1, type: tab.tabDataKey}];
                this._router.navigate(tabRoute);
            }
        }


        this.transactionsActiveTab = tab;
        this.getTransactionsPage();
    } //transactionsTab(tab)

    transactionsFilterDropdown(filter) {
        if (this.transactionsActiveTab == null) {
            this.transactionsActiveTab = this.transactionsData[0];
        }
        this.dropdownKey1 = filter;

        this.getTransactionsPage();
    } //transactionsFilterDropdown(filter)

    setPaginationParams(input) {
        var params = this._params.params;

        //path: '/directory/:type/:startsWith/page/:page',
        var navigationParams = {
            limit: params['limit'],
            pageNum: params['pageNum']
        };

        if (params['scope'] != null) {
            navigationParams['scope'] = params['scope'];
        }

        if (params['teamId'] != null) {
            navigationParams['teamId'] = params['teamId'];
        }

        if (params['teamName'] != null) {
            navigationParams['teamName'] = params['teamName'];
        }

        if (params['type'] != null) {
            navigationParams['type'] = params['type'];
        }

        var navigationPage = params['teamId'] != null ? 'Transactions-page' : 'Transactions-tdl-page';
        let max = Math.ceil(input.totalTransactions / this.limit); //NEED Number of entries from API

        this.paginationParameters = {
            index: params['pageNum'] != null ? Number(params['pageNum']) : null,
            max: max,
            paginationType: 'page',
            navigationPage: navigationPage,
            navigationParams: navigationParams,
            indexKey: 'pageNum'
        };
    } //setPaginationParams(input)
}
