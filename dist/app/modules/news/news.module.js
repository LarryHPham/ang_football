System.register(['@angular/core', '../../components/module-header/module-header.component', '../../components/carousels/news-carousel/news-carousel.component', '../../components/module-footer/module-footer.component', "@angular/router-deprecated", "../../components/buttons/circle/circle.button"], function(exports_1, context_1) {
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
    var core_1, module_header_component_1, news_carousel_component_1, module_footer_component_1, router_deprecated_1, circle_button_1;
    var NewsModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (news_carousel_component_1_1) {
                news_carousel_component_1 = news_carousel_component_1_1;
            },
            function (module_footer_component_1_1) {
                module_footer_component_1 = module_footer_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (circle_button_1_1) {
                circle_button_1 = circle_button_1_1;
            }],
        execute: function() {
            NewsModule = (function () {
                function NewsModule(_params) {
                    this._params = _params;
                    this.counter = 0;
                    this.title = "Articles";
                    this.locateShareThis = function () {
                        stButtons.locateElements();
                    };
                    this.headerInfo = {
                        moduleTitle: "Other Content You Will Love - [Profile Name]",
                        hasIcon: true,
                        iconClass: "fa fa-heart"
                    };
                }
                NewsModule.prototype.left = function () {
                    var counter = this.counter;
                    counter--;
                    //make a check to see if the array is below 0 change the array to the top level
                    if (counter < 0) {
                        this.counter = (this.max - 1);
                    }
                    else {
                        this.counter = counter;
                    }
                    this.changeMain(this.counter);
                };
                NewsModule.prototype.right = function () {
                    var counter = this.counter;
                    counter++;
                    //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
                    if (counter == this.max) {
                        this.counter = 0;
                    }
                    else {
                        this.counter = counter;
                    }
                    this.changeMain(this.counter);
                };
                //this is where the angular2 decides what is the main image
                NewsModule.prototype.changeMain = function (num) {
                    if (num < this.max) {
                        this.displayData = this.newsDataArray[num];
                    }
                    ;
                };
                NewsModule.prototype.setupNewsData = function () {
                    // this.max = this.newsDataArray.length;
                    this.max = 10;
                    this.changeMain(this.counter);
                };
                NewsModule.prototype.ngOnChanges = function () {
                    var profileName = this.profileName ? this.profileName : "MLB";
                    this.headerInfo.moduleTitle = "Other Content You Will Love - " + profileName;
                };
                NewsModule.prototype.ngOnInit = function () {
                    this.setupNewsData();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], NewsModule.prototype, "newsDataArray", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], NewsModule.prototype, "profileName", void 0);
                NewsModule = __decorate([
                    core_1.Component({
                        selector: 'news-module',
                        templateUrl: './app/modules/news/news.module.html',
                        directives: [module_header_component_1.ModuleHeader, news_carousel_component_1.NewsCarousel, module_footer_component_1.ModuleFooter, circle_button_1.CircleButton],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams])
                ], NewsModule);
                return NewsModule;
            }());
            exports_1("NewsModule", NewsModule);
        }
    }
});
