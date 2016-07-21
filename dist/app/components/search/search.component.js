System.register(['@angular/core', '@angular/router-deprecated', '../../services/search.service', 'rxjs/Rx', '@angular/common', '../images/circle-image'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, search_service_1, Rx_1, common_1, circle_image_1;
    var Search;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (search_service_1_1) {
                search_service_1 = search_service_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            }],
        execute: function() {
            Search = (function () {
                function Search(_elementRef, _searchService, _router) {
                    this._searchService = _searchService;
                    this._router = _router;
                    //NgControl of input
                    this.term = new common_1.Control();
                    //Array of suggestions dropdown
                    this.dropdownList = [];
                    //Boolean to determine if dropdown is focused on by the user
                    this.dropdownIsFocused = false;
                    //Autocomplete string
                    this.autoCompleteText = '';
                    //Index of a dropdown item that is been selected by arrow keys. (-1 is no selection or input selected)
                    this.selectedIndex = -1;
                    //Boolean to prevent search subscription from firing
                    this.isSuppressed = false;
                    this.elementRef = _elementRef;
                }
                //Function to detect if user clicks inside the component
                Search.prototype.handleClick = function (event) {
                    var target = event.target;
                    var clickedInside = false;
                    do {
                        if (target === this.elementRef.nativeElement) {
                            clickedInside = true;
                            //Exit do while loop
                            target = false;
                        }
                        target = target.parentNode;
                    } while (target);
                    //If the user clicks in the component, show results else hide results
                    if (clickedInside) {
                        //Clicked inside
                        this.dropdownIsFocused = true;
                    }
                    else {
                        //Clicked outside
                        this.dropdownIsFocused = false;
                    }
                };
                //Function to detect arrow key presses
                Search.prototype.searchKeydown = function (event) {
                    //If search input has suggestions, allow for arrow key functionality
                    if (this.searchInput.hasSuggestions === true) {
                        if (event.keyCode === 40) {
                            //Down Arrow Keystroke
                            if (this.dropdownList.length > 0) {
                                //If dropdown list exists change index
                                if (this.selectedIndex >= this.dropdownList.length - 1) {
                                    //If index is equal or greater than last item, reset index to -1 (input is selected)
                                    this.selectedIndex = -1;
                                    this.unsuppressSearch();
                                }
                                else {
                                    //Else increment index by 1
                                    this.selectedIndex++;
                                    var value = this.getSelectedValue(this.selectedIndex);
                                    this.suppressSearch(value);
                                }
                            }
                            //Prevents unwanted cursor jumping when up and down arrows are selected
                            event.preventDefault();
                        }
                        else if (event.keyCode === 38) {
                            //Up Arrow Keystroke
                            if (this.dropdownList.length > 0) {
                                //If dropdown list exists change index
                                if (this.selectedIndex < 0) {
                                    //If index is -1 (input is selected), set index to last item
                                    this.selectedIndex = this.dropdownList.length - 1;
                                    var value = this.getSelectedValue(this.selectedIndex);
                                    this.suppressSearch(value);
                                }
                                else if (this.selectedIndex === 0) {
                                    //Else if index is 0 (1st dropdown option is selected), set index to input and unsuppress search
                                    this.selectedIndex = -1;
                                    this.unsuppressSearch();
                                }
                                else {
                                    //Else decrement index by 1
                                    this.selectedIndex--;
                                    var value = this.getSelectedValue(this.selectedIndex);
                                    this.suppressSearch(value);
                                }
                            }
                            //Prevents unwanted cursor jumping when up and down arrows are selected
                            event.preventDefault();
                        }
                        else if (event.keyCode == 13) {
                        }
                        else {
                            //If other key is pressed unsuppress search
                            this.isSuppressed = false;
                            this.resetSelected();
                        }
                    }
                };
                //Get value that is
                Search.prototype.getSelectedValue = function (index) {
                    return this.dropdownList[index].value;
                };
                //Prevent search subscription from firing. This is needed to prevent the search from firing when a user selects a dropdown option with the arrow keys
                Search.prototype.suppressSearch = function (value) {
                    this.isSuppressed = true;
                    this.term.updateValue(value);
                };
                //Allow search subscription to fire again
                Search.prototype.unsuppressSearch = function () {
                    this.term.updateValue(this.storedSearchTerm);
                    this.isSuppressed = false;
                };
                //Function to reset the dropdown item selected by arrow keys to default (-1: input selected)
                Search.prototype.resetSelected = function () {
                    this.selectedIndex = -1;
                };
                //Function to make dropdown item active when hovered
                Search.prototype.itemHovered = function (index) {
                    this.selectedIndex = index;
                };
                //Function to check if autocomplete text should be displayed or hidden
                Search.prototype.compareAutoComplete = function (text) {
                    this.dropdownIsFocused = true;
                    if (this.dropdownList.length > 0) {
                        //If dropdown suggestions exists, determine if autocomplete text should be shown
                        var suggestionText = this.dropdownList[0].value;
                        //Sanitize values to compare. This is to match different case values
                        var tempCompare = suggestionText.toLowerCase();
                        var tempText = text.toLowerCase();
                        //Check to see if input text is a substring of suggestion Text
                        var indexOf = tempCompare.indexOf(tempText);
                        //If input is a substring of the suggestion text, display suggestion text
                        if (indexOf === 0 && text !== '') {
                            //Rebuild auto complete text to display
                            var autoCompleteText = text + suggestionText.substring(text.length);
                            this.autoCompleteText = autoCompleteText;
                        }
                        else {
                            //Else remove autocomplete text
                            this.autoCompleteText = '';
                        }
                    }
                    else {
                        //Else remove autocomplete text
                        this.autoCompleteText = '';
                    }
                };
                //On submit function for input
                Search.prototype.onSubmit = function () {
                    //Encode input to safely push to URL
                    var term = this.term.value ? encodeURIComponent(this.term.value) : '';
                    //If input is empty exit submit
                    if (term == '') {
                        return false;
                    }
                    var searchRoute;
                    if (this.selectedIndex < 0 && (this.dropdownList.length > 1 || this.dropdownList.length == 0)) {
                        searchRoute = this._searchService.getSearchRoute(term);
                    }
                    else if (this.dropdownList.length == 1) {
                        searchRoute = this.dropdownList[0].routerLink;
                    }
                    else {
                        var dropdownLink = this.dropdownList[this.selectedIndex].routerLink;
                        searchRoute = dropdownLink;
                    }
                    this._router.navigate(searchRoute);
                    //Clear out autocomplete text and close dropdown when search occurs
                    this.dropdownIsFocused = false;
                    this.autoCompleteText = '';
                };
                Search.prototype.unFocus = function () {
                    this.dropdownIsFocused = false;
                };
                Search.prototype.ngOnInit = function () {
                    var self = this;
                    var input = this.searchInput;
                    //If initial text exists
                    if (typeof input.initialText !== 'undefined') {
                        this.term.updateValue(input.initialText);
                    }
                    //Subscription for function call to service
                    this.subscription = this.term.valueChanges
                        .map(function (data) {
                        //Check every keystroke to determine if autocomplete text should be displayed
                        self.compareAutoComplete(data);
                        return data;
                    })
                        .debounceTime(400)
                        .filter(function (data) { return !self.isSuppressed; })
                        .distinctUntilChanged()
                        .switchMap(function (term) { return term.length > 0 ? self._searchService.getSearchDropdownData(term) : Rx_1.Observable.of({ term: term, searchResults: [] }); })
                        .subscribe(function (data) {
                        var term = data.term;
                        var searchResults = data.searchResults;
                        self.hasInputText = term.length > 0 ? true : false;
                        //Reset dropdown item that is selected
                        self.resetSelected();
                        //Assign data to dropdown
                        self.dropdownList = searchResults;
                        //Store input value for arrow keys dropdown
                        self.storedSearchTerm = term;
                        self.compareAutoComplete(term);
                    });
                };
                Search.prototype.ngOnDestroy = function () {
                    //Unsubscribe to observable to avoid memory leak
                    this.subscription.unsubscribe();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], Search.prototype, "searchInput", void 0);
                Search = __decorate([
                    core_1.Component({
                        selector: 'search',
                        host: {
                            '(document:click)': 'handleClick($event)'
                        },
                        templateUrl: './app/components/search/search.component.html',
                        directives: [circle_image_1.CircleImage, router_deprecated_1.ROUTER_DIRECTIVES],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, search_service_1.SearchService, router_deprecated_1.Router])
                ], Search);
                return Search;
            }());
            exports_1("Search", Search);
        }
    }
});
