System.register(['@angular/core', '@angular/router-deprecated', "../../components/carousels/images-media-carousel/images-media-carousel.component", "../../components/articles/shareLinks/shareLinks.component", "../../components/articles/recommendations/recommendations.component", "../../components/articles/syndicated-trending/syndicated-trending.component", "../../components/articles/disqus/disqus.component", "../../components/loading/loading.component", '../../services/deep-dive.service', "../../components/sidekick-wrapper-ai/sidekick-wrapper-ai.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, images_media_carousel_component_1, shareLinks_component_1, recommendations_component_1, syndicated_trending_component_1, disqus_component_1, loading_component_1, deep_dive_service_1, sidekick_wrapper_ai_component_1, responsive_widget_component_1;
    var SyndicatedArticlePage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (images_media_carousel_component_1_1) {
                images_media_carousel_component_1 = images_media_carousel_component_1_1;
            },
            function (shareLinks_component_1_1) {
                shareLinks_component_1 = shareLinks_component_1_1;
            },
            function (recommendations_component_1_1) {
                recommendations_component_1 = recommendations_component_1_1;
            },
            function (syndicated_trending_component_1_1) {
                syndicated_trending_component_1 = syndicated_trending_component_1_1;
            },
            function (disqus_component_1_1) {
                disqus_component_1 = disqus_component_1_1;
            },
            function (loading_component_1_1) {
                loading_component_1 = loading_component_1_1;
            },
            function (deep_dive_service_1_1) {
                deep_dive_service_1 = deep_dive_service_1_1;
            },
            function (sidekick_wrapper_ai_component_1_1) {
                sidekick_wrapper_ai_component_1 = sidekick_wrapper_ai_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            SyndicatedArticlePage = (function () {
                function SyndicatedArticlePage(_params, _router, _deepdiveservice) {
                    this._params = _params;
                    this._router = _router;
                    this._deepdiveservice = _deepdiveservice;
                    this.widgetPlace = "widgetForPage";
                    this.eventID = _params.get('eventID');
                    this.articleType = _params.get('articleType');
                    if (this.articleType == "story") {
                        this.getDeepDiveArticle(this.eventID);
                    }
                    else {
                        this.getDeepDiveVideo(this.eventID);
                    }
                    this.getRecomendationData();
                }
                SyndicatedArticlePage.prototype.getDeepDiveArticle = function (articleID) {
                    var _this = this;
                    this._deepdiveservice.getDeepDiveArticleService(articleID).subscribe(function (data) {
                        if (data.data.imagePath == null || data.data.imagePath == undefined || data.data.imagePath == "") {
                            _this.imageData = ["/app/public/stockphoto_bb_1.jpg", "/app/public/stockphoto_bb_2.jpg"];
                        }
                        else {
                            _this.imageData = ["https://prod-sports-images.synapsys.us" + data.data.imagePath, "/app/public/stockphoto_bb_2.jpg"];
                        }
                        _this.articleData = data.data;
                    });
                };
                SyndicatedArticlePage.prototype.getDeepDiveVideo = function (articleID) {
                    var _this = this;
                    this._deepdiveservice.getDeepDiveVideoService(articleID).subscribe(function (data) {
                        _this.articleData = data.data[0];
                        _this.iframeUrl = _this.articleData.videoLink;
                    });
                };
                SyndicatedArticlePage.prototype.getRecomendationData = function () {
                    var _this = this;
                    this._deepdiveservice.getAiArticleData()
                        .subscribe(function (data) {
                        _this.recomendationData = _this._deepdiveservice.transformToRecArticles(data);
                        _this.recomendationData = [_this.recomendationData[0]];
                    });
                };
                SyndicatedArticlePage.prototype.ngOnInit = function () {
                };
                SyndicatedArticlePage = __decorate([
                    core_1.Component({
                        selector: 'syndicated-article-page',
                        templateUrl: './app/webpages/syndicated-article-page/syndicated-article-page.page.html',
                        directives: [
                            sidekick_wrapper_ai_component_1.SidekickWrapperAI,
                            router_deprecated_1.ROUTER_DIRECTIVES,
                            images_media_carousel_component_1.ImagesMedia,
                            shareLinks_component_1.ShareLinksComponent,
                            recommendations_component_1.RecommendationsComponent,
                            disqus_component_1.DisqusComponent,
                            loading_component_1.LoadingComponent,
                            syndicated_trending_component_1.SyndicatedTrendingComponent,
                            responsive_widget_component_1.ResponsiveWidget
                        ],
                        providers: [deep_dive_service_1.DeepDiveService],
                    }), 
                    __metadata('design:paramtypes', [router_deprecated_1.RouteParams, router_deprecated_1.Router, deep_dive_service_1.DeepDiveService])
                ], SyndicatedArticlePage);
                return SyndicatedArticlePage;
            }());
            exports_1("SyndicatedArticlePage", SyndicatedArticlePage);
        }
    }
});
