System.register(['@angular/core', '@angular/http', '@angular/router-deprecated', '@angular/platform-browser', "../../modules/widget/widget.module", '../../modules/contactus/contactus.module', '../../global/global-settings', "../../components/sidekick-wrapper/sidekick-wrapper.component", '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, http_1, router_deprecated_1, platform_browser_1, widget_module_1, contactus_module_1, global_settings_1, sidekick_wrapper_component_1, responsive_widget_component_1;
    var ContactUsPage;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (widget_module_1_1) {
                widget_module_1 = widget_module_1_1;
            },
            function (contactus_module_1_1) {
                contactus_module_1 = contactus_module_1_1;
            },
            function (global_settings_1_1) {
                global_settings_1 = global_settings_1_1;
            },
            function (sidekick_wrapper_component_1_1) {
                sidekick_wrapper_component_1 = sidekick_wrapper_component_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            ContactUsPage = (function () {
                function ContactUsPage(http, _title, _router) {
                    var _this = this;
                    this.http = http;
                    this._title = _title;
                    this._router = _router;
                    this.widgetPlace = "widgetForPage";
                    _title.setTitle(global_settings_1.GlobalSettings.getPageTitle("Contact Us"));
                    global_settings_1.GlobalSettings.getPartnerID(_router, function (partnerID) {
                        var domainTitle;
                        if (partnerID != null) {
                            domainTitle = "My Home Run Zone";
                        }
                        else {
                            domainTitle = "Home Run Loyal";
                        }
                        _this.contactusInput = {
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
                                    value: 'Inquire about partnering with ' + domainTitle,
                                    id: 'inquire'
                                }
                            ],
                            titleData: {
                                imageURL: global_settings_1.GlobalSettings.getSiteLogoUrl(),
                                // text1: 'Last Updated: '+moment(new Date()).format('dddd MMMM Do, YYYY'),
                                text1: 'Last Updated: Friday, June 24th, 2016',
                                text2: ' United States',
                                text3: 'Have a question about ' + domainTitle + '? Write us a message.',
                                text4: '',
                                icon: 'fa fa-map-marker'
                            }
                        };
                    });
                }
                ContactUsPage.prototype.formSubmitted = function (form) {
                    //start the form url to mailer and prepare for all the options user has checked
                    this.mailManUrl = global_settings_1.GlobalSettings.getApiUrl() + '/mailer';
                    var options = [];
                    //run through each case and append it to the url note the component should catch if client did not fill our entire form
                    for (var items in form) {
                        switch (items) {
                            case 'name':
                                this.mailManUrl += '/' + form[items]; //items should equal 'name' here but in case of any type of changes
                                break;
                            case 'email':
                                this.mailManUrl += '/' + form[items]; //items should equal 'email' here but in case of any type of changes
                                break;
                            case 'description':
                                this.mailManUrl += '/' + encodeURIComponent(form[items]); //items should equal 'description' here but in case of any type of changes
                                break;
                            default:
                                if (form[items] !== null) {
                                    options.push(items);
                                }
                                break;
                        }
                    }
                    //join all the options that were checked with commas and append to end of mailManUrl
                    var stringOptions = options.join(',');
                    this.mailManUrl += '/' + stringOptions;
                    //send to backend the full mail url of all options
                    this.http.get(this.mailManUrl, {});
                };
                ContactUsPage.prototype.ngOnInit = function () {
                };
                ContactUsPage = __decorate([
                    core_1.Component({
                        selector: 'contactus-page',
                        templateUrl: './app/webpages/contactus-page/contactus.page.html',
                        directives: [sidekick_wrapper_component_1.SidekickWrapper, contactus_module_1.ContactUsModule, widget_module_1.WidgetModule, responsive_widget_component_1.ResponsiveWidget],
                        providers: [platform_browser_1.Title],
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, platform_browser_1.Title, router_deprecated_1.Router])
                ], ContactUsPage);
                return ContactUsPage;
            }());
            exports_1("ContactUsPage", ContactUsPage);
        }
    }
});
