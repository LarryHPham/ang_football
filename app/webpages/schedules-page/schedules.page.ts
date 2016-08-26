import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalSettings} from "../../global/global-settings";
import {DetailedListItem, DetailListInput} from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter, ModuleFooterData, FooterStyle} from '../../fe-core/components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../fe-core/components/title/title.component';
import {BackTabComponent} from '../../fe-core/components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../fe-core/components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {PaginationFooter} from '../../fe-core/components/pagination-footer/pagination-footer.component';
import {LoadingComponent} from "../../fe-core/components/loading/loading.component";
import {ErrorComponent} from "../../fe-core/components/error/error.component";

import {SchedulesService} from '../../services/schedules.service';
import {SchedulesComponent} from '../../fe-core/components/schedules/schedules.component';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../fe-core/components/responsive-widget/responsive-widget.component';

declare var moment;

@Component({
    selector: 'schedules-page',
    templateUrl: './app/webpages/schedules-page/schedules.page.html',
    directives: [ROUTER_DIRECTIVES, SidekickWrapper, SchedulesComponent, ErrorComponent, LoadingComponent,PaginationFooter, BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter, ResponsiveWidget],
    providers: [SchedulesService, ProfileHeaderService, Title],
    inputs:[]
})

export class SchedulesPage implements OnInit{
  profileHeaderData: TitleInputData;
  errorData: any;
  paginationParameters:any;
  isError: boolean = false;
  schedulesData:any;
  tabData: any;
  limit:number = 10;

  initialPage: number;
  initialTabKey: string;
  selectedTabKey: string;
  scope:string;

  constructor(private _schedulesService:SchedulesService,
          private profHeadService:ProfileHeaderService,
          private params: RouteParams,
          private _title: Title, private _router: Router) {
      _title.setTitle(GlobalSettings.getPageTitle("Schedules"));

      GlobalSettings.getParentParams(_router, parentParams => {
          this.scope = parentParams.scope;
          this.initialPage = Number(this.params.get("pageNum"));
          this.initialTabKey = this.params.get("tab");
      });

    }

  //grab tab to make api calls for post of pre event table
  private scheduleTab(tab) {
    if ( tab == 'Upcoming Games' ){
        this.selectedTabKey = "pregame";
    } else {
        this.selectedTabKey = "postgame";
    }
    // Uncomment if we want to enable URL changing when switching tabs.
    // However! with the way the scroll-to-top is set up, it will move the
    // page to the top each time the tab is changed, which QA doesn't want.
    // if ( this.initialTabKey != this.selectedTabKey ) {
    //   var navigationParams = {
    //     pageNum: 1,
    //     tab: this.selectedTabKey
    //   };

    //   var teamName = this.params.get('teamName');
    //   var teamId = this.params.get('teamId');

    //   if(teamName){
    //     navigationParams['teamName'] = teamName;
    //   }
    //   if(teamId){
    //     navigationParams['teamId'] = teamId;
    //   }
    //   var navigationPage = teamName ? 'Schedules-page-team-tab' : 'Schedules-page-league-tab';
    //   this._router.navigate([navigationPage, navigationParams]);
    // }
    this.getSchedulesData(this.selectedTabKey, this.selectedTabKey == this.initialTabKey ? this.initialPage : 1);
  }

  private getSchedulesData(status, pageNum){
    var teamId = this.params.params['teamId']; //determines to call league page or team page for schedules-table
    if(teamId){
      this.profHeadService.getTeamProfile(Number(teamId))
      .subscribe(
          data => {
            this._title.setTitle(GlobalSettings.getPageTitle("Schedules", data.teamName));
            this.profileHeaderData = this.profHeadService.convertTeamPageHeader(data, "Current Season Schedule - " + data.teamName);
            this.errorData = {
              data: data.teamName + " has no record of any more games for the current season.",
              icon: "fa fa-calendar-times-o"
            }
          },
          err => {
            this.isError= true;
              console.log('Error: Schedules Profile Header API: ', err);
              // this.isError = true;
          }
      );
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'team', status, this.limit, 1, teamId, (schedulesData) => {
        console.log('got DATA!=>', schedulesData);
        this.schedulesData = schedulesData;
        if(typeof this.tabData == 'undefined'){
            this.tabData = schedulesData.tabs;
        }
        this.setPaginationParams(schedulesData.pageInfo, status, pageNum);
      })
    }else{
      this._title.setTitle(GlobalSettings.getPageTitle("Schedules", "Football"));
      this.profHeadService.getLeagueProfile(this.scope)
      .subscribe(
          data => {
            var currentDate = new Date();// no stat for date so will grab current year client is on
            var display:string;
            if(currentDate.getFullYear() == currentDate.getFullYear()){// TODO must change once we have historic data
              display = "Current Season"
            }
            var pageTitle = display + " Schedules - " + data.headerData.leagueFullName;
            this.profileHeaderData = this.profHeadService.convertLeagueHeader(data.headerData, pageTitle);
            this.errorData = {
              data: data.headerData.leagueFullName + " has no record of any more games for the current season.",
              icon: "fa fa-calendar-times-o"
            }
          },
          err => {
            this.isError = true;
            console.log('Error: Schedules Profile Header API: ', err);
          }
      );
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'league', status, this.limit, 1, null, (schedulesData) => {
        console.log('got DATA!=>', schedulesData);
        this.schedulesData = schedulesData;
        if(typeof this.tabData == 'undefined'){
            this.tabData = schedulesData.tabs;
        }
        this.setPaginationParams(schedulesData.pageInfo, status, pageNum);
      })
    }
  }

  //PAGINATION
  //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
  setPaginationParams(input, tabKey: string, pageNum: number) {
      // var pageType;
      // console.log(params)
      //'/schedules/:teamName/:teamId/:pageNum'
      var navigationParams = {
        pageNum: pageNum,
        tab: tabKey
      };

      var teamName = this.params.get('teamName');
      var teamId = this.params.get('teamId');

      if(teamName){
        navigationParams['teamName'] = teamName;
      }
      if(teamId){
        navigationParams['teamId'] = teamId;
      }

      this.paginationParameters = {
        index: pageNum,
        max: input.totalPages,
        paginationType: 'module',
      };
  }

  newIndex(newPage) {
    window.scrollTo(0,0);
    this.getSchedulesData(this.selectedTabKey, newPage);
  }

  ngOnInit() {
    if( !this.initialTabKey ){
      this.initialTabKey = 'pregame';
    }
    if ( this.initialPage <= 0 ) {
      this.initialPage = 1;
    }
    this.getSchedulesData(this.initialTabKey, this.initialPage);
  }

}
