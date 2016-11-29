import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class HamburgerDeliveryService {
  static createMenu(division?, partner?){ //TODO
    var params;
    var divisionUrl;
    if (division != null) {
      divisionUrl = division.toLowerCase();
    }
    if (partner == null || partner == false || GlobalSettings.getHomeInfo().isSubdomainPartner){
      params = '/' + divisionUrl;
    }
    else {
      params = '/' + divisionUrl +'/'+ partner;
    }
    var menuData = [{
        menuTitle: "Home",
        url: [params]
      },
      {
        menuTitle: division + " Standings",
        url: [params ,'standings']
      },
      {
        menuTitle: division + " Schedule",
        url: [params ,'schedules','league','all','1']
      },
      {
        menuTitle: division + " League",
        url: [params ,'league']
      },
      {
        menuTitle: division + " Teams",
        url: [params ,'Pick-team-page']//todo
      },
      {
        menuTitle: division + " Player Directory",
        url: [params ,'directory','players','a','page','1']
      }
      ];
    var menuInfo = [{
        menuTitle: "About Us",
        url: ['/about-us']
      },
      {
        menuTitle: "Contact Us",
        url: ['/contact-us']
      },
      {
        menuTitle: "Disclaimer",
        url: ['/disclaimer']
    }];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
