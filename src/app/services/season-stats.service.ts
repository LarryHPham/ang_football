import { Injectable } from '@angular/core';

//globals
import { VerticalGlobalFunctions } from '../global/vertical-global-functions';
import { GlobalFunctions } from '../global/global-functions';
import { GlobalSettings } from '../global/global-settings';
import { ModelService } from "../global/shared/model/model.service";

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
  lastUpdated: string;
  backgroundUrl: string;
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
  constructor(public model: ModelService) { }

  private getLinkToPage(playerId: number, playerName: string, season: string): Array<any> {
    let partnerRoute = GlobalSettings.storedPartnerId() ? '/'+GlobalSettings.storedPartnerId() : '';
    return [partnerRoute+'/'+this._scope ,"season-stats", season, GlobalFunctions.toLowerKebab(playerName), playerId];
  }

  getPlayerStats(playerId: number, scope?: string, season?: string) {
    // let url = this._apiUrl + "/player/seasonStats/" + playerId;
    let url = GlobalSettings.getApiUrl() + "/seasonStats/module/player/" + playerId;
    if(scope != null){
      this._scope = scope;
    }
    return this.model.get(url)
      .map(data =>{
        var statsData = this.formatData(data.data, scope, season);
        return statsData;
      });
  }

  private formatData(data: APISeasonStatsData, scope?: string, season?: string) {
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
    var curYear = season != null ? Number(season) : new Date().getFullYear();

    //Load 4 years worth of data, starting from current year
    for ( var year = curYear; year > curYear-4; year-- ) {
      var strYear = year.toString();
      seasonStatTabs.push(this.getTabData(strYear, data, playerInfo.playerFirstName + " " + playerInfo.playerLastName, false, year == curYear, scope));
    }
    //Load "Career Stats" data
    seasonStatTabs.push(this.getTabData("Career", data, playerInfo.playerFirstName + " " + playerInfo.playerLastName, false, null, scope));
    return {
      tabs: seasonStatTabs,
      profileName: playerInfo.playerFirstName + " " + playerInfo.playerLastName,
      carouselDataItem: SeasonStatsService.getCarouselData(playerInfo, stats, curYear.toString(), curYear.toString(), scope),
      pageRouterLink: this.getLinkToPage(Number(playerInfo.playerId), playerInfo.playerFirstName + " " + playerInfo.playerLastName, season),
      playerInfo: playerInfo,
      stats: stats
    };
  }

  private getBarData(stats: SeasonStats, isCareer: boolean, isPitcher: boolean, scope) {
    try{
      if(stats !== undefined){ //catch if no data for season
      //let statsToInclude = isPitcher ? this.pitchingFields : this.battingFields;
      let bars = [];

      for ( var index in stats ) {
        if(stats[index]){
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
                    imageUrl: GlobalSettings.getImageUrl(stats[index].leaderHeadshotUrl, GlobalSettings._imgSmLogo),
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
      }
      return bars;
      }
    }catch(e){
      return [];
    }

  }


  private getTabData(seasonId: string, data: APISeasonStatsData, playerName: string, isPitcher: boolean, isCurrYear?: boolean, scopeName?: string) {
    var legendValues;
    var subTitle;
    var tabTitle;
    var longSeasonName; // for display in the carousel and module title
    var isCareer = seasonId == "Career";
    var seasonId = isCareer ? 'career' : seasonId;
    var bars = this.getBarData(data.stats[seasonId], isCareer, isPitcher, data.playerInfo.statScope);
    scopeName = scopeName != null ? scopeName.toUpperCase() : "League";
    scopeName = scopeName == "FBS" ? "NCAAF" : scopeName;

    if ( isCareer ) {
      tabTitle = "Career";
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
    else if ( currentTab == "Career" ) {
        currentTab = currentTab.toLowerCase();
    }
    if ( !playerInfo ) {
      return null;
    }
    var teamRoute = VerticalGlobalFunctions.formatTeamRoute(scope, playerInfo.teamName, playerInfo.teamId);
    var teamRouteText = {
      route: teamRoute,
      text: playerInfo.teamName,
      class: 'text-heavy'
    };
    var playerRouteText = {
      text: playerInfo.playerFirstName + " " + playerInfo.playerLastName
    };
    var description: any = ["No Information for this season"];
    if (stats[currentTab] != null && stats[currentTab].length > 0) {
      description = SeasonStatsService.getDescription(stats[currentTab], playerInfo.position, playerRouteText, playerInfo.statScope);
    }
    return SliderCarousel.convertToCarouselItemType1(1, {
      backgroundImage: VerticalGlobalFunctions.getBackgroundImageUrlWithStockFallback(playerInfo.backgroundUrl, VerticalGlobalFunctions._imgProfileMod),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [longSeasonName + " Stats Report"],
      profileNameLink: playerRouteText,
      description: description,
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(playerInfo.lastUpdated),
      circleImageUrl: GlobalSettings.getImageUrl(playerInfo.playerHeadshot, GlobalSettings._imgLgLogo),
      circleImageRoute: null, //? the single item on the player profile page, so no link is needed
      // subImageUrl: GlobalSettings.getImageUrl(data.playerInfo.teamLogo, GlobalSettings._imgLgLogo),
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
  constructor(public model: ModelService, private _mlbFunctions: VerticalGlobalFunctions){}

  getPageTitle( pageParams: SportPageParameters, playerName: string): string {
    let pageTitle = "Season Stats";
    if ( playerName ) {
      pageTitle = "Season Stats - " + playerName;
    }
    return pageTitle;
  }

  initializeAllTabs(pageParams: SportPageParameters, season?:string, seasonBase?: string): Array<SportSeasonStatsTabData> {
    let tabs: Array<SportSeasonStatsTabData> = [];
    let activeYear = season ? season : new Date().getFullYear();
    var recentYear = Number(seasonBase); // most recent season
    var playerName = pageParams['playerName'];
    var possessivePlayer = GlobalFunctions.convertToPossessive(playerName);

    for ( var i = 0; i < 4; i++ ){
      let title = i == 0 ? 'Current Season' : recentYear.toString();
      let tabName = possessivePlayer + " " + title + " Stats";
      let isActive = recentYear == activeYear;
      tabs.push(new SportSeasonStatsTabData(title, tabName, null, recentYear.toString(), isActive, pageParams.scope));
      recentYear--;
    }
    //also push in last the career stats tab
    let title = 'Career Stats';
    let tabName = possessivePlayer + " Career Stats";
    let isActive = season == 'career';
    tabs.push(new SportSeasonStatsTabData(title, tabName, null, 'career', isActive, pageParams.scope));
    return tabs;
  }

  getSeasonStatsTabData(seasonStatsTab: SportSeasonStatsTabData, pageParams: SportPageParameters, onTabsLoaded: Function, maxRows?: number){
      var playerId = pageParams.playerId;
      //example url: http://dev-homerunloyal-api.synapsys.us/player/statsDetail/96652
      let url = GlobalSettings.getApiUrl() + "/seasonStats/page/player/" + playerId;
      seasonStatsTab.isLoaded = false;
      seasonStatsTab.hasError = false;
      this.model.get(url)
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

  private setupTabData(seasonStatsTab: SportSeasonStatsTabData, apiData: any, playerId: number, maxRows: number, scope): any {
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
          if(seasonTitle != null) {
              sectionTable = apiData.stats[season]; //set the section table to season
              //section Table now need to be set to sectionYear which are each of the different stats for each season of that [YEAR] being 'total' and 'average' NOTE: 'total' is being sent back as 'stat'
              if( seasonKey == 'career' ) {
                  let sectionTitle;
                  let careerTransData = {
                      seasonAverages: [],
                      seasonTotals: []
                  }
                  for ( var year in sectionTable ) {
                      try {
                          let objCounter = Object.keys(sectionTable).indexOf(year); // gets index of object property
                          let seasonStatsArray = sectionTable[year] ? sectionTable[year] : null;

                          if ( year != 'career' ) { // career displays all the individual season data on page.
                              careerTransData.seasonAverages.push({
                                  seasonId:     seasonKey ? seasonKey : null,
                                  year:         year ? year : null,
                                  playerInfo:   apiData.playerInfo,
                                  teamInfo:     apiData.teamInfo != null ? apiData.teamInfo : {},
                                  sectionTitle: seasonTitle ? seasonTitle + " " + "Averages" : null
                              });
                              careerTransData.seasonTotals.push({
                                  seasonId:     seasonKey ? seasonKey : null,
                                  year:         year ? year : null,
                                  playerInfo:   apiData.playerInfo,
                                  teamInfo:     apiData.teamInfo != null ? apiData.teamInfo : {},
                                  sectionTitle: seasonTitle ? seasonTitle + " " + "Totals" : null
                              });
                          } //if ( year != 'career' )

                          for ( var i=0; i < seasonStatsArray.length; i++ ) {
                              let statType = seasonStatsArray[i] ? seasonStatsArray[i].statType : null;
                              let seasonAverageValue = seasonStatsArray[i].seasonAverage ? seasonStatsArray[i].seasonAverage : null;
                              let statValue = seasonStatsArray[i].stat ? seasonStatsArray[i].stat : null;
                              if ( seasonAverageValue ) {
                                  careerTransData.seasonAverages[objCounter][statType] = seasonAverageValue;
                              }
                              if ( statValue ) {
                                  careerTransData.seasonTotals[objCounter][statType] = statValue;
                              }
                          } // for ( var i=0; i < seasonStatsArray.length; i++ )
                      }
                      catch(e) {
                          console.log('Career Stats Error - ' + e);
                      }
                  } //for ( var year in sectionTable )
                  if ( careerTransData != null ) {
                      for ( statType in careerTransData ) {
                          try {
                              let careerData = careerTransData[statType] ? careerTransData[statType] : null;
                              let sectionTitle = careerData[0].sectionTitle ? careerData[0].sectionTitle : null;
                              sections.push(this.setupTableData(sectionTitle, seasonKey, careerData, maxRows, scope));
                          }
                          catch(e) {
                              console.log('Career Stats Error - ' + e);
                          }
                      }
                  } // if ( careerTransData != null )
              } // if(seasonKey == 'career')
              else if ( sectionTable.length ) {
                  var transData = {
                      stats:{seasonId: ""},
                      averages:{seasonId: ""}
                  };
                  for (var i =0; i < sectionTable.length; i++) {
                    transData.averages[sectionTable[i].statType] = sectionTable[i].seasonAverage;
                    transData.averages.seasonId = season;
                    transData.stats[sectionTable[i].statType] = sectionTable[i].stat;
                    transData.stats.seasonId = season;
                  }
                  var sectionYear = transData;
                  if(sectionYear != null) { // check if there are even stats for the season existing
                    let sectionTitle;
                    for(var statType in sectionYear) {
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
                      if(sectionTitle != null) {
                        let sectionData = [sectionYear[statType]];
                        sectionData[0].playerInfo = apiData.playerInfo;
                        sectionData[0].teamInfo = apiData.teamInfo != null ? apiData.teamInfo : {};
                        sections.push(this.setupTableData(sectionTitle, seasonKey, sectionData, maxRows, scope));
                      } // END OF SECTION TITLE IF STATEMENT
                    }// END OF SEASON YEAR FOR LOOP
                  } // end of season year if check
              } // end of season key check
          } // END OF SEASON TITLE IF STATEMENT
      } // if (season == seasonKey)
    }// END OF SEASON FOR LOOP
    // this.convertAPIData(apiData.regularSeason, tableData);
    return sections;
} //setupTableData

    private setupTableData(season, year, rows: Array<any>, maxRows: number, scope: string): SportSeasonStatsTableData {
        let self = this;
        var tableName = season;
        var table = new SportSeasonStatsTableModel(rows, scope);
        return new SportSeasonStatsTableData(tableName, season, year, table);
    } //setupTableData
}
