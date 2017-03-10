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
    }else{
      divisionUrl = 'home';
    }
    if (partner == null || partner == false || GlobalSettings.getHomeInfo().isSubdomainPartner){
      params = '/' + divisionUrl;
    }
    else {
      params = '/' + partner + '/' + divisionUrl;
    }
    var menuData = [
      {
        menuTitle: "Home",
        url: [params]
      },
      {
        menuTitle: division + " Standings",
        url: [params ,'standings']
      },
      {
        menuTitle: division + " Schedule",
        url: [params ,'schedules','league', 'all', 'pregame', '1'] 
      },
      {
        menuTitle: division + " League",
        url: [params ,'league']
      },
      {
        menuTitle: division + " Teams",
        url: [params ,'pick-a-team']
      },
      {
        menuTitle: division + " Player Directory",
        url: [params ,'directory','players','a','page','1']
      }
    ];

    var menuInfo = [{
        menuTitle: "About Us",
        url: [params, 'about-us']
      },
      {
        menuTitle: "Contact Us",
        url: [params, 'contact-us']
      },
      {
        menuTitle: "Disclaimer",
        url: [params, 'disclaimer']
    }];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
