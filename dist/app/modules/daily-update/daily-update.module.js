System.register(['@angular/core', '@angular/platform-browser', "@angular/router-deprecated", '../../components/module-header/module-header.component', "../../components/images/circle-image", "../../global/global-settings", '../../components/error/data-box/data-box.component', '../../components/bar-chart/bar-chart.component', "../../pipes/safe.pipe", "../../pipes/possessive.pipe"], function(exports_1, context_1) {
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
    var core_1, platform_browser_1, router_deprecated_1, module_header_component_1, circle_image_1, global_settings_1, data_box_component_1, bar_chart_component_1, safe_pipe_1, possessive_pipe_1;
    var DailyUpdateModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            },
            function (bar_chart_component_1_1) {
                bar_chart_component_1 = bar_chart_component_1_1;
            },
            function (safe_pipe_1_1) {
                safe_pipe_1 = safe_pipe_1_1;
            },
            function (possessive_pipe_1_1) {
                possessive_pipe_1 = possessive_pipe_1_1;
            }],
        execute: function() {
            DailyUpdateModule = (function () {
                function DailyUpdateModule(_sanitizer) {
                    this._sanitizer = _sanitizer;
                    this.profileName = "[Profile Name]";
                    this.noDataMessage = 'Sorry, there is no daily update available for [Profile Name]';
                    this.headerInfo = {
                        moduleTitle: "Daily Update - [Profile Name]",
                        hasIcon: false,
                        iconClass: ""
                    };
                    this.imageConfig = {
                        imageClass: "image-121",
                        mainImage: {
                            imageClass: "border-2",
                            imageUrl: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                            placeholderImageUrl: global_settings_1.GlobalSettings.getSiteLogoUrl()
                        }
                    };
                }
                DailyUpdateModule.prototype.ngOnChanges = function (event) {
                    this.headerInfo.moduleTitle = "Daily Update - " + this.profileName;
                    this.noDataMessage = "Sorry, there is no daily update available for " + this.profileName;
                    if (this.data) {
                        this.drawChart();
                        this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle("url(" + this.data.fullBackgroundImageUrl + ")");
                    }
                    if (this.data && this.data.chart && this.data.chart.dataSeries && this.data.chart.dataSeries.length > 0) {
                        var series = this.data.chart.dataSeries[0];
                        this.comparisonCount = series.values ? series.values.length : 0;
                    }
                    else {
                        this.comparisonCount = 0;
                    }
                    if (event.data['currentValue'] != null && event.data['currentValue'].postGameArticle != null && event.data['currentValue'].postGameArticle.img != null) {
                        var img = event.data['currentValue'].postGameArticle.img.image;
                        this.imageConfig.mainImage.imageUrl = img != null ? img : global_settings_1.GlobalSettings.getImageUrl(null);
                    }
                };
                DailyUpdateModule.prototype.drawChart = function () {
                    var yAxisMin = 0;
                    var categories = [];
                    var series = [];
                    if (this.data && this.data.chart) {
                        var chart = this.data.chart;
                        categories = chart.categories;
                        if (chart.dataSeries) {
                            series = chart.dataSeries.map(function (item) {
                                return {
                                    pointWidth: 30,
                                    name: item.name,
                                    data: item.values,
                                    dataLabels: {
                                        style: {
                                            color: '#272727'
                                        }
                                    }
                                };
                            });
                        }
                    }
                    this.chartOptions = {
                        chart: {
                            type: 'column',
                            height: 144,
                            marginTop: 10,
                            spacingTop: 0,
                            spacingBottom: 0,
                            style: {
                                fontFamily: '\'Lato\', sans-serif'
                            }
                        },
                        title: {
                            text: ''
                        },
                        legend: {
                            enabled: false
                        },
                        xAxis: {
                            categories: categories,
                            tickWidth: 0,
                            labels: {
                                style: {
                                    color: "#999999",
                                    fontSize: "12px"
                                }
                            },
                        },
                        yAxis: {
                            min: yAxisMin,
                            max: null,
                            tickInterval: 2,
                            opposite: true,
                            title: {
                                text: null
                            },
                            labels: {
                                style: {
                                    color: "#999999"
                                }
                            },
                            gridLineColor: "rgba(225, 225, 225, 0.5)"
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0,
                                borderWidth: 0,
                                groupPadding: .09,
                                minPointLength: 3,
                                dataLabels: {
                                    enabled: true,
                                    inside: false,
                                    allowOverlap: true,
                                    crop: false,
                                    overflow: 'none',
                                    backgroundColor: undefined,
                                    y: 0
                                },
                                enableMouseTracking: false
                            }
                        },
                        colors: [
                            '#272727',
                            '#bc2027'
                        ],
                        series: series,
                        credits: {
                            enabled: false
                        }
                    };
                };
                ;
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DailyUpdateModule.prototype, "profileName", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DailyUpdateModule.prototype, "data", void 0);
                DailyUpdateModule = __decorate([
                    core_1.Component({
                        selector: 'daily-update-module',
                        templateUrl: './app/modules/daily-update/daily-update.module.html',
                        directives: [module_header_component_1.ModuleHeader, circle_image_1.CircleImage, data_box_component_1.NoDataBox, bar_chart_component_1.BarChartComponent, router_deprecated_1.ROUTER_DIRECTIVES],
                        pipes: [safe_pipe_1.SanitizeHtml, possessive_pipe_1.PossessivePipe]
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], DailyUpdateModule);
                return DailyUpdateModule;
            }());
            exports_1("DailyUpdateModule", DailyUpdateModule);
        }
    }
});
