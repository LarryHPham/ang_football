import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appRoutes } from '../router/app.routing';
import { isNode, isBrowser } from "angular2-universal";

//globals
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";

import { SeoService } from "../seo.service";

//services
import { PickateamPageService } from '../services/pickateam.service';
import { FooterService } from '../services/footer.service';
import { DirectoryService } from '../services/directory.service';
import { ArticleDataService } from "../services/article-page-service";
import { DeepDiveService } from "../services/deep-dive.service";
import { ListOfListsService } from "../services/list-of-lists.service";
import { ProfileHeaderService } from '../services/profile-header.service';

export interface siteKey {
  path: Array<any>;
  name: string;
  query?: any;
  uniqueId?: any;
} //GameInfoInput

@Component({
  selector: 'site-map',
  templateUrl: './siteMap.html'
})

export class SiteMap {

  public scopeLevel : Array<any> = [
    'home',
    'nfl',
    'ncaaf'
  ];

  public singlePages : Array<any> = [
    'contact-us',
    'disclaimer',
    'about-us',
    'pick-a-team',
    'standings',
    'league'
  ];

  public dontLog: Array<any> = [
    //single pages
    'contact-us',
    'disclaimer',
    'about-us',
    'pick-a-team',
    //below are defaults that shouldn't be ran in array function
    'home',
    'not-found',
    'sitemap',
    'error',
    '/**',
    ''
  ];

  private partnerSite: any;
  private static domainUrl:string;
  private childrenRoutes: any;
  private totalSiteMap:any = [];
  private domainUrl: string;
  // private displaySiteMap: boolean = false;
  constructor(
    private router:ActivatedRoute,
    private _pickateamPageService: PickateamPageService,
    private _articleService: ArticleDataService,
    private _footerService: FooterService,
    private _directoryService: DirectoryService,
    private _seoService: SeoService,
    private _deepDiveService: DeepDiveService,
    private _listOfListService: ListOfListsService,
    private _profileService: ProfileHeaderService
  ) {
    // SiteMap.domainUrl = VerticalGlobalFunctions.getPageUrl();
    this.partnerSite = VerticalGlobalFunctions.getWhiteLabel(); // grab partner id
    /*
    ** appRoutes[0] routes for non white labeled sites Touchdownloyal.com
    ** appRoutes[1] routes for white labeled and subdomains  football.  && mytouchdownloyal.
    */
    this.childrenRoutes = this.partnerSite == '' ? appRoutes[0] : appRoutes[1];
  } //constructor

  static createSiteKey(path, relativePath, u_id?){
    let domainUrl = VerticalGlobalFunctions.getPageUrl();
    let siteMapObj: siteKey = {
      path: path,
      name: domainUrl + relativePath,
      uniqueId: u_id
    };
    return siteMapObj;
  }

  ngOnInit(){
    this.metaTags();
    this.createSiteMap();
  }

  metaTags(){
    this._seoService.removeMetaTags();
    this._seoService.setMetaRobots('NOINDEX, FOLLOW');
  } // metaTags

  createSiteMap(){
    let self = this;
    let route = [];
    let scopes = this.scopeLevel;
    for( var i = 0; i < scopes.length; i++ ){// start creating site map from top level
      //add deepDive page routes
      this.addDeepDive(scopes[i]);
      //add single page routes
      this.addSinglePages(scopes[i]);

      if(this.dontLog.indexOf(scopes[i]) < 0){// dont use index of 'home' that is located in dontLog variable
        this.addTeamPages(scopes[i]);
        this.addListPage(scopes[i]);
        this.addAiArticleSiteMaps(scopes[i]);
        this.addArticleSiteMaps(scopes[i]);
        this.addLeagueModulePages(scopes[i]);
      }
    }
  }

  addLeagueModulePages(scope){
    try{
      this._profileService.getLeagueProfile(scope)
      .subscribe(data => {
        let headerData = data.headerData;
        let teamNameRoute = GlobalFunctions.toLowerKebab(data.profileName);
        let seasonsAmount = 4;
        //create links for all schedules tabs
        //schedules -> pregame, postgame
        for(var i = 0; i < seasonsAmount; i++){
          let schedulesTabs = ['pregame','postgame'];
          let season = Number(headerData.seasonBase) - i;
          for( var s = 0 ; s < 2; s++){
            let scheduleRoute = [this.partnerSite + '/' + scope + '/schedules/'+ 'league', season, schedulesTabs[s], 1];
            let scheduleRelPath = scheduleRoute.join('/').toString();
            let scheduleMap = SiteMap.createSiteKey(scheduleRoute, scheduleRelPath);

            this.totalSiteMap.push(scheduleMap);
          }// end of schedule for loops

          //standings
          let standingsRoute = [this.partnerSite + '/' + scope + '/standings', 'league'];
          let standingsRelPath = standingsRoute.join('/').toString();
          let standingsMap = SiteMap.createSiteKey(standingsRoute, standingsRelPath);
          this.totalSiteMap.push(standingsMap);
        }//end of for loops seasons

        //transaction
        // create links for all tabs
        let transactionTabs = ['transaction', 'suspensions', 'injuries'];
        for(var t = 0 ; t < 3; t++){
          let transactionRoute = [this.partnerSite + '/' + scope + '/'+transactionTabs[t]+'/'+ headerData.seasonBase + '/' + 'league', 20];
          let transactionRelPath = transactionRoute.join('/').toString();
          let transactionMap = SiteMap.createSiteKey(transactionRoute, transactionRelPath);
          this.totalSiteMap.push(transactionMap);
        }

        //draft history
        let draftRoute = [this.partnerSite + '/' + scope + '/draft-history', headerData.seasonBase, 'league', 'asc'];
        let draftRelPath = draftRoute.join('/').toString();
        let draftMap = SiteMap.createSiteKey(draftRoute, draftRelPath);
        this.totalSiteMap.push(draftMap);
      });
    }catch(e){
      console.log('No Player Module Data');
    }
  }

  addDeepDive(scope){
    //grab white labled labeled url
    // if white labeled is not empty then make sure the response comes back with `/` at the very front to make it an absolute path
    let route = [this.partnerSite + '/' + scope];
    let relPath = route.join('/').toString();

    let pathData = SiteMap.createSiteKey(route, relPath);
    // console.log('adding DeepDive page', pathData.name);
    this.totalSiteMap.push(pathData);
  }

  addSinglePages(scope){
    try{
      let singlePages = this.singlePages;
      //run and create each single page urls
      for( var i = 0; i < singlePages.length; i++ ){// start creating site map from top level
        if(this.dontLog.indexOf(scope) < 0){// dont use index of home that is located in dontLog variable
          let baseRoute = [this.partnerSite + '/' + scope];
          baseRoute.push(singlePages[i]);
          let relPath = baseRoute.join('/').toString();
          let pathData = SiteMap.createSiteKey(baseRoute, relPath);
          this.totalSiteMap.push(pathData);
        }
      }
    }catch(e){
      console.warn('Error siteMap failure @ addSinglePages', e)
    }
  }

  addTeamPages(scope){
    let self = this;
    let baseRoute = [this.partnerSite + '/' + scope];
    // let routerRoute = this.getComponentPages(this.childrenRoutes, 'TeamPage');
    // console.log('teampage variations',routerRoute);
    this._pickateamPageService.getLandingPageService(scope, null)
    .subscribe(data => {
      try{
        //note function may not make sense with nfl & ncaaf Conferences and Divisions naming but will be used for consistencies
        data.league.forEach(function(conference){
          conference.dataArray.forEach(function(division){
            division.dataArray.forEach(function(team){
              //[scope: string, teamName: string, teamId: string]
              let teamRoute = VerticalGlobalFunctions.formatTeamRoute(scope, team.full_name, team.id);
              let relPath = teamRoute.join('/').toString();
              let pathData = SiteMap.createSiteKey(teamRoute, relPath);

              let teamPath = '/sitemap/'+scope+'/team/' + team.id;
              let sitePath = SiteMap.createSiteKey([teamPath], teamPath);

              self.totalSiteMap.push(pathData);
              self.totalSiteMap.push(sitePath);
            });//end team
          });//end division
        });//end conference
      }catch(e){
        console.warn('Error siteMap failure @ addTeamPages', e)
      }
    })
  }

  addAiArticleSiteMaps(scope){
    let aiArticlePath = '/sitemap/'+scope+'/aiarticles';
    let sitePath = SiteMap.createSiteKey([aiArticlePath], aiArticlePath);
    this.totalSiteMap.push(sitePath);
  }// end addArticleSiteMaps

  addArticleSiteMaps(scope){
    let articleCount = GlobalSettings.siteMapArticleCount;
    let self = this;
    //STORY ARTICLES => scope, limit, page, state?
    this._deepDiveService.getSiteMapStoryDeepDive(scope, articleCount, 1)
    .subscribe(data => {
      try{
        let totalPages = data.totalPages;
        for(var i = 1; i <= Number(totalPages); i++){
          let articlePath = '/sitemap/'+scope+'/articles/' + i;
          let sitePath = SiteMap.createSiteKey([articlePath], articlePath);
          self.totalSiteMap.push(sitePath);
        }
      }catch(e){
        console.warn('Error siteMap failure @ STORY addArticleSiteMaps', e)
      }
    });
    //remove all video article pages from sitemap as per task DCU - 121
    //VIDEO ARTICLES => scope, limit, page, state?
 /*   this._deepDiveService.getSiteMapVideoDeepDive(scope, articleCount, 1)
    .subscribe(data => {
      try{
        let totalPages = data.totalPages;
        for(var i = 1; i <= Number(totalPages); i++){
          let articlePath = '/sitemap/'+scope+'/videoarticles/' + i;
          let sitePath = SiteMap.createSiteKey([articlePath], articlePath);
          self.totalSiteMap.push(sitePath);
        }
      }catch(e){
        console.warn('Error siteMap failure @ VIDEO addArticleSiteMaps', e)
      }
    });*/
  }// end addArticleSiteMaps

  addListPage(scope, id?){
    let teamRoute = [this.partnerSite + '/sitemap/' + scope + '/list', 'team'];
    let relTeamPath = teamRoute.join('/').toString();

    let playerRoute = [this.partnerSite + '/sitemap/' + scope + '/list', 'player'];
    let relPlayerPath = playerRoute.join('/').toString();

    let siteTeamPath = SiteMap.createSiteKey(teamRoute, relTeamPath);
    let sitePlayerPath = SiteMap.createSiteKey(playerRoute, relPlayerPath);
    this.totalSiteMap.push(siteTeamPath);
    this.totalSiteMap.push(sitePlayerPath);
  }
}
