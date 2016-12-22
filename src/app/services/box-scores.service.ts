import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';
import { GlobalFunctions } from '../global/global-functions';
import { VerticalGlobalFunctions } from '../global/vertical-global-functions';
import { GlobalSettings } from '../global/global-settings';
import { Gradient } from '../global/global-gradient';

//Interfaces
import { CircleImageData } from '../fe-core/components/images/image-data';
import { gameAiArticle, gameAiImageConfig } from '../fe-core/components/game-article/game-article.component';

export interface GameInfoInput {
  gameHappened: boolean;
  segment:string;
  liveStatus: boolean;
  dataPointCategories:Array<string>;
  verticalContent:string;
  homeData:{
    homeTeamName:string;
    homeImageConfig:CircleImageData;
    homeLink:any;
    homeRecord:string;
    dataPoint1:any;
    dataPoint2:any;
    dataPoint3:any;
  };
  awayData:{
    awayTeamName:string;
    awayImageConfig:CircleImageData;
    awayLink:any,
    awayRecord:string;
    dataPoint1:any;
    dataPoint2:any;
    dataPoint3:any;
  };
} //GameInfoInput

declare var moment;
@Injectable()
export class BoxScoresService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
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

  getBoxScoresService(profile, date, teamId?){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();
  let chosenDate = date;

  //player profile are treated as teams
  if(profile == 'player'){
    profile = 'team'
  }else if (profile == 'league'){
    date += '/addAi'
  }
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/boxScores/'+GlobalSettings.getScope(profile)+'/'+teamId+'/'+ date;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      var transformedDate = this.transformBoxScores(data);
      return {
        transformedDate:transformedDate,
        aiArticle: profile == 'league' && data.aiContent != null ? data.aiContent : null,
        date: chosenDate
      };
    })
  }

  //function  for BoxScoresService to use on profile pages
  getBoxScores(boxScoresData, profileName: string, dateParam, callback: Function) {
    let scopedDateParam = dateParam;
    if(boxScoresData == null){
      boxScoresData = {};
      boxScoresData['transformedDate']={};
    }
    if ( boxScoresData == null || boxScoresData.transformedDate[scopedDateParam.date] == null ) {
      this.getBoxScoresService(scopedDateParam.scope, scopedDateParam.date, scopedDateParam.teamId) //scopedDateParm.profile -> scopedDateParam.scope
        .subscribe(data => {
          if(data.transformedDate[data.date] != null && data.transformedDate[data.date][0] != null){
            let currentBoxScores = {
              scoreBoard: scopedDateParam.scope != 'league' && data.transformedDate[data.date] != null ? this.formatScoreBoard(data.transformedDate[data.date][0]) : null,
              moduleTitle: this.moduleHeader(data.date, profileName),
              gameInfo: this.formatGameInfo(data.transformedDate[data.date],scopedDateParam.teamId, scopedDateParam.scope),
              gameInfoSmall: this.formatGameInfoSmall(data.transformedDate[data.date],scopedDateParam.teamId, scopedDateParam.scope),
              schedule: scopedDateParam.scope != 'league' && data.transformedDate[data.date] != null? this.formatSchedule(data.transformedDate[data.date], scopedDateParam.teamId, scopedDateParam.scope) : null,
              aiContent: scopedDateParam.scope == 'league' ? this.aiHeadline(data.aiArticle) : null,
            };
            currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
            callback(data, currentBoxScores);
          }
        })
    }
    else {
      if(boxScoresData.transformedDate[dateParam.date] != null && boxScoresData.transformedDate[dateParam.date][0] != null){
        let currentBoxScores = {
          scoreBoard: dateParam.scope != 'league' && boxScoresData.transformedDate[dateParam.date] != null ? this.formatScoreBoard(boxScoresData.transformedDate[dateParam.date][0]) : null,
          moduleTitle: this.moduleHeader(dateParam.date, profileName),
          gameInfo: this.formatGameInfo(boxScoresData.transformedDate[dateParam.date],dateParam.teamId, dateParam.scope),
          gameInfoSmall: this.formatGameInfoSmall(boxScoresData.transformedDate[dateParam.date],dateParam.teamId, dateParam.scope),
          schedule: dateParam.scope != 'league' && boxScoresData.transformedDate[dateParam.date] != null? this.formatSchedule(boxScoresData.transformedDate[dateParam.date], dateParam.teamId, dateParam.scope) : null,
          aiContent: dateParam.scope == 'league' ? this.aiHeadline(boxScoresData.aiArticle) : null,
        };
        currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
        callback(boxScoresData, currentBoxScores);
      }
    }
  }

  /**
  * modifies data to get header data for modules
  */
  aiHeadline(data){
    var boxArray = [];
    if (data == null || typeof data == 'undefined') {
      return null;
    }
    if (data[0].featuredReport['article'].status != "Error") {
      if (data[0].featuredReport['article'].data != null) {
        data.forEach(function(val, index){
          let aiContent = val.featuredReport['article']['data'];
          if(aiContent){
            for(var p in aiContent) {
              var eventType = aiContent[p];
              var teaser = eventType.title;
              if (eventType.last_updated) {
                var date = moment.unix(eventType.last_updated);
                date = date.format('dddd') + ', ' + date.format('MMM') + date.format('. DD, YYYY');
              }
              if (eventType.image_url != null) {
                var homeImage = GlobalSettings.getImageUrl(eventType.image_url);
              } else {
                var homeImage = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(null);
              }
            }

            var relPath = GlobalSettings.getRouteFullParams().relPath;
            let domainHostName;
            let urlRouteArray;
            let domainParams = {}

            domainHostName = GlobalSettings.getRouteFullParams().domainHostName;
            if(GlobalSettings.getRouteFullParams().domainParams.partner_id != null){
              domainParams['partner_id'] = GlobalSettings.getRouteFullParams().domainParams.partner_id;
            }
            domainParams['scope'] = GlobalSettings.getRouteFullParams().domainParams.scope == 'home' ? 'nfl' : GlobalSettings.getRouteFullParams().domainParams.scope;

            urlRouteArray = [relPath+domainHostName,domainParams,'Article-pages', {eventType: p, eventID: eventType.event_id}];
            var Box = {
              keyword: p.replace('-', ' '),
              date: date,
              url: urlRouteArray,
              teaser: teaser,
              imageConfig:{
                imageClass: "image-320x180-sm",
                imageUrl: homeImage,
                hoverText: "View Article",
                urlRouteArray: urlRouteArray
              }
            }
            boxArray.push(Box);
          }
        });
      } else {
        return null;
      }
      return boxArray;
    }else{
      return null;
    }

  }

  moduleHeader(date, team?){
    var moduleTitle;
    var convertedDate = GlobalFunctions.sntGlobalDateFormatting(date,"defaultDate");
    moduleTitle = "Box Scores <span class='mod-info'> - " + team + ' : ' +convertedDate + '</span>';
    return {
      moduleTitle: moduleTitle,
      hasIcon: false,
      iconClass: '',
    };
  }

  /**
  * api to grab the dates that have games for box scores
  * sends back => unixdate: true/false
  */
  weekCarousel(profile, date, teamId?){
    //Configure HTTP Headers
    var headers = this.setToken();

    //player profile are treated as teams
    if(profile == 'player'){
      profile = 'team'
    }

    var callURL = this._apiUrl+'/'+profile+'/gameDatesWeekly/'+teamId+'/'+ date;
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      })
  }

  /**
  * api to grab the dates that have games for box scores
  * sends back => unixdate: true/false
  */
  validateMonth(profile, date, teamId?){
    //Configure HTTP Headers
    var headers = this.setToken();

    //player profile are treated as teams
    if(profile == 'player'){
      profile = 'team'
    }

    var callURL = this._apiUrl+'/'+profile+'/gameDates/'+teamId+'/'+ date;//localToEST needs tobe the date coming in AS UNIX
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      })
  }

  transformBoxScores(data){
    let boxScores = data.data;
    var boxScoreObj = {};
    var newBoxScores = {};
    for(var dates in boxScores){
      let YYYYMMDD = moment(Number(dates)).tz('America/New_York').format('YYYY-MM-DD');
      let aiContent = boxScores[dates].aiContent;
      //Converts data to what is neccessary for each of the formatting functions for each component of box scores
        if(boxScores[dates]){
          let isNCAA = boxScores[dates].leagueAbbreviation && boxScores[dates].leagueAbbreviation.toLowerCase() == 'nfl' ? false:true;
          boxScoreObj[dates] = {};
          boxScoreObj[dates]['gameInfo']= {
            isNCAA:isNCAA,
            eventId: boxScores[dates].eventId,
            timeLeft: boxScores[dates].eventQuarterTimeLeft,
            live: boxScores[dates].liveStatus == 'Y'?true:false,
            startDateTime: boxScores[dates].eventDate,
            startDateTimestamp: boxScores[dates].eventStartTime,
            seasonId: boxScores[dates].seasonId,
            eventQuarter: boxScores[dates].eventQuarter,
            dataPointCategories:['Yards','Poss.','Score']
          };
          //0 = home team 1 = away team.
          if(boxScores[dates].eventPossession == 0){
            boxScoreObj[dates]['gameInfo']['verticalContent'] = "Possession: " + boxScores[dates].team1Abbreviation;
          }else{
            boxScoreObj[dates]['gameInfo']['verticalContent'] = "Possession: " + boxScores[dates].team2Abbreviation;
          }
          boxScoreObj[dates]['homeTeamInfo']= {
            name: boxScores[dates].team1FullName,
            id: boxScores[dates].team1Id,
            firstName: boxScores[dates].team1Market,
            lastName: boxScores[dates].team1Name,
            abbreviation: boxScores[dates].team1Abbreviation,
            logo: boxScores[dates].team1Logo,
            colors: boxScores[dates].team1ColorHex != null ? boxScores[dates].team1ColorHex : '#a2a2a2',
            outcome: boxScores[dates].team1Outcome,
            score: boxScores[dates].team1Score,
            dataP1:boxScores[dates].team1Score,
            dataP2:boxScores[dates].team1Possession != ''? boxScores[dates].team1Possession:null,
            dataP3:boxScores[dates].team1Yards,
            winRecord: boxScores[dates].team1Record != null ? boxScores[dates].team1Record.split('-')[0]:null,
            lossRecord: boxScores[dates].team1Record != null ? boxScores[dates].team1Record.split('-')[1]:null,
          };
          boxScoreObj[dates]['awayTeamInfo']= {
            name: boxScores[dates].team2FullName,
            id: boxScores[dates].team2Id,
            firstName: boxScores[dates].team2Market,
            lastName: boxScores[dates].team2Name,
            abbreviation: boxScores[dates].team2Abbreviation,
            logo: boxScores[dates].team2Logo,
            colors: boxScores[dates].team2ColorHex ? boxScores[dates].team2ColorHex : '#fefefe',
            outcome: boxScores[dates].team2Outcome,
            score: boxScores[dates].team2Score,
            dataP1:boxScores[dates].team2Score,
            dataP2:boxScores[dates].team2Possession != ''? boxScores[dates].team2Possession:null,
            dataP3:boxScores[dates].team2Yards,
            winRecord: boxScores[dates].team1Record != null ? boxScores[dates].team2Record.split('-')[0]:null,
            lossRecord: boxScores[dates].team1Record != null ? boxScores[dates].team2Record.split('-')[1]:null,
          };
          boxScoreObj[dates]['p1']={
            home:boxScores[dates].team1Q1Score,
            away:boxScores[dates].team2Q1Score
          };
          boxScoreObj[dates]['p2']={
            home:boxScores[dates].team1Q2Score,
            away:boxScores[dates].team2Q2Score
          };
          boxScoreObj[dates]['p3']={
            home:boxScores[dates].team1Q3Score,
            away:boxScores[dates].team2Q3Score
          };
          boxScoreObj[dates]['p4']={
            home:boxScores[dates].team1Q4Score,
            away:boxScores[dates].team2Q4Score
          };
          if (boxScores[dates].overtimeStatus == "N") {
            boxScores[dates].team1OtScore = null;
            boxScores[dates].team2OtScore = null;
          }
          boxScoreObj[dates]['p5']={
            home:boxScores[dates].team1OtScore,
            away:boxScores[dates].team2OtScore
          };
          if(aiContent != null){
            let aiData = aiContent.featuredReport.article.data;
            if(aiContent.featuredReport.article.status != 'Error'){
              for ( var report in aiData ) {
                boxScoreObj[dates]['aiContent'] = {
                  event: aiData[report].event_id,
                  featuredReport: aiData,
                };
              }
            }else{
              boxScoreObj[dates]['aiContent'] = null;
            }
          }
        }else{
          boxScoreObj[dates] = null;
        }

        if(typeof newBoxScores[YYYYMMDD] == 'undefined'){
          newBoxScores[YYYYMMDD] = [];
          newBoxScores[YYYYMMDD].push(boxScoreObj[dates]);
        }else{
          newBoxScores[YYYYMMDD].push(boxScoreObj[dates]);
        }
      }//end of For Loop
    return newBoxScores;
  }

    //TO MATCH HTML the profile client is on will be detected by teamID and a left and right format will be made with the home and away team data
  formatSchedule(data, teamId?, profile?){
    if(data != null){
      data = data[0];
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      var left, right;

      let scope = gameInfo.isNCAA == true ? 'ncaaf' : 'nfl';
      var homeRoute = VerticalGlobalFunctions.formatTeamRoute(scope, homeData.name, homeData.id);
      var awayRoute = VerticalGlobalFunctions.formatTeamRoute(scope, awayData.name, awayData.id);
      if(profile == 'team'){
        if(teamId == homeData.id){
          homeRoute = null;
        }else{
          awayRoute = null;
        }
      }
      var homeLogo = this.imageData("image-70", "border-2", GlobalSettings.getImageUrl(homeData.logo), homeRoute);
      var awayLogo = this.imageData("image-70", "border-2", GlobalSettings.getImageUrl(awayData.logo), awayRoute);
      right = {
        homeHex:homeData.colors.split(', ')[0], //parse out comma + space to grab only hex colors
        homeID:homeData.id,
        homeLocation:homeData.firstName, // first name of team usually represents the location
        homeLogo:homeLogo,
        url:homeRoute,
        homeLosses:homeData.lossRecord,
        homeName:homeData.lastName,
        homeWins:homeData.winRecord
      };
      left = {
        awayHex:awayData.colors.split(', ')[0],
        awayID:awayData.id,
        awayLocation:awayData.firstName,
        awayLogo: awayLogo,
        url:awayRoute,
        awayLosses:awayData.lossRecord,
        awayName:awayData.lastName,
        awayWins:awayData.winRecord
      };
      // convert data given into format needed for the schedule banner on module
      return {
        home:[right],
        away:[left]
      };
    }else{
      return null
    }
  }



  formatGameInfo(game, teamId?, profile?){
    var gameArray:Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes
    if(teamId == 'nfl' || teamId == 'fbs' || teamId == 'ncaaf'){
      teamId = null;
    }
    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return Number(a.gameInfo.startDateTimestamp) - Number(b.gameInfo.startDateTimestamp);
    });
    sortedGames.forEach(function(data,i){
      if(data != null){
        var info:GameInfoInput;
        let awayData = data.awayTeamInfo;
        let homeData = data.homeTeamInfo;
        let gameInfo = data.gameInfo;

        let scope = gameInfo.isNCAA == true ? 'ncaaf' : 'nfl';

        let homeLink = VerticalGlobalFunctions.formatTeamRoute(scope, homeData.name, homeData.id);
        let awayLink = VerticalGlobalFunctions.formatTeamRoute(scope, awayData.name, awayData.id);
        var aiContent = [];
        aiContent[0] = data.aiContent != null && data.aiContent.featuredReport != null ? self.formatArticle(data) : null;

        if(teamId != null && profile == 'team'){//if league then both items will link
          if(homeData.id == teamId){//if not league then check current team they are one
            homeLink = null;
            var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo))
            var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink)
          }else{
            awayLink = null;
            var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink)
            var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo))
          }
        }else{
          aiContent[0] = data.aiContent != null && data.aiContent.featuredReport != null ? self.formatArticle(data):null;

          var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink)
          var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink)
        }

        let gameDate = data.gameInfo;

        let homeWin = homeData.winRecord != null ? homeData.winRecord : '#';
        let homeLoss = homeData.lossRecord != null ? homeData.lossRecord : '#';

        let awayWin = awayData.winRecord != null ? awayData.winRecord : '#';
        let awayLoss = awayData.lossRecord != null ? awayData.lossRecord : '#';

        //determine if a game is live or not and display correct game time
        var currentTime = new Date().getTime();
        var inningTitle = '';
        var verticalContentLive;
        var liveStatus;
        if(gameInfo.live){
          liveStatus = true;
          verticalContentLive = gameInfo.verticalContent;
          // let inningHalf = gameInfo.inningHalf != null ? GlobalFunctions.toTitleCase(gameInfo.inningHalf) : '';
          inningTitle = gameInfo.eventQuarter != null ? gameInfo.eventQuarter +  GlobalFunctions.Suffix(gameInfo.eventQuarter) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';
        }else{
          verticalContentLive = "";
          liveStatus = false;
          if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
            inningTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
          }else{
            inningTitle = 'Final';
          }
        }

        info = {
          gameHappened:gameInfo.eventQuarter != null ?  true : false,
          //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
          segment:inningTitle,
          liveStatus:liveStatus,
          dataPointCategories:gameInfo.dataPointCategories,
          verticalContent:verticalContentLive,
          homeData:{
            homeTeamName: gameInfo.isNCAA ? homeData.abbreviation + ' ' + homeData.lastName : homeData.lastName,
            homeImageConfig:link1,
            homeLink: homeLink,
            homeRecord: homeWin +'-'+ homeLoss,
            dataPoint1:homeData.dataP1,
            dataPoint2:homeData.dataP2,
            dataPoint3:homeData.dataP3
          },
          awayData:{
            awayTeamName:  gameInfo.isNCAA ? awayData.abbreviation + ' ' + awayData.lastName : awayData.lastName,
            awayImageConfig:link2,
            awayLink: awayLink,
            awayRecord: awayWin +'-'+ awayLoss,
            dataPoint1:awayData.dataP1,
            dataPoint2:awayData.dataP2,
            dataPoint3:awayData.dataP3
          }
        };

        if(teamId != null){
          twoBoxes.push({game:info,aiContent:aiContent});
        }else{
          twoBoxes.push({game:info});
          if(twoBoxes.length > 1 || (i+1) == game.length){// will push into main array once 2 pieces of info has been put into twoBoxes variable
            gameArray.push(twoBoxes);
            twoBoxes = [];
          }
        }
        //incase it runs through entire loops and only 2 or less returns then push whatever is left
        if(game.length == (i+1)  && gameArray.length == 0){
          gameArray.push(twoBoxes);
        }
      }else{
        gameArray.push([]);
      }
    })
    return gameArray;
  }

  formatGameInfoSmall(game, teamId?, profile?){
    var gameArray:Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes
    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return new Date(a.gameInfo.startDateTime).getTime() - new Date(b.gameInfo.startDateTime).getTime();
    });
    sortedGames.forEach(function(data,i){
      if(data != null){
        var info:GameInfoInput;
        let awayData = data.awayTeamInfo;
        let homeData = data.homeTeamInfo;
        let gameInfo = data.gameInfo;

        let scope = gameInfo.isNCAA == true ? 'ncaaf' : 'nfl';

        let homeLink = VerticalGlobalFunctions.formatTeamRoute(scope, homeData.name, homeData.id);
        let awayLink = VerticalGlobalFunctions.formatTeamRoute(scope, awayData.name, awayData.id);
        var aiContent = [];
        aiContent[0] = data.aiContent != null && data.aiContent.featuredReport != null ? self.formatArticle(data):null;

        if(teamId != null && profile == 'team'){//if league then both items will link
          if(homeData.id == teamId){//if not league then check current team they are one
            homeLink = null;
            var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo))
            var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink)
          }else{
            awayLink = null;
            var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink)
            var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo))
          }
        }else{
          aiContent[0] = data.aiContent != null ? self.formatArticle(data):null;
          var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink)
          var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink)
        }


        let gameDate = data.gameInfo;

        let homeWin = homeData.winRecord != null ? homeData.winRecord : '#';
        let homeLoss = homeData.lossRecord != null ? homeData.lossRecord : '#';

        let awayWin = awayData.winRecord != null ? awayData.winRecord : '#';
        let awayLoss = awayData.lossRecord != null ? awayData.lossRecord : '#';

        //determine if a game is live or not and display correct game time
        var currentTime = new Date().getTime();
        var inningTitle = '';
        var segmentTitle = '';
        var liveStatus;

        if(gameInfo.live){
          segmentTitle = gameInfo.eventQuarter != null ? gameInfo.eventQuarter +  GlobalFunctions.Suffix(gameInfo.eventQuarter) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';
          liveStatus = true;

        }else{
          liveStatus = false;
          if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
            segmentTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
          }else{
            segmentTitle = 'Final';
          }
        }

        info = {
          gameHappened:gameInfo.eventQuarter != null ?  true : false,
          //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
          segment:segmentTitle,
          liveStatus: liveStatus,
          dataPointCategories:gameInfo.dataPointCategories,
          verticalContent:gameInfo.verticalContent,
          homeData:{
            homeTeamName: homeData.lastName,
            homeImageConfig:link1,
            homeLink: homeLink,
            homeRecord: homeWin +'-'+ homeLoss,
            dataPoint1:homeData.dataP1,
            dataPoint2:homeData.dataP2,
            dataPoint3:homeData.dataP3
          },
          awayData:{
            awayTeamName:awayData.lastName,
            awayImageConfig:link2,
            awayLink: awayLink,
            awayRecord: awayWin +'-'+ awayLoss,
            dataPoint1:awayData.dataP1,
            dataPoint2:awayData.dataP2,
            dataPoint3:awayData.dataP3
          }
        };
        if(teamId != null){
          gameArray.push({game:info,aiContent:aiContent});
        }else{
          gameArray.push({game:info});
        }
      }else{
        gameArray.push([]);
      }
    })
    return gameArray;
  }

  formatArticle(data){
    let gameInfo = data.gameInfo;
    let aiContent = data.aiContent;
    let partnerRoute = GlobalSettings.storedPartnerId() ? GlobalSettings.storedPartnerId() : '';
    var gameArticle = <gameAiArticle> {};

    for ( var report in aiContent.featuredReport ) {
      gameArticle['report'] = "Read The Report";
      gameArticle['title'] = aiContent.featuredReport[report].title ? aiContent.featuredReport[report].title : null;
      gameArticle['date'] = aiContent.featuredReport[report].date ? aiContent.featuredReport[report].date : null;
      gameArticle['eventId'] = aiContent.featuredReport[report].event_id ? aiContent.featuredReport[report].event_id : null;
      gameArticle['eventType'] = {
        commentHeader: aiContent.featuredReport[report].commentHeader ? aiContent.featuredReport[report].commentHeader : null,
        dateline: aiContent.featuredReport[report].dateline ? aiContent.featuredReport[report].dateline : null,
        displayHeaderline: aiContent.featuredReport[report].title ? aiContent.featuredReport[report].title : null,
        images: aiContent.featuredReport[report].images ?  aiContent.featuredReport[report].images : null,
        metaHeadline: aiContent.featuredReport[report].metaHeadline ? aiContent.featuredReport[report].metaHeadline : null,
        metadata: aiContent.featuredReport[report].metadata ? aiContent.featuredReport[report].metadata : null,
        teamId: aiContent.featuredReport[report].team_id ? aiContent.featuredReport[report].team_id : null
      }
      gameArticle['imageConfig'] = <gameAiImageConfig> {
        hoverText: 'View Article',
        imageClass: aiContent.featuredReport[report].imageClass ? aiContent.featuredReport[report].imageClass : null,
        imageUrl: aiContent.featuredReport[report].image_url ? GlobalSettings.getImageUrl(aiContent.featuredReport[report].image_url) : null,
        urlRouteArray: aiContent.featuredReport[report].article_url ? aiContent.featuredReport[report].article_url : null
      }
      gameArticle['keyword'] = aiContent.featuredReport[report].subcategory ? aiContent.featuredReport[report].subcategory : null,
      gameArticle['teaser'] = aiContent.featuredReport[report].title ? aiContent.featuredReport[report].title : null,
      gameArticle['url'] = [
        'Article-pages',
        {
          eventId: aiContent.featuredReport[report].eventId ? aiContent.featuredReport[report].eventId : null,
          eventType: aiContent.featuredReport[report] ? aiContent.featuredReport[report] : null
        }
      ],
      gameArticle['urlRouteArray'] = aiContent.featuredReport[report].article_url ? partnerRoute+aiContent.featuredReport[report].article_url : null
    }

    // for(var report in aiContent.featuredReport){
    //   gameArticle['report'] = "Read The Report";
    //   gameArticle['headline'] = aiContent.featuredReport[report].title;
    //   gameArticle['articleLink'] = ['Article-pages',{eventType:report,eventID:aiContent.event}];
    //   var i = aiContent.featuredReport[report].image_url;
    //   if(i != null){
    //     var random1 = Math.floor(Math.random() * i.length);
    //     var random2 = Math.floor(Math.random() * i.length);
    //     gameArticle['images'] = [];
    //     gameArticle['images'].push(GlobalSettings.getImageUrl(i));
    //     // if(random1 == random2){
    //     //   gameArticle['images'].push(GlobalSettings.getImageUrl(i[random1].image_url));
    //     // }else{
    //     //   gameArticle['images'].push(GlobalSettings.getImageUrl(i[random1].image_url));
    //     //   gameArticle['images'].push(GlobalSettings.getImageUrl(i[random2].image_url));
    //     // }
    //   }else{
    //     gameArticle['images'] = [];
    //     gameArticle['images'].push(VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(null));
    //   }
    // }
    return gameArticle;
  }

  formatScoreBoard(data){
    if(data != null){
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;

      var arrayScores = [];
      //for live games show the total scored added up for each inning
      var homeLiveScore = 0;
      var awayLiveScore = 0;
      for(var score in data){
        if(score != 'aiContent' && score != 'awayTeamInfo' && score != 'homeTeamInfo' && score != 'gameInfo'){
          let inningCategory = Number(score.replace('p',''));
          arrayScores.push({
            inning:inningCategory < 5 ? inningCategory: 'OT',//replace the letter 'p' in each inning
            scores:data[score]
          });
        }
      }

      var scoreBoard={
        homeLastName: homeData.lastName,
        awayLastName: awayData.lastName,
        homeScore:homeData.score,
        awayScore:awayData.score,
        scoreArray:arrayScores,
      };
      return scoreBoard;
    }
    else{
      return null;
    }

  }

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  imageData(imageClass, imageBorder, mainImg, mainImgRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.svg";
    }
    var image: CircleImageData = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<i class='fa fa-mail-forward'></i>",
            imageClass: imageBorder,
        },
    };
    return image;
  }
}
