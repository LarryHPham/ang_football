System.register(['@angular/core', '@angular/platform-browser', '@angular/router-deprecated', '../../components/loading/loading.component', '../../components/images/circle-image', '../../components/scrollable-content/scrollable-content.component', '../../global/global-functions', '../../global/global-settings', '../../pipes/na.pipe'], function(exports_1, context_1) {
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
    var core_1, platform_browser_1, router_deprecated_1, loading_component_1, circle_image_1, scrollable_content_component_1, global_functions_1, global_settings_1, na_pipe_1;
    var ProfileHeaderModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (scrollable_content_component_1_1) {
                scrollable_content_component_1 = scrollable_content_component_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (na_pipe_1_1) {
                na_pipe_1 = na_pipe_1_1;
            }],
        execute: function() {
            ProfileHeaderModule = (function () {
                function ProfileHeaderModule(_sanitizer) {
                    this._sanitizer = _sanitizer;
                    this.contentTitle = "Quick info";
                    this.imageConfig = {
                        imageClass: "image-180",
                        mainImage: {
                            imageClass: "border-large",
                            placeholderImageUrl: "/app/public/profile_placeholder_large.png"
                        }
                    };
                    this.logoConfig = {
                        imageClass: "image-40",
                        mainImage: {
                            imageClass: "",
                            imageUrl: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                            placeholderImageUrl: global_settings_1.GlobalSettings.getSiteLogoUrl()
                        }
                    };
                }
                ProfileHeaderModule.prototype.ngOnChanges = function () {
                    var data = this.profileHeaderData;
                    if (data) {
                        if (!data.backgroundImageUrl) {
                            data.backgroundImageUrl = "/app/public/no-image.png";
                        }
                        if (!data.profileImageUrl) {
                            data.profileImageUrl = "/app/public/no-image.png";
                        }
                        this.imageConfig.mainImage.imageUrl = data.profileImageUrl;
                        this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle("url(" + data.backgroundImageUrl + ")");
                        this.contentTitle = "Quick info about " + data.profileName;
                        this.profileTitle = data.profileTitleFirstPart + "<span class='text-heavy'> " + data.profileTitleLastPart + "</span>";
                        this.displayDate = global_functions_1.GlobalFunctions.formatUpdatedDate(data.lastUpdatedDate);
                        data.description = "<div class=\"ph-content-desc-border\"></div>" + data.description;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ProfileHeaderModule.prototype, "profileHeaderData", void 0);
                ProfileHeaderModule = __decorate([
                    core_1.Component({
                        selector: 'profile-header',
                        templateUrl: './app/modules/profile-header/profile-header.module.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, circle_image_1.CircleImage, scrollable_content_component_1.ScrollableContent, loading_component_1.LoadingComponent],
                        pipes: [na_pipe_1.NaValuePipe]
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], ProfileHeaderModule);
                return ProfileHeaderModule;
            }());
            exports_1("ProfileHeaderModule", ProfileHeaderModule);
        }
    }
});
