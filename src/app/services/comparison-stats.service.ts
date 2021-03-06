import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

//globals
import { VerticalGlobalFunctions } from '../global/vertical-global-functions';
import { GlobalFunctions } from '../global/global-functions';
import { GlobalSettings } from '../global/global-settings';

//services
import { SeasonStatsService } from './season-stats.service';

//interfaces
import { SportPageParameters } from '../global/global-interface';
import { Gradient } from '../global/global-gradient';
import { ComparisonModuleData } from '../fe-core/modules/comparison/comparison.module';
import { ComparisonBarInput } from '../fe-core/components/comparison-bar/comparison-bar.component';
import {ModelService} from "../global/shared/model/model.service";

export interface ComparisonBarList {
  [year: string]: Array<ComparisonBarInput>;
}

//TODO: unify player/team data interface
export interface PlayerData {
  playerName: string;
  playerFirstName: string;
  playerLastName: string;
  playerId: string;
  playerPosition: string;
  playerHeadshot: string;
  teamLogo: string;
  teamName: string;
  teamId: string;
  teamColors: string;
  mainTeamColor: string;
  jerseyNumber: string;
  height: string;
  weight: string;
  age: string;
  yearExperience: string;
  playerRoute: any;
  teamRoute: any;
  class: string;
  teamAbbreviation: string;
  teamMarket: string;
  statistics: { [seasonId: string]: SeasonStats };
}
export interface ComparisonRoster {
  firstLastName: string;
  id: string;
}
export interface TeamPlayers {
  passing: Array<PlayerData>;
  rushing: Array<PlayerData>;
  receiving: Array<PlayerData>;
  defense: Array<PlayerData>;
  kicking: Array<PlayerData>;
  punting: Array<PlayerData>;
  returning: Array<PlayerData>;
}

export interface DataPoint {
  [playerId: string]: number
}

export class SeasonStats {
  isCurrentSeason: boolean;
  REC: string;
  TAR: string;
  YDS: string;
  AVG: string;
  TD: string;
  YDSG: string;
  FUM: string;
  ATT: string;
  SOLO: string;
  AST: string;
  SACK: string;
  PD: string;
  INT: string;
  FF: string;
  FGM: string;
  FGA: string;
  PNTS: string;
  PUNTS: string;
  NET: string;
  IN20: string;
  LONG: string;
  XPM: string;
  XPA: string;
  Num: string;
  // FG%: string;
  // XP%: string;
  // 1DN: string;
}

export interface ComparisonStatsData {
  playerOne: PlayerData;
  playerTwo: PlayerData;
  bestStatistics: { [seasonId: string]: SeasonStats };
  worstStatistics: { [seasonId: string]: SeasonStats };
  data: { [year: string]: any };
  bars: ComparisonBarList;
}

export class SportsComparisonModuleData implements ComparisonModuleData {
  data: ComparisonStatsData;

  teamList: Array<{ key: string, value: string }>;

  playerLists: Array<{
    teamId: string,
    playerList: Array<{ key: string, value: string }>
  }>;

  scope: string;

  constructor(private _service: ComparisonStatsService) { }

  loadTeamList(listLoaded: Function) {
    if (this.teamList == null) {
      throw new Error("teamList has not been initialized");
    }
    // there will be at most two teams in the list on inital load,
    // so the list should only be reloaded if there are two or fewer
    // teams in the list
    if (!this.teamList || this.teamList.length <= 2) {
      this._service.getTeamList().subscribe(data => {
        if (data) {
          this.teamList = data;
          listLoaded(this.teamList);
        }
      },
        err => {
          console.log("Error loading team list for comparison module", err);
        })
    }
    else {
      listLoaded(this.teamList);
    }
  }

  loadPlayerList(index: number, newTeamId: string, listLoaded: Function) {
    if (this.playerLists == null || this.playerLists.length < 2) {
      throw new Error("playerLists has not been initialized or does not have enough items");
    }
    if (index > 2) { // only two items should be in player lists
      index = index % 2;
    }
    var teamData = this.playerLists[index];
    if (newTeamId != teamData.teamId || !teamData.playerList || teamData.playerList.length <= 1) {
      teamData.teamId = newTeamId;
      teamData.playerList = [];
      this._service.getPlayerList(newTeamId).subscribe(data => {
        teamData.playerList = data;
        listLoaded(teamData.playerList);
      },
        err => {
          console.log("Error loading player list for " + newTeamId + " for the comparison module", err);
        })
    }
    else {
      listLoaded(teamData.playerList);
    }
  }

  loadPlayer(index: number, teamId: string, playerId: string, statsLoaded: Function) {
    if (index > 2) { // only two items should be in player lists
      index = index % 2;
    }
    this._service.getSinglePlayerStats(index, this.data, teamId, playerId).subscribe(bars => {
      statsLoaded(bars);
    },
      err => {
        console.log("Error loading player comparison stats", err);
      });
  }
}

@Injectable()
export class ComparisonStatsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  private passingFields = ["Attempts", "Completions", "Passing Yards", "Yards Per Attempt", "Passing Touchdowns", "Total Interceptions", "Passer Rating"];
  private rushingFields = ["Rushing Attempts", "Rushing Yards", "Rushing Yards Per Carry", "Rushing Touchdowns", "Rushing Yards Per Game", "Rushing Fumbles", "Rushing First Downs"];
  private receivingFields = ["Receptions", "Receiving Targets", "Receiving Yards", "Average Yards Per Reception", "Receiving Touchdowns", "Receiving Yards Per Game", "Receiving First Downs"];
  private defenseFields = ["Solo Tackles", "Assisted Tackles", "Total Tackles", "Total Sacks", "Passes Defended", "Interceptions", "Forced Fumbles"];
  private kickingFields = ["Field Goals Made", "Field Goal Attempts", "Percentage of Field Goals Made", "Extra Points Made", "Extra Points Attempted", "Percentage of Extra Points Made", "Total Points"];
  private puntingFields = ["Total Punts", "Gross Punting Yards", "Gross Punting Average", "Net Punting Average", "Punts Inside the 20 Yard Line", "Longest Punt", "Blocked Punts"];
  private returningFields = ["Return Attempts", "Return Yards", "Return Average", "Longest Return", "Touchdowns", "Fair Catches"];
  private scope: string;
  constructor(public model: ModelService) { }

  getInitialPlayerStats(scope, pageParams: SportPageParameters): Observable<ComparisonModuleData> {
    this.scope = scope;
    var teamId = pageParams.teamId != null ? pageParams.teamId.toString() : null;
    var playerId = pageParams.playerId != null ? pageParams.playerId.toString() : null;
    return this.callPlayerComparisonAPI(this.scope, teamId, playerId, data => {
      if (data == null) {
        console.log("Error: No valid comparison data for " + (pageParams.playerId != null ? " player " + playerId + " in " : "") + " team " + teamId);
        return null;
      }
      data.playerOne.statistics = this.formatPlayerData(data.playerOne.playerId, data.data);
      data.playerTwo.statistics = this.formatPlayerData(data.playerTwo.playerId, data.data);
      data.bestStatistics = this.formatPlayerData("statHigh", data.data);
      data.worstStatistics = this.formatPlayerData("statLow", data.data);
      data.bars = this.createComparisonBars(data);

      var playerName1 = data.playerOne.playerFirstName + " " + data.playerOne.playerLastName;
      var playerName2 = data.playerTwo.playerFirstName + " " + data.playerTwo.playerLastName;

      //Routes
      data.playerOne['playerRoute'] = VerticalGlobalFunctions.formatPlayerRoute(this.scope, data.playerOne.teamName, playerName1, data.playerOne.playerId);
      data.playerTwo['playerRoute'] = VerticalGlobalFunctions.formatPlayerRoute(this.scope, data.playerOne.teamName, playerName2, data.playerTwo.playerId);
      data.playerOne['teamRoute'] = VerticalGlobalFunctions.formatTeamRoute(this.scope, data.playerOne.teamName, data.playerOne.teamId);
      data.playerTwo['teamRoute'] = VerticalGlobalFunctions.formatTeamRoute(this.scope, data.playerTwo.teamName, data.playerTwo.teamId);

      data.playerOne['height'] = GlobalFunctions.inchesToFeet(data.playerOne.height);
      data.playerTwo['height'] = GlobalFunctions.inchesToFeet(data.playerTwo.height);
      data.playerOne['playerHeadshot'] = GlobalSettings.getImageUrl(data.playerOne.playerHeadshot, GlobalSettings._imgLgLogo);
      data.playerTwo['playerHeadshot'] = GlobalSettings.getImageUrl(data.playerTwo.playerHeadshot, GlobalSettings._imgLgLogo);


      var team1Data = {
        teamId: data.playerOne.teamId,
        playerList: [{ key: data.playerOne.playerId, value: playerName1 }]
      };

      var team2Data = {
        teamId: data.playerTwo.teamId,
        playerList: [{ key: data.playerTwo.playerId, value: playerName2 }]
      };


      var moduleData = new SportsComparisonModuleData(this);
      moduleData.data = data;
      moduleData.teamList = [
        { key: data.playerOne.teamId, value: data.playerOne.teamName },
        { key: data.playerTwo.teamId, value: data.playerTwo.teamName }
      ];
      moduleData.playerLists = [
        team1Data,
        team2Data
      ];
      return moduleData;
    });
  }

  getSinglePlayerStats(index: number, existingData: ComparisonStatsData, teamId: string, playerId: string): Observable<ComparisonBarList> {
    return this.callPlayerComparisonAPI(this.scope, teamId, playerId, apiData => {
      if(apiData.playerOne == null || apiData.playerTwo == null){
        apiData = this.fallbackStats();
      }
      let playerHeadShot = "";
      if (apiData.playerOne.playerHeadshot != null && apiData.playerOne.playerHeadshot.indexOf("http://images.synapsys.us") !== -1) {
        playerHeadShot = apiData.playerOne.playerHeadshot.replace("http://images.synapsys.us", "");
      } else {
        playerHeadShot = apiData.playerOne.playerHeadshot;
      }
      if (apiData.playerOne != null) {
        apiData.playerOne.statistics = this.formatPlayerData(apiData.playerOne.playerId, apiData.data);
        apiData.playerOne.playerHeadshot = GlobalSettings.getImageUrl(playerHeadShot, GlobalSettings._imgLgLogo);
        existingData.playerTwo.statistics = this.formatPlayerData(existingData.playerTwo.playerId, apiData.data);
      } else {
        apiData.playerOne = {};
        apiData.playerOne.statistics = this.formatPlayerData(apiData.playerOne.playerId, apiData.data);
        apiData.playerOne.playerHeadshot = GlobalSettings.getImageUrl(playerHeadShot, GlobalSettings._imgLgLogo);
        existingData.playerTwo.statistics = this.formatPlayerData(existingData.playerTwo.playerId, apiData.data);
      }
      if (index == 0) {
        existingData.playerOne = apiData.playerOne;
      }
      else {
        existingData.playerTwo = apiData.playerOne;
      }
      existingData.data = apiData.data;
      existingData.bestStatistics = this.formatPlayerData("statHigh", apiData.data);
      existingData.worstStatistics = this.formatPlayerData("statLow", apiData.data);

      return this.createComparisonBars(existingData);
    });
  }

  getPlayerList(teamId: string): Observable<Array<{ key: string, value: string, class: string }>> {
    //http://dev-touchdownloyal-api.synapsys.us/comparisonRoster/team/135
    let playersUrl = this._apiUrl + "/comparisonRoster/team/" + teamId;
    return this.model.get(playersUrl)
      .map(data => {
        return this.formatPlayerList(data.data);
      });
  }

  getTeamList(scope = this.scope): Observable<Array<{ key: string, value: string }>> {
    scope = this.scope == 'ncaaf' ? 'fbs' : 'nfl';
    let teamsUrl = this._apiUrl + "/comparisonTeamList/" + scope;
    return this.model.get(teamsUrl)
      .map(data => {
        if (data.data) {
          return this.formatTeamList(data.data);
        }
        return null;
      });
  }

  callPlayerComparisonAPI(scope: string = this.scope, teamId: string, playerId: string, dataLoaded: Function) {
    let url = this._apiUrl + "/comparison/";
    if (playerId) {
      url += "player/" + playerId;
    }
    else if (teamId) {
      url += "team/" + teamId;
    }
    else {
      url += "league/" + scope;
    }
    return this.model.get(url)
      .map(data => {
        return dataLoaded(data.data);
      });
  }

  /*
  teamItem {
    teamId: string;
    teamFirstName: string;
    teamLastName: string;
    teamLogo: string;
  }
  */
  private formatTeamList(teamList) {
    try {
      if (teamList) {
        return teamList.map(team => {
          var teamName = team.teamAbbreviation + "<span class='hide-320'> " + team.nickname + "</span>";
          return { key: team.id, value: teamName };
        });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  private formatPlayerList(playerList: TeamPlayers) {
    var list = [];
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Passing", playerList.passing));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Rushing", playerList.rushing));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Receiving", playerList.receiving));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Defense", playerList.defense));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Kicking", playerList.kicking));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Punting", playerList.punting));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Returning", playerList.returning));
    return list;
  }

  private formatPlayerPositionList(description: string, playerList: Array<any>) {
    var dropdownList = [];
    if (playerList && playerList.length > 0) {
      dropdownList.push({ key: "", value: description, class: "dropdown-grp-lbl", preventSelection: true });
      Array.prototype.push.apply(dropdownList, playerList.map(player => {
        if (player.playerId) return { key: player.playerId, value: player.playerFirstName + ' ' + player.playerLastName, class: "dropdown-grp-item", preventSelection: false };
        else return { key: player.playerId, value: player.playerFirstName + ' ' + player.playerLastName, class: "dropdown-grp-item" };
      }));
    }
    return dropdownList;
  }

  private formatPlayerData(playerId: string, data: { [seasonId: string]: any }): { [seasonId: string]: SeasonStats } {
    var stats: { [seasonId: string]: SeasonStats } = {};
    for (var seasonId in data) {
      var seasonData = data[seasonId];
      var seasonStats = new SeasonStats();
      var isValidStats = false;
      for (var key in seasonData) {
        var value = seasonData[key];
        if (key == "isCurrentSeason") {
          seasonStats.isCurrentSeason = value;
        }
        else if (value != null) {
          if (value["statHigh"] != null) {
            isValidStats = true;
          }
          seasonStats[key] = value[playerId] != null ? Number(value[playerId]) : null;
        }
        else {
          seasonStats[key] = null;
        }
      }
      if (isValidStats) {
        stats[seasonId] = seasonStats;
      }
    }
    return stats;
  }

  private createComparisonBars(data: ComparisonStatsData): ComparisonBarList {
    var fields = null;
    var position = data.playerOne.playerPosition;
    switch (position) {
      case "QB":
        fields = this.passingFields;
        break;
      case "RB":
      case "FB":
      case "HB":
        fields = this.rushingFields;
        break;
      case "K":
      case "LS":
        fields = this.kickingFields;
        break;
      case "P":
        fields = this.puntingFields;
        break;
      case "KR":
      case "RS":
      case "PR":
        fields = this.returningFields;
        break;
      case "TE":
      case "TEW":
      case "WR":
        fields = this.receivingFields;
        break;
      default:
        fields = this.defenseFields;
        break;
    }
    var teamColorsOne = data.playerOne.teamColors ? data.playerOne.teamColors.concat(",").split(", ", 1) : ['#000000'];
    var teamColorsTwo = data.playerTwo.teamColors ? data.playerTwo.teamColors.concat(",").split(", ", 1) : ['#000000'];
    var colors = Gradient.getColorPair(teamColorsOne, teamColorsTwo);
    data.playerOne.mainTeamColor = colors[0];
    data.playerTwo.mainTeamColor = colors[1];
    var bars: ComparisonBarList = {};
    for (var seasonId in data.bestStatistics) {
      var bestStats = data.bestStatistics[seasonId];
      var worstStats = data.worstStatistics[seasonId];
      var playerOneStats = data.playerOne.statistics[seasonId];
      var playerTwoStats = data.playerTwo.statistics[seasonId];
      var seasonBarList = [];
      for (var i = 0; i < fields.length; i++) {
        var key = fields[i];
        var title = key;
        var bestStatFallback = null;
        if (playerOneStats[key] != null && playerTwoStats[key] != null) {
          if (playerOneStats[key] >= playerTwoStats[key]) {
            bestStatFallback = playerOneStats[key];
          } else {
            bestStatFallback = playerTwoStats[key];
          }
        } else {
          if (playerOneStats[key] != null) {
            bestStatFallback = playerOneStats[key];
          } else {
            bestStatFallback = playerTwoStats[key];
          }
        }
        seasonBarList.push({
          title: title,
          data: [{
            value: playerOneStats != null ? playerOneStats[key] : null,
            // color: data.playerOne.mainTeamColor
            color: '#2D3E50'
          },
            {
              value: playerTwoStats != null ? playerTwoStats[key] : null,
              // color: data.playerTwo.mainTeamColor,
              color: '#999999'
            }],
          minValue: worstStats != null ? worstStats[key] : null,
          maxValue: bestStats[key] != null ? bestStats[key] : bestStatFallback,
          qualifierLabel: SeasonStatsService.getQualifierLabel(key)
        });
      }
      bars[seasonId] = seasonBarList;
    }
    return bars;
  }

  private getNumericValue(key: string, value: string): number {
    if (value == null) return null;
    var num = Number(value);
    return num;
  }

  private fallbackStats() {
    var fallback = {
      "data": {
        "2013": null,
        "2014": null,
        "2015": null,
        "2016": null,
        "2017": null,
      },
      "playerOne": {
        "playerId": "N/A",
        "playerFirstName": "N/A",
        "playerLastName": "N/A",
        "playerHeadshot": null,
        "teamLogo": null,
        "teamMarket": "N/A",
        "teamName": "N/A",
        "teamAbbreviation": "N/A",
        "teamId": "N/A",
        "teamColors": "#203731, #ffb612",
        "jerseyNumber": "N/A",
        "playerPosition": "N/A",
        "height": "N/A",
        "weight": "N/A",
        "class": null,
        "age": "N/A",
        "yearExperience": "N/A"
      },
    }
    return fallback;
  }
}
