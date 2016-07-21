System.register(['@angular/core', '../../pipes/na.pipe', '@angular/router-deprecated', '../images/circle-image'], function(exports_1, context_1) {
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
    var core_1, na_pipe_1, router_deprecated_1, circle_image_1;
    var ComparisonBar;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (na_pipe_1_1) {
                na_pipe_1 = na_pipe_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            }],
        execute: function() {
            ComparisonBar = (function () {
                function ComparisonBar() {
                }
                ComparisonBar.prototype.isSelected = function (displayData) {
                    if (displayData.active === true) {
                        return false;
                    }
                    this.displayData.infoBoxDetails.forEach(function (comparisonBarInput) { return displayData.active = false; });
                    displayData.active = true;
                };
                ComparisonBar.prototype.mouseOff = function (element) {
                    element.active = false;
                };
                ComparisonBar.prototype.ngOnChanges = function (event) {
                    this.displayData = this.configureBar();
                }; //ngOnChanges ends
                //Function to reposition labels if needed
                ComparisonBar.prototype.calculateLabelPositions = function () {
                    if (this.displayData.data.length < 1) {
                        return;
                    }
                    if (this.displayData.data.length == 1) {
                        this.labelOne.nativeElement.style.left = "auto";
                        this.labelOne.nativeElement.style.right = "auto";
                        if (labelOneWidth > barOneWidth) {
                            this.labelOne.nativeElement.style.left = 0;
                        }
                        else {
                            this.labelOne.nativeElement.style.right = 0;
                        }
                    }
                    else {
                        //Reset labels
                        this.labelOne.nativeElement.style.left = "auto";
                        this.labelOne.nativeElement.style.right = "auto";
                        this.labelTwo.nativeElement.style.left = "auto";
                        this.labelTwo.nativeElement.style.right = "auto";
                        //Get widths of DOM elements
                        var barWidth = this.masterBar.nativeElement.offsetWidth;
                        var labelOneWidth = this.labelOne.nativeElement.offsetWidth;
                        var labelTwoWidth = this.labelTwo.nativeElement.offsetWidth;
                        //Calculate final bar widths
                        var barOneWidth = barWidth * this.displayData.data[0].width / 100;
                        var barTwoWidth = barWidth * this.displayData.data[1].width / 100;
                        //Set pixel buffer between labels that are close
                        var pixelBuffer = 5;
                        var adjustLabelOne = true;
                        if ((labelOneWidth + pixelBuffer) > barOneWidth) {
                            // if the label is wider than the bar, do calculation from label width
                            // and adjust label two, as label one can't move left any more
                            barOneWidth = labelOneWidth;
                            adjustLabelOne = false;
                        }
                        if ((barTwoWidth - barOneWidth) <= (labelTwoWidth + pixelBuffer)) {
                            //If the difference between the bars is less than the width of the second label, shift label one over
                            if (adjustLabelOne) {
                                var adjustLabel = Math.ceil(labelTwoWidth - (barTwoWidth - barOneWidth) + pixelBuffer);
                                this.labelOne.nativeElement.style.right = adjustLabel;
                                this.labelTwo.nativeElement.style.right = 0;
                            }
                            else {
                                var adjustLabel = Math.ceil((barTwoWidth - barOneWidth) - (labelTwoWidth + pixelBuffer));
                                this.labelOne.nativeElement.style.left = 0;
                                this.labelTwo.nativeElement.style.right = adjustLabel;
                            }
                        }
                        else {
                            if (adjustLabelOne) {
                                this.labelOne.nativeElement.style.right = 0;
                            }
                            else {
                                this.labelOne.nativeElement.style.left = 0;
                            }
                            this.labelTwo.nativeElement.style.right = 0;
                        }
                    }
                };
                ComparisonBar.prototype.ngAfterViewChecked = function () {
                    this.calculateLabelPositions();
                };
                //Function to configure any variables the comparison bar needs
                ComparisonBar.prototype.configureBar = function () {
                    var barData = this.comparisonBarInput;
                    var worstValue = Number(barData.minValue);
                    var bestValue = Number(barData.maxValue);
                    var adjustedMax = bestValue;
                    var switchValues = false;
                    if (bestValue < worstValue) {
                        adjustedMax = worstValue - bestValue;
                        switchValues = true;
                    }
                    //Determines what percentage the scale starts at (ex. 0 starts at 2% of bars width)
                    var scaleStart = 2;
                    //Determine widths of bars and add to display list
                    for (var i = 0; i < barData.data.length; i++) {
                        var dataItem = barData.data[i];
                        var value = dataItem.value != null ? dataItem.value : 0;
                        if (switchValues) {
                            if (value < bestValue) {
                                dataItem.value = null;
                                value = 0;
                            }
                            else {
                                value = worstValue - value;
                            }
                        }
                        dataItem.width = (Math.round(value / adjustedMax * (100 - scaleStart) * 10) / 10) + scaleStart;
                        if (dataItem.width < scaleStart || !dataItem.value) {
                            dataItem.width = scaleStart;
                        }
                    }
                    barData.data.sort(function (a, b) {
                        var diff = a.width - b.width;
                        if (Math.abs(diff) <= 0.5) {
                            if (b.value == null) {
                                a.width += 1;
                            }
                            else if (a.value == null) {
                                b.width += 1;
                            }
                            else if (diff >= 0) {
                                b.width += 1;
                            }
                            else {
                                a.width += 1;
                            }
                            diff = a.width - b.width;
                        }
                        return diff;
                    });
                    return barData;
                };
                __decorate([
                    core_1.ViewChild('labelOne'), 
                    __metadata('design:type', Object)
                ], ComparisonBar.prototype, "labelOne", void 0);
                __decorate([
                    core_1.ViewChild('labelTwo'), 
                    __metadata('design:type', Object)
                ], ComparisonBar.prototype, "labelTwo", void 0);
                __decorate([
                    core_1.ViewChild('masterBar'), 
                    __metadata('design:type', Object)
                ], ComparisonBar.prototype, "masterBar", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ComparisonBar.prototype, "comparisonBarInput", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], ComparisonBar.prototype, "index", void 0);
                ComparisonBar = __decorate([
                    core_1.Component({
                        selector: 'comparison-bar',
                        templateUrl: './app/components/comparison-bar/comparison-bar.component.html',
                        directives: [circle_image_1.CircleImage, router_deprecated_1.ROUTER_DIRECTIVES],
                        pipes: [na_pipe_1.NaValuePipe],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ComparisonBar);
                return ComparisonBar;
            }());
            exports_1("ComparisonBar", ComparisonBar);
        }
    }
});
