System.register(['@angular/core', '../owl-carousel/owl-carousel.component'], function(exports_1, context_1) {
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
    var core_1, owl_carousel_component_1;
    var SideScroll;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (owl_carousel_component_1_1) {
                owl_carousel_component_1 = owl_carousel_component_1_1;
            }],
        execute: function() {
            SideScroll = (function () {
                function SideScroll() {
                    this.carouselCount = new core_1.EventEmitter();
                    this.count = 0;
                    this.options = {
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: 3,
                                nav: false,
                                navText: false,
                                loop: false
                            },
                            640: {
                                items: 4,
                                nav: false,
                                navText: false,
                                loop: false
                            },
                            768: {
                                items: 6,
                                nav: false,
                                navText: false,
                                loop: false
                            },
                            1024: {
                                items: 4,
                                nav: false,
                                navText: false,
                                loop: false
                            },
                            1440: {
                                items: 7,
                                nav: false,
                                navText: false,
                                loop: false
                            }
                        }
                    };
                }
                SideScroll.prototype.ngOnChanges = function () {
                };
                SideScroll.prototype.counter = function (event) {
                    this.count = event;
                    this.carouselCount.next(event);
                };
                SideScroll.prototype.left = function () {
                    var owl = jQuery('.ss_owl');
                    owl.owlCarousel();
                    owl.trigger('prev.owl.carousel');
                };
                SideScroll.prototype.right = function () {
                    var owl = jQuery('.ss_owl');
                    owl.owlCarousel();
                    owl.trigger('next.owl.carousel');
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SideScroll.prototype, "maxLength", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SideScroll.prototype, "current", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SideScroll.prototype, "data", void 0);
                SideScroll = __decorate([
                    core_1.Component({
                        selector: 'side-scroll',
                        templateUrl: './app/components/carousels/side-scroll/side-scroll.component.html',
                        directives: [owl_carousel_component_1.OwlCarousel],
                        outputs: ['carouselCount']
                    }), 
                    __metadata('design:paramtypes', [])
                ], SideScroll);
                return SideScroll;
            }());
            exports_1("SideScroll", SideScroll);
        }
    }
});
