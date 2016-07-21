System.register(['@angular/core', '@angular/http', '../global/mlb-global-functions', '../global/global-functions', '../global/global-settings', '../components/carousels/slider-carousel/slider-carousel.component', './list-page.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, mlb_global_functions_1, global_functions_1, global_settings_1, slider_carousel_component_1, list_page_service_1;
    var DraftHistoryService, MLBDraftHistoryService;
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
            },
            function (list_page_service_1_1) {
                list_page_service_1 = list_page_service_1_1;
            }],
        execute: function() {
            DraftHistoryService = (function () {
                function DraftHistoryService() {
                }
                DraftHistoryService.prototype.getDraftHistoryTabs = function (profileData) {
                    // console.log("interface - getDraftHistoryTabs")
                    return [];
                };
                DraftHistoryService.prototype.getDraftHistoryService = function (profileData, tab, currIndex, type) {
                    // console.log("interface - getDraftHistoryService")
                    return null;
                };
                DraftHistoryService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DraftHistoryService);
                return DraftHistoryService;
            }());
            exports_1("DraftHistoryService", DraftHistoryService);
            MLBDraftHistoryService = (function (_super) {
                __extends(MLBDraftHistoryService, _super);
                function MLBDraftHistoryService(http) {
                    _super.call(this);
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                MLBDraftHistoryService.prototype.getDraftHistoryTabs = function (profileData) {
                    // console.log("concrete - getDraftHistoryTabs")
                    var errorMessage; // {0} is for the season name
                    // if ( profileData.isLegit && year == currentYear ) {
                    if (profileData.profileType == "team") {
                        //team names are plural, and should have a determative
                        errorMessage = "Currently, there are no drafted players assigned to the " + global_functions_1.GlobalFunctions.convertToPossessive(profileData.profileName) + " roster for the {0}.";
                    }
                    else {
                        //otherwise it's MLB, which is singular and a proper name
                        errorMessage = "Currently, there are no drafted players assigned to a team's roster for the {0}.";
                    }
                    // }
                    // else {
                    //   if ( profileData.profileType == "team" ) {
                    //     //team names are plural, and should have a determative
                    //     errorMessage = "Sorry, the " + profileData.profileName + " do not currently have any draft history data for the {0}.";
                    //   }
                    //   else {
                    //     //otherwise it's MLB, which is singular and a proper name
                    //     errorMessage = "Sorry, " + profileData.profileName + " does not currently have any draft history data for the {0}.";
                    //   }
                    // }
                    //for MLB season starts and ends in the same year so return current season
                    //get past 5 years for tabs
                    var currentYear = new Date().getFullYear();
                    var year = currentYear;
                    var tabArray = [];
                    for (var i = 0; i < 5; i++) {
                        var seasonName = year + " season";
                        tabArray.push({
                            tabTitle: i == 0 ? 'Current Season' : year.toString(),
                            tabKey: year.toString(),
                            isLoaded: false,
                            errorMessage: errorMessage.replace("{0}", seasonName)
                        });
                        year--;
                    }
                    return tabArray;
                };
                /**
                 * @param {string} type - 'page' or 'module'
                 */
                MLBDraftHistoryService.prototype.getDraftHistoryService = function (profileData, tab, currIndex, type) {
                    // console.log("concrete - getDraftHistoryService");
                    var _this = this;
                    var year = tab.tabKey;
                    var itemsOnPage = 20;
                    var callURL;
                    if (profileData.profileType == "team") {
                        callURL = this._apiUrl + '/team/draftHistory/' + profileData.profileId + '/' + year;
                    }
                    else {
                        //http://dev-homerunloyal-api.synapsys.us/league/draftHistory/2016
                        callURL = this._apiUrl + '/league/draftHistory/' + year;
                    }
                    return this.http.get(callURL)
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        if (type == 'module') {
                            if (data.data.length > 1) {
                                // the module should only have 2 data points displaying
                                data.data = data.data.slice(0, 2);
                            }
                        }
                        var allCarouselItems = _this.carDraftHistory(data.data, tab.errorMessage, type);
                        var allDetailItems = _this.detailedData(data.data);
                        var totalPages = allDetailItems ? Math.ceil(allDetailItems.length / itemsOnPage) : 0;
                        var draftData = {
                            carouselDataArray: [],
                            detailedDataArray: null,
                            paginationDetails: null // otherwise, the no-data tab doesn't show up correctly.
                        };
                        if (totalPages > 0) {
                            draftData.detailedDataArray = [];
                            if (type == 'page') {
                                draftData.paginationDetails = {
                                    index: currIndex + 1,
                                    max: totalPages,
                                    paginationType: 'module' //even if it's a page type, we want to use 'module' type pagination
                                };
                            }
                            for (var page = 0; page < totalPages; page++) {
                                var start = page * itemsOnPage;
                                var end = start + itemsOnPage;
                                if (end >= allDetailItems.length) {
                                    end = allDetailItems.length;
                                }
                                draftData.carouselDataArray.push(allCarouselItems.slice(start, end));
                                draftData.detailedDataArray.push(allDetailItems.slice(start, end));
                            }
                        }
                        else {
                            if (totalPages == 0 && allCarouselItems.length == 1) {
                                draftData.carouselDataArray.push(allCarouselItems);
                            }
                        }
                        return draftData;
                    });
                };
                //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
                //FOR THE PAGE
                MLBDraftHistoryService.prototype.carDraftHistory = function (data, errorMessage, type) {
                    var self = this;
                    var carouselArray = [];
                    var dummyImg = "/app/public/no-image.png";
                    if (data.length == 0) {
                        carouselArray.push(slider_carousel_component_1.SliderCarousel.convertToEmptyCarousel(errorMessage));
                    }
                    else {
                        //if data is coming through then run through the transforming function for the module
                        data.forEach(function (val, index) {
                            var playerFullName = val.playerFirstName + " " + val.playerLastName;
                            var playerRoute = null;
                            if (val.active == "active" || (val.active == "injured" && !val.roleStatus)) {
                                playerRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId);
                            }
                            var playerLinkText = {
                                route: playerRoute,
                                text: playerFullName
                            };
                            var rank = (index + 1).toString();
                            var location;
                            if (val.city == null || val.area == null) {
                                location = "N/A";
                            }
                            else {
                                location = global_functions_1.GlobalFunctions.toTitleCase(val.city) + ', ' + global_functions_1.GlobalFunctions.stateToAP(val.area);
                            }
                            var carouselItem = slider_carousel_component_1.SliderCarousel.convertToCarouselItemType2(index, {
                                isPageCarousel: false,
                                backgroundImage: global_settings_1.GlobalSettings.getBackgroundImageUrl(val.backgroundImage),
                                copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                                profileNameLink: playerLinkText,
                                description: ['Hometown: ', location],
                                dataValue: val.selectionOverall + " Overall",
                                dataLabel: "Draft Round " + val.selectionLevel,
                                circleImageUrl: global_settings_1.GlobalSettings.getImageUrl(val.imageUrl),
                                circleImageRoute: playerRoute,
                                rank: rank
                            });
                            // if(type == 'page'){ //removed from spec
                            //   carouselItem.footerInfo = {
                            //     infoDesc:'Interested in discovering more about this player?',
                            //     text:'View Profile',
                            //     url:playerRoute,
                            //   }
                            // }
                            carouselArray.push(carouselItem);
                        });
                    }
                    // console.log('TRANSFORMED CAROUSEL', carouselArray);
                    return carouselArray;
                };
                MLBDraftHistoryService.prototype.detailedData = function (data) {
                    var listDataArray = data.map(function (val, index) {
                        var playerFullName = val.playerFirstName + " " + val.playerLastName;
                        if (val.city == null || val.area == null) {
                            location = "N/A";
                        }
                        else {
                            var location = global_functions_1.GlobalFunctions.toTitleCase(val.city) + ', ' + global_functions_1.GlobalFunctions.stateToAP(val.area);
                        }
                        var rank = (index + 1);
                        var playerRoute = null;
                        if (val.active == "active" || (val.active == "injured" && !val.roleStatus)) {
                            playerRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId);
                        }
                        var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                        var listData = {
                            dataPoints: list_page_service_1.ListPageService.detailsData([
                                { route: playerRoute, text: playerFullName, class: "dataBox-mainLink" }
                            ], val.selectionOverall + ' Overall', [
                                { text: "Hometown: " + location }
                            ], 'Draft Round ' + val.selectionLevel, 'fa fa-map-marker'),
                            imageConfig: list_page_service_1.ListPageService.imageData("list", global_settings_1.GlobalSettings.getImageUrl(val.imageUrl), playerRoute, rank),
                            hasCTA: true,
                            ctaDesc: playerRoute ? 'Want more info about this player?' : 'This player is currently not active.',
                            ctaBtn: '',
                            ctaText: 'View Profile',
                            ctaUrl: playerRoute
                        };
                        return listData;
                    });
                    // console.log('TRANSFORMED List Data', listDataArray);
                    return listDataArray.length > 0 ? listDataArray : null;
                }; //end of function
                MLBDraftHistoryService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], MLBDraftHistoryService);
                return MLBDraftHistoryService;
            }(DraftHistoryService));
            exports_1("MLBDraftHistoryService", MLBDraftHistoryService);
        }
    }
});
