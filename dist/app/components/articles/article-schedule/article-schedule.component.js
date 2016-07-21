System.register(["@angular/core", "../../images/circle-image", '../../../global/global-gradient', "@angular/router-deprecated"], function(exports_1, context_1) {
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
    var core_1, circle_image_1, global_gradient_1, router_deprecated_1;
    var ArticleScheduleComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (global_gradient_1_1) {
                global_gradient_1 = global_gradient_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            ArticleScheduleComponent = (function () {
                function ArticleScheduleComponent() {
                }
                ArticleScheduleComponent.prototype.ngOnInit = function () {
                };
                ArticleScheduleComponent.prototype.ngOnChanges = function () {
                    if (typeof this.homeData != 'undefined' && typeof this.awayData != 'undefined') {
                        this.awayHex = this.awayData[0].awayHex;
                        this.homeHex = this.homeData[0].homeHex;
                        var fullGradient = global_gradient_1.Gradient.getGradientStyles([this.awayHex, this.homeHex], .75);
                        if (fullGradient) {
                            this.gradient = fullGradient;
                        }
                        else {
                            this.defaultGradient = 'default-gradient';
                        }
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ArticleScheduleComponent.prototype, "homeData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ArticleScheduleComponent.prototype, "awayData", void 0);
                ArticleScheduleComponent = __decorate([
                    core_1.Component({
                        selector: 'article-schedule-component',
                        templateUrl: './app/components/articles/article-schedule/article-schedule.component.html',
                        directives: [circle_image_1.CircleImage, router_deprecated_1.ROUTER_DIRECTIVES],
                        inputs: ['articleData', 'league', 'homeData', 'awayData'],
                        providers: [],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ArticleScheduleComponent);
                return ArticleScheduleComponent;
            }());
            exports_1("ArticleScheduleComponent", ArticleScheduleComponent);
        }
    }
});
