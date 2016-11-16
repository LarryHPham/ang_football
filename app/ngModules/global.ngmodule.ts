import { AppComponent }  from '../app-component/app.component';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FooterComponent } from "../ui-modules/footer/footer.component";
import { FooterService } from '../services/footer.service';
import { HeaderComponent } from "../ui-modules/header/header.component";
import { HamburgerMenuComponent, MenuData } from '../ui-modules/hamburger-menu/hamburger-menu.component';
import { HamburgerDeliveryService } from '../services/hamburger-delivery.service';

//globals
import { GlobalFunctions } from '../global/global-functions';
import { GlobalSettings } from "../global/global-settings";

//services

//pipes
import { NaValuePipe } from "../fe-core/pipes/na.pipe";

//components
import { Tabs } from "../fe-core/components/tabs/tabs.component";
import { Tab } from "../fe-core/components/tabs/tab.component";
import { CircleButton } from "../fe-core/components/buttons/circle/circle.button";
import { Carousel } from "../fe-core/components/carousels/carousel.component";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { ScrollableContent } from "../fe-core/components/scrollable-content/scrollable-content.component";

// import { ScrollerFunctions } from '../global/scroller-functions';
// import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
// import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
// import { GlobalFunctions } from "../global/global-functions";
// import { GeoLocation } from "../global/global-service";
// /*** COMPONENTS ***/
import {PartnerHomePage} from '../webpages/partner-home-page/partner-home-page';
import { CustomTable } from '../fe-core/components/custom-table/custom-table.component';
import { SortDropdown } from '../fe-core/components/custom-table/sort-dropdown.component';
import { TableCell } from '../fe-core/components/custom-table/table-cell.component';
import { TableHeader } from '../fe-core/components/custom-table/table-header.component';
import { NoDataBox } from '../fe-core/components/error/data-box/data-box.component';
import { DropdownDirectoryComponent } from '../fe-core/components/dropdown-directory/dropdown-directory.component';
import {SideScroll} from '../fe-core/components/carousels/side-scroll/side-scroll.component';

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
import { ResponsiveWidget } from "../fe-core/components/responsive-widget/responsive-widget.component";
import { SidekickWrapper } from '../fe-core/components/sidekick-wrapper/sidekick-wrapper.component';
// import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";
// import { FooterComponent } from "../fe-core/components/footer/footer.component";
// import { ArticleBlockComponent } from "../fe-core/components/article-block/article-block.component";
// import { DropdownComponent } from "../fe-core/components/dropdown/dropdown.component";
// import { LoadingComponent } from "../fe-core/components/loading/loading.component";
// import { SidekickWrapperAI } from "../fe-core/components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
// import { Larousel } from '../fe-core/components/larousel/larousel';
// import { NewsBox } from '../fe-core/components/news-box/news-box';
// import { LineChartComponent } from '../fe-core/components/line-chart/line-chart.component';
// import { InfoComponent } from '../fe-core/components/page-information/page-information.component';
//
// /*** MODULES ***/
// import { BillboardModule } from "../fe-core/modules/billboard/billboard.module";
// import { ChatterboxModule } from "../fe-core/modules/chatterbox/chatterbox.module";
import { WidgetCarouselModule } from "../fe-core/modules/widget/widget-carousel.module";
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
import {SanitizeScript, SanitizeHtml, SanitizeRUrl, SanitizeStyle} from "../fe-core/pipes/safe.pipe";
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
      //components
      AppComponent,
      CircleImage,
      HoverImage,
      ScrollableContent,
      HeaderComponent,
      FooterComponent,
      CustomTable,
      SortDropdown,
      TableCell,
      TableHeader,
      //pipes
      NaValuePipe,
      NoDataBox,
      DropdownDirectoryComponent,
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
      WidgetCarouselModule,
      SanitizeHtml,
      SanitizeRUrl,
      SanitizeStyle,
      SanitizeScript,
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
      ResponsiveWidget,
      Carousel,
      Tabs,
      Tab,
      SideScroll,
      SidekickWrapper
    ],
    exports: [
      //components
      CircleImage,
      HoverImage,
      ScrollableContent,
      HeaderComponent,
      FooterComponent,
      CustomTable,
      SortDropdown,
      TableCell,
      TableHeader,
      NoDataBox,
      DropdownDirectoryComponent,
      //pipes
      NaValuePipe,
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
      WidgetCarouselModule,
      SanitizeHtml,
      SanitizeRUrl,
      SanitizeStyle,
      SanitizeScript,
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
      ResponsiveWidget,
      Carousel,
      Tabs,
      Tab,
      SideScroll,
      SidekickWrapper
    ],
    providers: [
      // GeoLocation
      // ScrollerFunctions,
      SanitizeScript,
      // VerticalGlobalFunctions,
      GlobalSettings,
      GlobalFunctions,
      FooterService,
      HamburgerDeliveryService
    ]
})
export class GlobalModule { }
