import {Injectable} from '@angular/core';
import {GlobalSettings} from "../global/global-settings";
import {ModelService} from "../global/shared/model/model.service";

@Injectable()

export class FantasyService {
    constructor(public model:ModelService) {
    };

    getFantasyReport(playerId) {
        var fullUrl = GlobalSettings.getFantasyUrl() + "articles?articleType=player-fantasy&scope=nfl&player[]=";
        if (playerId !== undefined) {
            fullUrl += playerId;
        }
        return this.model.get(fullUrl)
            .map(data => data.data[0]);
    }
}
