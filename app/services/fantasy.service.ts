import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";

import {VerticalGlobalFunctions} from '../global/vertical-global-functions';

@Injectable()

export class FantasyService {
    constructor(public http:Http) {
    };

    getFantasyReport(playerId) {
        var fullUrl = GlobalSettings.getFantasyUrl() + "articles?articleType=player-fantasy&scope=nfl&player[]=";
        if (playerId !== undefined) {
            fullUrl += playerId;
        }
        return this.http.get(fullUrl)
            .map(res => res.json())
            .map(data => data.data[0]);
    }
}