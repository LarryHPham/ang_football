import {Component, Input, ElementRef} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {GlobalSettings} from "../../global/global-settings";

declare var jQuery:any;

@Component({
    selector: 'widget-carousel-module',
    templateUrl: './app/ui-modules/widget/widget.module.html',
})

export class WidgetCarouselModule {
    @Input() aiSidekick:boolean;
    widgetPadding:string = '0px';
    private _elRef: any;
    constructor(elementRef: ElementRef){
      this._elRef = elementRef;
    }
    ngOnInit() {
    }

    // Page is being scrolled
    onScroll(event) {
        var scrollTop = event.srcElement.body.scrollTop; //find the current scroll of window from top of page
        var header = this._elRef.nativeElement.ownerDocument.getElementById('pageHeader'); // grab the height of the entire header
        var headerbottom = this._elRef.nativeElement.ownerDocument.getElementById('header-bottom'); // grab the bottom piece of the header that sticks on scroll
        var widgetContainer = this._elRef.nativeElement.ownerDocument.getElementById('widgetContainer');// grab the container that the widget lives in
        var widget = this._elRef.nativeElement.ownerDocument.getElementById('widget');// grab the actual widget so we can add the fixed classed to it
        let widgetFixed = this._elRef.nativeElement.ownerDocument.getElementsByClassName('fixedWidget')[0]; // if the fixedWidget class exist grab it to be used

        //set the scroll height that the widget needs to meet before sticking
        let scrollAmount = widgetContainer.getBoundingClientRect().top;
        if(widgetFixed){// if the widget is already fixed then be sure to add the header height when scrolling up
          scrollAmount = scrollAmount - header.offsetHeight;
        }

        //if the scroll amount reaches the sticky header then add padding in place of the missing header since its fixed and determine if a fixedWidget class needs to be added of not
        if(scrollAmount < headerbottom.offsetHeight){
          if(header.getBoundingClientRect().top >= 0){
            this.widgetPadding = header.offsetHeight + 10 + 'px';
          }else{
            this.widgetPadding = headerbottom.offsetHeight + 10 + 'px';
          }
          widget.classList.add('fixedWidget');
        }else{
          this.widgetPadding = '0px';
          widget.classList.remove('fixedWidget');
        }
    }
}
