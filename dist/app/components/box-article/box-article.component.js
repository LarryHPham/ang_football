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
    var BoxArticleComponent;
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
            BoxArticleComponent = (function () {
                function BoxArticleComponent() {
                }
                BoxArticleComponent.prototype.ngOnInit = function () {
                    if (typeof this.boxArticleData == 'undefined') {
                        var sampleImage = "/app/public/placeholder_XL.png";
                        this.boxArticleData = [{
                                keyword: "[Keyword]",
                                date: "[Date]",
                                url: "/",
                                teaser: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempo ipsum dolor sit amet, consectetur adipisicing",
                                imageConfig: {
                                    imageClass: "image-288x180",
                                    mainImage: {
                                        imageUrl: sampleImage
                                    }
                                }
                            }]; //this.dataPoint ends
                    }
                }; //ngOnInit ends
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], BoxArticleComponent.prototype, "boxArticleData", void 0);
                BoxArticleComponent = __decorate([
                    core_1.Component({
                        selector: 'box-article-component',
                        templateUrl: './app/components/box-article/box-article.component.html',
                        directives: [rectangle_image_1.RectangleImage, router_deprecated_1.ROUTER_DIRECTIVES],
                    }), 
                    __metadata('design:paramtypes', [])
                ], BoxArticleComponent);
                return BoxArticleComponent;
            }());
            exports_1("BoxArticleComponent", BoxArticleComponent);
        }
    }
});
