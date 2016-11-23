import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AppComponent }  from '../app-component/app.component';

import { DeepDiveNgModule } from "../ngModules/deep-dive.ngmodule";
import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive.page";
import { LeaguePage } from "../webpages/league-page/league.page";
import { TeamPage } from "../webpages/team-page/team.page";
import { PlayerPage } from "../webpages/player-page/player.page";
import { SchedulesPage } from "../webpages/schedules-page/schedules.page";
import { DraftHistoryPage } from "../webpages/draft-history-page/draft-history.page";
import { StandingsPage } from "../webpages/standings-page/standings.page";
import { TeamRosterPage } from "../webpages/team-roster/team-roster.page";
import { TransactionsPage } from "../webpages/transactions-page/transactions.page";
import { SeasonStatsPage } from "../webpages/season-stats-page/season-stats.page";

import { ArticlePages } from "../webpages/article-pages/article-pages.page";
import { AboutUsPage } from "../webpages/about-us-page/about-us.page";
import { ContactUsPage } from "../webpages/contactus-page/contactus.page";
import { DisclaimerPage } from "../webpages/disclaimer-page/disclaimer.page";
// import {SyndicatedArticlePage} from "./webpages/syndicated-article-page/syndicated-article-page";
// import {SearchPage} from "./webpages/search-page/search-page";

const relativeChildRoutes = [
  {
      path: 'about-us',
      component: AboutUsPage,
  },
  {
      path: 'contact-us',
      component: ContactUsPage,
  },
  {
      path: 'disclaimer',
      component: DisclaimerPage,
  },
  // {
  //     path: ':scope/pick-a-team',
  //     name: 'Pick-team-page',
  //     component: PickTeamPage,
  // },
  {
      path: ':scope/team/:teamName/:teamID',
      component: TeamPage,
  },
  {
      path: ':scope/player/:teamName/:fullName/:playerID',
      component: PlayerPage,
  },
  // //Misc. Pages
  // {
  //     path: ':scope/directory/:type/:startsWith/page/:page',
  //     name: 'Directory-page-starts-with',
  //     component: DirectoryPage,
  // },
  // {
  //     path: ':scope/search/:query',
  //     name: 'Search-page',
  //     component: SearchPage
  // },
  // //Module Pages
  // {
  //     path: ':scope/mvp-list/:type/:pageNum',
  //     name: 'MVP-list-page',
  //     component: MVPListPage
  // },
  // {
  //     path: ':scope/mvp-list/:type/:tab/:pageNum',
  //     name: 'MVP-list-tab-page',
  //     component: MVPListPage
  // },
  {
      path: ':scope/schedules/:teamName/:year/:tab/:pageNum',
      component: SchedulesPage
  },
  {
      path: ':scope/schedules/:teamName/:teamID/:year/:tab/:pageNum',
      component: SchedulesPage
  },
  {
      path: ':scope/standings',
      component: StandingsPage
  },
  {
      path: ':scope/standings/:type',
      component: StandingsPage
  },
  {
      path: ':scope/standings/:type/:teamName/:teamID',
      component: StandingsPage
  },
  {
      path: ':scope/team-roster/:teamName/:teamID',
      component: TeamRosterPage
  },
  // {
  //     path: ':scope/list/:query',
  //     name: 'Dynamic-list-page',
  //     component: ListPage
  // },
  // {
  //     path: ':scope/list/:target/:statName/:season/:ordering/:perPageCount/:pageNumber',
  //     name: 'List-page',
  //     component: ListPage
  // },
  {
      path: ':scope/draft-history',
      name: 'Draft-history-mlb-page',
      component: DraftHistoryPage
  },
  {
      path: ':scope/draft-history/:teamName/:teamID',
      name: 'Draft-history-page',
      component: DraftHistoryPage
  },
  // {
  //     path: ':scope/:type/:teamName/:teamId/:limit/:pageNum',
  //     name: 'Transactions-page',
  //     component: TransactionsPage
  // },
  // {
  //     path: ':scope/:type/league/:limit/:pageNum',
  //     name: 'Transactions-tdl-page',
  //     component: TransactionsPage
  // },
  {
      path: ':scope/Transactions/:teamName/:teamId/:limit/:pageNum',
      component: TransactionsPage
  },
  {
      path: ':scope/Suspensions/:teamName/:teamId/:limit/:pageNum',
      component: TransactionsPage
  },
  {
      path: ':scope/Injuries/:teamName/:teamId/:limit/:pageNum',
      component: TransactionsPage
  },
  {
      path: ':scope/Transactions/league/:limit/:pageNum',
      component: TransactionsPage
  },
  {
      path: ':scope/Suspensions/league/:limit/:pageNum',
      component: TransactionsPage
  },
  {
      path: ':scope/Injuries/league/:limit/:pageNum',
      component: TransactionsPage
  },
  {
      path: ':scope/season-stats/:fullName/:playerID',
      component: SeasonStatsPage
  },
  // {
  //     path: ':scope/player-stats/:teamName/:teamID',
  //     name: 'Player-stats-page',
  //     component: PlayerStatsPage
  // },
   {
       path: ':scope/articles/:eventType/:eventID',
       component: ArticlePages
   },
  // {
  //     path: ':scope/list-of-lists/:target/:targetId/:perPageCount/:pageNumber',
  //     name: 'List-of-lists-page-scoped',
  //     component: ListOfListsPage
  // },
  // //Error pages and error handling
  // {
  //     path: '/error',
  //     name: 'Error-page',
  //     component: ErrorPage
  // },
  // {
  //     path: '/not-found',
  //     component: ErrorPage,
  // },
  {
    path: ':scope/league',
    component: LeaguePage,
  },
  {
    path: ':scope',
    component: DeepDivePage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //     path: '/*path',
  //     redirectTo: ['NotFound-page']
  // },
];

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: relativeChildRoutes
  },
  {
    path: ':partnerID',
    component: AppComponent,
    children: relativeChildRoutes
  },

];

export const routing = RouterModule.forRoot(appRoutes);
