System.register(['@angular/core', '../../components/search/search.component', '@angular/router-deprecated', '../../components/sub-header/sub-header.component', '../../components/hamburger-menu/hamburger-menu.component'], function(exports_1, context_1) {
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
    var core_1, search_component_1, router_deprecated_1, sub_header_component_1, hamburger_menu_component_1;
    var HeaderComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (search_component_1_1) {
                search_component_1 = search_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (sub_header_component_1_1) {
                sub_header_component_1 = sub_header_component_1_1;
            },
            function (hamburger_menu_component_1_1) {
                hamburger_menu_component_1 = hamburger_menu_component_1_1;
            }],
        execute: function() {
            HeaderComponent = (function () {
                function HeaderComponent() {
                    this.tabSelected = new core_1.EventEmitter();
                    this.searchInput = {
                        placeholderText: "Search for a player or team...",
                        hasSuggestions: true
                    };
                    this.isActive = false;
                }
                HeaderComponent.prototype.loadData = function (partnerID) {
                    this.logoUrl = 'app/public/Home-Run-Loyal_Logo.svg';
                    this.hamburgerMenuData = [{
                            menuTitle: "Home",
                            url: ['Home-page']
                        },
                        {
                            menuTitle: "Pick a Team",
                            url: ['Pick-team-page']
                        },
                        {
                            menuTitle: "MLB League",
                            url: ['MLB-page']
                        },
                        {
                            menuTitle: "MLB Schedule",
                            url: ['Schedules-page-league', { pageNum: 1 }]
                        },
                        {
                            menuTitle: "MLB Standings",
                            url: ['Standings-page-league', { type: 'mlb' }]
                        }];
                    this.hamburgerMenuInfo = [{
                            menuTitle: "About Us",
                            url: ['About-us-page']
                        },
                        {
                            menuTitle: "Contact Us",
                            url: ['Contact-us-page']
                        },
                        {
                            menuTitle: "Disclamer",
                            url: ['Disclaimer-page']
                        }];
                }; //loadData ends
                // Page is being scrolled
                HeaderComponent.prototype.onScrollStick = function (event) {
                    //check if partner header exist and the sticky header shall stay and not partner header
                    if (document.getElementById('partner') != null) {
                        var partnerHeight = document.getElementById('partner').offsetHeight;
                        var scrollTop = jQuery(window).scrollTop();
                        var stickyHeader = partnerHeight ? partnerHeight : 0;
                        var maxScroll = stickyHeader - scrollTop;
                        if (maxScroll <= 0) {
                            maxScroll = 0;
                        }
                        this._stickyHeader = (maxScroll) + "px";
                    }
                    else {
                        this._stickyHeader = "0px";
                    }
                }; //onScrollStick ends
                HeaderComponent.prototype.getMenu = function () {
                    if (this.isOpened == true) {
                        this.isOpened = false;
                    }
                    else {
                        this.isOpened = true;
                    }
                };
                HeaderComponent.prototype.getSearch = function () {
                    if (this.isActive == null || this.isActive == false) {
                        this.isActive = true;
                    }
                    else {
                        this.isActive = false;
                    }
                };
                HeaderComponent.prototype.ngOnInit = function () {
                    stButtons.locateElements();
                };
                HeaderComponent.prototype.ngOnChanges = function () {
                    this.loadData(this.partnerID);
                };
                __decorate([
                    core_1.Input('partner'), 
                    __metadata('design:type', String)
                ], HeaderComponent.prototype, "partnerID", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], HeaderComponent.prototype, "tabSelected", void 0);
                HeaderComponent = __decorate([
                    core_1.Component({
                        selector: 'header-component',
                        templateUrl: './app/components/header/header.component.html',
                        directives: [search_component_1.Search, router_deprecated_1.ROUTER_DIRECTIVES, sub_header_component_1.SubHeaderComponent, hamburger_menu_component_1.HamburgerMenuComponent],
                        providers: [],
                    }), 
                    __metadata('design:paramtypes', [])
                ], HeaderComponent);
                return HeaderComponent;
            }());
            exports_1("HeaderComponent", HeaderComponent);
        }
    }
});
