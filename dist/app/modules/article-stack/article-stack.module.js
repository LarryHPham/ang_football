System.register(['@angular/core', '../../components/stack-rows/stack-rows.component', '../../components/article-stacktop/article-stacktop.component'], function(exports_1, context_1) {
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
    var core_1, stack_rows_component_1, article_stacktop_component_1;
    var ArticleStackModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (stack_rows_component_1_1) {
                stack_rows_component_1 = stack_rows_component_1_1;
            },
            function (article_stacktop_component_1_1) {
                article_stacktop_component_1 = article_stacktop_component_1_1;
            }],
        execute: function() {
            ArticleStackModule = (function () {
                function ArticleStackModule() {
                }
                ArticleStackModule.prototype.ngOnInit = function () {
                };
                ArticleStackModule = __decorate([
                    core_1.Component({
                        selector: 'article-stack-module',
                        templateUrl: './app/modules/article-stack/article-stack.module.html',
                        directives: [stack_rows_component_1.StackRowsComponent, article_stacktop_component_1.ArticleStacktopComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], ArticleStackModule);
                return ArticleStackModule;
            }());
            exports_1("ArticleStackModule", ArticleStackModule);
        }
    }
});
