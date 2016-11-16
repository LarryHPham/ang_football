//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
 *Optimal Length for Search Engines
 *Roughly 155 Characters
 ***/
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
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

    private playerNames:HTMLElement;
    private teamNames:HTMLElement;
    private startDate:HTMLElement;
    private endDate:HTMLElement;
    private isArticle:HTMLElement;

    robots:HTMLElement;
    private DOM:any;

    /**
     * Inject the Angular 2 Title Service
     * @param titleService
     */
    constructor(titleService:Title) {
        this.titleService = titleService;
        this.DOM = getDOM();

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

        this.playerNames = this.getOrCreateMetaElement('player_names');
        this.teamNames = this.getOrCreateMetaElement('team_names');
        this.startDate = this.getOrCreateMetaElement('start_date');
        this.endDate = this.getOrCreateMetaElement('end_date');
        this.isArticle = this.getOrCreateMetaElement('is_article');
    }

    public getTitle():string {
        return this.titleService.getTitle();
    }

    //sets title to atleast less than 50 characters and will choose the  first 3 words and append site name at end
    public setTitle(newTitle:string) {
        let splitTitle = newTitle.split(' ');
        let shortTitle;

        if (newTitle.length > 50) {
            splitTitle = splitTitle.splice(0, 3);
            shortTitle = splitTitle.join(' ');
        } else {
            shortTitle = splitTitle.join(' ');
        }

        if (GlobalSettings.getHomeInfo().isPartner) {
            shortTitle = shortTitle + ' | ' + GlobalSettings.getBasePartnerTitle();
        } else {
            shortTitle = shortTitle + ' | ' + GlobalSettings.getBaseTitle();
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

    public setOgUrl(url:string) {
        this.ogUrl.setAttribute('content', url);
    }

    public setOgImage(imageUrl:string) {
        this.ogImage.setAttribute('content', imageUrl);
    }

    public setOgDesc(description:string) {
        this.ogDesc.setAttribute('content', description);
    }

    public setPlayerNames(playerNames:string) {
        this.playerNames.setAttribute('content', playerNames);
    }

    public setTeamNames(teamNames:string) {
        this.teamNames.setAttribute('content', teamNames);
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

    public setCanonicalLink(RouteParams, router):HTMLElement {
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
