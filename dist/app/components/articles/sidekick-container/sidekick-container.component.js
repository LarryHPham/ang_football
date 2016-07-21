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
    var SidekickContainerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SidekickContainerComponent = (function () {
                function SidekickContainerComponent() {
                    this.isSmall = false;
                }
                SidekickContainerComponent.prototype.onResize = function (event) {
                    this.isSmall = event.target.innerWidth <= 640;
                };
                SidekickContainerComponent = __decorate([
                    core_1.Component({
                        selector: 'sidekick-container-component',
                        templateUrl: './app/components/articles/sidekick-container/sidekick-container.component.html',
                        inputs: ['trending']
                    }), 
                    __metadata('design:paramtypes', [])
                ], SidekickContainerComponent);
                return SidekickContainerComponent;
            }());
            exports_1("SidekickContainerComponent", SidekickContainerComponent);
        }
    }
});
