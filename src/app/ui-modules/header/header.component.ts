import {Component, Input, OnInit, Output, EventEmitter, ElementRef, Renderer, AfterContentChecked } from '@angular/core';
// import {Search, SearchInput} from '../components/search/search.component';
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { HamburgerMenuComponent, MenuData } from '../../ui-modules/hamburger-menu/hamburger-menu.component';
import { isBrowser } from 'angular2-universal';

declare var stButtons: any;

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
  public menuTransitionAmount: number = 0;
  public pageHeader: any;
  public pageHeaderHeight: any;

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
    if (isBrowser) {
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
    if (isBrowser) {
      var headerBottom = document.getElementById('header-bottom');
      var headerBottomHeight = headerBottom.offsetHeight;
      var scrollTop = event.srcElement ? event.srcElement.body.scrollTop : document.documentElement.scrollTop; //fallback for firefox scroll events
      var scrollPolarity = scrollTop - this.scrollTopPrev; //determines if user is scrolling up or down
      var headerHeight = this.getHeaderHeight() - headerBottomHeight;

      if (scrollPolarity > 0) {
        this.scrollMenuUp = true;
        if (this.menuTransitionAmount >= -headerHeight) {
          this.menuTransitionAmount = this.menuTransitionAmount - scrollPolarity;
          if (this.menuTransitionAmount < -headerHeight) { //if the value doesn't calculate quick enough based on scroll speed set it manually
            this.menuTransitionAmount = -headerHeight;
          }
        }
      }
      else if (scrollPolarity < 0) {
        this.scrollMenuUp = false;
        this.menuTransitionAmount = 0;
      }
      // fix for 'page overscroll' in safari
      if (scrollTop == 0) {
        this.menuTransitionAmount = 0;
      }
      this.scrollTopPrev = scrollTop; //defines scrollPolarity
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
    var document = this.elementRef.nativeElement.ownerDocument;
    //wait 1 second to make sure the router scope changes before running the global settings getScopeNow and grab correct scope
    setTimeout(() => {
      this.scope = GlobalSettings.getScopeNow();
    }, 1000);

    // close menu if it is open and user clicks outside the menu
    var partnerHome = GlobalSettings.getHomeInfo().isPartner && !GlobalSettings.getHomeInfo().isSubdomainPartner;
    this.linkHome = [VerticalGlobalFunctions.getWhiteLabel() + '/home'];
    this._renderer.listenGlobal('document', 'click', (event) => {
      var element = document.elementFromPoint(event.clientX, event.clientY);
      if (element && isBrowser) {
        let menuCheck = element.className.indexOf("menucheck");
        let searchCheck = element.className.indexOf("searchcheck");
        if (this.isOpened) {
          this.isOpened = false;
        }
        if (this.isSearchOpened && searchCheck < 0) {
          this.isSearchOpened = false;
        }
      }
    });

    if (isBrowser) {
      stButtons.locateElements();
      //insert salad bar
      var v = document.createElement('script');
      v.src = '//w1.synapsys.us/widgets/deepdive/bar/bar.js?brandHex=234a66';
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
