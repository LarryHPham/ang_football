System.register(['@angular/core', '../../components/images/circle-image'], function(exports_1, context_1) {
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
    var core_1, circle_image_1;
    var Competition;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            }],
        execute: function() {
            Competition = (function () {
                function Competition() {
                }
                Competition.prototype.ngOnInit = function () {
                    if (typeof this.competition == 'undefined') {
                        this.competition = {
                            leftData: '[Home <b>Team</b>]',
                            leftValue: 'Record: [##]-[##]',
                            leftCircle: {
                                imageClass: "image-70-sub",
                                mainImage: {
                                    imageUrl: "./app/public/placeholder-location.jpg",
                                    urlRouteArray: ['Disclaimer-page'],
                                    hoverText: "<i class='fa fa-mail-forward competition-fa'></i>",
                                    imageClass: "border-1"
                                }
                            },
                            rightData: '[Away <b>Team</b>]',
                            rightValue: 'Record: [##]-[##]',
                            rightCircle: {
                                imageClass: "image-70-sub",
                                mainImage: {
                                    imageUrl: "./app/public/placeholder-location.jpg",
                                    urlRouteArray: ['Disclaimer-page'],
                                    hoverText: "<i class='fa fa-mail-forward competition-fa'></i>",
                                    imageClass: "border-1"
                                }
                            },
                        };
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], Competition.prototype, "competition", void 0);
                Competition = __decorate([
                    core_1.Component({
                        selector: 'competition',
                        templateUrl: './app/components/competition/competition.component.html',
                        directives: [circle_image_1.CircleImage],
                        providers: [],
                    }), 
                    __metadata('design:paramtypes', [])
                ], Competition);
                return Competition;
            }());
            exports_1("Competition", Competition);
        }
    }
});
