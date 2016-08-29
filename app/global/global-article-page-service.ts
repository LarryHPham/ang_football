import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";

@Injectable()

export class ArticleDataService {

    constructor(public http:Http) {
    }

    getArticle(eventID, eventType, partnerId) {
        var fullUrl = GlobalSettings.getArticleUrl();
        //having the query string is only temporary until the partner site link issue is figured out.
        return this.http.get(fullUrl + "articles?articleType=" + eventType + '&event=' + eventID + "?partnerId=" + partnerId)
            .map(res => res.json())
            .map(data => data);
    }

    getArticleData(url) {
        return this.http.get(url)
            .map(res => res.json())
            .map(data => data);
    }

    getRecommendationsData(eventID, eventType) {
        var fullUrl = GlobalSettings.getRecommendUrl();
        return this.http.get(fullUrl + "articles?articleType=" + eventType + '&event=' + eventID)
            .map(res => res.json())
            .map(data => data);
    }

    getTrendingData() {
        var fullUrl = GlobalSettings.getTrendingUrl();
        return this.http.get(fullUrl)
            .map(res => res.json())
            .map(data => data);
    }
}