import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';

declare var moment;

@Injectable()
export class DeepDiveService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  private _articleUrl: string = GlobalSettings.getArticleDataUrl();
  private _tcxArticleUrl: string = GlobalSettings.getTcxArticleUrl();

  constructor(
    public http: Http,
  ){}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getDeepDiveArticleService(articleID){
  //Configure HTTP Headers
  var headers = this.setToken();
  var callURL = this._apiUrl + '/article/' + articleID;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }
  getDeepDiveVideoService(articleID){
    //Configure HTTP Headers
    var headers = this.setToken();
    var callURL = this._apiUrl + '/videoSingle/' + articleID;
    return this.http.get(callURL, {headers: headers})
        .map(res => res.json())
        .map(data => {
            return data;
        })
  }

  getDeepDiveBatchService(scope, limit, startNum, state?){

    //Configure HTTP Headers
      startNum = startNum == null ? 1 : startNum;
      state = state === null || typeof state == 'undefined' ? 'CA' : state;

      var headers = this.setToken();
      // http://dev-touchdownloyal-api.synapsys.us/articleBatch/nfl/5/1
      var callURL = this._apiUrl + '/articleBatch/';

      scope = scope == 'home' ? 'football' : scope;
      if(scope == 'nfl' || scope == null || scope == 'football'){
        callURL +=  scope + '/' + limit + '/' + startNum + '/' + state;
      }else{
          scope = 'fbs';
          callURL += scope + '/' + limit + '/' + startNum ;
      }

      return this.http.get(callURL, {headers: headers})
        .map(res => res.json())
        .map(data => {
          return data;
        })
    }


    getDeepDiveVideoBatchService(scope, limit, startNum, state?){
    //Configure HTTP Headers
    var headers = this.setToken();
    if(startNum == null){
      startNum = 1;
    }
    if(state == null){//make sure it comes back as a string of null if nothing is returned or sent to parameter
      state = 'null';
    }
    var callURL = this._apiUrl + '/videoBatch/';
    scope = scope == 'home' ? 'football' : scope;
    if(scope != null){
      callURL += scope;
    } else {
      callURL += 'football';
    }
    callURL += '/' + limit + '/' + startNum;
    if(state != null){//make sure it comes back as a string of null if nothing is returned or sent to parameter
      callURL += '/' + state;
    }
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      })
    }

    getDeepDiveAiBatchService(scope, key?, page?, count?, state?){
      //Configure HTTP Headers
      var headers = this.setToken();
      scope = scope === null || scope == 'home' ? 'nfl' : scope;
      key = key === null || typeof key == 'undefined' ? 'postgame-report' : key;
      var callURL = this._tcxArticleUrl + 'articles?articleType=' + key + '&scope=' + scope;
      callURL += '&page=' + page + '&count=' + count + '&state=' + state + '&metaDataOnly=1';
      return this.http.get(callURL, {headers: headers})
        .map(res => res.json())
        .map(data => {
          return data;
        })
    }

    getAiArticleData(state){
      var headers = this.setToken();
      //this is the sidkeick url
      var callURL = this._articleUrl + "sidekick-regional/"+ state +"/1/1";
      return this.http.get(callURL, {headers: headers})
        .map(res => res.json())
        .map(data => {
          return data;
        });
    }

    getRecArticleData(scope, state, batch, limit){
      var headers = this.setToken();
      if(scope == null || scope == 'home'){
        scope = 'NFL';
      }
      if(state == null || state == undefined){
        state = 'CA';
      }
      if(batch == null || limit == null){
        batch = 1;
        limit = 1;
      }
      //this is the sidkeick url
      var callURL = this._articleUrl + "sidekick-regional?scope=" + scope + "&region=" + state + "&index=" + batch + "&count=" + limit;
      return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
    }

    getCarouselData(scope, data, limit, batch, state, callback:Function) {
      //always returns the first batch of articles
         this.getDeepDiveBatchService(scope, limit, batch, state)
         .subscribe(data=>{
           var transformedData = this.carouselTransformData(data.data);
           callback(transformedData);
         })

     }

   carouselTransformData(arrayData){
        var transformData = [];
        arrayData.forEach(function(val,index){
          var curdate = new Date();
          var curmonthdate = curdate.getDate();
          var date = GlobalFunctions.sntGlobalDateFormatting(Number(val.publishedDate),"timeZone");

          var relPath = GlobalSettings.getRouteFullParams().relPath;
          let domainHostName;
          let urlRouteArray;
          let domainParams = {}

          domainHostName = GlobalSettings.getRouteFullParams().domainHostName;
          if(GlobalSettings.getRouteFullParams().domainParams.partner_id != null){
            domainParams['partner_id'] = GlobalSettings.getRouteFullParams().domainParams.partner_id;
          }
          domainParams['scope'] = val.league == 'fbs' ? 'ncaaf' : val.league;
          urlRouteArray = [relPath+domainHostName,domainParams,'Article-pages', {eventType: 'story', eventID: val.id}];

          let carData = {
            image_url: GlobalSettings.getImageUrl(val['imagePath']),
            title:  "<span> Today's News </span>" + val['title'],
            keyword: val['keyword'],
            teaser: val['teaser'].substr(0,200).replace('_',': ').replace(/<p[^>]*>/g, ""),
            id:val['id'],
            articlelink: urlRouteArray,
            date: date,
          };
          transformData.push(carData);
        });

        return transformData;
    }

    transformToArticleRow(data){
      var sampleImage = "/app/public/placeholder_XL.png";
      var articleStackArray = [];
      data = data.data.slice(1,9);
      data.forEach(function(val, index){
        var relPath = GlobalSettings.getRouteFullParams().relPath;
        let domainHostName;
        let urlRouteArray;
        let domainParams = {}

        domainHostName = GlobalSettings.getRouteFullParams().domainHostName;
        if(GlobalSettings.getRouteFullParams().domainParams.partner_id != null){
          domainParams['partner_id'] = GlobalSettings.getRouteFullParams().domainParams.partner_id;
        }
        domainParams['scope'] = val.league == 'fbs' ? 'ncaaf' : val.league;
        urlRouteArray = [relPath+domainHostName,domainParams,'Article-pages', {eventType: 'story', eventID: val.id}];
        var date = GlobalFunctions.sntGlobalDateFormatting(Number(val.publishedDate),"dayOfWeek");

        var s = {
            stackRowsRoute: urlRouteArray,
            keyword: val.keyword.replace('-', ' '),
            publishedDate: date,
            provider1: val.author != null ? val.author : "",
            provider2: val.publisher != null ? "Published By: " + val.publisher : "",
            description: val.title,
            images:  val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage,
            imageConfig: {
              imageClass: "image-100x56",
              imageUrl: val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage,
              /*hoverText: "View",*/
              urlRouteArray: urlRouteArray
            }
        }
        articleStackArray.push(s);
      });
      return articleStackArray;
    }
    transformToAiArticleRow(data){
      data = data.data;
      var sampleImage = "/app/public/placeholder_XL.png";
      var articleStackArray = [];

      data.forEach(function(val, index){
        var relPath = GlobalSettings.getRouteFullParams().relPath;
        let domainHostName;
        let urlRouteArray;
        let domainParams = {}
        if(val.last_updated){
          var date =  moment.unix(val.last_updated);
          date = '<span class="hide-320">' + date.format('dddd') + ', </span>' + date.format('MMM') + date.format('. DD, YYYY');
        }
        domainHostName = GlobalSettings.getRouteFullParams().domainHostName;
        if(GlobalSettings.getRouteFullParams().domainParams.partner_id != null){
          domainParams['partner_id'] = GlobalSettings.getRouteFullParams().domainParams.partner_id;
        }
        domainParams['scope'] = val.scope == 'fbs' ? 'ncaaf' : val.scope;
        let articleType = val.article_sub_type == null ? val.article_type : val.article_sub_type;
        urlRouteArray = [relPath+domainHostName,domainParams,'Article-pages', {eventType: articleType, eventID: val.event_id}];

        var s = {
            stackRowsRoute: urlRouteArray,
            keyword: val.article_type.replace('-', ' ').toUpperCase(),
            publishedDate: val.last_updated ? date : null,
            provider1: '',
            provider2: '',
            description: val.title,
            imageConfig: {
            imageClass: "image-100x56",
            imageUrl: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,
            urlRouteArray: urlRouteArray
            }
        }
        articleStackArray.push(s);
      });

      return articleStackArray;
    }

    transformToArticleStack(data){
      var sampleImage = "/app/public/placeholder_XL.png";
      var topData = data.data[0];
      var date = topData.publishedDate != null ? GlobalFunctions.sntGlobalDateFormatting(Number(topData.publishedDate),"defaultDate") : null;
      var limitDesc = topData.teaser.substring(0, 360);//provided by design to limit characters

      var relPath = GlobalSettings.getRouteFullParams().relPath;
      let domainHostName;
      let urlRouteArray;
      let domainParams = {}

      domainHostName = GlobalSettings.getRouteFullParams().domainHostName;
      if(GlobalSettings.getRouteFullParams().domainParams.partner_id != null){
        domainParams['partner_id'] = GlobalSettings.getRouteFullParams().domainParams.partner_id;
      }
      domainParams['scope'] = topData.league == 'fbs' ? 'ncaaf' : topData.league;

      urlRouteArray = [relPath+domainHostName,domainParams,'Article-pages', {eventType: 'story', eventID: topData.id}];

      var articleStackData = {
          articleStackRoute: urlRouteArray,
          keyword: topData.keyword.replace('-', ' '),
          date: date != null ? GlobalFunctions.sntGlobalDateFormatting(date, 'dayOfWeek') : "",
          headline: topData.title,
          provider1: topData.author != null ? "<span style='font-weight: 400;'>By</span> " + topData.author : "",
          provider2: topData.publisher != null ? "Published By: " + topData.publisher : "",
          description: limitDesc,
          imageConfig: {
            imageClass: "image-320x180",
            imageUrl: topData.imagePath != null ? GlobalSettings.getImageUrl(topData.imagePath) : sampleImage,
            urlRouteArray: urlRouteArray
          }
      };
      return articleStackData;
    }

    transformToRecArticles(data){
      data = data.data;
      var sampleImage = "/app/public/placeholder_XL.png";

      var articleStackArray = [];
      var articles = [];
      var eventID = null;
      for(var obj in data){
        if(obj != "meta-data" && obj != "timestamp"){
          var a = {
            keyword: obj,
            info: data[obj]
          };
          articles.push(a);
        }
      }
        //In the event there are not 3 articles for this section then hide it.
        if (articles.length <= 2) {
            return
        }
      articles.forEach(function(val){
          var info = val.info;
          var date = GlobalFunctions.sntGlobalDateFormatting(Number(info.last_updated) * 1000, "dayOfWeek");
          var relPath = GlobalSettings.getRouteFullParams().relPath;
          let domainHostName;
          let urlRouteArray;
          let domainParams = {};
          domainHostName = GlobalSettings.getRouteFullParams().domainHostName;
          if (GlobalSettings.getRouteFullParams().domainParams.partner_id != null) {
              domainParams['partner_id'] = GlobalSettings.getRouteFullParams().domainParams.partner_id;
          }
          domainParams['scope'] = GlobalSettings.getRouteFullParams().domainParams.scope == 'home' ? 'nfl' : GlobalSettings.getRouteFullParams().domainParams.scope;
          urlRouteArray = [relPath + domainHostName, domainParams, 'Article-pages', {
              eventType: val.keyword,
              eventID: info.event_id
          }];

          var s = {
              urlRouteArray: urlRouteArray ? urlRouteArray : null,
              eventID: info.event_id,
              eventType: val.keyword,
              images: info.image_url != null ? GlobalSettings.getImageUrl(info.image_url) : sampleImage,
              keyword: val.keyword.replace('-', ' ').toUpperCase(),
              date: date,
              title: info.title,
          };
          articleStackArray.push(s);
      });

      return articleStackArray;
    }

    transformTrending (data, currentArticleId) {
      data.forEach(function(val,index){
        //if (val.id != currentArticleId) {
        val["date"] = GlobalFunctions.sntGlobalDateFormatting(Number(val.dateline),"timeZone");
        val["imagePath"] = GlobalSettings.getImageUrl(val.imagePath);
        val["newsRoute"] = VerticalGlobalFunctions.formatArticleRoute("story", val.id);
        //}
      })
      return data;
    }

    transformVideoStack(data){
      data.forEach(function(val, i){
        var relPath = GlobalSettings.getRouteFullParams().relPath;
        let domainHostName;
        let urlRouteArray;
        let domainParams = {};

        domainHostName = GlobalSettings.getRouteFullParams().domainHostName;
        if(GlobalSettings.getRouteFullParams().domainParams.partner_id != null){
          domainParams['partner_id'] = GlobalSettings.getRouteFullParams().domainParams.partner_id;
        }
        domainParams['scope'] = val.league == 'fbs' ? 'ncaaf' : val.league;

        urlRouteArray = [relPath+domainHostName,domainParams,'Article-pages', {eventType:'video', eventID:val.id}];
        val['urlRoute'] = urlRouteArray
      })
      return data;
    }

    transformTileStack(data, scope) {
      data = data.data;
      if(scope == null){
        scope = 'NFL';
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

      let scopeDisplay = scope.toUpperCase() == 'HOME' ? 'NFL': scope.toUpperCase();

      var lines = ['Find Your <br> Favorite Player', 'Find Your <br> Favorite Team', 'Check Out The Latest <br> With the ' + scopeDisplay];
      let pickATeam = [relPath+domainHostName, domainParams,'Pick-team-page'];
      let leaguePage = [relPath+domainHostName, domainParams,'League-page'];
      var tileLink = [pickATeam, pickATeam, leaguePage];
      var dataStack = [];
      // create array of imagePaths
      var imagePaths = [];
      for (var i=0; i<data.length; i++) {
        imagePaths.push(data[i].imagePath);
      }
      // remove duplicates from array
      var imagePaths = imagePaths.filter( function(item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      });


      for(var i = 0; i < 3; i++){
        var k = imagePaths[Math.floor(Math.random() * imagePaths.length)];
        var indexOfK = imagePaths.indexOf(k);
        dataStack[i] = data[i];
        dataStack[i]['lines'] = lines[i];
        dataStack[i]['tileLink'] = tileLink[i];
        dataStack[i]['image_url'] = GlobalSettings.getImageUrl(k) != null ? GlobalSettings.getImageUrl(k) : "/app/public/placeholder_XL.png";
        // remove appended image string from array
        imagePaths.splice(indexOfK,1);
      }
      return dataStack;
    }
}
