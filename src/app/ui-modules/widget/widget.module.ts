import {Component, Input, ElementRef} from '@angular/core';
import { isBrowser } from 'angular2-universal';

@Component({
    selector: 'widget-module',
    templateUrl: './widget.module.html',
})

export class WidgetModule {
    @Input() aiSidekick:boolean;
    @Input() syndicated:boolean; // DEPRECATED
    @Input() scope:string;// DEPRECATED
    @Input() isProfilePage:boolean;
    isProSport:boolean;
    isBrowser: boolean;

    constructor(){
      this.isBrowser = isBrowser;
    }

    ngOnChanges() {
      if (this.scope) {
        this.isProSport = this.scope == 'nfl';
      }
    }

}
