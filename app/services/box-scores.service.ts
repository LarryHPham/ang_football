import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {GameInfoInput} from '../fe-core/components/game-info/game-info.component';

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

  //player profile are treated as teams
  if(profile == 'player'){
    profile = 'team'
  }else if (profile == 'league'){
    date += '/addAi'
  }

  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/boxScores/'+profile+'/'+teamId+'/'+ date;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      var transformedDate = this.transformBoxScores(data.data);
      return {
        transformedDate:transformedDate,
        aiArticle: profile == 'league' ? data.aiContent : null
      };
    })
  }

  //function  for BoxScoresService to use on profile pages
  getBoxScores(boxScoresData, profileName: string, dateParam, callback: Function) {
    if(boxScoresData == null){
      boxScoresData = {};
      boxScoresData['transformedDate']={};
    }
    if ( boxScoresData == null || boxScoresData.transformedDate[dateParam.date] == null ) {
      this.getBoxScoresService(dateParam.profile, dateParam.date, dateParam.teamId)
        .subscribe(data => {
          if(data.transformedDate[dateParam.date] != null){
            let currentBoxScores = {
              scoreBoard: dateParam.profile != 'league' && data.transformedDate[dateParam.date] != null ? this.formatScoreBoard(data.transformedDate[dateParam.date][0]) : null,
              moduleTitle: this.moduleHeader(dateParam.date, profileName),
              gameInfo: this.formatGameInfo(data.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
              gameInfoSmall: this.formatGameInfoSmall(data.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
              schedule: dateParam.profile != 'league' && data.transformedDate[dateParam.date] != null? this.formatSchedule(data.transformedDate[dateParam.date][0], dateParam.teamId, dateParam.profile) : null,
              aiContent: dateParam.profile == 'league' ? this.aiHeadline(data.aiArticle) : null,
            };
            currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
            callback(data, currentBoxScores);
          }
        })
    }
    else {
      if(boxScoresData.transformedDate[dateParam.date] != null){
        let currentBoxScores = {
          scoreBoard: dateParam.profile != 'league' && boxScoresData.transformedDate[dateParam.date] != null ? this.formatScoreBoard(boxScoresData.transformedDate[dateParam.date][0]) : null,
          moduleTitle: this.moduleHeader(dateParam.date, profileName),
          gameInfo: this.formatGameInfo(boxScoresData.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
          gameInfoSmall: this.formatGameInfoSmall(boxScoresData.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
          schedule: dateParam.profile != 'league' && boxScoresData.transformedDate[dateParam.date] != null? this.formatSchedule(boxScoresData.transformedDate[dateParam.date][0], dateParam.teamId, dateParam.profile) : null,
          aiContent: dateParam.profile == 'league' ? this.aiHeadline(boxScoresData.aiArticle) : null,
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
    var sampleImage = "/app/public/placeholder_XL.png";
    if (data != null) {
      data.forEach(function(val, index){
        for(var p in val.featuredReport){
          var eventType = val.featuredReport[p];
          var teaser = eventType.displayHeadline;
        }
      var date = GlobalFunctions.formatDate(val.timestamp*1000);
      var Box = {
        keyword: p,
        date: date.month + " " + date.day + ", " + date.year,
        url: VerticalGlobalFunctions.formatAiArticleRoute(p, val.event),
        teaser: teaser,
        imageConfig:{
          imageClass: "image-320x180-sm",
          imageUrl: val.home.images[0] != null ? val.home.images[0] : sampleImage,
          hoverText: "View Article",
          urlRouteArray: VerticalGlobalFunctions.formatAiArticleRoute(p, val.event)
        }
      }
      boxArray.push(Box);
      });
    }
    return boxArray;

  }
  moduleHeader(date, team?){
    var moduleTitle;
    var month = moment(date,"YYYY-MM-DD").tz('America/New_York').format("MMMM");
    var day = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    var ordinal = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    ordinal = '<sup>' + GlobalFunctions.Suffix(ordinal) + '</sup>';
    var year = moment(date,"YYYY-MM-DD").tz('America/New_York').format("YYYY");
    var convertedDate = month + ' ' + day + ordinal + ', ' + year;

    moduleTitle = "Box Scores <span class='mod-info'> - " + team + ': ' +convertedDate + '</span>';
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

  transformBoxScores(boxScores){
    var boxScoreObj = {};
    var newBoxScores = {};


    for(var dates in boxScores){
      let YYYYMMDD = moment(Number(dates)).tz('America/New_York').format('YYYY-MM-DD');
      //Converts data to what is neccessary for each of the formatting functions for each component of box scores
        if(boxScores[dates]){
          let team1Poss = boxScores[dates].team1Possession.split(':');
          let team1HH = Number(team1Poss[0]);
          let team1MM = Number(team1Poss[1]);
          let team1SS = Number(team1Poss[2]);
          if(team1HH > 0){
            team1MM += (60 * team1HH);
          }
          let team2Poss = boxScores[dates].team2Possession.split(':').slice(1,3).join(':');
          let team2HH = Number(team1Poss[0]);
          let team2MM = Number(team1Poss[1]);
          let team2SS = Number(team1Poss[2]);
          if(team2HH > 0){
            team2MM += (60 * team2HH);
          }

          // let newTeam1Poss = team1MM +':'+team1SS;
          // let newTeam2Poss = team2MM +':'+team2SS;

          let newTeam1Poss = '24:23';//TODO DUMMY DATA
          let newTeam2Poss = '37:54';//TODO DUMMY DATA

          boxScoreObj[dates] = {};
          boxScoreObj[dates]['gameInfo']= {
            eventId: boxScores[dates].eventId,
            seasonId: boxScores[dates].seasonId,
            inningsPlayed: boxScores[dates].eventQuarter,
            timeLeft: boxScores[dates].eventQuarterTimeLeft,
            live: true,
            startDateTime: boxScores[dates].eventDate,
            startDateTimestamp: boxScores[dates].eventStartTime,
            dataPointCategories:['Score','Poss','Yards']
          };
          //0 = home team 1 = away team.
          if(boxScores[dates].eventPossession == 0){
            boxScoreObj[dates]['gameInfo']['verticalContent'] = "Possesion:" + boxScores[dates].team1Abbreviation;
          }else{
            boxScoreObj[dates]['gameInfo']['verticalContent'] = "Possesion:" + boxScores[dates].team2Abbreviation;
          }
          boxScoreObj[dates]['homeTeamInfo']= {
            name: boxScores[dates].team1FullName,
            id: boxScores[dates].team1Id,
            firstName: boxScores[dates].team1Market,
            lastName: boxScores[dates].team1Name,
            abbreviation: boxScores[dates].team1Abbreviation,
            logo: boxScores[dates].team1Logo,
            colors: boxScores[dates].team1ColorHex,
            outcome: boxScores[dates].team1Outcome,
            score: boxScores[dates].team1Score,
            dataP1:boxScores[dates].team1Score,
            dataP2:newTeam1Poss,
            // dataP2:boxScores[dates].team1Poss,
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
            colors: boxScores[dates].team2ColorHex,
            outcome: boxScores[dates].team2Outcome,
            score: boxScores[dates].team2Score,
            dataP1:boxScores[dates].team2Score,
            dataP2:newTeam2Poss,
            // dataP2:boxScores[dates].team2Poss,
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
            away:boxScores[dates].team2Q5Score
          };
          boxScoreObj[dates]['p5']={
            home:boxScores[dates].team1OtScore,
            away:boxScores[dates].team2OtScore
          };

          boxScoreObj[dates]['aiContent'] = {//TODO DUMMY DATA
            event: "60169",
              featuredReport: {
                'pregame-report': {
                displayHeadline: "Yankees step up to plate against Orioles",
                metaHeadline: "Baltimore Orioles vs New York Yankees Saturday, September 3, 2016 at Oriole Park at Camden Yards",
                dateline: null,
                article: [
                "On Sep. 3, the New York Yankees will travel to Baltimore, Md., to take on the Baltimore Orioles. Baltimore will look to guard their home field by stifling the Yankees' offense. So far this season, the Orioles' defense has allowed 4.65 runs per game on average. To silence the crowd, New York will need to be explosive out of the gate."
                ]
              }
            },
            home:{
              images: [
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/4bf2e420-fbe4-4c3e-947f-2fb3deb1f5a2.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/2904a8e4-38de-4e36-bd62-375db797d0d6.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/c0874dc1-f65b-449d-8deb-6991481ff8b9.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/b26e3fdf-59c8-4db3-aa23-480e6f729c9c.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/686fc23c-d651-4dd8-8c35-20615555fffd.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/3a519543-9e60-4423-8826-4ff015b3010f.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/e77b46e0-2fe1-416d-bcd4-7107a5da52d7.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/738df517-420d-4ff4-a255-2c2457348e41.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/fda7c0dd-9b90-45e3-a0d6-be4b5b7c4bd7.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/94fa2a26-3889-4c63-bbaf-8786bed50c2f.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/98029b7d-7944-4208-8ef5-8bc29dec5124.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/4bdb612a-aa93-4570-b7a4-931dd6bef5c7.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/5655bd4d-b08c-49f3-8f48-1e3a77c6851e.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/64eed990-cb91-4bef-b080-f26af042a085.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/5e6c1658-f023-4848-8f74-23e5b2fd1cb7.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/249a610e-8b04-4cbb-b7dd-ced836c9d1b5.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/cad19ddf-cd5d-40de-b04c-3fc6a085c97c.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/ca14d063-d44d-4e19-8fb0-09e5c7b1d85f.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/d95ab13c-eeb4-4e81-8fb5-76ccafcb31a6.jpg",
                "https://prod-sports-images.synapsys.us/mlb/players/liveimages/472cb019-3c74-4ef3-aa95-809cef65c4ff.jpg"
              ],
            }
          };
        }else{
          boxScoreObj[dates] = null;
        }


        if(typeof newBoxScores[dates] == 'undefined'){
          newBoxScores[YYYYMMDD] = [];
          newBoxScores[YYYYMMDD].push(boxScoreObj[dates]);
        }else{
          newBoxScores[YYYYMMDD].push(boxScoreObj[dates]);
        }
      }
    return newBoxScores;
  }

    //TO MATCH HTML the profile client is on will be detected by teamID and a left and right format will be made with the home and away team data
  formatSchedule(data, teamId?, profile?){
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    var left, right;
    var homeRoute = VerticalGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
    var awayRoute = VerticalGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
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
  }



  formatGameInfo(game, teamId?, profile?){
    var gameArray:Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes

    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return new Date(a.gameInfo.startDateTime).getTime() - new Date(b.gameInfo.startDateTime).getTime();
    });

    sortedGames.forEach(function(data,i){

      var info:GameInfoInput;
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      let homeLink = VerticalGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
      let awayLink = VerticalGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
      var aiContent = data.aiContent != null ? self.formatArticle(data):null;
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
        var aiContent = data.aiContent != null ? self.formatArticle(data):null;
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

      if(gameInfo.live){
        // let inningHalf = gameInfo.inningHalf != null ? GlobalFunctions.toTitleCase(gameInfo.inningHalf) : '';
        inningTitle = gameInfo.inningsPlayed != null ? gameInfo.inningsPlayed +  GlobalFunctions.Suffix(gameInfo.inningsPlayed) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';
      }else{
        if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
          inningTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        }else{
          inningTitle = 'Final';
        }
      }

      info = {
        gameHappened:gameInfo.inningsPlayed != null ?  true : false,
        //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
        inning:inningTitle,
        dataPointCategories:gameInfo.dataPointCategories,
        verticalContent:gameInfo.verticalContent,
        homeData:{
          homeTeamName: homeData.lastName,
          homeImageConfig:link1,
          homeLink: homeLink,
          homeRecord: homeWin +'-'+ homeLoss,
          DP1:homeData.dataP1,
          DP2:homeData.dataP2,
          DP3:homeData.dataP3
        },
        awayData:{
          awayTeamName:awayData.lastName,
          awayImageConfig:link2,
          awayLink: awayLink,
          awayRecord: awayWin +'-'+ awayLoss,
          DP1:awayData.dataP1,
          DP2:awayData.dataP2,
          DP3:awayData.dataP3
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

      var info:GameInfoInput;
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      let homeLink = VerticalGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
      let awayLink = VerticalGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
      var aiContent = data.aiContent != null ? self.formatArticle(data):null;

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
        var aiContent = data.aiContent != null ? self.formatArticle(data):null;
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

      if(gameInfo.live){
        inningTitle = gameInfo.inningsPlayed != null ? gameInfo.inningsPlayed +  GlobalFunctions.Suffix(gameInfo.inningsPlayed) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';

      }else{
        if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
          inningTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        }else{
          inningTitle = 'Final';
        }
      }

      info = {
        gameHappened:gameInfo.inningsPlayed != null ?  true : false,
        //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
        inning:inningTitle,
        dataPointCategories:gameInfo.dataPointCategories,
        verticalContent:gameInfo.verticalContent,
        homeData:{
          homeTeamName: homeData.lastName,
          homeImageConfig:link1,
          homeLink: homeLink,
          homeRecord: homeWin +'-'+ homeLoss,
          DP1:homeData.dataP1,
          DP2:homeData.dataP2,
          DP3:homeData.dataP3
        },
        awayData:{
          awayTeamName:awayData.lastName,
          awayImageConfig:link2,
          awayLink: awayLink,
          awayRecord: awayWin +'-'+ awayLoss,
          DP1:awayData.dataP1,
          DP2:awayData.dataP2,
          DP3:awayData.dataP3
        }
      };
      if(teamId != null){
        gameArray.push({game:info,aiContent:aiContent});
      }else{
        gameArray.push({game:info});
      }
    })
    return gameArray;
  }

  formatArticle(data){
    let gameInfo = data.gameInfo;
    let aiContent = data.aiContent;
    var gameArticle = {};
    for(var report in aiContent.featuredReport){
      gameArticle['report'] = "Read The Report";
      gameArticle['headline'] = aiContent.featuredReport[report].displayHeadline;
      gameArticle['articleLink'] = ['Article-pages',{eventType:report,eventID:aiContent.event}];
      var i = aiContent['home']['images'];
      var random1 = Math.floor(Math.random() * i.length);
      var random2 = Math.floor(Math.random() * i.length);
      gameArticle['images'] = [];

      if(random1 == random2){
        gameArticle['images'].push(i[random1]);
      }else{
        gameArticle['images'].push(i[random1]);
        gameArticle['images'].push(i[random2]);
      }
    }
    return gameArticle;
  }

  formatScoreBoard(data){
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
