import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalSettings } from '../../global/global-settings';
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//services
import { SeoService } from "../../seo.service";

import { SidekickWrapper } from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
// import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

declare var moment;
@Component({
    selector: 'contactus-page',
    templateUrl: './contactus.page.html',
})
export class ContactUsPage {
    public scope: string;
    public storedPartnerParam: string;

    public widgetPlace: string = "widgetForPage";
    //Object that builds contact us module
    public mailManUrl: string;
    public contactusInput: Object;

    constructor(
      private activatedRoute: ActivatedRoute,
      private http:Http,
      private _title: Title,
      private _seoService: SeoService
    ) {
      this.activatedRoute.params.subscribe(
        (param :any)=> {
          this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';
        }
      );
      this.storedPartnerParam = VerticalGlobalFunctions.getWhiteLabel();

      var domainTitle = this.storedPartnerParam != '/' ? GlobalSettings.getBasePartnerTitle() : GlobalSettings.getBaseTitle();
      this.contactusInput = {
        subjects: [
          {
            value: 'General Feedback',
            id: 'general'
          },
          {
            value: 'Advertisement',
            id: 'advertisement'
          },
          {
            value: 'Copyright Infringement',
            id: 'copyright'
          },
          {
            value: 'Inquire about partnering with '+ domainTitle,
            id: 'inquire'
          }
        ],
        titleData: {
          imageURL: GlobalSettings.getSiteLogoUrl(),
          text1: 'Last Updated: Thursday, Aug. 4, 2016',
          text2: ' United States',
          text3: 'Have a question about '+domainTitle+'? Write us a message.',
          text4: '',
          icon: 'fa fa-map-marker'
        }
      } //this.contactusInput
    }



    formSubmitted(form){
        //start the form url to mailer and prepare for all the options user has checked
        this.mailManUrl = GlobalSettings.getApiUrl() + '/mailer';
        var options = [];

        //run through each case and append it to the url note the component should catch if client did not fill our entire form
        for(var items in form){
          switch(items){
            case 'name':
            this.mailManUrl += '/'+form[items];//items should equal 'name' here but in case of any type of changes
            break;
            case 'email':
            this.mailManUrl += '/'+form[items];//items should equal 'email' here but in case of any type of changes
            break;
            case 'description':
            this.mailManUrl += '/'+ encodeURIComponent(form[items]);//items should equal 'description' here but in case of any type of changes
            break;
            default:
              if(form[items] !== null && form[items] != ""){
                options.push(items);
              }
            break;
          }
        }

        //join all the options that were checked with commas and append to end of mailManUrl
        var stringOptions = options.join(',');
        this.mailManUrl += '/'+stringOptions
        //send to backend the full mail url of all options

        this.http.get(this.mailManUrl,{})
    } //formSubmitted



    ngAfterViewInit(){
      this.metaTags();
      GlobalSettings.setPreboot();
    }



    metaTags() {
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc = 'Contact Us about any inquiries or issues with the site or data that does seems inaccurate';
      this._seoService.setTitle('Contact Us');
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();
      this._seoService.setMetaRobots('INDEX, FOLLOW');
      this._seoService.setOgTitle('Contact Us');
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('Website');
      this._seoService.setOgUrl();
      this._seoService.setOgImage(GlobalSettings.getmainLogoUrl());
    } //metaTags
}
