import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AppComponent }  from '../app-component/app.component';

import { DeepDiveNgModule } from "../ngModules/deep-dive.ngmodule";
import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive.page";
import { LeaguePage } from "../webpages/league-page/league.page";
// import {AboutUsPage} from "./webpages/aboutus/aboutus";
// import {PrivacyPolicy} from "./webpages/privacy-policy/privacy-policy";
// import {TermOfService} from "./webpages/term-of-service/term-of-service";
// import {SyndicatedArticlePage} from "./webpages/syndicated-article-page/syndicated-article-page";
// import {SearchPage} from "./webpages/search-page/search-page";

const relativeChildRoutes = [
  // {
  //     path: ':scope/pick-a-team',
  //     name: 'Pick-team-page',
  //     component: PickTeamPage,
  // },
  // {
  //     path: ':scope/league',
  //     name: 'League-page',
  //     component: LeaguePage,
  // },
  // {
  //     path: ':scope/team/:teamName/:teamId',
  //     name: 'Team-page',
  //     component: TeamPage,
  // },
  // {
  //     path: ':scope/player/:teamName/:fullName/:playerId',
  //     name: 'Player-page',
  //     component: PlayerPage,
  // },
  // //Misc. Pages
  // {
  //     path: ':scope/directory/:type/:startsWith/page/:page',
  //     name: 'Directory-page-starts-with',
  //     component: DirectoryPage,
  // },
  // {
  //     path: ':scope/about-us',
  //     name: 'About-us-page',
  //     component: AboutUsPage,
  // },
  // {
  //     path: ':scope/contact-us',
  //     name: 'Contact-us-page',
  //     component: ContactUsPage,
  // },
  // {
  //     path: ':scope/disclaimer',
  //     name: 'Disclaimer-page',
  //     component: DisclaimerPage,
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
  // {
  //     path: ':scope/schedules/league/:year/:pageNum',
  //     name: 'Schedules-page-league',
  //     component: SchedulesPage
  // },
  // {
  //     path: ':scope/schedules/league/:year/:tab/:pageNum',
  //     name: 'Schedules-page-league-tab',
  //     component: SchedulesPage
  // },
  // {
  //     path: ':scope/schedules/:teamName/:teamId/:year/:pageNum',
  //     name: 'Schedules-page-team',
  //     component: SchedulesPage
  // },
  // {
  //     path: ':scope/schedules/:teamName/:year/:tab/:teamId/:pageNum',
  //     name: 'Schedules-page-team-tab',
  //     component: SchedulesPage
  // },
  // {
  //     path: ':scope/standings',
  //     name: 'Standings-page',
  //     component: StandingsPage
  // },
  // {
  //     path: ':scope/standings/:type',
  //     name: 'Standings-page-league',
  //     component: StandingsPage
  // },
  // {
  //     path: ':scope/standings/:type/:teamName/:teamId',
  //     name: 'Standings-page-team',
  //     component: StandingsPage
  // },
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
  // {
  //     path: ':scope/draft-history',
  //     name: 'Draft-history-mlb-page',
  //     component: DraftHistoryPage
  // },
  // {
  //     path: ':scope/draft-history/:teamName/:teamId',
  //     name: 'Draft-history-page',
  //     component: DraftHistoryPage
  // },
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
  // {
  //     path: ':scope/team-roster/:teamName/:teamId',
  //     name: 'Team-roster-page',
  //     component: TeamRosterPage
  // },
  // {
  //     path: ':scope/season-stats/:fullName/:playerId',
  //     name: 'Season-stats-page',
  //     component: SeasonStatsPage
  // },
  // {
  //     path: ':scope/player-stats/:teamName/:teamId',
  //     name: 'Player-stats-page',
  //     component: PlayerStatsPage
  // },
  // {
  //     path: ':scope/articles/:eventType/:eventID',
  //     name: 'Article-pages',
  //     component: ArticlePages
  // },
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
