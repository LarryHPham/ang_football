System.register(['@angular/core', "../../components/module-footer/module-footer.component", '../../components/module-header/module-header.component', "../../components/list-of-lists-item/list-of-lists-item.component", "@angular/router-deprecated"], function(exports_1, context_1) {
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
    var core_1, module_footer_component_1, module_header_component_1, list_of_lists_item_component_1, router_deprecated_1, core_2;
    var ListOfListsModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (module_footer_component_1_1) {
                module_footer_component_1 = module_footer_component_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (list_of_lists_item_component_1_1) {
                list_of_lists_item_component_1 = list_of_lists_item_component_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            ListOfListsModule = (function () {
                function ListOfListsModule(_router) {
                    this._router = _router;
                    this.footerData = {
                        infoDesc: 'Want to see more lists like the ones above?',
                        btn: '',
                        text: 'VIEW MORE LISTS',
                        url: ['Error-page'],
                    };
                }
                ListOfListsModule.prototype.ngOnChanges = function (event) {
                    if (typeof event.listOfListsData != 'undefined') {
                        this.displayData = this.listOfListsData.listData;
                    }
                    this.moduleHeader = {
                        moduleTitle: "Top Lists - " + this.profileHeaderData.profileName,
                        hasIcon: false,
                        iconClass: "",
                    };
                    var type = this.listOfListsData['type'];
                    var routeName = type == "league" ? 'List-of-lists-league-page' : 'List-of-lists-page';
                    var params = {
                        limit: 10,
                        pageNum: 1
                    };
                    if (this.listOfListsData['id']) {
                        params["id"] = this.listOfListsData['id'];
                    }
                    if (type != "league") {
                        params["type"] = type;
                    }
                    this.footerData['url'] = [routeName, params];
                };
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', Object)
                ], ListOfListsModule.prototype, "profileHeaderData", void 0);
                __decorate([
                    core_2.Input(), 
                    __metadata('design:type', Object)
                ], ListOfListsModule.prototype, "listOfListsData", void 0);
                ListOfListsModule = __decorate([
                    core_1.Component({
                        selector: 'list-of-lists',
                        templateUrl: './app/modules/list-of-lists/list-of-lists.module.html',
                        directives: [module_header_component_1.ModuleHeader, module_footer_component_1.ModuleFooter, list_of_lists_item_component_1.ListOfListsItem],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router])
                ], ListOfListsModule);
                return ListOfListsModule;
            }());
            exports_1("ListOfListsModule", ListOfListsModule);
        }
    }
});
