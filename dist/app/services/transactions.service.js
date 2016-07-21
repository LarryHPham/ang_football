System.register(['@angular/core', '@angular/http', '../global/mlb-global-functions', '../global/global-functions', '../global/global-settings', '../components/carousels/slider-carousel/slider-carousel.component'], function(exports_1, context_1) {
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
    var core_1, http_1, mlb_global_functions_1, global_functions_1, global_settings_1, slider_carousel_component_1;
    var TransactionsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            }],
        execute: function() {
            TransactionsService = (function () {
                function TransactionsService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                //Function to set custom headers
                TransactionsService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    return headers;
                };
                TransactionsService.prototype.getTabs = function (errorMessagePrepend, isPage) {
                    var _this = this;
                    var tabs = [
                        {
                            tabDataKey: 'transactions',
                            tabDisplay: 'Transactions',
                            isLoaded: false
                        },
                        {
                            tabDataKey: 'suspensions',
                            tabDisplay: 'Suspensions',
                            isLoaded: false
                        },
                        {
                            tabDataKey: 'injuries',
                            tabDisplay: 'Injuries',
                            isLoaded: false
                        }];
                    tabs.forEach(function (tab) {
                        tab.sortOptions = [
                            { key: "recent", value: "Most Recent" },
                            { key: "oldest", value: "Oldest First" }
                        ],
                            tab.selectedSort = "recent",
                            tab.errorMessage = errorMessagePrepend + tab.tabDisplay.toLowerCase(),
                            tab.includeDropdown = isPage;
                        tab.carData = _this.getEmptyCarousel(tab); //must be called after the rest is set up
                    });
                    return tabs;
                };
                TransactionsService.prototype.getTabSingularName = function (key) {
                    switch (key) {
                        case "transactions": return "Transaction";
                        case "suspensions": return "Suspension";
                        case "injuries": return "Injury";
                    }
                };
                TransactionsService.prototype.getTabsForPage = function (profileName, teamId) {
                    var errorMessagePrepend;
                    if (teamId) {
                        errorMessagePrepend = "Sorry, the " + profileName + " do not currently have any data for ";
                    }
                    else {
                        errorMessagePrepend = "Sorry, " + profileName + " does not currently have any data for ";
                    }
                    return this.getTabs(errorMessagePrepend, true);
                };
                TransactionsService.prototype.loadAllTabsForModule = function (profileName, teamId) {
                    var route, errorMessagePrepend;
                    if (teamId) {
                        route = ['Transactions-page', { teamName: global_functions_1.GlobalFunctions.toLowerKebab(profileName), teamId: teamId, limit: 1000, pageNum: 1 }];
                        errorMessagePrepend = "Sorry, the " + profileName + " do not currently have any data for ";
                    }
                    else {
                        route = ['Transactions-mlb-page', { limit: 1000, pageNum: 1 }];
                        errorMessagePrepend = "Sorry, " + profileName + " does not currently have any data for ";
                    }
                    return {
                        tabs: this.getTabs(errorMessagePrepend, false),
                        profileName: profileName,
                        ctaRoute: route
                    };
                };
                TransactionsService.prototype.getTransactionsService = function (tab, teamId, type, sort, limit, page) {
                    var _this = this;
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    if (sort == "desc") {
                        tab.selectedSort = "recent";
                    }
                    else if (sort == "asc") {
                        tab.selectedSort = "oldest";
                    }
                    else {
                        sort = "desc";
                        tab.selectedSort = "recent";
                    }
                    if (limit == null) {
                        limit = 10;
                    }
                    if (page == null) {
                        page = 1;
                    }
                    //http://dev-homerunloyal-api.synapsys.us/league/transactions/injuries/desc/5/1
                    var callURL = this._apiUrl + '/';
                    if (teamId) {
                        callURL += 'team/transactions/' + teamId + '/';
                    }
                    else {
                        callURL += 'league/transactions/';
                    }
                    callURL += tab.tabDataKey + '/' + sort + '/' + limit + '/' + page;
                    // only set current team if it's a team profile page,
                    // this module should also only be on the team profile
                    // and MLB profile pages
                    var currentTeam = type == "module" ? teamId : null;
                    // console.log("transactions url: " + callURL);
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        tab.carData = _this.carTransactions(data.data, type, tab, currentTeam);
                        tab.dataArray = _this.listTransactions(data.data, type);
                        if (tab.dataArray != null && tab.dataArray.length == 0) {
                            tab.dataArray = null;
                        }
                        tab.isLoaded = true;
                        return tab;
                    }, function (err) {
                        console.log('Error getting transaction data for ' + tab.tabDataKey);
                    });
                };
                TransactionsService.prototype.getEmptyCarousel = function (tab) {
                    return [slider_carousel_component_1.SliderCarousel.convertToCarouselItemType1(2, {
                            backgroundImage: null,
                            copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                            subheader: [tab.tabDisplay + ' Report'],
                            profileNameLink: null,
                            description: [tab.isLoaded ? tab.errorMessage : ""],
                            lastUpdatedDate: null,
                            circleImageUrl: "/app/public/no-image.png",
                            circleImageRoute: null
                        })];
                };
                //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
                TransactionsService.prototype.carTransactions = function (data, type, tab, teamId) {
                    var _this = this;
                    var self = this;
                    var carouselArray = [];
                    if (data.length == 0) {
                        carouselArray = this.getEmptyCarousel(tab);
                    }
                    else {
                        if (type == "module") {
                            // module only needs four list items
                            data = data.slice(0, 4);
                        }
                        //if data is coming through then run through the transforming function for the module
                        carouselArray = data.map(function (val, index) {
                            var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                            var playerRoute = null;
                            if ((!val.roleStatus && val.active == 'injured') || val.active == 'active') {
                                playerRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.playerName, val.playerName, val.playerId);
                                ;
                            }
                            var teamLinkText = {
                                route: teamId == val.teamId ? null : teamRoute,
                                text: val.teamName,
                                class: 'text-heavy'
                            };
                            var playerLinkText = {
                                route: playerRoute,
                                text: val.playerName,
                                class: 'text-heavy'
                            };
                            return slider_carousel_component_1.SliderCarousel.convertToCarouselItemType1(index, {
                                backgroundImage: global_settings_1.GlobalSettings.getBackgroundImageUrl(val.backgroundImage),
                                copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                                subheader: [tab.tabDisplay + ' Report - ', teamLinkText],
                                profileNameLink: playerLinkText,
                                description: [
                                    _this.getTabSingularName(tab.tabDataKey) + ' date - ' + val.repDate + ': ' + val.contents
                                ],
                                // lastUpdatedDate: GlobalFunctions.formatUpdatedDate(val.transactionTimestamp),
                                lastUpdatedDate: global_functions_1.GlobalFunctions.formatUpdatedDate(val.lastUpdate),
                                circleImageUrl: global_settings_1.GlobalSettings.getImageUrl(val.playerHeadshot),
                                circleImageRoute: playerRoute
                            });
                        });
                    }
                    return carouselArray;
                };
                TransactionsService.prototype.listTransactions = function (data, type) {
                    var self = this;
                    var listDataArray = [];
                    if (type == "module") {
                        data = data.slice(0, 4);
                    }
                    listDataArray = data.map(function (val, index) {
                        var playerRoute = null;
                        if ((!val.roleStatus && val.active == 'injured') || val.active == 'active') {
                            playerRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.playerName, val.playerName, val.playerId);
                        }
                        var playerTextLink = {
                            route: playerRoute,
                            text: val.playerLastName + ", " + val.playerFirstName + " ",
                            class: 'text-heavy'
                        };
                        return {
                            dataPoints: [{
                                    style: 'transactions-small',
                                    data: global_functions_1.GlobalFunctions.formatDateWithAPMonth(new Date(val['repDate']), "", " DD, YYYY"),
                                    value: [playerTextLink, val.contents],
                                    url: null
                                }],
                            imageConfig: TransactionsService.getListImageData(global_settings_1.GlobalSettings.getImageUrl(val.playerHeadshot), playerRoute)
                        };
                    });
                    return listDataArray;
                }; //end of function
                TransactionsService.getListImageData = function (mainImg, mainImgRoute) {
                    if (mainImg == null || mainImg == '') {
                        mainImg = "/app/public/no-image.png";
                    }
                    return {
                        imageClass: "image-48",
                        mainImage: {
                            imageUrl: mainImg,
                            urlRouteArray: mainImgRoute,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "border-1",
                        },
                        subImages: [],
                    };
                };
                TransactionsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], TransactionsService);
                return TransactionsService;
            }());
            exports_1("TransactionsService", TransactionsService);
        }
    }
});
