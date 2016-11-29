import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Title} from '@angular/platform-browser';

import {GlobalSettings} from '../../global/global-settings';
import {SidekickWrapper} from "../../fe-core/components/sidekick-wrapper/sidekick-wrapper.component";
// import {SeoService} from "../../seo.service";
// import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";

declare var moment;
@Component({
    selector: 'contactus-page',
    templateUrl: './app/webpages/contactus-page/contactus.page.html',
})
export class ContactUsPage{
    public widgetPlace: string = "widgetForPage";
    //Object that builds contact us module
    public mailManUrl: string;
    public contactusInput: Object;

    constructor(
      private http:Http,
      private _title: Title
      // private _seoService: SeoService
    ) {
      //check to see if scope is correct and redirect
      // VerticalGlobalFunctions.scopeRedirect(_router, _params);
      // GlobalSettings.getParentParams(_router, parentParams => {
      //     var domainTitle;
      //     if(parentParams.partnerID != null){
      //       domainTitle = GlobalSettings.getBasePartnerTitle();
      //     }else{
      //       domainTitle = GlobalSettings.getBaseTitle();
      //     }
      //
      //     this.contactusInput = {
      //         subjects: [
      //             {
      //                 value: 'General Feedback',
      //                 id: 'general'
      //             },
      //             {
      //                 value: 'Advertisement',
      //                 id: 'advertisement'
      //             },
      //             {
      //                 value: 'Copyright Infringement',
      //                 id: 'copyright'
      //             },
      //             {
      //                 value: 'Inquire about partnering with '+ domainTitle,
      //                 id: 'inquire'
      //             }
      //         ],
      //         titleData: {
      //             imageURL: GlobalSettings.getSiteLogoUrl(),
      //             text1: 'Last Updated: Thursday, Aug. 4, 2016',
      //             text2: ' United States',
      //             text3: 'Have a question about '+domainTitle+'? Write us a message.',
      //             text4: '',
      //             icon: 'fa fa-map-marker'
      //         }
      //     }
      //   });
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
              if(form[items] !== null){
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
    }

    ngAfterViewInit(){
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc = 'Contact Us about any inquiries or issues with the site or data that does seems inaccurate';
      let link = window.location.href;
      //
      // this._seoService.setCanonicalLink(this._params.params, this._router);
      // this._seoService.setOgTitle('Contact Us');
      // this._seoService.setOgDesc(metaDesc);
      // this._seoService.setOgType('Website');
      // this._seoService.setOgUrl(link);
      // this._seoService.setOgImage(GlobalSettings.getmainLogoUrl());
      // this._seoService.setTitle('Contact Us');
      // this._seoService.setMetaDescription(metaDesc);
      // this._seoService.setMetaRobots('INDEX, FOLLOW');
    }
}
