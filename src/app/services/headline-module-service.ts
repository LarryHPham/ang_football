import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { GlobalSettings } from "../global/global-settings";
import { ModelService } from '../global/shared/model/model.service';

@Injectable()

export class HeadlineDataService {

    constructor(public http:Http, public model: ModelService) {}

    getAiHeadlineData(scope, teamID) {
        var fullUrl = GlobalSettings.getHeadlineUrl();
        return this.model.get(fullUrl + 'headlines?scope=' + scope + '&team=' + teamID)
            .map(data => data);
    }

    getAiHeadlineDataLeague(count, scope) {
        if(count == null){
            count = 10;
        }
        var fullUrl = GlobalSettings.getArticleUrl();
        return this.model.get(fullUrl + "articles?page=1&count=" + count + "&scope="+scope+"&articleType=postgame-report")
            .map(data => data);
    }
    //TODO temporary until api is created
    getAiTrendingData(count, scope) {
        if(count == null){
            count = 10;
        }
        var fullUrl = GlobalSettings.getTrendingUrl();
        return this.model.get(fullUrl + "articles?page=1&count=" + count + "&scope="+scope+"&articleType=postgame-report")
            .map(data => data);
    }
}
