import {Component, Input} from '@angular/core';
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

    ngOnInit() {
    }

    // Page is being scrolled
    onScroll(event) {
        var scrollTop = event.srcElement.body.scrollTop;
        var header = document.getElementById('pageHeader');
        var headerbottom = document.getElementById('header-bottom');
        var widgetContainer = document.getElementById('widgetContainer');
        var widget = document.getElementById('widget');

        if(widgetContainer.getBoundingClientRect().top < headerbottom.offsetHeight){
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

        // var partnerHeight = document.getElementById('partner') != null ? document.getElementById('partner').offsetHeight:0;
        // if( document.getElementById('partner') != null && scrollTop <=  (jQuery('.deep-dive-container1').height() + partnerHeight)){
        //     partnerHeight = partnerHeight + scrollTop;
        // }
        // var blueBar = 0;
        // if (document.getElementById('deep-dive-blueBar') != null){
        //   blueBar = document.getElementById('deep-dive-blueBar').offsetHeight;
        // }
        // var titleHeight = 0;
        // var padding =  document.getElementById('header-bottom').getBoundingClientRect().top + document.getElementById('header-bottom').offsetHeight + 10;
        // var parentElem = document.getElementById('widget').parentElement.getBoundingClientRect().top;
        // var y_buffer = 50;
        // var maxScroll = partnerHeight - scrollTop;
        // var widgetTop = document.getElementById('widget').getBoundingClientRect().top;
        // var carouselTop = jQuery('.deep-dive-container1').height() - scrollTop;
        // if (!this.aiSidekick) {
        //     this.sidekickHeight = 0;
        // } else {
        //     titleHeight = jQuery('.articles-page-title').height();
        //     if (titleHeight == 40) {//
        //         this.sidekickHeight = 95;
        //     } else if (titleHeight == 80) {
        //         this.sidekickHeight = 135;
        //     }
        //     if (maxScroll <= 0) {
        //         this.sidekickHeight += maxScroll;
        //         if (this.sidekickHeight < 0) {
        //             this.sidekickHeight = 0
        //         }
        //     }
        //     y_buffer += this.sidekickHeight;
        // }
        // if(maxScroll <= 0){
        //     maxScroll = 0;
        // }
        // if(carouselTop <=0){
        //   carouselTop = 0;
        // }
        // //this.headerHeight = carouselTop + padding + maxScroll + this.sidekickHeight + 'px';
        // //set class on blue bar and widget once user has scrolled past the carousel and top partner header
        // if (widgetTop <= padding && parentElem < 0) {
        //   jQuery("#widget").addClass("widget-top");
        //   jQuery("#widget").css('margin-top',padding);
        // }
        // else {
        //   jQuery("#widget").css('margin-top',0);
        //   jQuery("#widget").removeClass("widget-top");
        // }
        // var $widget = jQuery("#widget");
        // var $pageWrapper = jQuery(".deep-dive-container2a");
        // if ($widget.length > 0 && $pageWrapper.length > 0) {
        //     var widgetHeight = $widget.height();
        //     var pageWrapperTop = $pageWrapper.offset().top;
        //     var pageWrapperBottom = pageWrapperTop + $pageWrapper.height() - padding;
        //     //logic for when user scrolls to bottom of page
        //     if ((scrollTop + widgetHeight + y_buffer) > (pageWrapperBottom  + this.sidekickHeight)) {
        //         $widget.addClass("widget-bottom");
        //         var diff = $pageWrapper.height() - (widgetHeight + y_buffer);
        //         $widget.get(0).style.top = diff + "px";
        //     }
        //     else if (scrollTop < (pageWrapperTop + this.sidekickHeight)) {
        //         $widget.removeClass("widget-bottom");
        //         $widget.get(0).style.top = "";
        //     }
        //     else {
        //         $widget.removeClass("widget-bottom");
        //         $widget.get(0).style.top = "";
        //     }
        // }
    }
}
