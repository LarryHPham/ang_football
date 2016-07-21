System.register(['@angular/core', '@angular/http', '../global/global-settings'], function(exports_1, context_1) {
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
    var TwitterService;
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
            TwitterService = (function () {
                function TwitterService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                }
                TwitterService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    return headers;
                };
                // getTwitterService(profile, id){
                TwitterService.prototype.getTwitterService = function (profile, id) {
                    var headers = this.setToken();
                    var fullUrl = this._apiUrl;
                    fullUrl += "/" + profile + "/twitterInfo";
                    if (id !== undefined) {
                        fullUrl += "/" + id;
                    }
                    return this.http.get(fullUrl, {
                        headers: headers
                    })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return data.data;
                    }, function (err) {
                        console.log('INVALID DATA');
                    });
                }; //getTwitterService ends
                TwitterService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], TwitterService);
                return TwitterService;
            }());
            exports_1("TwitterService", TwitterService); //TwitterService ENDS
        }
    }
});
