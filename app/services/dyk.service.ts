import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class DykService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){}
  setToken(){
    var headers = new Headers();
    return headers;
  }
  // getDykService(profile, id){
  getDykService(profile, id?){
    var headers = this.setToken();
    var fullUrl = this._apiUrl;
    fullUrl = "http://dev-touchdownloyal-api.synapsys.us";
    /*
     http://dev-touchdownloyal-api.synapsys.us/dyk/player/1
     http://dev-touchdownloyal-api.synapsys.us/dyk/league/1
     http://dev-touchdownloyal-api.synapsys.us/dyk/team/1
    */
    fullUrl += "/dyk/"+profile;
    if(id !== undefined){
      fullUrl += "/" + id;
    }
    return this.http.get( fullUrl, {
        headers: headers
      })
      .map(
        res => res.json()
      )
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
