import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../router/app.routing';
import { GlobalModule } from './global.ngmodule';
import { FormsModule } from '@angular/forms';

// //providers
import { DeepDiveService } from '../services/deep-dive.service';
// import { BoxScoresService } from '../services/box-scores.service';

// import { SideScrollSchedule } from '../ui-modules/side-scroll-schedules/side-scroll-schedules.module';
// import { ScheduleBox } from '../fe-core/components/schedule-box/schedule-box.component';

//deep-dive blocks
import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive.page";
// import { CarouselDiveModule } from '../fe-core/modules/carousel-dive/carousel-dive.module';
// import { DeepDiveVideoModule } from '../fe-core/modules/video-deep-dive/video-deep-dive.module';
// import { DeepDiveBlock1 } from '../ui-modules/deep-dive-blocks/deep-dive-block-1/deep-dive-block-1.module';
// import { DeepDiveBlock2 } from '../ui-modules/deep-dive-blocks/deep-dive-block-2/deep-dive-block-2.module';
// import { DeepDiveBlock3 } from '../ui-modules/deep-dive-blocks/deep-dive-block-3/deep-dive-block-3.module';
// import { DeepDiveBlock4 } from '../ui-modules/deep-dive-blocks/deep-dive-block-4/deep-dive-block-4.module';

// import { ArticleStackModule } from '../fe-core/modules/article-stack/article-stack.module';
// import { TileStackModule } from '../fe-core/modules/tile-stack/tile-stack.module';
// import { StackRowsComponent } from '../fe-core/components/stack-rows/stack-rows.component';
// import { ArticleStacktopComponent } from '../fe-core/components/article-stacktop/article-stacktop.component';
// import { ArticleStack1Module } from '../fe-core/modules/article-stack-style-1/article-stack.module';
// import { ArticleStack2Module } from '../fe-core/modules/article-stack-style-2/article-stack.module';

// //pipes
// import { StatHyphenValuePipe } from '../fe-core/pipes/stat-hyphen.pipe';

//article page blocks
// import { ArticlePages } from "../webpages/article-pages/article-pages.page";
// import { ArticleDataService } from "../services/article-page-service";
// import { ShareLinksComponent } from "../fe-core/components/articles/share-links/share-links.component";
// import { SidekickWrapperAI } from "../fe-core/components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
// import { ArticleContentComponent } from "../fe-core/components/articles/article-content/article-content.component";
// import { RecommendationsComponent } from "../fe-core/components/articles/recommendations/recommendations.component";
// import { DisqusComponent } from "../fe-core/components/articles/disqus/disqus.component";
// import { TrendingComponent } from "../fe-core/components/articles/trending/trending.component";
// import { SidekickContainerComponent } from "../fe-core/components/articles/sidekick-container/sidekick-container.component";
// import { ProfileDataComponent } from "../fe-core/components/articles/profile-data/profile-data.component";
// import { BillboardComponent } from "../fe-core/components/articles/billboard/billboard.component";
// import { HeadlineDataService } from "../services/headline-module-service";

const MODULES = [
  // put modules here
  CommonModule,
  GlobalModule,
  routing,
  FormsModule
];

const PAGEMODULES = [
  // put page modules here
  DeepDivePage,
  // ArticlePages,
]

const COREMODULES = [
  // put core modules here
  // TileStackModule,
  // DeepDiveBlock1,
  // DeepDiveBlock2,
  // DeepDiveBlock3,
  // DeepDiveBlock4,
  // SideScrollSchedule,
  // ScheduleBox,
  // ArticleStackModule,
  // ArticleStack1Module,
  // ArticleStack2Module,
  // DeepDiveVideoModule,
]

const COMPONENTS = [
  // put shared components here
  // StackRowsComponent,
  // ArticleStacktopComponent,
  // ShareLinksComponent,
  // SidekickWrapperAI,
  // ArticleContentComponent,
  // RecommendationsComponent,
  // DisqusComponent,
  // TrendingComponent,
  // SidekickContainerComponent,
  // ProfileDataComponent,
  // BillboardComponent
];

const PIPES = [
  // put pipes here

];

const PROVIDERS = [
  // put providers components here
  DeepDiveService,
  // ArticleDataService,
  // HeadlineDataService,
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
export class DeepDiveNgModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DeepDiveNgModule,
      providers: [
        ...PROVIDERS
      ]
    };
  }
}
