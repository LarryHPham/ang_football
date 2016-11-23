import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from '../../global/vertical-global-functions';

//services
import { DraftHistoryService } from '../../services/draft-history.service';
import { ListPageService } from '../../services/list-page.service';
import { ProfileHeaderService } from '../../services/profile-header.service';
import { SchedulesService } from '../../services/schedules.service';

//interfaces
import { DetailListInput } from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import { ModuleFooterData, FooterStyle } from '../../fe-core/components/module-footer/module-footer.component';
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import { TitleInputData } from '../../fe-core/components/title/title.component';



declare var moment;

@Component({
    selector: 'schedules-page',
    templateUrl: './app/webpages/schedules-page/schedules.page.html',
})

export class SchedulesPage implements OnInit {
  public partnerID: string;
  public scope: string;
  public paramsub: any;
  public initialPage: number;
  public initialTabKey: string;
  public teamID: number;
  public teamName: string;

  profileHeaderData: TitleInputData;
  errorData: any;
  paginationParameters: any;
  isError: boolean = false;
  tabData: any;
  limit: number = 10;
  isFirstRun: number = 0;

  schedulesData: any;
  scheduleFilter1: Array<any>;
  scheduleFilter2: Array<any>;
  selectedFilter1: string
  selectedFilter2: string;
  eventStatus: string;

  public selectedTabKey: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private _schedulesService: SchedulesService,
    private profHeadService: ProfileHeaderService,
    private _title: Title
  ) {
    this.isFirstRun = 0;

    this.paramsub = this.activateRoute.params.subscribe(
      (param :any)=> {
        this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';
        this.initialPage = Number(param['pageNum']);
        this.partnerID = param['partnerID'];
        this.teamID = param['teamID'];
        this.teamName = param['teamName'];
        this.selectedFilter1 = param["year"];
        this.selectedTabKey = param["tab"] == null ? 'pregame' : param["tab"];
        this.initialTabKey = !this.selectedTabKey ? 'pregame' : this.initialTabKey;
        this.eventStatus = this.selectedTabKey;

        if (this.initialPage <= 0) {
            this.initialPage = 1;
        }
        this.getSchedulesData(this.initialTabKey, this.initialPage, this.selectedFilter1, this.selectedFilter2);
      }
    );
  } //constructor

  ngOnInit() {} //ngOnInit



  resetDropdown1() {
    this.scheduleFilter1 = null;
    this.selectedFilter1 = null;
  }
  resetDropdown2() {
    this.scheduleFilter2 = null;
    this.selectedFilter2 = null;
  }



  private scheduleTab(tab) {
    this.isFirstRun = 0;
    this.initialPage = 1;
    if (tab == 'Upcoming Games') {
      this.isFirstRun = 1;
      this.eventStatus = 'pregame';
      this.selectedTabKey = this.eventStatus;
      this.getSchedulesData(this.eventStatus, this.initialPage, null, null);
    } else if (tab == 'Previous Games') {
      if (this.selectedFilter1 == null || this.selectedFilter1 == 'all') {
        this.resetDropdown1();
      }
      this.eventStatus = 'postgame';
      this.selectedTabKey = this.eventStatus;
      this.getSchedulesData(this.eventStatus, this.initialPage, this.selectedFilter1, this.selectedFilter2);
    } else {
      this.eventStatus = 'pregame';
      this.selectedTabKey = this.eventStatus;
      this.getSchedulesData(this.eventStatus, this.initialPage, this.selectedFilter1, this.selectedFilter2);// fall back just in case no status event is present
    }
  } //scheduleTab



  private getSchedulesData(status, pageNum, year?, week?) {
    var teamId = this.teamID; //determines to call league page or team page for schedules-table
    console.log('getSchedulesData - ',teamId);
    if (typeof year == 'undefined') {
      year == new Date().getFullYear();
      this.selectedFilter1 = year;
    }
    if (teamId) {
      this.profHeadService.getTeamProfile(Number(teamId))
      .subscribe(
        data => {
          // this._title.setTitle(GlobalSettings.getPageTitle("Schedules", data.teamName));
          data.teamName=data.headerData.teamMarket?data.headerData.teamMarket+" "+ data.teamName:data.teamName;
          this.profileHeaderData = this.profHeadService.convertTeamPageHeader(this.scope, data, "Current Season Schedule - " + data.teamName);
          this.errorData = {
            data: data.teamName + " has no record of any more games for the current season.",
            icon: "fa fa-calendar-times-o"
          }
        },
        err => {
          this.isError = true;
          console.log('Error: Schedules Profile Header API: ', err);
        // this.isError = true;
        }
      );
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'team', status, this.limit, this.initialPage, teamId, (schedulesData) => {
        this.schedulesData = schedulesData;
        if (this.schedulesData != null) {
          if (status == 'pregame') {
            this.scheduleFilter1 = null;
          } else {
            this.scheduleFilter1 = schedulesData.seasons;
            if (this.selectedFilter1 == null) {
              this.selectedFilter1 = this.schedulesData.seasons['data'][0].key;
            }
            // if(this.scheduleFilter1 == null){// only replaces if the current filter is not empty
            // }
          }
          this.tabData = schedulesData.tabs;
          } else if (this.schedulesData == null) {
            this.isError = true;
          }
          this.setPaginationParams(schedulesData.pageInfo, status, pageNum);
      }, year, week)
    } else {
    // this._title.setTitle(GlobalSettings.getPageTitle("Schedules", "Football"));
    this.profHeadService.getLeagueProfile(this.scope)
      .subscribe(
        data => {
          var currentDate = new Date();// no stat for date so will grab current year client is on
          var display: string;
          if (currentDate.getFullYear() == currentDate.getFullYear()) {// TODO must change once we have historic data
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
      if (year == null || year == 'all') {
        year = new Date().getFullYear();
      }
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'league', status, this.limit, this.initialPage, null, (schedulesData) => {
      this.schedulesData = schedulesData;
      if (this.schedulesData != null) {
        if (status == 'pregame' || status == 'created') {
          this.scheduleFilter1 = null;
        } else {
          if (this.scheduleFilter1 == null) {// only replaces if the current filter is not empty
            this.scheduleFilter1 = schedulesData.seasons;
          }
        }
        if (schedulesData.carData.length > 0) {
          this.scheduleFilter2 = schedulesData.weeks;
        } else {
          this.scheduleFilter2 = null;
        }
        this.schedulesData = schedulesData;
        this.tabData = schedulesData != null ? schedulesData.tabs : null;
      } else if (this.schedulesData == null) {
        this.isError = true;
      }
      this.setPaginationParams(schedulesData.pageInfo, status, pageNum);
    }, year, week)
    }
  } //getSchedulesData



  private filterDropdown(filter) {
    let tabCheck = 0;
    if (this.eventStatus == 'postgame') {
        tabCheck = -1;
    }
    if (this.isFirstRun > tabCheck) {
        var teamId = this.teamID;
        let filterChange = false;
        if (filter.value == 'filter1' && this.eventStatus == 'postgame' && this.selectedFilter1 != filter.key) {
            this.selectedFilter1 = filter.key;
            if (this.selectedFilter2 != null) {
                this.selectedFilter2 = this.scheduleFilter2['data'][0].key;//reset weeks to first in dropdown
            }
            filterChange = true;
        }
        if (!teamId) {
            if (filter.value == 'filter2' && this.selectedFilter2 != filter.key) {
                this.selectedFilter2 = filter.key;
                filterChange = true;
            }
        }
        if (filterChange) {
            this.isFirstRun = 0;
            this.initialPage = 1;
            this.getSchedulesData(this.eventStatus, this.initialPage, this.selectedFilter1, this.selectedFilter2);
        }
    }
    this.isFirstRun++;
  } //filterDropdown



  //PAGINATION
  //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
  setPaginationParams(input, tabKey: string, pageNum: number) {
    // var pageType;
    var navigationParams = {
        pageNum: pageNum,
        tab: tabKey
    };

    var teamName = this.teamName;
    var teamId = this.teamID;

    if (teamName) {
        navigationParams['teamName'] = teamName;
    }
    if (teamId) {
        navigationParams['teamId'] = teamId;
    }

    this.paginationParameters = {
        index: pageNum,
        max: input.totalPages,
        paginationType: 'module',
    };
  } //setPaginationParams



  newIndex(newPage) {
    window.scrollTo(0, 0);
    this.isFirstRun = 0;
    this.initialPage = newPage;

    this.getSchedulesData(this.selectedTabKey, newPage, this.selectedFilter1, this.selectedFilter2);
  } //newIndex

}
