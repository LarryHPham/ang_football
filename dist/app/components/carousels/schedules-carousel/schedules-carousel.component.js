System.register(['@angular/core', '../../buttons/circle/circle.button', '../../images/circle-image', '../carousel.component', '@angular/router-deprecated'], function(exports_1, context_1) {
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
    var core_1, circle_button_1, circle_image_1, carousel_component_1, router_deprecated_1;
    var SchedulesCarousel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (circle_button_1_1) {
                circle_button_1 = circle_button_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (carousel_component_1_1) {
                carousel_component_1 = carousel_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            SchedulesCarousel = (function () {
                function SchedulesCarousel() {
                    this.indexNum = new core_1.EventEmitter(); //interface for the output to return an index
                }
                SchedulesCarousel.prototype.response = function (event) {
                    //set the data event being emitted back from the carousel component
                    this.dataPoint = event;
                    //sets the index of the dataPoint of its current position in the array
                    // the '?' meaning if there is data to even receive
                    if (typeof this.dataPoint['index'] != 'undefined') {
                        this.indexNum.next(this.dataPoint['index']);
                    }
                };
                SchedulesCarousel.prototype.ngOnInit = function () {
                    //on initial component view set the datapoint to the first item in the array if it exists
                    if (typeof this.carouselData != 'undefined') {
                        this.dataPoint = this.carouselData[0];
                        //if there is rank then initially set it when component is initially in view
                        if (typeof this.dataPoint['index'] != 'undefined') {
                            this.indexNum.next(this.dataPoint['index']);
                        }
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], SchedulesCarousel.prototype, "carouselData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SchedulesCarousel.prototype, "indexInput", void 0);
                SchedulesCarousel = __decorate([
                    core_1.Component({
                        selector: 'schedules-carousel',
                        templateUrl: './app/components/carousels/schedules-carousel/schedules-carousel.component.html',
                        directives: [carousel_component_1.Carousel, circle_image_1.CircleImage, circle_button_1.CircleButton, router_deprecated_1.ROUTER_DIRECTIVES],
                        providers: [],
                        outputs: ['indexNum'],
                    }), 
                    __metadata('design:paramtypes', [])
                ], SchedulesCarousel);
                return SchedulesCarousel;
            }());
            exports_1("SchedulesCarousel", SchedulesCarousel);
        }
    }
});
