System.register(['@angular/core', '../../components/module-header/module-header.component'], function(exports_1, context_1) {
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
    var core_1, module_header_component_1;
    var CommentModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (module_header_component_1_1) {
                module_header_component_1 = module_header_component_1_1;
            }],
        execute: function() {
            CommentModule = (function () {
                function CommentModule() {
                    this.headerInfo = {
                        moduleTitle: "Comments - [Profile Name]",
                        hasIcon: false,
                        iconClass: ""
                    };
                }
                CommentModule.prototype.ngOnChanges = function () {
                    var profileName = this.profileName ? this.profileName : "[Profile Name]";
                    this.headerInfo.moduleTitle = "Comments - " + profileName;
                };
                CommentModule.prototype.ngOnInit = function () {
                    var script = document.createElement("script");
                    // DisQus Plugin
                    script.innerHTML = (function (d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) {
                            DISQUS.reset({
                                reload: true,
                                config: function () {
                                    this.page.identifier = (window.location.pathname + " ").replace("/", " ");
                                    this.page.url = window.location.href + "#!newthread";
                                }
                            });
                        }
                        else {
                            js = d.createElement(s);
                            js.id = id;
                            js.src = "//homerunloyal.disqus.com/embed.js";
                            fjs.parentNode.insertBefore(js, fjs);
                        }
                    }(document, 'script', 'disqusJS'));
                    document.body.appendChild(script);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], CommentModule.prototype, "profileName", void 0);
                CommentModule = __decorate([
                    core_1.Component({
                        selector: 'comment-module',
                        templateUrl: './app/modules/comment/comment.module.html',
                        directives: [module_header_component_1.ModuleHeader],
                        providers: [],
                    }), 
                    __metadata('design:paramtypes', [])
                ], CommentModule);
                return CommentModule;
            }());
            exports_1("CommentModule", CommentModule);
        }
    }
});
