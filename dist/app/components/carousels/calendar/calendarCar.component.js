System.register(['@angular/core', '../../../services/box-scores.service', '../../../global/global-functions', '../../date-picker/date-picker.component', '@angular/common'], function(exports_1, context_1) {
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
    var core_1, box_scores_service_1, global_functions_1, date_picker_component_1, common_1;
    var Test, CalendarCarousel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (box_scores_service_1_1) {
                box_scores_service_1 = box_scores_service_1_1;
            },
            function (global_functions_1_1) {
                global_functions_1 = global_functions_1_1;
            },
            function (date_picker_component_1_1) {
                date_picker_component_1 = date_picker_component_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            }],
        execute: function() {
            Test = (function () {
                function Test() {
                }
                return Test;
            }());
            CalendarCarousel = (function () {
                function CalendarCarousel(_boxScores) {
                    this._boxScores = _boxScores;
                    this.dateEmit = new core_1.EventEmitter();
                    this.failSafe = 0;
                }
                //datepicker that chooses the monthly calendar and update all the necessary functions for the rest of the components
                CalendarCarousel.prototype.datePicker = function (event) {
                    var _this = this;
                    this.chosenParam.date = moment(event).tz('America/New_York').format('YYYY-MM-DD');
                    this.callWeeklyApi(this.chosenParam)
                        .subscribe(function (data) {
                        _this.validateDate(_this.chosenParam.date, _this.weeklyDates);
                    });
                    this.dateEmit.next(this.chosenParam); //sends through output so date can be used outside of component
                };
                CalendarCarousel.prototype.ngOnInit = function () {
                    var _this = this;
                    //on load grab the input chosenParam and set new variable for currently viewing dates that is used for any changes without changing initial input while it goes through validation
                    var params = this.chosenParam;
                    this.curDateView = { profile: params.profile, teamId: params.teamId, date: params.date };
                    //make call to week api to grab to see if any games are available (true/false)
                    this.callWeeklyApi(this.chosenParam)
                        .subscribe(function (data) {
                        //then run through validation and set firstRun? option parameter to true
                        //validateDate(selectedDate, dateArray, firstRun?)
                        _this.validateDate(_this.chosenParam.date, _this.weeklyDates, true);
                    });
                };
                CalendarCarousel.prototype.ngOnChanges = function () {
                    var _this = this;
                    //any changes made to the input from outside will cause the fuction to rerun
                    if (this.chosenParam != null) {
                        this.callWeeklyApi(this.chosenParam)
                            .subscribe(function (data) {
                            _this.validateDate(_this.chosenParam.date, _this.weeklyDates);
                        });
                    }
                };
                CalendarCarousel.prototype.left = function () {
                    var _this = this;
                    //take parameters and convert using moment to subtract a week from it and recall the week api
                    var curParams = this.curDateView;
                    curParams.date = moment(curParams.date).subtract(7, 'days').format('YYYY-MM-DD');
                    this.callWeeklyApi(curParams).subscribe(function (data) { _this.validateDate(_this.chosenParam.date, _this.weeklyDates); });
                    this.curDateView.date = curParams.date; //resets current date to the new parameter so that all functions are updated with new date
                };
                CalendarCarousel.prototype.right = function () {
                    var _this = this;
                    //take parameters and convert using moment to add a week from it and recall the week api
                    var curParams = this.curDateView;
                    curParams.date = moment(curParams.date).add(7, 'days').format('YYYY-MM-DD');
                    this.callWeeklyApi(curParams).subscribe(function (data) { _this.validateDate(_this.chosenParam.date, _this.weeklyDates); });
                    this.curDateView.date = curParams.date; //resets current date to the new parameter so that all functions are updated with new date
                };
                //whatever is clicked on gets emitted and highlight on the carousel
                CalendarCarousel.prototype.setActive = function (event) {
                    if (!event.active) {
                        var resetState = this.weeklyDates;
                        resetState.forEach(function (val, i) {
                            val.active = false;
                        });
                        event.active = true;
                        this.chosenParam.date = event.fullDate;
                        this.dateEmit.next(this.chosenParam); //sends through output so date can be used outside of component
                    }
                };
                //makes weekly api call and sets reactive variables
                CalendarCarousel.prototype.callWeeklyApi = function (params) {
                    var _this = this;
                    // this.weeklyApi = null;// resets call to load loading Gif as it waits for data
                    return this._boxScores.weekCarousel(params.profile, params.date, params.teamId)
                        .map(function (data) {
                        _this.weeklyApi = data.data;
                        _this.weeklyDates = _this.weekFormat(params.date, _this.weeklyApi);
                    });
                };
                //week format to grab week call from api and format the data to what is needed for the HTML
                CalendarCarousel.prototype.weekFormat = function (dateChosen, weekData) {
                    var formattedArray = [];
                    //run through each of the Unix (UTC) dates and convert them to readable EST dates
                    for (var date in weekData) {
                        //set each of the dates the EST from UTC and change format to respective format
                        var year = moment(Number(date)).tz('America/New_York').format('YYYY');
                        var month = moment(Number(date)).tz('America/New_York').format('MMM');
                        var day = moment(Number(date)).tz('America/New_York').format('D');
                        var weekDay = moment(Number(date)).tz('America/New_York').format('ddd');
                        var fullDate = moment(Number(date)).tz('America/New_York').format('YYYY-MM-DD');
                        var ordinal = global_functions_1.GlobalFunctions.Suffix(Number(day));
                        var dateObj = {
                            unixDate: date,
                            fullDate: fullDate,
                            active: false,
                            clickable: weekData[date],
                            year: year,
                            month: month,
                            day: day,
                            weekDay: weekDay,
                            ordinal: ordinal,
                        };
                        //push all dateObj into array
                        formattedArray.push(dateObj);
                    }
                    return formattedArray;
                };
                /**
                  *validateDate(selectedDate, dateArray, firstRun?)
                  *selectedDate => date that is being sent into function
                  *dateArray => Array of dates to check with selected date and validate selected date
                  *firstRun (optional) => to run a different part of the function to determine if validatedDate function will run recursively or not
                  *
                  *curUnix => //converts chosen date to unix for comparison
                  *validatedDate => will be the closest game to the curdate being sent in default is 0
                  *minDateUnix => // sets the minimum date in unix of the current Array being sent back
                  *maxDateUnix => // sets the max date in unix of the current Array being sent back
                  *activeIndex => // if there is a validated date then grab the index or position of that date in the current array;
                  *mostRecent => // used mainly for first run. but if the chosent parameters on initial load does not match anything then this variable will grab the next most previous game that has happened.
                  *
                  */
                CalendarCarousel.prototype.validateDate = function (selectedDate, dateArray, firstRun) {
                    var _this = this;
                    var curUnix = moment(selectedDate, "YYYY-MM-DD").unix() * 1000;
                    var validatedDate = 0;
                    var minDateUnix = Number(dateArray[0].unixDate);
                    var maxDateUnix = Number(dateArray[dateArray.length - 1].unixDate);
                    var activeIndex;
                    var mostRecent;
                    dateArray.forEach(function (date, i) {
                        var dateUnix = Number(date.unixDate); //converts chosen date to unix (in seconds) for comparison
                        var dateTime = moment(dateUnix).tz('America/New_York').format('YYYY-MM-DD');
                        //grab highest and lowest number in the array to know the beginning and end of the week
                        if ((minDateUnix > dateUnix)) {
                            minDateUnix = dateUnix;
                        }
                        else if (dateUnix > maxDateUnix) {
                            maxDateUnix = dateUnix;
                        }
                        //FIRST RUN
                        if (firstRun != null) {
                            if ((selectedDate == date.fullDate) && date.clickable) {
                                validatedDate = dateUnix;
                                activeIndex = i; //SETS POSITION IN ARRAY THAT CURRENT DATE IS SET TO if the curUnix date exists within the current dateArray
                            }
                            else {
                                //sets most recent game before the curUnix date and index if they havent been found, while the validatedDate and clickability still hasn't been found
                                if (((mostRecent < date.unixDate && date.unixDate <= curUnix) && activeIndex == null) || (date.unixDate <= curUnix && date.clickable && validatedDate == 0)) {
                                    mostRecent = date.unixDate;
                                    activeIndex = i;
                                }
                            }
                        }
                        else {
                            //run through the array and set the valid date that has a game as the active key in the dateArray (attached to weeklyDates)
                            if ((selectedDate == date.fullDate) && date.clickable) {
                                validatedDate = dateUnix;
                                activeIndex = i;
                                dateArray[activeIndex].active = true;
                            }
                        }
                    });
                    if (firstRun != null) {
                        // run a loop 12 times(12 weeks) to try to grab the nearest most recently played game
                        //if no clickable date has been found and the 12 week check still works
                        if (mostRecent == null && validatedDate == 0 && this.failSafe < 12) {
                            this.failSafe++;
                            //set new curent date and chosent parameter to the last day of previous week and make that as the new view
                            var curDate = moment(minDateUnix).subtract(1, 'days').tz('America/New_York').format('YYYY-MM-DD');
                            this.chosenParam.date = curDate;
                            var params = this.chosenParam;
                            this.curDateView = { profile: params.profile, teamId: params.teamId, date: params.date };
                            //recall function with same chosenParam for validating
                            this.callWeeklyApi(this.chosenParam)
                                .subscribe(function (data) {
                                _this.validateDate(_this.chosenParam.date, _this.weeklyDates, true);
                            });
                        }
                        else {
                            //reset failsafe
                            this.failSafe = 0;
                            //make sure to only set new params if new number has been validatedDated
                            //otherwise set the new chosenParam to the mostRecent date that has been found
                            if (validatedDate != 0) {
                                validatedDate = moment(Number(validatedDate)).tz('America/New_York').format('YYYY-MM-DD');
                                this.chosenParam.date = validatedDate;
                                dateArray[activeIndex].active = true;
                            }
                            else {
                                validatedDate = moment(Number(mostRecent)).tz('America/New_York').format('YYYY-MM-DD');
                                this.chosenParam.date = validatedDate;
                                dateArray[activeIndex].active = true;
                            }
                            //sets new params and emit the date
                            var params_1 = this.chosenParam;
                            this.curDateView = { profile: params_1.profile, teamId: params_1.teamId, date: params_1.date };
                            this.dateEmit.next({ profile: params_1.profile, teamId: params_1.teamId, date: params_1.date }); //esmit variable that has been validated
                        }
                    }
                    //change validatedDate back into format for dateArray;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CalendarCarousel.prototype, "chosenParam", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], CalendarCarousel.prototype, "dateEmit", void 0);
                CalendarCarousel = __decorate([
                    core_1.Component({
                        selector: 'calendar-carousel',
                        templateUrl: './app/components/carousels/calendar/calendarCar.component.html',
                        directives: [date_picker_component_1.DatePicker, common_1.FORM_DIRECTIVES],
                        providers: [box_scores_service_1.BoxScoresService],
                    }), 
                    __metadata('design:paramtypes', [box_scores_service_1.BoxScoresService])
                ], CalendarCarousel);
                return CalendarCarousel;
            }());
            exports_1("CalendarCarousel", CalendarCarousel);
        }
    }
});
