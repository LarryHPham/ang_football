System.register(['@angular/core', './global-functions', "./global-settings"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, global_functions_1, global_settings_1;
    var MLBGlobalFunctions;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            MLBGlobalFunctions = (function () {
                function MLBGlobalFunctions() {
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
                MLBGlobalFunctions.formatTeamRoute = function (teamName, teamId) {
                    var teamRoute;
                    if (typeof teamName != 'undefined' && teamName != null) {
                        teamName = global_functions_1.GlobalFunctions.toLowerKebab(teamName);
                        teamRoute = ['Team-page', { teamName: teamName, teamId: teamId }]; //NOTE: if Team-page is on the same level as the rest of the route-outlets
                    }
                    else {
                        teamRoute = null;
                    }
                    return teamRoute ? teamRoute : ['Error-page'];
                };
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
                MLBGlobalFunctions.formatPlayerRoute = function (teamName, playerFullName, playerId) {
                    var playerRoute;
                    if (typeof teamName != 'undefined' && teamName != null && typeof playerFullName != 'undefined' && playerFullName != null) {
                        teamName = global_functions_1.GlobalFunctions.toLowerKebab(teamName);
                        playerFullName = global_functions_1.GlobalFunctions.toLowerKebab(playerFullName);
                        playerRoute = ['Player-page', { teamName: teamName, fullName: playerFullName, playerId: playerId }]; //NOTE: if Player-page is on the same level as the rest of the route-outlets
                    }
                    else {
                        playerRoute = null;
                    }
                    return playerRoute ? playerRoute : ['Error-page'];
                };
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
                MLBGlobalFunctions.formatArticleRoute = function (eventType, eventID) {
                    var articleRoute;
                    if (typeof eventType != 'undefined' && eventType != null) {
                        articleRoute = ['Article-pages', { eventType: eventType, eventID: eventID }];
                    }
                    else {
                        articleRoute = null;
                    }
                    return articleRoute ? articleRoute : ['Error-page'];
                };
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
                MLBGlobalFunctions.formatHeight = function (heightStr) {
                    return heightStr ? heightStr.replace(/(\d+)-(\d+)/, "$1'$2\"") : "N/A";
                };
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
                MLBGlobalFunctions.formatHeightWithFoot = function (heightStr) {
                    if (heightStr) {
                        return heightStr.split("-").join("-foot-");
                    }
                    else {
                        return "N/A";
                    }
                };
                /**
                 * - Outputs a valid image url of a team logo given a valid team name input
                 *
                 * @example
                 * TODO-JVW
                 *
                 * @returns a url string that points to the inputted team's logo
                 */
                MLBGlobalFunctions.formatTeamLogo = function (inputTeamName) {
                    if (inputTeamName != null) {
                        var teamName = inputTeamName.replace(" ", "_");
                        teamName = teamName.replace(".", "");
                        var teamLogo = global_settings_1.GlobalSettings.getImageUrl("/mlb/logos/team/MLB_" + teamName + "_Logo.jpg");
                        return teamLogo;
                    }
                    else {
                        return "";
                    }
                };
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
                MLBGlobalFunctions.formatListRoute = function (urlArr) {
                    for (var arg in urlArr) {
                        if (arg == null)
                            return ['Error-page'];
                    }
                    var kebabArr = urlArr.map(function (item) { return global_functions_1.GlobalFunctions.toLowerKebab(item); });
                    var listRoute = ['List-page', {
                            profile: kebabArr[0],
                            listname: kebabArr[1],
                            sort: kebabArr[2],
                            conference: kebabArr[3],
                            division: kebabArr[4],
                            limit: kebabArr[5],
                            pageNum: kebabArr[6]
                        }];
                    return listRoute;
                };
                /**
                * Function will return string, reformatted from AI Content API Response as of July 21, 2016
                */
                MLBGlobalFunctions.convertAiDate = function (date) {
                    date = date.split(' ');
                    var month = date[0];
                    var day = date[1];
                    day = day.split(',')[0].replace(/([A-Za-z])\w+/g, '');
                    var year = date[2];
                    var _string = month + ' ' + day + ', ' + year;
                    return _string;
                };
                /**
                 * Returns the abbreviation for American or National leagues
                 *
                 * @param {string} confName - 'American' or 'National' (case insensitive)
                 * @param {string} divName - (Optional) If included, is appended to end of string in title case
                 *
                 * @returns abbreviation or confName if it cannot be mapped to an abbreviation
                 */
                MLBGlobalFunctions.formatShortNameDivison = function (confName, divName) {
                    if (!confName)
                        return confName;
                    var abbr = confName;
                    switch (confName.toLowerCase()) {
                        case 'american':
                            abbr = "AL";
                            break;
                        case 'national':
                            abbr = "NL";
                            break;
                        default: break;
                    }
                    return divName ? abbr + " " + global_functions_1.GlobalFunctions.toTitleCase(divName) : abbr;
                };
                MLBGlobalFunctions.formatStatName = function (stat) {
                    //coming from backend as a stat in the list info
                    switch (stat) {
                        //pitcher
                        case 'pitcher-wins-losses':
                            return "W/L";
                        case 'pitcher-innings-pitched':
                            return "Innings pitched";
                        case 'pitcher-strikeouts':
                            return "Strikeouts";
                        case 'pitcher-earned-run-average':
                            return "ERA";
                        case 'pitcher-hits-allowed':
                            return "Hits Allowed";
                        case 'pitcher-bases-on-balls':
                            return "Walks";
                        case 'pitcher-runs-allowed':
                            return "Runs allowed";
                        case 'pitcher-earned-runs':
                            return "Runs earned";
                        //batter
                        case 'batter-home-runs':
                            return "Home runs";
                        case 'batter-batting-average':
                            return "Batting average";
                        case 'batter-runs-batted-in':
                            return "RBIs";
                        case 'batter-hits':
                            return "Hits";
                        case 'batter-bases-on-balls':
                            return "Walks";
                        case 'batter-stolen-bases':
                            return "Stolen bases";
                        case 'batter-triples':
                            return "Triples ";
                        case 'batter-strikeouts':
                            return "Strikeouts";
                        case 'batter-singles':
                            return "Singles";
                        case 'batter-runs':
                            return "Runs";
                        case 'batter-on-base-percentage':
                            return "OBP";
                        case 'batter-doubles':
                            return "Doubles";
                        default: return global_functions_1.GlobalFunctions.toTitleCase(stat.replace(/-/g, ' '));
                    }
                };
                MLBGlobalFunctions = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], MLBGlobalFunctions);
                return MLBGlobalFunctions;
            }());
            exports_1("MLBGlobalFunctions", MLBGlobalFunctions);
        }
    }
});
