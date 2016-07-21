System.register(['@angular/core', '../../components/module-header/module-header.component', '../../components/carousels/calendar/calendarCar.component', '../../components/articles/article-schedule/article-schedule.component', '../../components/game-info/game-info.component', '../../components/score-board/score-board.component', '../../components/game-article/game-article.component', '../../components/scrollable-content/scrollable-content.component'], function(exports_1, context_1) {
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
    var core_1, module_header_component_1, calendarCar_component_1, article_schedule_component_1, game_info_component_1, score_board_component_1, game_article_component_1, scrollable_content_component_1;
    var BoxScoresModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            },
            function (calendarCar_component_1_1) {
                calendarCar_component_1 = calendarCar_component_1_1;
            },
            function (article_schedule_component_1_1) {
                article_schedule_component_1 = article_schedule_component_1_1;
            },
            function (game_info_component_1_1) {
                game_info_component_1 = game_info_component_1_1;
            },
            function (score_board_component_1_1) {
                score_board_component_1 = score_board_component_1_1;
            },
            function (game_article_component_1_1) {
                game_article_component_1 = game_article_component_1_1;
            },
            function (scrollable_content_component_1_1) {
                scrollable_content_component_1 = scrollable_content_component_1_1;
            }],
        execute: function() {
            BoxScoresModule = (function () {
                function BoxScoresModule() {
                    // private moduleHeight: string;
                    this.dateEmit = new core_1.EventEmitter();
                    this.liveArray = new core_1.EventEmitter();
                    this.gameNum = 0;
                }
                BoxScoresModule.prototype.dateTransfer = function (event) {
                    this.dateEmit.next(event);
                };
                BoxScoresModule.prototype.changeGame = function (num) {
                    this.gameNum = num;
                };
                BoxScoresModule.prototype.ngOnChanges = function () {
                    if (document.getElementById('box-header') != null && this.scroll && this.maxHeight != null && this.boxScores != null) {
                        var boxHeader = document.getElementById('box-header').offsetHeight;
                        //only for mlb page but subtract the mod title and calendar height from what was sent in
                        if (this.maxHeight != 'auto') {
                            this.maxHeight -= boxHeader;
                            this.heightStyle = this.maxHeight + "px";
                        }
                        else {
                            this.scroll = false;
                            this.heightStyle = 'auto';
                        }
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BoxScoresModule.prototype, "calendarParams", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BoxScoresModule.prototype, "boxScores", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], BoxScoresModule.prototype, "maxHeight", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], BoxScoresModule.prototype, "scroll", void 0);
                BoxScoresModule = __decorate([
                    core_1.Component({
                        selector: 'box-scores',
                        templateUrl: './app/modules/box-scores/box-scores.module.html',
                        directives: [scrollable_content_component_1.ScrollableContent, game_article_component_1.GameArticle, score_board_component_1.ScoreBoard, game_info_component_1.GameInfo, article_schedule_component_1.ArticleScheduleComponent, calendarCar_component_1.CalendarCarousel, module_header_component_1.ModuleHeader],
                        providers: [],
                        outputs: ['dateEmit'],
                    }), 
                    __metadata('design:paramtypes', [])
                ], BoxScoresModule);
                return BoxScoresModule;
            }());
            exports_1("BoxScoresModule", BoxScoresModule);
        }
    }
});
