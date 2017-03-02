import { Component, OnInit, Input } from '@angular/core';
import { isBrowser } from 'angular2-universal';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from '../../global/global-functions';
import { Link, NavigationData } from '../../global/global-interface';
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { FooterService } from '../../services/footer.service';


@Component({
    selector: 'footer-component',
    templateUrl: './footer.component.html',
    inputs: [],
})
export class FooterComponent implements OnInit {
    @Input() partnerID: string;
    @Input() scopeParam: string;
    public pageName: string;
    public homePageLinkName: string;
    public linkName: string;
    public currentUrl: string;
    public _copyrightInfo: string = "<i>Images Provided By: </i><b> " + GlobalSettings.getCopyrightInfo() + "</b>";
    public _siteTwitterUrl: string;
    public _siteFacebookUrl: string;
    public _siteGoogleUrl: string;
    public _sportLeagueFull: string = GlobalSettings.getSportLeagueFull();
    public _lastUpdated: string;
    public advertise: string = "Advertise with ";
    public contactUs: string = "Contact Us";
    public disc: string = "Disclaimer";
    public siteMap: string = "Site Map";
    public au: string = "About Us";
    public footerLinks: Object;

    image:string = GlobalSettings.mainIcon;
    teamDirectoryListings: Array<Link>;

    playerDirectoryListings: Array<Link>;

    constructor(private _service: FooterService, private _globalFunc: GlobalFunctions){//TODO
      if(isBrowser){
        this.currentUrl = window.location.href;
        this._siteTwitterUrl = GlobalSettings.getSiteTwitterUrl(this.currentUrl);
        this._siteFacebookUrl = GlobalSettings.getSiteFacebookUrl(this.currentUrl);
        this._siteGoogleUrl = GlobalSettings.getSiteGoogleUrl(this.currentUrl);
      }
      this.teamDirectory();
      this.playerDirectory();
    }

    loadData(partner: string) {
      var checkPartner = GlobalSettings.getHomeInfo().isPartner;
      if(!partner && !checkPartner) {
          this.pageName = GlobalSettings.getBaseTitle();
          this._lastUpdated = new Date().getFullYear() +" Copyright " + this._globalFunc.capitalizeFirstLetter(GlobalSettings._mainPageUrl);
          this.advertise += this.pageName;
     } else {
          this.pageName = GlobalSettings.getBasePartnerTitle();
          this._lastUpdated = new Date().getFullYear() +" Copyright " + GlobalSettings.getBasePartnerTitle();
      }
    }

    teamDirectory() {//TODO
      this._service.getFooterService(GlobalSettings.getScopeNow(), "team")
      .subscribe(data => {
        this.teamDirectoryListings = data;
      },
      err => {
        console.log("Error getting footer data");
      });
    }

    playerDirectory() {//TODO
      this._service.getFooterService(GlobalSettings.getScopeNow(), "player")
      .subscribe(data => {
        this.playerDirectoryListings = data;
      },
      err => {
        console.log("Error getting footer data");
      });
    }

    ngOnInit() {
        this.loadData(this.partnerID);
        var scope = this.scopeParam == 'home' || this.scopeParam == null ? 'nfl' : this.scopeParam;
        let partnerLink = VerticalGlobalFunctions.getWhiteLabel();
        var baseFooterLink = partnerLink != '' ? [partnerLink, scope] : [scope];
        var siteMap = partnerLink != '' ? [partnerLink, 'sitemap'] : ['/sitemap'];

        this.footerLinks = {
          aboutUs: baseFooterLink.concat(['about-us']),
          contactUs: baseFooterLink.concat(['contact-us']),
          disclaimer: baseFooterLink.concat(['disclaimer']),
          siteMap: siteMap
        }
    }
}
