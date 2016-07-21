System.register(['@angular/core', '@angular/router-deprecated', '../../components/module-header/module-header.component', '../../components/flip-tiles/flip-tiles.component', '../../components/feature-list/feature-list.component', '../../global/global-functions'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, module_header_component_1, flip_tiles_component_1, feature_list_component_1, global_functions_1;
    var FeaturedListsModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (flip_tiles_component_1_1) {
                flip_tiles_component_1 = flip_tiles_component_1_1;
            },
            function (feature_list_component_1_1) {
                feature_list_component_1 = feature_list_component_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            }],
        execute: function() {
            FeaturedListsModule = (function () {
                function FeaturedListsModule(router, _params) {
                    this.router = router;
                    this._params = _params;
                    this.index = 0;
                    //Determine what page the profile header module is on
                    this.profileType = this.router.hostComponent.name;
                }
                //Build Module Title
                FeaturedListsModule.prototype.setModuleTitle = function () {
                    if (this.profileType === 'LocationPage') {
                        //Location Featured List Module
                        var paramLocation = this._params.get('loc');
                        var paramCity = global_functions_1.GlobalFunctions.toTitleCase(this.locData.city);
                        paramCity = global_functions_1.GlobalFunctions.toTitleCase(paramCity.replace(/%20/g, " "));
                        var paramState = this.locData.state;
                        this.moduleTitle = 'Featured Lists for ' + paramCity + ', ' + paramState;
                    }
                    else if (this.profileType === 'ProfilePage') {
                        //Listing Crime Module
                        var paramAddress = this._params.get('address').split('-');
                        var paramState = paramAddress[paramAddress.length - 1];
                        var paramCity = paramAddress[paramAddress.length - 2];
                        var tempArr = paramAddress.splice(-paramAddress.length, paramAddress.length - 2);
                        var address = tempArr.join(' ');
                        this.moduleTitle = 'Featured List for ' + global_functions_1.GlobalFunctions.toTitleCase(address) + ' ' + global_functions_1.GlobalFunctions.toTitleCase(paramCity) + ', ' + paramState;
                    }
                };
                FeaturedListsModule.prototype.left = function () {
                    if (this.featuredListData === null) {
                        return false;
                    }
                    var max = this.featuredListData.listData.length - 1;
                    if (this.index > 0) {
                        this.index -= 1;
                        this.transformData();
                    }
                    else {
                        this.index = max;
                        this.transformData();
                    }
                };
                FeaturedListsModule.prototype.right = function () {
                    if (this.featuredListData === null) {
                        return false;
                    }
                    var max = this.featuredListData.listData.length - 1;
                    if (this.index < max) {
                        this.index += 1;
                        this.transformData();
                    }
                    else {
                        this.index = 0;
                        this.transformData();
                    }
                };
                //Initialization Call
                FeaturedListsModule.prototype.ngOnInit = function () {
                    this.setModuleTitle();
                    //Set static data - Will remove when routes further defined
                };
                FeaturedListsModule.prototype.transformData = function () {
                    var data = this.featuredListData;
                    // Exit function if no list data is found
                    if (data.listData.length === 0) {
                        return false;
                    }
                    var listData = data.listData[this.index];
                    //Build heading 2 description
                    //Disabled until component can handle empty values for descriptions
                    //if((listData.numBedrooms === null || listData.numBedrooms === '0') && (listData.numBathrooms === null || listData.numBedrooms === '0')){
                    //    //No bedrooms or bathrooms defined
                    //    var heading2 = '';
                    //}else if((listData.numBedrooms !== null && listData.numBedrooms !== '0') && (listData.numBathrooms === null || listData.numBathrooms === '0')){
                    //    //Bedrooms defined, bathrooms undefined
                    //    var heading2 = 'Bedrooms: ' + listData.numBedrooms;
                    //}else if((listData.numBedrooms === null || listData.numBedrooms === '0') && (listData.numBathrooms !== null && listData.numBathrooms !== '0')){
                    //    //Bedrooms undefined, bathrooms defined
                    //    var heading2 = 'Bathrooms: ' + listData.numBathrooms;
                    //}else if((listData.numBedrooms !== null && listData.numBedrooms !== '0') && (listData.numBathrooms !== null && listData.numBathrooms !== '0')){
                    //    //Bedrooms and bathrooms defined
                    //    var heading2 = 'Bedrooms: ' + listData.numBedrooms + ' | Bathrooms: ' + listData.numBathrooms;
                    //}
                    var heading2 = 'Bedrooms: ' + listData.numBedrooms + ' | Bathrooms: ' + listData.numBathrooms;
                    //Used for both location and listing profile
                    this.listData = {
                        rank: this.index + 1,
                        header: 'Trending Real Estate',
                        title: "",
                        hding1: global_functions_1.GlobalFunctions.toTitleCase(listData.fullStreetAddress),
                        hding2: global_functions_1.GlobalFunctions.toTitleCase(listData.city) + ', ' + listData.stateOrProvince + ' ' + listData.postalCode,
                        detail1: heading2,
                        detail2: listData.listPrice === null ? '' : 'Asking Price: ',
                        // detail3: GlobalFunctions.formatPriceNumber(listData.listPrice),
                        imageUrl: listData.photos.length === 0 ? null : listData.photos[0],
                        ListUrl: 'List-page',
                        listParam: {
                            viewType: 'list',
                            //   listname: GlobalFunctions.camelCaseToKababCase(data.listName),
                            state: listData.stateOrProvince,
                            city: listData.city,
                            page: '1',
                        },
                        listingUrl1: '../../Magazine',
                        listingParam: { addr: listData.addressKey },
                        listingUrl2: 'PropertyOverview',
                    };
                    //get tiles data
                    this.tileData = [{
                            buttonText: 'Open Page',
                            title: 'Real Estate Trending List',
                            faIcon: 'fa-list-ul',
                            description: '',
                            routerInfo: ['List-page',
                                { viewType: 'list',
                                    // listname: GlobalFunctions.camelCaseToKababCase(data.listName),
                                    state: listData.stateOrProvince,
                                    city: listData.city,
                                    page: '1',
                                }],
                        },
                        {
                            buttonText: 'Open Page',
                            title: 'Top City Lists',
                            faIcon: 'fa-trophy',
                            description: '',
                            routerInfo: ['List-of-lists-page',
                                { state: listData.stateOrProvince,
                                    city: listData.city
                                }],
                        },
                        {
                            buttonText: 'Open Page',
                            title: 'Similar Statewide Lists',
                            faIcon: 'fa-th-large',
                            description: '',
                            routerInfo: ['List-of-lists-page-state', { state: listData.stateOrProvince }],
                        }];
                };
                //On Change Call
                FeaturedListsModule.prototype.ngOnChanges = function (event) {
                    //Get changed input
                    if (typeof event.featuredListData != 'undefined') {
                        var currentFeaturedListData = event.featuredListData.currentValue;
                        //If the data input is valid run transform data function
                        if (currentFeaturedListData !== null && currentFeaturedListData !== false) {
                            //Perform try catch to make sure module doesnt break page
                            try {
                                //If featured list data has no list data (length of 0) throw error to hide module
                                if (this.featuredListData.listData.length === 0) {
                                    throw 'No Data available for featured list - hiding module';
                                }
                                this.transformData();
                            }
                            catch (e) {
                                console.log('Error - Featured List Module ', e);
                                this.featuredListData = undefined;
                            } //end of
                        } //end of null check
                    } //end of event check
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], FeaturedListsModule.prototype, "featuredListData", void 0);
                FeaturedListsModule = __decorate([
                    core_1.Component({
                        selector: 'featured-lists-module',
                        templateUrl: './app/modules/featured_lists/featured_lists.module.html',
                        directives: [module_header_component_1.ModuleHeader, flip_tiles_component_1.FlipTilesComponent, feature_list_component_1.FeatureComponent],
                        providers: [],
                        inputs: ['locData']
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.Router, router_deprecated_1.RouteParams])
                ], FeaturedListsModule);
                return FeaturedListsModule;
            }());
            exports_1("FeaturedListsModule", FeaturedListsModule);
        }
    }
});
