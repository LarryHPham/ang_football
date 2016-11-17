import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalSettings } from "../global/global-settings";
import {FooterComponent} from "../ui-modules/footer/footer.component";
import {HeaderComponent} from "../ui-modules/header/header.component";

@Component({
  selector: 'my-app',
  templateUrl: 'app/app-component/app.component.html'
})
export class AppComponent {
  constructor(private _activatedRoute:ActivatedRoute){
    this._activatedRoute.params.subscribe(
        (params:any) => {
            console.log('Partner:',params);
            GlobalSettings.storePartnerId(params.partnerID);
        }
    );
  }
}
