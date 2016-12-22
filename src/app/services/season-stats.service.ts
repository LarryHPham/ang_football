import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';

//globals
import { VerticalGlobalFunctions } from '../global/vertical-global-functions';
import { GlobalFunctions } from '../global/global-functions';
import { GlobalSettings } from '../global/global-settings';

//interfaces
import { SliderCarousel, SliderCarouselInput } from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import { CircleImageData } from '../fe-core/components/images/image-data';
import { ComparisonBarInput } from '../fe-core/components/comparison-bar/comparison-bar.component';
import { SeasonStatsModuleData, SeasonStatsTabData } from '../fe-core/modules/season-stats/season-stats.module';
import { Season, SportPageParameters } from '../global/global-interface';
import { TeamSeasonStatsData, SportSeasonStatsTabData, SportSeasonStatsTableModel, SportSeasonStatsTableData } from './season-stats-page.data';
import { TableTabData } from '../fe-core/components/season-stats/season-stats.component';

export interface SeasonStatsPlayerData {
  teamId: string;
  teamName: string;
  teamFirstName: string;
  teamLastName: string;
  playerId: string;
  playerName: string;
  playerFirstName: string;
  playerLastName: string;
  roleStatus: string;
  active: string;
  position: Array<string>;
  playerHeadshot: string;
  teamLogo: string;
  lastUpdate: string;
  liveImage: string;
  lastUpdateTimestamp: string;
  statScope: string;
}

// Interfaces to help convert API data into a ComparisonBarList that can be
// used to build the comparison bars in the module.
interface APISeasonStatsData {
  playerInfo: SeasonStatsPlayerData
  stats: { [year: string]: SeasonStats };
}

interface SeasonStats {
  leader: {[field:string]:DataPoint};
  average: {[field:string]:string};
  player: {[field:string]:string};
  worst: {[field:string]:DataPoint};
}

interface DataPoint {
  statValue: string;
  players: Array<SimplePlayerData>;
}

interface SimplePlayerData {
  firstName: string;
  playerLastName: string;
  playerId: string;
  teamId: string;
  teamName: string;
  teamLastName: string;
  playerHeadshot: string;
}

@Injectable()
export class SeasonStatsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  private _scope: string;
  constructor(public http: Http) { }

  setToken(){
    var headers = new Headers();
    return headers;
  }

  private getLinkToPage(playerId: number, playerName: string): Array<any> {
    let partnerRoute = GlobalSettings.storedPartnerId() ? '/'+GlobalSettings.storedPartnerId() : '';
    return [partnerRoute+'/'+this._scope ,"season-stats", GlobalFunctions.toLowerKebab(playerName), playerId];
  }

  getPlayerStats(playerId: number, scope?: string){
    // let url = this._apiUrl + "/player/seasonStats/" + playerId;
    let url = GlobalSettings.getApiUrl() + "/seasonStats/module/player/" + playerId;
    if(scope != null){
      this._scope = scope;
    }
    return this.http.get(url)
      .map(res => res.json())
      .map(data => this.formatData(data.data, scope));
  }

  private formatData(data: APISeasonStatsData, scope?: string) {
    if ( !data ) {
      return null;
    }
    //var fields = data.playerInfo.position[0].charAt(0) == "P" ? this.pitchingFields : this.battingFields;
    let playerInfo = data.playerInfo;
    let stats = data.stats;
    //Check to see if the position list contains pitcher abbreviation
    //in order to select the appropriate fields
    //let isPitcher = playerInfo.position.filter(item => item == "P").length > 0;
    var seasonStatTabs = [];
    var curYear = new Date().getFullYear();

    //Load 4 years worth of data, starting from current year
    for ( var year = curYear; year > curYear-4; year-- ) {
      var strYear = year.toString();
      seasonStatTabs.push(this.getTabData(strYear, data, playerInfo[0].playerFirstName + " " + playerInfo[0].playerLastName, false, year == curYear, scope));
    }
    //Load "Career Stats" data
    seasonStatTabs.push(this.getTabData("Career", data, playerInfo[0].playerFirstName + " " + playerInfo[0].playerLastName, false, null, scope));
    return {
      tabs: seasonStatTabs,
      profileName: playerInfo[0].playerFirstName + " " + playerInfo[0].playerLastName,
      carouselDataItem: SeasonStatsService.getCarouselData(playerInfo, stats, curYear.toString(), curYear.toString(), scope),
      pageRouterLink: this.getLinkToPage(Number(playerInfo[0].playerId), playerInfo[0].playerFirstName + " " + playerInfo[0].playerLastName),
      playerInfo: playerInfo,
      stats: stats
    };
  }

  private getBarData(stats: SeasonStats, isCareer: boolean, isPitcher: boolean, scope) {
    if(stats !== undefined){ //catch if no data for season
    //let statsToInclude = isPitcher ? this.pitchingFields : this.battingFields;
    let bars = [];

    for ( var index in stats ) {
      var fieldName = stats[index].statDescription;
      var infoBox = null;

      //catch no stat data
      var worstValue = stats[index].statAverage != undefined ? stats[index].statAverage : null;
      var leaderValue = stats[index].leaderStat != undefined ? stats[index].leaderStat : null;
      var playerValue = stats[index].stat != undefined ? stats[index].stat : null;
      var dataPoints = [];

      //Set up data points
      if ( isCareer ) {
        dataPoints = [{
          value: this.formatValue(fieldName, playerValue),
          color: '#2d3e50'
        }];
      }
      else {
        var avgValue = stats[index].statAverage  != null ? stats[index].statAverage  : 'N/A';
        var infoIcon = 'fa-info-circle';
        dataPoints = [{
          value: this.formatValue(fieldName, playerValue),
          color: '#2d3e50',
          fontWeight: '800'
        },
        {
          value: this.formatValue(fieldName, avgValue),
          color: '#999999',
        }];

        //Set up info box only for non-career tabs
        if ( leaderValue == null ) {
          console.log("Error - leader value is null for " + fieldName);
        }
        else if ( leaderValue ) {
          var playerName = stats[index].leaderName;
          var linkToPlayer = VerticalGlobalFunctions.formatPlayerRoute(scope, stats[index].leaderName, playerName, stats[index].leaderId);
          infoBox = [{
              teamName: stats[index].leaderTeamName,
              playerName: playerName,
              infoBoxImage : {
                imageClass: "image-40",
                mainImage: {
                  imageUrl: GlobalSettings.getImageUrl(stats[index].leaderHeadshotUrl),
                  imageClass: "border-1",
                  urlRouteArray:  linkToPlayer,
                  hoverText: "<i class='fa fa-mail-forward infobox-list-fa'></i>",
                },
              },
              routerLinkPlayer: linkToPlayer,
              routerLinkTeam: VerticalGlobalFunctions.formatTeamRoute(scope, stats[index].leaderTeamName, stats[index].leaderTeamId),
            }];
        }
      }

      bars.push({
        title: fieldName,
        data: dataPoints,
        minValue: worstValue != null ? Number(this.formatValue(fieldName, worstValue)) : null,
        maxValue: leaderValue != null ? Number(this.formatValue(fieldName, leaderValue)) : null,
        info: infoIcon != null ? infoIcon : null,
        infoBoxDetails: infoBox,
        qualifierLabel: SeasonStatsService.getQualifierLabel(fieldName)
      });
    }
    return bars;
    }
  }


  private getTabData(seasonId: string, data: APISeasonStatsData, playerName: string, isPitcher: boolean, isCurrYear?: boolean, scopeName?: string) {
    var legendValues;
    var subTitle;
    var tabTitle;
    var longSeasonName; // for display in the carousel and module title
    var isCareer = seasonId == "career";
    var bars= this.getBarData(data.stats[seasonId], isCareer, isPitcher, data.playerInfo[0].statScope);

    scopeName = scopeName != null ? scopeName.toUpperCase() : "League";
    scopeName = scopeName == "FBS" ? "NCAAF" : scopeName;

    if ( isCareer ) {
      tabTitle = "Career Stats";
      subTitle = tabTitle;
      longSeasonName = "Career";
      legendValues = [
          { title: playerName,    color: '#2d3e50' },
          { title: "Stat High",  color: "#E1E1E1" }
      ];
    }
    else {
      if ( isCurrYear ) {
        tabTitle = "Current Season";
        subTitle = tabTitle;
        longSeasonName = tabTitle;
      }
      else {
        tabTitle = seasonId;
        subTitle = seasonId + " Season";
        longSeasonName = subTitle;
      }
      legendValues = [
          { title: playerName,    color: '#2d3e50' },
          { title: scopeName + ' Average', color: '#999999' },
          { title: scopeName + " Leader",  color: "#E1E1E1" }
      ];
    }
    if(bars != null && bars.length == 0){ bars = undefined};
    return {
      longSeasonName: longSeasonName,
      tabTitle: tabTitle,
      comparisonLegendData: {
        legendTitle: [
          { text: subTitle, class: 'text-heavy' },
          { text: ' Stats' }
        ],
        legendValues: legendValues
      },
      tabData: bars
    };
  }

  static getCarouselData(playerInfo: SeasonStatsPlayerData, stats, longSeasonName: string, currentTab, scope?): SliderCarouselInput {
    var date = new Date();
    if (currentTab == "Current Season") {
      currentTab = date.getFullYear();
    }
    if ( !playerInfo[0] ) {
      return null;
    }
    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(scope, playerInfo[0].teamName, playerInfo[0].teamId);

    var teamRouteText = {
      route: teamRoute,
      text: playerInfo[0].teamName,
      class: 'text-heavy'
    };
    var playerRouteText = {
      text: playerInfo[0].playerFirstName + " " + playerInfo[0].playerLastName
    };
    var description: any = ["No Information for this season"];
    if (stats[currentTab] != null && stats[currentTab].length > 0) {
      description = SeasonStatsService.getDescription(stats[currentTab], playerInfo[0].position, playerRouteText, playerInfo[0].statScope);
    }
    return SliderCarousel.convertToCarouselItemType1(1, {
      backgroundImage: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(playerInfo[0].backgroundUrl),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [longSeasonName + " Stats Report"],
      profileNameLink: playerRouteText,
      description: description,
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(playerInfo[0].lastUpdated),
      circleImageUrl: GlobalSettings.getImageUrl(playerInfo[0].playerHeadshot),
      circleImageRoute: null, //? the single item on the player profile page, so no link is needed
      // subImageUrl: GlobalSettings.getImageUrl(data.playerInfo.teamLogo),
      // subImageRoute: teamRoute
    });
  }

  static getDescription(stats, position, playerRouteText, scope) {
    var description = ["No Data Availible for this Season"];
    if (stats != null && stats.length > 0) {
    switch(position) {
      case "QB":
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , "Passing Yards" , " with " , Number(stats[1].stat).toFixed(0)  , " " , "Completions" , " and " , Number(stats[2].stat).toFixed(0)  , " " ,"Passing Touchdowns" + "." ];
          break;
      case "CB":
      case "DB":
      case "DE":
      case "DL":
      case "DT":
      case "LB":
      case "OLB":
      case "S":
          description = [playerRouteText, " has a total of ", Number(stats[2].stat).toFixed(0) , " " , "Assisted Tackles" , ", " , Number(stats[0].stat).toFixed(0)  , " " , "Total Tackles" , " and " , Number(stats[2].stat).toFixed(0)  , " " , "Total Sacks." ];
          break;
      case "C":
      case "G":
      case "LS":
      case "OL":
      case "OT":
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , "Games Played" , " with " , Number(stats[1].stat).toFixed(0)  , " " , "Games Started."];
          break;
      case "K":
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , "Field Goals Made" , " with " , Number(stats[1].stat).toFixed(0)  , " " , "Attempts" , " and " , Number(stats[3].stat).toFixed(0)  , " " , "Extra Points Made." ];
          break;
      case "P":
          description = [playerRouteText, " has ", Number(stats[0].stat).toFixed(0) , " " , "Total Punts" , " with " , Number(stats[1].stat).toFixed(0)  , " " , "Gross Punting Yards." , " His Longest Punt was " , Number(stats[2].stat).toFixed(0)  , " Yards. "];
          break;
      case "RB":
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , "Rushing Yards" , " with " , Number(stats[1].stat).toFixed(0)  , " " , "Average Yards Per Carry" , " and " , Number(stats[2].stat).toFixed(0)  , " " , "Attempts." ];
          break;
      case "RS":
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , SeasonStatsService.getKeyDisplayTitle(stats[0].statType, scope) , " with " , Number(stats[1].stat).toFixed(0)  , " " , SeasonStatsService.getKeyDisplayTitle(stats[1].statType, scope) , " and " , Number(stats[2].stat).toFixed(0)  , " " , SeasonStatsService.getKeyDisplayTitle(stats[2].statType, scope)+"." ];
          break;
      case "TE":
      case "WR":
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , "Recieving Yards" , " with " , Number(stats[1].stat).toFixed(0)  , " " , "Average Yards Per Reception" , " and " , Number(stats[2].stat).toFixed(0)  , " " , "Receptions." ];
          break;
      default:
          description = [playerRouteText, " has a total of ", Number(stats[0].stat).toFixed(0) , " " , SeasonStatsService.getKeyDisplayTitle(stats[0].statType, scope) , " with " , Number(stats[1].stat).toFixed(0)  , " " , SeasonStatsService.getKeyDisplayTitle(stats[1].statType, scope) , " and " , Number(stats[2].stat).toFixed(0)  , " " , SeasonStatsService.getKeyDisplayTitle(stats[2].statType, scope)+"." ];
      }
      }
    return description;
  }

  static getQualifierLabel(key: string): string {
    switch (key) {
      case "pitchBasesOnBalls":
      case "pitchHits":
      case "pitchEra":
      case "pitchEarnedRuns":
      case "pitchHomeRunsAllowed":
        return "A lower number indicates a stronger performance.";

      default:
        return null;
    }
  }

  static getKeyDisplayTitle(key: string, scope): string {
    key = key.replace(/_/g, " ");
    key = key.replace("player", "");
    key = key.replace(scope, "");
    key = key.toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
    return letter.toUpperCase(); } );
    return key;
    // switch (key) {
    //   case "batHomeRuns": return "Home Runs (HR)";
    //   case "batAverage": return "Batting Average (BA)";
    //   case "batRbi": return "Runs Batted In (RBI)";
    //   case "batHits": return "Hits (H)";
    //   case "batBasesOnBalls": return "Walks (BB)";
    //
    //   case "pitchWins": return "Wins";
    //   case "pitchInningsPitched": return "Innings Pitched (IP)";
    //   case "pitchStrikeouts": return "Strike Outs (SO)";
    //   case "pitchEra": return "ERA";
    //   case "pitchHits": return "Hits";
    //   default: return null;
    // }
  }

  private formatValue(fieldName: string, value: string): string {
    if ( value == null ) {
      return null;
    }
    switch (fieldName) {
      case "batAverage":           return Number(value).toFixed(3);
      case "pitchInningsPitched":  return Number(value).toFixed(1);
      case "pitchEra":             return Number(value).toFixed(2);

      case "batHomeRuns":
      case "batRbi":
      case "batHits":
      case "batBasesOnBalls":
      case "pitchWins":
      case "pitchStrikeouts":
      case "pitchHits":
      default: return Number(value).toFixed(0);
    }
  }
}

@Injectable()
export class SeasonStatsPageService {
  constructor(public http: Http, private _mlbFunctions: VerticalGlobalFunctions){}

  getPageTitle( pageParams: SportPageParameters, playerName: string): string {
    let pageTitle = "Season Stats";
    if ( playerName ) {
      pageTitle = "Season Stats - " + playerName;
    }
    return pageTitle;
  }

  initializeAllTabs(pageParams: SportPageParameters): Array<SportSeasonStatsTabData> {
    let tabs: Array<SportSeasonStatsTabData> = [];
    var curYear = new Date().getFullYear();
    var year = curYear;
    var playerName = pageParams['playerName'];
    var possessivePlayer = GlobalFunctions.convertToPossessive(playerName);
    //create tabs for season stats from current year of MLB and back 3 years
    for ( var i = 0; i < 4; i++ ){
      let title = year == curYear ? 'Current Season' : year.toString();
      let tabName = possessivePlayer + " " + title + " Stats";
      tabs.push(new SportSeasonStatsTabData(title, tabName, null, year.toString(), i==0, pageParams.scope));
      year--;
    }
    //also push in last the career stats tab
    let title = 'Career Stats';
    let tabName = possessivePlayer + " Career Stats";
    tabs.push(new SportSeasonStatsTabData(title, tabName, null, 'career', false, pageParams.scope));
    return tabs;
  }

  getSeasonStatsTabData(seasonStatsTab: SportSeasonStatsTabData, pageParams: SportPageParameters, onTabsLoaded: Function, maxRows?: number){
      var playerId = pageParams.playerId;
      //example url: http://dev-homerunloyal-api.synapsys.us/player/statsDetail/96652
      let url = GlobalSettings.getApiUrl() + "/seasonStats/page/player/" + playerId;
      seasonStatsTab.isLoaded = false;
      seasonStatsTab.hasError = false;
      this.http.get(url)
          .map(res => res.json())
          .map(data => this.setupTabData(seasonStatsTab, data.data, pageParams.teamId, maxRows, pageParams.scope))
          .subscribe(data => {
            seasonStatsTab.isLoaded = true;
            seasonStatsTab.hasError = false;
            seasonStatsTab.sections = data;
            onTabsLoaded(data);
          },
          err => {
            seasonStatsTab.isLoaded = true;
            seasonStatsTab.hasError = true;
            console.log("Error getting season stats data", err);
          });
  }

  private setupTabData(seasonStatsTab: SportSeasonStatsTabData, apiData: any, playerId: number, maxRows: number, scope): any{
    let seasonTitle;
    let sectionTable;
    var sections : Array<SportSeasonStatsTableData> = [];
    var totalRows = 0;
    var seasonKey = seasonStatsTab.year;
    var tableData = {};
    //run through each object in the api and set the title of only the needed season for the table regular and post season
    for(var season in apiData.stats){
      if (season == seasonKey) {
      seasonTitle = "Regular Season";
      // we only care about the tables that meet the switch cases being regular and post season
      if(seasonTitle != null){
        //set the section table to season
        sectionTable = apiData.stats[season];
        //section Table now need to be set to sectionYear which are each of the different stats for each season of that [YEAR] being 'total' and 'average' NOTE: 'total' is being sent back as 'stat'
        if(seasonKey == 'career'){
          let sectionTitle;
          var sectionStat;
          //look for the career total and grab all the stats for the players career
          for(var statType in sectionTable[seasonKey]){
            switch(statType){
              case 'averages':
              sectionStat = "Average";
              sectionTitle = seasonTitle + " " + sectionStat;
              break;
              case 'stats':
              sectionStat = "Total";
              sectionTitle = seasonTitle + " " + sectionStat;
              break;
              default:
              break;
            }
            //run through each object in the api and set the title of only the needed section for the table averages and stats 'total'
            if(sectionTitle != null){
              let sectionData = [];
              for(var year in sectionTable){//grab all season data and push them into a single array for career stats tab
                sectionTable[year][statType].playerInfo = apiData.playerInfo[0];
                sectionTable[year][statType].teamInfo = sectionTable[year].teamInfo != null ? sectionTable[year].teamInfo : {};
                if(year != 'career'){
                  sectionData.push(sectionTable[year][statType]);
                }
              }
              sectionTable['career'][statType]['seasonId'] = 'Career';
              sectionTable['career'][statType]['sectionStat'] = sectionStat;
              sectionData.push(sectionTable['career'][statType]);

              //sort by season id and put career at the end
              sections.push(this.setupTableData(sectionTitle, seasonKey, sectionData, maxRows, scope));
            }//END OF SECTION TITLE IF STATEMENT
          }//END OF SEASON YEAR FOR LOOP

        }else{
          var transData = {stats:{seasonId: ""}, averages:{seasonId: ""}};
          for (var i =0; i < sectionTable.length; i++) {
            transData.averages[sectionTable[i].statType] = sectionTable[i].seasonAverage;
            transData.averages.seasonId = season;
            transData.stats[sectionTable[i].statType] = sectionTable[i].stat;
            transData.stats.seasonId = season;
          }
          var sectionYear = transData;
          if(sectionYear != null){// check if there are even stats for the season existing
            let sectionTitle;
            for(var statType in sectionYear){
              switch(statType){
                case 'averages':
                sectionTitle = seasonTitle + " " + "Average";
                break;
                case 'stats':
                sectionTitle = seasonTitle + " " + "Total";
                break;
                default:
                break;
              }
              //run through each object in the api and set the title of only the needed section for the table averages and stats 'total'
              if(sectionTitle != null){
                let sectionData = sectionYear[statType];
                sectionData.playerInfo = apiData.playerInfo[0];
                sectionData.teamInfo = apiData.teamInfo != null ? apiData.teamInfo : {};
                sections.push(this.setupTableData(sectionTitle, seasonKey, sectionData, maxRows, scope));
              }//END OF SECTION TITLE IF STATEMENT
            }//END OF SEASON YEAR FOR LOOP
          }//end of season year if check
        }//end of season key check
      }//END OF SEASON TITLE IF STATEMENT
    }
    }//END OF SEASON FOR LOOP
    // this.convertAPIData(apiData.regularSeason, tableData);
    return sections;
  }

  private setupTableData(season, year, rows: Array<any>, maxRows: number, scope: string): SportSeasonStatsTableData {
    var tableName;
    let self = this;
    //convert object coming in into array
    if(year == 'career'){
      var rowArray = rows;
    }else{
      var rowArray = [];
      rowArray.push(rows);
    }
    tableName = season;
    var table = new SportSeasonStatsTableModel(rowArray, scope);// set if pitcher to true

    return new SportSeasonStatsTableData(tableName, season, year, table);
  }

}
