System.register(['@angular/core', '@angular/platform-browser'], function(exports_1, context_1) {
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
    var core_1, platform_browser_1;
    var BillboardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            BillboardComponent = (function () {
                function BillboardComponent(_sanitizer) {
                    this._sanitizer = _sanitizer;
                }
                BillboardComponent.prototype.ngOnInit = function () {
                    if (this.partnerId == null) {
                        this.dangerousBillBoardUrl = "http://w1.synapsys.us/widgets/sports/ai_billboard.html?%7B%22team%22%3A%22" + this.teamId + "%22%2C%22remn%22%3A%22true%22%7D";
                    }
                    else {
                        this.dangerousBillBoardUrl = "http://w1.synapsys.us/widgets/sports/ai_billboard.html?%7B%22team%22%3A%22" + this.teamId + "%22%2C%22remn%22%3A%22false%22%2C%22dom%22%3A%22" + this.partnerId + "%22%7D";
                    }
                    this.safeBillBoardUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.dangerousBillBoardUrl);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BillboardComponent.prototype, "partnerId", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BillboardComponent.prototype, "teamId", void 0);
                BillboardComponent = __decorate([
                    core_1.Component({
                        selector: 'billboard-component',
                        templateUrl: './app/components/articles/billboard/billboard.component.html'
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], BillboardComponent);
                return BillboardComponent;
            }());
            exports_1("BillboardComponent", BillboardComponent);
        }
    }
});
