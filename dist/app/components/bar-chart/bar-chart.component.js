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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1;
    var BarChartComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            BarChartComponent = (function () {
                function BarChartComponent(elementRef) {
                    this._elementRef = elementRef;
                }
                BarChartComponent.prototype.ngAfterViewInit = function () {
                    this.drawChart();
                };
                BarChartComponent.prototype.drawChart = function () {
                    if (this.options) {
                        jQuery(this._elementRef.nativeElement)
                            .find('.daily-update-chart-wrapper')
                            .highcharts(this.options);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BarChartComponent.prototype, "options", void 0);
                BarChartComponent = __decorate([
                    core_1.Component({
                        selector: 'bar-chart',
                        templateUrl: './app/components/bar-chart/bar-chart.component.html'
                    }),
                    __param(0, core_1.Inject(core_1.ElementRef)), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], BarChartComponent);
                return BarChartComponent;
            }());
            exports_1("BarChartComponent", BarChartComponent);
        }
    }
});
