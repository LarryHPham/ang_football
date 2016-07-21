System.register(['@angular/core', '@angular/common', '@angular/router-deprecated', '../../global/global-functions', '../../components/loading/loading.component', '../../components/error/error.component', '../../pipes/datetime-format.pipe', './directory-pagination.component', '../../components/error/data-box/data-box.component'], function(exports_1, context_1) {
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
    var core_1, common_1, router_deprecated_1, global_functions_1, loading_component_1, error_component_1, datetime_format_pipe_1, directory_pagination_component_1, data_box_component_1;
    var DirectoryModule;
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
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (datetime_format_pipe_1_1) {
                datetime_format_pipe_1 = datetime_format_pipe_1_1;
            },
            function (directory_pagination_component_1_1) {
                directory_pagination_component_1 = directory_pagination_component_1_1;
            },
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            }],
        execute: function() {
            DirectoryModule = (function () {
                function DirectoryModule(router) {
                    this.router = router;
                    this.currentPage = 0;
                    //Boolean to determine if an error has occurred
                    this.isError = false;
                    this.isLoading = true;
                    this.nextLink = {
                        text: "Next"
                    };
                    this.prevLink = {
                        text: "Back"
                    };
                }
                DirectoryModule.prototype.ngOnChanges = function () {
                    this.setupData();
                };
                DirectoryModule.prototype.setupData = function () {
                    if (this.data === undefined || this.data === null) {
                        this.pagingDescription = null;
                        this.isLoading = true; //it may still be loading
                        return;
                    }
                    if (this.data.listingItems === undefined || this.data.listingItems === null) {
                        console.error("Unable to set up paging parameters: listing data is undefined");
                        this.pagingDescription = null;
                        return;
                    }
                    this.isLoading = false;
                    var pageName = this.data.pageName;
                    var maxPageCount = Math.ceil(this.data.listingItems.totalItems / this.data.listingsLimit);
                    var currPage = this.currentPage;
                    //Next Page
                    this.nextLink.route = [pageName, { page: currPage + 1 }];
                    this.setPageParams(this.nextLink);
                    //Previous Page
                    this.prevLink.route = [pageName, { page: currPage - 1 }];
                    this.setPageParams(this.prevLink);
                    //Determine range display for directory page (ex. 1-20, 22-40, etc)
                    var rangeStart = 0;
                    var rangeEnd = 0;
                    var totalItems = 0;
                    if (this.data.hasListings) {
                        rangeStart = (currPage - 1) * this.data.listingsLimit + 1;
                        rangeEnd = (currPage * this.data.listingsLimit <= this.data.listingItems.totalItems) ? (currPage * this.data.listingsLimit) : this.data.listingItems.totalItems;
                        totalItems = this.data.listingItems.totalItems;
                    }
                    this.pagingDescription = {
                        rangeText: global_functions_1.GlobalFunctions.commaSeparateNumber(rangeStart) + "-" + global_functions_1.GlobalFunctions.commaSeparateNumber(rangeEnd),
                        totalItems: totalItems,
                        totalPages: maxPageCount,
                        currentPage: currPage,
                        description: this.data.pagingDescription
                    };
                };
                DirectoryModule.prototype.setPageParams = function (link) {
                    for (var key in this.data.pageParams) {
                        //assuming key is field.
                        link.route[1][key] = this.data.pageParams[key];
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DirectoryModule.prototype, "data", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], DirectoryModule.prototype, "currentPage", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], DirectoryModule.prototype, "isError", void 0);
                DirectoryModule = __decorate([
                    core_1.Component({
                        selector: 'directory-module',
                        templateUrl: './app/modules/directory/directory.module.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, common_1.NgClass, loading_component_1.LoadingComponent, error_component_1.ErrorComponent, directory_pagination_component_1.DirectoryPagination, data_box_component_1.NoDataBox],
                        providers: [],
                        pipes: [datetime_format_pipe_1.DateTimePipe]
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router])
                ], DirectoryModule);
                return DirectoryModule;
            }());
            exports_1("DirectoryModule", DirectoryModule);
        }
    }
});
