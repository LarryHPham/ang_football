System.register(['@angular/core', '@angular/http', './global-settings'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, global_settings_1;
    var PartnerHeader;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            }],
        execute: function() {
            PartnerHeader = (function () {
                function PartnerHeader(http) {
                    this.http = http;
                    this.protocolToUse = (location.protocol == "https:") ? "https" : "http";
                }
                //API for listing profile
                PartnerHeader.prototype.getPartnerData = function (partner_id) {
                    // var partnerID = partner_id.split('-');
                    //
                    // //handles some cases where domain registries are different
                    // var combinedID = [];
                    // var domainRegisters = [];
                    // for(var i = 0; i < partnerID.length; i++){
                    //     if(partnerID[i] == "com" || partnerID[i] == "gov" || partnerID[i] == "net" || partnerID[i] == "org" || partnerID[i] == "co"){
                    //       combinedID.push(partnerID[i]);
                    //     }else{
                    //       domainRegisters.push(partnerID[i]);
                    //     }
                    // }
                    //
                    // partner_id = domainRegisters.join('-')+ "." + combinedID.join('.');
                    var fullUrl = global_settings_1.GlobalSettings.getPartnerApiUrl(partner_id);
                    // console.log(fullUrl);
                    return this.http.get(fullUrl, {})
                        .map(function (res) { return res.json(); })
                        .map(function (data) {
                        return data;
                    });
                };
                PartnerHeader = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], PartnerHeader);
                return PartnerHeader;
            }());
            exports_1("PartnerHeader", PartnerHeader);
        }
    }
});
