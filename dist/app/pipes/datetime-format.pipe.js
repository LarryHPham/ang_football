System.register(['@angular/core', '../global/global-functions'], function(exports_1, context_1) {
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
    var core_1, global_functions_1;
    var DateTimePipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            }],
        execute: function() {
            DateTimePipe = (function () {
                function DateTimePipe() {
                }
                DateTimePipe.prototype.transform = function (value) {
                    var date = moment(value);
                    return date.format('dddd, ') +
                        global_functions_1.GlobalFunctions.formatAPMonth(date.month()) +
                        date.format(' Do, YYYY') +
                        ' | ' +
                        date.format('hh:mm A') + ' ET';
                };
                DateTimePipe = __decorate([
                    core_1.Pipe({
                        name: 'dateTimeStamp'
                    }), 
                    __metadata('design:paramtypes', [])
                ], DateTimePipe);
                return DateTimePipe;
            }());
            exports_1("DateTimePipe", DateTimePipe);
        }
    }
});
