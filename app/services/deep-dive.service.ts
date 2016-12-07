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
    public http: Http
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
          return data.data;
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
           var transformedData = this.carouselTransformData(data);
           callback(transformedData);
         })

     }

   carouselTransformData(arrayData){
        var transformData = [];
        arrayData.forEach(function(val,index){
          var curdate = new Date();
          var curmonthdate = curdate.getDate();
          var date = GlobalFunctions.sntGlobalDateFormatting(Number(val.publishedDate),"timeZone");

          let urlRouteArray;
          urlRouteArray = VerticalGlobalFunctions.formatArticleRoute(val.league, 'story', val.id);

          let carData = {
            image_url: GlobalSettings.getImageUrl(val['imagePath']),
            title:  "<span> Today's News </span>",
            headline: val['title'],
            keyword: val['keyword'],
            keywords: val['keyword'],
            keyUrl: urlRouteArray,
            teaser: val['teaser'].substr(0,200).replace('_',': ').replace(/<p[^>]*>/g, ""),
            id:val['id'],
            articlelink: urlRouteArray,
            date: date,
          };
          transformData.push(carData);
        });

        return transformData;
    }

    transformToAiArticleRow(data){
      data = data.data;
      var sampleImage = "/app/public/placeholder_XL.png";
      var articleStackArray = [];

      data.forEach(function(val, index){
        let urlRouteArray;
        if(val.last_updated){
          var date =  moment.unix(val.last_updated);
          date = '<span class="hide-320">' + date.format('dddd') + ', </span>' + date.format('MMM') + date.format('. DD, YYYY');
        }
        let articleType = val.article_sub_type == null ? val.article_type : val.article_sub_type;
        let routeScope = val.scope == 'fbs' ? 'ncaaf' : 'nfl';
        if(val.event_id){
          urlRouteArray = VerticalGlobalFunctions.formatArticleRoute(routeScope, articleType, val.event_id);//TODO PARTNER
        }else{
          urlRouteArray = [val.article_url];
        }
        var s = {
            articleUrl: urlRouteArray,
            keyword: val.article_type.replace('-', ' ').toUpperCase(),
            timeStamp: val.last_updated ? date : null,
            title: val.title,
            author: val.author != null ? "<span style='font-weight: 400;'>By</span> " + val.author : "",
            publisher: val.publisher != null ? "Published By: " + val.publisher : "",
            teaser: val.title,
            keyUrl: urlRouteArray,
            imageConfig: {
              imageClass: "embed-responsive embed-responsive-16by9",
              imageUrl: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url) : sampleImage,
              urlRouteArray: urlRouteArray
            }
        };
        articleStackArray.push(s);
      });

      return articleStackArray;
    }

    transformToArticleStack(articles){
      var sampleImage = "https://images.synapsys.us/TDL/stock_images/TDL_Stock-3.png";
      var articleArray = [];
      articles.forEach(function(val){
        let date = val.publishedDate != null ? GlobalFunctions.sntGlobalDateFormatting(Number(val.publishedDate),"timeZone") : null;
        let limitDesc = val.teaser.substring(0, 360);;

        let routeScope = val.league == 'fbs' ? 'ncaaf' : 'nfl';
        let urlRouteArray = VerticalGlobalFunctions.formatArticleRoute(routeScope, 'story', val.id);//TODO PARTNER

        var articleStackData = {
            articleUrl: urlRouteArray,
            keyword: val.keyword.replace('-', ' '),
            timeStamp: date,
            title: val.title,
            author: val.author != null ? "<span style='font-weight: 400;'>By</span> " + val.author : "",
            publisher: val.publisher != null ? "Published By: " + val.publisher : "",
            teaser: limitDesc,
            keyUrl: urlRouteArray,
            imageConfig: {
              imageClass: "embed-responsive embed-responsive-16by9",
              imageUrl: val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage,
              urlRouteArray: urlRouteArray
            }
        };
        articleArray.push(articleStackData);
      });

      return articleArray;
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
          let urlRouteArray = VerticalGlobalFunctions.formatArticleRoute(val.subCategory,val.keyword, info.event_id);//TODO PARTNER
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
        val["newsRoute"] = VerticalGlobalFunctions.formatArticleRoute('nfl',"story", val.id);//TODO
        //}
      })
      return data;
    }

    transformVideoStack(data){
      data.forEach(function(val, i){
        var urlRouteArray = VerticalGlobalFunctions.formatArticleRoute('nfl',"video", val.id);//TODO PARTNER
        val['keyword'] = val.league.toUpperCase();
        val['video_thumbnail'] = val.thumbnail;
        val['embed_url'] = val.videoLink;
        val['teaser'] = val.description;
        val['time_stamp'] = GlobalFunctions.sntGlobalDateFormatting(moment(val.pubDate).unix()*1000,'timeZone');
        val['urlRoute'] = urlRouteArray;
        val['video_url'] = urlRouteArray;
      })
      return data;
    }

    transformTileStack(data, scope) {
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
      let routeScope = scope.toLowerCase() == 'home' ? 'nfl' : 'ncaaf';
      var lines = ['Find Your <br> Favorite Player', 'Find Your <br> Favorite Team', 'Check Out The Latest <br> With the ' + scopeDisplay];
      let pickATeam = ['/'+routeScope,'pick-a-team'];
      let leaguePage = ['/'+routeScope,'league'];
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
