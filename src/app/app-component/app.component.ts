import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { GlobalSettings } from "../global/global-settings";
import { GeoLocation } from "../global/global-service";
import { isBrowser, isNode } from 'angular2-universal';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public scopeParam: any;
  public partnerID: string;
  public iframeMaxHeight: string;
  public partnerScript: string;
  private isLoading: boolean = true;
  private scrollPadding: string = '100px';

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _geoLocation: GeoLocation
  ) {
    this._activatedRoute.params.subscribe(
      (params: any) => {
        this._activatedRoute.firstChild.params.subscribe(
          (childParams: any) => {
            if (isNode) {
              console.log(params, childParams);
            }
            try {
              let siteScope = childParams.scope ? childParams.scope.toLowerCase() : '';
              if (siteScope == 'nfl' || siteScope == 'ncaaf' || siteScope == 'fbs' || siteScope == 'home' || siteScope == '') {
                this.scopeParam = siteScope ? '/' + siteScope : '/nfl';
                //function that grabs the designated location needed for the client and if a partnerID is sent through then it will also set the partnerID and partnerScript for their Header
                if (GlobalSettings.getHomeInfo().isSubdomainPartner) {
                  if (isBrowser) {
                    var hostname = window.location.hostname;
                    this.partnerID = window.location.hostname.split('.')[1] + '.' + window.location.hostname.split('.')[2];
                  }
                } else {
                  GlobalSettings.storedPartnerId(params.partnerID);
                  this.partnerID = params.partnerID;
                }
                this._geoLocation.grabLocation(this.partnerID).subscribe(res => {
                  if (res.partner_id) {
                    GlobalSettings.storedPartnerId(res.partner_id);
                    this.partnerID = res.partner_id;
                  }
                  if (res.partner_script) {
                    this.iframeMaxHeight = res.partner_height + 'px';
                    this.partnerScript = res.partner_script;
                  }
                });// end of geo location subscribe
              } else {
                if((params.partnerID == '' || params.partnerID == null) && childParams.scope != null){//Redirect to see if the scope was possibly a partner page
                  this._router.navigate(['/'+childParams.scope+'/home']);
                }else{
                  this._router.navigate(['/error-page']);//otherwise go straight to error page
                }
              }
            } catch (e) {
              this._router.navigate(['/error-page']);
            }
          }//end of child params
        )
      }//end of parent activated param
    );
  } //constructor

  ngOnInit() {
    if (isBrowser) {
      this._router.events.subscribe((navigation) => {
        if (!(navigation instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
    }
  }

  setScrollPadding(event) {
    this.scrollPadding = event + 'px';
  }
}
