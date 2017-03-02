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
  private ogTitle:HTMLElement;
  private ogType:HTMLElement;
  private ogUrl:HTMLElement;
  private ogImage:HTMLElement;
  private ogDesc:HTMLElement;
  private startDate:HTMLElement;
  private endDate:HTMLElement;
  private isArticle:HTMLElement;
  //Elastic Search meta tags
  private es_page_type:HTMLElement;
  private es_data_source:HTMLElement;
  private es_article_id:HTMLElement;
  private es_page_title:HTMLElement;
  private es_category:HTMLElement;
  private es_published_date:HTMLElement;
  private es_article_author:HTMLElement;
  private es_article_publisher:HTMLElement;
  private es_image_url:HTMLElement;
  private es_article_teaser:HTMLElement;
  private es_page_url:HTMLElement;
  private es_article_type:HTMLElement;
  private es_keywords:HTMLElement;
  private DOM:any;
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
      this.pageUrl = GlobalSettings._proto + "//" + Zone.current.get('originUrl') + Zone.current.get('requestUrl');
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

  public setOgTitle(newTitle:string) {
    if (SeoService.checkData(newTitle)) {
      this.ogTitle = this.getOrCreateElement('property', 'og:title', 'meta');
      this.setElementAttribute(this.ogTitle, 'content', newTitle);
    }
  }

  public setOgDesc(description:string) {
    if (SeoService.checkData(description)) {
      this.ogDesc = this.getOrCreateElement('property', 'og:description', 'meta');
      this.setElementAttribute(this.ogDesc, 'content', description);
    }
  }

  public setOgType(newType:string) {
    if (SeoService.checkData(newType)) {
      this.ogType = this.getOrCreateElement('property', 'og:type', 'meta');
      this.setElementAttribute(this.ogType, 'content', newType);
    }
  }

  public setOgUrl() {
    let pageUrl = this.getPageUrl();
    this.ogUrl = this.getOrCreateElement('property', 'og:url', 'meta');
    this.setElementAttribute(this.ogUrl, 'content', pageUrl)
  }

  public setOgImage(imageUrl:string) {
    if (SeoService.checkData(imageUrl)) {
      this.ogImage = this.getOrCreateElement('property', 'og:image', 'meta');
      this.setElementAttribute(this.ogImage, 'content', imageUrl);
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

  public setCategory(category:string) {
    if (SeoService.checkData(category)) {
      this.es_category = this.getOrCreateElement('name', 'es_category', 'meta');
      this.setElementAttribute(this.es_category, 'content', category);
    }
  }

  public setStartDate(startDate:string) {
    if (SeoService.checkData(startDate)) {
      this.startDate = this.getOrCreateElement('name', 'start_date', 'meta');
      this.setElementAttribute(this.startDate, 'content', startDate);
    }
  }

  public setEndDate(endDate:string) {
    if (SeoService.checkData(endDate)) {
      this.endDate = this.getOrCreateElement('name', 'end_date', 'meta');
      this.setElementAttribute(this.endDate, 'content', endDate);
    }
  }

  public setIsArticle(isArticle:string) {
    if (SeoService.checkData(isArticle)) {
      this.isArticle = this.getOrCreateElement('name', 'is_article', 'meta');
      this.setElementAttribute(this.isArticle, 'content', isArticle);
    }
  }

  public setPageType(pageType:string) {
    if (SeoService.checkData(pageType)) {
      this.es_page_type = this.getOrCreateElement('name', 'es_page_type', 'meta');
      this.setElementAttribute(this.es_page_type, 'content', pageType);
    }
  }

  public setArticleId(articleId:string) {
    if (SeoService.checkData(articleId)) {
      this.es_article_id = this.getOrCreateElement('name', 'es_article_id', 'meta');
      this.setElementAttribute(this.es_article_id, 'content', articleId);
    }
  }

  public setPageTitle(pageTitle:string) {
    if (SeoService.checkData(pageTitle)) {
      this.es_page_title = this.getOrCreateElement('name', 'es_page_title', 'meta');
      this.setElementAttribute(this.es_page_title, 'content', pageTitle);
    }
  }

  public setAuthor(author:string) {
    if (SeoService.checkData(author)) {
      this.es_article_author = this.getOrCreateElement('name', 'es_article_author', 'meta');
      this.setElementAttribute(this.es_article_author, 'content', author);
    }
  }

  public setPublisher(publisher:string) {
    if (SeoService.checkData(publisher)) {
      this.es_article_publisher = this.getOrCreateElement('name', 'es_article_publisher', 'meta');
      this.setElementAttribute(this.es_article_publisher, 'content', publisher);
    }
  }

  public setPageUrl() {
    let articleUrl = this.getPageUrl();
    this.es_page_url = this.getOrCreateElement('name', 'es_page_url', 'meta');
    this.setElementAttribute(this.es_page_url, 'content', articleUrl);
  }

  public setKeyWord(keywords:string) {
    if (SeoService.checkData(keywords)) {
      this.es_keywords = this.getOrCreateElement('name', 'es_keywords', 'meta');
      this.setElementAttribute(this.es_keywords, 'content', keywords);
    }
  }

  public setSource(source:string) {
    if (SeoService.checkData(source)) {
      this.es_data_source = this.getOrCreateElement('name', 'es_data_source', 'meta');
      this.setElementAttribute(this.es_data_source, 'content', source);
    }
  }

  public setPublishedDate(publishedDate:string) {
    if (SeoService.checkData(publishedDate)) {
      this.es_published_date = this.getOrCreateElement('name', 'es_published_date', 'meta');
      this.setElementAttribute(this.es_published_date, 'content', publishedDate);
    }
  }

  public setImageUrl(imageUrl:string) {
    if (SeoService.checkData(imageUrl)) {
      this.es_image_url = this.getOrCreateElement('name', 'es_image_url', 'meta');
      this.setElementAttribute(this.es_image_url, 'content', imageUrl);
    }
  }

  public setArticleTeaser(articleTeaser:string) {
    if (SeoService.checkData(articleTeaser)) {
      this.es_article_teaser = this.getOrCreateElement('name', 'es_article_teaser', 'meta');
      this.setElementAttribute(this.es_article_teaser, 'content', articleTeaser);
    }
  }

  public setArticleType(articleType:string) {
    if (SeoService.checkData(articleType)) {
      this.es_article_type = this.getOrCreateElement('name', 'es_article_type', 'meta');
      this.setElementAttribute(this.es_article_type, 'content', articleType);
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
