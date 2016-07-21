System.register(['@angular/core', "@angular/router-deprecated", '../../global/global-functions', '../../global/mlb-global-functions', "../../global/global-settings", '../dropdown-directory/dropdown-directory.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, global_functions_1, mlb_global_functions_1, global_settings_1, dropdown_directory_component_1;
    var FooterComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
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
            function (dropdown_directory_component_1_1) {
                dropdown_directory_component_1 = dropdown_directory_component_1_1;
            }],
        execute: function() {
            FooterComponent = (function () {
                function FooterComponent() {
                    this.currentUrl = window.location.href;
                    this.teamDirectoryListings = [];
                    this.playerDirectoryListings = [];
                    this.mlbTeamListings = [];
                    //TODO: create footer links for mlb by specifying ID
                    this.mlbTeams = [
                        { name: "Arizona Diamondbacks", id: 2793 },
                        { name: "Atlanta Braves", id: 2796 },
                        { name: "Baltimore Orioles", id: 2799 },
                        { name: "Boston Red Sox", id: 2791 },
                        { name: "Chicago Cubs", id: 2795 },
                        { name: "Chicago White Sox", id: 2790 },
                        { name: "Cincinnati Reds", id: 2816 },
                        { name: "Cleveland Indians", id: 2809 },
                        { name: "Colorado Rockies", id: 2800 },
                        { name: "Detroit Tigers", id: 2797 }
                    ];
                }
                FooterComponent.prototype.loadData = function (partner) {
                    var checkPartner = global_settings_1.GlobalSettings.getHomeInfo().isPartner;
                    if (!partner && !checkPartner) {
                        this.pageName = "Home Run Loyal";
                        this.linkName = "HomeRunLoyal.com";
                    }
                    else {
                        this.pageName = "My Home Run Zone";
                        this.linkName = "MyHomeRunZone.com";
                    }
                };
                FooterComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.loadData(this.partner);
                    this.teamDirectoryListings = global_functions_1.GlobalFunctions.setupAlphabeticalNavigation("teams");
                    this.playerDirectoryListings = global_functions_1.GlobalFunctions.setupAlphabeticalNavigation("players");
                    this.mlbTeams.forEach(function (team) {
                        _this.mlbTeamListings.push({
                            text: team.name,
                            route: mlb_global_functions_1.MLBGlobalFunctions.formatTeamRoute(team.name, team.id.toString())
                        });
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], FooterComponent.prototype, "partner", void 0);
                FooterComponent = __decorate([
                    core_1.Component({
                        selector: 'footer-component',
                        templateUrl: './app/components/footer/footer.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, dropdown_directory_component_1.DropdownDirectoryComponent],
                        inputs: [],
                        providers: [],
                    }), 
                    __metadata('design:paramtypes', [])
                ], FooterComponent);
                return FooterComponent;
            }());
            exports_1("FooterComponent", FooterComponent);
        }
    }
});
