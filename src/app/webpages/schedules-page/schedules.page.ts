import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from '../../global/global-functions';
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { ProfileHeaderService } from '../../services/profile-header.service';
import { SchedulesService } from '../../services/schedules.service';
import { SeoService } from "../../seo.service";

//interfaces
import { DetailListInput } from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import { ModuleFooterData, FooterStyle } from '../../fe-core/components/module-footer/module-footer.component';
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import { TitleInputData } from '../../fe-core/components/title/title.component';



//libraries
declare var moment;



@Component({
    selector: 'schedules-page',
    templateUrl: './schedules.page.html',
})

export class SchedulesPage implements OnInit {
  public partnerID: string;
  public scope: string;
  public routeScope: string;
  public paramsub: any;
  public initialPage: number;
  public initialTabKey: string;
  public teamID: number;
  public teamName: string;
  public pageNum: number;
  public storedPartnerParam: string;
  public pageType: string;
  public seasonBase: string;
  public activeTab: any;
  public selectedTabKey: string;
  public selectedTabDisplay: string;

  profileHeaderData: TitleInputData;
  errorData: any;
  paginationParameters: any;
  isError: boolean = false;
  tabData: any;
  limit: number = 10;
  isFirstRun: number = 0;

  schedulesData: any;
  scheduleFilter1: Array<any>;
  scheduleFilter2: any;
  selectedFilter1: string;
  selectedFilter1Param: string; //values form url and do not change
  selectedFilter2: string;
  selectedFilter2Param: string; //values form url and do not change
  eventStatus: string;
  currentYear = moment().year();


  constructor(
    private activateRoute: ActivatedRoute,
    private _router: Router,
    private _schedulesService: SchedulesService,
    private profHeadService: ProfileHeaderService,
    private _title: Title,
    private _seoService: SeoService
  ) {
  //  this.isFirstRun = 0;
    this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();
    this.paramsub = this.activateRoute.params.subscribe(
        (param :any)=> {
            let route = this._router.url.split('/');
            this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
            this.routeScope = param['scope'].toLowerCase();
            this.pageType = this.storedPartnerParam != '' ?
                            route[3] :
                            route[2];
            this.initialPage = Number(param['pageNum']);
            this.partnerID = param['partnerID'];
            this.teamID = param['teamID'];
            this.teamName = param['teamName'];
            this.selectedFilter1 = param["year"] ? param["year"] : this.currentYear;
            this.selectedTabKey = param["tab"];
            this.pageNum = param['pageNum'] ? param['pageNum'] : 1;
            this.initialTabKey = !this.selectedTabKey ? 'pregame' : this.initialTabKey;
            this.eventStatus = this.selectedTabKey;
            if (this.initialPage <= 0) {
                this.initialPage = 1;
            }
            this.selectedFilter2 = this.scheduleFilter2 ? this.scheduleFilter2['data'][0].key : null; // always reset filter2 on page load
            this.getSchedulesData(this.selectedTabKey, this.initialPage, this.selectedFilter1, this.selectedFilter2);
        }
    );
  } //constructor



  ngOnInit() {} //ngOnInit



  private metaTags(data) {
    //This call will remove all meta tags from the head.
    this._seoService.removeMetaTags();
    //create meta description that is below 160 characters otherwise will be truncated
    let text3 = data.text3 != null ? data.text3: '';
    let text4 = data.text4 != null ? '. '+data.text4: '';
    let title = text3 + ' ' + text4;
    let metaDesc = text3 + ' ' + text4 + ' as of ' + data.text1;
    let imageUrl;
    if(data.imageURL != null && data.imageURL != ""){
       imageUrl = data.imageURL;
    }else{
       imageUrl = GlobalSettings.getmainLogoUrl();
    }
    let link = window.location.href;
    let keywords = "football";
    this._seoService.setTitle(title);
    this._seoService.setMetaDescription(metaDesc);
    this._seoService.setMetaRobots('INDEX, FOLLOW');
    this._seoService.setCanonicalLink();
    this._seoService.setOgTitle(title);
    this._seoService.setOgDesc(metaDesc +". Know more about football.");
    this._seoService.setOgType('Website');
    this._seoService.setOgUrl();
    this._seoService.setOgImage(imageUrl);
    //Elastic Search
    this._seoService.setMetaDescription(metaDesc);
    this._seoService.setPageTitle(title);
    this._seoService.setPageType("Schedule Page");
    this._seoService.setPageUrl();
    this._seoService.setImageUrl(imageUrl);
    this._seoService.setKeyWord(keywords);
  } //metaTags



  private getSchedulesData(status, pageNum, year?, week?) {
    var teamId = this.teamID; //determines to call league page or team page for schedules-table
    year = year ? year : this.seasonBase;
    if (teamId) {
      this.profHeadService.getTeamProfile(Number(teamId))
      .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
      .subscribe(
        data => {
          this.seasonBase = data.headerData.seasonBase;
          data.teamName=data.headerData.teamMarket?data.headerData.teamMarket+" "+ data.teamName:data.teamName;
          this.profileHeaderData = this.profHeadService.convertTeamPageHeader(this.scope, data, "Current Season Schedule - " + data.teamName);
          this.metaTags(this.profileHeaderData);
          this.errorData = {
            data: data.teamName + " has no record of any more games for the current season.",
            icon: "fa fa-calendar-times-o"
          }
        },
        err => {
          this.isError = true;
          console.log('Error: Schedules Profile Header API: ', err);
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
          }
          this.schedulesData = schedulesData ? schedulesData : null;
          this.tabData = this.schedulesData.tabs ? this.getSelectedTab(this.schedulesData.tabs) : null;
          } else if (this.schedulesData == null) {
            this.isError = true;
          }
      }, year, week)
    } else {
    this.profHeadService.getLeagueProfile(this.scope)
      .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
      .subscribe(
        data => {
            this.seasonBase = data.headerData.seasonBase;
            var currentDate = new Date();// no stat for date so will grab current year client is on
            var display: string;
            if (currentDate.getFullYear() == currentDate.getFullYear()) {// TODO must change once we have historic data
                display = "Current Season"
            }
            var pageTitle = display + " Schedules - " + data.headerData.leagueFullName;
            this.profileHeaderData = this.profHeadService.convertLeagueHeader(data.headerData, pageTitle);
            this.metaTags(this.profileHeaderData);
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
        year = null;
      }
      this._schedulesService.getScheduleTable(this.schedulesData, this.scope, 'league', status, this.limit, pageNum, null, (schedulesData) => {
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
        }
        this.schedulesData = schedulesData ? schedulesData : null;
        this.tabData = this.schedulesData.tabs ? this.getSelectedTab(this.schedulesData.tabs) : null;
      } else if (this.schedulesData == null) {
        this.isError = true;
      }
    }, year, week)
    }
  } //getSchedulesData



  private filterDropdown(filter) {
      if ( filter.value == "filter1" ) { //Season filter
        let newRoute;
        let newFilter = filter.key ? filter.key : this.seasonBase;
        let currentFilter = this.selectedFilter1;
        if ( newFilter != currentFilter ) {
            newRoute = this.teamID ?
            [this.storedPartnerParam, this.routeScope, this.pageType, this.teamName, this.teamID, newFilter, this.selectedTabKey, this.pageNum] :
            [this.storedPartnerParam, this.routeScope, this.pageType, 'league', newFilter, this.selectedTabKey, this.pageNum];
            this._router.navigate(newRoute);
        }
      }
      else if ( filter.value == "filter2" ) {
          this.selectedFilter2 = filter.key;
          this.getSchedulesData(this.eventStatus, this.initialPage, this.selectedFilter1, this.selectedFilter2);
      }
  } //filterDropdown



  private scheduleTab(tab) {
      let newRoute;
      let newTab;
      let filter;
      if ( tab == 'Previous Games' ) {
          newTab = 'postgame';
          filter = this.selectedFilter1 == 'all' ? this.seasonBase : this.selectedFilter1;
          newRoute = this.teamID ?
                      [this.storedPartnerParam, this.routeScope, this.pageType, this.teamName, this.teamID, filter, newTab, this.pageNum] :
                      [this.storedPartnerParam, this.routeScope, this.pageType, 'league', filter, newTab, this.pageNum];
          this._router.navigate(newRoute);
      }
      else if ( tab == 'Upcoming Games' ) {
          newTab = 'pregame';
          newRoute = this.teamID ?
                      [this.storedPartnerParam, this.routeScope, this.pageType, this.teamName, this.teamID, 'all', newTab, this.pageNum] :
                      [this.storedPartnerParam, this.routeScope, this.pageType, 'league', 'all', newTab, this.pageNum];
          this._router.navigate(newRoute);
      }
  } //scheduleTab



  public getSelectedTab(tabsData) {
      let matchingTabs = tabsData.filter(value => value.data == this.selectedTabKey);
      matchingTabs[0]['tabData'].sections = this.schedulesData.data;
      matchingTabs[0]['tabData'].isActive = true;
      this.selectedTabDisplay = matchingTabs[0].display;
      return tabsData;
  }



  //PAGINATION
  //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
  setPaginationParams(input, year: string, tab: string, pageNum: number) {
    // var pageType;
    // var navigationPage = '/' + this.scope + '/schedules/';
    // if (!teamName && !teamId) {
    //   navigationPage = '/' + this.scope + '/schedules/league';
    // }
    // var navigationParams = {
    //     year: year,
    //     tab: tab,
    //     pageNumber: pageNum
    // };
    //
    // var teamName = this.teamName;
    // var teamId = this.teamID;
    //
    // if (teamName) {
    //     navigationParams['teamName'] = teamName;
    // }
    // if (teamId) {
    //     navigationParams['teamId'] = teamId;
    // }
    //
    // this.paginationParameters = {
    //     index: pageNum,
    //     max: input.totalPages,
    //     paginationType: 'module',
    //     navigationPage: navigationPage,
    //     navigationParams,
    //     indexKey: 'pageNumber'
    // }
  } //setPaginationParams



  ngOnDestroy(){
    this.paramsub.unsubscribe();
  } //ngOnDestroy

}
