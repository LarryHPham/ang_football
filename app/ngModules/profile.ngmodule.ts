import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../router/app.routing';
import { FormsModule } from '@angular/forms';

import { GlobalModule } from './global.ngmodule';

//services
import { ProfileHeaderService } from '../services/profile-header.service';
import { VideoService } from "../services/video.service";
import { StandingsService } from "../services/standings.service";
import { TransactionsService } from "../services/transactions.service";
import { DraftHistoryService } from "../services/draft-history.service";

//pages
import { LeaguePage } from "../webpages/league-page/league.page";

//modules
import { ProfileHeaderModule } from "../fe-core/modules/profile-header/profile-header.module";
import { VideoModule } from "../fe-core/modules/video/video.module";
import { StandingsModule } from "../fe-core/modules/standings/standings.module";
import { SchedulesModule } from "../fe-core/modules/schedules/schedules.module";
import { TransactionsModule } from "../fe-core/modules/transactions/transactions.module";
import { DraftHistoryModule } from "../fe-core/modules/draft-history/draft-history.module";

//components
import { StandingsComponent } from "../fe-core/components/standings/standings.component";
import { SchedulesComponent } from "../fe-core/components/schedules/schedules.component";
import { SchedulesCarousel } from "../fe-core/components/carousels/schedules-carousel/schedules-carousel.component";
import { TransactionsComponent } from "../fe-core/components/transactions/transactions.component";
import { TransactionsListItem } from "../fe-core/components/transactions-list-item/transactions-list-item.component";
import { DraftHistoryComponent } from "../fe-core/components/draft-history/draft-history.component";
import { DetailedListItem } from "../fe-core/components/detailed-list-item/detailed-list-item.component";
import {ArticlesModule} from "../fe-core/modules/articles/articles.module";
import {ArticleSubComponent} from "../fe-core/components/articles/sub-article/sub-article.component";
import {ArticleMainComponent} from "../fe-core/components/articles/main-article/main-article.component";
import {ArticleScheduleComponent} from "../fe-core/components/articles/article-schedule/article-schedule.component";

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    GlobalModule
  ],

  declarations: [
    //pages
    LeaguePage,

    //modules
    ArticlesModule,
    ProfileHeaderModule,
    VideoModule,
    StandingsModule,
    SchedulesModule,
    TransactionsModule,
    DraftHistoryModule,

    //component
    StandingsComponent,
    SchedulesComponent,
    SchedulesCarousel,
    TransactionsComponent,
    TransactionsListItem,
    DraftHistoryComponent,
    DetailedListItem,
    ArticleScheduleComponent,
    ArticleMainComponent,
    ArticleSubComponent
  ],

  exports: [
    //pages
    LeaguePage,

    //modules
    ArticlesModule,
    ProfileHeaderModule,
    VideoModule,
    StandingsModule,
    SchedulesModule,
    TransactionsModule,
    DraftHistoryModule,

    //component
    StandingsComponent,
    SchedulesComponent,
    SchedulesCarousel,
    TransactionsComponent,
    TransactionsListItem,
    DraftHistoryComponent,
    DetailedListItem,
    ArticleScheduleComponent,
    ArticleMainComponent,
    ArticleSubComponent
  ],

  providers: [
    ProfileHeaderService,
    VideoService,
    StandingsService,
    TransactionsService,
    DraftHistoryService
  ]
})

export class ProfileNgModule {}
