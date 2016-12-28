import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

//globals
import { GlobalSettings } from '../global/global-settings';
import { ModelService } from '../global/shared/model/model.service';

@Injectable()
export class FaqService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public model: ModelService){}

  getFaqService(profile, id?){
    var fullUrl = this._apiUrl;
    fullUrl += "/faq/" + profile;

    if(id !== undefined){
      fullUrl += "/" + id;
    }
    return this.model.get(fullUrl)
      .map(
        data => {
          return this.faqData(data.data);
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }//getFaqService ends

  faqData(data){
    var self = this;
    var faqArray = [];
    data.forEach(function(val, index){
      if(index == 0){
        val.active = true;
      }else{
        val.active = false;
      }
      var FAQ = {
        answer: val.answer,
        question: val.question,
        active: val.active
      }
      faqArray.push(FAQ);
    });
    return faqArray;
  }
}
