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
    stat: string,
    rank: string,
    playerId: string,
    playerName: string,
    playerFirstName: string,
    playerLastName: string,
    imageUrl: string,
    uniformNumber: string,
    position: string[],
    pitchWins: string,
    pitchLosses: string,
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

    //generate a static list of tab array based on the moduleType to emit the tabData and have a tabDisplay for the DOM
    if(moduleType == 'pitcher'){
      tabArray.push(new positionMVPTabData('W/L', 'pitcher-win-record', profileType));
      tabArray.push(new positionMVPTabData('Innings Pitched', 'pitcher-innings-pitched', profileType));
      tabArray.push(new positionMVPTabData('Strikeouts', 'pitcher-strikeouts', profileType));
      tabArray.push(new positionMVPTabData('ERA', 'pitcher-earned-run-average', profileType));
      tabArray.push(new positionMVPTabData('Hits', 'pitcher-hits-allowed', profileType));
    } else if (moduleType == 'batter') {//defaults to 'batter' if nothing is sent to moduleType
      tabArray.push(new positionMVPTabData('Home Runs', 'batter-home-runs', profileType));
      tabArray.push(new positionMVPTabData('Batting Avg.', 'batter-batting-average', profileType));
      tabArray.push(new positionMVPTabData('RBIs', 'batter-runs-batted-in', profileType));
      tabArray.push(new positionMVPTabData('Hits', 'batter-hits', profileType));
      tabArray.push(new positionMVPTabData('Walks', 'batter-bases-on-balls', profileType));
      tabArray.push(new positionMVPTabData('OBP', 'batter-on-base-percentage', profileType));
    } //generate a static list of tab array based on the moduleType to emit the tabData and have a tabDisplay for the DOM

    else if(moduleType == 'Cornerback' || 'Defensive end' || 'Defensive back' || 'Defensive lineman' || 'Defensive tackle' || 'Safety' || 'Linebacker'){
      tabArray.push(new positionMVPTabData('Total Tackles', '', profileType));
      tabArray.push(new positionMVPTabData('Total Sacks', '', profileType));
      tabArray.push(new positionMVPTabData('Interceptions', '', profileType));
      tabArray.push(new positionMVPTabData('Forced Fumbles', '', profileType));
      tabArray.push(new positionMVPTabData('Passes Defended', '', profileType));
    }
    else if (moduleType == 'Kicker') {
      tabArray.push(new positionMVPTabData('Field Goals Made', '', profileType));
      tabArray.push(new positionMVPTabData('Field Goals Percentage Made', '', profileType));
      tabArray.push(new positionMVPTabData('Extra Points Made', '', profileType));
      tabArray.push(new positionMVPTabData('Total Points', '', profileType));
      tabArray.push(new positionMVPTabData('Average Points Per Game', '', profileType));
    }
    else if (moduleType == 'Punter') {
      tabArray.push(new positionMVPTabData('Field Goals Made', '', profileType));
      tabArray.push(new positionMVPTabData('Field Goals Percentage Made', '', profileType));
      tabArray.push(new positionMVPTabData('Extra Points Made', '', profileType));
      tabArray.push(new positionMVPTabData('Total Points', '', profileType));
      tabArray.push(new positionMVPTabData('Average Points Per Game', '', profileType));
    }
    else if (moduleType == 'Quarterback') {
      tabArray.push(new positionMVPTabData('Passer Rating', '', profileType));
      tabArray.push(new positionMVPTabData('Passing Yards', '', profileType));
      tabArray.push(new positionMVPTabData('Touchdowns', '', profileType));
      tabArray.push(new positionMVPTabData('Interceptions', '', profileType));
      tabArray.push(new positionMVPTabData('Completions', '', profileType));
    }
    else if (moduleType == 'Running back') {
      tabArray.push(new positionMVPTabData('Rushing Yards', '', profileType));
      tabArray.push(new positionMVPTabData('Rushing Attempts', '', profileType));
      tabArray.push(new positionMVPTabData('Yards Per Carry', '', profileType));
      tabArray.push(new positionMVPTabData('Touchdowns', '', profileType));
      tabArray.push(new positionMVPTabData('Yards Per Game', '', profileType));
    }
    else if (moduleType == 'Return specialist') {
      tabArray.push(new positionMVPTabData('Return Yards', '', profileType));
      tabArray.push(new positionMVPTabData('Return Attempts', '', profileType));
      tabArray.push(new positionMVPTabData('Return Average', '', profileType));
      tabArray.push(new positionMVPTabData('Longest Return', '', profileType));
      tabArray.push(new positionMVPTabData('Touchdowns', '', profileType));
    }
    else if (moduleType == 'Wide receiver' || 'Tight end') {
      tabArray.push(new positionMVPTabData('Receiving Yards', '', profileType));
      tabArray.push(new positionMVPTabData('Receptions', '', profileType));
      tabArray.push(new positionMVPTabData('Average Yards Per Receptio', '', profileType));
      tabArray.push(new positionMVPTabData('Touchdowns', '', profileType));
      tabArray.push(new positionMVPTabData('Yards Per Game', '', profileType));
    }



    return tabArray;
  }

  //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
  getListModuleService(tab: positionMVPTabData, query: Array<any>): Observable<positionMVPTabData> {
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = this._apiUrl+'/list';

    for(var q in query){
      callURL += "/" + query[q];
    }
    // console.log("list module url: " + callURL);
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(
        data => {
          data.data['query'] = query;//used in some functions below
          this.formatData(data.data.listInfo.stat, data.data.listData);
          tab.data = data.data;
          tab.isLoaded = true;
          tab.listData = ListPageService.detailedData(data.data);
          return tab;
        }
      );
  }

  formatData(key: string, data: Array<PlayerItem>) {
      data.forEach(item => {
        switch (key) {
          case 'pitcher-strikeouts':
          case "pitcher-innings-pitched":
          case 'pitcher-hits-allowed':
          case 'batter-bases-on-balls':
          case 'batter-home-runs':
          case 'batter-runs-batted-in':
          case 'batter-hits':
              // format as integer
              var temp = Number(item.stat);
              item.stat = temp.toFixed(0);
            break;

          case 'pitcher-earned-run-average':
              var temp = Number(item.stat);
              item.stat = temp.toFixed(2); // format as integer
              break;
          case 'batter-on-base-percentage':
          case 'batter-batting-average':
              var temp = Number(item.stat);
              item.stat = temp.toFixed(3); // format as integer
              break;

          default:
            //do nothing
        }
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
        var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index+1);
        val.rank = rank.toString();

        var teamRoute = VerticalGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
        var teamLinkText = {
          route: teamRoute,
          text: val.teamName
        };

        var ctaDesc: string;
        var primaryRoute: Array<any>;
        var primaryImage: string;
        var profileLinkText: Link;
        var description: Array<Link | string>;

        if(data.query.profile == 'team') {
          ctaDesc = 'Interested in discovering more about this team?';
          primaryRoute = teamRoute;
          primaryImage = GlobalSettings.getImageUrl(val.teamLogo);

          profileLinkText = teamLinkText;

          description = ['<i class="fa fa-map-marker text-master"></i>', val.teamCity + ', ' + val.teamState];
        } else { //if profile == 'player'
          ctaDesc = 'Interested in discovering more about this player?';
          primaryRoute = VerticalGlobalFunctions.formatPlayerRoute(val.teamName,val.playerName,val.playerId.toString());
          primaryImage = GlobalSettings.getImageUrl(val.imageUrl);

          profileLinkText = {
            route: primaryRoute,
            text: val.playerName
          };

          var position = val.position.join(", ");
          description = [
            teamLinkText,
            '<span class="separator">   |   </span> ',
            'Jersey: #'+val.uniformNumber,
            ' <span class="separator">   |   </span> ',
            position
          ];
        }

        carouselItem = SliderCarousel.convertToCarouselItemType2(index, {
          isPageCarousel: profileType == 'page',
          backgroundImage: GlobalSettings.getBackgroundImageUrl(val.backgroundImage),
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          profileNameLink: profileLinkText,
          description: description,
          dataValue: val.stat,
          dataLabel: VerticalGlobalFunctions.formatStatName(carInfo.stat)+' for '+ currentYear,
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
      var teamLocation = val.teamCity + ", " + val.teamState;
      var statDescription = VerticalGlobalFunctions.formatStatName(detailInfo.stat) + ' for ' + currentYear;
      var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index+1);
      val.listRank = rank;
      if(data.query.profile == 'team'){
        var divisionName = VerticalGlobalFunctions.formatShortNameDivison(val.conferenceName) + val.divisionName.charAt(0).toUpperCase();
        return {
          dataPoints: ListPageService.detailsData(
            [ //main left text
              {route: teamRoute, text: val.teamName, class: "dataBox-mainLink"}
            ],
            val.stat,
            [ //sub left text
              {text: teamLocation},
              {text: "   |   ", class: "separator"},
              {text: "Division: " + divisionName},
            ],
            statDescription,
            'fa fa-map-marker'),
          imageConfig: ListPageService.imageData("list", GlobalSettings.getImageUrl(val.teamLogo), teamRoute, val.listRank),
          hasCTA:true,
          ctaDesc:'Want more info about this team?',
          ctaBtn:'',
          ctaText:'View Profile',
          ctaUrl:teamRoute
        };
      }else if(data.query.profile == 'player'){
        var playerFullName = val.playerFirstName + " " + val.playerLastName;
        var playerRoute = VerticalGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId);
        var position = val.position.join(", ");
        return {
          dataPoints: ListPageService.detailsData(
            [ //main left text
              {route: playerRoute, text: playerFullName, class: "dataBox-mainLink"}
            ],
            val.stat,
            [ //sub left text
              {route: teamRoute, text: val.teamName, class: "dataBox-subLink"},
              {text: "   |   ", class: "separator"},
              {text: "Jersey: #" + val.uniformNumber},
              {text: "   |   ", class: "separator"},
              {text: position},
            ],
            statDescription,
            null),
            imageConfig: ListPageService.imageData("list",GlobalSettings.getImageUrl(val.imageUrl),playerRoute, val.listRank, '', null),
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

  static detailsData(mainLeftText: Link[], mainRightValue: string,
                     subLeftText: Link[], subRightValue: string, subIcon?: string,
                     dataLeftText?: Link[], dataRightValue?: string) {

    if(!dataLeftText) {
      dataLeftText = [];
    }
    var dataRightText = []
    if(dataRightValue != null){
      dataRightText.push(dataRightValue);
    }

    var details = [
      {
        style:'detail-small',
        leftText: dataLeftText,
        rightText: dataRightText
      },
      {
        style:'detail-large',
        leftText: mainLeftText,
        rightText:[{text: mainRightValue}]
      },
      {
        style:'detail-medium',
        leftText: subLeftText,
        rightText:[{text: subRightValue}],
        icon:subIcon,
      },
    ];
    return details;
  }

}
