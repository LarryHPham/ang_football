//spits out router-outlet for our deepdive websites
import { AppComponent }  from '../app-component/app.component';

import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ScrollerFunctions } from '../global/scroller-functions';
// import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
// import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
// import { GlobalSettings } from "../global/global-settings";
// import { GlobalFunctions } from "../global/global-functions";
// import { GeoLocation } from "../global/global-service";
// /*** COMPONENTS ***/
// import { SectionFrontTopNav } from '../fe-core/components/section-front-top-nav/section-front-top-nav.component';
// import { HeaderComponent } from "../fe-core/components/header/header.component";
// import { SectionNameComponent } from "../fe-core/components/section-name/section-name.component";
// import { Search } from "../fe-core/components/search/search.component";
// import { HamburgerMenuComponent, MenuData } from '../fe-core/components/hamburger-menu/hamburger-menu.component';
// import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
// import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
// import { HoverImage } from "../fe-core/components/images/hover-image";
// import { ImagesMedia } from "../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
// import { CircleButton } from "../fe-core/components/buttons/circle/circle.button";
// import { ResponsiveWidget } from "../fe-core/components/responsive-widget/responsive-widget.component";
//
// import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";
// import { FooterComponent } from "../fe-core/components/footer/footer.component";
// import { ArticleBlockComponent } from "../fe-core/components/article-block/article-block.component";
// import { DropdownComponent } from "../fe-core/components/dropdown/dropdown.component";
// import { LoadingComponent } from "../fe-core/components/loading/loading.component";
// import { ScrollableContent } from "../fe-core/components/scrollable-content/scrollable-content.component";
// import { SidekickWrapperAI } from "../fe-core/components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
// import { Larousel } from '../fe-core/components/larousel/larousel';
// import { NewsBox } from '../fe-core/components/news-box/news-box';
// import { LineChartComponent } from '../fe-core/components/line-chart/line-chart.component';
// import { InfoComponent } from '../fe-core/components/page-information/page-information.component';
//
// /*** MODULES ***/
// import { BillboardModule } from "../fe-core/modules/billboard/billboard.module";
// import { ChatterboxModule } from "../fe-core/modules/chatterbox/chatterbox.module";
// import { WidgetCarouselModule } from "../fe-core/modules/widget/widget-carousel.module";
// import { WidgetModule } from "../fe-core/modules/widget/widget.module";
// import { SearchBoxModule } from "../fe-core/modules/search-box-module/search-box-module.module";
// import { DeepDiveRecommendation } from "../fe-core/modules/deep-dive-recommendation/deep-dive-recommendation.module";
//
// /*** WEBPAGES ***/
// import { AboutUsPage } from "../webpages/aboutus/aboutus";
// import { PrivacyPolicy } from "../webpages/privacy-policy/privacy-policy";
// import { TermOfService } from "../webpages/term-of-service/term-of-service";
//
// //Pipes
// import {SanitizeScript, SanitizeHtml, SanitizeRUrl, SanitizeStyle} from "../fe-core/pipes/safe.pipe";
//
// //router
import { routing } from '../router/app.routing';
// import {InputBar} from "../fe-core/components/input-bar/input-bar.component";
// import {ArticleSearchBar} from "../fe-core/components/search-bar-article/search-bar-article.component";
//
//
@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      routing,
      FormsModule,
      ReactiveFormsModule
    ],
    declarations: [
      AppComponent,
      // SectionFrontTopNav,
      // HeaderComponent,
      // Search,
      // HamburgerMenuComponent,
      // HoverImage,
      // CircleImage,
      // RectangleImage,
      // FooterComponent,
      // ModuleHeader,
      // ImagesMedia,
      // CircleButton,
      // LoadingComponent,
      // SearchBoxModule,
      // SidekickWrapperAI,
      // WidgetModule,
      // WidgetCarouselModule,
      // SanitizeHtml,
      // SanitizeRUrl,
      // SanitizeStyle,
      // SanitizeScript,
      // ScrollableContent,
      // DropdownComponent,
	    // Larousel,
      // NewsBox,
      // LineChartComponent,
      // SectionNameComponent,
      // ArticleBlockComponent,
      // DeepDiveRecommendation,
      // InputBar,
      // ArticleSearchBar,
      // BillboardModule,
      // AboutUsPage,
      // PrivacyPolicy,
      // TermOfService,
      // InfoComponent,
      // ChatterboxModule,
      // ResponsiveWidget
    ],
    exports: [
      // SectionFrontTopNav,
      // HeaderComponent,
      // HoverImage,
      // CircleImage,
      // RectangleImage,
      // FooterComponent,
      // ModuleHeader,
      // ImagesMedia,
      // CircleButton,
      // LoadingComponent,
      // SearchBoxModule,
      // SidekickWrapperAI,
      // WidgetModule,
      // WidgetCarouselModule,
      // ScrollableContent,
      // SanitizeHtml,
      // SanitizeRUrl,
      // SanitizeStyle,
      // SanitizeScript,
      // Larousel,
      // DropdownComponent,
      // Search,
      // NewsBox,
      // LineChartComponent,
      // SectionNameComponent,
      // ArticleBlockComponent,
      // DeepDiveRecommendation,
      // InputBar,
      // ArticleSearchBar,
      // BillboardModule,
      // AboutUsPage,
      // PrivacyPolicy,
      // TermOfService,
      // InfoComponent,
      // ChatterboxModule,
      // ResponsiveWidget
    ],
    providers: [
      // VerticalGlobalFunctions,
      // ScrollerFunctions,
      // SanitizeScript,
      // GlobalSettings,
      // GlobalFunctions,
      // GeoLocation
    ]
})
export class GlobalModule { }