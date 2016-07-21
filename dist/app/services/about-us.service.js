System.register(['@angular/core', '@angular/http', "../global/global-functions", "../global/global-settings", "../global/mlb-global-functions"], function(exports_1, context_1) {
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
    var core_1, http_1, global_functions_1, global_settings_1, mlb_global_functions_1;
    var AboutUsService;
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
            },
            function (mlb_global_functions_1_1) {
                mlb_global_functions_1 = mlb_global_functions_1_1;
            }],
        execute: function() {
            AboutUsService = (function () {
                function AboutUsService(http) {
                    this.http = http;
                }
                AboutUsService.prototype.getData = function (partnerID) {
                    var _this = this;
                    var url = global_settings_1.GlobalSettings.getApiUrl() + '/landingPage/aboutUs';
                    return this.http.get(url)
                        .map(function (res) { return res.json(); })
                        .map(function (data) { return _this.formatData(data.data, partnerID); });
                };
                AboutUsService.prototype.formatData = function (data, partnerID) {
                    var pageName = (partnerID == null)
                        ? "Home Run Loyal"
                        : "My Home Run Zone";
                    var teamProfiles = global_functions_1.GlobalFunctions.commaSeparateNumber(data.teamProfilesCount);
                    var playerProfiles = global_functions_1.GlobalFunctions.commaSeparateNumber(data.playerProfilesCount);
                    var fullName = data.worldChampFirstName + " " + data.worldChampLastName;
                    var championLink = mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(fullName, data.worldChampTeamId);
                    var model = {
                        headerTitle: "What is " + pageName + "?",
                        titleData: {
                            imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                            text1: 'Last Updated: ' + global_functions_1.GlobalFunctions.formatUpdatedDate(data.lastUpdated),
                            text2: 'United States',
                            text3: "Want to learn more about " + pageName + "?",
                            text4: '',
                            icon: 'fa fa-map-marker'
                        },
                        blocks: [
                            {
                                iconUrl: '/app/public/team_profile_image.png',
                                titleText: 'MLB Team Profiles',
                                dataText: teamProfiles
                            },
                            {
                                iconUrl: '/app/public/player_profile_image.png',
                                titleText: 'MLB Player Profiles',
                                dataText: playerProfiles
                            },
                            {
                                iconUrl: '/app/public/division_image.png',
                                titleText: 'MLB Divisions',
                                dataText: global_functions_1.GlobalFunctions.commaSeparateNumber(data.divisionsCount)
                            },
                            {
                                link: {
                                    route: championLink,
                                    imageConfig: {
                                        imageClass: "image-50",
                                        mainImage: {
                                            imageUrl: global_settings_1.GlobalSettings.getImageUrl(data.worldChampImageUrl),
                                            imageClass: "border-1",
                                            urlRouteArray: championLink,
                                            hoverText: "<i class=\"fa fa-mail-forward\"></i>"
                                        }
                                    },
                                },
                                titleText: data.worldChampYear + ' World Series Champions',
                                dataText: data.worldChampLastName,
                            }
                        ],
                        //TODO-CJP: Update [July, 2016] to reflect actual creation date!
                        content: [
                            "We created Wichita, Kan. -based " + pageName + " in [July, 2016] to connect baseball fans with insightful, well-informed and up-to-date content.",
                            "Here at " + pageName + ", we have an appetite for digesting down big data in the world of baseball." +
                                " We create unique content so you can learn everything about your favorite team or player." +
                                " From rookie players and underachieving teams to veteran stars and perennial favorites, " +
                                pageName + " produces content and statistical information for " + teamProfiles + " MLB teams and over " + playerProfiles + " player profiles."
                        ]
                    };
                    return model;
                };
                AboutUsService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], AboutUsService);
                return AboutUsService;
            }());
            exports_1("AboutUsService", AboutUsService);
        }
    }
});
