System.register(['@angular/core', "@angular/http", "../global/global-settings"], function(exports_1, context_1) {
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
    var core_1, http_1, global_settings_1;
    var ImagesService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            ImagesService = (function () {
                function ImagesService(http) {
                    this.http = http;
                }
                ;
                ImagesService.prototype.getImages = function (profileType, profileId) {
                    var _this = this;
                    var fullUrl = global_settings_1.GlobalSettings.getApiUrl() + "/" + profileType.toLowerCase() + "/imagesAndMedia";
                    if (profileId !== undefined) {
                        fullUrl += "/" + profileId;
                    }
                    return this.http.get(fullUrl)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return _this.getImageArray(data.data); });
                };
                ImagesService.prototype.getImageArray = function (imageData) {
                    var imageArray = [];
                    var copyArray = [];
                    var titleArray = [];
                    imageData.images.forEach(function (val, index) {
                        val['images'] = global_settings_1.GlobalSettings.getBackgroundImageUrl(val.image_url);
                        val['copyright'] = val.image_copyright;
                        val['title'] = val.image_title;
                        imageArray.push(val['images']);
                        copyArray.push(val['copyright']);
                        titleArray.push(val['title']);
                    });
                    return {
                        imageArray: imageArray,
                        copyArray: copyArray,
                        titleArray: titleArray
                    };
                };
                ImagesService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ImagesService);
                return ImagesService;
            }());
            exports_1("ImagesService", ImagesService);
        }
    }
});
