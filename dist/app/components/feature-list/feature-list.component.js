System.register(['@angular/core', '../../components/buttons/carousel/carousel.button', '@angular/router-deprecated'], function(exports_1, context_1) {
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
    var core_1, carousel_button_1, router_deprecated_1;
    var FeatureComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (carousel_button_1_1) {
                carousel_button_1 = carousel_button_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            FeatureComponent = (function () {
                function FeatureComponent() {
                    this.counter = 1;
                    this.scrollRight = new core_1.EventEmitter();
                    this.scrollLeft = new core_1.EventEmitter();
                }
                FeatureComponent.prototype.left = function () {
                    this.scrollLeft.next(true);
                };
                FeatureComponent.prototype.right = function () {
                    this.scrollRight.next(true);
                };
                FeatureComponent.prototype.ngOnInit = function () {
                    this.settings = {
                        main_hasSubImg: true,
                        hasHover: true,
                        counterIf: true,
                        hasBottomImg: false
                    };
                    if (typeof this.list_data != 'undefined') {
                        this.counter = this.list_data['rank'];
                    }
                    if (typeof this.list_data === 'undefined') {
                        this.list_data = {
                            header: 'Trending Real Estate',
                            title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do.',
                            hding1: '[Listing Address]',
                            hding2: '[Listing Name] [Zip Code] - [Neighborhood]',
                            detail1: 'Bedrooms: 3 | Bathrooms: 2',
                            detail2: 'Asking Price: ',
                            detail3: '$[###,###]'
                        };
                    } // end of list_data undefined
                }; //end ngOnInit()
                FeatureComponent = __decorate([
                    core_1.Component({
                        selector: 'feature-component',
                        templateUrl: './app/components/feature-list/feature-list.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, carousel_button_1.CarouselButton],
                        providers: [],
                        inputs: ['list_data'],
                        outputs: ['scrollRight', 'scrollLeft']
                    }), 
                    __metadata('design:paramtypes', [])
                ], FeatureComponent);
                return FeatureComponent;
            }());
            exports_1("FeatureComponent", FeatureComponent);
        }
    }
});
