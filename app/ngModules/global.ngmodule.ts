import { AppComponent }  from '../app-component/app.component';
import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//router
import { routing } from '../router/app.routing';

//globals
import { GlobalFunctions } from '../global/global-functions';
import { GlobalSettings } from "../global/global-settings";
import { ScrollerFunctions } from '../global/scroller-functions';
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";

//services
import { HamburgerDeliveryService } from '../services/hamburger-delivery.service';
import { FooterService } from '../services/footer.service';
import { BoxScoresService } from "../services/box-scores.service";
import { SchedulesService } from "../services/schedules.service";
import { GeoLocation, PartnerHeader } from "../global/global-service";
import { ImagesService } from "../services/carousel.service";
import { ListOfListsService } from "../services/list-of-lists.service";
import { SeoService } from "../seo.service";
import { DirectoryService } from "../services/directory.service";
import { SearchService } from "../services/search.service";

//pipes
import { NaValuePipe } from "../fe-core/pipes/na.pipe";
import { SanitizeScript, SanitizeHtml, SanitizeRUrl, SanitizeStyle } from "../fe-core/pipes/safe.pipe";
import { StatHyphenValuePipe } from "../fe-core/pipes/stat-hyphen.pipe";
import { PossessivePipe } from "../fe-core/pipes/possessive.pipe";

//pages
import { AboutUsPage } from "../webpages/about-us-page/about-us.page";
import { ContactUsPage } from "../webpages/contactus-page/contactus.page";
import { DisclaimerPage } from "../webpages/disclaimer-page/disclaimer.page";
import { DirectoryPage } from "../webpages/directory-page/directory.page";
import { ErrorPage } from "../webpages/error-page/error-page.page";
import { SearchPage } from "../webpages/search-page/search.page";

//modules
import { WidgetModule } from "../ui-modules/widget/widget.module";
import { BoxScoresModule } from "../fe-core/modules/box-scores/box-scores.module";
import { BillboardModule } from "../fe-core/modules/billboard/billboard.module";
import { WidgetCarouselModule } from "../ui-modules/widget/widget-carousel.module";
import { DeepDiveRecommendation } from "../fe-core/modules/deep-dive-recommendation/deep-dive-recommendation.module";
import { ListOfListsModule } from "../fe-core/modules/list-of-lists/list-of-lists.module";
import { CommentModule } from "../fe-core/modules/comment/comment.module";
import { DirectoryModule } from "../fe-core/modules/directory/directory.module";
import { DirectoryPagination } from "../fe-core/modules/directory/directory-pagination.component";
import { SearchPageModule } from "../fe-core/modules/search-page/search-page.module";

//components
import { Tabs } from "../fe-core/components/tabs/tabs.component";
import { Tab } from "../fe-core/components/tabs/tab.component";
import { CircleButton } from "../fe-core/components/buttons/circle/circle.button";
import { Carousel } from "../fe-core/components/carousels/carousel.component";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { ErrorComponent } from "../fe-core/components/error/error.component";
import { SidekickWrapper } from "../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";
import { ModuleFooter } from "../fe-core/components/module-footer/module-footer.component";
import { VideoStackComponent } from "../fe-core/components/video-stack/video-stack.component";
import { ResponsiveWidget } from "../ui-modules/responsive-widget/responsive-widget.component";
import { ScrollableContent } from "../fe-core/components/scrollable-content/scrollable-content.component";
import { LoadingComponent } from "../fe-core/components/loading/loading.component";
import { HeaderComponent } from "../ui-modules/header/header.component";
import { FooterComponent } from "../ui-modules/footer/footer.component";
import { HamburgerMenuComponent, MenuData } from "../ui-modules/hamburger-menu/hamburger-menu.component";
import { CalendarCarousel } from "../fe-core/components/carousels/calendar/calendar-carousel.component";
import { GameInfo } from "../fe-core/components/game-info/game-info.component";
import { GameArticle } from "../fe-core/components/game-article/game-article.component";
import { BoxArticleComponent } from "../fe-core/components/box-article/box-article.component";
import { DatePicker } from "../fe-core/components/date-picker/date-picker.component";
import { DropdownComponent } from "../fe-core/components/dropdown/dropdown.component";
import { CustomTable } from "../fe-core/components/custom-table/custom-table.component";
import { TableHeader } from '../fe-core/components/custom-table/table-header.component';
import { TableCell } from '../fe-core/components/custom-table/table-cell.component';
import { NoDataBox } from '../fe-core/components/error/data-box/data-box.component';
import { SliderCarousel } from "../fe-core/components/carousels/slider-carousel/slider-carousel.component";
import { ComplexInnerHtml } from "../fe-core/components/complex-inner-html/complex-inner-html.component";
import { PaginationFooter } from "../fe-core/components/pagination-footer/pagination-footer.component";
import { DropdownDirectoryComponent } from '../fe-core/components/dropdown-directory/dropdown-directory.component';
import { SideScroll } from '../fe-core/components/side-scroll/side-scroll.component';
import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { ArticleBlockComponent } from "../fe-core/components/article-block/article-block.component";
import { Larousel } from '../fe-core/components/larousel/larousel';
import { NewsBox } from '../fe-core/components/news-box/news-box';
import { LineChartComponent } from '../fe-core/components/line-chart/line-chart.component';
import { ImagesMedia } from "../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import { ListOfListsItem } from "../fe-core/components/list-of-lists-item/list-of-lists-item.component";
import { BackTabComponent } from "../fe-core/components/backtab/backtab.component";
import { TitleComponent } from "../fe-core/components/title/title.component";
import { ContactUsComponent } from "../fe-core/components/contactus/contactus.component";
import { Search } from "../ui-modules/search/search.component";
import { ArticleScheduleComponent } from "../fe-core/components/articles/article-schedule/article-schedule.component";
import { ScoreBoard } from "../fe-core/components/score-board/score-board.component";


// /*** COMPONENTS ***/
// import {PartnerHomePage} from '../webpages/partner-home-page/partner-home-page';
// import { SortDropdown } from '../fe-core/components/custom-table/sort-dropdown.component';
// import { SectionFrontTopNav } from '../fe-core/components/section-front-top-nav/section-front-top-nav.component';
// import { SectionNameComponent } from "../fe-core/components/section-name/section-name.component";
// import { ImagesMedia } from "../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
// import { SidekickWrapperAI } from "../fe-core/components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
// import { InfoComponent } from '../fe-core/components/page-information/page-information.component';

// /*** MODULES ***/
// import { ChatterboxModule } from "../fe-core/modules/chatterbox/chatterbox.module";
// import { WidgetModule } from "../fe-core/modules/widget/widget.module";
// import { SearchBoxModule } from "../fe-core/modules/search-box-module/search-box-module.module";
//

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
      //pages
      AboutUsPage,
      ContactUsPage,
      DisclaimerPage,
      DirectoryPage,
      ErrorPage,
      SearchPage,

      //modules
      WidgetModule,
      BoxScoresModule,
      BillboardModule,
      DeepDiveRecommendation,
      WidgetCarouselModule,
      BillboardModule,
      ListOfListsModule,
      CommentModule,
      DirectoryModule,
      SearchPageModule,

      //components
      AppComponent,
      CircleImage,
      HoverImage,
      ScrollableContent,
      ErrorComponent,
      LoadingComponent,
      SidekickWrapper,
      ModuleHeader,
      ModuleFooter,
      VideoStackComponent,
      CalendarCarousel,
      GameInfo,
      GameArticle,
      BoxArticleComponent,
      DatePicker,
      ResponsiveWidget,
      DropdownComponent,
      CustomTable,
      Tab,
      Tabs,
      Carousel,
      TableHeader,
      TableCell,
      NoDataBox,
      CircleButton,
      RectangleImage,
      ArticleBlockComponent,
      ResponsiveWidget,
      SliderCarousel,
      ComplexInnerHtml,
      PaginationFooter,
      HeaderComponent,
      FooterComponent,
      DropdownDirectoryComponent,
      Larousel,
      NewsBox,
      LineChartComponent,
      ArticleBlockComponent,
      DeepDiveRecommendation,
      ResponsiveWidget,
      SideScroll,
      ImagesMedia,
      ListOfListsItem,
      BackTabComponent,
      TitleComponent,
      ContactUsComponent,
      DirectoryPagination,
      Search,
      ArticleScheduleComponent,
      ScoreBoard,

      //pipes
      NaValuePipe,
      SanitizeHtml,
      NaValuePipe,
      SanitizeHtml,
      SanitizeRUrl,
      SanitizeStyle,
      SanitizeScript,
      StatHyphenValuePipe,
      HamburgerMenuComponent,
      RectangleImage,
      WidgetCarouselModule,
      PossessivePipe

    ],
    exports: [
      //pages
      AboutUsPage,
      ContactUsPage,
      DisclaimerPage,
      DirectoryPage,
      ErrorPage,
      SearchPage,

      //modules
      WidgetModule,
      BoxScoresModule,
      WidgetCarouselModule,
      BillboardModule,
      DeepDiveRecommendation,
      WidgetCarouselModule,
      BillboardModule,
      ListOfListsModule,
      CommentModule,
      DirectoryModule,
      SearchPageModule,

      //components
      CircleImage,
      HoverImage,
      ScrollableContent,
      ErrorComponent,
      LoadingComponent,
      SidekickWrapper,
      ModuleHeader,
      ModuleFooter,
      VideoStackComponent,
      SidekickWrapper,
      CalendarCarousel,
      GameInfo,
      GameArticle,
      BoxArticleComponent,
      DatePicker,
      ResponsiveWidget,
      DropdownComponent,
      CustomTable,
      Tab,
      Tabs,
      Carousel,
      TableHeader,
      TableCell,
      NoDataBox,
      CircleButton,
      RectangleImage,
      ArticleBlockComponent,
      ResponsiveWidget,
      SliderCarousel,
      ComplexInnerHtml,
      PaginationFooter,
      RectangleImage,
      HeaderComponent,
      FooterComponent,
      DropdownDirectoryComponent,
      HamburgerMenuComponent,
      Larousel,
      NewsBox,
      LineChartComponent,
      ArticleBlockComponent,
      DeepDiveRecommendation,
      ResponsiveWidget,
      SideScroll,
      ImagesMedia,
      ListOfListsItem,
      BackTabComponent,
      TitleComponent,
      ContactUsComponent,
      DirectoryPagination,
      Search,
      ArticleScheduleComponent,
      ScoreBoard,

      //pipes
      NaValuePipe,
      SanitizeHtml,
      NaValuePipe,
      SanitizeHtml,
      SanitizeRUrl,
      SanitizeStyle,
      SanitizeScript,
      StatHyphenValuePipe,
      PossessivePipe

    ],
    providers: [
      SanitizeScript,
      GlobalSettings,
      GlobalFunctions,
      FooterService,
      ScrollerFunctions,
      BoxScoresService,
      SchedulesService,
      GeoLocation,
      PartnerHeader,
      VerticalGlobalFunctions,
      HamburgerDeliveryService,
      ImagesService,
      ListOfListsService,
      SeoService,
      DirectoryService,
      SearchService
    ]
})
export class GlobalModule { }
