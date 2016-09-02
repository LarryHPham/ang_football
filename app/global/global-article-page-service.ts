import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";

@Injectable()

export class ArticleDataService {

    constructor(public http:Http) {
    }

    getArticle(eventID, eventType, partnerId, scope) {
        var fullUrl = GlobalSettings.getArticleUrl();
        //having the query string is only temporary until the partner site link issue is figured out.
        return this.http.get(fullUrl + "articles?articleType=" + eventType + '&event=' + eventID + "?partnerId=" + partnerId + "&affiliation=" + scope)
            .map(res => res.json())
            .map(data => data);
    }

    getArticleData(url) {
        return this.http.get(url)
            .map(res => res.json())
            .map(data => data);
    }

    getRecommendationsData(eventID, eventType, scope) {
        var fullUrl = GlobalSettings.getRecommendUrl();
        return this.http.get(fullUrl + "articles?articleType=" + eventType + '&event=' + eventID + "&affiliation=" + scope)
            .map(res => res.json())
            .map(data => data);
    }
}