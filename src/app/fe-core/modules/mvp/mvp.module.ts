import {Component, OnChanges, Output, Injectable, EventEmitter, Input} from '@angular/core';

//interfaces
import { ModuleFooterData } from '../../components/module-footer/module-footer.component';
import { ModuleHeaderData } from '../../components/module-header/module-header.component';
import { MVPTabData } from '../../components/mvp-list/mvp-list.component';



@Component({
  selector: 'mvp-module',
  templateUrl: './app/fe-core/modules/mvp/mvp.module.html'
})

export class MVPModule implements OnChanges {
  @Output() tabSelectedListener = new EventEmitter();
  @Output() dropdownPositionSelection = new EventEmitter();

  @Input() mvpData: Array<MVPTabData>;
  @Input() title: string;
  @Input() query: any;
  @Input() filter1: any;

  @Input() collegeDivisionAbbrv: string;
  @Input() collegeDivisionFullAbbrv: string;
  @Input() positionNameDisplay: string;

  modHeadData: ModuleHeaderData;
  footerData: ModuleFooterData;
  tabKey: string;

  public scope: string;

  ngOnChanges() {
    this.displayData(this.query.scope, this.query.position);
  }

  displayData(scope, position){

    if ( scope == this.collegeDivisionAbbrv.toLowerCase() ) {
      scope = this.collegeDivisionFullAbbrv;
    }
    if ( !position ) {
      position = this.query.position;
    }

    this.modHeadData = {
        moduleTitle: "Most Valuable Players",
        moduleIdentifier: " - "+scope.toUpperCase() + " " + this.positionNameDisplay,
        hasIcon: false,
        iconClass: '',
    };

    var type = this.query.statName.indexOf(position)>=0 ? position : "k";
    var url;

    url = ['MVP-list-tab-page', {
      type: this.query.position,
      tab: this.query.statName,
      pageNum: "1"
    }];

    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW THE LIST',
      url: url
    };
  }

  tabSelected(tab) {
    //OLD from TDL
    //this.displayData(this.query.scope, VerticalGlobalFunctions.convertPositionAbbrv(tab.tab.tabDataKey) );

    this.displayData(this.query.scope, tab.tab.tabDataKey);
    this.tabKey = tab.tab.tabDataKey;
    if (!tab.tab.listData) { //let the page handle the service call if there's no data
      this.tabSelectedListener.next(tab);
    }
    else {}
  }

  dropdownChanged($event) {
    this.displayData(this.query.scope, $event.position );
    this.dropdownPositionSelection.next($event);
  }
}
