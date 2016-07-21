System.register(['@angular/core', '../../components/images/rectangle-image', "@angular/router-deprecated"], function(exports_1, context_1) {
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
    var core_1, rectangle_image_1, router_deprecated_1;
    var ArticleStacktopComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (rectangle_image_1_1) {
                rectangle_image_1 = rectangle_image_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            ArticleStacktopComponent = (function () {
                function ArticleStacktopComponent() {
                }
                ArticleStacktopComponent.prototype.ngOnInit = function () {
                    if (typeof this.stackTopData == 'undefined') {
                        var sampleImage = "/app/public/placeholder_XL.png";
                        this.stackTopData = {
                            date: "[Keyword]",
                            headline: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempo",
                            provider1: "By [Columnist Name]",
                            provider2: "Published By: [Domain.com]",
                            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                            imageConfig: {
                                imageClass: "image-610x420",
                                mainImage: {
                                    imageUrl: sampleImage
                                }
                            }
                        }; //this.dataPoint ends
                    }
                }; //ngOnInit ends
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ArticleStacktopComponent.prototype, "stackTopData", void 0);
                ArticleStacktopComponent = __decorate([
                    core_1.Component({
                        selector: 'article-stacktop-component',
                        templateUrl: './app/components/article-stacktop/article-stacktop.component.html',
                        directives: [rectangle_image_1.RectangleImage, router_deprecated_1.ROUTER_DIRECTIVES],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ArticleStacktopComponent);
                return ArticleStacktopComponent;
            }());
            exports_1("ArticleStacktopComponent", ArticleStacktopComponent);
        }
    }
});
