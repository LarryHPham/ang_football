import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";

@Injectable()

export class HeadlineDataService {

    constructor(public http:Http) {}

    getAiHeadlineData(scope, teamID) {
        var fullUrl = GlobalSettings.getHeadlineUrl();
        return this.http.get(fullUrl + 'headlines?scope=' + scope + '&team=' + teamID)
            .map(res => res.json())
            .map(data => data);
    }

    getAiHeadlineDataLeague(count, scope) {
        if(count == null){
            count = 10;
        }
        var fullUrl = GlobalSettings.getArticleUrl();
        return this.http.get(fullUrl + "articles?page=1&count=" + count + "&scope="+scope+"&articleType=postgame-report")
            .map(res => res.json())
            .map(data => data);
    }
    //TODO temporary until api is created
    getAiTrendingData(count, scope) {
        if(count == null){
            count = 10;
        }
        var fullUrl = GlobalSettings.getTrendingUrl();
        return this.http.get(fullUrl + "articles?page=1&count=" + count + "&scope="+scope+"&articleType=postgame-report")
            .map(res => res.json())
            .map(data => data);
    }
}
