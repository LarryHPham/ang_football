System.register(['@angular/core', '@angular/platform-browser'], function(exports_1, context_1) {
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
    var core_1, platform_browser_1;
    var SanitizeHtml, SanitizeScript, SanitizeStyle, SanitizeUrl, SanitizeRUrl;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            //sanitize html and innerHtml
            SanitizeHtml = (function () {
                function SanitizeHtml(sanitizer) {
                    this.sanitizer = sanitizer;
                }
                SanitizeHtml.prototype.transform = function (html) {
                    return this.sanitizer.bypassSecurityTrustHtml(html);
                };
                SanitizeHtml = __decorate([
                    core_1.Pipe({
                        name: 'safeHtml'
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], SanitizeHtml);
                return SanitizeHtml;
            }());
            exports_1("SanitizeHtml", SanitizeHtml);
            //sanitize scripts
            SanitizeScript = (function () {
                function SanitizeScript(sanitizer) {
                    this.sanitizer = sanitizer;
                }
                SanitizeScript.prototype.transform = function (script) {
                    return this.sanitizer.bypassSecurityTrustScript(script);
                };
                SanitizeScript = __decorate([
                    core_1.Pipe({
                        name: 'safeScript'
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], SanitizeScript);
                return SanitizeScript;
            }());
            exports_1("SanitizeScript", SanitizeScript);
            //sanitize styles
            SanitizeStyle = (function () {
                function SanitizeStyle(sanitizer) {
                    this.sanitizer = sanitizer;
                }
                SanitizeStyle.prototype.transform = function (style) {
                    return this.sanitizer.bypassSecurityTrustStyle(style);
                };
                SanitizeStyle = __decorate([
                    core_1.Pipe({
                        name: 'safeStyle'
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], SanitizeStyle);
                return SanitizeStyle;
            }());
            exports_1("SanitizeStyle", SanitizeStyle);
            //sanitize url src
            SanitizeUrl = (function () {
                function SanitizeUrl(sanitizer) {
                    this.sanitizer = sanitizer;
                }
                SanitizeUrl.prototype.transform = function (url) {
                    return this.sanitizer.bypassSecurityTrustUrl(url);
                };
                SanitizeUrl = __decorate([
                    core_1.Pipe({
                        name: 'safeUrl'
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], SanitizeUrl);
                return SanitizeUrl;
            }());
            exports_1("SanitizeUrl", SanitizeUrl);
            //sanitize url that returns videos
            SanitizeRUrl = (function () {
                function SanitizeRUrl(sanitizer) {
                    this.sanitizer = sanitizer;
                }
                SanitizeRUrl.prototype.transform = function (rurl) {
                    return this.sanitizer.bypassSecurityTrustResourceUrl(rurl);
                };
                SanitizeRUrl = __decorate([
                    core_1.Pipe({
                        name: 'safeRUrl'
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], SanitizeRUrl);
                return SanitizeRUrl;
            }());
            exports_1("SanitizeRUrl", SanitizeRUrl);
        }
    }
});
