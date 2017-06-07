import {Component, Input, Output, EventEmitter} from '@angular/core';
import {GlobalSettings} from '../../global/global-settings';

@Component({
    selector: 'side-scroll-schedules',
    templateUrl: './side-scroll-schedules.module.html',
    outputs: ['count']
})

export class SideScrollSchedule{
  @Input() sideScrollData: any;
  @Input() scrollLength: any;
  @Input() scope:string;
  @Input() scopeDisplayed:string;
  @Input() topScope: any;
  @Output() changeScope = new EventEmitter();

  public count = new EventEmitter();
  public curCount = 0;
  _sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
  _collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
  _collegeDivisionFullAbbrv: string = GlobalSettings.getCollegeDivisionFullAbbrv();

ngOnInit(){}

  counter(event){
    this.curCount = event;
    this.count.next(event);
  }

  scopeChange(selection) {
    this.changeScope.next(selection);
  }
}
