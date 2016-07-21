System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../components/title/title.component', '../../components/backtab/backtab.component', '../../services/transactions.service', '../../services/profile-header.service', "../../components/loading/loading.component", "../../components/error/error.component", "../../global/global-settings", "../../global/mlb-global-functions", "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/transactions/transactions.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_deprecated_1, platform_browser_1, title_component_1, backtab_component_1, transactions_service_1, profile_header_service_1, loading_component_1, error_component_1, global_settings_1, mlb_global_functions_1, sidekick_wrapper_component_1, transactions_component_1;
    var TransactionsPage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (title_component_1_1) {
                title_component_1 = title_component_1_1;
            },
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (transactions_service_1_1) {
                transactions_service_1 = transactions_service_1_1;
            },
            function (profile_header_service_1_1) {
                profile_header_service_1 = profile_header_service_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (transactions_component_1_1) {
                transactions_component_1 = transactions_component_1_1;
            }],
        execute: function() {
            TransactionsPage = (function () {
                function TransactionsPage(_transactionsService, _profileService, _params, _title) {
                    this._transactionsService = _transactionsService;
                    this._profileService = _profileService;
                    this._params = _params;
                    this._title = _title;
                    this.isError = false;
                    this.sort = "desc";
                    this.listSort = "recent";
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Transactions"));
                    this.pageParams = {
                        teamId: _params.get("teamId") ? Number(_params.get("teamId")) : null
                    };
                    this.limit = Number(this._params.params['limit']);
                    this.pageNum = Number(this._params.params['pageNum']);
                }
                TransactionsPage.prototype.getProfileInfo = function () {
                    var _this = this;
                    if (this.pageParams.teamId) {
                        this._profileService.getTeamProfile(this.pageParams.teamId)
                            .subscribe(function (data) {
                            var stats = data.headerData.stats;
                            var profileHeaderData = _this._profileService.convertTeamPageHeader(data, "");
                            _this.profileName = stats.teamName;
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Transactions", _this.profileName));
                            _this.tabs = _this._transactionsService.getTabsForPage(_this.profileName, _this.pageParams.teamId);
                            profileHeaderData.text3 = _this.tabs[0].tabDisplay + ' - ' + _this.profileName;
                            _this.profileHeaderData = profileHeaderData;
                            var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(data.teamName, _this.pageParams.teamId.toString());
                        }, function (err) {
                            _this.isError = true;
                            console.error('Error: transactionsData Profile Header API: ', err);
                            // this.isError = true;
                        });
                    }
                    else {
                        this._profileService.getMLBProfile()
                            .subscribe(function (data) {
                            _this.profileName = data.headerData.profileNameShort;
                            var profileHeaderData = _this._profileService.convertMLBHeader(data.headerData, "");
                            _this._title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Transactions", _this.profileName));
                            _this.tabs = _this._transactionsService.getTabsForPage(_this.profileName, _this.pageParams.teamId);
                            profileHeaderData.text3 = _this.tabs[0].tabDisplay + ' - ' + _this.profileName;
                            _this.profileHeaderData = profileHeaderData;
                            var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(_this.profileName, null);
                        }, function (err) {
                            _this.isError = true;
                            console.error('Error: transactionsData Profile Header API: ', err);
                            // this.isError = true;
                        });
                    }
                };
                TransactionsPage.prototype.getTransactionsPage = function () {
                    var _this = this;
                    var matchingTabs = this.tabs.filter(function (tab) { return tab.tabDataKey == _this.selectedTabKey; });
                    if (matchingTabs.length > 0) {
                        var tab = matchingTabs[0];
                        this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'page', this.sort, this.limit, this.pageNum)
                            .subscribe(function (data) {
                            //do nothing
                        }, function (err) {
                            console.log("Error loading transaction data");
                        });
                    }
                };
                TransactionsPage.prototype.ngOnInit = function () {
                    this.getProfileInfo();
                };
                TransactionsPage.prototype.tabSwitched = function (tab) {
                    if (this.selectedTabKey) {
                        this.profileHeaderData.text3 = tab.tabDisplay + ' - ' + this.profileName;
                    }
                    this.selectedTabKey = tab.tabDataKey;
                    this.getTransactionsPage();
                };
                TransactionsPage.prototype.dropdownChanged = function (event) {
                    if (this.listSort != event) {
                        this.listSort = event;
                        this.sort = this.sort == "asc" ? "desc" : "asc";
                        this.getTransactionsPage();
                    }
                };
                TransactionsPage = __decorate([
                    core_1.Component({
                        selector: 'transactions-page',
                        templateUrl: './app/webpages/transactions-page/transactions.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, error_component_1.ErrorComponent, loading_component_1.LoadingComponent, backtab_component_1.BackTabComponent, title_component_1.TitleComponent, transactions_component_1.TransactionsComponent],
                        providers: [transactions_service_1.TransactionsService, profile_header_service_1.ProfileHeaderService, platform_browser_1.Title],
                        inputs: []
                    }), 
                    __metadata('design:paramtypes', [transactions_service_1.TransactionsService, profile_header_service_1.ProfileHeaderService, router_deprecated_1.RouteParams, platform_browser_1.Title])
                ], TransactionsPage);
                return TransactionsPage;
            }());
            exports_1("TransactionsPage", TransactionsPage);
        }
    }
});
