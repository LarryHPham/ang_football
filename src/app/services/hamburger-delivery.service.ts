import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';



//libraries
declare var moment;



@Injectable()
export class HamburgerDeliveryService {
  static createMenu(division?, partner?){ //TODO
    var params;
    var divisionUrl;
    let route = VerticalGlobalFunctions.getWhiteLabel();
    let currentYear = moment().year();

    if (division != null) {
      divisionUrl = division.toLowerCase();
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
        url: [route, 'home']
      },
      {
        menuTitle: division + " Standings",
        url: [params ,'standings']
      },
      {
        menuTitle: division + " Schedule",
        url: [params ,'schedules','league', currentYear, 'all', '1'] //TODO - hard coded year
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
