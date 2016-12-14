//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
 *Optimal Length for Search Engines
 *Roughly 155 Characters
 ***/
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { __platform_browser_private__ } from '@angular/platform-browser'
import {GlobalSettings} from "./global/global-settings";

@Injectable()

export class SeoService {
    private titleService:Title;

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
    constructor(titleService:Title) {
        this.titleService = titleService;
        this.DOM = __platform_browser_private__.getDOM();
        /**
         * get the <head> Element
         * @type {any}
         */
        this.headElement = this.DOM.query('head');
        this.metaDescription = this.getOrCreateMetaElement('description');
        this.themeColor = this.getOrCreateMetaElement('theme-color');
        this.robots = this.getOrCreateMetaElement('robots');
        this.ogTitle = this.getOgMetaElement("og:title");
        this.ogType = this.getOgMetaElement("og:type");
        this.ogUrl = this.getOgMetaElement("og:url");
        this.ogImage = this.getOgMetaElement("og:image");
        this.ogDesc = this.getOgMetaElement("og:description");

        this.startDate = this.getOrCreateMetaElement('es_start_date');
        this.endDate = this.getOrCreateMetaElement('es_end_date');
        this.isArticle = this.getOrCreateMetaElement('es_is_article');
        this.es_search_type = this.getOrCreateMetaElement('es_search_type');
        this.es_source = this.getOrCreateMetaElement('es_source');
        this.es_article_id = this.getOrCreateMetaElement('es_article_id');
        this.es_article_title = this.getOrCreateMetaElement('es_article_title');
        this.es_keyword = this.getOrCreateMetaElement('es_keyword');
        this.es_published_date = this.getOrCreateMetaElement('es_published_date');
        this.es_author = this.getOrCreateMetaElement('es_author');
        this.es_publisher = this.getOrCreateMetaElement('es_publisher');
        this.es_image_url = this.getOrCreateMetaElement('es_image_url');
        this.es_article_teaser = this.getOrCreateMetaElement('es_article_teaser');
        this.es_article_url = this.getOrCreateMetaElement('es_article_url');
        this.es_article_type = this.getOrCreateMetaElement('es_article_type');
        this.es_search_string = this.getOrCreateMetaElement('es_search_string');
    }



    public getTitle():string {
        return this.titleService.getTitle();
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
      this.titleService.setTitle(shortTitle);
    }

    //incase we dont want the base title to be in head title tag
    public setTitleNoBase(title:string) {
        this.titleService.setTitle(title);
    }

    public getMetaDescription():string {
        return this.metaDescription.getAttribute('content');
    }

    public setMetaDescription(description:string) {
        let html = description;
        let div = document.createElement("div");
        div.innerHTML = html;
        let truncatedDescription = div.textContent || div.innerText || "";
        if (truncatedDescription.length > 167) {
            truncatedDescription = truncatedDescription.substring(0, 167);
            truncatedDescription += '...';
        }
        this.metaDescription.setAttribute('content', truncatedDescription);
    }

    public getMetaRobots():string {
        return this.robots.getAttribute('content');
    }

    //Valid values for the "CONTENT" attribute are: "INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"
    //http://www.robotstxt.org/meta.html
    public setMetaRobots(robots:string) {
        this.robots.setAttribute('content', robots);
    }

    public setThemeColor(color:string) {
        this.themeColor.setAttribute('content', color);
    }

    public setOgTitle(newTitle:string) {
        this.ogTitle.setAttribute('content', newTitle);
    }

    public setOgType(newType:string) {
        this.ogType.setAttribute('content', newType);
    }

    public setOgUrl() {
      let href = window.location.href;
        this.ogUrl.setAttribute('content', href);
    }

    public setOgImage(imageUrl:string) {
        this.ogImage.setAttribute('content', imageUrl);
    }

    public setOgDesc(description:string) {
        this.ogDesc.setAttribute('content', description);
    }

    public setStartDate(startDate:string) {
        this.startDate.setAttribute('content', startDate);
    }

    public setEndDate(endDate:string) {
        this.endDate.setAttribute('content', endDate);
    }

    public setIsArticle(isArticle:string) {
        this.isArticle.setAttribute('content', isArticle);
    }

    public setSearchType(searchType:string) {
        this.es_search_type.setAttribute('content', searchType);
    }

    public setSource(source:string) {
        this.es_source.setAttribute('content', source);
    }

    public setArticleId(articleId:string) {
        this.es_article_id.setAttribute('content', articleId);
    }

    public setArticleTitle(articleTitle:string) {
        this.es_article_title.setAttribute('content', articleTitle);
    }

    public setKeyword(keyword:string) {
        this.es_keyword.setAttribute('content', keyword);
    }

    public setPublishedDate(publishedDate:string) {
        this.es_published_date.setAttribute('content', publishedDate);
    }

    public setAuthor(author:string) {
        this.es_author.setAttribute('content', author);
    }

    public setPublisher(publisher:string) {
        this.es_publisher.setAttribute('content', publisher);
    }

    public setImageUrl(imageUrl:string) {
        this.es_image_url.setAttribute('content', imageUrl);
    }

    public setArticleTeaser(articleTeaser:string) {
        this.es_article_teaser.setAttribute('content', articleTeaser);
    }

    public setArticleUrl(articleUrl:string) {
        this.es_article_url.setAttribute('content', articleUrl);
    }

    public setArticleType(articleType:string) {
        this.es_article_type.setAttribute('content', articleType);
    }

    public setSearchString(searchString:string) {
        this.es_search_string.setAttribute('content', searchString);
    }

    /**
     * get the HTML Element when it is in the markup, or create it.
     * @param name
     * @returns {HTMLElement}
     */

    private getOrCreateMetaElement(name:string):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.query('meta[name=' + name + ']');
        if (el === null) {
            el = this.DOM.createElement('meta');
            el.setAttribute('name', name);
            this.headElement.appendChild(el);
        }
        return el;
    }

    private getOgMetaElement(name:string):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.query('meta[property="' + name + '"]');
        if (el === null) {
            el = this.DOM.createElement('meta');
            el.setAttribute('property', name);
            this.headElement.appendChild(el);
        }
        return el;
    }

    public setCanonicalLink(): HTMLElement {
        let relPath = window.location.href;
        let el:HTMLElement;
        el = this.DOM.query("link[rel='canonical']");
        let canonicalLink = window.location.href;
        if (el === null) {
            el = this.DOM.createElement('link');
            el.setAttribute('rel', 'canonical');
            el.setAttribute('href', canonicalLink);
            this.headElement.appendChild(el);
        } else {
            el.setAttribute('href', canonicalLink);
        }
        return el;
    }

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
