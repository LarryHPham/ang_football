System.register(['@angular/core', '@angular/platform-browser', "../../global/global-settings", "../../components/buttons/slider/slider.button", '../../components/images/circle-image', '../../components/search/search.component', '@angular/router-deprecated', '../../services/landing-page', '../partner-home-page/partner-home-page'], function(exports_1, context_1) {
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
    var core_1, platform_browser_1, global_settings_1, slider_button_1, circle_image_1, search_component_1, router_deprecated_1, landing_page_1, partner_home_page_1;
    var PickTeamPage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (slider_button_1_1) {
                slider_button_1 = slider_button_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (search_component_1_1) {
                search_component_1 = search_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (landing_page_1_1) {
                landing_page_1 = landing_page_1_1;
            },
            function (partner_home_page_1_1) {
                partner_home_page_1 = partner_home_page_1_1;
            }],
        execute: function() {
            PickTeamPage = (function () {
                function PickTeamPage(_router, _landingPageService, _title) {
                    var _this = this;
                    this._router = _router;
                    this._landingPageService = _landingPageService;
                    this._title = _title;
                    this.imgHero1 = "/app/public/homePage_hero1.png";
                    this.imgIcon1 = "/app/public/homePage_icon1.png";
                    this.imageTile1 = "/app/public/iphone.png";
                    this.imageTile2 = "/app/public/ipad.png";
                    this.imageTile3 = "/app/public/MLB_Schedule_Image.jpg";
                    this.homeHeading1 = "Stay Loyal to Your Favorite MLB Team";
                    this.homeSubHeading1 = "Find the sports information you need to show your loyalty";
                    this.homeHeading2 = "PICK YOUR FAVORITE <span class='text-heavy'>MLB TEAM</span>";
                    this.homeFeaturesTile1 = "MLB Standings";
                    this.homeFeaturesTile3 = "MLB Scores";
                    this.homeFeaturesTile4 = "MLB Schedules";
                    this.homeFeaturesButton1 = "View MLB Standings";
                    this.homeFeaturesButton3 = "View MLB Scores";
                    this.homeFeaturesButton4 = "View MLB Schedules";
                    this.routerInfo1 = ['Standings-page'];
                    this.buttonFullList = "See The Full List";
                    this.mlb = "MLB";
                    this.counter = 0;
                    this.max = 3;
                    this.searchInput = {
                        placeholderText: "Search for a player or team...",
                        hasSuggestions: true
                    };
                    this.isHomeRunZone = false;
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle(""));
                    this.getData();
                    this.getListData();
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) {
                        var partnerHome = global_settings_1.GlobalSettings.getHomeInfo().isHome && global_settings_1.GlobalSettings.getHomeInfo().isPartner;
                        _this.isHomeRunZone = partnerHome;
                    });
                }
                PickTeamPage.prototype.onResize = function (event) {
                    this.width = event.target.innerWidth;
                    if (this.width < 641) {
                        this.gridDivCol = "col-xs-6";
                        this.gridLMain = "col-xs-12";
                        this.gridFeaturesCol = "col-xs-12";
                    }
                    else {
                        this.gridDivCol = "col-lg-4";
                        this.gridLMain = "col-xs-10";
                        this.gridFeaturesCol = "col-xs-12";
                    }
                };
                PickTeamPage.prototype.getListData = function () {
                    this.listData = [
                        {
                            newsTitle: "Pitchers with the Most Strikeouts Thrown",
                            newsSubTitle: "See which MLB Pitchers are performing at the top of their game",
                            routerInfo: ['List-page', { profile: 'player', listname: 'pitcher-strikeouts', sort: 'asc', conference: 'all', division: 'all', limit: '20', pageNum: '1' }]
                        },
                        {
                            newsTitle: "Batters With the Most Strikeouts in the MLB",
                            newsSubTitle: "See which MLB Batters are performing at the top of their game",
                            routerInfo: ['List-page', { profile: 'player', listname: 'batter-strikeouts', sort: 'asc', conference: 'all', division: 'all', limit: '20', pageNum: '1' }]
                        },
                        {
                            newsTitle: "Teams with the Most Runs Allowed in the MLB",
                            newsSubTitle: "See which MLB Teams are performing at the top of their game",
                            routerInfo: ['List-page', { profile: 'team', listname: 'pitcher-runs-allowed', sort: 'asc', conference: 'all', division: 'all', limit: '20', pageNum: '1' }]
                        },
                        {
                            newsTitle: "Teams with the Most RBIs in the MLB",
                            newsSubTitle: "See which MLB Teams are performing at the top of their game",
                            routerInfo: ['List-page', { profile: 'team', listname: 'batter-runs-batted-in', sort: 'asc', conference: 'all', division: 'all', limit: '20', pageNum: '1' }]
                        }
                    ];
                    this.changeMain(this.counter);
                };
                PickTeamPage.prototype.left = function () {
                    var counter = this.counter;
                    counter--;
                    //make a check to see if the array is below 0 change the array to the top level
                    if (counter < 0) {
                        this.counter = (this.max - 1);
                    }
                    else {
                        this.counter = counter;
                    }
                    this.changeMain(this.counter);
                };
                PickTeamPage.prototype.right = function () {
                    var counter = this.counter;
                    counter++;
                    //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
                    if (counter == this.max) {
                        this.counter = 0;
                    }
                    else {
                        this.counter = counter;
                    }
                    this.changeMain(this.counter);
                };
                //this is where the angular2 decides what is the main image
                PickTeamPage.prototype.changeMain = function (num) {
                    if (num < this.listData.length) {
                        this.displayData = this.listData[num];
                    }
                };
                PickTeamPage.prototype.getData = function () {
                    var _this = this;
                    this._landingPageService.getLandingPageService()
                        .subscribe(function (data) {
                        _this.mlbTeams = data.league;
                    });
                    var sampleImage = "./app/public/placeholder-location.jpg";
                };
                PickTeamPage.prototype.ngOnInit = function () {
                    this.onResize(event);
                };
                PickTeamPage = __decorate([
                    core_1.Component({
                        selector: 'home-page',
                        templateUrl: './app/webpages/home-page/home-page.page.html',
                        directives: [circle_image_1.CircleImage, router_deprecated_1.ROUTER_DIRECTIVES, search_component_1.Search, slider_button_1.SliderButton, partner_home_page_1.PartnerHomePage],
                        providers: [landing_page_1.LandingPageService, platform_browser_1.Title],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, landing_page_1.LandingPageService, platform_browser_1.Title])
                ], PickTeamPage);
                return PickTeamPage;
            }());
            exports_1("PickTeamPage", PickTeamPage);
        }
    }
});
