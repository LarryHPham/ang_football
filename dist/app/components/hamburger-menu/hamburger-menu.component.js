System.register(['@angular/core', '@angular/router-deprecated'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1;
    var HamburgerMenuComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            HamburgerMenuComponent = (function () {
                function HamburgerMenuComponent() {
                    this.menuInfoHeader = "Company Info";
                }
                HamburgerMenuComponent.prototype.ngOnInit = function () {
                    if (typeof this.menuData == 'undefined') {
                        this.menuData = {
                            menuTitle: 'Contact Us',
                            url: ['Contactus-page']
                        }; //example
                    }
                }; //ngOnInit ends
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], HamburgerMenuComponent.prototype, "menuData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], HamburgerMenuComponent.prototype, "menuInfo", void 0);
                HamburgerMenuComponent = __decorate([
                    core_1.Component({
                        selector: 'hamburger-menu-component',
                        templateUrl: './app/components/hamburger-menu/hamburger-menu.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES],
                        providers: [],
                    }), 
                    __metadata('design:paramtypes', [])
                ], HamburgerMenuComponent);
                return HamburgerMenuComponent;
            }());
            exports_1("HamburgerMenuComponent", HamburgerMenuComponent);
        }
    }
});
