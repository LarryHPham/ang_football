System.register(['@angular/core', '@angular/common', '../../services/box-scores.service'], function(exports_1, context_1) {
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
    var core_1, common_1, box_scores_service_1;
    var DatePicker;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (box_scores_service_1_1) {
                box_scores_service_1 = box_scores_service_1_1;
            }],
        execute: function() {
            DatePicker = (function () {
                function DatePicker(cd, viewContainer, _boxScores) {
                    this._boxScores = _boxScores;
                    this.changed = new core_1.EventEmitter();
                    cd.valueAccessor = this;
                    this.cd = cd;
                    this.viewContainer = viewContainer;
                    this.el = viewContainer.element.nativeElement;
                    this.init();
                }
                //makes weekly api call and sets reactive variables
                DatePicker.prototype.callMonthApi = function (params) {
                    var _this = this;
                    // this.weeklyApi = null;// resets call to load loading Gif as it waits for data
                    return this._boxScores.validateMonth(params.profile, params.date, params.teamId)
                        .map(function (data) {
                        _this.monthlyDates = _this.monthFormat(params.date, data.data);
                    });
                };
                //Below relys strongly on API whether or not it returns every correct day of the month or not
                DatePicker.prototype.monthFormat = function (dateChosen, monthData) {
                    var dateObj = {};
                    //run through each of the Unix (UTC) dates and convert them to readable EST dates
                    for (var date in monthData) {
                        var newDate = moment(Number(date)).tz('America/New_York').format('YYYY-MM-DD');
                        //set each of the dates the EST from UTC and change format to respective format
                        dateObj[newDate] = monthData[date];
                    }
                    return dateObj;
                };
                DatePicker.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    this.curDateView = { profile: this.chosenParam.profile, teamId: this.chosenParam.teamId, date: this.chosenParam.date };
                    this.callMonthApi(this.chosenParam)
                        .subscribe(function (data) {
                        _this.generateDayNames();
                        _this.generateCalendar(_this.date);
                        _this.initValue();
                    });
                };
                DatePicker.prototype.openDatepicker = function () {
                    if (this.isOpened == null || this.isOpened == false) {
                        this.isOpened = true;
                    }
                    else {
                        this.isOpened = false;
                    }
                };
                DatePicker.prototype.closeDatepicker = function () {
                    this.isOpened = false;
                };
                DatePicker.prototype.prevYear = function () {
                    this.date.subtract(1, 'Y');
                    this.generateCalendar(this.date);
                };
                DatePicker.prototype.prevMonth = function () {
                    var _this = this;
                    this.date.subtract(1, 'M');
                    this.curDateView.date = this.date.tz('America/New_York').format('YYYY-MM-DD');
                    this.callMonthApi(this.curDateView)
                        .subscribe(function (data) {
                        _this.generateDayNames();
                        _this.generateCalendar(_this.date);
                    });
                    this.generateCalendar(this.date);
                };
                DatePicker.prototype.nextYear = function () {
                    this.date.add(1, 'Y');
                    this.generateCalendar(this.date);
                };
                DatePicker.prototype.nextMonth = function () {
                    var _this = this;
                    this.date.add(1, 'M');
                    this.curDateView.date = this.date.tz('America/New_York').format('YYYY-MM-DD');
                    this.callMonthApi(this.curDateView)
                        .subscribe(function (data) {
                        _this.generateDayNames();
                        _this.generateCalendar(_this.date);
                    });
                    this.generateCalendar(this.date);
                };
                DatePicker.prototype.selectDate = function (e, date) {
                    e.preventDefault();
                    if (this.isSelected(date))
                        return;
                    var selectedDate = moment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
                    this.setValue(selectedDate);
                    // this.closeDatepicker();
                    this.changed.emit(selectedDate.toDate());
                    this.closeDatepicker();
                };
                DatePicker.prototype.generateCalendar = function (date) {
                    var lastDayOfMonth = date.endOf('month').date();
                    var month = date.month();
                    var year = date.year();
                    var n = 1;
                    var firstWeekDay = null;
                    this.dateValue = "<span class='text-heavy'>" + date.format('MMMM') + " </span><span> " + date.format('YYYY') + "</span>"; //designed wanted double spacing
                    this.days = [];
                    var days42 = 42;
                    if (this.firstWeekDaySunday === true) {
                        firstWeekDay = date.set('date', 2).day();
                    }
                    else {
                        firstWeekDay = date.set('date', 1).day();
                    }
                    if (firstWeekDay !== 1) {
                        n -= firstWeekDay - 1;
                    }
                    if (n > 0) {
                        n -= 7;
                    }
                    var finalDaysOfWeek = days42 - lastDayOfMonth;
                    finalDaysOfWeek = finalDaysOfWeek - ((n - 1) * (-1));
                    for (var i = n; i <= (lastDayOfMonth + finalDaysOfWeek); i += 1) {
                        var fullDate = moment(year + '-' + (Number(month) + 1) + '-' + i, 'YYYY-MM-DD').format('YYYY-MM-DD');
                        var today = (this.today == fullDate);
                        if (i <= 0) {
                            var prevMonthLastDay = new moment().date(i).tz('America/New_York').format('D');
                            this.days.push({ day: prevMonthLastDay, month: null, year: null, enabled: false, today: false });
                        }
                        else if (i > 0 && i <= lastDayOfMonth) {
                            this.days.push({ day: i, month: month + 1, year: year, enabled: this.monthlyDates[fullDate], today: today });
                        }
                        else if (i > lastDayOfMonth) {
                            var dayAdd = i % lastDayOfMonth;
                            var nextMonthFirstDay = new moment().add(1, 'months').date(dayAdd).tz('America/New_York').format('D');
                            this.days.push({ day: nextMonthFirstDay, month: null, year: null, enabled: false, today: false });
                        }
                    }
                    /* OLD CODE
                    for (let i = n; i <= lastDayOfMonth; i += 1) {
                      let fullDate = moment(date.year + '-' + date.month + '-' + date.day, 'DD-MM-YYYY')
                      if (i > 0) {
                        this.days.push({ day: i, month: month + 1, year: year, enabled: true});
                      } else {
                        this.days.push({ day: null, month: null, year: null, enabled: false });
                      }
                    }
                    */
                };
                DatePicker.prototype.isSelected = function (date) {
                    var selectedDate = moment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
                    return selectedDate.toDate().getTime() === this.cannonical;
                };
                DatePicker.prototype.generateDayNames = function () {
                    this.dayNames = [];
                    var date = this.firstWeekDaySunday === true ? moment('2015-06-07') : moment('2015-06-01');
                    for (var i = 0; i < 7; i += 1) {
                        this.dayNames.push(date.format('dd'));
                        date.add('1', 'd');
                    }
                };
                DatePicker.prototype.initMouseEvents = function () {
                    var _this = this;
                    var body = document.getElementsByTagName('body')[0];
                    body.addEventListener('click', function (e) {
                        if (!_this.isOpened || !e.target)
                            return;
                        if (_this.el !== e.target && !_this.el.contains(e.target)) {
                            _this.closeDatepicker();
                        }
                    }, false);
                };
                DatePicker.prototype.setValue = function (value) {
                    var val = moment(value, this.modelFormat || 'YYYY-MM-DD');
                    this.viewValue = val.format(this.viewFormat || 'Do MMMM YYYY');
                    this.cd.viewToModelUpdate(val.format(this.modelFormat || 'YYYY-MM-DD'));
                    this.cannonical = val.toDate().getTime();
                };
                DatePicker.prototype.initValue = function () {
                    var _this = this;
                    setTimeout(function () {
                        if (!_this.initDate) {
                            _this.setValue(moment().format(_this.modelFormat || 'YYYY-MM-DD'));
                        }
                        else {
                            _this.setValue(moment(_this.initDate, _this.modelFormat || 'YYYY-MM-DD'));
                        }
                    });
                };
                DatePicker.prototype.writeValue = function (value) {
                    if (!value)
                        return;
                    this.setValue(value);
                };
                DatePicker.prototype.registerOnChange = function (fn) {
                    this.onChange = fn;
                };
                DatePicker.prototype.registerOnTouched = function (fn) {
                    this.onTouched = fn;
                };
                DatePicker.prototype.init = function () {
                    this.isOpened = false;
                    this.date = moment().tz('America/New_York');
                    this.today = moment().tz('America/New_York').format('YYYY-MM-DD');
                    this.firstWeekDaySunday = true;
                    this.initMouseEvents();
                };
                __decorate([
                    core_1.Input('model-format'), 
                    __metadata('design:type', String)
                ], DatePicker.prototype, "modelFormat", void 0);
                __decorate([
                    core_1.Input('view-format'), 
                    __metadata('design:type', String)
                ], DatePicker.prototype, "viewFormat", void 0);
                __decorate([
                    core_1.Input('init-date'), 
                    __metadata('design:type', String)
                ], DatePicker.prototype, "initDate", void 0);
                __decorate([
                    core_1.Input('first-week-day-sunday'), 
                    __metadata('design:type', Boolean)
                ], DatePicker.prototype, "firstWeekDaySunday", void 0);
                __decorate([
                    core_1.Input('static'), 
                    __metadata('design:type', Boolean)
                ], DatePicker.prototype, "isStatic", void 0);
                __decorate([
                    core_1.Input('disabled-days'), 
                    __metadata('design:type', Array)
                ], DatePicker.prototype, "disabledDays", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DatePicker.prototype, "viewValue", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DatePicker.prototype, "chosenParam", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], DatePicker.prototype, "changed", void 0);
                DatePicker = __decorate([
                    core_1.Component({
                        selector: 'datepicker[ngModel]',
                        templateUrl: './app/components/date-picker/date-picker.component.html',
                        providers: [],
                        directives: [common_1.FORM_DIRECTIVES, common_1.NgIf, common_1.NgFor, common_1.NgClass],
                        pipes: []
                    }), 
                    __metadata('design:paramtypes', [common_1.NgModel, core_1.ViewContainerRef, box_scores_service_1.BoxScoresService])
                ], DatePicker);
                return DatePicker;
            }());
            exports_1("DatePicker", DatePicker);
        }
    }
});
