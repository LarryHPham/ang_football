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
  constructor(public http: Http){}

  public siteName: any = GlobalSettings.getBaseTitle();
  public sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
  public sportLeagueChampionship: string = GlobalSettings.getSportLeagueChampionship();

  getData(partnerID: string): Observable<AboutUsModel> {
    let url = GlobalSettings.getApiUrl() + '/landingPage/aboutUs';
    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.formatData(data.data, partnerID));
  }

  private formatData(data: AboutUsInterface, partnerID: string): AboutUsModel {
    let pageName = (partnerID == null)
            ? GlobalSettings.getBaseTitle()
            : GlobalSettings.getBasePartnerTitle();
    let teamProfiles = GlobalFunctions.commaSeparateNumber(data.teamProfilesCount);
    let playerProfiles = GlobalFunctions.commaSeparateNumber(data.playerProfilesCount);
    let fullName = data.worldChampFirstName + " " + data.worldChampLastName;
    let championLink = MLBGlobalFunctions.formatTeamRoute(fullName, data.worldChampTeamId);
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
          titleText: this.sportLeagueAbbrv+' Team Profiles',
          dataText: teamProfiles
        },
        {
          iconClass: 'fa fa-tdl-helmet',
          titleText: this.sportLeagueAbbrv+' Player Profiles',
          dataText: playerProfiles
        },
        {
          iconClass: 'fa fa-tdl-football',
          titleText: this.sportLeagueAbbrv+' Divisions',
          dataText: GlobalFunctions.commaSeparateNumber(data.divisionsCount)
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
          titleText: data.worldChampYear + ' ' + this.sportLeagueChampionship + ' Champions',
          dataText: data.worldChampLastName,
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
