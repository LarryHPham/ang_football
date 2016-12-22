import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../global/global-settings";
import { GeoLocation } from "../global/global-service";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public scopeParam: any;
  public partnerID:string;
  public partnerScript: string;
  private isLoading:boolean = true;
  private scrollPadding:string = '0px';

  constructor(
    private _router: Router,
    private _activatedRoute:ActivatedRoute,
    private _geoLocation: GeoLocation) {
      this._activatedRoute.firstChild.params.subscribe(
        (params:any) => {
          this.scopeParam = '/'+params.scope;
        }
      )
      this._activatedRoute.params.subscribe(
        (params:any) => {
          //function that grabs the designated location needed for the client and if a partnerID is sent through then it will also set the partnerID and partnerScript for their Header
          // if(GlobalSettings.getHomeInfo().isSubdomainPartner) {
          //   var hostname = window.location.hostname;
          //   this.partnerID = window.location.hostname.split('.')[1] + '.' + window.location.hostname.split('.')[2];
          // } else {
            GlobalSettings.storedPartnerId(params.partnerID);
            this.partnerID = params.partnerID;
          // }
          // this._geoLocation.grabLocation(this.partnerID).subscribe(res => {
          //   if(res.partner_id){
          //     GlobalSettings.storedPartnerId(res.partner_id);
          //     this.partnerID = res.partner_id;
          //   }
          //   if(res.partner_script){
          //     this.partnerScript = res.partner_script;
          //   }
          // });
        }
      );
  } //constructor

  setScrollPadding(event){
    this.scrollPadding = event + 'px';
  }
}
