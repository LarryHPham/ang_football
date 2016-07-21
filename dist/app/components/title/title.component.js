System.register(['@angular/core', '../../components/images/circle-image', '../../global/global-settings'], function(exports_1, context_1) {
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
    var core_1, circle_image_1, global_settings_1;
    var TitleComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            TitleComponent = (function () {
                function TitleComponent() {
                }
                TitleComponent.prototype.ngOnChanges = function () {
                    if (!this.titleData) {
                        this.titleData =
                            {
                                imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                                imageRoute: null,
                                text1: "lorem ipsum delor",
                                text2: "ipsum delor lorem",
                                text3: "lorem ipsum delor",
                                text4: "lorem ipsum delor",
                                icon: 'fa fa-map-marker'
                            };
                    }
                    var hoverText = this.titleData.imageRoute ? "<p>View</p><p>Profile</p>" : "";
                    this.titleImage = {
                        imageClass: "page-title-titleImage",
                        mainImage: {
                            imageUrl: (this.titleData.imageURL ? this.titleData.imageURL : global_settings_1.GlobalSettings.getSiteLogoUrl()),
                            urlRouteArray: this.titleData.imageRoute,
                            hoverText: hoverText,
                            imageClass: "border-2"
                        }
                    };
                    // if ( this.imageData ) {
                    //     this.titleImage.mainImage = this.imageData;
                    // }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TitleComponent.prototype, "titleData", void 0);
                TitleComponent = __decorate([
                    core_1.Component({
                        selector: 'title-component',
                        templateUrl: './app/components/title/title.component.html',
                        directives: [circle_image_1.CircleImage]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TitleComponent);
                return TitleComponent;
            }());
            exports_1("TitleComponent", TitleComponent);
        }
    }
});
