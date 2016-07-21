System.register(['@angular/core', '@angular/router-deprecated', "../shareLinks/shareLinks.component", "../../../pipes/safe.pipe", '../../../components/responsive-widget/responsive-widget.component', '../../../services/deep-dive.service'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, shareLinks_component_1, safe_pipe_1, responsive_widget_component_1, deep_dive_service_1;
    var SyndicatedTrendingComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (shareLinks_component_1_1) {
                shareLinks_component_1 = shareLinks_component_1_1;
            },
            function (safe_pipe_1_1) {
                safe_pipe_1 = safe_pipe_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            },
            function (deep_dive_service_1_1) {
                deep_dive_service_1 = deep_dive_service_1_1;
            }],
        execute: function() {
            SyndicatedTrendingComponent = (function () {
                function SyndicatedTrendingComponent(_router, _deepdiveservice) {
                    this._router = _router;
                    this._deepdiveservice = _deepdiveservice;
                    this.trending = true;
                    this.widgetPlace = "widgetForPage";
                    this.getDeepDiveArticle(2);
                }
                SyndicatedTrendingComponent.prototype.getDeepDiveArticle = function (numItems) {
                    var _this = this;
                    this._deepdiveservice.getDeepDiveBatchService(numItems).subscribe(function (data) {
                        _this.articleData = data.data;
                        // this.articleData.teaser = this.articleData.teaser.replace("\'", "'");
                    });
                };
                SyndicatedTrendingComponent = __decorate([
                    core_1.Component({
                        selector: 'syndicated-trending-component',
                        templateUrl: './app/components/articles/syndicated-trending/syndicated-trending.component.html',
                        directives: [shareLinks_component_1.ShareLinksComponent, router_deprecated_1.ROUTER_DIRECTIVES, responsive_widget_component_1.ResponsiveWidget],
                        inputs: ['trendingData', 'trendingImages'],
                        pipes: [safe_pipe_1.SanitizeHtml],
                        providers: [deep_dive_service_1.DeepDiveService]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, deep_dive_service_1.DeepDiveService])
                ], SyndicatedTrendingComponent);
                return SyndicatedTrendingComponent;
            }());
            exports_1("SyndicatedTrendingComponent", SyndicatedTrendingComponent);
        }
    }
});
