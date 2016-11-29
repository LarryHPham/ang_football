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
        url: [params ,'Standings-page']
      },
      {
        menuTitle: division + " Schedule",
        url: [params ,'Schedules-page-league', {pageNum:1, year: "all"}]//todo
      },
      {
        menuTitle: division + " League",
        url: [params ,'League-page']//todo
      },
      {
        menuTitle: division + " Teams",
        url: [params ,'Pick-team-page']//todo
      },
      {
        menuTitle: division + " Player Directory",
        url: [params ,'Directory-page-starts-with', {type: "players", startsWith: "a", page: "1"}]//todo
      }
      ];
    var menuInfo = [{
        menuTitle: "About Us",
        url: ['about-us']
      },
      {
        menuTitle: "Contact Us",
        url: ['contact-us']
      },
      {
        menuTitle: "Disclaimer",
        url: ['disclaimer']
    }];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
