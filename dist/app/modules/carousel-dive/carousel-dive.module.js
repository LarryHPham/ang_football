System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var CarouselDiveModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            CarouselDiveModule = (function () {
                function CarouselDiveModule() {
                }
                CarouselDiveModule.prototype.ngOnInit = function () {
                    jQuery(".owl-carousel").owlCarousel({
                        items: 1,
                        loop: true,
                        dots: false,
                        nav: false,
                        navText: false
                    });
                };
                CarouselDiveModule.prototype.leftcarousel = function () {
                    var owl = jQuery('.owl-carousel');
                    owl.owlCarousel();
                    owl.trigger('prev.owl.carousel');
                };
                CarouselDiveModule.prototype.rightcarousel = function () {
                    var owl = jQuery('.owl-carousel');
                    owl.owlCarousel();
                    owl.trigger('next.owl.carousel');
                };
                CarouselDiveModule = __decorate([
                    core_1.Component({
                        selector: 'carousel-dive-module',
                        templateUrl: './app/modules/carousel-dive/carousel-dive.module.html',
                        directives: [],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], CarouselDiveModule);
                return CarouselDiveModule;
            }());
            exports_1("CarouselDiveModule", CarouselDiveModule);
        }
    }
});
