//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
 *Optimal Length for Search Engines
 *Roughly 155 Characters
 ***/

import { Injectable, Inject } from '@angular/core';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
import { DOCUMENT } from '@angular/platform-browser';
import { isNode } from "angular2-universal";

import { GlobalSettings } from "./global/global-settings";

declare var Zone: any;

@Injectable()
export class SeoService {
    private dom:any;
    private document:any;
    private headElement:HTMLElement;

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
    private es_search_type:HTMLElement;
    private es_source:HTMLElement;
    private es_article_id:HTMLElement;
    private es_article_title:HTMLElement;
    private es_keyword:HTMLElement;
    private es_published_date:HTMLElement;
    private es_author:HTMLElement;
    private es_publisher:HTMLElement;
    private es_image_url:HTMLElement;
    private es_article_teaser:HTMLElement;
    private es_article_url:HTMLElement;
    private es_article_type:HTMLElement;
    private es_search_string:HTMLElement;

    robots:HTMLElement;
    private DOM:any;

    /**
     * Inject the Angular 2 Title Service
     * @param titleService
     */
    constructor(
      @Inject(DOCUMENT) document: any
    ) {
        this.DOM = getDOM();
        this.document = document;
        this.headElement = this.document.head;
        // /**
        //  * get the <head> Element
        //  * @type {any}
        //  */
        this.metaDescription = this.getOrCreateElement('name', 'description', 'meta');
        this.themeColor = this.getOrCreateElement('name', 'theme-color', 'meta');
        this.canonicalLink = this.getOrCreateElement('rel', 'canonical', 'link');
        this.robots = this.getOrCreateElement('name', 'robots', 'meta');
        this.ogTitle = this.getOrCreateElement('og:title', 'property', 'meta');
        this.ogDesc = this.getOrCreateElement('og:description', 'property', 'meta');
        this.ogType = this.getOrCreateElement('og:type', 'property', 'meta');
        this.ogUrl = this.getOrCreateElement('og:url', 'property', 'meta');
        this.ogImage = this.getOrCreateElement('og:image', 'property', 'meta');

        // this.startDate = this.getOrCreateMetaElement('es_start_date');
        // this.endDate = this.getOrCreateMetaElement('es_end_date');
        // this.isArticle = this.getOrCreateMetaElement('es_is_article');
        // this.es_search_type = this.getOrCreateMetaElement('es_search_type');
        // this.es_source = this.getOrCreateMetaElement('es_source');
        // this.es_article_id = this.getOrCreateMetaElement('es_article_id');
        // this.es_article_title = this.getOrCreateMetaElement('es_article_title');
        // this.es_keyword = this.getOrCreateMetaElement('es_keyword');
        // this.es_published_date = this.getOrCreateMetaElement('es_published_date');
        // this.es_author = this.getOrCreateMetaElement('es_author');
        // this.es_publisher = this.getOrCreateMetaElement('es_publisher');
        // this.es_image_url = this.getOrCreateMetaElement('es_image_url');
        // this.es_article_teaser = this.getOrCreateMetaElement('es_article_teaser');
        // this.es_article_url = this.getOrCreateMetaElement('es_article_url');
        // this.es_article_type = this.getOrCreateMetaElement('es_article_type');
        // this.es_search_string = this.getOrCreateMetaElement('es_search_string');
    }

    //sets title to atleast less than 50 characters and will choose the  first 3 words and append site name at end
    public setTitle(newTitle: string) {
      let splitTitle = newTitle.split(' ');
      let shortTitle;
      if(splitTitle.length > 3){
        splitTitle = splitTitle.splice(0,3);
        shortTitle = splitTitle.join(' ') + '...';
      }else{
        shortTitle = splitTitle.join(' ');
      }
      this.document.title = shortTitle;
    }

    public setMetaDescription(description:string) {
      let truncatedDescription = description;
      if (truncatedDescription.length > 167) {
          truncatedDescription = truncatedDescription.substring(0, 167);
          truncatedDescription += '...';
      }
      this.setElementAttribute(this.metaDescription, 'content', truncatedDescription);
    }

    public setCanonicalLink() {
      let canonicalUrl = "";
      if(isNode) {
        canonicalUrl = Zone.current.get('originUrl') + Zone.current.get('requestUrl')
      }else{
        canonicalUrl = window.location.href;
      }

      this.setElementAttribute(this.canonicalLink, 'href', canonicalUrl);
    }

    //Valid values for the "CONTENT" attribute are: "INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"
    //http://www.robotstxt.org/meta.html
    public setMetaRobots(robots:string) {
      this.setElementAttribute(this.robots, 'content', robots);
    }

    public setThemeColor(color:string) {
      this.setElementAttribute(this.themeColor, 'content', color);
    }

    public setOgTitle(newTitle:string) {
      this.setElementAttribute(this.ogTitle, 'content', newTitle);
    }

    public setOgDesc(description:string) {
      this.setElementAttribute(this.ogDesc, 'content', description);
    }

    public setOgType(newType:string) {
      this.setElementAttribute(this.ogType, 'content', newType);
    }

    public setOgUrl() {
      let ogUrl = "";
      if(isNode) {
        ogUrl = Zone.current.get('originUrl') + Zone.current.get('requestUrl')
      }else{
        ogUrl = window.location.href;
      }

      this.setElementAttribute(this.ogUrl, 'content', ogUrl)
    }

    public setOgImage(imageUrl:string) {
      this.setElementAttribute(this.ogImage, 'content', imageUrl);
    }

    private getOrCreateElement(name: string, attr: string, type: string): HTMLElement {
      let el: HTMLElement;
      el = this.DOM.createElement(type);
      this.setElementAttribute(el, name, attr);
      this.DOM.insertBefore(this.document.head.lastChild, el);

      return el;
    }

    private setElementAttribute(el: HTMLElement, name: string, attr: string) {
      return this.DOM.setAttribute(el, name, attr);
    }



    // //incase we dont want the base title to be in head title tag
    // public setTitleNoBase(title:string) {
    //     this.titleService.setTitle(title);
    // }
    //
    // public getMetaRobots():string {
    //     return this.robots.getAttribute('content');
    // }
    //
    // public setStartDate(startDate:string) {
    //     this.startDate.setAttribute('content', startDate);
    // }
    //
    // public setEndDate(endDate:string) {
    //     this.endDate.setAttribute('content', endDate);
    // }
    //
    // public setIsArticle(isArticle:string) {
    //     this.isArticle.setAttribute('content', isArticle);
    // }
    //
    // public setSearchType(searchType:string) {
    //     this.es_search_type.setAttribute('content', searchType);
    // }
    //
    // public setSource(source:string) {
    //     this.es_source.setAttribute('content', source);
    // }
    //
    // public setArticleId(articleId:string) {
    //     this.es_article_id.setAttribute('content', articleId);
    // }
    //
    // public setArticleTitle(articleTitle:string) {
    //     this.es_article_title.setAttribute('content', articleTitle);
    // }
    //
    // public setKeyword(keyword:string) {
    //     this.es_keyword.setAttribute('content', keyword);
    // }
    //
    // public setPublishedDate(publishedDate:string) {
    //     this.es_published_date.setAttribute('content', publishedDate);
    // }
    //
    // public setAuthor(author:string) {
    //     this.es_author.setAttribute('content', author);
    // }
    //
    // public setPublisher(publisher:string) {
    //     this.es_publisher.setAttribute('content', publisher);
    // }
    //
    // public setImageUrl(imageUrl:string) {
    //     this.es_image_url.setAttribute('content', imageUrl);
    // }
    //
    // public setArticleTeaser(articleTeaser:string) {
    //     this.es_article_teaser.setAttribute('content', articleTeaser);
    // }
    //
    // public setArticleUrl(articleUrl:string) {
    //     this.es_article_url.setAttribute('content', articleUrl);
    // }
    //
    // public setArticleType(articleType:string) {
    //     this.es_article_type.setAttribute('content', articleType);
    // }
    //
    // public setSearchString(searchString:string) {
    //     this.es_search_string.setAttribute('content', searchString);
    // }

    public setApplicationJSON(json, id):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.query("script[id='" + id + "']");
        if (el === null) {
            el = this.DOM.createElement('script');
            el.setAttribute('type', 'application/ld+json');
            el.id = id;
            el.innerHTML = json;
            this.headElement.appendChild(el);
        } else {
            el.textContent = json;
        }
        return el;
    }

    public removeApplicationJSON(id) {
        let el:HTMLElement;
        el = document.getElementById(id);
        if (el != null) {
            el.remove();
        }
    }
}
