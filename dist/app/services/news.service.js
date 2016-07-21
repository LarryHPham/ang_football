System.register(['@angular/core', '@angular/http', '../global/global-functions', '../global/global-settings'], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, global_settings_1;
    var NewsService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            NewsService = (function () {
                function NewsService(http) {
                    this.http = http;
                    this._apiUrl = global_settings_1.GlobalSettings.getNewsUrl();
                }
                NewsService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    return headers;
                };
                NewsService.prototype.getNewsService = function (newsSubject) {
                    var _this = this;
                    var headers = this.setToken();
                    var fullUrl = this._apiUrl + "/news/?action=get_sports_news&q=";
                    if (typeof newsSubject != "undefined") {
                        fullUrl += newsSubject;
                    }
                    return this.http.get(fullUrl, {
                        headers: headers
                    })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return {
                            news: _this.newsData(data)
                        };
                    });
                }; //getNewsService ends
                NewsService.prototype.newsData = function (data) {
                    var self = this;
                    var newsArray = [];
                    var dummyImg = "/app/public/no-image.png";
                    var _getHostName = global_functions_1.GlobalFunctions.getHostName;
                    data.forEach(function (val, index) {
                        var News = {
                            title: val.title,
                            description: val.description,
                            newsUrl: val.link,
                            author: _getHostName(val.link) != null ? _getHostName(val.link) : 'Anonymous',
                            published: moment.unix(val.pubDate_ut).format('dddd MMMM Do, YYYY'),
                            footerData: {
                                infoDesc: 'Want to check out the full story?',
                                text: 'READ THE ARTICLE',
                                url: val.link,
                                hrefUrl: true
                            }
                        };
                        newsArray.push(News);
                    });
                    return newsArray;
                }; //newsData ends
                NewsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], NewsService);
                return NewsService;
            }());
            exports_1("NewsService", NewsService);
        }
    }
});
