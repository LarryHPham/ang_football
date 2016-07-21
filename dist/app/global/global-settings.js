System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var GlobalSettings;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            GlobalSettings = (function () {
                function GlobalSettings() {
                }
                GlobalSettings.getEnv = function (env) {
                    if (env == "localhost") {
                        env = "dev";
                    }
                    if (env != "dev" && env != "qa") {
                        env = "prod";
                    }
                    if (env != "prod" && env != "dev" && env != "qa") {
                        env = "www";
                    }
                    return env;
                };
                GlobalSettings.getDynamicWidet = function () {
                    return this._proto + "//" + this._dynamicApiUrl;
                };
                GlobalSettings.getApiUrl = function () {
                    //[https:]//[prod]-homerunloyal-api.synapsys.us
                    return this._proto + "//" + this.getEnv(this._env) + this._apiUrl;
                };
                GlobalSettings.getPartnerApiUrl = function (partnerID) {
                    return this._proto + "//" + this._partnerApiUrl + partnerID;
                };
                GlobalSettings.getImageUrl = function (relativePath) {
                    var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + "prod" + this._imageUrl + relativePath : '/app/public/no-image.png';
                    return relPath;
                };
                GlobalSettings.getBackgroundImageUrl = function (relativePath) {
                    var relPath = relativePath != null ? this._proto + "//" + "prod" + this._imageUrl + relativePath : '/app/public/drk-linen.png';
                    return relPath;
                };
                GlobalSettings.getArticleUrl = function () {
                    return this._proto + "//" + this.getEnv(this._env) + this._articleUrl;
                };
                GlobalSettings.getRecommendUrl = function () {
                    return this._proto + "//" + this.getEnv(this._env) + this._recommendUrl;
                };
                GlobalSettings.getTrendingUrl = function () {
                    return this._proto + "//" + this.getEnv(this._env) + this._trendingUrl;
                };
                GlobalSettings.getHeadlineUrl = function () {
                    return this._proto + "//" + this.getEnv(this._env) + this._headlineUrl;
                };
                GlobalSettings.getNewsUrl = function () {
                    //[https:]//[prod]-homerunloyal-api.synapsys.us
                    return this._proto + "//" + this._newsUrl;
                };
                GlobalSettings.getHomePage = function (partnerId, includePartnerId) {
                    if (partnerId) {
                        return this._proto + "//" + this.getEnv(this._env) + this._partnerHomepageUrl + (includePartnerId ? "/" + partnerId : "");
                    }
                    else {
                        return this._proto + "//" + this.getEnv(this._env) + this._homepageUrl;
                    }
                };
                GlobalSettings.getHomeInfo = function () {
                    //grabs the domain name of the site and sees if it is our partner page
                    var partner = false;
                    var isHome = false;
                    var hide = false;
                    var hostname = window.location.hostname;
                    var partnerPage = /myhomerunzone/.test(hostname);
                    // var partnerPage = /localhost/.test(hostname);
                    var name = window.location.pathname.split('/')[1];
                    //console.log("GlobalSettings:", 'partnerPage =>', partnerPage, 'name =>', name);
                    //PLEASE REVISIT and change
                    if (partnerPage && (name == '' || name == 'deep-dive')) {
                        hide = true;
                        isHome = true;
                    }
                    else if (!partnerPage && (name == '' || name == 'deep-dive')) {
                        hide = false;
                        isHome = true;
                    }
                    else {
                        hide = false;
                        isHome = false;
                    }
                    if (partnerPage) {
                        partner = partnerPage;
                    }
                    // console.log({isPartner: partner, hide:hide, isHome:isHome});
                    return { isPartner: partner, hide: hide, isHome: isHome, partnerName: name };
                };
                GlobalSettings.getSiteLogoUrl = function () {
                    return "/app/public/mainLogo.png";
                };
                /**
                 * This should be called by classes in their constructor function, so that the
                 * 'subscribe' function actually gets called and the partnerID can be located from the route
                 *
                 * @param{Router} router
                 * @param {Function} subscribeListener - takes a single parameter that represents the partnerID: (partnerID) => {}
                 */
                GlobalSettings.getPartnerID = function (router, subscribeListener) {
                    if (!subscribeListener)
                        return;
                    router.root.subscribe(function (route) {
                        var partnerID = null;
                        if (route && route.instruction && route.instruction.params) {
                            partnerID = route.instruction.params["partner_id"];
                        }
                        subscribeListener(partnerID == '' ? null : partnerID);
                    });
                };
                GlobalSettings.getPageTitle = function (subtitle, profileName) {
                    if (this.getHomeInfo().isPartner) {
                        this._baseTitle = "My HomeRun Zone";
                    }
                    return this._baseTitle +
                        (profileName && profileName.length > 0 ? " - " + profileName : "") +
                        (subtitle && subtitle.length > 0 ? " - " + subtitle : "");
                };
                GlobalSettings.getCopyrightInfo = function () {
                    return this._copyrightInfo;
                };
                GlobalSettings._env = window.location.hostname.split('.')[0];
                GlobalSettings._proto = window.location.protocol;
                GlobalSettings._newsUrl = 'newsapi.synapsys.us';
                GlobalSettings._apiUrl = '-homerunloyal-api.synapsys.us';
                GlobalSettings._partnerApiUrl = 'apireal.synapsys.us/listhuv/?action=get_partner_data&domain=';
                GlobalSettings._dynamicApiUrl = 'dw.synapsys.us/list_creator_api.php';
                GlobalSettings._imageUrl = '-sports-images.synapsys.us';
                GlobalSettings._articleUrl = '-homerunloyal-ai.synapsys.us/';
                GlobalSettings._recommendUrl = '-homerunloyal-ai.synapsys.us/headlines/event/';
                GlobalSettings._headlineUrl = '-homerunloyal-ai.synapsys.us/headlines/team/';
                GlobalSettings._trendingUrl = '-homerunloyal-ai.synapsys.us/sidekick';
                GlobalSettings._homepageUrl = '.homerunloyal.com';
                GlobalSettings._partnerHomepageUrl = '.myhomerunzone.com';
                GlobalSettings._baseTitle = "Home Run Loyal";
                GlobalSettings._copyrightInfo = "USA Today Sports Images";
                GlobalSettings = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], GlobalSettings);
                return GlobalSettings;
            }());
            exports_1("GlobalSettings", GlobalSettings);
        }
    }
});
