System.register(['@angular/core', '../scrollable-content/scrollable-content.component', '../../global/scroller-functions'], function(exports_1, context_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, scrollable_content_component_1, scroller_functions_1;
    var Dropdown, DropdownComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (scrollable_content_component_1_1) {
                scrollable_content_component_1 = scrollable_content_component_1_1;
            },
            function (scroller_functions_1_1) {
                scroller_functions_1 = scroller_functions_1_1;
            }],
        execute: function() {
            /**
             * Adds listeners that determine whether the
             * dropdown should be hidden or visible.
             *
             * Dropdown containers should appear when the header
             * element is clicked and disappear when the mouse is clicked
             * elsewhere within the document, UNLESS the mousedown
             * event starts on the scroller element.
             */
            Dropdown = (function () {
                function Dropdown(elementRef) {
                    this.mouseDownOnScrollBar = false;
                    this.isDropdownVisible = false;
                    this.nativeElement = elementRef.nativeElement;
                    this.dropdownHeader = this.nativeElement.getElementsByClassName('dropdown')[0];
                    this.dropdownContainer = this.nativeElement.getElementsByClassName('dropdown-wrapper')[0];
                    this.dropdownIcon = this.nativeElement.getElementsByClassName('dropdown-hdr-button')[0];
                    if (this.dropdownIcon) {
                        this.dropdownIcon = this.dropdownIcon.getElementsByTagName("i")[0];
                    }
                }
                Dropdown.prototype.toggleDropdown = function (showIt, dropdownHiddenIcon, dropdownVisibleIcon) {
                    this.isDropdownVisible = showIt;
                    var display = "none";
                    var icon = dropdownHiddenIcon;
                    var className = "dropdown";
                    if (this.isDropdownVisible) {
                        display = "";
                        icon = dropdownVisibleIcon;
                        className += " dropdown-active";
                    }
                    this.dropdownContainer.style.display = display;
                    this.dropdownHeader.className = className;
                    if (this.dropdownIcon) {
                        this.dropdownIcon.className = "fa " + icon;
                    }
                };
                return Dropdown;
            }());
            DropdownComponent = (function () {
                function DropdownComponent(elementRef, _renderer) {
                    this._renderer = _renderer;
                    this.dropdownChangedListener = new core_1.EventEmitter();
                    this._scrollerSetup = false;
                    this._elementRef = elementRef;
                }
                DropdownComponent.prototype.ngAfterViewInit = function () {
                    this.dropdown = new Dropdown(this._elementRef);
                    this.dropdownSetup();
                    this.hoverSetup();
                };
                DropdownComponent.prototype.ngOnChanges = function () {
                    var _this = this;
                    if (!this.icon) {
                        this.dropdownVisibleIcon = "fa-sort";
                        this.dropdownHiddenIcon = "fa-sort";
                    }
                    else if (this.icon == "fa-caret-down") {
                        this.dropdownVisibleIcon = "fa-caret-up";
                        this.dropdownHiddenIcon = "fa-caret-down";
                    }
                    else {
                        this.dropdownVisibleIcon = this.icon;
                        this.dropdownHiddenIcon = this.icon;
                    }
                    if (this.list) {
                        this.list.forEach(function (value, index) {
                            if (value.key == _this.selectedKey) {
                                _this.selectedItem = value;
                                _this.selectedIndex = index;
                            }
                        });
                        if (!this.selectedItem && this.list.length > 0) {
                            this.setSelected(this.list[0]);
                        }
                    }
                    if (!this.selectedItem) {
                        this.selectedItem = { key: "", value: " " };
                        this.selectedIndex = -1;
                    }
                };
                //TODO-CJP: setup multiple sort types
                DropdownComponent.prototype.setSelected = function ($item) {
                    this.selectedItem = $item;
                    this.selectedKey = $item.key;
                    if (this.list) {
                        var tempIndex = -1;
                        this.list.forEach(function (item, index) {
                            if (item.key == $item.key) {
                                tempIndex = index;
                            }
                        });
                        this.selectedIndex = tempIndex;
                    }
                    this.dropdownChangedListener.next($item.key);
                };
                DropdownComponent.prototype.ngOnDestroy = function () {
                    if (this.hideDropdownListener) {
                        this.hideDropdownListener();
                        this.hideDropdownListener = undefined;
                    }
                    if (this.keepOpenUntilMouseUp) {
                        this.keepOpenUntilMouseUp();
                        this.keepOpenUntilMouseUp = undefined;
                    }
                };
                //Function to detect arrow key presses
                DropdownComponent.prototype.searchKeydown = function (event) {
                    // console.log("keydown", event);
                    //If list has items, allow for arrow key functionality
                    if (this.list && this.list.length > 0) {
                        if (event.keyCode === 40) {
                            //Down Arrow Keystroke
                            if (this.selectedIndex >= this.list.length - 1) {
                                //If index is equal or greater than last item, reset index to -1 (input is selected)
                                this.selectedIndex = -1;
                            }
                            else {
                                //Else increment index by 1
                                this.selectedIndex++;
                                while (this.list[this.selectedIndex].preventSelection) {
                                    this.selectedIndex++;
                                    if (this.selectedIndex >= this.list.length) {
                                        this.selectedIndex = -1;
                                        break;
                                    }
                                }
                            }
                            this.scrollToSelected();
                            //Prevents unwanted cursor jumping when up and down arrows are selected
                            event.preventDefault();
                        }
                        else if (event.keyCode === 38) {
                            //Up Arrow Keystroke
                            if (this.selectedIndex === -1) {
                                //If index is -1 (input is selected), set index to last item
                                this.selectedIndex = this.list.length - 1;
                            }
                            else if (this.selectedIndex === 0) {
                                //Else if index is 0 (1st dropdown option is selected), set index to input 
                                this.selectedIndex = -1;
                            }
                            else {
                                //Else decrement index by 1
                                this.selectedIndex--;
                                while (this.list[this.selectedIndex].preventSelection) {
                                    this.selectedIndex--;
                                    if (this.selectedIndex == -1) {
                                        break;
                                    }
                                }
                            }
                            this.scrollToSelected();
                            //Prevents unwanted cursor jumping when up and down arrows are selected
                            event.preventDefault();
                        }
                        else if (event.keyCode === 13) {
                            //Enter key
                            if (this.selectedIndex >= 0 && this.selectedIndex < this.list.length) {
                                var $item = this.list[this.selectedIndex];
                                this.selectedItem = $item;
                                this.selectedKey = $item.key;
                                this.dropdownChangedListener.next($item.key);
                            }
                            this.dropdown.toggleDropdown(false, this.dropdownHiddenIcon, this.dropdownVisibleIcon);
                        }
                    }
                };
                DropdownComponent.prototype.scrollToSelected = function () {
                    if (this.selectedIndex >= 0 && this.selectedIndex < this.list.length) {
                        var $item = this.list[this.selectedIndex];
                        try {
                            var $div = this._elementRef.nativeElement.querySelector("[data-key='" + $item.key + "']");
                            if ($div) {
                                this.scroller.scrollToItem($div);
                                this.setHighlightOnCaret($div, false);
                            }
                        }
                        catch (err) {
                            console.log("error occurred during selector", err);
                        }
                    }
                };
                DropdownComponent.prototype.dropdownSetup = function () {
                    var self = this;
                    //This function closes the dropdown if the mouse is clicked anywhere but on the scrollbar. 
                    function closeDropdownOnClick() {
                        //Remove any existing listener:
                        if (self.hideDropdownListener) {
                            self.hideDropdownListener();
                            self.hideDropdownListener = undefined;
                        }
                        //Add new listener that checks for any click on the document
                        self.hideDropdownListener = self._renderer.listenGlobal('document', 'click', function (event) {
                            if (self.dropdown.mouseDownOnScrollBar) {
                                //Ignore click if 'keepDropdownOpen' is true, as that means the 
                                // user was dragging the scrollbar. But since the mouse is up again,
                                // reset the mouseDownOnScrollBar to false. 
                                self.dropdown.mouseDownOnScrollBar = false;
                                return;
                            }
                            self.dropdown.toggleDropdown(false, self.dropdownHiddenIcon, self.dropdownVisibleIcon);
                            if (self.hideDropdownListener) {
                                //if the listener still exists, remove it as it's not needed once
                                //the dropdown is hidden again 
                                self.hideDropdownListener();
                            }
                            self.hideDropdownListener = undefined;
                        });
                    }
                    //If we have valid dropdown elements, add the mousedown and click listeners
                    if (this.dropdown.dropdownContainer && this.dropdown.dropdownHeader) {
                        //needed to disable selection in IE11
                        this.dropdown.dropdownContainer.onselectstart = function () { return false; };
                        // We don't want to close dropdown when the scroller is selected,
                        // So this checks to see if the mouse went down on the scroller.
                        this.dropdown.dropdownHeader.addEventListener('mousedown', function (event) {
                            //Gets the element underneath the mouse
                            var element = document.elementFromPoint(event.clientX, event.clientY);
                            // Checks to see if that element is the scrollbar
                            self.dropdown.mouseDownOnScrollBar = element.className.indexOf("scrollable-item-scroller") >= 0;
                            //If it is the scrollbar, remove the 'keepOpenUntilMouseUp' listener, and create a new one
                            if (self.dropdown.mouseDownOnScrollBar) {
                                //Remove the listener if it exists
                                if (self.keepOpenUntilMouseUp) {
                                    self.keepOpenUntilMouseUp(); // this does the actual removal
                                }
                                //Only create this listener after a timeout so that the current mousedown doesn't automatically trigger it.
                                // We only want to trigger the 'keepOpenUntilMouseUp' function when a new mousedown event occurs   
                                setTimeout(function () {
                                    self.keepOpenUntilMouseUp = self._renderer.listenGlobal('document', 'mousedown', function (event) {
                                        self.dropdown.mouseDownOnScrollBar = false;
                                    });
                                }, 1);
                            }
                        });
                        // This opens (and closes) the dropdown when the dropdown header is clicked. 
                        this.dropdown.dropdownHeader.addEventListener('click', function (event) {
                            if (self.dropdown.mouseDownOnScrollBar) {
                                //ignore click if 'keepDropdownOpen' is true
                                // - this prevents the dropdown from closing if the mouse was in the process of dragging the scrollbar. 
                                return;
                            }
                            //Toggle the dropdown visibility and show/hide the actual container
                            self.dropdown.toggleDropdown(!self.dropdown.isDropdownVisible, self.dropdownHiddenIcon, self.dropdownVisibleIcon);
                            //The scroller can't calculate a content's height and scroll ratio when it's hidden.
                            //So this checks to see if the dropdown is visible and then sets up the scroller. 
                            if (self.dropdown.isDropdownVisible) {
                                self.scroller = scroller_functions_1.ScrollerFunctions.initializeScroller(self.dropdown.nativeElement, document);
                                self.scrollToSelected(); //Make sure the current selected item is visible.
                            }
                            if (!self.hideDropdownListener && self.dropdown.isDropdownVisible) {
                                //timeout is needed so that click doesn't happen for click.
                                setTimeout(closeDropdownOnClick, 1);
                            }
                        });
                    }
                };
                DropdownComponent.prototype.setHighlightOnCaret = function (optionElement, isHover) {
                    //Check to see if the bounds of the element overlaps the top edge of the scroll container
                    var scrollContainer = this._elementRef.nativeElement.getElementsByClassName('scrollable-item')[0];
                    var caretTop = this._elementRef.nativeElement.getElementsByClassName('dropdown-caret-top')[0];
                    var highlightCaret = false;
                    if (optionElement && optionElement.className.indexOf("dropdown-grp-lbl") < 0) {
                        var elementBounds = optionElement.getBoundingClientRect();
                        var scrollContainerBounds = scrollContainer.getBoundingClientRect();
                        if (scrollContainerBounds.top >= elementBounds.top) {
                            highlightCaret = true;
                        }
                    }
                    //If so, add the dropdown-caret-top-hover class to highlight the caret
                    var classes = caretTop.className.split(" ");
                    var styleClass = isHover ? "dropdown-caret-top-hover" : "dropdown-caret-top-active";
                    var index = classes.indexOf(styleClass);
                    if (highlightCaret) {
                        if (index < 0) {
                            classes.push(styleClass); //add styleClass
                        }
                    }
                    else {
                        if (index >= 0) {
                            classes.splice(index, 1); //remove styleClass
                        }
                    }
                    caretTop.className = classes.join(" ");
                };
                DropdownComponent.prototype.hoverSetup = function () {
                    var self = this;
                    var scrollContainer = this._elementRef.nativeElement.getElementsByClassName('scrollable-item')[0];
                    var caretTop = this._elementRef.nativeElement.getElementsByClassName('dropdown-caret-top')[0];
                    if (!scrollContainer || !caretTop) {
                        return;
                    }
                    //Adds a mouseover listener checks to see if the mouse
                    // is over the top item visible in the scroll container    
                    scrollContainer.addEventListener('mouseover', function (evt) {
                        //Get the element under the mouse point
                        var element = document.elementFromPoint(evt.clientX, evt.clientY);
                        //Cycle through parents until the dropdown-list-option element is found
                        // (loopCount limit of 10 to prevent infinite loops)
                        var optionElement = null, loopCount = 0;
                        while (!optionElement && loopCount < 10) {
                            loopCount++;
                            if (element.className.indexOf("dropdown-list-option") >= 0) {
                                optionElement = element;
                            }
                            element = element.parentElement;
                        }
                        self.setHighlightOnCaret(optionElement, true);
                    });
                    //Removes the dropdown-caret-top-hover class when the mouse 
                    //moves off the scroll container
                    scrollContainer.addEventListener('mouseout', function (evt) {
                        if (caretTop) {
                            var classes = caretTop.className.split(" ");
                            var index = classes.indexOf("dropdown-caret-top-hover");
                            if (index >= 0) {
                                classes.slice(index, 1);
                            }
                            caretTop.className = classes.join(" ");
                        }
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], DropdownComponent.prototype, "list", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DropdownComponent.prototype, "selectedKey", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DropdownComponent.prototype, "icon", void 0);
                __decorate([
                    core_1.Output("selectionChanged"), 
                    __metadata('design:type', Object)
                ], DropdownComponent.prototype, "dropdownChangedListener", void 0);
                DropdownComponent = __decorate([
                    core_1.Component({
                        selector: 'dropdown',
                        templateUrl: './app/components/dropdown/dropdown.component.html',
                        directives: [scrollable_content_component_1.ScrollableContent]
                    }),
                    __param(0, core_1.Inject(core_1.ElementRef)), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
                ], DropdownComponent);
                return DropdownComponent;
            }());
            exports_1("DropdownComponent", DropdownComponent);
        }
    }
});
