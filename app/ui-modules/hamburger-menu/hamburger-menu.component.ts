import {Component, Input, OnInit} from '@angular/core';
import {GlobalSettings} from "../../global/global-settings";
import {HamburgerDeliveryService} from '../../services/hamburger-delivery.service';

export interface MenuData{
  menuTitle: string,
  url: any,
}

@Component({
    selector: 'hamburger-menu-component',
    templateUrl: './app/ui-modules/hamburger-menu/hamburger-menu.component.html',
})

export class HamburgerMenuComponent implements OnInit {
  // @Input() partnerID:string;
  // @Input() scope: string;
  // public menuData: any;
  // public menuInfo: any;
  // public _sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv().toUpperCase();
  // public _collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv().toUpperCase();
  // public _collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv().toUpperCase();
  // public menuInfoHeader: string = "Company Info";
  // public isHome:any;
  // constructor(){
  //   this.isHome = GlobalSettings.getHomeInfo().isHome;
  // }
  ngOnInit(){
  //   this.scope = this.scope.toUpperCase();
  //   if (this.scope == this._collegeDivisionAbbrv) {this.scope = this._collegeDivisionFullAbbrv;}
  //   this.changeActiveLeague(this.scope);
  }//ngOnInit ends
  // loadData(division) {
  //   var data = HamburgerDeliveryService.createMenu(division, this.partnerID);
  //   this.menuData = data.menuData;
  //   this.menuInfo = data.menuInfo;
  // }//loadData ends
  // changeActiveLeague(division){
  //   this.loadData(division);
  //   var buttons = document.getElementsByClassName("hamburger-division-select-button");
  //   var i;
  //   for (i = 0; i < buttons.length; i++) {
  //       buttons[i].classList.remove("active");
  //       if (buttons[i].innerHTML.trim() == division.trim()) {
  //         buttons[i].classList.add("active");
  //       }
  //   }
  // }
}
