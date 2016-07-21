System.register(['@angular/core', '@angular/router-deprecated'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1;
    var PaginationFooter;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            PaginationFooter = (function () {
                function PaginationFooter(myElement) {
                    this.myElement = myElement;
                    //Booleans to determine if max/min skip buttons should be shown
                    this.showMinSkip = false;
                    this.showMaxSkip = false;
                    //Number to determine +- range of buttons. (ex. buttonRange of 2 with an index of 6 yields buttons, 4 5 6 7 8)
                    this.buttonRange = 2;
                    //Output event emitter
                    this.newIndex = new core_1.EventEmitter();
                }
                //Verifies component input. If any issues are detected console warning is thrown
                PaginationFooter.prototype.verifyInput = function () {
                    var input = this.paginationParameters;
                    try {
                        //Check if input is defined at all
                        if (typeof input == 'undefined') {
                            throw 'No input parameters defined. Make sure input values are passed in correctly';
                        }
                        //Check if index parameter is defined
                        if (typeof input.index == 'undefined') {
                            throw 'input parameter index must be defined. Check component comments for more details';
                        }
                        //Check if max parameter is defined
                        if (typeof input.max == 'undefined') {
                            throw 'input parameter max must be defined. Check component comments for more details';
                        }
                        //Check if paginationType is defined
                        if (typeof input.paginationType == 'undefined') {
                            throw 'input parameter paginationType must be defined. Check component comments for more details';
                        }
                        //Do checks on required inputs if paginationType is page
                        if (input.paginationType == 'page') {
                            //Check if navigationPage is defined
                            if (typeof input.navigationPage == 'undefined') {
                                throw 'input parameter navigationPage must be defined for paginationType page. Check component comments for more details';
                            }
                            //Check if navigationParams are defined
                            if (typeof input.navigationParams == 'undefined') {
                                throw 'input parameter navigationParams must be defined for paginationType page. Check component comments for more details';
                            }
                            //Check if indexKey is defined
                            if (typeof input.indexKey == 'undefined') {
                                throw 'input parameter indexKey must be defined for paginationType page. Check component comments for more details';
                            }
                        }
                    }
                    catch (e) {
                        console.error('Error - Pagination Footer: ', e);
                    }
                };
                //Build button structure for pagination Type module
                PaginationFooter.prototype.buildModuleButtons = function () {
                    var index = Number(this.paginationParameters.index);
                    var max = Number(this.paginationParameters.max);
                    var range = this.buttonRange;
                    this.paginationButtonsModule = [];
                    //Determine values before index that can be added to button array
                    for (var p = range; p >= 1; p--) {
                        if (index - p > 1) {
                            this.paginationButtonsModule.push(index - p);
                        }
                    }
                    //Push index value to array if it is not the minimum or maximum value
                    if (index != 1 && index != max) {
                        this.paginationButtonsModule.push(index);
                    }
                    //Determine values after index that can be added to button array
                    for (var n = 1; n <= range; n++) {
                        if ((index + n) < max) {
                            this.paginationButtonsModule.push(index + n);
                        }
                    }
                    //Determine if absolute first button should be shown (show ellipsis if first item in array is not 2)
                    if (this.paginationButtonsModule.length != 0 && this.paginationButtonsModule[0] != (1 + 1)) {
                        this.showMinSkip = true;
                    }
                    else {
                        this.showMinSkip = false;
                    }
                    //Determine if absolute last button should be shown (show ellipsis if the last item in the array is not max - 1)
                    if (this.paginationButtonsModule.length != 0 && this.paginationButtonsModule[this.paginationButtonsModule.length - 1] != (max - 1)) {
                        this.showMaxSkip = true;
                    }
                    else {
                        this.showMaxSkip = false;
                    }
                };
                //Build button(anchor tag) structure for pagination Type page
                PaginationFooter.prototype.buildPageButtons = function () {
                    var index = Number(this.paginationParameters.index);
                    var max = Number(this.paginationParameters.max);
                    var range = this.buttonRange;
                    this.paginationButtonsPage = [];
                    var navigationPage = this.paginationParameters.navigationPage;
                    var indexKey = this.paginationParameters.indexKey;
                    //Determine values before index that can be added to button array
                    for (var p = range; p > 0; p--) {
                        if (index - p > 1) {
                            //Build routerLink params for index values
                            var params = this.copyDynamicParams();
                            params[indexKey] = index - p;
                            //Push button parameters to array
                            this.paginationButtonsPage.push({
                                index: (index - p),
                                page: navigationPage,
                                params: params
                            });
                        }
                    }
                    if (index != 1 && index != max) {
                        //Build routerLink params for inputted index value
                        var params = this.copyDynamicParams();
                        params[indexKey] = (index);
                        //Push button parameters to array
                        this.paginationButtonsPage.push({
                            index: index,
                            page: navigationPage,
                            params: params
                        });
                    }
                    //Determine values after index that can be added to button array
                    for (var n = 1; n <= range; n++) {
                        if (index + n < max) {
                            //Build routerLink params for index values
                            var params = this.copyDynamicParams();
                            params[indexKey] = index + n;
                            //Push button parameters to array
                            this.paginationButtonsPage.push({
                                index: (index + n),
                                page: navigationPage,
                                params: params
                            });
                        }
                    }
                    //Build min button parameters
                    var params = this.copyDynamicParams();
                    params[indexKey] = 1;
                    this.minButtonParameters = params;
                    //Build max button parameters
                    var params = this.copyDynamicParams();
                    params[indexKey] = max;
                    this.maxButtonParameters = params;
                    //Determine if absolute first button should be shown (show ellipsis if first item in array is not 2)
                    if (this.paginationButtonsPage.length != 0 && this.paginationButtonsPage[0].index != (1 + 1) && this.paginationButtonsPage[0].index != 1) {
                        this.showMinSkip = true;
                    }
                    else {
                        this.showMinSkip = false;
                    }
                    //Determine if absolute last button should be shown (show ellipsis if the last item in the array is not max - 1)
                    if (this.paginationButtonsPage.length != 0 && this.paginationButtonsPage[this.paginationButtonsPage.length - 1].index != (max - 1)) {
                        this.showMaxSkip = true;
                    }
                    else {
                        this.showMaxSkip = false;
                    }
                    //Build parameters of previous angle button
                    var params = this.copyDynamicParams();
                    if (index - 1 >= 1) {
                        params[indexKey] = index - 1;
                    }
                    else {
                        params[indexKey] = 1;
                    }
                    this.previousButtonParameters = params;
                    //Build parameters of next angle button
                    var params = this.copyDynamicParams();
                    if (index + 1 <= max) {
                        params[indexKey] = index + 1;
                    }
                    else {
                        params[indexKey] = max;
                    }
                    this.nextButtonParameters = params;
                };
                //Copy object of input navigationParameters
                PaginationFooter.prototype.copyDynamicParams = function () {
                    var params = {};
                    var navigationParameters = this.paginationParameters.navigationParams;
                    for (var key in navigationParameters) {
                        params[key] = navigationParameters[key];
                    }
                    return params;
                };
                //Function to navigate number buttons for paginationType module
                PaginationFooter.prototype.indexClick = function (event) {
                    var newIndex = Number(event.target.innerHTML);
                    this.paginationParameters.index = newIndex;
                    this.newIndex.next(newIndex);
                    this.buildModuleButtons();
                };
                //Function to navigate angle left button for paginationType module
                PaginationFooter.prototype.indexLeft = function (event) {
                    //If index equals 1 exit function, else set new index
                    if (this.paginationParameters.index == 1) {
                        return false;
                    }
                    else {
                        var newIndex = this.paginationParameters.index - 1;
                    }
                    //Send new index to output event emitter
                    this.newIndex.next(newIndex);
                    this.paginationParameters.index = newIndex;
                    this.buildModuleButtons();
                };
                //Function to navigate angle right button for paginationType module
                PaginationFooter.prototype.indexRight = function (event) {
                    //If index equals max exit function, else set new index
                    if (this.paginationParameters.index == this.paginationParameters.max) {
                        return false;
                    }
                    else {
                        var newIndex = this.paginationParameters.index + 1;
                    }
                    //Send new index to output event emitter
                    this.newIndex.next(newIndex);
                    this.paginationParameters.index = newIndex;
                    this.buildModuleButtons();
                };
                PaginationFooter.prototype.ngOnChanges = function (event) {
                    this.verifyInput();
                    // window.scrollTo(0, 0);
                    //Call button build function based on pagination Type
                    if (this.paginationParameters.paginationType == 'module') {
                        this.buildModuleButtons();
                    }
                    else if (this.paginationParameters.paginationType == 'page') {
                        this.buildPageButtons();
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], PaginationFooter.prototype, "paginationParameters", void 0);
                PaginationFooter = __decorate([
                    core_1.Component({
                        selector: 'pagination-footer',
                        templateUrl: './app/components/pagination-footer/pagination-footer.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES],
                        providers: [],
                        outputs: ['newIndex']
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef])
                ], PaginationFooter);
                return PaginationFooter;
            }());
            exports_1("PaginationFooter", PaginationFooter);
        }
    }
});
