import {Injectable} from '@angular/core';
import {GlobalFunctions} from './global-functions';
import {Division, Conference} from './global-interface';
import {GlobalSettings} from "./global-settings";

@Injectable()

export class VerticalGlobalFunctions {

  constructor() {

  }

  /**
   * - Pass in datapoints to required parameters and formats
   * them into a single route that is in lowerCase Kebab.
   * - If parameters given do not fit the requirements them default to the error page.
   * - Otherwise takes teamName as a string
   *
   * @example
   * // teamName => 'Boston Red Sox'
   * formatTeamRoute('Boston Red Sox', 2124)
   *
   *
   * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
   * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
   * @returns the teamName => boston-red-sox,  teamId => ##, routeName => 'Team-page'
   */
  static formatTeamRoute(teamName: string, teamId: string): Array<any> {
    var teamRoute: Array<any>;
    if(typeof teamName != 'undefined' && teamName != null){
      teamName = GlobalFunctions.toLowerKebab(teamName);
      teamRoute = ['Team-page', {teamName: teamName, teamId: teamId}];//NOTE: if Team-page is on the same level as the rest of the route-outlets
    } else{
      teamRoute = null;
    }
    return teamRoute ? teamRoute : ['Error-page'];
  }

  /**
   * - Pass in datapoints to required parameters and formats
   * them into a single route.
   * - If parameters given do not fit the requirements them default to the error page.
   * - Otherwise takes articleId as a string
   *
   * @example
   * // articleId => '1234'
   * formatNewsRoute("1234")
   *
   *
   * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
   * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
   * @returns the teamName => boston-red-sox,  teamId => ##, routeName => 'Team-page'
   */
  static formatNewsRoute(articleId: string): Array<any> {
    var articleRoute: Array<any>;
    if(articleId != null) {
      articleRoute = ['Syndicated-article-page', {articleType: 'story', eventID: articleId}];//NOTE: if Team-page is on the same level as the rest of the route-outlets
    } else{
      articleRoute = null;
    }
    return articleRoute ? articleRoute : ['Error-page'];
  }


  /**
     * - Pass in datapoints to required parameters and formats
   * them into a single route that is in lowerCase Kebab.
   * - If parameters given do not fit the requirements them default to the error page.
   * - Otherwise takes teamName && playerName as a string
   *
   * @example
   * // teamName => 'Boston Red Sox'
   * // playerName => 'Babe Ruth'
   * formatTeamRoute('Boston Red Sox')
   *
   *
   * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
   * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
   * @returns the teamName => 'boston-red-sox',  playerName => 'babe-ruth' playerId => ##, routeName => 'Player-page'
   */
  static formatPlayerRoute(teamName: string, playerFullName:string, playerId: string):Array<any> {
    var playerRoute: Array<any>;

    if(typeof teamName != 'undefined' && teamName != null && typeof playerFullName != 'undefined' && playerFullName != null){
      teamName = GlobalFunctions.toLowerKebab(teamName);
      playerFullName = GlobalFunctions.toLowerKebab(playerFullName);
      playerRoute = ['Player-page',{teamName:teamName, fullName:playerFullName, playerId: playerId}];//NOTE: if Player-page is on the same level as the rest of the route-outlets
    }else{
      playerRoute = null;
    }
    return playerRoute ? playerRoute : ['Error-page'];
  }

  /**
   * - Pass in datapoints to required parameters and formats
   * them into a single route.
   * - If parameters given do not fit the requirements then default to the error page.
   * - Otherwise takes eventType as a string
   *
   * @example
   * // eventType => 'pregame-report'
   * formatTeamRoute('pregame-report', 61008)
   *
   *
   * @param {eventType} eventType - event type given from data
   * @param {eventID} eventID - event ID the required field needed to successfully navigate to artcile page
   * @returns the eventType => pregame-report,  teamId => ##, routeName => 'Article-page'
   */
  static formatArticleRoute(eventType: string, eventID: string): Array<any> {
    var articleRoute: Array<any>;
    if(typeof eventType != 'undefined' && eventType != null){
      articleRoute = ['Article-pages', {eventType: eventType, eventID: eventID}];
    } else{
      articleRoute = null;
    }
    return articleRoute ? articleRoute : ['Error-page'];
  }

  /**
   * - Formats the height string by removing the dashes and adding
   * tick marks for feet and inches.
   * - If heightStr is null or empty, "N/A" is returned.
   * - If no dash, the string is returned unchanged
   *
   * @example
   * // 6'8"
   * formatHeight('6-8')
   *
   * @param {string} heightStr - a height value from the API, which lists feet and inches separated by a dash (#-#)
   * @returns the height with ticks for feet and inches (#'#")
   */
  static formatHeight(heightStr: string) {
    return heightStr ? heightStr.replace(/(\d+)-(\d+)/, "$1'$2\"") : "N/A";
  }
  static formatHeightInches(heightStr: string) {
    var heightInFeet = (Number(heightStr) / 12)|0;
    var inches = Number(heightStr) % 12;
    return heightInFeet + "-" + inches;
  }

  /**
   * - Formats the height string by replacing the dash with '-foot-'
   * - If heightStr is null or empty, "N/A" is returned.
   * - If no dash, the string is returned unchanged
   *
   * @example
   * // 6-8
   * formatHeight('6-foot-8')
   *
   * @param {string} heightStr - a height value from the API, which lists feet and inches separated by a dash (#-#)
   * @returns #-foot-#
   */
   static formatHeightWithFoot(heightStr: string) {
     if ( heightStr ) {
       var insert ="-foot-";
       var formattedHeight = [heightStr.slice(0, 1), insert, heightStr.slice(1)].join('');
       return heightStr ? formattedHeight : "N/A";
     }
     else {
       return "N/A";
     }
   }


  /**
   * - Outputs a valid image url of a team logo given a valid team name input
   *
   * @example
   * TODO-JVW
   *
   * @returns a url string that points to the inputted team's logo
   */

  static formatTeamLogo(inputTeamName: string):string {
    if(inputTeamName != null) {
      let teamName = inputTeamName.replace(" ", "_");
      teamName = teamName.replace(".", "");
      let teamLogo = GlobalSettings.getImageUrl("/mlb/logos/team/MLB_" + teamName + "_Logo.jpg");
      return teamLogo;
    }else{
      return "";
    }
  }

  // static MLBPosition(position: string): string{
  //     if( typeof position == 'undefined' || position === null){
  //       return position;
  //     }
  //     var posFullName = {
  //       1: 'Pitcher',
  //       2: 'Catcher',
  //       3: '1st Baseman',
  //       4: '2nd Baseman',
  //       5: '3rd Baseman',
  //       6: 'Shortstop',
  //       7: 'Left Field',
  //       8: 'Center Field',
  //       9: 'Right Field',
  //       D: 'Designated Hitter'
  //     };
  //     let upperPosition = position.toUpperCase();
  //     let displayPosition = posFullName[upperPosition];
  //     return displayPosition !== undefined ? displayPosition: position;
  //   }

  // static MLBPositionToAB(position: string): string{
  //     if( typeof position == 'undefined' || position === null ){
  //       return 'DH';
  //     }
  //     var posAbbrName = {
  //       1: 'P',
  //       2: 'C',
  //       3: '1B',
  //       4: '2B',
  //       5: '3B',
  //       6: 'S',
  //       7: 'LF',
  //       8: 'CF',
  //       9: 'RF',
  //       D: 'DH',
  //     };
  //     let upperPosition = position.toUpperCase();
  //     let displayAbbrPosition = posAbbrName[upperPosition];
  //     return displayAbbrPosition !== undefined ? displayAbbrPosition: position;
  //   }


  /**
   * TODO-JVW
   * @param urlArr
   * @returns {any}
   */
  //path: '/list/:profile/:listname/:sort/:conference/:division/:limit/:pageNum',
  static formatListRoute(urlArr: Array<any>): Array<any> {
    for(var arg in urlArr) {
      if (arg == null) return ['Error-page'];
    }
    let kebabArr = urlArr.map( item => GlobalFunctions.toLowerKebab(item) );

    let listRoute = ['List-page', {
      profile     : kebabArr[0],
      listname    : kebabArr[1],
      sort        : kebabArr[2],
      conference  : kebabArr[3],
      division    : kebabArr[4],
      limit       : kebabArr[5],
      pageNum     : kebabArr[6]
    }];
    return listRoute;
  }


  /**
  * Function will return string, reformatted from AI Content API Response as of July 21, 2016
  */
  static convertAiDate(date){
    date = date.split(' ');
    var month = date[0];
    var day = date[1];
    day = day.split(',')[0].replace(/([A-Za-z])\w+/g,'');
    var year = date[2];

    var _string = month + ' ' + day + ', ' + year;
    return _string;
  }

  /**
   * Returns the abbreviation for American or National leagues
   *
   * @param {string} confName - 'American' or 'National' (case insensitive)
   * @param {string} divName - (Optional) If included, is appended to end of string in title case
   *
   * @returns abbreviation or confName if it cannot be mapped to an abbreviation
   */
  static formatShortNameDivison(confName: string, divName?: string): string {
    if ( !confName ) return confName;

    let abbr = confName;
    switch ( confName.toLowerCase() ) {
      case 'american': abbr = "AL"; break;
      case 'national': abbr = "NL"; break;
      default: break;
    }

    return divName ? abbr + " " + GlobalFunctions.toTitleCase(divName) : abbr;
  }


  static formatStatName(stat: string) {
    //coming from backend as a stat in the list info
   switch (stat) {

    //CB, DE. DB, DL, DT, S, LB
    case 'player_defense_total_tackles':
      return "Total Tackles";
    case 'player_defense_sacks':
      return "Total Sacks";
    case 'player_defense_interceptions':
      return "Interceptions";
    case 'player_defense_forced_fumbles':
      return "Forced Fumbles";
    case 'player_defense_passes_defended':
      return "Passes Defended";

    // K
    case 'player_kicking_field_goals_made':
      return "Field Goals Made";
    case 'player_kicking_field_goal_percentage_made':
      return "Field Goal Percentage Made";
    case 'player_kicking_extra_points_made':
      return "Extra Points Made";
    case 'player_kicking_total_points_scored':
      return "Total Points";
    case 'player_kicking_total_points_per_game':
      return "Average Points Per Game";

    // P
    case 'player_punting_gross_yards':
      return "Gross Punting Yards";
    case 'player_punting_punts':
      return "Total Punts";
    case 'player_punting_average':
      return "Average Distance Punt";
    case 'player_punting_inside_twenty':
      return "Punt % Within 20";
    case 'player_punting_longest_punt':
      return "Longest Punt";

    // QB
    case 'passer_rating':
      return "Passer Rating";
    case 'passing_yards':
      return "Passing Yards";
    case 'passing_touchdowns':
      return "Touchdowns";
    case 'passing_interceptions':
      return "Interceptions";
    case 'passing_completions':
      return "Completions";

    // RB
    case 'player_rushing_yards':
      return "Rushing Yards";
    case 'player_rushing_attempts':
      return "Ruhing Attempts";
    case 'player_rushing_yards_per_carry':
      return "Yards Per Carry";
    case 'player_rushing_touchdowns':
      return "Touchdowns";
    case 'player_rushing_yards_per_carry':
      return "Yards Per Game";

    // RS
    case 'player_returning_yards':
      return "Rushing Yards";
    case 'player_rushing_attempts':
      return "Ruhing Attempts";
    case 'player_rushing_yards_per_carry':
      return "Yards Per Carry";
    case 'player_rushing_touchdowns':
      return "Touchdowns";
    case 'player_rushing_yards_per_carry':
      return "Yards Per Game";

    // WR, TE
    case 'player_receiving_yards':
      return "Receiving Yards";
    case 'player_receiving_receptions':
      return "Receptions";
    case 'player_receiving_average_per_reception':
      return "Average Yards Per Reception";
    case 'player_receiving_touchdowns':
      return "Touchdowns";
    case 'player_returning_touchdowns':
      return "Yards Per Game";

     default: return GlobalFunctions.toTitleCase(stat.replace(/_/g, ' '));
   }
  }

  static formatSynRoute(articleType: string, eventID: string): Array<any> {
    var synRoute: Array<any>;
    if(typeof eventID != 'undefined' && eventID != null){
      synRoute = ['Syndicated-article-page', {articleType: articleType, eventID: eventID}];
    } else{
      synRoute = null;
    }
    return synRoute ? synRoute : ['Error-page'];
  }

  static formatAiArticleRoute(eventType: string, eventID: string): Array<any> {
    var aiArticleRoute: Array<any>;
    if(typeof eventID != 'undefined' && eventID != null){
      aiArticleRoute = ['Article-pages', {eventType: eventType, eventID: eventID}];
    } else{
      aiArticleRoute = null;
    }
    return aiArticleRoute ? aiArticleRoute : ['Error-page'];
  }

  //Some positions don't provided stats that have a league ranking
  static nonRankedDataPoints(position: Array<string>, statDesc: string) {
      //set array of positions that don't provide 4 player stats that also have a league ranking
      var positionsArray:Array<string> = ['C' ,'G', 'LS', 'OL', 'OT'];

      //compare set array^ to array of position provided from data
      var result = positionsArray.some(function (v) {
        return position.indexOf(v) >= 0;
      });

      //if result matches return the desired description
      if (result == true) {
        return null;
      }
      else {
        return statDesc;
      }
  } //static nonRankedDataPoints
}
