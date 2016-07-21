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
    var ListOfListsService;
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
            ListOfListsService = (function () {
                // private _apiToken: string = 'BApA7KEfj';
                // private _headerName: string = 'X-SNT-TOKEN';
                function ListOfListsService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                //Function to set custom headers
                ListOfListsService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    //headers.append(this.headerName, this.apiToken);
                    return headers;
                };
                //http://dev-homerunloyal-api.synapsys.us/listOfLists/league/5
                ListOfListsService.prototype.getListOfListsService = function (urlParams, profileType, pageType) {
                    var _this = this;
                    // Configure HTTP Headers
                    var headers = this.setToken();
                    // let type    = urlParams.type;
                    var id = urlParams.id != null ? urlParams.id : "";
                    var limit = urlParams.limit != null ? urlParams.limit : 4;
                    var pageNum = urlParams.pageNum != null ? urlParams.pageNum : 1;
                    // Set scope for url based on type
                    var callURL = this._apiUrl + '/listOfLists/';
                    switch (profileType) {
                        case "player":
                            var scope = urlParams.scope != null ? urlParams.scope : "league";
                            callURL += 'player/' + id + '/' + scope + '/' + limit + '/' + pageNum;
                            break;
                        case "team":
                            callURL += 'team/' + id + '/' + limit + '/' + pageNum;
                            break;
                        case "league":
                            callURL += 'league/' + limit + '/' + pageNum;
                            break;
                    }
                    // console.log("list of lists url " + callURL);
                    return this.http.get(callURL, {
                        headers: headers
                    })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        if (!data || !data.data) {
                            return null;
                        }
                        var lastUpdated = "";
                        if (data && data.data && data.data.length > 0 && data.data != undefined) {
                            lastUpdated = data.data[0].targetData;
                        }
                        return {
                            carData: _this.carDataPage(data.data),
                            listData: _this.detailedData(data.data, pageType),
                            targetData: _this.getTargetData(data.data),
                            pagination: data.data[0].listInfo,
                            lastUpdated: lastUpdated
                        };
                    });
                };
                ListOfListsService.prototype.getTargetData = function (data) {
                    return (data[0].targetData);
                };
                //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
                ListOfListsService.prototype.carDataPage = function (data) {
                    var self = this;
                    var carouselArray = [];
                    if (data.length == 0) {
                        carouselArray.push(slider_carousel_component_1.SliderCarousel.convertToEmptyCarousel("Sorry, we currently do not have any data for this list."));
                    }
                    else {
                        //if data is coming through then run through the transforming function for the module
                        data.forEach(function (val, index) {
                            if (val.listData[0] == null)
                                return;
                            var itemInfo = val.listInfo;
                            var itemTargetData = val.targetData;
                            var itemProfile = null;
                            var itemImgUrl = null;
                            var itemRoute = null;
                            var itemSubImg = null;
                            var itemSubRoute = null;
                            // let itemHasHover      = version == "page";
                            // let ctaUrlArray       = itemInfo.url.split("/");
                            var itemStatName = (itemInfo.stat).replace(/-/g, " ");
                            // let updatedDate       = moment(itemTargetData.lastUpdated).format('dddd, MMMM Do, YYYY');
                            var itemDescription = [];
                            var rankStr = itemTargetData.rank + global_functions_1.GlobalFunctions.Suffix(Number(itemTargetData.rank));
                            var profileLinkText;
                            if (itemInfo.target == "player") {
                                itemProfile = itemTargetData.playerName;
                                itemImgUrl = global_settings_1.GlobalSettings.getImageUrl(itemTargetData.imageUrl);
                                itemRoute = mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(itemTargetData.teamName, itemTargetData.playerName, itemTargetData.playerId);
                                itemSubImg = mlb_global_functions_1.MLBGlobalFunctions.formatTeamLogo(itemTargetData.teamName);
                                itemSubRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(itemTargetData.teamName, itemTargetData.teamId);
                                profileLinkText = {
                                    route: itemRoute,
                                    text: itemProfile,
                                    class: 'text-heavy'
                                };
                                itemDescription = [profileLinkText, " is currently ranked <b>" + rankStr + "</b> in the " + itemInfo.scope + " with the most <b>" + itemStatName + "</b>."];
                            }
                            else if (itemInfo.target == "team") {
                                itemProfile = itemTargetData.teamName;
                                itemImgUrl = global_settings_1.GlobalSettings.getImageUrl(itemTargetData.teamLogo);
                                itemRoute = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(itemTargetData.teamName, itemTargetData.teamId);
                                profileLinkText = {
                                    route: itemRoute,
                                    text: itemProfile
                                };
                                itemDescription = ["The ", profileLinkText, " are currently ranked <b>" + rankStr + "</b> in the " + itemInfo.scope + " with the most <b>" + itemStatName + "</b>."];
                            }
                            if (itemTargetData.backgroundImage == null || itemTargetData.backgroundImage == undefined) {
                                itemTargetData.backgroundImage = "/app/public/Image-Placeholder-2.jpg";
                            }
                            else {
                                itemTargetData.backgroundImage = global_settings_1.GlobalSettings.getBackgroundImageUrl(itemTargetData.backgroundImage);
                            }
                            var carouselItem = slider_carousel_component_1.SliderCarousel.convertToCarouselItemType1(index, {
                                backgroundImage: itemTargetData.backgroundImage,
                                copyrightInfo: global_settings_1.GlobalSettings.getCopyrightInfo(),
                                subheader: ["Related List - ", profileLinkText],
                                profileNameLink: { text: itemInfo.name },
                                description: itemDescription,
                                lastUpdatedDate: global_functions_1.GlobalFunctions.formatUpdatedDate(itemTargetData.lastUpdated),
                                circleImageUrl: itemImgUrl,
                                circleImageRoute: itemRoute,
                                rank: itemTargetData.rank,
                                rankClass: "image-48-rank"
                            });
                            carouselArray.push(carouselItem);
                        });
                    }
                    // console.log('TRANSFORMED CAROUSEL', carouselArray);
                    return carouselArray;
                };
                ListOfListsService.prototype.detailedData = function (data, version) {
                    var listDataArray = [];
                    var dummyUrl = "/list/player/batter-home-runs/asc/National";
                    var dummyName = "Batters with the most home runs in the National League";
                    var dummyStat = "batter-home-runs";
                    var dummyOrdering = "asc";
                    var dummyScope = "conference";
                    var dummyConference = "National";
                    var dummyDivision = "all";
                    var dummyListCount = 1;
                    var dummyPageCount = 1;
                    var dummyListRank = 1;
                    var dummyIcon = "fa fa-mail-forward";
                    data.forEach(function (item, index) {
                        var itemInfo = item.listInfo;
                        var itemListData = item.listData;
                        if (itemListData.length < 1)
                            return;
                        itemListData.unshift(item.targetData);
                        itemListData = itemListData.slice(0, 6);
                        var itemListInfo = item['listInfo'];
                        var ctaUrlArray = itemListInfo.url.split("/");
                        // removes first empty item and second "list" item
                        ctaUrlArray.splice(0, 2);
                        ctaUrlArray.push.apply(ctaUrlArray, ["10", "1"]);
                        var profileTypePlural = "types";
                        if (itemListInfo.target == "player") {
                            profileTypePlural = "players";
                        }
                        else if (itemListInfo.target == "team") {
                            profileTypePlural = "teams";
                        }
                        var listData = {
                            url: itemListInfo.url != null ? itemListInfo.url : dummyUrl,
                            name: itemListInfo.name != null ? itemListInfo.name : dummyName,
                            target: itemInfo.target,
                            stat: itemListInfo.stat != null ? itemListInfo.stat : dummyStat,
                            ordering: itemListInfo.ordering != null ? itemListInfo.ordering : dummyOrdering,
                            scope: itemListInfo.scope != null ? itemListInfo.scope : dummyScope,
                            conference: itemListInfo.conference != null ? itemListInfo.conference : dummyConference,
                            division: itemListInfo.division != null ? itemListInfo.division : dummyDivision,
                            listCount: itemListInfo.listCount != null ? itemListInfo.listCount : dummyListCount,
                            pageCount: itemListInfo.pageCount != null ? itemListInfo.pageCount : dummyPageCount,
                            listRank: itemListInfo.listRank != null ? itemListInfo.listRank : dummyListRank,
                            icon: itemListInfo.icon != null ? itemListInfo.icon : dummyIcon,
                            dataPoints: [],
                            ctaBtn: '',
                            ctaDesc: 'Want to see the ' + profileTypePlural + ' in this list?',
                            ctaText: 'View The List',
                            ctaUrl: mlb_global_functions_1.MLBGlobalFunctions.formatListRoute(ctaUrlArray)
                        };
                        itemListData.forEach(function (val, index) {
                            var itemUrlRouteArray = itemListInfo.target == "player" ?
                                mlb_global_functions_1.MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.playerName, val.playerId) :
                                mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                            var firstItemHover = version == "page" ? "<p>View</p><p>Profile</p>" : null;
                            listData.dataPoints.push({
                                imageClass: index > 0 ? "image-43" : "image-121",
                                mainImage: {
                                    imageUrl: val.imageUrl != null ? global_settings_1.GlobalSettings.getImageUrl(val.imageUrl) : global_settings_1.GlobalSettings.getImageUrl(val.teamLogo),
                                    urlRouteArray: version == "page" || index > 0 ? itemUrlRouteArray : null,
                                    hoverText: index > 0 ? "<i class='fa fa-mail-forward'></i>" : firstItemHover,
                                    imageClass: index > 0 ? "border-1" : "border-2"
                                },
                                subImages: index > 0 ? null : [
                                    // {
                                    //   imageUrl      : itemListInfo.target == "player" ? MLBGlobalFunctions.formatTeamLogo(val.teamName) : null,
                                    //   urlRouteArray : itemListInfo.target == "player" ? MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId) : null,
                                    //   hoverText     : itemListInfo.target == "player" ? "<i class='fa fa-mail-forward'></i>" : null,
                                    //   imageClass    : itemListInfo.target == "player" ? "image-round-sub image-40-sub image-round-lower-right" : null
                                    // },
                                    {
                                        text: "#" + val.rank,
                                        imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                                    }]
                            });
                        });
                        listDataArray.push(listData);
                    });
                    return listDataArray;
                };
                ListOfListsService.prototype.imageData = function (imageClass, imageBorder, mainImg, mainImgRoute, subImgClass, subImg, subRoute, rank, hasHover) {
                    if (typeof mainImg == 'undefined' || mainImg == '') {
                        mainImg = global_settings_1.GlobalSettings.getImageUrl("/mlb/players/no-image.png");
                    }
                    if (typeof subImg == 'undefined' || subImg == '') {
                        mainImg = global_settings_1.GlobalSettings.getImageUrl("/mlb/players/no-image.png");
                    }
                    if (typeof rank == 'undefined' || rank == 0) {
                        rank = 0;
                    }
                    var image = {
                        imageClass: imageClass,
                        mainImage: {
                            imageUrl: mainImg,
                            urlRouteArray: hasHover ? mainImgRoute : null,
                            hoverText: hasHover ? "<p>View</p><p>Profile</p>" : null,
                            imageClass: imageBorder
                        },
                        subImages: [
                            {
                                imageUrl: subImg,
                                urlRouteArray: subRoute,
                                hoverText: "<i class='fa fa-mail-forward'></i>",
                                imageClass: subImgClass + " image-round-lower-right"
                            },
                            {
                                text: "#" + rank,
                                imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                            }
                        ],
                    };
                    return image;
                };
                ListOfListsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ListOfListsService);
                return ListOfListsService;
            }());
            exports_1("ListOfListsService", ListOfListsService);
        }
    }
});
