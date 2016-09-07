import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, SportPageParameters} from '../global/global-interface';
import {SchedulesCarouselInput} from '../fe-core/components/carousels/schedules-carousel/schedules-carousel.component';
import {SchedulesData, SchedulesTableModel, SchedulesTableData, ScheduleTabData} from './schedules.data';
import {Gradient} from '../global/global-gradient';
import {scheduleBoxInput} from '../fe-core/components/schedule-box/schedule-box.component';

declare var moment: any;

@Injectable()
export class SchedulesService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){

  }

  getLinkToPage(pageParams: SportPageParameters, teamName?: string): Array<any> {
    var pageName = "Schedules-page";
    var pageValues = {};

    if ( pageParams.teamId && teamName ) {
      pageValues["teamId"] = pageParams.teamId;
      pageValues["teamName"] = teamName;
      pageName += "-team";
    }
    else if( !pageParams.teamId && !teamName ) {
      pageName += "-league";
    }
    else{
      //go to error page
    }
    return [pageName, pageValues];
  }// Returns all parameters used to get to page of Schedules


  getModuleTitle(teamName?: string): string {
    let moduletitle = "Weekly Schedules";
    if ( teamName ) {
      moduletitle += "<span class='mod-info'> - " + teamName + "</span>";
    } else {
      moduletitle += "<span class='mod-info> - League" + "</span>";
    }
    return moduletitle;
  }// Sets the title of the modules with data returned by schedules


  getPageTitle(teamName?: string): string {
    let pageTitle = "Football Schedules Breakdown";
    if ( teamName ) {
      pageTitle = "Football Schedules - " + teamName;
    }
    return pageTitle;
  }// Sets the title of the Page with data returne by shedules

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  //possibly simpler version of getting schedules api call
  getSchedule(scope, profile, eventStatus, limit, pageNum, id?, year?, week?){
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = this._apiUrl+'/schedule/'+profile;
    if(typeof year == 'undefined'){
      year = null;
    }

    if(profile == 'league'){//if league call then add scope
      callURL += '/'+ scope;
    }

    if(typeof id != 'undefined' && profile != 'league'){//if team id is being sent through
      callURL += '/'+id;
    }

    callURL += '/'+eventStatus+'/'+year+'/'+limit+'/'+ pageNum;  //default pagination limit: 5; page: 1
    //optional week parameters
    if( week != null){
      callURL += '/'+week;
    }
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  getScheduleTable(dataSchedule, scope, profile, eventStatus, limit, pageNum, teamId, callback: Function, year?, week?){
    var jsYear = new Date().getFullYear();//DEFAULT YEAR DATA TO CURRENT YEAR
    var displayYear;
    var eventTab:boolean = false;

    if(jsYear == year || year == null){
      displayYear = "Current Season";
    }else{
      displayYear = year + " Season";
    }

    //eventType determines which tab is highlighted
    if(eventStatus == 'pregame'){
      eventTab = true;
    }else{
      eventTab = false;
    }
    if(typeof year == 'undefined'){
      year = null;
      week = null;
    }
    this.getSchedule(scope, profile, eventStatus, limit, pageNum, teamId, year, week)
    .subscribe( data => {
      var gamesData = data.data != null? data.data.games:null;
      var scheduleData;
        let isTeamProfilePage = profile == 'league' ? false :true;
        var tableData = this.setupTableData(eventStatus, year, gamesData, teamId, limit, isTeamProfilePage);
        var tabData = [
          {display: 'Upcoming Games', data:'pregame', disclaimer:'Times are displayed in ET and are subject to change', season:displayYear, tabData: new ScheduleTabData(this.formatGroupName(year,'pregame'), eventTab)},
          {display: 'Previous Games', data:'postgame', disclaimer:'Games are displayed by most recent.', season:displayYear, tabData: new ScheduleTabData(this.formatGroupName(year,'postgame'), !eventTab)}
        ];
        scheduleData = {
          data:tableData,
          tabs:tabData,
          carData: this.setupCarouselData(gamesData, tableData[0], limit),
          pageInfo:{
            totalPages: data.data != null ? data.data.info.pages:0,
            totalResults: data.data != null ? data.data.info.total:0,
          },
          seasons: data.data.info.seasons.length > 0 ? this.formatYearDropdown(data.data.info.seasons.sort(function(a, b){return b-a})):null,
          weeks: data.data.info.weeks.length > 0 ? this.formatWeekDropdown(data.data.info.weeks):null
        }
        callback(scheduleData);
      },
    err => callback(null))
  }

  formatYearDropdown(data){
    let yearArray = [];
    data.forEach(function(val){
      let yearObj = {};
      yearObj['key'] = val;
      yearObj['value'] = val;
      yearArray.push(yearObj);
    })
    return yearArray;
  }
  formatWeekDropdown(data){
    let yearArray = [];
    data.forEach(function(val){
      let yearObj = {};
      let weekDisplay;
      switch(val){
        case '18':
          weekDisplay = 'Wild Card';
        break;
        case '19':
          weekDisplay = 'Divisional Round';
        break;
        case '20':
          weekDisplay = 'Pro Bowl';
        break;
        case '21':
          weekDisplay = 'Super Bowl';
        break;
        default:
        weekDisplay = 'Week '+val;
      }
      yearObj['key'] = val;
      yearObj['value'] = weekDisplay;
      yearArray.push(yearObj);
    })
    return yearArray;
  }

  setupSlideScroll(data, scope, profile, eventStatus, limit, pageNum, callback: Function, year?, week?){
    this.getSchedule(scope, 'league', eventStatus, limit, pageNum, null, year, week)
    .subscribe( data => {
      var formattedData = this.transformSlideScroll(data.data);
      callback(formattedData);
    })
  }

  transformSlideScroll(data){
    let self = this;
    var modifiedArray = [];
    var newData:scheduleBoxInput;
    //run through and convert data to what is needed for the component
    data['games'].forEach(function(val,index){
      let reportText = 'GAME REPORT';
      let partner = GlobalSettings.getHomeInfo();
      var reportLink;
      let reportUrl = val.aiUrlMod.split('/')[2];
      if(val.eventStatus == 'inprogress'){
          reportText = 'LIVE GAME REPORT';
      }else{
        if(val.eventStatus = 'pregame'){
          reportText = 'PRE GAME REPORT'
        }else if (val.eventStatus == 'postgame'){
          reportText = 'POST GAME REPORT';
        }else{
          reportText = 'POST GAME REPORT';
        }
      }
      if(partner.isPartner){
        reportLink = partner.partnerName + val.aiUrlMod;
      }else{
        reportLink = val.aiUrlMod;
      }

      let date = moment(Number(val.eventTimestamp)*1000).tz('America/New_York').format('MMMM D, YYYY');
      let time = moment(Number(val.eventTimestamp)*1000).tz('America/New_York').format('h:mm A z');
      let team1FullName = val.team1Market + ' ' + val.tame1Name;
      let team2FullName = val.team2Market + ' ' + val.tame2Name;
      newData = {
        date: date + " &bull; " + time,
        awayImageConfig: self.imageData('image-44', 'border-1', GlobalSettings.getImageUrl(val.team2Logo), VerticalGlobalFunctions.formatTeamRoute(val.team2FullName, val.team2Id)),
        homeImageConfig: self.imageData('image-44', 'border-1', GlobalSettings.getImageUrl(val.team1Logo), VerticalGlobalFunctions.formatTeamRoute(val.team1FullName, val.team1Id)),
        awayTeamName: val.awayTeamLastName,
        homeTeamName: val.homeTeamLastName,
        awayLink: VerticalGlobalFunctions.formatTeamRoute(val.team2FullName, val.team2Id),
        homeLink: VerticalGlobalFunctions.formatTeamRoute(val.team1FullName, val.team1Id),
        reportDisplay: reportText,
        reportLink: reportLink,
        isLive: val.eventStatus == 'inprogress' ? 'schedule-live' : '',
        inning: val.eventQuarter != null ? "Current " + val.inning + ":" + Number(val.eventQuarter) + "<sup>" + GlobalFunctions.Suffix(Number(val.eventQuarter)) + "</sup>": null
      }
      modifiedArray.push(newData);
    });
    return modifiedArray;
  }


  //rows is the data coming in
  private setupTableData(eventStatus, year, rows: Array<any>, teamId, maxRows: number, isTeamProfilePage: boolean): Array<SchedulesTableData> {

    //Limit to maxRows, if necessary
    if ( maxRows !== undefined && rows.length > maxRows) {
      rows = rows.slice(0, maxRows);
    }
    var currentTeamProfile = teamId != null ? teamId : null;
    //TWO tables are to be made depending on what type of tabs the use is click on in the table
    if(eventStatus == 'pregame'){
      let tableName = this.formatGroupName(year,eventStatus);
      var table = new SchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage);
      var tableArray = new SchedulesTableData(tableName , table, currentTeamProfile);
      return [tableArray];
    }else{
      var postDate = [];
      var dateObject = {};

      let tableName = this.formatGroupName(year,eventStatus);
      if(typeof teamId == 'undefined'){
        var table = new SchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage);// there are two types of tables for Post game (team/league) tables
        rows.forEach(function(val,index){// seperate the dates into their own Obj tables for post game reports
          var splitToDate = moment(val.startDateTimestamp).tz('America/New_York').format('YYYY-MM-DD');
          if(typeof dateObject[splitToDate] == 'undefined'){
            dateObject[splitToDate] = {};
            dateObject[splitToDate]['tableData'] = [];
            dateObject[splitToDate]['display'] = moment(val.startDateTimestamp).tz('America/New_York').format('dddd MMMM Do, YYYY') + " Games";
            dateObject[splitToDate]['tableData'].push(val);
          }else{
            dateObject[splitToDate]['tableData'].push(val);
          }
        });
        for(var date in dateObject){
          var newPostModel = new SchedulesTableModel(dateObject[date]['tableData'], eventStatus, teamId, isTeamProfilePage);
          var newPostTable = new SchedulesTableData(dateObject[date]['display'], newPostModel, currentTeamProfile);
          postDate.push(newPostTable);
        }
        return postDate;
      }else{//if there is a teamID
        var table = new SchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage);// there are two types of tables for Post game (team/league) tables
        var tableArray = new SchedulesTableData(tableName , table, currentTeamProfile);
        return [tableArray];
      }
    }
  }

  private setupCarouselData(origData: Array<SchedulesData>, tableData: SchedulesTableData, maxRows?: number){
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      origData = origData.slice(0, maxRows);
    }
    var carData = origData.map(function(val, index){
      var displayNext = '';
      if(val.eventStatus == 'pregame'){
        var displayNext = 'Next Game:';
      }else{
        var displayNext = 'Previous Game:';
      }
      val.team1Wins = val.team1Record.split('-')[0];
      val.team1Losses = val.team1Record.split('-')[1];
      val.team2Wins = val.team2Record.split('-')[0];
      val.team2Losses = val.team2Record.split('-')[1];

      if(val.team1Wins === null){
        val.team1Wins = '#';
      }
      if(val.team1Losses === null){
        val.team1Losses = '#';
      }
      if(val.team2Wins === null){
        val.team2Wins = '#';
      }
      if(val.team2Losses === null){
        val.team2Losses = '#';
      }
      // combine together the win and loss of a team to create their record
      val.homeRecord = val.team1Wins + '-' + val.team1Losses;//?? is this really the win and loss
      val.awayRecord = val.team2Wins + '-' + val.team2Losses;//?? is this really the win and loss

      return tableData.updateCarouselData(val, index); //Use existing conversion function
    });
    return carData;
  }

  private formatGroupName(year, eventStatus): string {
    var currentDate = new Date().getFullYear();
    let games = "";
    if ( eventStatus == 'pregame' ) {
      games = "<span class='text-heavy>Current Season</span> Upcoming Games";
    }
    else if(year == currentDate){
      games = "<span class='text-heavy>Current Season</span> Previously Played Games";
    }else{
      games = year + " Season";
    }
    return games;
  }

  imageData(imageClass, imageBorder, mainImg, mainImgRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.svg";
    }
    var image: CircleImageData = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<i class='fa fa-mail-forward'></i>",
            imageClass: imageBorder,
        },
    };
    return image;
  }
}
