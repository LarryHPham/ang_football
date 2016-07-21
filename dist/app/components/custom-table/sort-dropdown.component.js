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
    var SortDropdown;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SortDropdown = (function () {
                function SortDropdown(_renderer) {
                    this._renderer = _renderer;
                    this.isSortDropdownVisible = false;
                    this.sortAscendingListener = new core_1.EventEmitter();
                    this.sortDescendingListener = new core_1.EventEmitter();
                }
                SortDropdown.prototype.displaySortDropdown = function () {
                    var _this = this;
                    this.isSortDropdownVisible = !this.isSortDropdownVisible;
                    if (this.hideDropdownListener === undefined) {
                        //timeout is needed so that click doesn't happen for click.
                        setTimeout(function () {
                            _this.hideDropdownListener = _this._renderer.listenGlobal('document', 'click', function (event) {
                                _this.isSortDropdownVisible = false;
                                _this.hideDropdownListener();
                                _this.hideDropdownListener = undefined;
                            });
                        }, 0);
                    }
                };
                //TODO-CJP: setup multiple sort types
                SortDropdown.prototype.sortAscending = function ($event) {
                    this.sortAscendingListener.next([]);
                };
                SortDropdown.prototype.sortDescending = function ($event) {
                    this.sortDescendingListener.next([]);
                };
                SortDropdown.prototype.ngOnDestroy = function () {
                    if (this.hideDropdownListener !== undefined) {
                        this.hideDropdownListener();
                        this.hideDropdownListener = undefined;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SortDropdown.prototype, "iconSortType", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], SortDropdown.prototype, "sortAscendingListener", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], SortDropdown.prototype, "sortDescendingListener", void 0);
                SortDropdown = __decorate([
                    core_1.Component({
                        selector: 'sort-dropdown',
                        templateUrl: './app/components/custom-table/sort-dropdown.component.html',
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [core_1.Renderer])
                ], SortDropdown);
                return SortDropdown;
            }());
            exports_1("SortDropdown", SortDropdown);
        }
    }
});
