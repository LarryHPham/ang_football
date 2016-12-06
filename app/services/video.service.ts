import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers} from "@angular/http";
import { GlobalSettings } from "../global/global-settings";
import { Observable } from "rxjs/Observable";
import { VerticalGlobalFunctions } from '../global/vertical-global-functions';

@Injectable()

export class VideoService {
    constructor(public http:Http) {};

    getVideoBatchService(limit, startNum, pageNum, first,scope, teamID?, state?){
        //Configure HTTP Headers
        let tdlURL;
        if(first==undefined || first==null){
            first=0;
        }

        if(state == null || state == undefined){
            tdlURL = teamID == null || teamID == undefined ? GlobalSettings.getApiUrl() + "/videoBatch/" + scope + '/' + limit + '/' + pageNum : GlobalSettings.getApiUrl() + "/videoBatchTeam/" + scope + '/' + limit + '/' + pageNum + '/' + teamID;
        } else {
            tdlURL = GlobalSettings.getApiUrl() + "/videoBatch/" + scope +'/'+ limit + '/' +pageNum+ '/'+ state;
        }
        return this.http.get(tdlURL)
          .map(res => res.json())
          .map(data => {
              return data;
          })
    }

    transformVideoStack(data){
      data.forEach(function(val, i){val
        val['video_thumbnail'] = val.thumbnail;
        val['keyword'] = val.league;
        val['time_stamp'] = val.pubDate;

        var urlRouteArray = VerticalGlobalFunctions.formatArticleRoute(val.league,"story", val.id);
        val['urlRoute'] = urlRouteArray
      })
      return data;
    }
}
