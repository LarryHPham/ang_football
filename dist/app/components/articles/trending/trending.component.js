System.register(['@angular/core', '@angular/router-deprecated', "../shareLinks/shareLinks.component", "../../../pipes/safe.pipe", "../sidekick-container/sidekick-container.component"], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, shareLinks_component_1, safe_pipe_1, sidekick_container_component_1;
    var TrendingComponent;
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
            function (sidekick_container_component_1_1) {
                sidekick_container_component_1 = sidekick_container_component_1_1;
            }],
        execute: function() {
            TrendingComponent = (function () {
                function TrendingComponent() {
                }
                TrendingComponent = __decorate([
                    core_1.Component({
                        selector: 'trending-component',
                        templateUrl: './app/components/articles/trending/trending.component.html',
                        directives: [shareLinks_component_1.ShareLinksComponent, router_deprecated_1.ROUTER_DIRECTIVES, sidekick_container_component_1.SidekickContainerComponent],
                        inputs: ['trendingData', 'trendingImages'],
                        pipes: [safe_pipe_1.SanitizeHtml],
                    }), 
                    __metadata('design:paramtypes', [])
                ], TrendingComponent);
                return TrendingComponent;
            }());
            exports_1("TrendingComponent", TrendingComponent);
        }
    }
});
