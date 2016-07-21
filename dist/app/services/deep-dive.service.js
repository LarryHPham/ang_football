System.register(['@angular/core', '@angular/http', '../global/global-functions', '../global/mlb-global-functions', '../global/global-settings', '@angular/platform-browser'], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, mlb_global_functions_1, global_settings_1, platform_browser_1;
    var DeepDiveService;
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
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            DeepDiveService = (function () {
                // private _apiToken: string = 'BApA7KEfj';
                // private _headerName: string = 'X-SNT-TOKEN';
                function DeepDiveService(http, _sanitizer) {
                    this.http = http;
                    this._sanitizer = _sanitizer;
                    this._apiUrl = global_settings_1.GlobalSettings.getApiUrl();
                    this._trendingUrl = global_settings_1.GlobalSettings.getTrendingUrl();
                }
                //Function to set custom headers
                DeepDiveService.prototype.setToken = function () {
                    var headers = new http_1.Headers();
                    //headers.append(this.headerName, this.apiToken);
                    return headers;
                };
                DeepDiveService.prototype.getDeepDiveService = function () {
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    //date needs to be the date coming in AS EST and come back as UTC
                    var callURL = this._apiUrl + '/' + 'article/batch/2/25';
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        // transform the data to YYYY-MM-DD objects from unix
                        return data;
                    });
                };
                DeepDiveService.prototype.getDeepDiveArticleService = function (articleID) {
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    //date needs to be the date coming in AS EST and come back as UTC
                    var callURL = this._apiUrl + '/' + 'article/' + articleID;
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        // transform the data to YYYY-MM-DD objects from unix
                        return data;
                    });
                };
                DeepDiveService.prototype.getDeepDiveVideoService = function (articleID) {
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    //date needs to be the date coming in AS EST and come back as UTC
                    var callURL = this._apiUrl + '/' + 'article/video/batch/' + articleID + '/1';
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        // transform the data to YYYY-MM-DD objects from unix
                        return data;
                    });
                };
                DeepDiveService.prototype.getDeepDiveBatchService = function (numItems) {
                    //Configure HTTP Headers
                    var headers = this.setToken();
                    //date needs to be the date coming in AS EST and come back as UTC
                    var callURL = this._apiUrl + '/article' + '/batch/2/' + numItems;
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        // transform the data to YYYY-MM-DD objects from unix
                        return data;
                    });
                };
                DeepDiveService.prototype.getdeepDiveData = function (deepDiveData, callback, dataParam) {
                    if (deepDiveData == null) {
                        deepDiveData = {};
                    }
                    else {
                    }
                };
                DeepDiveService.prototype.getAiArticleData = function () {
                    var headers = this.setToken();
                    //this is the sidkeick url
                    var callURL = this._trendingUrl;
                    return this.http.get(callURL, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return data;
                    });
                };
                DeepDiveService.prototype.transformToBoxArticle = function (data) {
                    var boxArray = [];
                    var sampleImage = "/app/public/placeholder_XL.png";
                    data = data.data.slice(0, 2); //TODO
                    data.forEach(function (val, index) {
                        var Box = {
                            keyword: val.keyword,
                            date: global_functions_1.GlobalFunctions.formatUpdatedDate(val.publishedDate),
                            teaser: val.teaser,
                            url: val.articleUrl != null ? val.articleUrl : '/',
                            imageConfig: {
                                imageClass: "image-288x180",
                                mainImage: {
                                    imageUrl: val.imagePath != null ? global_settings_1.GlobalSettings.getImageUrl(val.imagePath) : sampleImage
                                }
                            }
                        };
                        boxArray.push(Box);
                    });
                    return boxArray;
                };
                DeepDiveService.prototype.transformToRecArticles = function (data) {
                    var articleTypes = [];
                    var articles = [];
                    var images = [];
                    for (var obj in data) {
                        if (obj == "meta-data")
                            continue;
                        articleTypes.push(obj);
                        articles.push(data[obj]);
                    }
                    var eventID = data['meta-data']['current']['eventId'];
                    //set up the images array
                    for (var obj in data['meta-data']['images']) {
                        for (var i = 0; i < data['meta-data']['images'][obj].length; i++) {
                            images.push(data['meta-data']['images'][obj][i]);
                        }
                    }
                    // to mix up the images
                    function shuffle(a) {
                        var j, x, i;
                        for (i = a.length; i; i--) {
                            j = Math.floor(Math.random() * i);
                            x = a[i - 1];
                            a[i - 1] = a[j];
                            a[j] = x;
                        }
                    }
                    shuffle(images);
                    var ret = [];
                    for (var i = 0; i < articles.length; i++) {
                        ret[i] = articles[i];
                        ret[i]['type'] = articleTypes[i];
                        ret[i]['image'] = images[i];
                        ret[i]['keyword'] = ret[i]['sidekickTitle'].toUpperCase();
                        ret[i]['bg_image_var'] = this._sanitizer.bypassSecurityTrustStyle("url(" + ret[i]['image'] + ")");
                        ret[i]['new_date'] = mlb_global_functions_1.MLBGlobalFunctions.convertAiDate(ret[i]['dateline']);
                        ret[i]['event_id'] = eventID;
                    }
                    //build to format expected by html
                    var _return = new Array(2);
                    for (var i = 0; i < _return.length; i++) {
                        _return[i] = [];
                    }
                    for (var i = 0; i < ret.length; i++) {
                        if (i < 3) {
                            _return[0].push(ret[i]);
                        }
                        if (i >= 3 && i < 6) {
                            _return[1].push(ret[i]);
                        }
                    }
                    return _return;
                };
                DeepDiveService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, platform_browser_1.DomSanitizationService])
                ], DeepDiveService);
                return DeepDiveService;
            }());
            exports_1("DeepDiveService", DeepDiveService);
        }
    }
});
