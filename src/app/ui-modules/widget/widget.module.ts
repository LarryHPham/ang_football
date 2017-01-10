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
    isBrowser: boolean;

    constructor(){
      this.isBrowser = isBrowser;
      console.log('WidgetModule',this.isBrowser);
    }

}
