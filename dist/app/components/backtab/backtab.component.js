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
    var core_1, core_2;
    var BackTabComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            }],
        execute: function() {
            BackTabComponent = (function () {
                function BackTabComponent() {
                }
                BackTabComponent.prototype.goBack = function () {
                    if (history.length <= 2) {
                        window.location.href = '/';
                    }
                    else {
                        window.history.back();
                    }
                };
                BackTabComponent.prototype.ngOnInit = function () {
                    this.label = this.labelInput ? this.labelInput : "Go Back To Previous Page";
                };
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', String)
                ], BackTabComponent.prototype, "labelInput", void 0);
                BackTabComponent = __decorate([
                    core_1.Component({
                        selector: 'backtab-component',
                        templateUrl: './app/components/backtab/backtab.component.html',
                    }), 
                    __metadata('design:paramtypes', [])
                ], BackTabComponent);
                return BackTabComponent;
            }());
            exports_1("BackTabComponent", BackTabComponent);
        }
    }
});
