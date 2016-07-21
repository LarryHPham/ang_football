System.register(['@angular/core', "../buttons/circle/circle.button"], function(exports_1, context_1) {
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
    var core_1, circle_button_1;
    var Carousel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (circle_button_1_1) {
                circle_button_1 = circle_button_1_1;
            }],
        execute: function() {
            Carousel = (function () {
                // public type2:boolean; unused
                function Carousel() {
                    this.carouselDataPoint = new core_1.EventEmitter();
                    this.scrollRight = new core_1.EventEmitter();
                    this.scrollLeft = new core_1.EventEmitter();
                    this.counter = 0;
                    this.max = 0;
                }
                Carousel.prototype.left = function () {
                    var returnData = -1; //for outputing data
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
                    return returnData; //a returned variable for output
                };
                Carousel.prototype.right = function () {
                    var returnData = 1;
                    var counter = this.counter;
                    counter++;
                    //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
                    if (counter >= this.max) {
                        this.counter = 0;
                    }
                    else {
                        this.counter = counter;
                    }
                    this.changeMain(this.counter);
                    return returnData; //a returned variable for output
                };
                //this is where the angular2 decides what is the main image
                Carousel.prototype.changeMain = function (num) {
                    if (num < this.carouselData.length) {
                        this.carouselDataPoint.next(this.carouselData[num]);
                    }
                };
                Carousel.prototype.ngOnChanges = function () {
                    if (typeof this.indexInput == 'undefined' || this.indexInput < 0) {
                        this.counter = 0;
                    }
                    else {
                        this.counter = this.indexInput;
                    }
                    this.max = this.carouselData.length;
                    this.changeMain(this.counter);
                };
                Carousel.prototype.ngOnInit = function () {
                    if (typeof this.carouselData == 'undefined' || this.carouselData.length == 0) {
                        var sampleImage = "./app/public/no-image.jpg";
                        this.carouselData = [];
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], Carousel.prototype, "carouselData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], Carousel.prototype, "indexInput", void 0);
                Carousel = __decorate([
                    core_1.Component({
                        selector: 'carousel',
                        templateUrl: './app/components/carousels/carousel.component.html',
                        directives: [circle_button_1.CircleButton],
                        providers: [],
                        outputs: ['scrollRight', 'scrollLeft', 'carouselDataPoint']
                    }), 
                    __metadata('design:paramtypes', [])
                ], Carousel);
                return Carousel;
            }());
            exports_1("Carousel", Carousel);
        }
    }
});
