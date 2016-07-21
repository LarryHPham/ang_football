System.register(['@angular/core', '../../pipes/stat-hyphen.pipe', '../../pipes/safe.pipe'], function(exports_1, context_1) {
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
    var core_1, stat_hyphen_pipe_1, safe_pipe_1;
    var ScoreBoard;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (stat_hyphen_pipe_1_1) {
                stat_hyphen_pipe_1 = stat_hyphen_pipe_1_1;
            },
            function (safe_pipe_1_1) {
                safe_pipe_1 = safe_pipe_1_1;
            }],
        execute: function() {
            ScoreBoard = (function () {
                function ScoreBoard() {
                    this.pixel = 27; // amount of pixels the display will shift when clicking on carousel buttons
                }
                ScoreBoard.prototype.left = function () {
                    if (this.offset > 0) {
                        this.offset--;
                    }
                    this.scrollScore = "-" + (this.pixel * this.offset) + "px";
                };
                ScoreBoard.prototype.right = function () {
                    if (this.offset < (this.scoreBoard.scoreArray.length - 9)) {
                        this.offset++;
                    }
                    this.scrollScore = "-" + (this.pixel * this.offset) + "px";
                };
                ScoreBoard.prototype.ngOnInit = function () {
                    this.offset = 0; //sets the offset to 0
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ScoreBoard.prototype, "scoreBoard", void 0);
                ScoreBoard = __decorate([
                    core_1.Component({
                        selector: 'score-board',
                        templateUrl: './app/components/score-board/score-board.component.html',
                        directives: [],
                        pipes: [stat_hyphen_pipe_1.StatHyphenValuePipe, safe_pipe_1.SanitizeStyle],
                    }), 
                    __metadata('design:paramtypes', [])
                ], ScoreBoard);
                return ScoreBoard;
            }());
            exports_1("ScoreBoard", ScoreBoard);
        }
    }
});
