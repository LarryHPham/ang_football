import {Injectable, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from '@angular/router-deprecated';
import {HTTP_PROVIDERS, Http, Response, Headers} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";
import {Observable} from "rxjs/Observable";

import {VerticalGlobalFunctions} from '../global/vertical-global-functions';

@Injectable()

export class FantasyService {
    constructor(public http:Http) {
    };

    getFantasyReport(playerId) {
        var fullUrl = GlobalSettings.getFantasyUrl() + "articles?articleType=player-fantasy&player[]=";
        if (playerId !== undefined) {
            fullUrl += playerId;
        }
        return this.http.get(fullUrl)
            .map(res => res.json())
            .map(data => data.data[0]);
    }
}