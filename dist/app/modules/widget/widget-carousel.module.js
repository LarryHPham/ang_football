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
    var WidgetCarouselModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            WidgetCarouselModule = (function () {
                function WidgetCarouselModule() {
                    this.sidekickHeight = 0;
                }
                WidgetCarouselModule.prototype.ngOnInit = function () {
                    var titleHeight = jQuery('.articles-page-title').height();
                    var padding = document.getElementById('pageHeader').offsetHeight + 420;
                    if (document.getElementById('partner') != null) {
                        var partnerHeight = document.getElementById('partner').offsetHeight;
                        padding += partnerHeight;
                    }
                    if (!this.aiSidekick) {
                        this.headerHeight = padding + 'px';
                    }
                    else {
                        if (titleHeight == 40) {
                            this.headerHeight = padding + 95 + 'px';
                        }
                        else if (titleHeight == 80) {
                            this.headerHeight = padding + 135 + 'px';
                        }
                    }
                };
                // Page is being scrolled
                WidgetCarouselModule.prototype.onScroll = function (event) {
                    var partnerHeight = 0;
                    if (document.getElementById('partner') != null) {
                        partnerHeight = document.getElementById('partner').offsetHeight;
                    }
                    var titleHeight = 0;
                    var padding = document.getElementById('pageHeader').offsetHeight;
                    var y_buffer = 40;
                    var scrollTop = jQuery(window).scrollTop();
                    var maxScroll = partnerHeight - scrollTop;
                    var carouselTop = document.getElementById('newsCarousel').offsetHeight - scrollTop;
                    if (!this.aiSidekick) {
                        this.sidekickHeight = 0;
                    }
                    else {
                        titleHeight = jQuery('.articles-page-title').height();
                        if (titleHeight == 40) {
                            this.sidekickHeight = 95;
                        }
                        else if (titleHeight == 80) {
                            this.sidekickHeight = 135;
                        }
                        if (maxScroll <= 0) {
                            this.sidekickHeight += maxScroll;
                            if (this.sidekickHeight < 0) {
                                this.sidekickHeight = 0;
                            }
                        }
                        y_buffer += this.sidekickHeight;
                    }
                    if (maxScroll <= 0) {
                        maxScroll = 0;
                    }
                    if (carouselTop <= 0) {
                        carouselTop = 0;
                    }
                    this.headerHeight = carouselTop + padding + maxScroll + this.sidekickHeight + 'px';
                    var $widget = jQuery("#widget");
                    var $pageWrapper = jQuery(".deep-dive-content-container");
                    if ($widget.length > 0 && $pageWrapper.length > 0) {
                        var widgetHeight = $widget.height();
                        var pageWrapperTop = $pageWrapper.offset().top;
                        var pageWrapperBottom = pageWrapperTop + $pageWrapper.height() - padding;
                        if ((scrollTop + widgetHeight + y_buffer) > (pageWrapperBottom + this.sidekickHeight)) {
                            this.headerHeight = this.sidekickHeight - 640 + 'px';
                            $widget.addClass("widget-bottom");
                        }
                        else if (scrollTop < (pageWrapperTop + this.sidekickHeight)) {
                            $widget.removeClass("widget-bottom");
                            $widget.get(0).style.top = "";
                        }
                        else {
                            $widget.removeClass("widget-bottom");
                            $widget.get(0).style.top = "";
                        }
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], WidgetCarouselModule.prototype, "aiSidekick", void 0);
                WidgetCarouselModule = __decorate([
                    core_1.Component({
                        selector: 'widget-carousel-module',
                        templateUrl: './app/modules/widget/widget.module.html',
                        inputs: ['aiSidekick']
                    }), 
                    __metadata('design:paramtypes', [])
                ], WidgetCarouselModule);
                return WidgetCarouselModule;
            }());
            exports_1("WidgetCarouselModule", WidgetCarouselModule);
        }
    }
});
