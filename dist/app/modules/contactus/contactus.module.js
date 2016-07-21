System.register(['@angular/core', '../../components/backtab/backtab.component', '../../components/title/title.component', '@angular/common'], function(exports_1, context_1) {
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
    var core_1, backtab_component_1, title_component_1, common_1;
    var ContactUsModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (backtab_component_1_1) {
                backtab_component_1 = backtab_component_1_1;
            },
            function (title_component_1_1) {
                title_component_1 = title_component_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            ContactUsModule = (function () {
                function ContactUsModule() {
                    this.contactusOutput = new core_1.EventEmitter();
                    this.active = true; // by default set the form to a pristine state on load
                }
                ContactUsModule.prototype.formSubmit = function (data) {
                    var _this = this;
                    //Validate form inputs
                    try {
                        if (data.description === null && data.email === null && data.name === null) {
                            throw 'Please enter your name, email, and a detailed description';
                        }
                        if (data.name === null) {
                            throw 'Please enter your name in the Full Name field.';
                        }
                        if (data.email === null) {
                            throw 'Please enter an email in the Email Address field.';
                        }
                        if (data.description === null) {
                            throw 'Please enter a message in the Description field.';
                        }
                        data.email = data.email ? data.email.trim() : "";
                        var emailPattern = /^.+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                        if (!emailPattern.test(data.email)) {
                            throw 'Please enter a valid email in the Email Address field.';
                        }
                    }
                    catch (e) {
                        window.alert(e);
                        return false;
                    }
                    //Pass form data to parent component
                    this.contactusOutput.next(data);
                    alert('Form has been submitted check email:\n ' + data.email + '\n For your ticket');
                    // reset the  form by removing it and re-adding the form to a new pristine state
                    this.active = false;
                    setTimeout(function () { return _this.active = true; }, 0);
                };
                // reset the  form by removing it and re-adding the form to a new pristine state
                ContactUsModule.prototype.reset = function () {
                    var _this = this;
                    this.active = false;
                    setTimeout(function () { return _this.active = true; }, 0);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ContactUsModule.prototype, "contactusInput", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], ContactUsModule.prototype, "contactusOutput", void 0);
                ContactUsModule = __decorate([
                    core_1.Component({
                        selector: 'contactus-module',
                        templateUrl: './app/modules/contactus/contactus.module.html',
                        directives: [common_1.FORM_DIRECTIVES, backtab_component_1.BackTabComponent, title_component_1.TitleComponent],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], ContactUsModule);
                return ContactUsModule;
            }());
            exports_1("ContactUsModule", ContactUsModule);
        }
    }
});
