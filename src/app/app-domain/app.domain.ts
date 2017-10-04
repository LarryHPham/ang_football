import { Component, OnInit } from '@angular/core';
import { AppComponent }  from '../app-component/app.component';
import { GlobalSettings } from "../global/global-settings";
import { isBrowser, isNode } from 'angular2-universal';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

declare var Zone;
declare var ga:any;
@Component({
  selector: 'app-domain',
  templateUrl: './app.domain.html',
  styles: [require('../global/stylesheets/main.less').toString()]
})
export class AppDomain implements OnInit{
  constructor( private _router: Router, private _activateRoute: ActivatedRoute){
   this._router.events.subscribe(event =>{
     if(event instanceof NavigationEnd){
       try {
         ga('send', 'pageview', location.pathname);
       } catch(e) {
         console.error("Failed to send pageview to Google Analytics. Error: ", e)
       }

     }
   })
  }
  ngOnInit(){
    GlobalSettings._env = isNode ? Zone.current.get('hostname').split('.')[0] : window.location.hostname.split('.')[0];// make sure Zone is declared and set the environment before rendering the rest of the page
    if(isNode){
      console.log('GETTING HOSTNAME: ',Zone.current.get('hostname'));
      console.log('GETTING ENV: ',Zone.current.get('hostname').split('.')[0]);
    }
  }

}
