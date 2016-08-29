import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {DetailListInput} from '../fe-core/components/detailed-list-item/detailed-list-item.component';
import {MVPTabData} from '../fe-core/components/mvp-list/mvp-list.component';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData, ImageData} from '../fe-core/components/images/image-data';
import {Link} from '../global/global-interface';
import {TitleInputData} from '../fe-core/components/title/title.component';

declare var moment;

interface PlayerItem {
    teamName: string,
    teamId: string,
    conferenceName: string,
    divisionName: string,
    stat: number;
    statType: string,
    statDescription: string;
    listRank: number;
    rank: string,
    playerId: string,
    playerName: string,
    playerFirstName: string,
    playerLastName: string,
    playerHeadshotUrl: string,
    playerJerseyNumber: string,
    playerPosition: string[],
    teamState: string,
    teamCity: string,
    teamFirstName: string,
    teamLastName: string,
    teamVenue: string,
    teamLogo: string,
    lastUpdated: string,
    backgroundImage: string
}

interface ListData {
  listInfo: any;
  listData: Array<PlayerItem>;
  query: any;
}

export class positionMVPTabData implements MVPTabData {
  tabDataKey: string;
  tabDisplayTitle: string;
  errorData: any = {
      data: "Sorry, we do not currently have any data for this MVP list",
      icon: "fa fa-remove"
  };
  listData: DetailListInput[] = null;
  isLoaded: boolean = false;
  profileType: string
  data: any;

  constructor(title: string, key: string, profileType: string) {
    this.profileType = profileType; //'page' carousel is slightly different from 'module' version
    this.tabDataKey = key;
    this.tabDisplayTitle = title;
  }

  getCarouselData(): Array<SliderCarouselInput> {
    return ListPageService.carDataPage(this.data, this.profileType, this.errorData.data);
  }
}

@Injectable()
export class ListPageService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  constructor(public http: Http) {}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      return headers;
  }

  /*
    query:{
    profile: //profile type ex: 'team' or 'player'
    listname: //list name sent back as lower kebab case  ex: 'batter-runs'
    sort: //sorting the list by 'desc' or 'asc'
    conference: //sort list by conference, but if sort by entire league then 'all' would be in place
    division: //sort list by division, but if sort by all divisions then 'all' would be in place. conference is required if 'all' is in place
    limit: // limit the amount of data points come back but a number amount
    pageNum: //  determined by the limit as well detects what page to view based on the limit ex: limit: 10  page 1 holds 1-10 and page 2 holds 11-20
    }
  */
  getListPageService(query, errorMessage: string){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/list';

  for(var q in query){
    callURL += "/" + query[q];
  }
  return this.http.get( callURL, {headers: headers})
    .map(res => res.json())
    .map(
      data => {
        data.data['query'] = query;
        this.formatData(data.data.listInfo.stat, data.data.listData);
        return {
          profHeader: ListPageService.profileHeader(data.data),
          carData: ListPageService.carDataPage(data.data, 'page', errorMessage),
          listData: ListPageService.detailedData(data.data),
          pagination: data.data.listInfo,
          listDisplayName: data.data.listInfo.name
        }
      },
      err => {
        console.log('INVALID DATA');
      }
    )
  }

  //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
  getMVPTabs(moduleType: string, profileType: string): Array<positionMVPTabData>{
    var tabArray: Array<positionMVPTabData> = [];

    switch(moduleType) {
      case 'cb':
      case 'de':
      case 'db':
      case 'dl':
      case 'dt':
      case 's':
      case 'lb':
      tabArray.push(new positionMVPTabData('Total Tackles', 'player_defense_total_tackles', profileType));
      tabArray.push(new positionMVPTabData('Total Sacks', 'player_defense_sacks', profileType));
      tabArray.push(new positionMVPTabData('Interceptions', 'player_defense_interceptions', profileType));
      tabArray.push(new positionMVPTabData('Forced Fumbles', 'player_defense_forced_fumbles', profileType));
      tabArray.push(new positionMVPTabData('Passes Defended', 'player_defense_passes_defended', profileType));
      break;

      case 'k' :
      tabArray.push(new positionMVPTabData('Field Goals Made', 'player_kicking_field_goals_made', profileType));
      tabArray.push(new positionMVPTabData('Field Goal Percentage Made', 'player_kicking_field_goal_percentage_made', profileType));
      tabArray.push(new positionMVPTabData('Extra Points Made', 'player_kicking_extra_points_made', profileType));
      tabArray.push(new positionMVPTabData('Total Points', 'player_kicking_total_points_scored', profileType));
      tabArray.push(new positionMVPTabData('Average Points Per Game', 'player_kicking_total_points_per_game', profileType));
      break;

      case 'p' :
      tabArray.push(new positionMVPTabData('Gross Punting Yards', 'player_punting_gross_yards', profileType));
      tabArray.push(new positionMVPTabData('Total Punts', 'player_punting_punts', profileType));
      tabArray.push(new positionMVPTabData('Average Distance Punt', 'player_punting_average', profileType));
      tabArray.push(new positionMVPTabData('Punt % Within 20', 'player_punting_inside_twenty', profileType));
      tabArray.push(new positionMVPTabData('Longest Punt', 'player_punting_longest_punt', profileType));
      break;

      case 'qb' :
      tabArray.push(new positionMVPTabData('Passer Rating', 'passing_rating', profileType));
      tabArray.push(new positionMVPTabData('Passing Yards', 'passing_yards', profileType));
      tabArray.push(new positionMVPTabData('Touchdowns', 'passing_touchdowns', profileType));
      tabArray.push(new positionMVPTabData('Interceptions', 'passing_interceptions', profileType));
      tabArray.push(new positionMVPTabData('Completions', 'passing_completions', profileType));
      break;

      case 'rb' :
      tabArray.push(new positionMVPTabData('Rushing Yards', 'player_rushing_yards', profileType));
      tabArray.push(new positionMVPTabData('Ruhing Attempts', 'player_rushing_attempts', profileType));
      tabArray.push(new positionMVPTabData('Yards Per Carry', 'player_rushing_yards_per_carry', profileType));
      tabArray.push(new positionMVPTabData('Touchdowns', 'player_rushing_touchdowns', profileType));
      tabArray.push(new positionMVPTabData('Yards Per Game', 'player_rushing_yards_per_carry', profileType));
      break;

      case 'rs' :
      tabArray.push(new positionMVPTabData('Return Yards', 'player_returning_yards', profileType));
      tabArray.push(new positionMVPTabData('Return Attempts', 'player_returning_attempts', profileType));
      tabArray.push(new positionMVPTabData('Return Average', 'player_returning_average_yards', profileType));
      tabArray.push(new positionMVPTabData('Longest Run', 'player_returning_longest_return', profileType));
      tabArray.push(new positionMVPTabData('Touchdowns', 'player_returning_touchdowns', profileType));
      break;

      case 'wr' :
      case 'te' :
      tabArray.push(new positionMVPTabData('Receiving Yards', 'player_receiving_yards', profileType));
      tabArray.push(new positionMVPTabData('Receptions', 'player_receiving_receptions', profileType));
      tabArray.push(new positionMVPTabData('Average Yards Per Reception', 'player_receiving_average_per_reception', profileType));
      tabArray.push(new positionMVPTabData('Touchdowns', 'player_receiving_touchdowns', profileType));
      tabArray.push(new positionMVPTabData('Yards Per Game', 'player_returning_touchdowns', profileType));
      break;
    }

    return tabArray;
  }

  //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
  getListModuleService(tab: positionMVPTabData, query: Array<any>): Observable<positionMVPTabData> {
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = this._apiUrl+'/list';

    for(var q in query) {
      if(q == 'scope'){
        callURL += '/' + q +'='+ query[q];
      }else{
        callURL += '&' + q +'='+ query[q];
      }
    }

    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(
        data => {
          data.data['query'] = query;//used in some functions below
          this.formatData(data.data.listData.stat, data.data.listData);
          tab.data = data.data;
          tab.isLoaded = true;
          tab.listData = ListPageService.detailedData(data.data);
          return tab;
        }
      );
  }

  formatData(key: string, data: Array<PlayerItem>) {
      data.forEach(item => {
        var temp = Number(item.statType);
        item.statType = temp.toFixed(0);
        // switch (key) {
        //   case 'pitcher-strikeouts':
        //   case "pitcher-innings-pitched":
        //   case 'pitcher-hits-allowed':
        //   case 'batter-bases-on-balls':
        //   case 'batter-home-runs':
        //   case 'batter-runs-batted-in':
        //   case 'batter-hits':
        //       // format as integer
        //       var temp = Number(item.stat);
        //       item.stat = temp.toFixed(0);
        //     break;
        //
        //   case 'pitcher-earned-run-average':
        //       var temp = Number(item.stat);
        //       item.stat = temp.toFixed(2); // format as integer
        //       break;
        //   case 'batter-on-base-percentage':
        //   case 'batter-batting-average':
        //       var temp = Number(item.stat);
        //       item.stat = temp.toFixed(3); // format as integer
        //       break;
        //
        //   default:
        //     //do nothing
        // }
      });
  }

  static profileHeader(data): TitleInputData {
    var profile = data.listInfo;
    return {
      imageURL: GlobalSettings.getSiteLogoUrl(), //TODO
      imageRoute: ["Home-page"],
      text1: 'Last Updated: '+ GlobalFunctions.formatUpdatedDate(data.listData[0].lastUpdate),
      text2: 'United States',
      text3: profile.name,
      icon: 'fa fa-map-marker'
    };
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  static carDataPage(data: ListData, profileType: string, errorMessage: string){
    var carouselArray = [];
    var currentYear = new Date().getFullYear();//TODO FOR POSSIBLE past season stats but for now we have lists for current year season
    var carData = data.listData;
    var carInfo = data.listInfo;
    if(carData.length == 0){
      carouselArray.push(SliderCarousel.convertToEmptyCarousel(errorMessage));
    } else{
      //if data is coming through then run through the transforming function for the module
      carouselArray = carData.map(function(val, index){
        var carouselItem;
        var rank = val.listRank;
        var teamRoute = VerticalGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
        var teamLinkText = {
          route: teamRoute,
          text: val.teamName
        };

        var ctaDesc: string;
        var primaryRoute: Array<any>;
        var primaryImage: string;
        var profileLinkText: Link;
        var description: any;
        var playerName = val.playerFirstName + ' ' + val.playerLastName;
        var position = val.playerPosition;

        if(data.query.target == 'team') {
          ctaDesc = 'Interested in discovering more about this team?';
          primaryRoute = teamRoute;
          primaryImage = GlobalSettings.getImageUrl(val.teamLogo);

          profileLinkText = teamLinkText;

          description = ['<i class="fa fa-map-marker text-master"></i>', val.teamCity + ', ' + val.teamState];
        } else { //if profile == 'player'
          ctaDesc = 'Interested in discovering more about this player?';
          primaryRoute = VerticalGlobalFunctions.formatPlayerRoute(val.teamName,playerName,val.playerId.toString());
          primaryImage = GlobalSettings.getImageUrl(val.playerHeadshotUrl);

          profileLinkText = {
            route: primaryRoute,
            text: playerName
          };

          description = [
            'Team: ',
            teamLinkText,
            '<span class="separator">   |   </span> ',
            'Jersey No: #'+val.playerJerseyNumber
          ];
        }

        carouselItem = SliderCarousel.convertToCarouselItemType2(index, {
          isPageCarousel: profileType == 'page',
          backgroundImage: GlobalSettings.getBackgroundImageUrl(val.backgroundImage),
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          profileNameLink: profileLinkText,
          description: description,
          dataValue: GlobalFunctions.commaSeparateNumber(val.stat),
          dataLabel: val.statDescription+' for '+ currentYear,
          circleImageUrl: primaryImage,
          circleImageRoute: primaryRoute,
          rank: val.rank
        });
        return carouselItem;
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  static detailedData(data): DetailListInput[]{//TODO replace data points for list page
    let self = this;
    var currentYear = new Date().getFullYear();//TODO FOR POSSIBLE past season stats but for now we have lists for current year season

    var detailData = data.listData;
    var detailInfo = data.listInfo;
    return detailData.map(function(val, index){
      var teamRoute = VerticalGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
      var teamLocation = val.teamMarket;
      var statDescription = val.statDescription + ' for ' + currentYear;
      var rank = ((Number(data.query.pageNumber) - 1) * Number(data.query.perPageCount)) + (index+1);
      val.listRank = rank;
      if(data.query.target == 'team'){
        var divisionName = VerticalGlobalFunctions.formatShortNameDivison(val.conferenceName) + val.divisionName.charAt(0).toUpperCase();
        return {
          dataPoints: ListPageService.detailsData(
            [ //main left text
              {route: teamRoute, text: val.teamName, class: "dataBox-mainLink"}
            ],
            [ //sub left text
              {text: teamLocation},
              {text: "   |   ", class: "separator"},
              {text: "Division: " + divisionName},
            ],
            val.stat,
            statDescription,
            'fa fa-map-marker'),
          imageConfig: ListPageService.imageData("list", GlobalSettings.getImageUrl(val.playerHeadshotUrl), teamRoute, val.listRank),
          hasCTA:true,
          ctaDesc:'Want more info about this team?',
          ctaBtn:'',
          ctaText:'View Profile',
          ctaUrl:teamRoute
        };
      }else if(data.query.target == 'player'){
        var playerFullName = val.playerFirstName + " " + val.playerLastName;
        var playerRoute = VerticalGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId);
        var position = val.playerPosition;
        return {
          dataPoints: ListPageService.detailsData(
            [ //main left text
              {route: playerRoute, text: playerFullName, class: "dataBox-mainLink"}
            ],
            [ //sub left text
              {route: teamRoute, text: 'Team: '+val.teamName, class: "dataBox-subLink"},
              {text: "   |   ", class: "separator"},
              {text: "Jersey: #" + val.uniformNumber}
            ],
            val.stat,
            statDescription,
            null
          ),
            imageConfig: ListPageService.imageData("list",GlobalSettings.getImageUrl(val.playerHeadshotUrl),playerRoute, val.listRank, '', null),
          hasCTA:true,
          ctaDesc:'Want more info about this player?',
          ctaBtn:'',
          ctaText:'View Profile',
          ctaUrl: playerRoute
        };
      }
    });
  }//end of function

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  static imageData(imageType: string, mainImgUrl: string, mainImgRoute: Array<any>, rank: number, subImgUrl?: string, subImgRoute?: Array<any>): CircleImageData {

    var borderClass, mainImageClass, subImageClass, rankClass;
    if ( imageType == "carousel" ) {
      mainImageClass = "image-150";
      borderClass = "border-large";
      rankClass = "image-48-rank";
      subImageClass = "image-50-sub";
    }
    else {
      mainImageClass = "image-121";
      borderClass = "border-2";
      rankClass = "image-38-rank";
      subImageClass = "image-40-sub";
    }
    if(!mainImgUrl || mainImgUrl == ''){
      mainImgUrl = "/app/public/no-image.svg";
    }
    if(!rank){
      rank = 0;
    }
    //Add rank image
    var subImages: ImageData[] = [{
      text: "#" + rank,
      imageClass: rankClass + " image-round-upper-left image-round-sub-text"
    }];
    if ( subImgRoute ) {
      //Add sub image if route exists.
      if(!subImgUrl || subImgUrl == ''){
        subImgUrl = "/app/public/no-image.svg";
      }
      subImages.push({
          imageUrl: subImgUrl,
          urlRouteArray: subImgRoute,
          hoverText: "<i class='fa fa-mail-forward'></i>",
          imageClass: subImageClass + ' image-round-lower-right'
      });
    }

    return {
        imageClass: mainImageClass,
        mainImage: {
            imageUrl: mainImgUrl,
            urlRouteArray: mainImgRoute,
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: borderClass,
        },
        subImages: subImages,
    };
  }

  static detailsData(
    mainLeftText: Link[],
    subLeftText: Link[],
    mainRightValue: string,
    subRightValue: string,
    subIcon?: string,
    dataLeftText?: Link[],
    dataRightValue?: string
  ) {
    if(!dataLeftText) {
      dataLeftText = [];
    }
    var dataRightText = []
    if(dataRightValue != null){
      dataRightText.push(dataRightValue);
    }

    var details = [
      // {
      //   style:'detail-small',
      //   mainText: dataLeftText,
      //   subText: dataRightText
      // },
      {
        style:'detail-left',
        mainText: mainLeftText,
        subText: subLeftText
      },
      {
        style:'detail-right',
        mainText: [{text: mainRightValue}],
        subText:[{text: subRightValue}],
        icon:subIcon,
      },
    ];
    return details;
  }

}
