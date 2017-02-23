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
import { RosterService } from '../services/roster.service';
import { FooterService } from '../services/footer.service';
import { DirectoryService } from '../services/directory.service';

export interface siteKey {
  path: Array<string>;
  name: string;
  dataPoints: Object;
} //GameInfoInput

@Component({
  selector: 'site-map',
  templateUrl: './siteMap.html'
})

export class SiteMap {

  private scopeLevel : Array<any> = [
    'home',
    'nfl',
    'ncaaf'
  ];

  private singlePages : Array<any> = [
    'contact-us',
    'disclaimer',
    'about-us',
    'pick-a-team',
    'standings',
    'league'
  ];

  private dontLog: Array<any> = [
    //single pages where the strings should not exist
    'contact-us',
    'disclaimer',
    'about-us',
    'pick-a-team',
    //below are defaults that shouldnt be ran in array function
    'home',
    'not-found',
    'sitemap',
    'error',
    '/**',
    ''
  ];

  private partnerSite: any;
  private domainUrl:string;
  private childrenRoutes: any;
  private totalSiteMap:any = [];
  private displaySiteMap: boolean = false;
  constructor(
    private router:ActivatedRoute,
    private _pickateamPageService: PickateamPageService,
    private _rosterService: RosterService,
    private _footerService: FooterService,
    private _directoryService: DirectoryService,
  ) {
    this.domainUrl = this.getPageUrl();
    this.partnerSite = VerticalGlobalFunctions.getWhiteLabel(); // grab partner id
    /*
    ** appRoutes[0] routes for non white labeled sites Touchdownloyal.com
    ** appRoutes[1] routes for white labeled and subdomains  football.  && mytouchdownloyal.
    */
    this.childrenRoutes = this.partnerSite == '' ? appRoutes[0] : appRoutes[1];

    console.log(this.router);
    console.log('domainUrl',this.domainUrl);
    console.log('partnerSite',this.partnerSite);
  } //constructor

  ngOnInit(){
    this.createSiteMap();
  }

  public getPageUrl() {
    let pageUrl = "";
    if (isNode) {
      pageUrl = GlobalSettings._proto + "//" + Zone.current.get('originUrl');
    } else {
      pageUrl = GlobalSettings._proto + "//" + window.location.hostname;
    }
    return pageUrl;
  } //getPageUrl

  getComponentPages(routes, name){
    let routeArray = [];
    routes.children.forEach(function(route){
      // if(route.component.name == name){
      //   routeArray.push(route);
      // }
    });
    return routeArray;
  }

  createSiteMap(){
    let self = this;
    let route = [];
    let scopes = this.scopeLevel;
    for( var i = 0; i < scopes.length; i++ ){// start creating site map from top level

      //add deepDive page routes
      this.addDeepDive(scopes[i]);
      //add single page routes
      this.addSinglePages(scopes[i]);

      if(this.dontLog.indexOf(scopes[i]) < 0){// dont use index of home that is located in dontLog variable
        this.addTeamPages(scopes[i]);
        // this.teamDirectory(scopes[i]);
        // this.playerDirectory(scopes[i]);
      }
    }
    console.log(this.totalSiteMap);
  }

  addDeepDive(scope){
    //grab white labled labeled url
    // if white labeled is not empty then make sure the response comes back with `/` at the very front to make it an absolute path
    let route = [this.partnerSite + '/' + scope];
    let relPath = route.join('/').toString();

    let pathData: siteKey = {
      path: route,
      name: this.domainUrl + relPath,
      dataPoints: null,
    }
    console.log('adding DeepDive page', pathData.name);
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
          let pathData: siteKey = {
            path: baseRoute,
            name: this.domainUrl + relPath,
            dataPoints: null,
          }
          console.log('adding SinglePage', pathData.name);
          this.totalSiteMap.push(pathData);
        }
      }
    }catch(e){
      console.warn('Error siteMap failure @ addSinglePages', e)
    }
  }

  //add team pages by using pick a team page api call => api.com/landingPage/:scope
  //directory page requires multiple pages with letters so too many api calls to use
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
              let pathData: siteKey = {
                path: teamRoute,
                name: self.domainUrl + relPath,
                dataPoints: null,
              }
              console.log('adding team', pathData.name);
              this.addPlayerPages(team, scope);
              self.totalSiteMap.push(pathData);
            });//end team
          });//end division
        });//end conference
      }catch(e){
        console.warn('Error siteMap failure @ addTeamPages', e)
      }

    })
  }

  //add player pages by using pick a team roster page api call
  //directory page requires multiple pages with letters so too many api calls to use
  addPlayerPages(team, scope){
    let self = this;
    let baseRoute = [this.partnerSite + '/' + scope];
    // let routerRoute = this.getComponentPages(this.childrenRoutes, 'TeamPage');
    // console.log('teampage variations',routerRoute);
    this._rosterService.getTeamRosterData(team.id)
    .finally(() => this.displaySiteMap = true ) // call preboot after last piece of data is returned on page
    .subscribe(data => {
      try{
        console.log(data);
        //[scope: string, teamName: string, teamId: string]
        // let teamRoute = VerticalGlobalFunctions.formatTeamRoute(scope, team.full_name, team.id);
        // let relPath = teamRoute.join('/').toString();
        // let pathData: siteKey = {
        //   path: teamRoute,
        //   name: self.domainUrl + relPath,
        //   dataPoints: null,
        // }
        // console.log('adding player', pathData.name);
        // self.totalSiteMap.push(pathData);
      }catch(e){
        console.warn('Error siteMap failure @ addPlayerPages', e)
      }

    })
  }

  teamDirectory(scope) {//TODO
    // let param {
    //   startsWith:'a',
    //   newlyAdded:false,
    //   listingsLimit:20,
    //   page:'team',
    // }
    // this._footerService.getFooterService(scope, "team")
    // .subscribe(data => {
    //   console.log(data);
    //   this._directoryService.getTeamData(scope, param)
    //   .subscribe(data => {
    //     console.log(data);
    //     let relPath = teamRoute.join('/').toString();
    //     let pathData: siteKey = {
    //       path: teamRoute,
    //       name: self.domainUrl + relPath,
    //       dataPoints: null,
    //     }
    //     this.totalSiteMap.push(pathData);
    //   },
    //   err => {
    //     console.log("Error getting footer data");
    //   });
    // },
    // err => {
    //   console.log("Error getting footer data");
    // });
  }

  playerDirectory(scope) {//TODO
    // let param {
    //   startsWith:'a',
    //   newlyAdded:false,
    //   listingsLimit:20,
    //   page:'player',
    // }
    // this._footerService.getFooterService(scope, "player")
    // .subscribe(data => {
    //   console.log(data);
    //   this._directoryService.getTeamData(scope, param)
    //   .subscribe(data => {
    //     console.log(data);
    //     let relPath = teamRoute.join('/').toString();
    //     let pathData: siteKey = {
    //       path: teamRoute,
    //       name: self.domainUrl + relPath,
    //       dataPoints: null,
    //     }
    //     this.totalSiteMap.push(pathData);
    //   },
    //   err => {
    //     console.log("Error getting footer data");
    //   });
    // },
    // err => {
    //   console.log("Error getting footer data");
    // });

  }

}
