import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { GlobalSettings } from '../global/global-settings';
import { GlobalFunctions } from '../global/global-functions';
import { Link } from '../global/global-interface';
import { ModelService } from '../global/shared/model/model.service';


@Injectable()
export class FooterService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public model: ModelService){}

  getFooterService(scope: string, profile: string){
    var fullUrl = GlobalSettings.getApiUrl();//TODO
    fullUrl += "/footer";
    var footerScope = scope == 'ncaaf' ? 'fbs' : scope;
    if(scope !== undefined){
      fullUrl += "/" + footerScope;
      if(profile !== undefined){
        fullUrl += "/" + profile;
      }
    }
    return this.model.get(fullUrl)
      .map(
        data => {
          return this.footerData(data.data, scope, profile);
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }

  footerData(data, scope: string, profile: string): Array<Link>{
    scope = scope.toLowerCase();
    var navigationArray: Array<Link> = [];
    //Build alphabet array for navigation links
    var currentScope = scope.toLowerCase();
    for ( var i in data ) {
      var text = i.toUpperCase();
      navigationArray.push({
        text: text,
        active: data[i],
        route: ['/'+scope,'directory',profile+'s', text, 'page', 1]
      });
    }
    return navigationArray;
    }
}
