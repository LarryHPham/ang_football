/*
 GLOBAL SERVICE INDEX

 @LOCATIONPROFILE
 _@BATCH-1
 _@BATCH
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from "rxjs/Observable";
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";
import { ModelService } from '../global/shared/model/model.service';
import { isBrowser, isNode } from 'angular2-universal';

export interface geoLocate {
    partner_id?: string;
    partner_script?: string;
    state?: string;
    city?: string;
    zipcode?: string;
}

@Injectable()

export class GeoLocation{
    geoData: geoLocate;

    geoObservable: Observable<any>

    constructor( public http: Http, public model: ModelService ) { }


    getPartnerData(partner_id) {
      // let env = window.location.hostname.split('.')[0];
      let env = 'localhost';
      if(env == 'localhost'){
        var partnerID = partner_id.split('-');

        //handles some cases where domain registries are different
        var combinedID = [];
        var domainRegisters = [];
        for (var i = 0; i < partnerID.length; i++) {
            if (partnerID[i] == "com" || partnerID[i] == "gov" || partnerID[i] == "net" || partnerID[i] == "org" || partnerID[i] == "co") {
                combinedID.push(partnerID[i]);
            } else {
                domainRegisters.push(partnerID[i]);
            }
        }

        partner_id = domainRegisters.join('-') + "." + combinedID.join('.');
      }

        var fullUrl = GlobalSettings.getPartnerApiUrl(partner_id);
        return this.model.get(fullUrl)
            .flatMap(
            data => {
              try {
                if (data[0] != null) {
                  let partnerData = data[0];
                  let partnerScript = partnerData.script;
                  let partnerHeight = partnerData.height;
                  if (!this.geoData) {
                    this.geoData = {};
                  }
                  this.geoData['partner_id'] = partner_id;
                  this.geoData['partner_script'] = partnerScript;
                  this.geoData['partner_height'] = partnerHeight;
                  if (partnerData.state && partnerData.city) {
                    this.geoData['state'] = partnerData.state;
                    this.geoData['city'] = partnerData.city;
                    return new Observable(observer => {
                      observer.next(this.geoData);
                      observer.complete();
                    });
                  } else {
                    return this.getGeoLocation();
                  }
                } else {
                  return this.getGeoLocation();
                }
              } catch(e) {
                return this.getGeoLocation();
              }
                // return data;
            }
            )
            .share();
    }

    //api to get geo location
    getGeoLocation() {
      var getGeoLocation = GlobalSettings.getGeoLocation() + '/getlocation/2';
      // var getGeoLocation = '//dev-waldo.synapsys.us/ip2loc/69.178.104.1/2';

      if(isNode){
        console.log("Server Detected setting geolocation to national");
        if (!this.geoData) {
          this.geoData = {};
        }
        this.geoData['state'] = 'us';
        this.geoData['city'] = null;
        this.geoData['zipcode'] = null;
        return new Observable(observer => {
            observer.next(this.geoData);
            observer.complete();
        });
      }else{
        return this.model.get(getGeoLocation)
        .map(
          data => {
            try{
              data[0].state = data[0].state == null ? 'us' : data[0].state;
              let state = data[0].state ? data[0].state.toLowerCase() : 'us';
              let city = data[0].city ? data[0].city.replace(/ /g, "%20") : null;
              let zipcode = data[0].zipcode;

              if (!this.geoData) {
                this.geoData = {};
              }

              this.geoData['state'] = state;
              this.geoData['city'] = city;
              this.geoData['zipcode'] = zipcode;

              return this.geoData;
            }catch(e){
              console.error(e);
              this.geoData['state'] = 'ks';
              this.geoData['city'] = 'wichita';
              return this.geoData;
            }
          })
          .share();
      }
    };

    grabLocation(partnerID?: string) {
        if (this.geoData) {
            return new Observable(observer => {
                observer.next(this.geoData);
                observer.complete();
            });
        } else if (this.geoObservable) {
            return this.geoObservable;
        } else {
            if (partnerID) {
                this.geoObservable = this.getPartnerData(partnerID);
            } else {
                this.geoObservable = this.getGeoLocation();
            }
            return this.geoObservable;
        }
    };
}
