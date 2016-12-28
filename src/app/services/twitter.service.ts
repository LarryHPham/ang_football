import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

//globals
import { GlobalSettings } from '../global/global-settings';
import {ModelService} from "../global/shared/model/model.service";

@Injectable()
export class TwitterService {

  constructor(public model: ModelService){}

  // getTwitterService(profile, id){
  getTwitterService(profile, id?, scope?){
    var newUrl = GlobalSettings.getApiUrl() + "/twitter/" + profile;

    //if page is team/player or league
    if(id !== undefined){
      newUrl += "/" + id;
    }
    else {
      newUrl += "/" + scope
    }

    return this.model.get( newUrl )
      .map(
        data => {
          return data.data[0];
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }//getTwitterService ends
}//TwitterService ENDS
