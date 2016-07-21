System.register(['@angular/core', '../scrollable-content/scrollable-content.component'], function(exports_1, context_1) {
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
    var core_1, scrollable_content_component_1;
    var DropdownDirectoryComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (scrollable_content_component_1_1) {
                scrollable_content_component_1 = scrollable_content_component_1_1;
            }],
        execute: function() {
            DropdownDirectoryComponent = (function () {
                function DropdownDirectoryComponent() {
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DropdownDirectoryComponent.prototype, "heading", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DropdownDirectoryComponent.prototype, "width", void 0);
                DropdownDirectoryComponent = __decorate([
                    core_1.Component({
                        selector: 'dropdown-directory',
                        templateUrl: './app/components/dropdown-directory/dropdown-directory.component.html',
                        directives: [scrollable_content_component_1.ScrollableContent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], DropdownDirectoryComponent);
                return DropdownDirectoryComponent;
            }());
            exports_1("DropdownDirectoryComponent", DropdownDirectoryComponent);
        }
    }
});
