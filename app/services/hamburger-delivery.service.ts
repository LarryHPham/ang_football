import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class HamburgerDeliveryService {
  static createMenu(division){
    var menuData = [{
        menuTitle: "Home",
        url: ['Home-page']
      },
      {
        menuTitle: division + " Teams",
        url: ['Pick-team-page']//todo
      },
      {
        menuTitle: division + " Players",
        url: ['Directory-page-starts-with', {type: "players", startsWith: "a", page: "1"}]//todo
      },
      {
        menuTitle: division + " League",
        url: ['MLB-page']//todo
      },
      {
        menuTitle: division + " Schedule",
        url: ['Schedules-page-league', {pageNum:1}]//todo
      },
      {
        menuTitle: division + " Standings",
        url: ['Standings-page-league', {type: division}]
    }];
    var menuInfo = [{
        menuTitle: "About Us",
        url: ['About-us-page']
      },
      {
        menuTitle: "Contact Us",
        url: ['Contact-us-page']
      },
      {
        menuTitle: "Disclamer",
        url: ['Disclaimer-page']
    }];

    return {menuData: menuData, menuInfo: menuInfo};
  }
}
