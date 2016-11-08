import {Component, AfterViewChecked, OnInit, ElementRef} from '@angular/core';
import {RouteParams, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';

import {GlobalFunctions} from "../global/global-functions";
import {FooterComponent} from "../fe-core/components/footer/footer.component";

import {HeaderComponent} from "../fe-core/components/header/header.component";

import {VerticalGlobalFunctions} from "../global/vertical-global-functions";
import {PickTeamPage} from "../webpages/home-page/home-page.page";
import {AboutUsPage} from "../webpages/about-us-page/about-us.page";
import {DirectoryPage} from "../webpages/directory-page/directory.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {ErrorPage} from "../webpages/error-page/error-page.page";
import {SearchPage} from '../webpages/search-page/search.page';

import {LeaguePage} from "../webpages/league-page/league.page";
import {TeamPage} from "../webpages/team-page/team.page";
import {PlayerPage} from "../webpages/player-page/player.page";

import {PlayerStatsPage} from "../webpages/player-stats-page/player-stats.page";
import {TeamRosterPage} from "../webpages/team-roster/team-roster.page";
import {ListPage} from "../webpages/list-page/list.page";
import {SchedulesPage} from "../webpages/schedules-page/schedules.page";
import {DraftHistoryPage} from "../webpages/draft-history-page/draft-history.page";
import {SeasonStatsPage} from "../webpages/season-stats-page/season-stats.page";
import {StandingsPage} from "../webpages/standings-page/standings.page";
import {ArticlePages} from "../webpages/article-pages/article-pages.page";
import {ListOfListsPage} from "../webpages/list-of-lists-page/list-of-lists.page";
import {TransactionsPage} from "../webpages/transactions-page/transactions.page";
import {MVPListPage} from "../webpages/mvp-list-page/mvp-list.page";

import {ArticleDataService} from "../global/global-article-page-service";
import {HeadlineDataService} from "../global/global-ai-headline-module-service";

import {ModulePage} from "../webpages/module-page/module.page";
import {ImagesTestPage} from "../webpages/images-test-page/images-test.page";

import {SanitizeHtml} from "../fe-core/pipes/safe.pipe";
import {SanitizeStyle} from "../fe-core/pipes/safe.pipe";
import {GlobalSettings} from "../global/global-settings";

//FOR DEEP DIVE
import {SyndicatedArticlePage} from "../webpages/syndicated-article-page/syndicated-article-page.page";
import {DeepDivePage} from "../webpages/deep-dive-page/deep-dive.page";
import {PartnerHeader} from "../global/global-service";
declare var jQuery: any;

@Component({
    selector: 'my-app',
    templateUrl: './app/app-webpage/app.webpage.html',
    directives: [
        //Components for Main Layout
        HeaderComponent,
        FooterComponent,

        //Routing Directives
        RouterOutlet,
        ROUTER_DIRECTIVES
    ],
    providers: [PartnerHeader, ArticleDataService, HeadlineDataService],
    pipes:[SanitizeHtml, SanitizeStyle]
})

@RouteConfig([
    //Home Page
    {
      path: '/',
      name: 'Home-page',
      component: DeepDivePage,
      useAsDefault: true
    },
    {
        path: '/pick-a-team',
        name: 'Pick-team-page',
        component: PickTeamPage,
    },
    //Profile Pages
    {
        path: '/league',
        name: 'League-page',
        component: LeaguePage,
    },
    {
        path: '/team/:teamName/:teamId',
        name: 'Team-page',
        component: TeamPage,
    },
    {
        path: '/player/:teamName/:fullName/:playerId',
        name: 'Player-page',
        component: PlayerPage,
    },
    //Misc. Pages
    {
        path: '/directory/:type/:startsWith/page/:page',
        name: 'Directory-page-starts-with',
        component: DirectoryPage,
    },
    {
        path: '/about-us',
        name: 'About-us-page',
        component: AboutUsPage,
    },
    {
        path: '/contact-us',
        name: 'Contact-us-page',
        component: ContactUsPage,
    },
    {
        path: '/disclaimer',
        name: 'Disclaimer-page',
        component: DisclaimerPage,
    },
    {
        path: '/search/:query',
        name: 'Search-page',
        component: SearchPage
    },
    //Module Pages
    {
        path: '/mvp-list/:type/:pageNum',
        name: 'MVP-list-page',
        component: MVPListPage
    },
    {
        path: '/mvp-list/:type/:tab/:pageNum',
        name: 'MVP-list-tab-page',
        component: MVPListPage
    },
    {
        path: '/schedules/league/:year/:pageNum',
        name: 'Schedules-page-league',
        component: SchedulesPage
    },
    {
        path: '/schedules/league/:year/:tab/:pageNum',
        name: 'Schedules-page-league-tab',
        component: SchedulesPage
    },
    {
        path: '/schedules/:teamName/:teamId/:year/:pageNum',
        name: 'Schedules-page-team',
        component: SchedulesPage
    },
    {
        path: '/schedules/:teamName/:year/:tab/:teamId/:pageNum',
        name: 'Schedules-page-team-tab',
        component: SchedulesPage
    },
    {
        path: '/standings',
        name: 'Standings-page',
        component: StandingsPage
    },
    {
        path: '/standings/:type',
        name: 'Standings-page-league',
        component: StandingsPage
    },
    {
        path: '/standings/:type/:teamName/:teamId',
        name: 'Standings-page-team',
        component: StandingsPage
    },
    {
        path: '/list/:query',
        name: 'Dynamic-list-page',
        component: ListPage
    },
    {
        path: '/list/:target/:statName/:season/:ordering/:perPageCount/:pageNumber',
        name: 'List-page',
        component: ListPage
    },
    {
        path: '/draft-history',
        name: 'Draft-history-mlb-page',
        component: DraftHistoryPage
    },
    {
        path: '/draft-history/:teamName/:teamId',
        name: 'Draft-history-page',
        component: DraftHistoryPage
    },
    {
        path: '/:type/:teamName/:teamId/:limit/:pageNum',
        name: 'Transactions-page',
        component: TransactionsPage
    },
    {
        path: '/:type/league/:limit/:pageNum',
        name: 'Transactions-tdl-page',
        component: TransactionsPage
    },
    {
        path: '/team-roster/:teamName/:teamId',
        name: 'Team-roster-page',
        component: TeamRosterPage
    },
    {
        path: '/season-stats/:fullName/:playerId',
        name: 'Season-stats-page',
        component: SeasonStatsPage
    },
    {
        path: '/player-stats/:teamName/:teamId',
        name: 'Player-stats-page',
        component: PlayerStatsPage
    },
    {
        path: '/articles/:eventType/:eventID',
        name: 'Article-pages',
        component: ArticlePages
	  },
    {
        path: '/news/:articleType/:eventID',
        name: 'Syndicated-article-page',
        component: SyndicatedArticlePage
	  },
    { // listOfLists/scope=nfl&target=team&perPageCount=5&pageNumber=1&targetId=155
        path: '/list-of-lists/:target/:targetId/:perPageCount/:pageNumber',
        name: 'List-of-lists-page-scoped',
        component: ListOfListsPage
    },
    //Error pages and error handling
    {
        path: '/error',
        name: 'Error-page',
        component: ErrorPage
    },
    {
        path: '/not-found',
        name: 'NotFound-page',
        component: ErrorPage
    },
    {
        path: '/*path',
        redirectTo: ['NotFound-page']
    },
    // Test Pages - TODO: remove after testing
    {
        path: '/fe-core/modules/:teamID',
        name: 'Module-page',
        component: ModulePage
    },
    {
        path: '/images-test',
        name: 'Images-test-page',
        component: ImagesTestPage,
    }
])

export class AppComponent {
  public partnerID: string;
  public partnerData: Object;
  public partnerScript:string;
  public shiftContainer:string;
  public hideHeader: boolean;
  private isPartnerZone:boolean = false;
  constructor(private _router:Router, private _params: RouteParams,private _partnerData: PartnerHeader, private _el:ElementRef){
    this.hideHeader = GlobalSettings.getHomeInfo().hide;
    if(window.location.hostname.split(".")[0].toLowerCase() == "football" && GlobalSettings.getHomeInfo().isSubdomainPartner){
        this.partnerID = window.location.hostname.split(".")[1] + "." + window.location.hostname.split(".")[2];
        this.getPartnerHeader();
    }
  }

  getHeaderHeight(){
    var pageHeader = document.getElementById('pageHeader');
    var saladBar = document.getElementById('salad-bar-top');
    if(pageHeader != null){
      return pageHeader.offsetHeight + saladBar.offsetHeight;
    }
  }

  getPartnerHeader(){//Since it we are receiving
    if(this.partnerID != null && this.partnerID != 'football'){
      this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            if(partnerScript['results'] != null){
              this.partnerData = partnerScript;
              this.partnerScript = this.partnerData['results'].header.script;
            }
          }
        );
    }
  }

  ngDoCheck(){
    var checkHeight = this.getHeaderHeight();
    if(this.shiftContainer != (checkHeight + 'px')){
      this.shiftContainer = checkHeight + 'px';
    }
  }

}
