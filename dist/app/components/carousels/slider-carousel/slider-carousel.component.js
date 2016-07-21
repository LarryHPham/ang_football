System.register(['@angular/core', '@angular/platform-browser', '@angular/router-deprecated', '../../images/circle-image', '../carousel.component', '../../module-footer/module-footer.component', '../../complex-inner-html/complex-inner-html.component'], function(exports_1, context_1) {
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
    var core_1, platform_browser_1, router_deprecated_1, circle_image_1, carousel_component_1, module_footer_component_1, complex_inner_html_component_1;
    var SliderCarousel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (carousel_component_1_1) {
                carousel_component_1 = carousel_component_1_1;
            },
            function (module_footer_component_1_1) {
                module_footer_component_1 = module_footer_component_1_1;
            },
            function (complex_inner_html_component_1_1) {
                complex_inner_html_component_1 = complex_inner_html_component_1_1;
            }],
        execute: function() {
            SliderCarousel = (function () {
                function SliderCarousel(_sanitizer) {
                    this._sanitizer = _sanitizer;
                    /**
                     * interface for the output to return an index
                     */
                    this.indexNum = new core_1.EventEmitter(true); //async = true 
                }
                SliderCarousel.prototype.response = function (event) {
                    //set the data event being emitted back from the carousel component
                    this.dataPoint = event;
                    if (this.dataPoint.backgroundImage) {
                        this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl(this.dataPoint.backgroundImage);
                    }
                    else {
                        //var randomIndex = Math.random() > .5 ? 1 : 2;
                        this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl('/app/public/Image-Placeholder-2.jpg');
                    }
                    //sets the index of the dataPoint of its current position in the array
                    // the '?' meaning if there is data to even receive
                    if (typeof this.dataPoint['index'] != 'undefined') {
                        this.indexNum.next(this.dataPoint.index);
                    }
                };
                SliderCarousel.prototype.ngOnChanges = function () {
                    // Don't set indexInput to 0 here, it resets anything the parent specifies
                    // this.indexInput = 0;
                };
                SliderCarousel.prototype.ngOnInit = function () {
                    //incase there is no backgroundImage being return set the default background
                    if (typeof this.backgroundImage == 'undefined') {
                        this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl('/app/public/Image-Placeholder-1.jpg');
                    }
                    //In case of errors display below
                    if (typeof this.dataPoint == 'undefined') {
                        var sampleImage = "./app/public/no-image.png";
                        this.dataPoint =
                            {
                                index: '1',
                                imageConfig: {
                                    imageClass: "image-150",
                                    mainImage: {
                                        imageUrl: sampleImage,
                                        imageClass: "border-large"
                                    },
                                    subImages: [
                                        {
                                            imageUrl: sampleImage,
                                            imageClass: "image-50-sub image-round-lower-right"
                                        }
                                    ],
                                },
                                description: [
                                    "<p></p>",
                                    "<p></p>",
                                    "<p></p>",
                                    "<p></p>",
                                ],
                            };
                    }
                };
                /**
                 * The type 1 carousel style is used most carousels. The circle image
                 * can optionlly contain a sub-image (image-50-sub class) and
                 * a rank (defaults to image-38-rank class if item.rankClass is null).
                 * The four lines in the description are formatted as such:
                 *
                 *            • [subheader] (small, uppercase font)
                 *            [profileNameLink] (large font)
                 *            [description] (medium font)
                 *            Last Updated On [lastUpdatedDate] (small font)
                 */
                SliderCarousel.convertToCarouselItemType1 = function (index, item) {
                    var subImages = [];
                    if (item.subImageRoute) {
                        subImages.push({
                            imageUrl: item.subImageUrl,
                            urlRouteArray: item.subImageRoute,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "image-50-sub image-round-lower-right"
                        });
                    }
                    if (item.rank != null) {
                        var rankClass = item.rankClass ? item.rankClass : "image-38-rank";
                        subImages.push({
                            text: "#" + item.rank,
                            imageClass: rankClass + " image-round-upper-left image-round-sub-text"
                        });
                    }
                    var subheaderText = ['<i class="fa fa-circle"></i>'];
                    Array.prototype.push.apply(subheaderText, item.subheader);
                    return {
                        index: index,
                        backgroundImage: item.backgroundImage,
                        copyrightInfo: item.copyrightInfo,
                        description: [
                            {
                                class: 'scc-details-type1-subhdr',
                                textData: subheaderText
                            },
                            {
                                class: 'scc-details-type1-hdr',
                                textData: item.profileNameLink ? [item.profileNameLink] : []
                            },
                            {
                                class: 'scc-details-type1-desc',
                                textData: item.description ? item.description : []
                            },
                            {
                                class: 'scc-details-type1-date',
                                textData: item.lastUpdatedDate ? ["Last Updated On " + item.lastUpdatedDate] : []
                            }
                        ],
                        imageConfig: {
                            imageClass: "image-150",
                            mainImage: {
                                imageClass: "border-10",
                                urlRouteArray: item.circleImageRoute,
                                imageUrl: item.circleImageUrl,
                                hoverText: "<p>View</p><p>Profile</p>"
                            },
                            subImages: subImages
                        }
                    };
                };
                /**
                 * The type 2 carousel style is used for list pages. The circle image
                 * can optionally contain a sub-image (image-50-sub class) and
                 * a rank (image-48-rank class).
                 * The four lines in the description are formatted as such:
                 *
                 *            [ProfileNameLink] (larger font)
                 *            [description] (smaller font)
                 *
                 *            [dataValue] (larger font)
                 *            [dataLabel] (smaller font)
                 */
                SliderCarousel.convertToCarouselItemType2 = function (index, item) {
                    var subImages = [];
                    if (item.subImageRoute) {
                        subImages.push({
                            imageUrl: item.subImageUrl,
                            urlRouteArray: item.subImageRoute,
                            hoverText: "<i class='fa fa-mail-forward'></i>",
                            imageClass: "image-50-sub image-round-lower-right"
                        });
                    }
                    if (item.rank != null) {
                        subImages.push({
                            text: "#" + item.rank,
                            imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                        });
                    }
                    return {
                        index: index,
                        backgroundImage: item.backgroundImage,
                        copyrightInfo: item.copyrightInfo,
                        description: [
                            {
                                class: item.isPageCarousel ? 'scc-details-type2-page-hdr' : 'scc-details-type2-hdr',
                                textData: item.profileNameLink ? [item.profileNameLink] : []
                            },
                            {
                                class: 'scc-details-type2-desc',
                                textData: item.description
                            },
                            {
                                class: 'scc-details-type2-value',
                                textData: item.dataValue ? [item.dataValue] : []
                            },
                            {
                                class: 'scc-details-type2-lbl',
                                textData: item.dataLabel ? [item.dataLabel] : []
                            }
                        ],
                        imageConfig: {
                            imageClass: "image-150",
                            mainImage: {
                                imageClass: "border-10",
                                urlRouteArray: item.circleImageRoute,
                                imageUrl: item.circleImageUrl,
                                hoverText: "<p>View</p><p>Profile</p>"
                            },
                            subImages: subImages
                        }
                    };
                };
                SliderCarousel.convertToEmptyCarousel = function (errorMessage) {
                    return {
                        index: 2,
                        description: [
                            {
                                class: 'scc-details-type2-error',
                                textData: errorMessage ? [errorMessage] : []
                            }
                        ],
                        imageConfig: {
                            imageClass: "image-150",
                            mainImage: {
                                imageClass: "border-10",
                                urlRouteArray: null,
                                imageUrl: "/app/public/no-image.png",
                                hoverText: ""
                            },
                            subImages: []
                        }
                    };
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], SliderCarousel.prototype, "carouselData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SliderCarousel.prototype, "backgroundImage", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SliderCarousel.prototype, "indexInput", void 0);
                __decorate([
                    //this is an optional Input to determine where the current index is currently positioned. otherwise set the defaul indexInput to 0;
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SliderCarousel.prototype, "footerStyle", void 0);
                SliderCarousel = __decorate([
                    core_1.Component({
                        selector: 'slider-carousel',
                        templateUrl: './app/components/carousels/slider-carousel/slider-carousel.component.html',
                        directives: [module_footer_component_1.ModuleFooter, carousel_component_1.Carousel, circle_image_1.CircleImage, router_deprecated_1.ROUTER_DIRECTIVES, complex_inner_html_component_1.ComplexInnerHtml],
                        providers: [],
                        outputs: ['indexNum'],
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], SliderCarousel);
                return SliderCarousel;
            }());
            exports_1("SliderCarousel", SliderCarousel);
        }
    }
});
