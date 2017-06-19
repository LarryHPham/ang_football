//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
 *Optimal Length for Search Engines
 *Roughly 155 Characters
 ***/

import { Injectable, Inject } from '@angular/core';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
import { DOCUMENT } from '@angular/platform-browser';
import { isNode, isBrowser } from "angular2-universal";

import { GlobalSettings } from "./global/global-settings";

declare var Zone:any;

@Injectable()
export class SeoService {
  private dom:any;
  private document:any;
  private headElement:HTMLElement;
  private pageUrl:string;
  private metaDescription:HTMLElement;
  private canonicalLink:HTMLElement;
  private themeColor:HTMLElement;
  private DOM:any;
  private metaElement:HTMLElement;
  robots:HTMLElement;

  /**
   * Inject the Angular 2 Title Service
   * @param titleService
   */
  constructor(@Inject(DOCUMENT) document:any) {
    this.DOM = getDOM();
    this.document = document;
    this.headElement = this.document.head;
    // /**
    //  * get the <head> Element
    //  * @type {any}
    //  */
    this.canonicalLink = this.getOrCreateElement('rel', 'canonical', 'link');
  }

  public getPageUrl() {
    this.pageUrl = "";
    if (isNode) {
      this.pageUrl = GlobalSettings._proto + "//" + GlobalSettings._globalSiteUrl + Zone.current.get('requestUrl');
    } else {
      this.pageUrl = window.location.href;
    }
    return this.pageUrl;
  } //getPageUrl


  //sets title to at least less than 50 characters and will choose the  first 3 words and append site name at end
  public setTitle(newTitle:string) {
    let splitTitle = newTitle.split(' ');
    let shortTitle;
    if (splitTitle.length > 3) {
      splitTitle = splitTitle.splice(0, 3);
      shortTitle = splitTitle.join(' ') + '...';
    } else {
      shortTitle = splitTitle.join(' ');
    }
    this.document.title = shortTitle;
  }

  // //incase we dont want the base title to be in head title tag
  // public setTitleNoBase(title:string) {
  //     this.setTitle(title);
  // };

  public setMetaDescription(description:string) {
    if (SeoService.checkData(description)) {
      let truncatedDescription;
      if (description) {
        truncatedDescription = description;
        if (truncatedDescription.length > 167) {
          truncatedDescription = truncatedDescription.substring(0, 167);
          truncatedDescription += '...';
        }
      } else {
        truncatedDescription = '';
      }
      this.metaDescription = this.getOrCreateElement('name', 'description', 'meta');
      this.setElementAttribute(this.metaDescription, 'content', truncatedDescription);
    }
  }

  public setCanonicalLink() {
    let canonicalUrl = this.getPageUrl();
    this.setElementAttribute(this.canonicalLink, 'href', canonicalUrl);
  }

  //Valid values for the "CONTENT" attribute are: "INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"
  //http://www.robotstxt.org/meta.html
  public setMetaRobots(robots:string) {
    if (SeoService.checkData(robots)) {
      this.robots = this.getOrCreateElement('name', 'robots', 'meta');
      this.setElementAttribute(this.robots, 'content', robots);
    }
  }

  public setThemeColor(color:string) {
    if (SeoService.checkData(color)) {
      this.themeColor = this.getOrCreateElement('name', 'themeColor', 'meta');
      this.setElementAttribute(this.themeColor, 'content', color);
    }
  }

  public setApplicationJSON(json, id) {
    let el:HTMLElement;
    el = this.DOM.createElement('script');
    this.setElementAttribute(el, 'type', 'application/ld+json');
    this.setElementAttribute(el, 'id', id);
    this.DOM.setText(el, json);
    this.DOM.insertBefore(this.document.head.lastChild, el);
  }

  public removeApplicationJSON(id) {
    if(isBrowser){
      let el:HTMLElement;
      el = document.getElementById(id);
      if (el != null) {
        //IE 10 & 11 does not recognize .remove() as a function.
        if (typeof el.remove == 'function') {
          el.remove();
        } else {
          el.outerHTML = "";
        }
      }
    }
  }


  public setMetaTags(metaAttr:Array<any>){
    for(var i=0;i<metaAttr.length;i++){
      let metaKey = Object.keys(metaAttr[i])[0];
      if(SeoService.checkData(metaAttr[i][metaKey])){
        this.metaElement = this.getOrCreateElement('property', metaKey, 'meta')
        this.setElementAttribute(this.metaElement,'content',metaAttr[i][metaKey])
      }

    }

  }

  private getOrCreateElement(name:string, attr:string, type:string):HTMLElement {
    let el:HTMLElement;
    el = this.DOM.createElement(type);
    this.setElementAttribute(el, name, attr);
    if (attr != "canonical") {
      this.setElementAttribute(el, 'dochead', '1');
    }
    this.DOM.insertBefore(this.document.head.lastChild, el);
    return el;
  }

  private setElementAttribute(el:HTMLElement, name:string, attr:string) {
    return this.DOM.setAttribute(el, name, attr);
  }

  public removeMetaTags() {
    if (isBrowser) {
      var element = this.DOM.getElementsByTagName(this.document, 'meta'), index;
      for (index = element.length - 1; index >= 0; index--) {
        if (element[index].getAttribute('dochead') == '1') {
          element[index].parentNode.removeChild(element[index]);
        }
      }
    }
  }

  static checkData(data) {
    var check;
    check = !!(data != null && data != "");
    return check
  }
}
