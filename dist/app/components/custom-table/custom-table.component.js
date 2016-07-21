System.register(['@angular/core', '@angular/router-deprecated', '../../components/custom-table/table-header.component', '../../components/custom-table/table-cell.component', '../../components/images/circle-image', '../../components/responsive-widget/responsive-widget.component'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, table_header_component_1, table_cell_component_1, circle_image_1, responsive_widget_component_1;
    var CustomTable;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (table_header_component_1_1) {
                table_header_component_1 = table_header_component_1_1;
            },
            function (table_cell_component_1_1) {
                table_cell_component_1 = table_cell_component_1_1;
            },
            function (circle_image_1_1) {
                circle_image_1 = circle_image_1_1;
            },
            function (responsive_widget_component_1_1) {
                responsive_widget_component_1 = responsive_widget_component_1_1;
            }],
        execute: function() {
            CustomTable = (function () {
                function CustomTable() {
                    this.sortChanged = new core_1.EventEmitter(true); //async=true
                    this.isSortDropdownVisible = false;
                    /**
                     * If true, then the table body and footer are given the style ".custom-table-compact",
                     * which uses a smaller font-size and smaller table rows.
                     * Otherwise, the table body and footer are given the style ".custom-table-body".
                     */
                    this.isCompactStyle = false;
                }
                CustomTable.prototype.ngOnChanges = function () {
                    this.updateData();
                };
                CustomTable.prototype.updateData = function () {
                    this.bodyClass = this.isCompactStyle ? "custom-table-compact" : "custom-table-body";
                    if (this.model === undefined || this.model === null) {
                        return;
                    }
                    this.columns = this.model.columns;
                    var sortedColumn = null;
                    var columnIndex = 0;
                    this.columns.forEach(function (col) {
                        if (col.sortDirection && !sortedColumn) {
                            sortedColumn = col;
                        }
                    });
                    // this.updateRows();
                    if (sortedColumn !== null) {
                        this.sortRows(sortedColumn);
                    }
                };
                CustomTable.prototype.setSortColumn = function ($event, $event1) {
                    //Remove sort on other columns;
                    var sortedColumn = $event[0];
                    var sortedIndex = +$event[1]; //make a number
                    this.model.columns.forEach(function (col, i) {
                        if (i !== sortedIndex) {
                            col.sortDirection = 0;
                        }
                    });
                    this._tableHeaders.forEach(function (item, index) {
                        item.setSortIcon();
                    });
                    this.sortRows(sortedColumn);
                };
                CustomTable.prototype.sortRows = function (tableHdr) {
                    var _this = this;
                    this.model.rows.sort(function (row1, row2) {
                        var value1 = _this.model.getCellData(row1, tableHdr).sort;
                        var value2 = _this.model.getCellData(row2, tableHdr).sort;
                        if (value1 == null || value2 == null) {
                            return value1 == null ? (value2 == null ? 0 : 1) : -1;
                        }
                        //Comparison method works for both numbers and strings
                        if (value1 > value2) {
                            return tableHdr.sortDirection * 1;
                        }
                        if (value1 < value2) {
                            return tableHdr.sortDirection * -1;
                        }
                        return 0;
                    });
                    this.sortChanged.next(this.model.rows);
                };
                __decorate([
                    core_1.ViewChildren(table_header_component_1.TableHeader), 
                    __metadata('design:type', Array)
                ], CustomTable.prototype, "_tableHeaders", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], CustomTable.prototype, "sortChanged", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], CustomTable.prototype, "model", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], CustomTable.prototype, "isCompactStyle", void 0);
                CustomTable = __decorate([
                    core_1.Component({
                        selector: 'custom-table',
                        templateUrl: './app/components/custom-table/custom-table.component.html',
                        directives: [table_header_component_1.TableHeader, table_cell_component_1.TableCell, circle_image_1.CircleImage, router_deprecated_1.ROUTER_DIRECTIVES, responsive_widget_component_1.ResponsiveWidget]
                    }), 
                    __metadata('design:paramtypes', [])
                ], CustomTable);
                return CustomTable;
            }());
            exports_1("CustomTable", CustomTable);
        }
    }
});
