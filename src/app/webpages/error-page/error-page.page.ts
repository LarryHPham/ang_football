import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalSettings } from '../../global/global-settings';
import { SidekickWrapper } from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";

//services
import { SeoService } from "../../seo.service";



@Component({
    selector: 'Error-page',
    templateUrl: './error-page.page.html'
})

export class ErrorPage {
  public partnerID: string;
  public scope: string;

  public errorMessage: string;
  public pageLink: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private _title: Title,
    private _seoService: SeoService
  ) {
      // this._seoService.setTitle('Error Page');
      // this._seoService.setMetaRobots('NOINDEX, NOFOLLOW');
      this.activateRoute.params.subscribe(
        (param :any)=> {
          this.partnerID = param['partnerID'];
        }
      )

      this.loadData(this.partnerID);
  } //constructor



  loadData(partnerID:string) {
    this.pageLink = GlobalSettings.getHomePage(partnerID);
    this.errorMessage = "Oops! That page doesn't exist! Try Refreshing or go to <a class='text-master' href='/'"+ this.pageLink +"'> our home page</a>!";
  } //loadData
}
