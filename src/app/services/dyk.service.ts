import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

//globals
import { GlobalSettings } from '../global/global-settings';
import {ModelService} from "../global/shared/model/model.service";

@Injectable()
export class DykService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public model: ModelService){}
  getDykService(profile, id?){
    var fullUrl = this._apiUrl;
    fullUrl += "/dyk/"+profile;
    if(id !== undefined){
      fullUrl += "/" + id;
    }
    return this.model.get( fullUrl)
      .map(
        data => {
          return data.data;
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }//getDykService ends

}//DykService ENDS
