import {TableModel, TableColumn, CellData} from '../fe-core/components/custom-table/table-data.component';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {TableTabData, TableComponentData} from '../fe-core/components/season-stats/season-stats.component';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {Season} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface TeamInfo {
  teamName: string;
  teamId: string;
}
export interface PlayerInfo {
  playerName: string,
  playerId: string;
  lastUpdate: string;
  teamName: string;
  teamId: string;
  liveImage: string;
  playerHeadshot: string;
  teamLogo: string;
  position: string;
}

export interface TeamSeasonStatsData {
  teamInfo: TeamInfo;
  playerInfo: PlayerInfo;
  imageUrl: string,
  backgroundImage: string,
  conferenceName: string,
  divisionName: string,
  lastUpdated: string,
  rank: number,
  year: string,

  pitchWins: string,
  pitchLosses: string,
  pitchInningsPitched: string,
  pitchStrikeouts: string,
  pitchEra: string,
  pitchHits: string,
  pitchEarnedRuns: string,
  pitchBasesOnBalls: string,
  pitchWhip: string,

  batRunsScored: string,
  batHomeRuns: string,
  batHits: string,
  batRbi: string,
  batBasesOnBalls: string,
  batAverage: string,
  batOnBasePercentage: string,
  batSluggingPercentage: string,

  seasonId: string,
  /**
   * - Formatted from league and year values that generated the associated table
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

export interface seasonStatsData {
  regularSeasonAverage: Array<TeamSeasonStatsData>;
  postSeasonAverage: Array<TeamSeasonStatsData>;
  regularSeasonTotal: Array<TeamSeasonStatsData>;
  postSeasonTotal: Array<TeamSeasonStatsData>;
}

export class MLBSeasonStatsTableData implements TableComponentData<TeamSeasonStatsData> {
  groupName: string;

  tableData: MLBSeasonStatsTableModel;

  season: any;

  year: number;

  constructor(title: string, season: Season, year: number, table: MLBSeasonStatsTableModel) {
    this.groupName = title;
    this.season = season;
    this.year = year;
    this.tableData = table;
  }

}

export class MLBSeasonStatsTabData implements TableTabData<TeamSeasonStatsData> {

  playerId: string;

  tabName: string;

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<MLBSeasonStatsTableData>;

  season: Season;

  year: string;

  constructor(title: string, tabName: string, season: Season, year: string, isActive: boolean) {
    this.title = title;
    this.tabName = tabName;
    this.season = season;
    this.year = year;
    this.isActive = isActive;
  }

  convertToCarouselItem(item: TeamSeasonStatsData, index:number): SliderCarouselInput {
    var playerData = item.playerInfo != null ? item.playerInfo : null;
    var playerRoute = VerticalGlobalFunctions.formatPlayerRoute(playerData.teamName,playerData.playerName,playerData.playerId.toString());
    var playerRouteText = {
      route: playerRoute,
      text: playerData.playerName
    }
    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(playerData.teamName, playerData.teamId);
    var teamRouteText = {
      route: teamRoute,
      text: playerData.teamName,
      class: 'text-heavy'
    }

    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: GlobalSettings.getBackgroundImageUrl(playerData.liveImage),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [item.seasonId + " Season Stats Report"],
      profileNameLink: playerRouteText,
      description: ["Team: ", teamRouteText],
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(playerData.lastUpdate),
      circleImageUrl: GlobalSettings.getImageUrl(playerData.playerHeadshot),
      circleImageRoute: playerRoute
      // subImageUrl: GlobalSettings.getImageUrl(playerData.teamLogo),
      // subImageRoute: teamRoute
    });
  }
}

export class MLBSeasonStatsTableModel implements TableModel<TeamSeasonStatsData> {
  columns: Array<TableColumn>;
  rows: Array<TeamSeasonStatsData>;
  selectedKey: string = "";
  isPitcher: boolean;

  constructor(rows: Array<TeamSeasonStatsData>, isPitcher: boolean){
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      // this.selectedKey = rows[0].playerId;
    }
    console.log(rows);
      this.columns = [{
        headerValue: "Year",
        columnClass: "date-column",
        isNumericType: true,
        key: "year"
      },{
        headerValue: "Team",
        columnClass: "image-column",
        isNumericType: false,
        key: "team"
      },{
        headerValue: "AST",
        columnClass: "data-column",
        isNumericType: true,
        key: "player_defense_assists"
      },{
        headerValue: "SACK",
        columnClass: "data-column",
        isNumericType: true,
        key: "player_defense_sacks"
      },{
        headerValue: "FF",
        columnClass: "data-column",
        isNumericType: true,
        key: "player_defense_forced_fumbles"
      },{
        headerValue: "TOTAL",
        columnClass: "data-column",
        isNumericType: true,
        key: "player_defense_total_tackles"
      },{
        headerValue: "INT",
        columnClass: "data-column",
        isNumericType: true,
        key: "player_defense_interceptions"
      },{
        headerValue: "PD",
        columnClass: "data-column",
        isNumericType: true,
        key: "player_defense_passes_defended"
      }]
  }

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  getSelectedKey(): string {
    return this.selectedKey;
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].playerInfo.playerId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamSeasonStatsData, rowIndex:number): boolean {
    return null;
  }

  getCellData(item:TeamSeasonStatsData, column:TableColumn):CellData {
    var display = "";
    var sort = null;
    var link = undefined;
    var isTotalColumn = item['sectionStat'] != null;

    switch (column.key) {
      case "year":
        display = item.seasonId;
        sort = item.seasonId;
        break;

      case "team":
        if ( isTotalColumn ) {
          display = (item['sectionStat'] == "Average" ? "Total Average" : "Total").toUpperCase() + ":";
        }
        else {
          display = item.playerInfo.teamMarket + " " + item.playerInfo.teamName;
          link = VerticalGlobalFunctions.formatTeamRoute(item.playerInfo.teamName,item.playerInfo.teamId);
        }
        sort = item.playerInfo.teamName;
        break;

      case "wl":
        display = item.pitchWins != null && Number(item.pitchLosses) != null ? Number(item.pitchWins).toFixed(0) + "/" + Number(item.pitchLosses).toFixed(0) : null;
        var wins = item.pitchWins + "";
        var losses = item.pitchLosses + "";
        sort = ('00000' + wins).substr(wins.length) + "/" + ('00000' + losses).substr(losses.length); //pad with zeros
        break;

      case "player_defense_assists":
        display = item.player_defense_assists != null ? Number(item.player_defense_assists).toFixed(1) : null;
        sort = Number(item.player_defense_assists);
        break;

      case "player_defense_sacks":
        display = item.player_defense_sacks != null ? Number(item.player_defense_sacks).toFixed(0) : null;
        sort = Number(item.player_defense_sacks);
        break;

      case "player_defense_forced_fumbles":
        display = item.player_defense_forced_fumbles != null ? Number(item.player_defense_forced_fumbles).toFixed(2) : null;
        sort = Number(item.player_defense_forced_fumbles);
        break;

      case "player_defense_total_tackles":
        display = item.player_defense_total_tackles != null ? Number(item.player_defense_total_tackles).toFixed(0) : null;
        sort = Number(item.player_defense_total_tackles);
        break;

      case "player_defense_interceptions":
        display = item.player_defense_interceptions != null ? Number(item.player_defense_interceptions).toFixed(0) : null;
        sort = Number(item.player_defense_interceptions);
        break;

      case "player_defense_passes_defended":
        display = item.player_defense_passes_defended != null ? Number(item.player_defense_passes_defended).toFixed(0) : null;
        sort = Number(item.player_defense_passes_defended);
        break;

      case "whip":
        display = item.pitchWhip != null ? Number(item.pitchWhip).toFixed(2) : null;
        sort = Number(item.pitchWhip);
        break;

      case "r":
        display = item.batHomeRuns != null ? Number(item.batHomeRuns).toFixed(2) : null;
        sort = Number(item.batHomeRuns);
      break;

      case "h":
        display = item.batHits != null ? Number(item.batHits).toFixed(2) : null;
        sort = Number(item.batHits);
        break;

      case "hr":
        display = item.batHomeRuns != null ? Number(item.batHomeRuns).toFixed(2) : null;
        sort = Number(item.batHomeRuns);
        break;

      case "rbi":
        display = item.batRbi != null ? Number(item.batRbi).toFixed(2) : null;
        sort = Number(item.batRbi);
        break;

      case "bb":
        display = item.batBasesOnBalls != null ? Number(item.batBasesOnBalls).toFixed(0) : null;
        sort = Number(item.batBasesOnBalls);
        break;

      case "avg":
        display = item.batAverage != null ? Number(item.batAverage).toFixed(2) : null;
        sort = Number(item.batAverage);
        break;

      case "obp":
        display = item.batOnBasePercentage != null ? Number(item.batOnBasePercentage).toFixed(2) : null;
        sort = Number(item.batOnBasePercentage);
        break;

      case "slg":
        display = item.batSluggingPercentage != null ? Number(item.batSluggingPercentage).toFixed(2) : null;
        sort = Number(item.batSluggingPercentage);
        break;
    }
    display = display != null ? display : "N/A";
    if ( isTotalColumn ) {
      sort = null; // don't sort total column
    }
    return new CellData(display, sort, link);
  }
}
