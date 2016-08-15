import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class TwitterService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){}
  setToken(){
    var headers = new Headers();
    return headers;
  }
  // getTwitterService(profile, id){
  getTwitterService(profile, id?, scope?){
    var headers = this.setToken();
    var fullUrl = this._apiUrl;
    fullUrl += "/"+profile+"/twitterInfo";
    var newUrl = "http://dev-touchdownloyal-api.synapsys.us/twitter/"+profile+"/"+scope;


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
  }//getTwitterService ends
}//TwitterService ENDS
