System.register(['@angular/core', '@angular/router-deprecated', '@angular/platform-browser', '../../global/global-functions', "../../global/global-settings", '../../services/directory.service', '../../modules/directory/directory.module'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, platform_browser_1, global_functions_1, global_settings_1, directory_service_1, directory_module_1;
    var DirectoryPage;
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
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (directory_service_1_1) {
                directory_service_1 = directory_service_1_1;
            },
            function (directory_module_1_1) {
                directory_module_1 = directory_module_1_1;
            }],
        execute: function() {
            DirectoryPage = (function () {
                function DirectoryPage(_params, _directoryService, _title) {
                    this._params = _params;
                    this._directoryService = _directoryService;
                    this._title = _title;
                    this.currentPage = 1;
                    this.newlyAdded = false;
                    this.listingsLimit = 25;
                    this.isError = false;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Directory"));
                    var page = _params.get("page");
                    this.currentPage = Number(page);
                    var type = _params.get("type");
                    switch (type) {
                        case "players":
                            this.pageType = directory_service_1.DirectoryType.players;
                            break;
                        case "teams":
                            this.pageType = directory_service_1.DirectoryType.teams;
                            break;
                        default:
                            this.pageType = directory_service_1.DirectoryType.none;
                            break;
                    }
                    var startsWith = _params.get("startsWith");
                    if (startsWith !== undefined && startsWith !== null) {
                        this.newlyAdded = startsWith.toLowerCase() === "new";
                        this.startsWith = !this.newlyAdded && startsWith.length > 0 ? startsWith[0] : undefined;
                    }
                    if (this.currentPage === 0) {
                        this.currentPage = 1; //page index starts at one
                    }
                }
                DirectoryPage.prototype.ngOnInit = function () {
                    this.getDirectoryData();
                };
                DirectoryPage.prototype.getDirectoryData = function () {
                    var _this = this;
                    window.scrollTo(0, 0);
                    var params = {
                        page: this.currentPage,
                        listingsLimit: this.listingsLimit,
                        startsWith: this.startsWith,
                        newlyAdded: this.newlyAdded
                    };
                    this._directoryService.getData(this.pageType, params)
                        .subscribe(function (data) { return _this.setupData(data); }, function (err) {
                        console.log('Error - Getting directory listings: ', err);
                        _this.isError = true;
                    });
                };
                DirectoryPage.prototype.setupData = function (listings) {
                    var pageParams = {
                        type: directory_service_1.DirectoryType[this.pageType]
                    };
                    var lowerCaseType = "";
                    var titleCaseType = "";
                    switch (this.pageType) {
                        case directory_service_1.DirectoryType.players:
                            lowerCaseType = "player";
                            titleCaseType = "Player";
                            break;
                        case directory_service_1.DirectoryType.teams:
                            lowerCaseType = "team";
                            titleCaseType = "Team";
                            break;
                        default:
                            lowerCaseType = "[type]";
                            titleCaseType = "[Type]";
                            break;
                    }
                    var directoryListTitle = "Latest MLB " + titleCaseType + " Profiles in the Nation.";
                    var noResultsMessage = "Sorry, there are no results for " + titleCaseType + "s";
                    var pagingDescription = titleCaseType + " profiles";
                    var navTitle = "Browse all " + lowerCaseType + " profiles from A to Z";
                    var pageName = "Directory-page-starts-with";
                    if (this.startsWith !== undefined && this.startsWith !== null && this.startsWith.length > 0) {
                        pageParams["startsWith"] = this.startsWith;
                        noResultsMessage = "Sorry, there are no results for " + titleCaseType + "s starting with the letter '" + this.startsWith + "'";
                    }
                    var data = {
                        pageName: pageName,
                        breadcrumbList: [{
                                text: "United States"
                            }],
                        directoryListTitle: directoryListTitle,
                        hasListings: false,
                        noResultsMessage: noResultsMessage,
                        listingItems: null,
                        listingsLimit: this.listingsLimit,
                        navigationData: this.setupAlphabeticalNavigation(navTitle),
                        pagingDescription: pagingDescription,
                        pageParams: pageParams
                    };
                    ;
                    if (listings !== undefined && listings !== null) {
                        // this.setupPaginationParameters(data);
                        data.hasListings = listings.items.length > 0;
                        data.listingItems = listings;
                    }
                    else {
                        data.hasListings = false;
                        data.listingItems = null;
                    }
                    this.data = data;
                };
                DirectoryPage.prototype.setupAlphabeticalNavigation = function (title) {
                    var navigationArray = global_functions_1.GlobalFunctions.setupAlphabeticalNavigation(directory_service_1.DirectoryType[this.pageType]);
                    return {
                        title: title,
                        links: navigationArray
                    };
                };
                DirectoryPage = __decorate([
                    core_1.Component({
                        selector: 'Directory-page',
                        templateUrl: './app/webpages/directory-page/directory.page.html',
                        directives: [directory_module_1.DirectoryModule],
                        providers: [directory_service_1.DirectoryService, platform_browser_1.Title]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, directory_service_1.DirectoryService, platform_browser_1.Title])
                ], DirectoryPage);
                return DirectoryPage;
            }());
            exports_1("DirectoryPage", DirectoryPage);
        }
    }
});
