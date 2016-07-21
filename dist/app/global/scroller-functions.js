System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Scroller, ScrollerFunctions;
    return {
        setters:[],
        execute: function() {
            Scroller = (function () {
                function Scroller(scrollContainer) {
                    this.scrollContainer = scrollContainer;
                    this.scrollContentWrapper = scrollContainer.getElementsByClassName('scrollable-item-wrapper');
                    this.scrollContent = scrollContainer.getElementsByClassName('scrollable-item-content');
                    if (this.scrollContentWrapper.length == 0 || this.scrollContent.length == 0) {
                        return;
                    }
                    else {
                        this.scrollContentWrapper = this.scrollContentWrapper[0];
                        this.scrollContent = this.scrollContent[0];
                    }
                    // Setup Scroller
                    this.scrollbarHeightRatio = 0.90;
                    this.scrollbarBaseHeight = scrollContainer.offsetHeight * this.scrollbarHeightRatio;
                    this.contentRatio = scrollContainer.offsetHeight / this.scrollContentWrapper.scrollHeight;
                    this.scrollerHeight = this.contentRatio * this.scrollbarBaseHeight;
                    this.scrollOffset = 5; // should be the same as offset in scroll-content.component.less file
                    var scrollerElements = scrollContainer.getElementsByClassName('scrollable-item-scroller');
                    if (scrollerElements && scrollerElements.length > 0) {
                        this.scrollerElement = scrollerElements[0];
                        this.scrollerAlreadyOnPage = true;
                    }
                    else {
                        this.scrollerAlreadyOnPage = false;
                    }
                }
                Scroller.prototype.setup = function () {
                    if (!this.scrollerElement) {
                        this.scrollerElement = document.createElement("div");
                    }
                    this.scrollerElement.className = 'scrollable-item-scroller';
                    if (this.contentRatio < 1) {
                        this.scrollerElement.style.height = this.scrollerHeight + 'px';
                        // append scroller to scrollContainer div
                        if (!this.scrollerAlreadyOnPage) {
                            this.scrollerElement.style.top = this.scrollOffset.toString();
                            this.createScroller();
                        }
                    }
                };
                // Functions          
                Scroller.prototype.startDrag = function (evt) {
                    this.normalizedPosition = evt.pageY;
                    this.contentPosition = this.scrollContentWrapper.scrollTop;
                    this.scrollerBeingDragged = true;
                };
                Scroller.prototype.stopDrag = function (evt) {
                    this.scrollerBeingDragged = false;
                };
                Scroller.prototype.scrollBarScroll = function (evt) {
                    if (this.scrollerBeingDragged === true) {
                        var mouseDifferential = evt.pageY - this.normalizedPosition;
                        var scrollEquivalent = mouseDifferential * (this.scrollContentWrapper.scrollHeight / this.scrollContainer.offsetHeight);
                        this.scrollContentWrapper.scrollTop = this.contentPosition + scrollEquivalent;
                    }
                };
                Scroller.prototype.createScroller = function () {
                    var self = this;
                    this.normalizedPosition = 0;
                    this.contentPosition = 0;
                    this.scrollerBeingDragged = false;
                    this.scrollContainer.appendChild(this.scrollerElement);
                    // show scroll path divot
                    this.scrollContainer.className += ' showScroll';
                    // attach related draggable listeners
                    this.scrollerElement.addEventListener('mousedown', this.startDrag);
                    window.addEventListener('mouseup', this.stopDrag);
                    window.addEventListener('mousemove', this.scrollBarScroll);
                    this.scrollContentWrapper.addEventListener('scroll', function (evt) {
                        // Move Scroll bar to top offset
                        var scrollPercentage = evt.target.scrollTop / self.scrollContentWrapper.scrollHeight;
                        var topPosition = (scrollPercentage * self.scrollbarBaseHeight);
                        topPosition += self.scrollOffset;
                        self.scrollerElement.style.top = topPosition + 'px';
                    });
                };
                Scroller.prototype.scrollToItem = function (element) {
                    var containerRect = this.scrollContainer.getBoundingClientRect();
                    var itemRect = element.getBoundingClientRect();
                    var diff = 0;
                    if (itemRect.bottom > containerRect.bottom) {
                        diff = itemRect.bottom - containerRect.bottom;
                    }
                    else if (itemRect.top < containerRect.top) {
                        diff = itemRect.top - containerRect.top;
                    }
                    if (diff != 0) {
                        this.scrollContentWrapper.scrollTop += diff;
                    }
                };
                return Scroller;
            }());
            exports_1("Scroller", Scroller);
            ScrollerFunctions = (function () {
                function ScrollerFunctions() {
                }
                ScrollerFunctions.initializeScroller = function (nativeElement, document) {
                    var scrollContainers = nativeElement.getElementsByClassName('scrollable-item');
                    var container = scrollContainers.length > 0 ? scrollContainers[0] : null;
                    if (!container) {
                        return null;
                    }
                    var scroller = new Scroller(container);
                    scroller.setup();
                    return scroller;
                };
                return ScrollerFunctions;
            }());
            exports_1("ScrollerFunctions", ScrollerFunctions);
        }
    }
});
