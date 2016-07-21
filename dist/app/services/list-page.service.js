System.register(['@angular/core', '@angular/http', '../global/global-functions', '../global/mlb-global-functions', '../global/global-settings', '../components/carousels/slider-carousel/slider-carousel.component'], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, mlb_global_functions_1, global_settings_1, slider_carousel_component_1;
    var BaseballMVPTabData, ListPageService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            }],
        execute: function() {
            BaseballMVPTabData = (function () {
                function BaseballMVPTabData(title, key, profileType) {
                    this.errorData = {
                        data: "Sorry, we do not currently have any data for this MVP list",
                        icon: "fa fa-remove"
                    };
                    this.listData = null;
                    this.isLoaded = false;
                    this.profileType = profileType; //'page' carousel is slightly different from 'module' version
                    this.tabDataKey = key;
                    this.tabDisplayTitle = title;
                }
                BaseballMVPTabData.prototype.getCarouselData = function () {
                    return ListPageService.carDataPage(this.data, this.profileType, this.errorData.data);
                };
                return BaseballMVPTabData;
            }());
            exports_1("BaseballMVPTabData", BaseballMVPTabData);
            ListPageService = (function () {
                function ListPageService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                //Function to set custom headers
                ListPageService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    return headers;
                };
                /*
                  query:{
                  profile: //profile type ex: 'team' or 'player'
                  listname: //list name sent back as lower kebab case  ex: 'batter-runs'
                  sort: //sorting the list by 'desc' or 'asc'
                  conference: //sort list by conference, but if sort by entire league then 'all' would be in place
                  division: //sort list by division, but if sort by all divisions then 'all' would be in place. conference is required if 'all' is in place
                  limit: // limit the amount of data points come back but a number amount
                  pageNum: //  determined by the limit as well detects what page to view based on the limit ex: limit: 10  page 1 holds 1-10 and page 2 holds 11-20
                  }
                */
                ListPageService.prototype.getListPageService = function (query, errorMessage) {
                    var _this = this;
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    var callURL = this._apiUrl + '/list';
                    for (var q in query) {
                        callURL += "/" + query[q];
                    }
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        data.data['query'] = query;
                        _this.formatData(data.data.listInfo.stat, data.data.listData);
                        return {
                            profHeader: ListPageService.profileHeader(data.data),
                            carData: ListPageService.carDataPage(data.data, 'page', errorMessage),
                            listData: ListPageService.detailedData(data.data),
                            pagination: data.data.listInfo,
                            listDisplayName: data.data.listInfo.name
                        };
                    }, function (err) {
                        console.log('INVALID DATA');
                    });
                };
                //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
                ListPageService.prototype.getMVPTabs = function (moduleType, profileType) {
                    var tabArray = [];
                    //generate a static list of tab array based on the moduleType to emit the tabData and have a tabDisplay for the DOM
                    if (moduleType == 'pitcher') {
                        tabArray.push(new BaseballMVPTabData('W/L', 'pitcher-win-record', profileType));
                        tabArray.push(new BaseballMVPTabData('Innings Pitched', 'pitcher-innings-pitched', profileType));
                        tabArray.push(new BaseballMVPTabData('Strikeouts', 'pitcher-strikeouts', profileType));
                        tabArray.push(new BaseballMVPTabData('ERA', 'pitcher-earned-run-average', profileType));
                        tabArray.push(new BaseballMVPTabData('Hits', 'pitcher-hits-allowed', profileType));
                    }
                    else {
                        tabArray.push(new BaseballMVPTabData('Home Runs', 'batter-home-runs', profileType));
                        tabArray.push(new BaseballMVPTabData('Batting Avg.', 'batter-batting-average', profileType));
                        tabArray.push(new BaseballMVPTabData('RBIs', 'batter-runs-batted-in', profileType));
                        tabArray.push(new BaseballMVPTabData('Hits', 'batter-hits', profileType));
                        tabArray.push(new BaseballMVPTabData('Walks', 'batter-bases-on-balls', profileType));
                        tabArray.push(new BaseballMVPTabData('OBP', 'batter-on-base-percentage', profileType));
                    }
                    return tabArray;
                };
                //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
                ListPageService.prototype.getListModuleService = function (tab, query) {
                    var _this = this;
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    var callURL = this._apiUrl + '/list';
                    for (var q in query) {
                        callURL += "/" + query[q];
                    }
                    // console.log("list module url: " + callURL);
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        data.data['query'] = query; //used in some functions below
                        _this.formatData(data.data.listInfo.stat, data.data.listData);
                        tab.data = data.data;
                        tab.isLoaded = true;
                        tab.listData = ListPageService.detailedData(data.data);
                        return tab;
                    });
                };
                ListPageService.prototype.formatData = function (key, data) {
                    data.forEach(function (item) {
                        switch (key) {
                            case 'pitcher-strikeouts':
                            case "pitcher-innings-pitched":
                            case 'pitcher-hits-allowed':
                            case 'batter-bases-on-balls':
                            case 'batter-home-runs':
                            case 'batter-runs-batted-in':
                            case 'batter-hits':
                                // format as integer
                                var temp = Number(item.stat);
                                item.stat = temp.toFixed(0);
                                break;
                            case 'pitcher-earned-run-average':
                                var temp = Number(item.stat);
                                item.stat = temp.toFixed(2); // format as integer
                                break;
                            case 'batter-on-base-percentage':
                            case 'batter-batting-average':
                                var temp = Number(item.stat);
                                item.stat = temp.toFixed(3); // format as integer
                                break;
                            default:
                        }
                    });
                };
                ListPageService.profileHeader = function (data) {
                    var profile = data.listInfo;
                    return {
                        imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                        imageRoute: ["Home-page"],
                        text1: 'Last Updated: ' + global_functions_1.GlobalFunctions.formatUpdatedDate(data.listData[0].lastUpdate),
                        text2: 'United States',
                        text3: profile.name,
                        icon: 'fa fa-map-marker'
                    };
                };
                //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
                ListPageService.carDataPage = function (data, profileType, errorMessage) {
                    var carouselArray = [];
                    var currentYear = new Date().getFullYear(); //TODO FOR POSSIBLE past season stats but for now we have lists for current year season
                    var carData = data.listData;
                    var carInfo = data.listInfo;
                    if (carData.length == 0) {
                        carouselArray.push(slider_carousel_component_1.SliderCarousel.convertToEmptyCarousel(errorMessage));
                    }
                    else {
                        //if data is coming through then run through the transforming function for the module
                        carouselArray = carData.map(function (val, index) {
                            var carouselItem;
                            var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index + 1);
                            val.rank = rank.toString();
                            var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                            var teamLinkText = {
                                route: teamRoute,
                                text: val.teamName
                            };
                            var ctaDesc;
                            var primaryRoute;
                            var primaryImage;
                            var profileLinkText;
                            var description;
                            if (data.query.profile == 'team') {
                                ctaDesc = 'Interested in discovering more about this team?';
                                primaryRoute = teamRoute;
                                primaryImage = global_settings_1.GlobalSettings.getImageUrl(val.teamLogo);
                                profileLinkText = teamLinkText;
                                description = ['<i class="fa fa-map-marker text-master"></i>', val.teamCity + ', ' + val.teamState];
                            }
                            else {
                                ctaDesc = 'Interested in discovering more about this player?';
                                primaryRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.playerName, val.playerId.toString());
                                primaryImage = global_settings_1.GlobalSettings.getImageUrl(val.imageUrl);
                                profileLinkText = {
                                    route: primaryRoute,
                                    text: val.playerName
                                };
                                var position = val.position.join(", ");
                                description = [
                                    teamLinkText,
                                    '<span class="separator">   |   </span> ',
                                    'Jersey: #' + val.uniformNumber,
                                    ' <span class="separator">   |   </span> ',
                                    position
                                ];
                            }
                            carouselItem = slider_carousel_component_1.SliderCarousel.convertToCarouselItemType2(index, {
                                isPageCarousel: profileType == 'page',
                                backgroundImage: global_settings_1.GlobalSettings.getBackgroundImageUrl(val.backgroundImage),
                                copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                                profileNameLink: profileLinkText,
                                description: description,
                                dataValue: val.stat,
                                dataLabel: mlb_global_functions_1.MLBGlobalFunctions.formatStatName(carInfo.stat) + ' for ' + currentYear,
                                circleImageUrl: primaryImage,
                                circleImageRoute: primaryRoute,
                                rank: val.rank
                            });
                            return carouselItem;
                        });
                    }
                    // console.log('TRANSFORMED CAROUSEL', carouselArray);
                    return carouselArray;
                };
                ListPageService.detailedData = function (data) {
                    var self = this;
                    var currentYear = new Date().getFullYear(); //TODO FOR POSSIBLE past season stats but for now we have lists for current year season
                    var detailData = data.listData;
                    var detailInfo = data.listInfo;
                    return detailData.map(function (val, index) {
                        var teamRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                        var teamLocation = val.teamCity + ", " + val.teamState;
                        var statDescription = mlb_global_functions_1.MLBGlobalFunctions.formatStatName(detailInfo.stat) + ' for ' + currentYear;
                        var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index + 1);
                        val.listRank = rank;
                        if (data.query.profile == 'team') {
                            var divisionName = mlb_global_functions_1.MLBGlobalFunctions.formatShortNameDivison(val.conferenceName) + val.divisionName.charAt(0).toUpperCase();
                            return {
                                dataPoints: ListPageService.detailsData([
                                    { route: teamRoute, text: val.teamName, class: "dataBox-mainLink" }
                                ], val.stat, [
                                    { text: teamLocation },
                                    { text: "   |   ", class: "separator" },
                                    { text: "Division: " + divisionName },
                                ], statDescription, 'fa fa-map-marker'),
                                imageConfig: ListPageService.imageData("list", global_settings_1.GlobalSettings.getImageUrl(val.teamLogo), teamRoute, val.listRank),
                                hasCTA: true,
                                ctaDesc: 'Want more info about this team?',
                                ctaBtn: '',
                                ctaText: 'View Profile',
                                ctaUrl: teamRoute
                            };
                        }
                        else if (data.query.profile == 'player') {
                            var playerFullName = val.playerFirstName + " " + val.playerLastName;
                            var playerRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId);
                            var position = val.position.join(", ");
                            return {
                                dataPoints: ListPageService.detailsData([
                                    { route: playerRoute, text: playerFullName, class: "dataBox-mainLink" }
                                ], val.stat, [
                                    { route: teamRoute, text: val.teamName, class: "dataBox-subLink" },
                                    { text: "   |   ", class: "separator" },
                                    { text: "Jersey: #" + val.uniformNumber },
                                    { text: "   |   ", class: "separator" },
                                    { text: position },
                                ], statDescription, null),
                                imageConfig: ListPageService.imageData("list", global_settings_1.GlobalSettings.getImageUrl(val.imageUrl), playerRoute, val.listRank, '', null),
                                hasCTA: true,
                                ctaDesc: 'Want more info about this player?',
                                ctaBtn: '',
                                ctaText: 'View Profile',
                                ctaUrl: playerRoute
                            };
                        }
                    });
                }; //end of function
                /**
                 *this function will have inputs of all required fields that are dynamic and output the full
                **/
                ListPageService.imageData = function (imageType, mainImgUrl, mainImgRoute, rank, subImgUrl, subImgRoute) {
                    var borderClass, mainImageClass, subImageClass, rankClass;
                    if (imageType == "carousel") {
                        mainImageClass = "image-150";
                        borderClass = "border-large";
                        rankClass = "image-48-rank";
                        subImageClass = "image-50-sub";
                    }
                    else {
                        mainImageClass = "image-121";
                        borderClass = "border-2";
                        rankClass = "image-38-rank";
                        subImageClass = "image-40-sub";
                    }
                    if (!mainImgUrl || mainImgUrl == '') {
                        mainImgUrl = "/app/public/no-image.png";
                    }
                    if (!rank) {
                        rank = 0;
                    }
                    //Add rank image
                    var subImages = [{
                            text: "#" + rank,
                            imageClass: rankClass + " image-round-upper-left image-round-sub-text"
                        }];
                    if (subImgRoute) {
                        //Add sub image if route exists.
                        if (!subImgUrl || subImgUrl == '') {
                            subImgUrl = "/app/public/no-image.png";
                        }
                        subImages.push({
                            imageUrl: subImgUrl,
                            urlRouteArray: subImgRoute,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: subImageClass + ' image-round-lower-right'
                        });
                    }
                    return {
                        imageClass: mainImageClass,
                        mainImage: {
                            imageUrl: mainImgUrl,
                            urlRouteArray: mainImgRoute,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: borderClass,
                        },
                        subImages: subImages,
                    };
                };
                ListPageService.detailsData = function (mainLeftText, mainRightValue, subLeftText, subRightValue, subIcon, dataLeftText, dataRightValue) {
                    if (!dataLeftText) {
                        dataLeftText = [];
                    }
                    var dataRightText = [];
                    if (dataRightValue != null) {
                        dataRightText.push(dataRightValue);
                    }
                    var details = [
                        {
                            style: 'detail-small',
                            leftText: dataLeftText,
                            rightText: dataRightText
                        },
                        {
                            style: 'detail-large',
                            leftText: mainLeftText,
                            rightText: [{ text: mainRightValue }]
                        },
                        {
                            style: 'detail-medium',
                            leftText: subLeftText,
                            rightText: [{ text: subRightValue }],
                            icon: subIcon,
                        },
                    ];
                    return details;
                };
                ListPageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ListPageService);
                return ListPageService;
            }());
            exports_1("ListPageService", ListPageService);
        }
    }
});
