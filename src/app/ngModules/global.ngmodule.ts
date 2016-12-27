import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent }  from '../app-component/app.component';

//router
import { routing } from '../router/app.routing';

//globals
import { GlobalFunctions } from '../global/global-functions';
import { GlobalSettings } from "../global/global-settings";
import { ScrollerFunctions } from '../global/scroller-functions';
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
import { ApiService } from '../global/shared/api.service';
import { CacheService } from '../global/shared/cache.service';
import { ModelService } from '../global/shared/model/model.service';

//services
// import { HamburgerDeliveryService } from '../services/hamburger-delivery.service';
// import { FooterService } from '../services/footer.service';
// import { BoxScoresService } from "../services/box-scores.service";
// import { SchedulesService } from "../services/schedules.service";
import { GeoLocation } from "../global/global-service";
// import { ImagesService } from "../services/carousel.service";
// import { ListOfListsService } from "../services/list-of-lists.service";
// import { SeoService } from "../seo.service";
// import { DirectoryService } from "../services/directory.service";
// import { SearchService } from "../services/search.service";
import { AboutUsService } from "../services/about-us.service";

//pipes
import { NaValuePipe } from "../fe-core/pipes/na.pipe";
import { SanitizeScript, SanitizeHtml, SanitizeRUrl, SanitizeStyle } from "../fe-core/pipes/safe.pipe";
import { StatHyphenValuePipe } from "../fe-core/pipes/stat-hyphen.pipe";
import { PossessivePipe } from "../fe-core/pipes/possessive.pipe";

//pages
import { AboutUsPage } from "../webpages/about-us-page/about-us.page";
// import { ContactUsPage } from "../webpages/contactus-page/contactus.page";
import { DisclaimerPage } from "../webpages/disclaimer-page/disclaimer.page";
// import { DirectoryPage } from "../webpages/directory-page/directory.page";
// import { ErrorPage } from "../webpages/error-page/error-page.page";
// import { SearchPage } from "../webpages/search-page/search.page";

//modules
// import { WidgetModule } from "../ui-modules/widget/widget.module";
// import { BoxScoresModule } from "../fe-core/modules/box-scores/box-scores.module";
// import { BillboardModule } from "../fe-core/modules/billboard/billboard.module";
// import { WidgetCarouselModule } from "../ui-modules/widget/widget-carousel.module";
// import { DeepDiveRecommendation } from "../fe-core/modules/deep-dive-recommendation/deep-dive-recommendation.module";
// import { ListOfListsModule } from "../fe-core/modules/list-of-lists/list-of-lists.module";
// import { CommentModule } from "../fe-core/modules/comment/comment.module";
// import { DirectoryModule } from "../fe-core/modules/directory/directory.module";
// import { DirectoryPagination } from "../fe-core/modules/directory/directory-pagination.component";
// import { SearchPageModule } from "../ui-modules/search-page/search-page.module";

//components
// import { Tabs } from "../fe-core/components/tabs/tabs.component";
// import { Tab } from "../fe-core/components/tabs/tab.component";
// import { CircleButton } from "../fe-core/components/buttons/circle/circle.button";
// import { Carousel } from "../fe-core/components/carousels/carousel.component";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { ErrorComponent } from "../fe-core/components/error/error.component";
// import { SidekickWrapper } from "../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";
import { ModuleFooter } from "../fe-core/components/module-footer/module-footer.component";
// import { VideoStackComponent } from "../fe-core/components/video-stack/video-stack.component";
// import { ResponsiveWidget } from "../ui-modules/responsive-widget/responsive-widget.component";
import { ScrollableContent } from "../fe-core/components/scrollable-content/scrollable-content.component";
import { LoadingComponent } from "../fe-core/components/loading/loading.component";
// import { HeaderComponent } from "../ui-modules/header/header.component";
// import { HamburgerMenuComponent, MenuData } from "../ui-modules/hamburger-menu/hamburger-menu.component";
// import { FooterComponent } from "..s/ui-modules/footer/footer.component";
// import { CalendarCarousel } from "../fe-core/components/carousels/calendar/calendar-carousel.component";
// import { GameInfo } from "../fe-core/components/game-info/game-info.component";
// import { GameArticle } from "../fe-core/components/game-article/game-article.component";
// import { BoxArticleComponent } from "../fe-core/components/box-article/box-article.component";
// import { DatePicker } from "../fe-core/components/date-picker/date-picker.component";
// import { DropdownComponent } from "../fe-core/components/dropdown/dropdown.component";
// import { CustomTable } from "../fe-core/components/custom-table/custom-table.component";
// import { TableHeader } from '../fe-core/components/custom-table/table-header.component';
// import { TableCell } from '../fe-core/components/custom-table/table-cell.component';
// import { NoDataBox } from '../fe-core/components/error/data-box/data-box.component';
// import { SliderCarousel } from "../fe-core/components/carousels/slider-carousel/slider-carousel.component";
// import { ComplexInnerHtml } from "../fe-core/components/complex-inner-html/complex-inner-html.component";
// import { PaginationFooter } from "../fe-core/components/pagination-footer/pagination-footer.component";
// import { DropdownDirectoryComponent } from '../fe-core/components/dropdown-directory/dropdown-directory.component';
// import { SideScroll } from '../fe-core/components/carousels/side-scroll/side-scroll.component';
// import { ArticleBlockComponent } from "../fe-core/components/article-block/article-block.component";
// import { Larousel } from '../fe-core/components/larousel/larousel';
// import { NewsBox } from '../fe-core/components/news-box/news-box';
// import { LineChartComponent } from '../fe-core/components/line-chart/line-chart.component';
// import { ImagesMedia } from "../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
// import { ListOfListsItem } from "../fe-core/components/list-of-lists-item/list-of-lists-item.component";
import { BackTabComponent } from "../fe-core/components/backtab/backtab.component";
import { TitleComponent } from "../fe-core/components/title/title.component";
// import { ContactUsComponent } from "../fe-core/components/contactus/contactus.component";
// import { Search } from "../ui-modules/search/search.component";
import { ArticleScheduleComponent } from "../fe-core/components/articles/article-schedule/article-schedule.component";
// import { ScoreBoard } from "../fe-core/components/score-board/score-board.component";
// import { LoadMoreButtonComponent } from "../fe-core/components/load-more-button/load-more-button.component";

const MODULES = [
  // put modules here
  CommonModule,
  HttpModule,
  routing,
  FormsModule,
  ReactiveFormsModule,
];

const PAGEMODULES = [
  // put page modules here
  AboutUsPage,
  // ContactUsPage,
  DisclaimerPage,
  // DirectoryPage,
  // ErrorPage,
  // SearchPage,
]

const COREMODULES = [
  // put core modules here
  // WidgetModule,
  // BoxScoresModule,
  // BillboardModule,
  // DeepDiveRecommendation,
  // WidgetCarouselModule,
  // BillboardModule,
  // ListOfListsModule,
  // CommentModule,
  // DirectoryModule,
  // SearchPageModule,
]

const COMPONENTS = [
  // put shared components here
  AppComponent,
  CircleImage,
  HoverImage,
  RectangleImage,
  ScrollableContent,
  ErrorComponent,
  LoadingComponent,
  // SidekickWrapper,
  ModuleHeader,
  ModuleFooter,
  // VideoStackComponent,
  // CalendarCarousel,
  // GameInfo,
  // GameArticle,
  // BoxArticleComponent,
  // DatePicker,
  // ResponsiveWidget,
  // DropdownComponent,
  // CustomTable,
  // Tab,
  // Tabs,
  // Carousel,
  // TableHeader,
  // TableCell,
  // NoDataBox,
  // CircleButton,
  // ArticleBlockComponent,
  // ResponsiveWidget,
  // SliderCarousel,
  // ComplexInnerHtml,
  // PaginationFooter,
  // HeaderComponent,
  // HamburgerMenuComponent,
  // FooterComponent,
  // DropdownDirectoryComponent,
  // Larousel,
  // NewsBox,
  // LineChartComponent,
  // ArticleBlockComponent,
  // DeepDiveRecommendation,
  // ResponsiveWidget,
  // SideScroll,
  // ImagesMedia,
  // ListOfListsItem,
  BackTabComponent,
  TitleComponent,
  // ContactUsComponent,
  // DirectoryPagination,
  // Search,
  ArticleScheduleComponent,
  // ScoreBoard,
  // LoadMoreButtonComponent
];

const PIPES = [
  // put pipes here
  NaValuePipe,
  SanitizeHtml,
  NaValuePipe,
  SanitizeHtml,
  SanitizeRUrl,
  SanitizeStyle,
  SanitizeScript,
  StatHyphenValuePipe,
  PossessivePipe
];

const PROVIDERS = [
  // put providers components here
  SanitizeScript,
  GlobalSettings,
  GlobalFunctions,
  ModelService,
  ApiService,
  CacheService,
  // FooterService,
  // ScrollerFunctions,
  // BoxScoresService,
  // SchedulesService,
  GeoLocation,
  VerticalGlobalFunctions,
  // HamburgerDeliveryService,
  // ImagesService,
  // ListOfListsService,
  // SeoService,
  // DirectoryService,
  // SearchService,
  AboutUsService
]

@NgModule({
    imports: [
      ...MODULES
    ],
    declarations: [
      ...PAGEMODULES,
      ...COREMODULES,
      ...COMPONENTS,
      ...PIPES
    ],
    exports: [
      ...PAGEMODULES,
      ...COREMODULES,
      ...COMPONENTS,
      ...PIPES
    ],
    providers: [
      ...PROVIDERS
    ]
})
export class GlobalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GlobalModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
