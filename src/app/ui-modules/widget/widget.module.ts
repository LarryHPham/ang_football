import {Component, Input} from '@angular/core';
import {Http, Headers} from '@angular/http';
declare var jQuery:any;

@Component({
    selector: 'widget-module',
    templateUrl: './widget.module.html',
})

export class WidgetModule {
    @Input() aiSidekick:boolean;
    @Input() syndicated:boolean;
    @Input() scope:string;
    sidekickHeight:number = 0;
    headerHeight:string;
    isProSport:boolean = true;

    ngOnInit() {

        this.isProSport = this.scope == 'nfl' || this.scope == 'home' ? true: false;
        var titleHeight = jQuery('.articles-page-title').height();
        var padding = document.getElementById('pageHeader').offsetHeight;

        if( document.getElementById('partner') != null){
            var partnerHeight = document.getElementById('partner').offsetHeight;
            padding += partnerHeight;
        }
        if (!this.syndicated && !this.aiSidekick) {
            this.headerHeight = padding + 'px';
        } else {
            if (titleHeight == 40) {
                this.headerHeight = padding + 95 + 'px';
            } else if (titleHeight == 80) {
                this.headerHeight = padding + 135 + 'px';
            }
            else if (titleHeight == 70) {
              this.headerHeight = padding + 128 + 'px';
          }
          else if (titleHeight == 35) {
            this.headerHeight = padding + 102 + 'px';
        }
        }
    }

    // Page is being scrolled
    onScroll(event) {
        var partnerHeight = 0;
        if( document.getElementById('partner') != null){
            partnerHeight = document.getElementById('partner').offsetHeight;
        }
        var titleHeight = 0;
        var pageHeader = document.getElementById('pageHeader').offsetHeight;
        var padding =  document.getElementById('header-bottom').getBoundingClientRect().top + document.getElementById('header-bottom').offsetHeight + 10;
        var parentElem = document.getElementById('widget').parentElement.getBoundingClientRect().top + 10;
        var y_buffer = 23;
        var scrollTop = jQuery(window).scrollTop();
        var maxScroll = (partnerHeight + parentElem) - scrollTop;
        var widgetTop = document.getElementById('widget').getBoundingClientRect().top;
        if (!this.syndicated && !this.aiSidekick) {
            this.sidekickHeight = 0;
        } else {
          titleHeight = jQuery('.articles-page-title').height();
            if (titleHeight == 40) {//
                this.sidekickHeight = 95;
            } else if (titleHeight == 80) {
                this.sidekickHeight = 135;
            }
            else if (titleHeight == 70) {
                this.sidekickHeight = 128;
            }
            else if (titleHeight == 35) {
                this.sidekickHeight = 102;
            }
            if (maxScroll <= 0) {
                this.sidekickHeight += maxScroll;
                if (this.sidekickHeight < 0) {
                    this.sidekickHeight = 0
                }
            }
            y_buffer += this.sidekickHeight;
        }
        if(maxScroll <= 0){
            maxScroll = 0;
        }
        //Logic below is to determine when to add or remove the class that makes the widget on the side Stick to the top using class with fixed position
        if ((document.getElementById('partner') != null && maxScroll == 0 && (parentElem - padding) < 10) || (document.getElementById('partner') == null && widgetTop <= padding && (parentElem - padding) < 10)) {
          if(document.getElementsByClassName('widget-top').length == 0){// add class once
            jQuery("#widget").addClass("widget-top");
          }
          jQuery("#widget").css('margin-top',padding);
        }
        else {
          jQuery("#widget").css('margin-top',0);
          jQuery("#widget").removeClass("widget-top");
        }

        //Logic below is used to stick the widget to bottom of the page and above the footer
        var carContainer = jQuery(".carousel-container").height();
        var $widget = jQuery("#widget");
        var $pageWrapper = jQuery(".widget-page-wrapper");
        if ($widget.length > 0 && $pageWrapper.length > 0) {
            var widgetHeight = $widget.height();
            var pageWrapperTop = $pageWrapper.offset().top;
            var pageWrapperBottom = pageWrapperTop + $pageWrapper.height() - padding;
            if ((scrollTop + widgetHeight + y_buffer) > (pageWrapperBottom + this.sidekickHeight)) {
                this.headerHeight = this.sidekickHeight + 'px';
                $widget.addClass("widget-bottom");
                var diff = $pageWrapper.height() - (widgetHeight + y_buffer);
                $widget.get(0).style.top = diff + "px";
            }
            else if ((scrollTop + carContainer) < (pageWrapperTop + this.sidekickHeight)) {
                $widget.removeClass("widget-bottom");
                $widget.get(0).style.top = "";
            }
            else {
                $widget.removeClass("widget-bottom");
                $widget.get(0).style.top = "";
            }
        }
    }
}
