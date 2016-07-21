System.register(['@angular/core', '../../components/schedule-box/schedule-box.component', '../../components/carousels/side-scroll/side-scroll.component'], function(exports_1, context_1) {
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
    var core_1, schedule_box_component_1, side_scroll_component_1;
    var SideScrollSchedule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (schedule_box_component_1_1) {
                schedule_box_component_1 = schedule_box_component_1_1;
            },
            function (side_scroll_component_1_1) {
                side_scroll_component_1 = side_scroll_component_1_1;
            }],
        execute: function() {
            SideScrollSchedule = (function () {
                function SideScrollSchedule() {
                    this.count = new core_1.EventEmitter();
                    this.curCount = 0;
                }
                SideScrollSchedule.prototype.counter = function (event) {
                    this.curCount = event;
                    this.count.emit(event);
                };
                SideScrollSchedule.prototype.ngOnChanges = function () {
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SideScrollSchedule.prototype, "sideScrollData", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], SideScrollSchedule.prototype, "scrollLength", void 0);
                SideScrollSchedule = __decorate([
                    core_1.Component({
                        selector: 'side-scroll-schedules',
                        templateUrl: './app/modules/side-scroll-schedules/side-scroll-schedules.module.html',
                        directives: [schedule_box_component_1.ScheduleBox, side_scroll_component_1.SideScroll],
                        outputs: ['count']
                    }), 
                    __metadata('design:paramtypes', [])
                ], SideScrollSchedule);
                return SideScrollSchedule;
            }());
            exports_1("SideScrollSchedule", SideScrollSchedule);
        }
    }
});
