System.register(['@angular/core', '../../components/module-footer/module-footer.component', '../../components/module-header/module-header.component', '../../components/transactions/transactions.component'], function(exports_1, context_1) {
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
    var core_1, module_footer_component_1, module_header_component_1, transactions_component_1;
    var TransactionsModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_footer_component_1_1) {
                module_footer_component_1 = module_footer_component_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (transactions_component_1_1) {
                transactions_component_1 = transactions_component_1_1;
            }],
        execute: function() {
            TransactionsModule = (function () {
                function TransactionsModule() {
                    this.tabSwitched = new core_1.EventEmitter(true);
                }
                TransactionsModule.prototype.ngOnChanges = function () {
                    this.footerData = {
                        infoDesc: 'Want to see more transactions?',
                        text: 'VIEW TRANSACTIONS',
                        url: this.data.ctaRoute
                    };
                    this.modHeadData = {
                        moduleTitle: "Transactions - " + this.data.profileName,
                        hasIcon: false,
                        iconClass: '',
                    };
                };
                TransactionsModule.prototype.tabSelected = function (tab) {
                    this.tabSwitched.next(tab);
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TransactionsModule.prototype, "tabSwitched", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TransactionsModule.prototype, "data", void 0);
                TransactionsModule = __decorate([
                    core_1.Component({
                        selector: 'transactions-module',
                        templateUrl: './app/modules/transactions/transactions.module.html',
                        directives: [module_header_component_1.ModuleHeader, module_footer_component_1.ModuleFooter, transactions_component_1.TransactionsComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TransactionsModule);
                return TransactionsModule;
            }());
            exports_1("TransactionsModule", TransactionsModule);
        }
    }
});
