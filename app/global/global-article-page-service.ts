import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";

@Injectable()

export class ArticleDataService {

    constructor(public http:Http) {
    }

    getArticle(eventID, eventType, partnerId, scope, isFantasyReport) {
        var fullUrl = GlobalSettings.getArticleUrl();
        //having the query string is only temporary until the partner site link issue is figured out.
        if (!isFantasyReport) {
            return this.http.get(fullUrl + "articles?" + eventType + '&event=' + eventID + "&partner=" + partnerId + "&scope=" + scope)
                .map(res => res.json())
                .map(data => data);
        } else {
            return this.http.get(fullUrl + "articles?" + eventType + '&articleID=' + eventID + "&partner=" + partnerId + "&scope=" + scope)
                .map(res => res.json())
                .map(data => data);
        }
    }

    getArticleData(url) {
        return this.http.get(url)
            .map(res => res.json())
            .map(data => data);
    }

    getRecommendationsData(eventID, scope) {
        var fullUrl = GlobalSettings.getRecommendUrl();
        return this.http.get(fullUrl + "articles?&event=" + eventID + "&scope=" + scope + "&count=10")
            .map(res => res.json())
            .map(data => data);
    }
}
