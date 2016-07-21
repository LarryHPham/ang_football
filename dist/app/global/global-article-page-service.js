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
    var ArticleDataService;
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
            ArticleDataService = (function () {
                function ArticleDataService(http) {
                    this.http = http;
                }
                ArticleDataService.prototype.getArticleData = function (eventID, eventType, partnerId) {
                    var fullUrl = global_settings_1.GlobalSettings.getArticleUrl();
                    //having the query string is only temporary until the partner site link issue is figured out.
                    return this.http.get(fullUrl + eventType + '/' + eventID + "?partnerId=" + partnerId)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return data; });
                };
                ArticleDataService.prototype.getRecommendationsData = function (eventID) {
                    var fullUrl = global_settings_1.GlobalSettings.getRecommendUrl();
                    return this.http.get(fullUrl + eventID)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return data; });
                };
                ArticleDataService.prototype.getTrendingData = function () {
                    var fullUrl = global_settings_1.GlobalSettings.getTrendingUrl();
                    return this.http.get(fullUrl)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return data; });
                };
                ArticleDataService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ArticleDataService);
                return ArticleDataService;
            }());
            exports_1("ArticleDataService", ArticleDataService);
        }
    }
});
