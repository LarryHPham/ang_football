System.register(['@angular/core', '../../components/module-header/module-header.component', '../../components/images/circle-image'], function(exports_1, context_1) {
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
    var core_1, module_header_component_1, circle_image_1;
    var ShareModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            }],
        execute: function() {
            ShareModule = (function () {
                function ShareModule() {
                    this.moduleHeaderData = {
                        moduleTitle: 'Share This Profile With Your Friends',
                        hasIcon: false,
                        iconClass: ''
                    };
                    this.imageData = {
                        imageClass: "image-174",
                        mainImage: {
                            imageUrl: '',
                            hoverText: "Sample",
                            imageClass: "border-3"
                        }
                    };
                    this.shareText = 'Share This Profile Below:';
                    this.shareButtons = [
                        {
                            class: 'facebook',
                            icon: 'fa-facebook',
                            text: 'Share on Facebook',
                            url: 'https://www.facebook.com/sharer/sharer.php?u='
                        },
                        {
                            class: 'twitter',
                            icon: 'fa-twitter',
                            text: 'Share on Twitter',
                            url: 'https://twitter.com/home?status='
                        },
                        {
                            class: 'google',
                            icon: 'fa-google-plus',
                            text: 'Share on Google +',
                            url: 'https://plus.google.com/share?url='
                        },
                        {
                            class: 'pinterest',
                            icon: 'fa-pinterest',
                            text: 'Share on Pinterest',
                            url: 'https://pinterest.com/pin/create/button/?url='
                        }
                    ];
                }
                //Function to configure buttons and components
                ShareModule.prototype.configureModule = function () {
                    var input = this.shareModuleInput;
                    var currentUrl = window.location.href;
                    var shareButtons = this.shareButtons;
                    //If input is undefined, exit function
                    if (typeof input === 'undefined') {
                        return false;
                    }
                    //Set custom module title if it exists
                    if (typeof input.moduleTitle !== 'undefined') {
                        this.moduleHeaderData.moduleTitle = input.moduleTitle;
                    }
                    //Set custom share text if it exists
                    if (typeof input.shareText !== 'undefined') {
                        this.shareText = input.shareText;
                    }
                    //Set image url
                    this.imageData.mainImage.imageUrl = input.imageUrl;
                    //Complete Url of share button
                    this.shareButtons.map(function (item) {
                        switch (item.class) {
                            case 'pinterest':
                                item.url += currentUrl + '&media=' + input.imageUrl;
                                break;
                            default:
                                item.url += currentUrl;
                                break;
                        }
                        return item;
                    });
                };
                ShareModule.prototype.ngOnInit = function () {
                    this.configureModule();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ShareModule.prototype, "shareModuleInput", void 0);
                ShareModule = __decorate([
                    core_1.Component({
                        selector: 'share-module',
                        templateUrl: './app/modules/share/share.module.html',
                        directives: [module_header_component_1.ModuleHeader, circle_image_1.CircleImage],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], ShareModule);
                return ShareModule;
            }());
            exports_1("ShareModule", ShareModule);
        }
    }
});
