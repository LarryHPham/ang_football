System.register(['@angular/core', 'owl-carousel'], function(exports_1, context_1) {
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
    var OwlCarousel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {}],
        execute: function() {
            OwlCarousel = (function () {
                function OwlCarousel(_el) {
                    this._el = _el;
                    this.carouselCount = new core_1.EventEmitter();
                    this.count = 0;
                }
                OwlCarousel.prototype.ngAfterViewInit = function () {
                    var self = this;
                    this.owlElement = jQuery(this._el.nativeElement).owlCarousel(this.options);
                    this.owlElement.on('changed.owl.carousel', function (event) {
                        var currentItem = event.item.index;
                        if (self.count != currentItem) {
                            self.carouselCount.next(currentItem);
                        }
                        self.count = currentItem;
                    });
                };
                OwlCarousel.prototype.ngOnDestroy = function () {
                    this.owlElement.remove();
                    this.owlElement = null;
                };
                OwlCarousel.prototype.ngOnChanges = function () {
                    var self = this;
                    if (this.owlElement != null) {
                        this.data.forEach(function (val, i) {
                            this.owlElement.data('owlCarousel').addItem(val);
                        });
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], OwlCarousel.prototype, "options", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], OwlCarousel.prototype, "data", void 0);
                OwlCarousel = __decorate([
                    core_1.Component({
                        selector: 'owl-carousel',
                        templateUrl: './app/components/carousels/owl-carousel/owl-carousel.component.html',
                        outputs: ['carouselCount']
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], OwlCarousel);
                return OwlCarousel;
            }());
            exports_1("OwlCarousel", OwlCarousel);
        }
    }
});
