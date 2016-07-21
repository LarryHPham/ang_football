System.register(['@angular/core', '@angular/http', '../global/global-functions', '../global/global-settings', './list-page.service', '../components/carousels/slider-carousel/slider-carousel.component'], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, global_settings_1, list_page_service_1, slider_carousel_component_1;
    var DynamicWidgetCall;
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
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (list_page_service_1_1) {
                list_page_service_1 = list_page_service_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            }],
        execute: function() {
            DynamicWidgetCall = (function () {
                function DynamicWidgetCall(http) {
                    this.http = http;
                    this.apiUrl = global_settings_1.GlobalSettings.getDynamicWidet();
                    this.pageLimit = 10;
                    this.protocol = location.protocol;
                }
                // Method to get data for the list for the dynamic widget
                // Inputs: tw - trigger word, sw - sort parameter, input - input value
                DynamicWidgetCall.prototype.getWidgetData = function (tw, sw, input) {
                    var _this = this;
                    // If value is not needed, pass -1
                    if (sw == null) {
                        sw = -1;
                    }
                    if (input == null) {
                        input = -1;
                    }
                    // Build the URL
                    var url = this.apiUrl + "?tw=" + tw + "&sw=" + sw + "&input=" + input;
                    return this.http.get(url, {})
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        var profile;
                        if (data.data[0].partner_url.match(/^Player/)) {
                            profile = "player";
                        }
                        else if (data.data[0].partner_url.match(/^Team/)) {
                            profile = "team";
                        }
                        var listData = _this.detailedData(data, profile);
                        var listDisplayName = data ? data.title : "";
                        var paginationParams = {
                            index: 1,
                            max: listData.length - 1,
                            paginationType: 'module'
                        };
                        var profHeader = {
                            imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                            imageRoute: ["MLB-page"],
                            text1: 'Last Updated: ' + moment(data.date).format('dddd, MMMM Do, YYYY'),
                            text2: ' United States',
                            text3: data.title,
                            text4: '',
                            icon: 'fa fa-map-marker',
                            hasHover: true
                        };
                        return {
                            profHeader: profHeader,
                            carData: _this.transformCarData(data, profile),
                            listData: listData,
                            pagination: paginationParams,
                            listDisplayTitle: listDisplayName
                        };
                    }, function (err) {
                        return err;
                    });
                };
                //TODO: remove linkObj for carousel description objects
                DynamicWidgetCall.prototype.transformCarData = function (data, profile) {
                    var self = this;
                    var carouselArray = [];
                    var currentYear = new Date().getFullYear(); //TODO FOR POSSIBLE past season stats but for now we have lists for current year season
                    var carData = data.data;
                    if (carData.length == 0 || profile != 'team' && profile != 'player') {
                        var errorMessage = "Sorry, we currently do not have any data for this particular list";
                        carouselArray.push(slider_carousel_component_1.SliderCarousel.convertToEmptyCarousel(errorMessage));
                    }
                    else {
                        //if data is coming through then run through the transforming function for the module
                        carouselArray = carData.map(function (val, index) {
                            var carouselItem;
                            var primaryRoute = global_functions_1.GlobalFunctions.parseToRoute(val['primary_url']);
                            var profileLinkText = {
                                route: primaryRoute,
                                text: val.title
                            };
                            var subLinkText;
                            var subRoute;
                            var footerInfo;
                            if (profile == 'team') {
                                subLinkText = {
                                    text: val.list_sub
                                };
                                footerInfo = {
                                    infoDesc: 'Interested in discovering more about this team?',
                                    text: 'View Profile',
                                    url: primaryRoute
                                };
                            }
                            else {
                                subRoute = global_functions_1.GlobalFunctions.parseToRoute(val['sub_img'].primary_url);
                                subLinkText = {
                                    route: subRoute,
                                    text: val.list_sub
                                };
                                footerInfo = {
                                    infoDesc: 'Interested in discovering more about this player?',
                                    text: 'View Profile',
                                    url: primaryRoute,
                                };
                            }
                            carouselItem = slider_carousel_component_1.SliderCarousel.convertToCarouselItemType2(index, {
                                isPageCarousel: true,
                                // backgroundImage: GlobalSettings.getBackgroundImageUrl(val.backgroundImage),
                                // copyrightInfo: GlobalSettings.getCopyrightInfo(),
                                profileNameLink: profileLinkText,
                                description: [subLinkText],
                                dataValue: val.value,
                                dataLabel: val.tag,
                                circleImageUrl: self.protocol + val.img,
                                circleImageRoute: primaryRoute,
                                // subImageUrl: self.protocol + val['sub_img'].img,
                                // subImageRoute: subRoute,              
                                rank: val.rank
                            });
                            carouselItem.footerInfo = footerInfo;
                            return carouselItem;
                        });
                    }
                    //console.log('TRANSFORMED CAROUSEL', carouselArray);
                    return this.modulePagination(carouselArray);
                };
                DynamicWidgetCall.prototype.detailedData = function (data, profile) {
                    if (profile != 'team' && profile != 'player') {
                        return []; //invalid profile type, so returning empty list;
                    }
                    var self = this;
                    var listDataArray = [];
                    var currentYear = new Date().getFullYear(); //TODO FOR POSSIBLE past season stats but for now we have lists for current year season
                    var detailData = data.data;
                    //var detailInfo = data.listInfo;
                    listDataArray = detailData.map(function (val, index) {
                        var primaryRoute = global_functions_1.GlobalFunctions.parseToRoute(val['primary_url']);
                        var subRoute;
                        var subImage;
                        var imageConfig;
                        var ctaDesc;
                        if (profile == 'team') {
                            ctaDesc = "Want more info about this team?";
                        }
                        else if (profile == "player") {
                            subRoute = global_functions_1.GlobalFunctions.parseToRoute(val['sub_img']['primary_url']);
                            subImage = self.protocol + val['sub_img'].img;
                            ctaDesc = "Want more info about this player?";
                        }
                        return {
                            dataPoints: list_page_service_1.ListPageService.detailsData([
                                { route: primaryRoute, text: val.title }
                            ], val.value, [
                                { text: val.list_sub, class: 'text-master text-heavy', route: subRoute }
                            ], val.tag),
                            imageConfig: list_page_service_1.ListPageService.imageData("list", self.protocol + val.img, primaryRoute, val.rank, subImage, subRoute),
                            hasCTA: true,
                            ctaDesc: ctaDesc,
                            ctaBtn: '',
                            ctaText: 'View Profile',
                            ctaUrl: primaryRoute
                        };
                    });
                    // console.log('TRANSFORMED List Data', listDataArray);
                    return this.modulePagination(listDataArray);
                }; //end of function
                DynamicWidgetCall.prototype.modulePagination = function (inputData) {
                    var objCounter = 0;
                    var objData1 = [];
                    var self = this;
                    inputData.forEach(function (item) {
                        if (typeof objData1[objCounter] == 'undefined' || objData1[objCounter] === null) {
                            objData1[objCounter] = [];
                            objData1[objCounter].push(item);
                        }
                        else {
                            objData1[objCounter].push(item);
                            // increment the objCounter to go to next array
                            if (objData1[objCounter].length >= self.pageLimit) {
                                objCounter++;
                            }
                        }
                    });
                    return objData1;
                };
                /**
                 *this function will have inputs of all required fields that are dynamic and output the full
                 **/
                //TODO replace data points for list page
                DynamicWidgetCall.prototype.imageData = function (imageClass, imageBorder, mainImg, mainImgRoute, rank, rankClass, subImgClass, subImg, subRoute) {
                    if (typeof mainImg == 'undefined' || mainImg == '') {
                        mainImg = "/app/public/no-image.png";
                    }
                    if (typeof subImg == 'undefined' || subImg == '') {
                        subImg = "/app/public/no-image.png";
                    }
                    if (typeof rank == 'undefined' || rank == 0) {
                        rank = 0;
                    }
                    var image = {
                        imageClass: imageClass,
                        mainImage: {
                            imageUrl: mainImg,
                            urlRouteArray: mainImgRoute,
                            hoverText: "<p>View</p><p>Profile</p>",
                            imageClass: imageBorder,
                        },
                        subImages: [
                            {
                                imageUrl: '',
                                urlRouteArray: '',
                                hoverText: '',
                                imageClass: ''
                            },
                            {
                                text: "#" + rank,
                                imageClass: rankClass + " image-round-upper-left image-round-sub-text"
                            }
                        ],
                    };
                    if (typeof subRoute != 'undefined') {
                        image['subImages'] = [];
                        image['subImages'] = [
                            {
                                imageUrl: subImg,
                                urlRouteArray: subRoute,
                                hoverText: "<i class='fa fa-mail-forward'></i>",
                                imageClass: subImgClass + " image-round-lower-right"
                            },
                            {
                                text: "#" + rank,
                                imageClass: rankClass + " image-round-upper-left image-round-sub-text"
                            }
                        ];
                    }
                    return image;
                };
                DynamicWidgetCall = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], DynamicWidgetCall);
                return DynamicWidgetCall;
            }());
            exports_1("DynamicWidgetCall", DynamicWidgetCall);
        }
    }
});
