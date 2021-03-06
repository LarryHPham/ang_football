import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {StandingsTableTabData, TableComponentData} from '../fe-core/components/standings/standings.component';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface TeamStandingsData {
  teamName: string;
  imageUrl: string;
  backgroundImage: string;
  backgroundUrl: string;
  teamLogo: string;
  teamId: string;
  teamMarket: string;
  conferenceName: string;
  divisionName: string;
  lastUpdated: string;
  divisionRank: string;
  conferenceRank: string;
  leagueRank: string;
  streak: string;
  teamConferenceRecord: string;
  teamWinPercent: string;
  teamDivisionRecord: string;
  teamPointsAllowed: string;
  teamOverallRecord: string;
  seasonBase: string;
  totalLosses: string;
  totalWins: string;
  teamPointsFor: string;
  leagueAbbreviation: string;
  roadRecord: string;
  homeRecord: string;
  pageType: string;
  teamAbbreviation: string;
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
}

export class VerticalStandingsTableData implements TableComponentData<TeamStandingsData> {
  groupName: string;

  tableData: VerticalStandingsTableModel;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, table: VerticalStandingsTableModel) {
    this.groupName = title;
    this.conference = conference;
    this.division = division;
    this.tableData = table;
  }

}

export class TDLStandingsTabdata implements StandingsTableTabData<TeamStandingsData> {

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<VerticalStandingsTableData>;

  conference: Conference;


  division: Division;

  season: any;

  selectedKey: string;

  currentTeamId: string;

  conferences: Array<any>;

  divisions: Array<any>;

  seasons: Array<any>;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean, teamId: string) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
    this.currentTeamId = teamId;
  }

  getSelectedKey(): string {
    if ( !this.sections ) return "";

    var key = "";
    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.selectedKey != null && table.selectedKey != "") {
        key = table.selectedKey;
      }
    });
    return key;
  }

  setSelectedKey(key:string) {
    this.selectedKey = key;
    if ( !this.sections ) return;

    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.rows.filter(row => row.teamId == key).length > 0 ) {
        table.selectedKey = key;
      }
      else {
        table.selectedKey = "";
      }
    });
  }

  convertToCarouselItem(item: TeamStandingsData, index:number): SliderCarouselInput {
    var yearEnd = Number(item.seasonBase)+1;
    var teamFullName = item.teamMarket + ' ' + item.teamName;
    var routeScope = item.leagueAbbreviation.toLowerCase() == 'fbs' ? 'ncaaf' : item.leagueAbbreviation.toLowerCase();
    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(routeScope, teamFullName, item.teamId);
    var teamNameLink = {
        route: teamRoute,
        text: teamFullName
    };
    var rank = null;
    var rankPoint = null;
    var division = item.divisionName;
    var pagetype = item.pageType;
    var subheadercond;
    if(item.leagueAbbreviation.toLowerCase() == 'fbs'){
      var division = item.conferenceName + ": " + GlobalFunctions.toTitleCase(item.divisionName.replace(item.conferenceName, '').toLowerCase());
      subheadercond = 'NCAA STANDINGS: ' + item.leagueAbbreviation;
    }
    if(item.leagueAbbreviation.toLowerCase() == 'nfl' && item.pageType != 'league'){
      var divisionName = item.divisionName;
      if (divisionName != null) {divisionName = divisionName.replace(item.conferenceName, "");} else {divisionName = "";}
      subheadercond = item.conferenceName + ' ' + divisionName + ' STANDINGS - ' + item.teamName;
    }
    if(item.pageType == 'league' && item.leagueAbbreviation.toLowerCase() == 'nfl'){
      subheadercond = item.leagueAbbreviation + ' ' + 'STANDINGS'
    }
    //fbs divison sends back all uppercase and needs to be camel case
    if(this.conference !== undefined && this.division !== undefined){
      rank = item.divisionRank != null ? Number(item.divisionRank) : 'N/A';
      rankPoint =  item.divisionName;
      if(item.leagueAbbreviation.toLowerCase() == 'fbs'){
        rankPoint = item.conferenceName + ": " + GlobalFunctions.toTitleCase(item.divisionName.replace(item.conferenceName, '').toLowerCase());
      }
    } else if(this.conference !== undefined && this.division === undefined){
      if(item.conferenceName == item.divisionName){
        rank = item.divisionRank != null ? item.divisionRank : 'N/A';
      } else {
        rank = item.conferenceRank != null ? Number(item.conferenceRank) : 'N/A';
      }
      rankPoint = item.conferenceName;
    } else {
      rank = item.leagueRank != null ? Number(item.leagueRank) : 'N/A';
      rankPoint = item.leagueAbbreviation.toUpperCase();
    }
    var overallRecord = item.teamOverallRecord ? item.teamOverallRecord : 'N/A';

      // subheader: Array<Link | string>;
      // profileNameLink: Link;
      // description: Array<Link | string>;
      // copyrightInfo?: string;
      // lastUpdatedDate: string;
      // backgroundImage?: string;
      // circleImageUrl: string;
      // circleImageRoute: Array<any>;
      // subImageUrl?: string;
      // subImageRoute?: Array<any>;
      // rank?: string;
      // rankClass?: string;
      // noData?: boolean;
    return SliderCarousel.convertToCarouselItemType1(index, {
      subheader: [subheadercond],
      profileNameLink: teamNameLink,
      description:[
        "The ", teamNameLink,
        " are currently <span class='text-heavy'>ranked #" + rank + "</span>" + " in the <span class='text-heavy'>" + rankPoint + "</span>, with a record of " + "<span class='text-heavy'>" + overallRecord + "</span>."
      ],
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      lastUpdatedDate: item.displayDate,
      backgroundImage: item.backgroundUrl != null ? GlobalSettings.getImageUrl(item.backgroundUrl, VerticalGlobalFunctions._imgProfileMod) : VerticalGlobalFunctions.getBackgroundImageUrlWithStockFallback(item.backgroundUrl, VerticalGlobalFunctions._imgProfileMod),
      circleImageUrl: GlobalSettings.getImageUrl(item.teamLogo, GlobalSettings._imgLgLogo),
      circleImageRoute: teamRoute,
      rank: rank.toString()
    });
  }
}

export class VerticalStandingsTableModel implements TableModel<TeamStandingsData> {
  columns: Array<TableColumn>;
  rows: Array<TeamStandingsData>;

  selectedKey: string = "";
  scope: string;
  /**
   * The team id of the profile page displaying the Standings module. (Optional)
   */
  currentTeamId: string;
  constructor(rows: Array<TeamStandingsData>, scope:string, teamId: string) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    this.currentTeamId = teamId;
    this.scope = scope;
    this.setColumnDP();
  }
  setColumnDP() : Array<TableColumn> {
    if(this.scope == 'fbs'){
      this.columns = [
        {
          headerValue: "Team Name",
          columnClass: "image-column",
          key: "name"
        },{
          headerValue: "RANK",
          columnClass: "data-column rank",
          key: "rank",
          sortDirection: 1 //ascending
        },{
          headerValue: "W/L/T",
          columnClass: "data-column",
          key: "wlt"
        },{
          headerValue: "CONF",
          columnClass: "data-column",
          key: "conf"
        },{
          headerValue: "STRK",
          columnClass: "data-column",
          key: "strk"
        },{
          headerValue: "HM",
          columnClass: "data-column",
          key: "hm"
        },{
          headerValue: "RD",
          columnClass: "data-column",
          key: "rd"
        },{
          headerValue: "PF",
          columnClass: "data-column",
          key: "pf"
        },{
          headerValue: "PA",
          columnClass: "data-column",
          key: "pa"
        }];
      } else {
        this.columns = [
          {
            headerValue: "Team Name",
            columnClass: "image-column",
            key: "name"
          },{
            headerValue: "RANK",
            columnClass: "data-column rank",
            key: "rank",
            sortDirection: 1 //ascending
          },{
            headerValue: "W/L/T",
            columnClass: "data-column",
            key: "wlt"
          },{
            headerValue: "PCT",
            columnClass: "data-column",
            key: "pct"
          },{
            headerValue: "DIV",
            columnClass: "data-column",
            key: "div"
          },{
            headerValue: "CONF",
            columnClass: "data-column",
            key: "conf"
          },{
            headerValue: "STRK",
            columnClass: "data-column",
            key: "strk"
          },{
            headerValue: "PF",
            columnClass: "data-column",
            key: "pf"
          },{
            headerValue: "PA",
            columnClass: "data-column",
            key: "pa"
          }];
      }
      return this.columns;
  }
  setSelectedKey(key: string) {
    this.selectedKey = key ? key : null;
  }

  getSelectedKey(): string {
    return this.selectedKey;
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].teamId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamStandingsData, rowIndex:number): boolean {
    return this.selectedKey == item.teamId;
  }

  calcWLT(str: string){
    let win = Number(str.split("-")[0]);
    let lose = Number(str.split("-")[1]);
    let tight = Number(str.split("-")[2]);
    let wlt = Math.pow(win, 2) - lose + tight;
    return wlt;
  }

  getCellData(item:TeamStandingsData, column:TableColumn):CellData {
    var display = null;
    var sort: any = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    var rank;
    var routeScope = item.leagueAbbreviation.toLowerCase() == 'fbs' ? 'ncaaf' : item.leagueAbbreviation.toLowerCase();
    if(item.groupName == 'Conference'){
      if(item.conferenceName == item.divisionName){
        rank = item.divisionRank != null ? item.divisionRank : 'N/A';
      } else {
        rank = item.conferenceRank != null ? item.conferenceRank : 'N/A';
      }
    }else if(item.groupName == item.divisionName){
      rank = item.divisionRank != null ? item.divisionRank : 'N/A';
    }else{
      rank = item.leagueRank != null ? item.leagueRank : 'N/A';
    }
    var divisionRank = rank != 'N/A' && rank !== null ? rank + GlobalFunctions.Suffix(Number(rank)) : 'N/A';
    divisionRank = '<br><span class="standings-division-rank">' + 'Rank: ' + divisionRank  +'</span>';
    var teamFullName = item.teamMarket + ' ' + item.teamName;
    var teamAbbr = item.teamAbbreviation && item.leagueAbbreviation == "FBS" ? item.teamAbbreviation + ' ' + item.teamName : item.teamName;
    switch (column.key) {
      case "name":
        display = teamAbbr + divisionRank;
        sort = teamAbbr;
        if ( item.teamId != this.currentTeamId ) {
          link = VerticalGlobalFunctions.formatTeamRoute(routeScope, teamFullName,item.teamId);
        }
        imageUrl = item.teamLogo ? GlobalSettings.getImageUrl(item.teamLogo, GlobalSettings._imgSmLogo) : null;
        break;

      case "wlt":
        display = item.teamOverallRecord != null ? item.teamOverallRecord.toString() : 'N/A';
        sort = item.teamOverallRecord ? this.calcWLT(item.teamOverallRecord) : null;
        break;

      case "conf":
        display = item.teamConferenceRecord != null ? item.teamConferenceRecord.toString() : 'N/A';
        sort = item.teamConferenceRecord ? this.calcWLT(item.teamConferenceRecord) : null;
        break;

      case "strk":
        display = item.streak != null ? item.streak.toString() : 'N/A';
        if(item.streak){
          var compareValue = Number(item.streak.slice(1, item.streak.length));
          if(item.streak.charAt(0) == "L"){
            compareValue *= -1;
          }
        }
        sort = compareValue;
        break;

      case "hm":
        display = item.homeRecord != null ? item.homeRecord.toString() : 'N/A';
        sort = item.homeRecord ? this.calcWLT(item.homeRecord) : null;
        break;

      case "rd":
        display = item.roadRecord != null ? item.roadRecord.toString() : 'N/A';
        sort = item.roadRecord ? this.calcWLT(item.roadRecord) : null;
        break;

      case "pa":
        display = item.teamPointsAllowed != null ? item.teamPointsAllowed.toString() : 'N/A';
        sort = item.teamPointsAllowed ? Number(item.teamPointsAllowed) : null;
        break;

      case "rank":
        display = rank != null ? rank.toString() : 'N/A';
        sort = rank ? Number(rank) : null;
        break;

      case "pct":
        display = item.teamWinPercent != null ? item.teamWinPercent.toString() : 'N/A';
        sort = item.teamWinPercent ? Number(item.teamWinPercent) : null;
        break;

      case "div":
        display = item.teamDivisionRecord != null ? item.teamDivisionRecord.toString() : 'N/A';
        sort = item.teamDivisionRecord ? this.calcWLT(item.teamDivisionRecord) : null;
        break;

      case "pf":
        display = item.teamPointsFor != null ? item.teamPointsFor.toString() : null;
        sort = item.teamPointsFor ? Number(item.teamPointsFor) : null;
        break;
    }
    if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl);
  }
}
