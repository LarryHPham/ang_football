import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {TitleInputData} from "../components/title/title.component";
import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";
import {MLBGlobalFunctions} from "../global/mlb-global-functions";
import {AuBlockData, AboutUsModel} from "../webpages/about-us-page/about-us.page";

export interface AboutUsInterface {
    teamProfilesCount: number;
    divisionsCount: number;
    playerProfilesCount: number;
    worldChampFirstName: string;
    worldChampLastName: string;
    worldChampTeamId: string;
    worldChampYear: string;
    worldChampImageUrl: string;
    lastUpdated: string;
}

@Injectable()
export class AboutUsService {

  public siteName: any = GlobalSettings.getBaseTitle();

  public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
  public sportLeagueChampionship: string = GlobalSettings.getSportLeagueChampionship();
  public sportLeagueSegments: string = GlobalSettings.getSportLeagueSegments();

  public collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
  public collegeDivisionChampionship: string = GlobalSettings.getCollegeDivisionChampionship();
  public collegeDivisionSegments: string = GlobalSettings.getCollegeDivisionSegments();

  constructor(public http: Http){}

  // Will be removed once call is set up
  tempData(division: string) {
    let nflData = {
      "success": true,
        "message": "",
        "data": {
            "scope": "nfl",
            "numTeams": 32,
            "numPlayers": 1696,
            "numDivisions": 2,
            "championshipYear": 2015,
            "championshipTeam": "Denver Broncos"
        }
    }
    let ncaaData = {
      "success": true,
        "message": "",
        "data": {
            "scope": "ncaa",
            "numTeams": 128,
            "numPlayers": 16000,
            "numDivisions": 11,
            "championshipYear": 2015,
            "championshipTeam": "Alabama Crimson Tide"
        }
    }

    if ( division == this.collegeDivisionAbbrv || division == this.collegeDivisionAbbrv.toLowerCase() ) {
      return ncaaData;
    }
    else {
      return nflData;
    }
  }

  getData(partnerID: string, division: string): Observable<AboutUsModel> {
    let url = GlobalSettings.getApiUrl() + '/landingPage/aboutUs';

    return this.http.get(url)
        .map(
          res => res.json()
        )
        .map(
          data => this.formatData(data.data, partnerID, division)
        )
  }

  private formatData(data: AboutUsInterface, partnerID: string, division?: string): AboutUsModel {

    //will be removed once call is set up
    let tempData = this.tempData(division).data;

    let pageName = (partnerID == null)
            ? GlobalSettings.getBaseTitle()
            : GlobalSettings.getBasePartnerTitle();
    let teamProfiles = GlobalFunctions.commaSeparateNumber(tempData.numTeams);
    let playerProfiles = GlobalFunctions.commaSeparateNumber(tempData.numPlayers);
    let fullName = tempData.championshipTeam;
    let championshipYear = tempData.championshipYear;
    let championLink = MLBGlobalFunctions.formatTeamRoute(fullName, data.worldChampTeamId);

    let activeDivision;
    let activeDivisionSegments;
    let activeDivisionChampionship;

    // Set auBlocks vars based on division routeParam
    if (division == this.collegeDivisionAbbrv || division == this.collegeDivisionAbbrv.toLowerCase()) {
      activeDivision = this.collegeDivisionAbbrv+" FBS";
      activeDivisionSegments = this.sportLeagueSegments;
      activeDivisionChampionship = "National";
    }
    else {
      activeDivision = this.sportLeagueAbbrv;
      activeDivisionSegments = this.collegeDivisionSegments;
      activeDivisionChampionship = this.sportLeagueChampionship;
    }

    let model: AboutUsModel = {
      headerTitle: "What is " + pageName + "?",
      titleData: {
          imageURL : GlobalSettings.getSiteLogoUrl(),
          text1: 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(data.lastUpdated),
          text2: 'United States',
          text3: "Want to learn more about " + pageName + "?",
          text4: '',
          icon: 'fa fa-map-marker'
      },
      blocks: [
        {
          iconClass: 'fa fa-tdl-profiles',
          titleText: activeDivision+' Team Profiles',
          dataText: teamProfiles
        },
        {
          iconClass: 'fa fa-tdl-helmet',
          titleText: activeDivision+' Player Profiles',
          dataText: playerProfiles
        },
        {
          iconClass: 'fa fa-tdl-football',
          titleText: activeDivision+" "+activeDivisionSegments,
          dataText: GlobalFunctions.commaSeparateNumber(tempData.numDivisions)
        },
        {
          link: {
            route: championLink,
            imageConfig: {
              imageClass: "image-50",
              mainImage: {
                imageUrl: GlobalSettings.getImageUrl(data.worldChampImageUrl),
                imageClass: "border-1",
                urlRouteArray: championLink,
                hoverText: "<i class=\"fa fa-mail-forward\"></i>"
              }
            },
          },
          titleText: championshipYear + ' ' + activeDivisionChampionship + ' Champions',
          dataText: fullName
        }
      ],
      //TODO-CJP: Update [July, 2016] to reflect actual creation date!
      content: [
        "We created " + pageName + " -based in Wichita, Kan. in July, 2016 to connect baseball fans with insightful, well-informed and up-to-date content.",

        "Here at " + pageName + ", we have an appetite for digesting down big data in the world of baseball." +
        " We create unique content so you can learn everything about your favorite team or player." +
        " From rookie players and underachieving teams to veteran stars and perennial favorites, " +
        pageName + " produces content and statistical information for " + teamProfiles + " MLB teams and over " + playerProfiles + " player profiles."
      ]
    };

    return model;
  }
}
