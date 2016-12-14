import {Component, Input, Renderer, ElementRef} from "@angular/core";
import {Router} from "@angular/router";
@Component({
    selector:"search-filter",
    templateUrl:'./app/fe-core/modules/search-page-filter/search-page-filter.module.html'
})
export class SearchPageFilter{
    @Input() userInput:string;
    icon="caret-down";
    constructor(private router:Router, private _keywordRender:Renderer, private _keyRef:ElementRef){

    }
keywords=[
    {
        key:"All",
        value:"All Keywords",
    },
    {
        key:"Automotive",
        value:"Automotive",
    },
    {
        key:"Business",
        value:"Business",
    },
    {
        key:'Celebreties',
        value:"Celebreties",
    },
    {
        key:'Entertainment',
        value:"Entertainment",
    },
    {
        key:'Food',
        value:"Food",
    },
    {
        key:'Health',
        value:"Health",
    },
    {
        key:'Lifestyle',
        value:"Lifestyle",
    },
    {
        key:'MLB',
        value:"MLB",
    },
    {
        key:'Movies',
        value:"Movies",
    },
    {
        key:'Music',
        value:"Music",
    },
    {
        key:'NBA',
        value:"NBA",
    },
    {
        key:'NCAAF',
        value:"NCAAF",
    },
    {
        key:'NCAAM',
        value:"NCAAM",
    },
    {
        key:'NFL',
        value:"NFL",
    },
    {
        key:'Politics',
        value:"Politics",
    },
    {
        key:'Real Estate',
        value:"Real Estate",
    },
    {
        key:'Sports',
        value:"Sports",
    },
    {
        key:'Travel',
        value:"Travel",
    },
    {
        key:'Trending',
        value:"Trending",
    },
    {
        key:'Television Shows',
        value:"Television Shows",
    },
    {
        key:'Weather',
        value:"Weather",
    }];

    sorting=[
        {
            key:'None',
            value:"None",
        },

        {
            key:"MostRecent",
            value:"Most Recent",
        },
        {
            key:'Oldest',
            value:"Oldest",
        },
        {
            key:'last24Hours',
            value:"Last 24 Hours",
        },
        {
            key:'past7days',
            value:"Past 7 Days",
        },
        /*{
            key:'MostShares',
            value:"Most Shares",
        },
        {
            key:'MostViews',
            value:"Most Views",
        },*/
        ];
    keywordClick(e){
/*
        console.log(this._keyRef.nativeElement.getElementsByClassName('dropdown-hdr-value')[0].innerHTML);
*/

/*
        this._keywordRender.setElementStyle(this._keyRef.nativeElement.getElementsByClassName('dropdown-hdr-value')[0],'font-weight','bold')
*/
    }
    sortingClick(e){

     //   this._keywordRender.setElementStyle(this._keyRef.nativeElement.getElementsByClassName('dropdown-hdr-value')[1],'font-weight','bold')


    }
}
