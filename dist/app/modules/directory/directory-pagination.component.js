System.register(['@angular/core', '@angular/common', '@angular/router-deprecated'], function(exports_1, context_1) {
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
    var core_1, common_1, router_deprecated_1;
    var DirectoryPagination;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            DirectoryPagination = (function () {
                function DirectoryPagination() {
                    this.pagesUpdated();
                }
                DirectoryPagination.prototype.ngOnChanges = function () {
                    this.pagesUpdated();
                };
                DirectoryPagination.prototype.pagesUpdated = function () {
                    if (this.data !== undefined && this.data !== null) {
                        this.enableNext = this.data.currentPage + 1 <= this.data.totalPages;
                        this.enablePrev = this.data.currentPage - 1 > 0;
                    }
                    else {
                        this.enableNext = false;
                        this.enablePrev = false;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DirectoryPagination.prototype, "data", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DirectoryPagination.prototype, "nextLink", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DirectoryPagination.prototype, "prevLink", void 0);
                DirectoryPagination = __decorate([
                    core_1.Component({
                        selector: 'directory-pagination',
                        templateUrl: './app/modules/directory/directory-pagination.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, common_1.NgClass],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], DirectoryPagination);
                return DirectoryPagination;
            }());
            exports_1("DirectoryPagination", DirectoryPagination);
        }
    }
});
