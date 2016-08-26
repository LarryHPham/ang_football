import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {StandingsTableTabData, TableComponentData} from '../fe-core/components/standings/standings.component';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {TDLGlobalFunctions} from '../global/tdl-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface TeamStandingsData {
  teamName: string,
  imageUrl: string,
  backgroundImage: string,
  teamId: string;
  conferenceName: string,
  divisionName: string,
  lastUpdated: string,
  divisionRank: string,
  conferenceRank: string,
  leagueRank: string,
  streak: string,
  teamConferenceRecord: string,
  teamWinPercent: string,
  teamDivisionRecord: string,
  teamPointsAllowed: string,
  teamOverallRecord: string,
  seasonBase: string,
  totalLosses: string;
  totalWins: string;
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

export class MLBStandingsTableData implements TableComponentData<TeamStandingsData> {
  groupName: string;

  tableData: MLBStandingsTableModel;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, table: MLBStandingsTableModel) {
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

  sections: Array<MLBStandingsTableData>;

  conference: Conference;

  division: Division;

  selectedKey: string;

  currentTeamId: string;

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
    var teamRoute = null;
    var yearEnd = Number(item.seasonBase)+1;
    if ( this.currentTeamId != item.teamId ) {
      teamRoute = TDLGlobalFunctions.formatTeamRoute(item.teamName, item.teamId.toString());
    }
    var teamNameLink = {
        route: teamRoute,
        text: item.teamName
    };
    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: item.fullBackgroundImageUrl,
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [item.seasonBase + "-" + yearEnd + " Season " + item.divisionName + " Standings"],
      profileNameLink: teamNameLink,
      description:[
          "The ", teamNameLink,
          " is currently <span class='text-heavy'>ranked " + Number(item.divisionRank) + "</span>" + " in the <span class='text-heavy'>" + item.divisionName + "</span>, with a record of " + "<span class='text-heavy'>" + item.teamOverallRecord + "</span>."
      ],
      lastUpdatedDate: item.displayDate,
      circleImageUrl: item.fullImageUrl,
      circleImageRoute: teamRoute
    });
  }
}

export class MLBStandingsTableModel implements TableModel<TeamStandingsData> {
  // title: string;

  columns: Array<TableColumn> = [{
      headerValue: "Team Name",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "W/L/T",
      columnClass: "data-column",
      key: "wlt"
    },{
      headerValue: "CONF",
      columnClass: "data-column",
      sortDirection: -1, //descending
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
    },{
      headerValue: "Rank:",
      columnClass: "data-column",
      key: "rank"
    }];

  rows: Array<TeamStandingsData>;

  selectedKey: string = "";

  /**
   * The team id of the profile page displaying the Standings module. (Optional)
   */
  currentTeamId: string;

  constructor(rows: Array<TeamStandingsData>, teamId: string) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    this.currentTeamId = teamId;
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

  getCellData(item:TeamStandingsData, column:TableColumn):CellData {
    var display = null;
    var sort: any = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    switch (column.key) {
      case "name":
        display = item.teamName;
        sort = item.teamName;
        if ( item.teamId != this.currentTeamId ) {
          link = TDLGlobalFunctions.formatTeamRoute(item.teamName,item.teamId);
        }
        imageUrl = item.fullImageUrl;
        break;

      case "wlt"://TODO
        display = item.teamOverallRecord != null ? item.teamOverallRecord : null;
        sort = item.teamOverallRecord;
        break;

      case "conf":
        display = item.teamConferenceRecord != null ? item.teamConferenceRecord : null;
        sort = item.teamConferenceRecord;
        break;

      case "strk":
        display = item.streak != null ? item.streak : null;
        sort = item.streak;
        break;

      case "hm"://TODO
        display = item.teamWinPercent != null ? item.teamWinPercent : null;
        sort = item.teamWinPercent;
        break;

      case "rd"://TODO
        display = item.teamDivisionRecord != null ? item.teamDivisionRecord : null;
        sort = item.teamDivisionRecord;
        break;

      case "pa":
        display = item.teamPointsAllowed != null ? item.teamPointsAllowed : null;
        sort = Number(item.teamPointsAllowed);
        break;

      case "rank"://TODO
        display = item.leagueRank != null ? item.leagueRank : null;
        sort = Number(item.leagueRank);
        break;
    }
    if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl);
  }
}
