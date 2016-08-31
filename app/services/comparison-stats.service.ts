import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {SportPageParameters} from '../global/global-interface';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';
import {SeasonStatsService} from './season-stats.service';

import {ComparisonModuleData} from '../fe-core/modules/comparison/comparison.module';
import {ComparisonBarInput} from '../fe-core/components/comparison-bar/comparison-bar.component';
import {ComparisonBarList} from './common-interfaces';

//TODO: unify player/team data interface
export interface PlayerData {
  playerName: string;
  playerFirstName: string;
  playerLastName: string;
  playerId: string;
  playerHeadshot: string;
  teamLogo: string;
  teamName: string;
  teamId: string;
  teamColors: Array<string>;
  mainTeamColor: string;
  jerseyNumber: number;
  height: string;
  weight: number;
  age: number;
  yearsExperience: number;
  playerPosition: string;
  statistics: { [seasonId: string]: SeasonStats };
}
export interface ComparisonRoster{
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

export class MLBComparisonModuleData implements ComparisonModuleData {
    data: ComparisonStatsData;

    teamList: Array<{key: string, value: string}>;

    playerLists: Array<{
      teamId: string,
      playerList: Array<{key: string, value: string}>
    }>;

    constructor(private _service: ComparisonStatsService) {}

    loadTeamList(listLoaded: Function) {
      if ( this.teamList == null ) {
        throw new Error("teamList has not been initialized");
      }
      // there will be at most two teams in the list on inital load,
      // so the list should only be reloaded if there are two or fewer
      // teams in the list
      if ( !this.teamList || this.teamList.length <= 2 ) {
        this._service.getTeamList().subscribe(data => {
          this.teamList = data;
          listLoaded(this.teamList);
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
      if ( this.playerLists == null || this.playerLists.length < 2) {
        throw new Error("playerLists has not been initialized or does not have enough items");
      }
      if ( index > 2 ) { // only two items should be in player lists
        index = index % 2;
      }
      var teamData = this.playerLists[index];
      if ( newTeamId != teamData.teamId || !teamData.playerList || teamData.playerList.length <= 1 ) {
        teamData.teamId = newTeamId;
        teamData.playerList = [];
        this._service.getPlayerList(newTeamId).subscribe(data => {
          teamData.playerList = data;
          //TODO - widen dropdown to
          // teamData.playerList[1].value += "Something longer than ever";
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
      if ( index > 2 ) { // only two items should be in player lists
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

  private passingFields = ["ATT", "COMP", "YDS", "AVG", "TD", "INT", "RATE"];
  private rushingFields = ["ATT", "YDS", "AVG", "TD", "YDS/G", "FUM", "1DN"];
  private receivingFields = ["REC", "TAR", "YDS", "TD", "YDS", "1DN"];
  private defenseFields = ["SOLO", "AST", "TOT", "SACK", "PD", "INT", "FF"];
  private kickingFields = ["FGM", "FGA", "FG%", "XPM", "XPA", "XP%", "PNTS"];
  private puntingFields = ["PUNTS", "YDS", "AVG", "NET", "IN20", "LONG", "BP"];

  constructor(public http: Http) { }

  getInitialPlayerStats(pageParams: SportPageParameters): Observable<ComparisonModuleData> {
    var teamId = pageParams.teamId != null ? pageParams.teamId.toString() : null;
    var playerId = pageParams.playerId != null ? pageParams.playerId.toString() : null;
    return this.callPlayerComparisonAPI(teamId, playerId, data => {
      if ( data == null ) {
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
      var team1Data = {
        teamId: data.playerOne.teamId,
        playerList: [{key: data.playerOne.playerId, value: playerName1}]
      };

      var team2Data = {
        teamId: data.playerTwo.teamId,
        playerList: [{key: data.playerTwo.playerId, value: playerName2}]
      };
      console.log("TEST", team1Data, team2Data);
      var moduleData = new MLBComparisonModuleData(this);
      moduleData.data = data;
      moduleData.teamList = [
          {key: data.playerOne.teamId, value: data.playerOne.teamName},
          {key: data.playerTwo.teamId, value: data.playerTwo.teamName}
      ];
      moduleData.playerLists = [
        team1Data,
        team2Data
      ];
      console.log("moduleData", moduleData);
      return moduleData;
    });
  }

  getSinglePlayerStats(index:number, existingData: ComparisonStatsData, teamId: string, playerId: string): Observable<ComparisonBarList> {
    return this.callPlayerComparisonAPI(teamId, playerId, apiData => {
      apiData.playerOne.statistics = this.formatPlayerData(apiData.playerOne.playerId, apiData.data);
      if ( index == 0 ) {
        existingData.playerOne = apiData.playerOne;
      }
      else {
        existingData.playerTwo = apiData.playerOne;
      }
      console.log("getSinglePlayerStats", existingData);
      return this.createComparisonBars(existingData);
    });
  }

  getPlayerList(teamId: string): Observable<Array<{key: string, value: string, class: string}>> {
    //http://dev-homerunloyal-api.synapsys.us/team/comparisonRoster/2800
    //http://dev-touchdownloyal-api.synapsys.us/comparisonRoster/team/135
    let playersUrl = this._apiUrl + "/comparisonRoster/team/" + teamId;
    return this.http.get(playersUrl)
      .map(res => res.json())
      .map(data => {
        console.log("GET PLAYER LIST", data);
        return this.formatPlayerList(data.data);
    });
  }

  getTeamList(): Observable<Array<{key: string, value: string}>> {
    let teamsUrl = this._apiUrl + "/comparisonTeamList/nfl";//TODO
    // console.log("teams url: " + teamsUrl);
    return this.http.get(teamsUrl)
      .map(res => res.json())
      .map(data => {
        console.log("team list", data);
        return this.formatTeamList(data.data);
    });
  }

  callPlayerComparisonAPI(teamId: string, playerId: string, dataLoaded: Function) {
    let url = this._apiUrl + "/comparison/";

    if ( playerId ) {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/player/95622
      url += "player/" + playerId;
    }
    else if ( teamId ) {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/team/2800
      url += "team/" + teamId;
    }
    else {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/league
      url += "league/nfl";//TODO
    }

    return this.http.get(url)
      .map(res => res.json())
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
    return teamList.map(team => {
      var teamName = team.teamFirstName + " " + team.teamLastName;
      return {key: team.teamId, value: teamName};
    });
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
    console.log("formatPlayerList", list);
    return list;
  }

  private formatPlayerPositionList(description:string, playerList: Array<any>) {
    var dropdownList = [];

    if ( playerList && playerList.length > 0 ) {
      dropdownList.push({ key: "", value: description, class: "dropdown-grp-lbl", preventSelection: true });
      Array.prototype.push.apply(dropdownList, playerList.map(player => {
        if ( player.id ) return {key: player.id, value: player.firstLastName, class: "dropdown-grp-item", preventSelection: false};
        else return {key: player.player_id, value: player.player_name, class: "dropdown-grp-item"};
      }));
    }

    return dropdownList;
  }

  private formatPlayerData(playerId: string, data: { [seasonId: string]: any }):{ [seasonId: string]: SeasonStats } {
    var stats: { [seasonId: string]: SeasonStats } = {};
    for ( var seasonId in data ) {
      var seasonData = data[seasonId];
      var seasonStats = new SeasonStats();
      var isValidStats = false;

      for ( var key in seasonData ) {
        var value = seasonData[key];
        if ( key == "isCurrentSeason" ) {
          seasonStats.isCurrentSeason = value;
        }
        else if ( value != null ) {//TODO
          // if ( value["statHigh"] != null ) {//TODO
            isValidStats = true;
          // }
          seasonStats[key] = value[playerId] != null ? Number(value[playerId]) : null;
        }
        else {
          seasonStats[key] = null;
        }
      }
      if ( isValidStats ) {
        stats[seasonId] = seasonStats;
      }
    }
    return stats;
  }

  private createComparisonBars(data: ComparisonStatsData): ComparisonBarList {
    var fields = this.defenseFields;
    var position = data.playerOne.playerPosition;
    if(data.playerOne.playerPostition == "QB"){
      fields = this.passingFields;
    } else if(position == "RB" || position == "FB" || position == "HB"){
      fields = this.rushingFields;
    } else if(position == "K" || position == "LS"){
      fields = this.kickingFields;
    } else if(position == "P"){
      fields = this.puntingFields;
    } else if(position == "KR" || position == "PR" || position == "RS")
    // var colors = Gradient.getColorPair(data.playerOne.teamColors, data.playerTwo.teamColors);
    var colors = Gradient.getColorPair(['#2D3E50'], ['#999']);//TODO
    data.playerOne.mainTeamColor = colors[0];
    data.playerTwo.mainTeamColor = colors[1];

    var bars: ComparisonBarList = {};
    for ( var seasonId in data.bestStatistics ) {
      var bestStats = data.bestStatistics[seasonId];
      var worstStats = data.worstStatistics[seasonId];
      var playerOneStats = data.playerOne.statistics[seasonId];
      var playerTwoStats = data.playerTwo.statistics[seasonId];
      var seasonBarList = [];

      for ( var i = 0; i < fields.length; i++ ) {
        var key = fields[i];
        // var title = ComparisonStatsService.getKeyDisplayTitle(key);
        var title = key;
        seasonBarList.push({
          title: title,
          data: [{
            // value: playerOneStats != null ? this.getNumericValue(key, playerOneStats[key]) : null,
            value: 8,
            // color: data.playerOne.mainTeamColor
            color: '#BC1624'
          },
          {
            value: 10,
            // color: data.playerTwo.mainTeamColor,
            color: '#444444'
          }],
          //minValue: worstStats != null ? this.getNumericValue(key, worstStats[key]) : null,
          //maxValue: bestStats != null ? this.getNumericValue(key, bestStats[key]) : null,
          minValue: 5,
          maxValue: 200,
          // qualifierLabel: SeasonStatsService.getQualifierLabel(key)
          qualifierLabel: key
        });
      }

      bars[seasonId] = seasonBarList;
    }
    return bars;
  }

  static getKeyDisplayTitle(key: string): string {
    switch (key) {
      case "AST": return "AST";
      case "AVG": return "AVG";
      case "ATT": return "ATT";
      case "REC": return "REC";
      case "TAR": return "TAR";
      case "YDS": return "YDS";
      case "TD": return "TD";
      case "YDSG": return "YDS/G";
      case "1DN": return "1DN";
      case "Jersey No.": return "Jersey No.";
      case "SOLO": return "SOLO";
      case "TOT": return "TOT";
      case "SACK": return "SACK";
      case "PD": return "PD";
      case "INT": return "INT";
      case "FF": return "FF";
      case "COMP": return "COMP";
      case "RATE": return "RATE";
      case "FGM": return "FGM";
      case "FGA": return "FGA";
      case "FG%": return "FG%";
      case "XPM": return "XPM";
      case "XPA": return "XPA";
      case "XP%": return "XP%";
      case "SOLO": return "SOLO";
      case "PUNTS": return "PUNTS";
      case "PNTS": return "PNTS";
      case "NET": return "NET";
      case "IN20": return "IN20";
      case "BP": return "BP";
      case "LONG": return "LONG";
      default: return null;
    }
  }

  // private getNumericValue(key: string, value: string): number {
  //   if ( value == null ) return null;
  //
  //   var num = Number(value);
  //   switch (key) {
  //     case "batAverage": return Number(num.toFixed(3));
  //     case "batOnBasePercentage": return Number(num.toFixed(3));
  //     case "pitchEra": return Number(num.toFixed(2));
  //     default: return num;
  //   }
  // }
}
