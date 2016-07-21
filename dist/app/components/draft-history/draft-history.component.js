System.register(['@angular/core', '../../components/detailed-list-item/detailed-list-item.component', '../../components/carousels/slider-carousel/slider-carousel.component', '../../components/tabs/tabs.component', '../../components/tabs/tab.component', '../../components/error/data-box/data-box.component', "../../components/loading/loading.component", "../../components/error/error.component", '../../services/draft-history.service', '../../components/pagination-footer/pagination-footer.component'], function(exports_1, context_1) {
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
    var core_1, detailed_list_item_component_1, slider_carousel_component_1, tabs_component_1, tab_component_1, data_box_component_1, loading_component_1, error_component_1, draft_history_service_1, pagination_footer_component_1;
    var DraftHistoryComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (detailed_list_item_component_1_1) {
                detailed_list_item_component_1 = detailed_list_item_component_1_1;
            },
            function (slider_carousel_component_1_1) {
                slider_carousel_component_1 = slider_carousel_component_1_1;
            },
            function (tabs_component_1_1) {
                tabs_component_1 = tabs_component_1_1;
            },
            function (tab_component_1_1) {
                tab_component_1 = tab_component_1_1;
            },
            function (data_box_component_1_1) {
                data_box_component_1 = data_box_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (error_component_1_1) {
                error_component_1 = error_component_1_1;
            },
            function (draft_history_service_1_1) {
                draft_history_service_1 = draft_history_service_1_1;
            },
            function (pagination_footer_component_1_1) {
                pagination_footer_component_1 = pagination_footer_component_1_1;
            }],
        execute: function() {
            DraftHistoryComponent = (function () {
                function DraftHistoryComponent(_draftService) {
                    this._draftService = _draftService;
                    this.isError = false;
                    this.currentIndex = 0;
                }
                DraftHistoryComponent.prototype.ngOnInit = function () {
                    if (this.profileData != null) {
                        this.dataArray = this._draftService.getDraftHistoryTabs(this.profileData);
                        if (this.dataArray && this.dataArray.length > 0) {
                            this.getDraftPage(this.dataArray[0]);
                        }
                    }
                };
                DraftHistoryComponent.prototype.getDraftPage = function (tab) {
                    var _this = this;
                    if (tab.isLoaded) {
                        if (tab.paginationDetails) {
                            tab.paginationDetails.index = this.currentIndex + 1;
                        }
                        this.carouselDataArray = tab.carouselDataArray;
                        return;
                    }
                    this._draftService.getDraftHistoryService(this.profileData, tab, this.currentIndex, this.type)
                        .subscribe(function (draftData) {
                        tab.isLoaded = true;
                        tab.detailedDataArray = draftData.detailedDataArray;
                        tab.carouselDataArray = draftData.carouselDataArray;
                        tab.paginationDetails = draftData.paginationDetails;
                        _this.carouselDataArray = tab.carouselDataArray;
                    }, function (err) {
                        tab.isLoaded = true;
                        _this.isError = true;
                        console.log('Error: draftData API: ', err);
                    });
                };
                DraftHistoryComponent.prototype.selectedTab = function (tabTitle) {
                    var tabs = this.dataArray.filter(function (tab) { return tab.tabTitle == tabTitle; });
                    if (tabs.length > 0) {
                        this.currentIndex = 0; // change page back to beginning
                        this.getDraftPage(tabs[0]);
                    }
                };
                DraftHistoryComponent.prototype.newIndex = function (index) {
                    window.scrollTo(0, 0);
                    this.currentIndex = index - 1; //page index is 1-based, but we need 0-based to select correct array
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DraftHistoryComponent.prototype, "profileData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DraftHistoryComponent.prototype, "type", void 0);
                DraftHistoryComponent = __decorate([
                    core_1.Component({
                        selector: 'draft-history',
                        templateUrl: './app/components/draft-history/draft-history.component.html',
                        directives: [error_component_1.ErrorComponent, loading_component_1.LoadingComponent, data_box_component_1.NoDataBox, tab_component_1.Tab, tabs_component_1.Tabs, slider_carousel_component_1.SliderCarousel, detailed_list_item_component_1.DetailedListItem, pagination_footer_component_1.PaginationFooter]
                    }), 
                    __metadata('design:paramtypes', [draft_history_service_1.DraftHistoryService])
                ], DraftHistoryComponent);
                return DraftHistoryComponent;
            }());
            exports_1("DraftHistoryComponent", DraftHistoryComponent);
        }
    }
});
