System.register(['@angular/core', '../../components/images/circle-image', '../../components/complex-inner-html/complex-inner-html.component', '@angular/router-deprecated', '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, circle_image_1, complex_inner_html_component_1, router_deprecated_1, responsive_widget_component_1;
    var DetailedListItem;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (complex_inner_html_component_1_1) {
                complex_inner_html_component_1 = complex_inner_html_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            DetailedListItem = (function () {
                function DetailedListItem() {
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], DetailedListItem.prototype, "detailedItemData", void 0);
                DetailedListItem = __decorate([
                    core_1.Component({
                        selector: 'detailed-list-item',
                        templateUrl: './app/components/detailed-list-item/detailed-list-item.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, circle_image_1.CircleImage, complex_inner_html_component_1.ComplexInnerHtml, responsive_widget_component_1.ResponsiveWidget],
                        providers: [],
                    }), 
                    __metadata('design:paramtypes', [])
                ], DetailedListItem);
                return DetailedListItem;
            }());
            exports_1("DetailedListItem", DetailedListItem);
        }
    }
});
