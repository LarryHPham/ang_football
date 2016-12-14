import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

//globals
import {GlobalSettings} from "../../../global/global-settings";
import {GlobalFunctions} from '../../../global/global-functions';
import {VerticalGlobalFunctions} from "../../../global/vertical-global-functions";

//libraries
declare var moment:any;
declare var jQuery:any;

@Component({
    selector: 'articles-module',
    templateUrl: './app/fe-core/modules/articles/articles.module.html'
})

export class ArticlesModule implements OnInit {
    @Input() headlineData:Array<any>;
    @Input() isLeague:boolean;
    @Input() headlineError:boolean;
    public params;
    articleUrl:Array<any>;
    awayData:Array<any>;
    homeData:Array<any>;
    moduleData:Array<any>;
    randomArticles:Array<any>;
    scheduleAwayData:Array<any>;
    scheduleHomeData:Array<any>;
    subImages:Array<any>;
    eventType:string;
    keyword:string;
    mainContent:string;
    mainImage:string;
    mainTitle:string;
    scope:string;
    teamID:string;
    timeStamp:string;
    eventID:number;
    isSmall:boolean = false;
    league:boolean = false;

    public _collegeDivisonFullAbbrv:string = GlobalSettings.getCollegeDivisionFullAbbrv();

    public headerInfo = {
        moduleTitle: "",
        hasIcon: false,
        iconClass: ""
    };

    constructor(private _activateRoute:ActivatedRoute) {
        this.params = this._activateRoute.params.subscribe(
            (param:any)=> {
                this.scope = param['scope'];
                this.teamID = param['teamId'] ? param['teamId'] : null;
            }
        );
    }

    getArticles(data) {
        //Checks to see if data.featuredReport object has properties, previously featuredReport was an array
        this.headlineError = false;
        let objNotEmpty:boolean;
        for (var prop in data.featuredReport) {
            objNotEmpty = true;
        }
        //////
        ///if (!this.isLeague && data != null && data.featuredReport != null && data.featuredReport.length > 0)
        ////// ^^ old condition for displaying AI on team pages
        if (!this.isLeague && data != null && data.featuredReport != null && objNotEmpty == true) {
            this.eventID = data.event;
            this.scheduleHomeData = data.home;
            this.scheduleAwayData = data.away;
            this.moduleData = data;
            this.getHeaderData(data);
            if (!this.isLeague) {
                this.getSchedule(this.scheduleHomeData, this.scheduleAwayData);
            }
            this.getMainArticle(data);
            this.getSubArticles(data, this.eventID);
            //////
            ///else if (data.featuredReport != null && data.featuredReport.length > 0)
            ////// ^^ old condition for displaying AI on league pages
        } else if (this.isLeague) {
            this.getHeaderData(data);
            this.getMainArticle(data);
            this.getSubArticles(data, this.eventID);
        }
        else {
            this.headlineError = true;
            console.log('headline error');
        }
    }

    getHeaderData(header) {
        if (!this.isLeague && ArticlesModule.checkData(header)) {
            moment.tz.add('America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0');
            this.timeStamp = GlobalFunctions.sntGlobalDateFormatting(header.timestamp, "defaultDate");
            var dateString = GlobalFunctions.sntGlobalDateFormatting(header.timestamp, "shortDate");
            var isToday = moment(dateString).isSame(moment().tz('America/New_York'), 'day');
            var isPost = moment(dateString).isBefore(moment().tz('America/New_York'), 'day');
            if (isPost) {
                if (!this.isSmall) {
                    this.headerInfo.moduleTitle = "Post Gameday Matchup Against the " + (this.teamID == header.home.id ? ' ' + header.away.name : ' ' + header.home.name);
                } else {
                    this.headerInfo.moduleTitle = "Post Gameday Matchup";
                }
            } else {
                if (!this.isSmall) {
                    this.headerInfo.moduleTitle = (isToday ? "Today's" : moment(header.timestamp).format("dddd") + "'s") + " Gameday Matchup Against the " + (this.teamID == header.home.id ? ' ' + header.away.name : ' ' + header.home.name);
                } else {
                    this.headerInfo.moduleTitle = (isToday ? "Today's" : moment(header.timestamp).format("dddd") + "'s" + " Gameday") + " Matchup";
                }
            }
        } else {
            this.headerInfo.moduleTitle = "Headlines<span class='mod-info'> - " + this._collegeDivisonFullAbbrv + "</span>";
        }
    } //getHeaderData(header)

    getSchedule(homeData, awayData) {
        var homeArr = [];
        var awayArr = [];
        var val = [];
        var homeName = homeData.location + ' ' + homeData.name;
        var awayName = awayData.location + ' ' + awayData.name;
        val['homeID'] = homeData.id;
        val['homeName'] = homeData.name;
        val['homeLocation'] = homeData.location;
        val['homeHex'] = homeData.hex;
        if (this.teamID == homeData.id) {
            val['homeLogo'] = {
                imageClass: "image-66",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(homeData.logo),
                    imageClass: "border-logo"
                },
                subImages: []
            };
        } else {
            let homeLink = VerticalGlobalFunctions.formatTeamRoute(this.scope, homeName, homeData.id);
            val['url'] = homeLink;
            val['homeLogo'] = {
                imageClass: "image-66",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(homeData.logo),
                    urlRouteArray: homeLink,
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "border-logo"
                },
                subImages: []
            };
        }
        val['homeWins'] = homeData.wins;
        val['homeLosses'] = homeData.losses;
        homeArr.push(val);
        val = [];
        val['awayID'] = awayData.id;
        val['awayName'] = awayData.name;
        val['awayLocation'] = awayData.location;
        val['awayHex'] = awayData.hex;
        if (this.teamID == awayData.id) {
            val['awayLogo'] = {
                imageClass: "image-66",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(awayData.logo),
                    imageClass: "border-logo"
                },
                subImages: []
            };
        } else {
            let awayLink = VerticalGlobalFunctions.formatTeamRoute(this.scope, awayName, awayData.id);
            val['url'] = awayLink;
            val['awayLogo'] = {
                imageClass: "image-66",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(awayData.logo),
                    urlRouteArray: awayLink,
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "border-logo"
                },
                subImages: []
            };
        }
        val['awayWins'] = awayData.wins;
        val['awayLosses'] = awayData.losses;
        awayArr.push(val);
        this.homeData = homeArr;
        this.awayData = awayArr;
    }

    getMainArticle(headlineData) {
        if (!this.isLeague) {
            var pageIndex = Object.keys(headlineData['featuredReport'])[0];
            switch (pageIndex) {
                case'pregame-report':
                    this.keyword = 'PREGAME';
                    break;
                case'postgame-report':
                    this.keyword = 'POSTGAME';
                    break;
                default:
                    this.keyword = 'LIVE';
                    break;
            }
            this.mainTitle = headlineData['featuredReport'][pageIndex][0].title;
            this.eventType = pageIndex;
            var articleContent = headlineData['featuredReport'][pageIndex][0].teaser;
            var maxLength = 1000;
            var trimmedArticle = articleContent.substring(0, maxLength);
            this.mainContent = trimmedArticle.substr(0, Math.min(trimmedArticle.length, trimmedArticle.lastIndexOf(" ")));
            this.mainImage = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(headlineData['featuredReport'][pageIndex][0].image_url);
            this.articleUrl = VerticalGlobalFunctions.formatArticleRoute(this.scope, pageIndex, headlineData['featuredReport'][pageIndex][0].event_id);
        } else {
            this.keyword = "PREGAME";
            this.mainTitle = headlineData['data'][0].title;
            this.eventType = "pregame-report";
            var articleContent = headlineData['data'][0].teaser;
            this.mainImage = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(headlineData['data'][0].image_url);
            var maxLength = 1000;
            var trimmedArticle = articleContent.substring(0, maxLength);
            this.mainContent = trimmedArticle.substr(0, Math.min(trimmedArticle.length, trimmedArticle.lastIndexOf(" ")));
            this.articleUrl = VerticalGlobalFunctions.formatArticleRoute(this.scope, "pregame-report", headlineData['data'][0].event_id);
        }
    }

    getSubArticles(data, eventID) {
        var articles;
        var articleArr = [];
        var self = this;
        if (!this.isLeague) {
            Object.keys(data['otherReports']).forEach(function (val) {
                articles = {
                    title: data['otherReports'][val].title,
                    eventType: val,
                    eventID: val != "player-fantasy" ? eventID : data['otherReports'][val].article_id,
                    images: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(data['otherReports'][val].image_url),
                    articleUrl: VerticalGlobalFunctions.formatArticleRoute(self.scope, val, val != "player-fantasy" ? eventID : data['otherReports'][val].article_id)
                };
                articleArr.push(articles);
            });
        } else {
            data['data'].forEach(function (val, index) {
                if (index > 0) {
                    articles = {
                        title: val.title,
                        eventType: "pregame-report",
                        eventID: val.event_id,
                        images: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(val.image_url),
                        articleUrl: VerticalGlobalFunctions.formatArticleRoute(self.scope, "pregame-report", val.event_id)
                    };
                    articleArr.push(articles);
                }
            });
        }
        articleArr.sort(function () {
            return 0.5 - Math.random()
        });
        this.randomArticles = articleArr;
    }

    fitText() {
        try {
            var text = !this.isSmall ? jQuery('.main-article-container-content-text') : jQuery('.main-article-container-content-text-small');
            if (text[0].scrollHeight > text[0].clientHeight) {
                var original = text[0].innerHTML.substring(0, 400),
                    index = 0;
                while (index < 500 && text[0].scrollHeight > text[0].clientHeight) {
                    index++;
                    original = original.substring(0, original.lastIndexOf(" "));
                    if (!this.isSmall) {
                        text[0].innerHTML = original + '...<span class="main-article-container-content-read-more">Read More</span>';
                    } else {
                        text[0].innerHTML = original + '...';
                    }
                }
            }
        } catch (e) {
        }
    }

    static checkData(data) {
        return data
    }

    onResize(event) {
        this.isSmall = event.target.innerWidth <= 639;
        this.fitText();
        if (this.moduleData != null) {
            this.getHeaderData(this.moduleData);
        }
    }

    ngOnInit() {
        this.isSmall = window.innerWidth <= 639;
    }

    ngOnChanges() {
        if (ArticlesModule.checkData(this.headlineData)) {
            this.getArticles(this.headlineData);
            this.fitText();
        }
    }
}
