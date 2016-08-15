import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {GlobalSettings} from '../global/global-settings';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {DataItem, ProfileHeaderData} from '../fe-core/modules/profile-header/profile-header.module';
import {TitleInputData} from '../fe-core/components/title/title.component';
import {Division, Conference, MLBPageParameters} from '../global/global-interface';

declare var moment: any;

export interface IProfileData {
  profileName: string;
  profileId: string;
  profileType: string; // for MLB, this is 'team', 'player', or 'league'
}

interface PlayerProfileData extends IProfileData {
  pageParams: MLBPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: PlayerProfileHeaderData
}

interface PlayerProfileHeaderData {
  // Basic Info
    description: string;
    id: string;
    playerId: number;
    playerFirstName: string;
    playerLastName: string;
    playerFullName: string;
    teamId: number;
    teamMarket: string;
    teamName: string;
    teamFullName: string;
    draftTeam?: string;
    jerseyNumber: number;
    position: Array<string>;
    gamesPlayed: number;
    gamesStarted: number;
    experience: number;
    entryDate?: string; //null
    draftYear?: string; //null
    playerBirthCity: string;
    playerBirthState: string; //todo - missing
    age: number;
    dob: string;
    height: string;
    weight: number;
    class?: string;
    backgroundUrl: string; //todo - missing
    seasonId: string;
    lastUpdated: string;
    playerHeadShot?: string; //todo - missing

  //Stats
    stat1: string;
    stat1Type: string;
    stat1Desc: string;
    stat2: string;
    stat2Type: string;
    stat2Desc: string;
    stat3: string;
    stat3Type: string;
    stat3Desc: string;
    stat4: string;
    stat4Type: string;
    stat4Desc: string;
}

interface TeamProfileData extends IProfileData {
  pageParams: MLBPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: TeamProfileHeaderData;
  /**
   * @deprecated use profileName instead
   */
  teamName: string; //same as profileName
}

interface TeamProfileHeaderData {
    description: string;
    profileImage: string;
    backgroundImage: string;
    lastUpdated: string;
    teamFirstName: string;
    teamLastName: string;
    teamVenue: string;
    teamCity: string;
    teamState: string;
    stats: {
      teamId: number;
      teamName: string;
      seasonId: string;
      totalWins: number;
      totalLosses: number;
      batting: {
        average: number;
        runsScored: number;
        homeRuns: number;
      };
      pitching: {
        era: number;
      };
      conference: {
        rank: string;
        name: string;
      };
      division: {
        rank: string;
        wins: string;
        losses: string;
        winningPercentage: string;
        eventsPlayed: number;
        gamesBack: number;
        name: string;
      };
      streak: {
        type: string; //win or loss
        count: number;
      };
    };
}

interface LeagueProfileData extends IProfileData {
  headerData: LeagueProfileHeaderData;
}

interface LeagueProfileHeaderData {
  id: string;
  leagueFullName: string;
  leagueAbbreviatedName?: string;
  leagueCity: string;
  leagueState: string;
  leagueFounded: string;
  totalTeams: number;
  totalPlayers: number;
  totalDivisions: number;
  totalConferences: number;
  backgroundUrl: string;
  leagueLogo: string;
  aiDescriptionId: string;
  seasonId: string;
  lastUpdated: string;
}

@Injectable()
export class ProfileHeaderService {
  constructor(public http: Http){}

  getPlayerProfile(playerId: number): Observable<PlayerProfileData> {
    let url = GlobalSettings.getApiUrl() + '/player/profileHeader/' + playerId;
    let newUrl = "http://dev-touchdownloyal-api.synapsys.us/profileHeader/player/130"; //todo

    return this.http.get(newUrl)
        .map(res => res.json())
        .map(data => {
          var headerData: PlayerProfileHeaderData = data.data[0];

          if (!headerData) {
            return null;
          }

          return {
            pageParams: {
              teamId: headerData.teamId,
              teamName: headerData.teamFullName,
              playerId: headerData.playerId,
              playerName: headerData.playerFullName
            },
            fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(headerData.backgroundUrl),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.playerHeadShot),
            headerData: headerData,
            profileName: headerData.playerFullName,
            profileId: headerData.playerId.toString(),
            profileType: "player"
          };

        });
  }

  getTeamProfile(teamId: number): Observable<TeamProfileData> {
    let url = GlobalSettings.getApiUrl() + '/team/profileHeader/' + teamId;
    // console.log("team profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var headerData: TeamProfileHeaderData = data.data;

          //Setting up conference and division values
          var confKey = "", divKey = "";
          if ( headerData.stats ) {
            if ( headerData.stats.conference && headerData.stats.conference.name ) {
              confKey = headerData.stats.conference.name.toLowerCase();
            }
            if ( headerData.stats.division && headerData.stats.division.name ) {
              divKey = headerData.stats.division.name.toLowerCase();
            }
          }

          //Forcing values to be numbers
          if ( headerData.stats.batting ) {
            headerData.stats.batting.average = Number(headerData.stats.batting.average);
            headerData.stats.batting.runsScored = Number(headerData.stats.batting.runsScored);
            headerData.stats.batting.homeRuns = Number(headerData.stats.batting.homeRuns);
          }
          if ( headerData.stats.pitching ) {
            headerData.stats.pitching.era = Number(headerData.stats.pitching.era);
          }
          var teamName = headerData.teamFirstName + " " + headerData.teamLastName;
          return {
            pageParams: {
              teamId: headerData.stats.teamId,
              teamName: headerData.stats.teamName,
              division: Division[divKey],
              conference: Conference[confKey],
            },
            fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(headerData.backgroundImage),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.profileImage),
            headerData: headerData,
            teamName: teamName,
            profileName: headerData.stats.teamName,
            profileId: headerData.stats.teamId.toString(),
            profileType: "team"
          };
        });
  }

  getMLBProfile(leagueParam?): Observable<LeagueProfileData> {
    let url = GlobalSettings.getApiUrl() + '/league/profileHeader';
    let newUrl = "http://dev-touchdownloyal-api.synapsys.us/profileHeader/league/"+leagueParam;

    //remove when correct API is set up
    let leagueAbbreviatedName;
    if ( leagueParam == 1 ) {
        leagueAbbreviatedName = 'NFL';
    }
    else if ( leagueParam == 2 ) {
      leagueAbbreviatedName == 'NCAAF'
    }

    return this.http.get(newUrl)
        .map(res => res.json())
        .map(data => {
          var headerData: LeagueProfileHeaderData = data.data[0];

          //Forcing values to be numbers
          headerData.totalDivisions = Number(headerData.totalDivisions);
          headerData.totalConferences = Number(headerData.totalConferences);
          headerData.totalPlayers = Number(headerData.totalPlayers);
          headerData.totalTeams = Number(headerData.totalTeams);

          return {
            headerData: headerData,
            profileName: headerData.leagueFullName, //todo - should be short name
            profileId: null,
            profileType: "league"
          };
        });
  }

  convertTeamPageHeader(data: TeamProfileData, pageName:string): TitleInputData {
    var description = data.headerData.description;
    var stats = data.headerData.stats;

    if (!stats) {
      return null;
    }
    if(typeof pageName == 'undefined'){
      pageName = '';
    }
    var teamId = data.pageParams.teamId ? data.pageParams.teamId.toString() : null;
    return {
      imageURL: data.fullProfileImageUrl, //TODO
      imageRoute: MLBGlobalFunctions.formatTeamRoute(data.teamName, teamId),
      text1: 'Last Updated:' + GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
      text2: 'United States',
      text3: pageName,
      icon: 'fa fa-map-marker'
    };
  }

  convertMLBHeader(data: LeagueProfileHeaderData, pageName:string): TitleInputData {
    return {
      imageURL: GlobalSettings.getImageUrl(data.leagueLogo), //TODO
      imageRoute: ["MLB-page"],
      text1: 'Last Updated:' + GlobalFunctions.formatUpdatedDate(data.lastUpdated),
      text2: 'United States',
      text3: pageName,
      icon: 'fa fa-map-marker'
    };
  }

  convertToPlayerProfileHeader(data: PlayerProfileData): ProfileHeaderData {

    if (!data.headerData) {
      return null;
    }
    var headerData = data.headerData;

    var formattedStartDate = headerData.entryDate ? headerData.entryDate.toString() : "N/A"; //[September 18, 2015]
    var formattedYearsInLeague = headerData.experience ? headerData.experience.toString() : "N/A";
    var firstSentence = "";
    var yearPluralStr = "years";

    //for ncaa
    if ( headerData.draftYear && headerData.draftTeam ) {
      var currentYear = (new Date()).getFullYear();
      var yearsInLeague = (currentYear - Number(headerData.draftYear));
      formattedYearsInLeague = GlobalFunctions.formatNumber(yearsInLeague);
      if ( yearsInLeague == 1 ) {
        yearPluralStr = "year";
      }
      firstSentence = "<span class='text-heavy'>" + headerData.playerFullName +
                  "</span> started his NFL career in <span class='text-heavy'>" + formattedStartDate +
                  "</span> for the <span class='text-heavy'>" + headerData.draftTeam +
                  "</span>, accumulating <span class='text-heavy'>" + formattedYearsInLeague +
                  "</span> " + yearPluralStr + " in the MLB. "
    }

    //for pro
    else { // no draft year or team
      firstSentence = "<span class='text-heavy'>" + headerData.playerFullName +
                  "</span> currently plays for the <span class='text-heavy'>" + headerData.teamFullName +
                  "</span>. ";
    }

    var location = "N/A"; //[Wichita], [Kan.]
    if ( headerData.playerBirthCity && headerData.playerBirthState ) {
      location = headerData.playerBirthCity + ", " + headerData.playerBirthState;
    }

    var formattedBirthDate = "N/A"; //[October] [3], [1991]
    if ( headerData.dob ) {
      var date = moment(headerData.dob);
      formattedBirthDate = GlobalFunctions.formatAPMonth(date.month()) + date.format(" D, YYYY");
    }

    var formattedAge = headerData.age ? headerData.age.toString() : "N/A";
    var formattedHeight = MLBGlobalFunctions.formatHeightWithFoot(headerData.height); //[6-foot-11]
    var formattedWeight = headerData.weight ? headerData.weight.toString() : "N/A";

    var description = firstSentence + "<span class='text-heavy'>" + headerData.playerFirstName +
                  "</span> was born in <span class='text-heavy'>" + location +
                  "</span> on <span class='text-heavy'>" + formattedBirthDate +
                  "</span> and is <span class='text-heavy'>" + formattedAge +
                  "</span> years old. He stands at <span class='text-heavy'>" + formattedHeight +
                  "</span>, <span class='text-heavy'>" + formattedWeight +
                  "</span> pounds.";


    var header: ProfileHeaderData = {
      profileName: headerData.playerFullName,
      profileImageUrl: headerData.playerHeadShot,
      backgroundImageUrl: headerData.backgroundUrl,
      profileTitleFirstPart: headerData.playerFirstName,
      profileTitleLastPart: headerData.playerLastName,
      lastUpdatedDate: headerData.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Team",
          value: headerData.teamFullName,
          routerLink: MLBGlobalFunctions.formatTeamRoute(headerData.teamFullName, headerData.teamId.toString())
        },
        {
          label: "Jersey Number",
          value: headerData.jerseyNumber ? '#'+headerData.jerseyNumber.toString() : null
        },
        {
          label: "Position",
          value: headerData.position ? headerData.position.toString() : null //todo
        }
      ],
      bottomDataPoints: [
        {
          label: headerData.stat1Type,
          labelCont: headerData.stat1Desc,
          value: headerData.stat1
        },
        {
          label: headerData.stat2Type,
          labelCont: headerData.stat2Desc,
          value: headerData.stat2
        },
        {
          label: headerData.stat3Type,
          labelCont: headerData.stat3Desc,
          value: headerData.stat3
        },
        {
          label: headerData.stat4Type,
          labelCont: headerData.stat4Desc,
          value: headerData.stat4
        }
      ]
    }

    return header;
  }

  convertToTeamProfileHeader(data: TeamProfileData): ProfileHeaderData {
    var headerData = data.headerData;
    var stats = data.headerData.stats;

    if (!stats) {
      return null;
    }

    //The [Atlanta Braves] play in [Turner Field] located in [Atlanta, GA]. The [Atlanta Braves] are part of the [NL East].
    var location = "N/A";
    if ( headerData.teamCity && headerData.teamState ) {
      location = headerData.teamCity + ", " + headerData.teamState;
    }

    var group = "N/A";
    if ( stats.division && stats.conference ) {
      group = MLBGlobalFunctions.formatShortNameDivison(stats.conference.name, stats.division.name);
    }

    var venue = headerData.teamVenue ? headerData.teamVenue : "N/A";
    var description = "The <span class='text-heavy'>" + stats.teamName +
                      "</span> play in <span class='text-heavy'>" + venue +
                      "</span> located in <span class='text-heavy'>" + location +
                      "</span>. The <span class='text-heavy'>" + stats.teamName +
                      "</span> are part of the <span class='text-heavy'>" + group +
                       "</span>.";

    var formattedEra = null;
    if ( stats.pitching ) {
      if ( stats.pitching.era > 1 ) {
        formattedEra = stats.pitching.era.toPrecision(3);
      }
      else {
        formattedEra = stats.pitching.era.toPrecision(2);
      }
    }

    var header: ProfileHeaderData = {
      profileName: stats.teamName,
      profileImageUrl: data.fullProfileImageUrl,
      backgroundImageUrl: data.fullBackgroundImageUrl,
      profileTitleFirstPart: data.headerData.teamFirstName,
      profileTitleLastPart: data.headerData.teamLastName,
      lastUpdatedDate: data.headerData.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Division",
          value: stats.division ? stats.division.name : null
        },
        {
          label: "Rank",
          value: stats.division ? stats.division.rank : null
        },
        {
          label: "Record",
          value: stats.totalWins + " - " + stats.totalLosses
        }
      ],
      bottomDataPoints: [
        {
          label: "Batting Average",
          labelCont: "for the current season",
          value: stats.batting ? stats.batting.average.toPrecision(3) : null
        },
        {
          label: "Runs",
          labelCont: "for the current season",
          value: stats.batting ? stats.batting.runsScored.toString() : null
        },
        {
          label: "Home Runs",
          labelCont: "for the current season",
          value: stats.batting ? stats.batting.homeRuns.toString() : null
        },
        {
          label: "Earned Run Average",
          labelCont: "for the current season",
          value: formattedEra
        }
      ]
    }
    return header;
  }

  convertToLeagueProfileHeader(data: LeagueProfileHeaderData): ProfileHeaderData {

    //remove when correct API is set up
    let leagueAbbreviatedName;
    if ( data.leagueFullName == 'National Football League' ) {
        leagueAbbreviatedName = 'NFL';
    }
    else if ( data.leagueFullName == 'NCAA Football Bowl Subdivision' ) {
      leagueAbbreviatedName = 'NCAAF';
    }

    //The MLB consists of [30] teams and [####] players. These teams and players are divided across [two] leagues and [six] divisions.
    var city = data.leagueCity != null ? data.leagueCity : "N/A";
    var state = data.leagueState != null ? data.leagueState : "N/A";

    data.backgroundUrl = GlobalSettings.getBackgroundImageUrl(data.backgroundUrl);

    var description = "The "+/*-data.leagueFullName-*/leagueAbbreviatedName+" consists of " + GlobalFunctions.formatNumber(data.totalTeams) +
                      " teams and " + GlobalFunctions.formatNumber(data.totalPlayers) + " players. " +
                      "These teams and players are divided across " + GlobalFunctions.formatNumber(data.totalConferences) +
                      " conferences and " + GlobalFunctions.formatNumber(data.totalDivisions) + " divisions.";

    var location = "N/A";
    if ( data.leagueCity && data.leagueState ) {
      location = city + ", " + state;
    }

    var header: ProfileHeaderData = {
      //profileName: data.leagueAbbreviatedName, //todo when correct API is set
      profileName: leagueAbbreviatedName,
      profileImageUrl: GlobalSettings.getImageUrl(data.leagueLogo),
      backgroundImageUrl: data.backgroundUrl,
      profileTitleFirstPart: "",
      //profileTitleLastPart: data.leagueAbbreviatedName, //todo when correct API is set
      profileTitleLastPart: leagueAbbreviatedName,
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "League Headquarters",
          value: data.leagueCity
        },
        {
          label: "Founded In",
          value: data.leagueFounded
        }
      ],
      bottomDataPoints: [
        {
          label: "Total Teams:",
          value: data.totalTeams != null ? data.totalTeams.toString() : null
        },
        {
          label: "Total Players:",
          value: data.totalPlayers != null ? data.totalPlayers.toString() : null
        },
        {
          label: "Total Divisions:",
          value: data.totalDivisions != null ? data.totalDivisions.toString() : null
        },
        {
          label: "Total Conferences:",
          value: data.totalConferences != null ? data.totalConferences.toString() : null
        }
      ]
    }
    return header;
  }
}
