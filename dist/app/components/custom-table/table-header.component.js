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
    var TableHeader;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            TableHeader = (function () {
                function TableHeader(_renderer) {
                    this._renderer = _renderer;
                    this.SORT_NONE = 0;
                    this.SORT_ASC = 1;
                    this.SORT_DESC = -1;
                    this.sortSwitched = new core_1.EventEmitter();
                }
                TableHeader.prototype.ngOnInit = function () {
                    this.isSortable = !this.headerData.ignoreSort;
                    this.iconSortType = this.headerData.isNumericType ? "numeric" : "alpha";
                    this.setSortIcon();
                };
                TableHeader.prototype.setSortIcon = function () {
                    switch (this.headerData.sortDirection) {
                        case this.SORT_ASC:
                            this.iconSortDirection = "fa-sort-up";
                            break;
                        case this.SORT_DESC:
                            this.iconSortDirection = "fa-sort-down";
                            break;
                        default:
                        case this.SORT_NONE:
                            this.iconSortDirection = "fa-sort";
                            break;
                    }
                };
                TableHeader.prototype.sortRows = function ($event) {
                    if (this.isSortable) {
                        switch (this.headerData.sortDirection) {
                            case this.SORT_ASC:
                                this.headerData.sortDirection = this.SORT_DESC;
                                break;
                            case this.SORT_DESC:
                                this.headerData.sortDirection = this.SORT_ASC;
                                break;
                            default:
                            case this.SORT_NONE:
                                this.headerData.sortDirection = this.SORT_DESC;
                                break;
                        }
                        this.setSortIcon();
                        this.sortSwitched.next([this.headerData, this.headerIndex]);
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], TableHeader.prototype, "headerData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], TableHeader.prototype, "headerIndex", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], TableHeader.prototype, "sortSwitched", void 0);
                TableHeader = __decorate([
                    core_1.Component({
                        selector: 'custom-table-header',
                        templateUrl: './app/components/custom-table/table-header.component.html'
                    }), 
                    __metadata('design:paramtypes', [core_1.Renderer])
                ], TableHeader);
                return TableHeader;
            }());
            exports_1("TableHeader", TableHeader);
        }
    }
});
