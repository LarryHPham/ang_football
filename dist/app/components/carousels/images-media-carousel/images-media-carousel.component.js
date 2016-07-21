System.register(['@angular/core', '@angular/platform-browser', '@angular/router-deprecated', "../../buttons/circle/circle.button", "../../module-header/module-header.component"], function(exports_1, context_1) {
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
    var core_1, platform_browser_1, router_deprecated_1, circle_button_1, module_header_component_1;
    var ImagesMedia;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (circle_button_1_1) {
                circle_button_1 = circle_button_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            }],
        execute: function() {
            ImagesMedia = (function () {
                function ImagesMedia(_sanitizer) {
                    this._sanitizer = _sanitizer;
                    this.expandText = 'Expand';
                    this.expandIcon = 'fa-expand';
                    this.modalButton = false;
                    // smallImage: MediaImageItem;
                    this.smallObjCounter = 0;
                    this.totalImageCount = 0;
                    this.imageCounter = 0;
                    this.imagesTitle = "Images";
                    this.image_url = './app/public/no_photo_images/onError.png';
                    this.arraySize = 5;
                }
                ImagesMedia.prototype.modalExpand = function () {
                    if (this.expand == true) {
                        this.expand = false;
                        jQuery("body").css({ "overflow": "auto", "pointer-events": "auto" });
                    }
                    else {
                        this.expand = true;
                        jQuery("body").css({ "overflow": "hidden", "pointer-events": "none" });
                    }
                    return this.expand;
                };
                ImagesMedia.prototype.left = function () {
                    //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
                    this.imageCounter = (((this.imageCounter - 1) % this.imageData.length) + this.imageData.length) % this.imageData.length;
                    this.smallObjCounter = (((this.smallObjCounter - 1) % this.arraySize) + this.arraySize) % this.arraySize;
                    if (this.smallObjCounter == 4) {
                        this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle, false);
                    }
                    //run the changeMain function to change the main image once a new array has been established
                    this.changeMain(this.imageCounter);
                };
                ImagesMedia.prototype.right = function () {
                    this.imageCounter = (this.imageCounter + 1) % this.imageData.length;
                    this.smallObjCounter = (this.smallObjCounter + 1) % this.arraySize;
                    if (this.smallObjCounter == 0) {
                        this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle);
                    }
                    //run the changeMain function to change the main image once a new array has been established
                    this.changeMain(this.imageCounter);
                };
                //this is where the angular2 decides what is the main image
                ImagesMedia.prototype.changeMain = function (num) {
                    this.displayCounter = this.imageCounter + 1;
                    // this.smallImage = this.mediaImages;
                    if (this.mediaImages && this.smallObjCounter < this.mediaImages.length) {
                        this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle("url(" + this.mediaImages[this.smallObjCounter].image + ")");
                        this.imageCredit = this.mediaImages[this.smallObjCounter].copyData;
                        this.description = this.mediaImages[this.smallObjCounter].title;
                    }
                };
                ImagesMedia.prototype.changeClick = function (num) {
                    this.imageCounter = this.mediaImages[num % 5].id;
                    this.smallObjCounter = num % 5;
                    this.changeMain(this.imageCounter);
                };
                ImagesMedia.prototype.modifyMedia = function (images, copyright, imageTitle, forward) {
                    if (forward === void 0) { forward = true; }
                    if (this.modalButton) {
                        this.expandText = 'Collapse';
                        this.expandIcon = 'fa-compress';
                    }
                    var totalImgs = images.length;
                    if (totalImgs < 5) {
                        this.arraySize = totalImgs;
                    }
                    var newImageArray = [];
                    var arrayStart = (((this.imageCounter + (forward ? 0 : -4)) % totalImgs) + totalImgs) % totalImgs;
                    for (var i = arrayStart; i < arrayStart + this.arraySize; i++) {
                        var index = i % totalImgs;
                        if (typeof this.copyright != 'undefined' && typeof this.imageTitle != 'undefined') {
                            newImageArray.push({
                                id: index,
                                image: images[index],
                                backgroundImage: this._sanitizer.bypassSecurityTrustStyle("url(" + images[index] + ")"),
                                copyData: copyright[index],
                                title: imageTitle[index]
                            });
                        }
                        else {
                            newImageArray.push({ id: index, image: images[index] });
                        }
                    }
                    return newImageArray;
                };
                //makes sure to show first image and run the modifyMedia function once data has been established
                ImagesMedia.prototype.ngOnChanges = function (event) {
                    if (typeof this.imageData != 'undefined') {
                        //if data coming from module to variable mediaImages changes in what way then reset to first image and rerun function
                        this.smallObjCounter = 0;
                        this.imageCounter = 0;
                        if (this.copyright == 'undefined') {
                            this.copyright = '';
                        }
                        if (this.imageTitle == 'undefined') {
                            this.imageTitle = '';
                        }
                        this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle);
                        this.changeMain(0);
                        this.totalImageCount = this.imageData.length;
                        if (this.isProfilePage) {
                            this.modHeadData = {
                                moduleTitle: "Images &amp; Media - " + this.profHeader.profileName,
                                hasIcon: false,
                                iconClass: '',
                            };
                        }
                    }
                };
                ImagesMedia.prototype.ngOnInit = function () {
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ImagesMedia.prototype, "imageData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ImagesMedia.prototype, "copyright", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], ImagesMedia.prototype, "imageTitle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], ImagesMedia.prototype, "isProfilePage", void 0);
                ImagesMedia = __decorate([
                    core_1.Component({
                        selector: 'images-media-carousel',
                        templateUrl: './app/components/carousels/images-media-carousel/images-media-carousel.component.html',
                        directives: [
                            router_deprecated_1.ROUTER_DIRECTIVES,
                            circle_button_1.CircleButton,
                            module_header_component_1.ModuleHeader
                        ],
                        providers: [],
                        inputs: ['trending', 'mediaImages', 'featureListing', 'modalButton', 'imageData', 'copyright', "imageTitle", 'profHeader', 'isProfilePage'],
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], ImagesMedia);
                return ImagesMedia;
            }());
            exports_1("ImagesMedia", ImagesMedia);
        }
    }
});
