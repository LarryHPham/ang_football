System.register(['@angular/core', '@angular/router-deprecated', '../../global/global-settings', '../../pipes/price-format.pipe'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, global_settings_1, price_format_pipe_1;
    var DynamicListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (price_format_pipe_1_1) {
                price_format_pipe_1 = price_format_pipe_1_1;
            }],
        execute: function() {
            DynamicListComponent = (function () {
                function DynamicListComponent() {
                }
                DynamicListComponent.prototype.getData = function () {
                    if (typeof this.listData == 'undefined') {
                        this.listData =
                            {
                                imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                                location: 'Wichita, KS',
                                postal: ' 67260',
                                livingarea: 'livingarea',
                                address: '1234 joyfulhome data',
                                subtype: 'subtype',
                                numBed: 'numBed',
                                numBath: 'numBath',
                                date: 'Date',
                                price: 'listPrice',
                                buttonName: 'View Profile',
                                icon: 'fa fa-map-marker',
                                rank: 1,
                            };
                    }
                };
                DynamicListComponent.prototype.ngOnInit = function () {
                    this.getData();
                };
                DynamicListComponent = __decorate([
                    core_1.Component({
                        selector: 'dynamic-list',
                        templateUrl: './app/components/dynamic-list/dynamic-list.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES],
                        providers: [],
                        inputs: ['listData'],
                        encapsulation: core_1.ViewEncapsulation.None,
                        pipes: [price_format_pipe_1.PriceFormatPipe]
                    }), 
                    __metadata('design:paramtypes', [])
                ], DynamicListComponent);
                return DynamicListComponent;
            }());
            exports_1("DynamicListComponent", DynamicListComponent);
        }
    }
});
