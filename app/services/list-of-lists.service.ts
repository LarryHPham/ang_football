import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions}  from '../global/vertical-global-functions';
import {GlobalSettings}  from '../global/global-settings';
import {SliderCarousel, SliderCarouselInput} from '../fe-core/components/carousels/slider-carousel/slider-carousel.component';

declare var moment: any;
@Injectable()
export class ListOfListsService {
  private _apiUrlTdl: string = GlobalSettings.getApiUrl();
  private _proto = window.location.protocol;


  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){
  }

  //Function to set custom headers
  setToken(){
    var headers = new Headers();
    //headers.append(this.headerName, this.apiToken);
    return headers;
  }

        //http://dev-homerunloyal-api.synapsys.us/listOfLists/league/5
  getListOfListsService(urlParams, profileType: string, pageType: string){
    // Configure HTTP Headers
    var headers = this.setToken();

    let callURL = this._apiUrlTdl + '/listOfLists/';


    let id      = urlParams.targetId != null ? urlParams.targetId : "";
    var limit   = urlParams.perPageCount != null ? urlParams.perPageCount: 4;
    var pageNum = urlParams.pageNumber != null ? urlParams.pageNumber : 1;
    let target = urlParams.target != null ? urlParams.target : "team";

    console.log('url Pararms', urlParams);
    var url_api = "scope=" + 'nfl' + "&target=" + target + "&perPageCount=" + limit + "&pageNumber=" + pageNum + "&targetId=" + id;

    callURL += url_api;


    // scope=nfl&target=team&perPageCount=5&pageNumber=1&targetId=155

    // for(var q of urlParams){
    //   console.log("url", urlParams[q]);
    //   if(q == 'scope'){
    //     callURL+= q +'='+urlParams[q];
    //
    //   }else{
    //     callURL += '&'+q+'='+urlParams[q];
    //   }
    // }
    // if(newParams.scope == 'nfl') {
    //   callURL+= "scope=" + newParams.scope + "&target=" + newParams.target + "&perPageCount=" + newParams.perPageCount + "&pageNumber=" + newParams.pageNumber + "&targetId=" + newParams.targetId;
    // }



    return this.http.get( callURL, {
        headers: headers
      })
      .map(res => res.json())
      .map(
        data => {
          console.log('hello',data);

          if ( !data || !data.data ) {
            return null;
          }
          var lastUpdated = "";
          if ( data && data.data && data.data.length > 0 && data.data != undefined) {
            lastUpdated = data.data[0].targetData;

          }
          return {
            carData: this.carDataPage(data.data),
            listData: this.detailedData(data.data, pageType),
            targetData: this.getTargetData(data.data),
            pagination: data.data[0].listInfo,
            lastUpdated: lastUpdated
          };
        }
      )
  }

  getTargetData(data) {
    return(data[0].targetData);
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carDataPage(data): Array<SliderCarouselInput>{
    let self = this;
    var carouselArray = [];

    if(data.length == 0){
      carouselArray.push(SliderCarousel.convertToEmptyCarousel("Sorry, we currently do not have any data for this list."));
    }else{
    //  console.log(data);
      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){
        if( val.listData[0] == null) return;
        let itemInfo          = val.listInfo;
        let itemTargetData    = val.targetData;
        let itemProfile       = null;
        let itemImgUrl        = null;
        let itemRoute         = null;
        let itemSubImg        = null;
        let itemSubRoute      = null;
      //  let itemHasHover      = version == "page";
      //  let ctaUrlArray       = itemInfo.url.split("/");
      //  let ctaUrlArray       = null;
        let itemStatName      = val.targetData[0].statType.replace(/_/g,' '); //TODO
        // let updatedDate       = moment(itemTargetData.lastUpdated).format('dddd, MMMM Do, YYYY');
        let itemDescription   = [];
        let rankStr = itemTargetData[0].rank + GlobalFunctions.Suffix(Number(itemTargetData[0].rank));
        let profileLinkText;
        itemTargetData.playerName = itemTargetData[0].playerFirstName + ' ' + itemTargetData[0].playerLastName;
        if( itemTargetData[0].rankType == "player") {
          itemProfile       = itemTargetData.playerName;
          itemImgUrl        = GlobalSettings.getImageUrl(itemTargetData[0].playerHeadshotUrl);
          itemRoute         = VerticalGlobalFunctions.formatPlayerRoute(itemTargetData[0].teamName, itemTargetData.playerName, itemTargetData[0].playerId);
          itemSubImg        = VerticalGlobalFunctions.formatTeamLogo(itemTargetData[0].teamLogo);
          itemSubRoute      = VerticalGlobalFunctions.formatTeamRoute(itemTargetData[0].teamName, itemTargetData[0].teamId);
          profileLinkText   = {
            route: itemRoute,
            text: itemProfile,
            class: 'text-heavy'
          };
          itemDescription   = [profileLinkText, " is currently ranked <b>"+ rankStr +"</b> in the "+ itemTargetData[0].rankScope +" with the most <b>" + itemStatName + "</b>."];
        } else if ( itemTargetData[0].rankType == "team" ) {
          itemProfile       = itemTargetData[0].teamName;
          itemImgUrl        = GlobalSettings.getImageUrl(itemTargetData[0].teamLogo);
          itemRoute         = VerticalGlobalFunctions.formatTeamRoute(itemTargetData[0].teamName, itemTargetData[0].teamId);
          profileLinkText   = {
            route: itemRoute,
            text: itemProfile
          };
          itemDescription   = ["The ", profileLinkText, " are currently ranked <b>"+ rankStr +"</b> in the "+ itemTargetData[0].rankScope +" with the most <b>" + itemStatName + "</b>."];
        }
        if (itemTargetData.backgroundImage == null || itemTargetData.backgroundImage == undefined) {
          itemTargetData.backgroundImage = "/app/public/Image-Placeholder-2.jpg";
        }
        else {
          itemTargetData.backgroundImage = GlobalSettings.getBackgroundImageUrl(itemTargetData[0].backgroundImage);
        }


        var carouselItem = SliderCarousel.convertToCarouselItemType1(index, {
    //      backgroundImage: itemTargetData.backgroundImage,
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          subheader: ["Related List - ", profileLinkText],
          profileNameLink: {text: itemInfo.listName},
          description: itemDescription,
        //ask  lastUpdatedDate: GlobalFunctions.formatUpdatedDate(itemTargetData[0].lastUpdated),
          lastUpdatedDate: 'last-updated',
          circleImageUrl: itemImgUrl,
          circleImageRoute: VerticalGlobalFunctions.formatTeamRoute(itemTargetData[0].teamName, itemTargetData[0].teamId), //replacement for
          rank: itemTargetData[0].rank,
          rankClass: "image-48-rank"
        });
        carouselArray.push(carouselItem);
      });
    }
     console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;

  }

  detailedData(data, version){
    let listDataArray     = [];
    let dummyUrl          = "/list/player/batter-home-runs/asc/National";
    let dummyName         = "Batters with the most home runs in the National League";
    let dummyStat         = "batter-home-runs";
    let dummyOrdering     = "asc";
    let dummyScope        = "conference";
    let dummyConference   = "National";
    let dummyDivision     = "all";
    let dummyListCount    = 1;
    let dummyPageCount    = 1;
    let dummyListRank     = 1;
    let dummyIcon         = "fa fa-mail-forward";

    data.forEach(function(item, index){



      let itemInfo = item.listInfo;
      let itemListData = item.listData;
      let itemTarget = item.targetData;


      if( itemListData.length<1 ) return;
      itemListData.unshift(item.targetData);
      itemListData = itemListData.slice(1, 7);

    //  let itemListInfo = item['listInfo'];
      //console.log(item.listInfo);
      //  let ctaUrlArray = itemListInfo.url.split("/");
      //let ctaUrlArray = 'test';

      //:target/:statName/:ordering/:perPageCount/:pageNumber',
      /*
      let listRoute = ['List-page', {
        target      : kebabArr[0],
        statName    : kebabArr[1],
        ordering    : kebabArr[2],
        perPageCount: kebabArr[3],
        pageNumber  : kebabArr[4],

      }];*/
      let ctaUrlArr = [
        itemTarget[0]['rankType'],
        itemTarget[0]['statType'],
        itemInfo.ordering,
        10,
        1
      ]

    //  var ctaUrlArray = ctaUrlArr.toString().replace(/,/g,'/');
    //  console.log(ctaUrlArray);

      // removes first empty item and second "list" item
      //  ctaUrlArray.splice(0,2);
      //  ctaUrlArray.push.apply(ctaUrlArray,["10","1"]);

      var profileTypePlural = "types";
      if ( itemTarget[0]['rankType'] == "player" ) {
        profileTypePlural = "players";
      }
      else if ( itemTarget[0]['rankType'] == "team" ) {
        profileTypePlural = "teams";
      }


      var listData = {
      // url           : itemListInfo.url           != null  ? itemListInfo.url          : dummyUrl,
        name          : itemInfo.listName           != null  ? itemInfo.listName         : dummyName,
      // target        : itemTarget.target,
    //   stat          : itemListInfo.stat          != null  ? itemListInfo.stat         : dummyStat,
    //   ordering      : itemListInfo.ordering      != null  ? itemListInfo.ordering     : dummyOrdering,
    //   scope         : itemListInfo.scope         != null  ? itemListInfo.scope        : dummyScope,
    //   conference    : itemListInfo.conference    != null  ? itemListInfo.conference   : dummyConference,
    //   division      : itemListInfo.division      != null  ? itemListInfo.division     : dummyDivision,
        topname       : itemTarget.teamName        != null  ? itemTarget.teamName : itemTarget.playerFirstName + itemTarget.playerLastname,
        listCount     : itemInfo.resultCount       != null  ? itemInfo.resultCount    : dummyListCount,
        pageCount     : itemInfo.pageCount         != null  ? itemInfo.pageCount    : dummyPageCount,
        listRank      : itemListData.rank      != null  ? itemListData.rank     : dummyListRank,
    //    icon          : itemListInfo.icon          != null  ? itemListInfo.icon         : dummyIcon,
        dataPoints    : [],
        ctaBtn        : '',
        ctaDesc       : 'Want to see the ' + profileTypePlural + ' in this list?',
        ctaText       : 'View The List',
        // ctaUrl        : MLBGlobalFunctions.formatListRoute(ctaUrlArray)
        //ctaUrl        : ctaUrl
        ctaUrl        : VerticalGlobalFunctions.formatListRoute(ctaUrlArr)  != null ? VerticalGlobalFunctions.formatListRoute(ctaUrlArr) : dummyUrl
      };

      console.log(listData);


      itemListData.forEach(function(val, index) {
        let itemUrlRouteArray = itemTarget[0]['rankType'] == "player"  ?
          // MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.playerName, val.playerId) :
          // MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
          // console.log(val);
          // let firstItemHover    = version == "page" ? "<p>View</p><p>Profile</p>" : null;
        //  let firstItemHover = "<p>View</p><p>Profile</p>";
        //----

          VerticalGlobalFunctions.formatPlayerRoute(val.teamName, val.playerName, val.playerId) :
          VerticalGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
          // let firstItemHover    = version == "page" ? "<p>View</p><p>Profile</p>" : null;
          let firstItemHover = "<p>View</p><p>Profile</p>";
        //  console.log('imageURL', val);
        listData.dataPoints.push(
          {
            imageClass : index > 0 ? "image-43" : "image-121",
            mainImage: {
              imageUrl        : itemTarget[0].teamLogo != null ? GlobalSettings.getImageUrl(itemTarget[0].teamLogo) : GlobalSettings.getImageUrl(itemTarget[0].teamLogo),
              urlRouteArray   : version == "page" || index > 0 ? itemUrlRouteArray : null,
              hoverText       : index > 0 ? "<i class='fa fa-mail-forward'></i>" : firstItemHover,
              imageClass      : index > 0 ? "border-1" : "border-2"
            },
            subImages         : index > 0 ? null : [
              // {
              //   imageUrl      : itemTarget[0].rankType == "player" ? VerticalGlobalFunctions.formatTeamLogo(itemTarget[0].teamName) : null,
              //   urlRouteArray : itemTarget[0].rankType == "player" ? VerticalGlobalFunctions.formatTeamRoute(itemTarget[0].teamName, itemTarget[0].teamId) : null,
              //   hoverText     : itemTarget[0].rankType == "player" ? "<i class='fa fa-mail-forward'></i>" : null,
              //   imageClass    : itemTarget[0].rankType == "player" ? "image-round-sub image-40-sub image-round-lower-right" : null
              // },
              {
              text: "#"+ itemTarget[0].rank,
              imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }]
          }
        )
      });
      console.log('listData.Datapoints',listData.dataPoints);

      listDataArray.push(listData);
    });
    return listDataArray;

  }

  imageData(imageClass, imageBorder, mainImg, mainImgRoute, subImgClass?, subImg?, subRoute?, rank?, hasHover?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = GlobalSettings.getImageUrl("/mlb/players/no-image.svg");
    }
    if(typeof subImg =='undefined' || subImg == ''){
      mainImg = GlobalSettings.getImageUrl("/mlb/players/no-image.svg");
    }
    if(typeof rank == 'undefined' || rank == 0){
      rank = 0;
    }
    var image = {//interface is found in image-data.ts
      imageClass: imageClass,
      mainImage: {
        imageUrl       : mainImg,
        urlRouteArray  : hasHover ? mainImgRoute : null,
        hoverText      : hasHover ? "<p>View</p><p>Profile</p>" : null,
        imageClass     : imageBorder
      },
      subImages: [
        {
          imageUrl: subImg,
          urlRouteArray: subRoute,
          hoverText: "<i class='fa fa-mail-forward'></i>",
          imageClass: subImgClass + " image-round-lower-right"
        },
        {
          text: "#"+rank,
          imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
        }
      ],
    };
    return image;
  }
}
