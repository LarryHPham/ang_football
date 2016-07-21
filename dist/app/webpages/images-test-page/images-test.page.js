System.register(['@angular/core', '../../components/backtab/backtab.component', '../../components/title/title.component', '../../components/images/circle-image', "../../global/global-gradient", '../../global/global-settings'], function(exports_1, context_1) {
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
    var core_1, backtab_component_1, title_component_1, circle_image_1, global_gradient_1, global_settings_1;
    var ImagesTestPage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (title_component_1_1) {
                title_component_1 = title_component_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (global_gradient_1_1) {
                global_gradient_1 = global_gradient_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            ImagesTestPage = (function () {
                function ImagesTestPage() {
                    this.gradientStyles = [];
                    this.getData();
                }
                ImagesTestPage.prototype.getData = function () {
                    //About us title
                    this.titleData = {
                        imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                        text1: 'Last Updated: Monday, February 26, 2016',
                        text2: ' United States of America',
                        text3: 'Test Page',
                        text4: 'A test page for designing and viewing CSS styles',
                        icon: 'fa fa-map-marker'
                    };
                    this.gradientStyles.push(global_gradient_1.Gradient.getGradientStyles(["#A71930", "#000000", "#E3D4AD"], .75));
                    this.gradientStyles.push(global_gradient_1.Gradient.getGradientStyles(["#CE1141", "#13274F"], .75));
                    var sampleImage = "./app/public/placeholder-location-bad.jpg";
                    this.testImages = [
                        {
                            description: "Season Stats, Player Career Stats Module, Injury & Suspension Carousel, Standings Carousel, Team Transactions Carousel",
                            imageData: {
                                imageClass: "image-150",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    urlRouteArray: ['Disclaimer-page'],
                                    hoverText: "Sample",
                                    imageClass: "border-large"
                                },
                                subImages: [{
                                        imageUrl: sampleImage,
                                        hoverText: "sub",
                                        imageClass: "image-50-sub image-round-lower-right"
                                    }]
                            }
                        },
                        {
                            description: "Team Roster Carousel",
                            imageData: {
                                imageClass: "image-150",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    urlRouteArray: ['Disclaimer-page'],
                                    hoverText: "Sample",
                                    imageClass: "border-large"
                                },
                                subImages: [
                                    {
                                        imageUrl: sampleImage,
                                        urlRouteArray: ['Disclaimer-page'],
                                        hoverText: "<i class='fa fa-mail-forward'></i>",
                                        imageClass: "image-50-sub image-round-lower-right"
                                    },
                                    {
                                        text: "14",
                                        imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                                    }
                                ],
                            }
                        },
                        {
                            description: "About the League Module",
                            imageData: {
                                imageClass: "image-150",
                                mainImage: {
                                    imageUrl: undefined,
                                    urlRouteArray: ['Disclaimer-page'],
                                    hoverText: "<p>View</p><p>Profile</p>",
                                    imageClass: "border-large"
                                }
                            }
                        },
                        {
                            description: "Profile Header",
                            imageData: {
                                imageClass: "image-180",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    hoverText: "Sample",
                                    imageClass: "border-large"
                                }
                            }
                        },
                        {
                            description: "Player Comparision Module",
                            imageData: {
                                imageClass: "image-180",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    hoverText: "Sample",
                                    imageClass: "border-large"
                                },
                                subImages: [
                                    {
                                        imageUrl: sampleImage,
                                        urlRouteArray: ['Disclaimer-page'],
                                        hoverText: "sub",
                                        imageClass: "image-50-sub image-round-lower-right"
                                    },
                                    {
                                        text: "6",
                                        imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                                    }
                                ],
                            }
                        },
                        {
                            description: "Injury & Suspension Module - list, Team Roster Module - table row",
                            imageData: {
                                imageClass: "image-48",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    hoverText: "Sample",
                                    imageClass: "border-1"
                                }
                            }
                        },
                        {
                            description: "Team Transactions Page - list",
                            imageData: {
                                imageClass: "image-50",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    hoverText: "Sample",
                                    imageClass: "border-1"
                                }
                            }
                        },
                        {
                            description: "List of lists Module - small",
                            imageData: {
                                imageClass: "image-43",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    hoverText: "Sample",
                                    imageClass: "border-1"
                                }
                            }
                        },
                        {
                            description: "Standings Module - table row",
                            imageData: {
                                imageClass: "image-46",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    hoverText: "Sample",
                                    imageClass: "border-2"
                                }
                            }
                        },
                        {
                            description: "List of lists Module - large",
                            imageData: {
                                imageClass: "image-121",
                                mainImage: {
                                    imageUrl: sampleImage,
                                    hoverText: "Sample",
                                    imageClass: "border-2"
                                },
                                subImages: [
                                    {
                                        text: "6",
                                        imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
                                    }
                                ],
                            }
                        }
                    ];
                };
                ImagesTestPage = __decorate([
                    core_1.Component({
                        selector: 'images-test-page',
                        templateUrl: './app/webpages/images-test-page/images-test.page.html',
                        directives: [backtab_component_1.BackTabComponent, title_component_1.TitleComponent, circle_image_1.CircleImage],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ImagesTestPage);
                return ImagesTestPage;
            }());
            exports_1("ImagesTestPage", ImagesTestPage);
        }
    }
});
