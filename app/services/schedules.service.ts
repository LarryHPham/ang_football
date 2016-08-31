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
  getSchedule(scope, profile, eventStatus, limit, pageNum, id?, year?){
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = this._apiUrl+'/schedule/'+profile;

    if(profile == 'league'){//if league call then add scope
      callURL += '/'+ scope;
    }

    if(typeof id != 'undefined' && profile != 'league'){//if team id is being sent through
      callURL += '/'+id;
    }
    callURL += '/'+eventStatus+'/'+year+'/'+limit+'/'+ pageNum;  //default pagination limit: 5; page: 1
    console.log(callURL);
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  getScheduleTable(dataSchedule, scope, profile, eventStatus, limit, pageNum, teamId, callback: Function, year?){
    var jsYear = new Date().getFullYear();//DEFAULT YEAR DATA TO CURRENT YEAR
    var displayYear;
    var eventTab:boolean = false;

    if(typeof year == 'undefined'){
      year = new Date().getFullYear();//once we have historic data we shall show this
      year = 2015;// TODO test
    }

    if(jsYear == year){
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

    this.getSchedule(scope, profile, eventStatus, limit, pageNum, teamId, year)
    .subscribe( data => {
      var gamesData = data.data != null? data.data.games:null;
      if(gamesData.length > 0){
        let isTeamProfilePage = profile == 'league' ? false :true;
        var tableData = this.setupTableData(eventStatus, year, gamesData, teamId, limit, isTeamProfilePage);
        var tabData = [
          {display: 'Upcoming Games', data:'pregame', disclaimer:'Times are displayed in ET and are subject to change', season:displayYear, tabData: new ScheduleTabData(this.formatGroupName(year,'pregame'), eventTab)},
          {display: 'Previous Games', data:'postgame', disclaimer:'Games are displayed by most recent.', season:displayYear, tabData: new ScheduleTabData(this.formatGroupName(year,'postgame'), !eventTab)}
        ];
        var scheduleData = {
          data:tableData,
          tabs:tabData,
          carData: this.setupCarouselData(gamesData, tableData[0], limit),
          pageInfo:{
            totalPages: data.data != null ? data.data.info.pages:0,
            totalResults: data.data != null ? data.data.info.total:0,
          }
        }
        callback(scheduleData);
      }
    })
  }



  setupSlideScroll(data, scope, profile, eventStatus, limit, pageNum, callback: Function){
    this.getSchedule(scope, 'league', eventStatus, limit, pageNum)
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
    data.forEach(function(val,index){
      let reportText = 'GAME REPORT';
      let partner = GlobalSettings.getHomeInfo();
      var reportLink;
      let reportUrl = val.reportUrlMod.split('/')[2];
      if(val.live == true){
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
        reportLink = partner.partnerName + val.reportUrlMod;
      }else{
        reportLink = val.reportUrlMod;
      }

      let date = moment(val.startDateTimestamp).tz('America/New_York').format('MMMM D, YYYY');
      let time = moment(val.startDateTimestamp).tz('America/New_York').format('h:mm A z');
      newData = {
        date: date + " &bull; " + time,
        awayImageConfig: self.imageData('image-44', 'border-1', GlobalSettings.getImageUrl(val.awayTeamLogo), VerticalGlobalFunctions.formatTeamRoute(val.awayTeamName, val.awayTeamId)),
        homeImageConfig: self.imageData('image-44', 'border-1', GlobalSettings.getImageUrl(val.homeTeamLogo), VerticalGlobalFunctions.formatTeamRoute(val.homeTeamName, val.homeTeamId)),
        awayTeamName: val.awayTeamLastName,
        homeTeamName: val.homeTeamLastName,
        awayLink: VerticalGlobalFunctions.formatTeamRoute(val.awayTeamName, val.awayTeamId),
        homeLink: VerticalGlobalFunctions.formatTeamRoute(val.homeTeamName, val.homeTeamId),
        reportDisplay: reportText,
        reportLink: reportLink,
        isLive: val.live == true ? 'schedule-live' : '',
        inning: val.inning != null ? " " + val.inning + "<sup>" + GlobalFunctions.Suffix(Number(val.inning)) + "</sup>": null
      }
      modifiedArray.push(newData);
    });
    return modifiedArray;
  }
  getInning(url){// should only run if game is live and pregame
    var inning = {
      'pregame-report':0,
      'first-inning-report':1,
      'second-inning-report':2,
      'third-inning-report':3,
      'fourt-inning-report':4,
      'fifth-inning-report':5,
      'sixth-inning-report':6,
      'seventh-inning-report':7,
    }
    if(inning[url] == null){
      inning[url] = 8;
    }
    return inning[url];
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
      // let tableName = this.formatGroupName(year,eventStatus);
      var table = new SchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage);
      var tableArray = new SchedulesTableData('' , table, currentTeamProfile);
      return [tableArray];
    }else{
      var postDate = [];
      var dateObject = {};

      // let tableName = this.formatGroupName(year,eventStatus);
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
        var tableArray = new SchedulesTableData('' , table, currentTeamProfile);

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
