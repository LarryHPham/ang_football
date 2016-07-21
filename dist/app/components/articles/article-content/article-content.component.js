System.register(['@angular/core', "../profileData/profileData.component", "../billboard/billboard.component", '../../../pipes/safe.pipe'], function(exports_1, context_1) {
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
    var core_1, profileData_component_1, billboard_component_1, safe_pipe_1;
    var ArticleContentComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (profileData_component_1_1) {
                profileData_component_1 = profileData_component_1_1;
            },
            function (billboard_component_1_1) {
                billboard_component_1 = billboard_component_1_1;
            },
            function (safe_pipe_1_1) {
                safe_pipe_1 = safe_pipe_1_1;
            }],
        execute: function() {
            ArticleContentComponent = (function () {
                function ArticleContentComponent() {
                }
                ArticleContentComponent = __decorate([
                    core_1.Component({
                        selector: 'article-content-component',
                        templateUrl: './app/components/articles/article-content/article-content.component.html',
                        directives: [profileData_component_1.ProfileDataComponent, billboard_component_1.BillboardComponent],
                        inputs: ["articleData", "articleType", "articleSubType", "imageLinks", "teamId", "partnerId"],
                        pipes: [safe_pipe_1.SanitizeHtml]
                    }), 
                    __metadata('design:paramtypes', [])
                ], ArticleContentComponent);
                return ArticleContentComponent;
            }());
            exports_1("ArticleContentComponent", ArticleContentComponent);
        }
    }
});
