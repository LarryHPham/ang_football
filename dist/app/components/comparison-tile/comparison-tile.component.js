System.register(['@angular/core', '../images/circle-image', '../dropdown/dropdown.component', '../complex-inner-html/complex-inner-html.component', '@angular/router-deprecated', '../../pipes/safe.pipe'], function(exports_1, context_1) {
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
    var core_1, circle_image_1, dropdown_component_1, complex_inner_html_component_1, router_deprecated_1, safe_pipe_1;
    var ComparisonTile;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (dropdown_component_1_1) {
                dropdown_component_1 = dropdown_component_1_1;
            },
            function (complex_inner_html_component_1_1) {
                complex_inner_html_component_1 = complex_inner_html_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (safe_pipe_1_1) {
                safe_pipe_1 = safe_pipe_1_1;
            }],
        execute: function() {
            ComparisonTile = (function () {
                function ComparisonTile() {
                    this.dropdownList1 = [];
                    this.dropdownList2 = [];
                    this.dropdownSwitched = new core_1.EventEmitter();
                }
                ComparisonTile.prototype.dropdownOneSwitched = function ($event) {
                    this.dropdownSwitched.next({
                        dropdownIndex: 0,
                        key: $event
                    });
                };
                ComparisonTile.prototype.dropdownTwoSwitched = function ($event) {
                    this.dropdownSwitched.next({
                        dropdownIndex: 1,
                        key: $event
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ComparisonTile.prototype, "comparisonTileInput", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], ComparisonTile.prototype, "dropdownList1", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], ComparisonTile.prototype, "dropdownList2", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], ComparisonTile.prototype, "dropdownSwitched", void 0);
                ComparisonTile = __decorate([
                    core_1.Component({
                        selector: 'comparison-tile',
                        templateUrl: './app/components/comparison-tile/comparison-tile.component.html',
                        directives: [circle_image_1.CircleImage, dropdown_component_1.DropdownComponent, complex_inner_html_component_1.ComplexInnerHtml, router_deprecated_1.ROUTER_DIRECTIVES],
                        pipes: [safe_pipe_1.SanitizeHtml],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ComparisonTile);
                return ComparisonTile;
            }());
            exports_1("ComparisonTile", ComparisonTile);
        }
    }
});
