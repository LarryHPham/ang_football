System.register(['@angular/core', './tab.component'], function(exports_1, context_1) {
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
    var core_1, tab_component_1;
    var Tabs;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (tab_component_1_1) {
                tab_component_1 = tab_component_1_1;
            }],
        execute: function() {
            Tabs = (function () {
                function Tabs() {
                    this.tabSelected = new core_1.EventEmitter();
                }
                // contentChildren are set
                Tabs.prototype.ngAfterContentInit = function () {
                    // Disabled: Causes component to throw an exception when used with ngFor
                    // get all active tabs
                    //let activeTabs = this.tabs.filter((tab)=>tab.active);
                    //// if there is no active tab set, activate the first
                    //if(activeTabs.length === 0) {
                    //  this.tabs.first.active = true;
                    //}
                    // get width for each tab
                    if (this.tabs.length > 0) {
                        this.tabWidth = 100 / (this.tabs.length) + "%";
                    }
                };
                Tabs.prototype.selectTab = function (tab) {
                    //If selected tab is currently selected, exit function
                    if (tab.active === true) {
                        return false;
                    }
                    // deactivate all tabs
                    this.tabs.toArray().forEach(function (tab) { return tab.active = false; });
                    // activate the tab the user has clicked on.
                    tab.active = true;
                    this.tabSelected.emit(tab.title);
                };
                __decorate([
                    core_1.ContentChildren(tab_component_1.Tab), 
                    __metadata('design:type', core_1.QueryList)
                ], Tabs.prototype, "tabs", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], Tabs.prototype, "tabSelected", void 0);
                Tabs = __decorate([
                    core_1.Component({
                        selector: 'tabs',
                        templateUrl: './app/components/tabs/tabs.component.html',
                    }), 
                    __metadata('design:paramtypes', [])
                ], Tabs);
                return Tabs;
            }());
            exports_1("Tabs", Tabs);
        }
    }
});
