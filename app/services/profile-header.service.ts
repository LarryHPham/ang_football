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
    id: number;
    teamId: number;
    teamMarket: string;
    teamName: string;
    teamCity: string;
    teamState: string;
    divisionName: Division;
    conferenceName: Conference;
    venueName: string;
    rank: number;
    divWins: number;
    divLosses: number;
    totalWins: number;
    totalLosses: number;
    pointsPerGame: number;
    pointsPerGameRank: number;
    passingYardsPerGame: number;
    passingYardsPerGameRank: number;
    rushingYardsPerGame: number;
    rushingYardsPerGameRank: number;
    backgroundUrl: string;
    teamLogo: string;
    lastUpdated: string;
    profileImage: string; //todo - missing
    seasonId: string; //todo - missing
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
    let newUrl = "http://dev-touchdownloyal-api.synapsys.us/profileHeader/team/2";
    // console.log("team profile url: " + url);

    return this.http.get(newUrl)
        .map(res => res.json())
        .map(data => {
          var headerData: TeamProfileHeaderData = data.data[0];
          var teamName = headerData.teamName;

          return {
            pageParams: {
              teamId: headerData.teamId,
              teamName: headerData.teamName,
              division: headerData.divisionName,
              conference: headerData.conferenceName,
            },
            fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(headerData.backgroundUrl),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.profileImage),
            headerData: headerData,
            teamName: headerData.teamName,
            profileName: headerData.teamName,
            profileId: headerData.teamId.toString(),
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
    if(typeof pageName == 'undefined'){
      pageName = '';
    }

    var teamId = data.pageParams.teamId ? data.pageParams.teamId : null;
    return {
      imageURL: data.fullProfileImageUrl, //TODO
      imageRoute: MLBGlobalFunctions.formatTeamRoute(data.teamName, teamId.toString() ),
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
      firstSentence = headerData.playerFullName +
                  " started his NFL career in " + formattedStartDate +
                  " for the " + headerData.draftTeam +
                  ", accumulating " + formattedYearsInLeague +
                  " " + yearPluralStr + " in the MLB. "
    }

    //for pro
    else { // no draft year or team
      firstSentence = headerData.playerFullName + " currently plays for the " + headerData.teamFullName + ". ";
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

    var description = firstSentence + headerData.playerFirstName +
                  " was born in " + location +
                  " on " + formattedBirthDate +
                  " and is " + formattedAge +
                  " years old. He stands at " + formattedHeight +
                  ", " + formattedWeight +
                  " pounds.";


    var header: ProfileHeaderData = {
      profileName: headerData.playerFullName,
      profileImageUrl: headerData.playerHeadShot,
      backgroundImageUrl: headerData.backgroundUrl,
      profileTitleFirstPart: '',
      profileTitleLastPart: headerData.playerFullName, // not seperated by first and last so entire name is bold
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
          labelCont: 'for the current season',
          value: headerData.stat1
        },
        {
          label: headerData.stat2Type,
          labelCont: 'for the current season',
          value: headerData.stat2
        },
        {
          label: headerData.stat3Type,
          labelCont: 'for the current season',
          value: headerData.stat3
        },
        {
          label: headerData.stat4Type,
          labelCont: 'for the current season',
          value: headerData.stat4
        }
      ]
    }

    return header;
  }

  convertToTeamProfileHeader(data: TeamProfileData): ProfileHeaderData {
    var headerData = data.headerData;
    var fullTeamName = headerData.teamMarket+', '+headerData.teamName;
    var fullLocation = headerData.teamMarket+', '+headerData.teamState;

    //The [Atlanta Braves] play in [Turner Field] located in [Atlanta, GA]. The [Atlanta Braves] are part of the [NL East].
    var location = "N/A";
    if ( headerData.teamCity && headerData.teamState ) {
      location = headerData.teamCity + ", " + headerData.teamState;
    }

    var venue = headerData.venueName ? headerData.venueName : "N/A";
    var description = "The " + fullTeamName +
                      " play in " + headerData.venueName +
                      " located in " + fullLocation +
                      ". The " + fullTeamName +
                      " are part of the " + headerData.divisionName +
                       ".";

    var header: ProfileHeaderData = {
      profileName: headerData.teamName,
      profileImageUrl: headerData.backgroundUrl,
      backgroundImageUrl: headerData.backgroundUrl,
      profileTitleFirstPart: headerData.teamMarket,
      profileTitleLastPart: headerData.teamName,
      lastUpdatedDate: headerData.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Division",
          value: headerData.divisionName ? headerData.divisionName.toString() : null
        },
        {
          label: "Rank",
          value: headerData.rank ? headerData.rank.toString() : null
        },
        {
          label: "Record",
          value: headerData.totalWins.toString() + " - " + headerData.totalLosses.toString()
        }
      ],
      bottomDataPoints: [
        {
          label: "Wins/losses",
          labelCont: "for the current season",
          value: headerData.totalWins.toString() + " - " + headerData.totalLosses.toString()
        },
        {
          label: "Average Points Per Game",
          labelCont: "Ranked "+headerData.pointsPerGameRank+GlobalFunctions.Suffix(headerData.pointsPerGameRank),
          value: headerData.pointsPerGame ? headerData.pointsPerGame.toString() : null
        },
        {
          label: "Passing Yards Per Game",
          labelCont: "Ranked "+headerData.passingYardsPerGameRank+GlobalFunctions.Suffix(headerData.passingYardsPerGameRank),
          value: headerData.passingYardsPerGame.toString()
        },
        {
          label: "Rushing Yards per Game",
          labelCont: "Ranked "+headerData.rushingYardsPerGameRank+GlobalFunctions.Suffix(headerData.rushingYardsPerGameRank),
          value: headerData.rushingYardsPerGame.toString()
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
      profileTitleLastPart: data.leagueFullName,
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
