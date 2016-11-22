import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../router/app.routing';
import { FormsModule } from '@angular/forms';

//ngModules
import { GlobalModule } from './global.ngmodule';

//services
import { ProfileHeaderService } from '../services/profile-header.service';
import { VideoService } from "../services/video.service";
import { StandingsService } from "../services/standings.service";
import { TransactionsService } from "../services/transactions.service";
import { DraftHistoryService } from "../services/draft-history.service";
import { ListPageService } from '../services/list-page.service';
import { ComparisonStatsService } from '../services/comparison-stats.service';
import { DykService } from '../services/dyk.service';
import { FaqService } from "../services/faq.service";
import { NewsService } from "../services/news.service";
import { TwitterService } from "../services/twitter.service";
import { DailyUpdateService } from "../services/daily-update.service";
import { RosterService } from '../services/roster.service';
import { HeadlineDataService } from "../global/global-ai-headline-module-service";

//pages
import { LeaguePage } from "../webpages/league-page/league.page";
import { TeamPage } from "../webpages/team-page/team.page";
import { PlayerPage } from "../webpages/player-page/player.page";

//modules
import { ProfileHeaderModule } from "../fe-core/modules/profile-header/profile-header.module";
import { VideoModule } from "../fe-core/modules/video/video.module";
import { StandingsModule } from "../fe-core/modules/standings/standings.module";
import { SchedulesModule } from "../fe-core/modules/schedules/schedules.module";
import { TransactionsModule } from "../fe-core/modules/transactions/transactions.module";
import { DraftHistoryModule } from "../fe-core/modules/draft-history/draft-history.module";
import { MVPModule } from "../fe-core/modules/mvp/mvp.module";
import { ComparisonModule } from "../fe-core/modules/comparison/comparison.module";
import { DYKModule } from "../fe-core/modules/dyk/dyk.module";
import { FAQModule } from "../fe-core/modules/faq/faq.module";
import { NewsModule } from "../fe-core/modules/news/news.module";
import { TwitterModule } from "../fe-core/modules/twitter/twitter.module";
import { DailyUpdateModule } from "../fe-core/modules/daily-update/daily-update.module";
import { TeamRosterModule } from "../fe-core/modules/team-roster/team-roster.module";
import { PlayerStatsModule } from "../fe-core/modules/player-stats/player-stats.module";

//components
import { StandingsComponent } from "../fe-core/components/standings/standings.component";
import { SchedulesComponent } from "../fe-core/components/schedules/schedules.component";
import { SchedulesCarousel } from "../fe-core/components/carousels/schedules-carousel/schedules-carousel.component";
import { TransactionsComponent } from "../fe-core/components/transactions/transactions.component";
import { TransactionsListItem } from "../fe-core/components/transactions-list-item/transactions-list-item.component";
import { DraftHistoryComponent } from "../ui-modules/draft-history/draft-history.component";
import { DetailedListItem } from "../fe-core/components/detailed-list-item/detailed-list-item.component";
import { ArticlesModule } from "../fe-core/modules/articles/articles.module";
import { ArticleSubComponent } from "../fe-core/components/articles/sub-article/sub-article.component";
import { ArticleMainComponent } from "../fe-core/components/articles/main-article/main-article.component";
import { ArticleScheduleComponent } from "../fe-core/components/articles/article-schedule/article-schedule.component";
import { MVPListComponent } from "../fe-core/components/mvp-list/mvp-list.component";
import { ComparisonTile } from "../fe-core/components/comparison-tile/comparison-tile.component";
import { ComparisonLegend } from "../fe-core/components/comparison-legend/comparison-legend.component";
import { ComparisonBar } from "../fe-core/components/comparison-bar/comparison-bar.component";
import { ProfileVideoStackComponent } from "../ui-modules/profile-video-stack/profile-video-stack.component";
import { PlayerStatsComponent } from "../fe-core/components/player-stats/player-stats.component";
import { GlossaryComponent } from "../fe-core/components/glossary/glossary.component";
import { RosterComponent } from "../fe-core/components/roster/roster.component";

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
    TeamPage,
    PlayerPage,

    //modules
    ArticlesModule,
    ProfileHeaderModule,
    VideoModule,
    StandingsModule,
    SchedulesModule,
    TransactionsModule,
    DraftHistoryModule,
    MVPModule,
    ComparisonModule,
    DYKModule,
    FAQModule,
    NewsModule,
    TwitterModule,
    DailyUpdateModule,
    TeamRosterModule,
    PlayerStatsModule,

    //component
    StandingsComponent,
    SchedulesComponent,
    SchedulesCarousel,
    TransactionsComponent,
    TransactionsListItem,
    DraftHistoryComponent,
    DetailedListItem,
    MVPListComponent,
    ComparisonTile,
    ComparisonLegend,
    ComparisonBar,
    ArticleScheduleComponent,
    ArticleMainComponent,
    ArticleSubComponent,
    ProfileVideoStackComponent,
    GlossaryComponent,
    RosterComponent,
    PlayerStatsComponent
  ],

  exports: [
    //pages
    LeaguePage,
    TeamPage,
    PlayerPage,

    //modules
    ArticlesModule,
    ProfileHeaderModule,
    VideoModule,
    StandingsModule,
    SchedulesModule,
    TransactionsModule,
    DraftHistoryModule,
    MVPModule,
    ComparisonModule,
    DYKModule,
    FAQModule,
    NewsModule,
    TwitterModule,
    DailyUpdateModule,
    TeamRosterModule,
    PlayerStatsModule,

    //component
    StandingsComponent,
    SchedulesComponent,
    SchedulesCarousel,
    TransactionsComponent,
    TransactionsListItem,
    DraftHistoryComponent,
    DetailedListItem,
    MVPListComponent,
    ComparisonTile,
    ComparisonLegend,
    ComparisonBar,
    ArticleScheduleComponent,
    ArticleMainComponent,
    ArticleSubComponent,
    ProfileVideoStackComponent,
    PlayerStatsComponent,
    GlossaryComponent,
    RosterComponent,
    PlayerStatsComponent
  ],

  providers: [
    ProfileHeaderService,
    VideoService,
    StandingsService,
    TransactionsService,
    DraftHistoryService,
    ListPageService,
    ComparisonStatsService,
    DykService,
    FaqService,
    NewsService,
    TwitterService,
    RosterService,
    DailyUpdateService
  ]
})

export class ProfileNgModule {}
