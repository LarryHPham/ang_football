System.register(['@angular/core', '../images/circle-image', '@angular/router-deprecated'], function(exports_1, context_1) {
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
    var core_1, circle_image_1, router_deprecated_1;
    var ScheduleBox;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            }],
        execute: function() {
            ScheduleBox = (function () {
                function ScheduleBox() {
                }
                ScheduleBox.prototype.ngOnInit = function () {
                    if (typeof this.boxData == 'undefined') {
                        this.boxData = [{
                                date: "[Month] [DD] [YYYY] <i class='fa fa-circle'></i> [Time PM]",
                                awayImageConfig: {
                                    imageClass: 'image-60',
                                    mainImage: {
                                        imageUrl: '/app/public/no-image.png',
                                        urlRouteArray: ['Home-page'],
                                        hoverText: "<i class='fa fa-mail-forward'></i>",
                                        imageClass: 'border-1',
                                    },
                                },
                                homeImageConfig: {
                                    imageClass: 'image-60',
                                    mainImage: {
                                        imageUrl: '/app/public/no-image.png',
                                        urlRouteArray: ['Home-page'],
                                        hoverText: "<i class='fa fa-mail-forward'></i>",
                                        imageClass: 'border-1',
                                    },
                                },
                                awayTeamName: 'Blue Jays',
                                homeTeamName: 'Orioles',
                                reportDisplay: 'Mid Game Report',
                                reportLink: '/pick-a-team',
                            }];
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], ScheduleBox.prototype, "boxData", void 0);
                ScheduleBox = __decorate([
                    core_1.Component({
                        selector: 'schedule-box',
                        templateUrl: './app/components/schedule-box/schedule-box.component.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, circle_image_1.CircleImage],
                        pipes: [],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ScheduleBox);
                return ScheduleBox;
            }());
            exports_1("ScheduleBox", ScheduleBox);
        }
    }
});
