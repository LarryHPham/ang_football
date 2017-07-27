import { Component, OnInit } from '@angular/core';
import { AppComponent }  from '../app-component/app.component';
import { GlobalSettings } from "../global/global-settings";
import { isBrowser, isNode } from 'angular2-universal';

declare var Zone;

@Component({
  selector: 'app-sitemap',
  templateUrl: './app.sitemap.html',
  styles: []
})
export class AppSiteMap implements OnInit{
  ngOnInit(){
  }
}
