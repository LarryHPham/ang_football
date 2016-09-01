import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";

export interface DailyUpdateData {
  hasError: boolean;
  type: string;
  wrapperStyle: any;
  lastUpdateDate: string;
  chart: DailyUpdateChart;
  fullBackgroundImageUrl: string;
  seasonStats: Array<{name: string, value: string, icon: string}>;
  postGameArticle?: PostGameArticleData;
}

export interface DailyUpdateChart {
  categories: Array<string>;
  dataSeries: Array<{name: string, values: Array<any>}>;
}

interface DataSeries {
  name: string;
  key: string;
}

interface APIDailyUpdateData {
  lastUpdated: string;
  backgroundImage: string;
  pitcher: boolean;
  seasonStats: Array<any>;
  recentGames: Array<APIGameData>;
}

interface APIGameData {
  pointsFor: string;
  opponentTeamName: string;
  pointsAgainst: string;
}

interface PostGameArticleData {
  eventId: string;
  teamId: string;
  url?: Object;
  pubDate: string;
  headline: string;
  text: Array<any>;
  img: string;
}

@Injectable()
export class DailyUpdateService {
  postGameArticleData: PostGameArticleData;

  constructor(public http: Http){}

  getErrorData(): DailyUpdateData {
    return {
      hasError: true,
      type: "",
      wrapperStyle: {},
      lastUpdateDate: "",
      chart: null,
      fullBackgroundImageUrl: "",
      seasonStats: []
    };
  }

  getTeamDailyUpdate(teamId: number): Observable<DailyUpdateData> {
    //http://dev-homerunloyal-api.synapsys.us/team/dailyUpdate/2800
    // let url = GlobalSettings.getApiUrl() + '/team/dailyUpdate/' + teamId;
  //  let url = "http://dev-homerunloyal-api.synapsys.us/team/dailyUpdate/2800"; //place holder data for QA review
    let url = GlobalSettings.getApiUrl() + '/dailyUpdate/team/' + teamId;

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.formatTeamData(data.data, teamId));
  }

  private formatTeamData(data: APIDailyUpdateData, teamId: number): DailyUpdateData {
    // check if it report exists and it isn't just an error message string
    if (data['postgame-report'] == null || typeof(data['postgame-report']) == "string" || /^Error/.test(data['postgame-report'].article) ) {
      data['postgame-report'] = {
        displayHeadline: "Perez's hot bat not enough for Royals win",
        dateline: "Saturday, August 27, 2016 11:30 PM EDT",
        article: [
          "<a href=\"/player/kansas-city-royals/salvador-perez/93144\">Lorem Ipsum</a> delor sid ex communicae desporado conica <a href=\"#\">Flur de Li</a>, rey dunesty flex beamer contorte <a href=\"#\">Sore cacorde tagain</a>.",
          "Lorem Ipsum delor sid ex communicae desporado conica, rey dunesty flex beamer contorte cacorde tagain."
        ],
      }
    }

    if ( !data ) {
      throw new Error("Error! Data is null from Team Daily Update API");
    }

    //Setting up season stats
    var stats = [];
    if ( data.recentGames[0]["wins"] != null ) {
      var apiSeasonStats = {
        totalWins: data.recentGames[0]["wins"] ? data.recentGames[0]["wins"] : "N/A",
        totalLosses: data.recentGames[0]["losses"] ? data.recentGames[0]["losses"] : "N/A",
        lastUpdated: data.recentGames[0]["lastUpdate"] ? data.recentGames[0]["lastUpdate"] : "N/A",
        pointsPerGame: data.recentGames[0]["pointsPerGame"] ? data.recentGames[0]["pointsPerGame"] : "N/A",
        passingYardsPerGame: data.recentGames[0]["passingYardsPerGame"] ? data.recentGames[0]["passingYardsPerGame"] : "N/A",
        rushingYardsPerGame: data.recentGames[0]["rushingYardsPerGame"] ? data.recentGames[0]["rushingYardsPerGame"] : "N/A",
      }
      var record = "N/A";
      if ( data.recentGames[0]["wins"] != null && data.recentGames[0]["losses"] != null ) {
        record = data.recentGames[0]["wins"] + "-" + data.recentGames[0]["losses"];
      }
      // stats = [
      //   {
      //     name: "Win Loss Record",
      //     value: record,
      //     icon: "fa-trophy"
      //   },
      //   {
      //     name: "Hits",
      //     value: apiSeasonStats.batHits != null ? apiSeasonStats.batHits : "N/A", //TODO: get hits from API
      //     icon: "fa-batt-and-ball" //TODO: use 'baseball and bat' icon
      //   },
      //   {
      //     name: "Earned Runs Average",
      //     value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) : "N/A",
      //     icon: "fa-batter" //TODO: use 'batter swinging' icon
      //   },
      //   {
      //     name: "Runs Batted In",
      //     value: apiSeasonStats.batRbi != null ? Number(apiSeasonStats.batRbi) : "N/A",
      //     icon: "fa-batter-alt" //TODO: get 'batter standing' icon
      //   }
      // ]
      stats = [
        {
          name: "Win Loss Record",
          value: record,
          icon: "fa-trophy"
        },
        {
          name: "Average Points Per Game",

          value: data.recentGames[0]["pointsPerGame"] != null ? data.recentGames[0]["pointsPerGame"] : "N/A",
          icon: "fa-tdpoints"
        },
        {
          name: "Passing Yards Per Game",
          value: data.recentGames[0]["passingYardsPerGame"] != null ? data.recentGames[0]["passingYardsPerGame"] : "N/A",
          icon: "fa-tdball"
        },
        {
          name: "Rushing Yards Per Game",
          value: data.recentGames[0]["rushingYardsPerGame"] != null ? data.recentGames[0]["rushingYardsPerGame"] : "N/A",
          icon: "fa-tdrushing"
        }
      ]
    }

    //Setting up chart info
    var seriesOne = {
        name: "Points For",
        key: "pointsFor"
    };
    var seriesTwo = {
        name: "Points Against",
        key: "pointsAgainst"
    };
    data.recentGames =[
      {
        pointsFor: data.recentGames[0]["game1Stat1"] != null ? data.recentGames[0]["game1Stat1"] : "N/A",
        pointsAgainst: data.recentGames[0]["game1Stat2"] != null ? data.recentGames[0]["game1Stat2"] : "N/A",
        opponentTeamName: data.recentGames[0]["game1AgainstNick"] != null ? data.recentGames[0]["game1AgainstNick"] : "N/A"
      },
      {
        pointsFor: data.recentGames[0]["game2Stat1"] != null ? data.recentGames[0]["game2Stat1"] : "N/A",
        pointsAgainst: data.recentGames[0]["game2Stat2"] != null ? data.recentGames[0]["game2Stat2"] : "N/A",
        opponentTeamName: data.recentGames[0]["game2AgainstNick"] != null ? data.recentGames[0]["game2AgainstNick"] : "N/A"
      },
      {
        pointsFor: data.recentGames[0]["game3Stat1"] != null ? data.recentGames[0]["game3Stat1"] : "N/A",
        pointsAgainst: data.recentGames[0]["game3Stat2"] != null ? data.recentGames[0]["game3Stat2"] : "N/A",
        opponentTeamName: data.recentGames[0]["game3AgainstNick"] != null ? data.recentGames[0]["game3AgainstNick"] : "N/A"
      },
      {
        pointsFor: data.recentGames[0]["game4Stat1"] != null ? data.recentGames[0]["game4Stat1"] : "N/A",
        pointsAgainst: data.recentGames[0]["game4Stat2"] != null ? data.recentGames[0]["game4Stat2"] : "N/A",
        opponentTeamName: data.recentGames[0]["game4AgainstNick"] != null ? data.recentGames[0]["game4AgainstNick"] : "N/A"
      }
    ]
    var chart:DailyUpdateChart = this.getChart(data, seriesOne, seriesTwo);
    this.getPostGameArticle(data);

    if ( chart ) {
        return {
          hasError: false,
          lastUpdateDate: data.lastUpdated ? GlobalFunctions.formatUpdatedDate(data.lastUpdated) : "",
          fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(data.recentGames[0]["backgroundUrl"]),
          type: "Team",
          wrapperStyle: {},
          seasonStats: stats,
          chart: chart,
          postGameArticle: this.postGameArticleData
        };
    }
    else {
      return null;
    }
  }


  getPlayerDailyUpdate(playerId: number): Observable<DailyUpdateData> {
  let url =  "http://dev-homerunloyal-api.synapsys.us/player/dailyUpdate/2800";
  //  let url = GlobalSettings.getApiUrl() + '/player/dailyUpdate/' + playerId;

    // console.log("getting daily update for player " + playerId + ": " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.formatPlayerData(data.data, playerId));
  }

  private formatPlayerData(data: APIDailyUpdateData, playerId: number): DailyUpdateData {
    if ( !data ) {
      throw new Error("Error! Data is null from Player Daily Update API");
    }
    //Setting up season stats
    var stats = [];
    if ( data.seasonStats && data.seasonStats.length > 0 ) {
      var apiSeasonStats = data.seasonStats[0];
      stats = data.pitcher ? this.getPitcherStats(apiSeasonStats) : this.getBatterStats(apiSeasonStats);
    }

    //Setting up chart info
    var seriesOne;
    var seriesTwo;
    if ( data.pitcher ) {
      seriesOne = {
        name: "Earned Runs",
        key: "pitchEarnedRuns"
      };
      seriesTwo = {
        name: "Hits",
        key: "pitchHits"
      };
    }
    else {
      seriesOne = {
        name: "Runs",
        key: "batRunsScored"
      };
      seriesTwo = {
        name: "Hits",
        key: "batHits"
      };
    }
    var chart:DailyUpdateChart = this.getChart(data, seriesOne, seriesTwo);
    //this.getPostGameArticle(data);  // TODO turn back on

    if(this.postGameArticleData.text && this.postGameArticleData.text.length>0){
      let tempText = this.postGameArticleData.text.join(" ");
      this.postGameArticleData.text = [tempText];
    }

    if ( chart ) {
      return {
        hasError: false,
        lastUpdateDate: data.lastUpdated ? GlobalFunctions.formatUpdatedDate(data.lastUpdated) : "",
        fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(data.backgroundImage),
        type: "Player",
        wrapperStyle: {'padding-bottom': '10px'},
        seasonStats: stats,
        chart: chart,
        postGameArticle: this.postGameArticleData
      };
    }
    else {
      return null;
    }
  }

  private getPitcherStats(apiSeasonStats) {
    var record = "N/A";
    if ( apiSeasonStats.pitchWins != null && apiSeasonStats.pitchLosses != null ) {
      record = apiSeasonStats.pitchWins + "-" + apiSeasonStats.pitchLosses;
    }

    return [
        {
          name: "Win Loss Record",
          value: record,
          icon: "fa-tdrushat"
        },
        {
          name: "Innings Pitched",
          value: apiSeasonStats.pitchInningsPitched != null ? apiSeasonStats.pitchInningsPitched : "N/A",
          icon: "fa-tdrecyards" //TODO: get 'baseball field' icon
        },
        {
          name: "Strike Outs",
          value: apiSeasonStats.pitchStrikeouts != null ? apiSeasonStats.pitchStrikeouts : "N/A",
          icon: "fa-tdrushing" //TODO: get '2 baseball bats' icon
        },
        {
          name: "Earned Runs Average",
          value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) : "N/A",
          icon: "fa-tdpoints" //TODO: use 'batter swinging' icon
        }
      ]
  }

  private getBatterStats(apiSeasonStats) {
    var batOnBasePercentage = "N/A";
    if ( apiSeasonStats.batOnBasePercentage != null ) {
      var value = Number(apiSeasonStats.batOnBasePercentage) * 100;
      batOnBasePercentage = value.toFixed(0) + "%";
    }

    var batAverage = "N/A";
    if ( apiSeasonStats.batOnBasePercentage != null ) {
      var value = Number(apiSeasonStats.batAverage) * 100;
      batAverage = value.toFixed(0) + "%";
    }

    return [
        {
          name: "Home Runs",
          value: apiSeasonStats.batHomeRuns != null ? apiSeasonStats.batHomeRuns : "N/A",
          icon: "fa-base-lg" //TODO: get 'homeplate' icon
        },
        {
          name: "Batting Average",
          value: batAverage,
          icon: "fa-batt-and-ball" //TODO: get 'baseball and bat' icon
        },
        {
          name: "Runs Batted In",
          value: apiSeasonStats.batRbi != null ? apiSeasonStats.batRbi : "N/A",
          icon: "fa-batter-alt" //TODO: get 'batter standing' icon
        },
        {
          name: "On Base Percentage",
          value: batOnBasePercentage,
          icon: "fa-percentage-alt"
        }
      ]
  }
  private getPostGameArticle(data: APIDailyUpdateData) {
    let articleData = {};

    articleData['eventId'] = data.recentGames[0].eventId != null ? data.recentGames[0].eventId : null;
    articleData['teamId'] = data.recentGames[0].teamId != null ? data.recentGames[0].teamId : null;
    articleData['url'] = articleData['eventId'] != null ? ['Article-pages', {eventType: 'postgame-report', eventID: articleData['eventId']}] : ['Error-page'];
    articleData['pubDate'] = data['postgame-report'].dateline != null ? data['postgame-report'].dateline : null;
    articleData['headline'] = data['postgame-report'].displayHeadline != null ? data['postgame-report'].displayHeadline : null;
    articleData['text'] = data['postgame-report'].article != null && data['postgame-report'].article.length > 0 ? data['postgame-report'].article : null;
    articleData['img'] = data['postgame-report'].images != null && data['postgame-report'].images[articleData['teamId']] != null && data['postgame-report'].images[articleData['teamId']].length > 0 ? data['postgame-report'].images[articleData['teamId']][0]: null;

    this.postGameArticleData = <PostGameArticleData>articleData;
  }

  private getChart(data: APIDailyUpdateData, seriesOne: DataSeries, seriesTwo: DataSeries) {
    if ( data.recentGames && data.recentGames.length > 0 ) { //there should be at least one game in order to show the module
      var chart:DailyUpdateChart = {
          categories: [],
          dataSeries: [{
            name: seriesOne.name,
            values: []
          },
          {
            name: seriesTwo.name,
            values: []
          }]
      };

      data.recentGames.forEach((item, index) => {
        chart.categories.push("vs " + item.opponentTeamName); //TODO: Should this link to the team?

        chart.dataSeries[0].values.push(item[seriesOne.key] != null ? Number(item[seriesOne.key]) : null);
        chart.dataSeries[1].values.push(item[seriesTwo.key] != null ? Number(item[seriesTwo.key]) : null);
      });
      return chart;
    }
    else {
      return null;
    }
  }
}
