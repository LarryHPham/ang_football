System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CellData;
    return {
        setters:[],
        execute: function() {
            CellData = (function () {
                function CellData(display, sort, routerLink, imageUrl, displayAsRawText) {
                    /**
                     * When set to true, [innerHtml] is not used to display the text, but rather {{}}
                     */
                    this.displayAsRawText = false;
                    this.display = display;
                    this.sort = sort;
                    this.routerLink = routerLink;
                    this.displayAsRawText = displayAsRawText;
                    if (imageUrl) {
                        this.image = {
                            imageClass: "image-48",
                            mainImage: {
                                imageUrl: imageUrl,
                                imageClass: "border-1",
                                urlRouteArray: routerLink,
                                hoverText: "<i class='fa fa-mail-forward'></i>",
                            },
                            subImages: []
                        };
                    }
                }
                return CellData;
            }());
            exports_1("CellData", CellData);
        }
    }
});
