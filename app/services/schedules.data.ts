import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {TableTabData, TableComponentData} from '../fe-core/components/schedules/schedules.component';
import {SchedulesCarouselInput} from '../fe-core/components/carousels/schedules-carousel/schedules-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';

declare var moment: any;

export interface SchedulesData {
  //TEAM1 => HOME
  //TEAM2 => AWAY
  index:any;
  backgroundImage: string,//TODO missing
  eventTimestamp: string,
  id: string,//eventID from API
  eventStatus: string,
  team1Id: string,
  team2Id: string,
  siteId: string,//TODO missing
  team1Score: string,
  team2Score: string,
  homeOutcome: string,//TODO missing
  awayOutcome: string,//TODO missing
  seasonId: string,
  team1Logo: string,
  team1ColorHex: string,
  team1City: string,
  team1State: string,
  team1Stadium: string,
  team1Market: string, //first name
  team1Name: string, //last name
  homeTeamNickname: string, //TODO missing
  homeTeamAbbreviation: string, //TODO missing
  homeTeamWins: string, //TODO missing
  homeTeamLosses: string, //TODO missing
  team2Logo: string,
  team2ColorHex: string,
  team2City: string,
  team2State: string,
  team2Stadium: string,
  team2Market: string, //first name
  team2Name: string, //last name
  awayTeamNickname: string,//TODO missing
  awayTeamAbbreviation: string,//TODO missing
  awayTeamWins: string,//TODO missing
  awayTeamLosses: string,//TODO missing
  reportUrlMod: string, //TODO missing
  results:string, //TODO missing
  targetTeamWinsCurrent: string; //TODO missing
  targetTeamLossesCurrent: string; //TODO missing
  /**
   * - Formatted from league and division values that generated the associated table
   */
  groupName?: string;

  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;

  /**
   * Formatted full path to image
   */
  fullImageUrl?: string;

  /**
   * Formatted full path to image
   */
  fullBackgroundImageUrl?: string;

  /**
   * Formatted home record
   */
  homeRecord?: string;

  /**
   * Formatted away record
   */
  awayRecord?: string;
}

export class ScheduleTabData implements TableTabData<SchedulesData> {

  title: string;

  display:string;

  dataType: string;

  season: string;

  isActive: boolean;

  sections: Array<SchedulesTableData>;

  constructor(title: string, isActive: boolean) {
    this.title = title;
    this.isActive = isActive;
    this.sections = [];
  }
}

export class SchedulesTableData implements TableComponentData<SchedulesData> {
  groupName: string;

  tableData: any;

  currentTeamProfile: string;

  constructor(title: string, table: any, currentTeamProfile: string) {
    this.groupName = title;
    this.tableData = table;
    this.currentTeamProfile = currentTeamProfile;
  }

  updateCarouselData(item: SchedulesData, index:number){//ANY CHANGES HERE CHECK setupTableData in schedules.service.ts
    var displayNext = '';
    if(item.eventStatus == 'pre-event'){
      var displayNext = 'Next Game:';
    }else{
      var displayNext = 'Previous Game:';
    }
    var teamRouteAway = this.currentTeamProfile == item.awayTeamId ? null : MLBGlobalFunctions.formatTeamRoute(item.awayTeamName, item.awayTeamId);
    var teamRouteHome = this.currentTeamProfile == item.homeTeamId ? null : MLBGlobalFunctions.formatTeamRoute(item.homeTeamName, item.homeTeamId);
    var colors = Gradient.getColorPair(item.awayTeamColors.split(','), item.homeTeamColors.split(','));

    return {//placeholder data
      index:index,
      displayNext: displayNext,
      backgroundGradient: Gradient.getGradientStyles(colors),
      displayTime: moment(item.startDateTimestamp).tz('America/New_York').format('dddd MMMM Do, YYYY | h:mm A') + " ET", //hard coded TIMEZOME since it is coming back from api this way
      detail1Data:'Home Stadium:',
      detail1Value:item.homeTeamVenue,
      detail2Value:item.homeTeamCity + ', ' + item.homeTeamState,
      imageConfig1:{//AWAY
        imageClass: "image-125",
        mainImage: {
          imageUrl: GlobalSettings.getImageUrl(item.awayTeamLogo),
          urlRouteArray: teamRouteAway,
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-5"
        }
      },
      imageConfig2:{//HOME
        imageClass: "image-125",
        mainImage: {
          imageUrl: GlobalSettings.getImageUrl(item.homeTeamLogo),
          urlRouteArray: teamRouteHome,
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-5"
        }
      },
      teamUrl1: teamRouteAway,
      teamUrl2: teamRouteHome,
      teamName1: item.awayTeamName,
      teamName2: item.homeTeamName,
      teamLocation1:item.awayTeamCity + ', ' + item.awayTeamState,
      teamLocation2:item.homeTeamCity + ', ' + item.homeTeamState,
      teamRecord1:item.awayRecord,
      teamRecord2:item.homeRecord,
    };
  }
}

export class SchedulesTableModel implements TableModel<SchedulesData> {
  columns: Array<TableColumn>;

  rows: Array<SchedulesData>;

  selectedKey:string = "";

  private curTeam:string;//grab the current teams object name being returned to determine where the current team stands (away / home)

  private isTeamProfilePage: boolean;

  constructor(rows: Array<any>, eventStatus, teamId, isTeamProfilePage: boolean) {
    //find if current team is home or away and set the name to the current objects name
    this.curTeam = teamId ? teamId.toString() : null;
    this.isTeamProfilePage = isTeamProfilePage;
    if(eventStatus === 'pre-event'){
      this.columns = [{
         headerValue: "DATE",
         columnClass: "date-column",
         sortDirection: 1, //desc
         isNumericType: true,
         key: "date"
       },{
         headerValue: "TIME",
         columnClass: "date-column",
         ignoreSort: true,
         key: "t"
       },{
         headerValue: "AWAY",
         columnClass: "image-column location-column",
         key: "away"
       },{
         headerValue: "HOME",
         columnClass: "image-column location-column",
         key: "home"
       },{
         headerValue: "GAME SUMMARY",
         columnClass: "summary-column",
         ignoreSort: true,
         key: "gs"
       }];
    }else{
      if(typeof teamId == 'undefined'){//for league table model there should not be a teamId coming from page parameters for post game reports
        this.columns = [
        {
           headerValue: "AWAY",
           columnClass: "image-column location-column2",
           isNumericType: false,
           key: "away"
         },{
          headerValue: "HOME",
          columnClass: "image-column location-column2",
          isNumericType: false,
          key: "home"
        },{
           headerValue: "RESULTS",
           columnClass: "data-column results-column",
           isNumericType: false,
           ignoreSort: true,
           key: "r"
         },{
           headerValue: "GAME SUMMARY",
           columnClass: "summary-column",
           ignoreSort: true,
           key: "gs"
         }];
      }else{ // for team page post game report table model
        this.columns = [{
           headerValue: "DATE",
           columnClass: "date-column",
           sortDirection: -1, //asc
           isNumericType: true,
           key: "date"
         },{
           headerValue: "TIME",
           columnClass: "date-column",
           ignoreSort: true,
           key: "t"
         },{
           headerValue: "OPPOSING TEAM",
           columnClass: "image-column location-column2",
           isNumericType: false,
           key: 'opp'
         },{
           headerValue: "RESULT", //changed name for clarity to match espn
           columnClass: "data-column wl-column",
           isNumericType: false,
           key: "wl"
           },{
           headerValue: "W/L", //changed name for clarity to match espn
           columnClass: "data-column record-column",
           isNumericType: true,
           key: "rec"
         },{
           headerValue: "GAME SUMMARY",
           columnClass: "summary-column",
           ignoreSort: true,
           key: "gs"
         }];
      }

    }

    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
  }

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  getSelectedKey(): string {
    return this.selectedKey;
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].eventId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:SchedulesData, rowIndex:number): boolean {
    return this.selectedKey == item.eventId;
  }

  getCellData(item:SchedulesData, column:TableColumn):CellData {
    var display = "";
    var sort: any = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    var isLocation = false;

    var hdrColumnKey = column.key;
    if ( column.key == "opp" ) {
        hdrColumnKey = this.curTeam == item.homeTeamId ? "away" : "home";
    }

    switch (hdrColumnKey) {
      case "date":
        display = GlobalFunctions.formatDateWithAPMonth(item.startDateTimestamp, "", "D");
        sort = item.startDateTimestamp;
        break;

      case "t":
        if(item.eventStatus != 'cancelled'){
          display = moment(item.startDateTimestamp).tz('America/New_York').format('h:mm') + " <sup> "+moment(item.startDateTimestamp).tz('America/New_York').format('A')+" </sup>";
        }else{
          display = "Cancelled";
        }
        sort = item.startDateTimestamp;
        break;

      case "away":
        isLocation = true;
        display = item.awayTeamLastName.length > 10 ? item.awayTeamNickname : item.awayTeamLastName;
        sort = item.awayTeamLastName;
        imageUrl = GlobalSettings.getImageUrl(item.awayTeamLogo);
        if ( !this.isTeamProfilePage || this.curTeam != item.awayTeamId ) {
          link = MLBGlobalFunctions.formatTeamRoute(item.awayTeamName, item.awayTeamId);
        }
        break;

      case "home":
        isLocation = true;
        display = item.homeTeamLastName.length > 10 ? item.homeTeamNickname : item.homeTeamLastName;
        sort = item.homeTeamLastName;
        imageUrl = GlobalSettings.getImageUrl(item.homeTeamLogo);
        if ( !this.isTeamProfilePage || this.curTeam != item.homeTeamId ) {
          link = MLBGlobalFunctions.formatTeamRoute(item.homeTeamName, item.homeTeamId);
        }
        break;

      case "gs":
      var partnerCheck = GlobalSettings.getHomeInfo();
        if (item.eventStatus != 'cancelled'){
          var status = item.eventStatus === 'pre-event' ? "Pregame" : (item.eventStatus === 'post-event' ? "Postgame" : null);
          if ( status ) {
            // console.log("partnerCheck", partnerCheck);
            if(partnerCheck.isPartner){
              display = "<a href='" + '/' + partnerCheck.partnerName + item.reportUrlMod + "'>" + status + " Report <i class='fa fa-angle-right'><i></a>";
            }else{
              display = "<a href='" + item.reportUrlMod + "'>" + status + " Report <i class='fa fa-angle-right'><i></a>";
            }
          }
        }
        sort = item.eventStatus;
        break;

      case "r":
        if( !item.homeTeamAbbreviation ) {
          item.homeTeamAbbreviation = "N/A";
        }
        if( !item.awayTeamAbbreviation ) {
          item.awayTeamAbbreviation = "N/A";
        }
        //whomever wins the game then their text gets bolded as winner
        var home = item.homeTeamAbbreviation + " " + item.homeScore;
        var away = item.awayTeamAbbreviation + " " + item.awayScore;
        if(item.homeOutcome == 'win'){
          home = "<span class='text-heavy'>" + home + "</span>";
          sort = Number(item.homeScore);
        } else if(item.awayOutcome == 'win'){
          away = "<span class='text-heavy'>" + away + "</span>";
          sort = Number(item.awayScore);
        }
        else {
          sort = Number(item.awayScore);
        }
        display = home + " - " + away;
        break;

      case "wl":
        //shows the current teams w/l of the current game
        var scoreHome = Number(item.homeScore);
        var scoreAway = Number(item.awayScore);
        if (scoreHome > scoreAway) {
          display = item.homeOutcome.charAt(0).toUpperCase() + " " + scoreHome + " - " + scoreAway;
          sort = (scoreHome/scoreHome+scoreAway);
        }
        else
        {
          display = item.homeOutcome.charAt(0).toUpperCase() + " " + scoreAway + " - " + scoreHome;
            sort = (scoreHome/scoreHome+scoreAway);
        }
        break;

      case "rec":
        //shows the record of the current teams game at that time
        display = item.targetTeamWinsCurrent + " - " + item.targetTeamLossesCurrent;
        if (Number(item.targetTeamWinsCurrent) > Number(item.targetTeamLossesCurrent)) {
          sort = (Number(item.targetTeamWinsCurrent)/(Number(item.targetTeamLossesCurrent)+(Number(item.targetTeamWinsCurrent))));
        }
        else {
          sort = (Number(item.targetTeamLossesCurrent)/(Number(item.targetTeamWinsCurrent)+(Number(item.targetTeamLossesCurrent))));
        }
        break;
    }
    if ( isLocation ) {
      display = "<span class='location-wrap'>"+display+"</span>";
    }
    else if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl);
  }
}
