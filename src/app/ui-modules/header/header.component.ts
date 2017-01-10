import {Component, Input, OnInit, Output, EventEmitter, ElementRef, Renderer, AfterContentChecked } from '@angular/core';
// import {Search, SearchInput} from '../components/search/search.component';
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {HamburgerMenuComponent, MenuData} from '../../ui-modules/hamburger-menu/hamburger-menu.component';
import { isBrowser } from 'angular2-universal';

declare var stButtons: any;
declare var jQuery: any;

@Component({
    selector: 'header-component',
    templateUrl: './header.component.html',
    providers: [],
})
export class HeaderComponent implements AfterContentChecked {
    @Input() partnerID: string;
    @Input() partnerScript: any;
    @Output() tabSelected = new EventEmitter();
    @Output() scrollPadding = new EventEmitter();

    private nativeElement: any;

    public scope: string;
    public routeSubscription: any;
    public logoUrl: string = GlobalSettings.mainIcon;
    public partnerLogoUrl: string = 'app/public/Football-DeepDive_Logo_Outlined-W.svg';
    private _stickyHeader: string;
    private _stickyHeaderPartner: string;
    public searchInput: any = {
        placeholderText: "Search for a football player or team...",
        hasSuggestions: true
    };
    public hamburgerMenuData: Array<MenuData>;
    public hamburgerMenuInfo: Array<MenuData>;
    public titleHeader: string;
    public isOpened: boolean = false;
    public isSearchOpened: boolean = false;
    public isActive: boolean = false;
    public _sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
    public _collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();
    public _sportName: string = GlobalSettings.getSportName().toUpperCase();
    private elementRef: any;

    public scrollTopPrev: number = 0;
    public scrollMenuUp: boolean = false;
    public menuTransitionAmount:number = 0;
    public pageHeader:any;
    public pageHeaderHeight:any;

    public linkHome: any;

    //deprecated
    private _router: any;
    constructor(
      elementRef: ElementRef,
      private _renderer: Renderer) {
        this.elementRef = elementRef;
    }



    ngAfterContentChecked() {
      this.getHeaderHeight();
    }



    getHeaderHeight() {
      if ( isBrowser ) {
        this.pageHeader = document.getElementById('pageHeader');
        this.pageHeaderHeight = this.pageHeader.offsetHeight;
        this.scrollPadding.next(this.pageHeaderHeight);
        return this.pageHeaderHeight;
      }
    } //getHeaderHeight



    openSearch(event) {
      if (this.isSearchOpened == true) {
          this.isSearchOpened = false;
      } else {
          this.isSearchOpened = true;
      }
    } //openSearch



    // Page is being scrolled
    onScrollStick(event?) {
      if(isBrowser) {
        var partnerHeader = document.getElementById('partner') ? document.getElementById('partner') : null;
        var partnerHeaderHeight = partnerHeader ? partnerHeader.offsetHeight : null;
        var headerTop = document.getElementById('header-top');
        var headerTopHeight = headerTop.offsetHeight;
        var headerBottom = document.getElementById('header-bottom');
        var headerBottomHeight = headerBottom.offsetHeight;
        var scrollTop = event.srcElement.body.scrollTop;
        var scrollPolarity = scrollTop - this.scrollTopPrev;
        var headerHeight = this.getHeaderHeight() - headerBottomHeight;

        if ( scrollPolarity > 0 && scrollTop <= headerHeight ) {
          this.menuTransitionAmount = -scrollTop;
          this.scrollMenuUp = true;
        }
        else if ( scrollPolarity < 0 ) {
          this.scrollMenuUp = false;
          this.menuTransitionAmount = 0;
        }

        this.scrollTopPrev = scrollTop; //defined scrollPolarity
      }
    }//onScrollStick ends



    public getMenu(event): void {
        if (this.isOpened == true) {
            this.isOpened = false;
        } else {
            this.isOpened = true;
        }
    }
    menuCheck(event) {
        var windowWidth = event.target.innerWidth;
        if (windowWidth > 640) {
            this.isSearchOpened = false;
        }
    }
    ngOnInit() {
      if(isBrowser){
        var document = this.elementRef.nativeElement.ownerDocument;
        //wait 1 second to make sure the router scope changes before running the global settings getScopeNow and grab correct scope
        setTimeout(() => {
          this.scope = GlobalSettings.getScopeNow();
        }, 1000);

        // with router deprecated being able to navigate correctly on different layered router outlets
        var partnerHome = GlobalSettings.getHomeInfo().isPartner && !GlobalSettings.getHomeInfo().isSubdomainPartner;
        if (partnerHome) {
          // this.linkHome = [relPath+'Partner-home',{scope:'home',partner_id:GlobalSettings.getHomeInfo().partnerName}];
        } else {
          this.linkHome = ['/home'];
        }
        stButtons.locateElements();
        this._renderer.listenGlobal('document', 'click', (event) => {
          var element = document.elementFromPoint(event.clientX, event.clientY);
          if (element) {
            let menuCheck = element.className.indexOf("menucheck");
            let searchCheck = element.className.indexOf("searchcheck");
            if (this.isOpened && menuCheck < 0) {
              this.isOpened = false;
            }
            if (this.isSearchOpened && searchCheck < 0) {
              this.isSearchOpened = false;
            }
          }
        });

        //insert salad bar
        var v = document.createElement('script');
        v.src = 'http://w1.synapsys.us/widgets/deepdive/bar/bar.js?brandHex=234a66';
        document.getElementById('header-bottom').insertBefore(v, document.getElementById('salad-bar'));

        var setPlaceholder = setInterval(function() { // keep checking for the existance of the salad bar until it loads in
          if (document.getElementById('ddb-search-desktop')) {
            //override the salad bar default placeholder text, and use the one for TDL
            document.getElementById('ddb-search-desktop')['placeholder'] = "Search for a sports team…";
            document.getElementById('ddb-small-desktop-search-input')['placeholder'] = "Search for a sports team…";
            document.getElementById('ddb-search-mobile')['placeholder'] = "Search for a sports team…";
            //override the default salad bars hamburger icon and use the scoreboard icon when on TDL
            var scoreboardIcon = document.getElementById('ddb-dropdown-boxscores-button').getElementsByClassName('ddb-icon')[0];
            scoreboardIcon.classList.add('fa', 'fa-box-scores');
            scoreboardIcon.classList.remove('ddb-icon-bars', 'ddb-icon');

            //dont need to keep running this anymore now that its all set
            clearInterval(setPlaceholder);
          }
        }, 1000);
      }
    }
}
