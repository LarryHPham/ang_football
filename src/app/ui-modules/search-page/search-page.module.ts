import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { NgStyle } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

//interfaces
import { SearchInput } from '../../ui-modules/search/search.component';
import { PaginationParameters } from '../../fe-core/components/pagination-footer/pagination-footer.component';

export interface SearchPageInput {
    //Data for the search bar component
    searchComponent: SearchInput;
    //Search Image
    heroImage: string;
    //Title Text
    headerText: string;
    //Text under title of search header
    subHeaderText: string;
    //Query string of the search
    query: string;
    //Tab data
    tabData: Array<{
        //Name of Tab
        tabName: string;
        //Boolean to determine if tab is initially selected
        isTabDefault?: boolean;
        //Search results related to tab
        results: Array<{
            title: string;
            url: Array<any>;
            urlText: string;
            description: string;
        }>;
        error: {
            message: string;
            icon: string;
        };
        pageMax: any;
        totalResults: any;
        paginationParameters: PaginationParameters;
    }>
}

@Component({
    selector: 'search-page-module',
    templateUrl: './search-page.module.html'
})

export class SearchPageModule implements OnChanges {
    @Input() searchPageInput: SearchPageInput;
    @Input() dropdownFilter: Array<{ key: string, value: string }> = [];
    @Output() selectedKeyFilter = new EventEmitter();

    public partnerID: string;
    public scope: string;
    public pageNum: any;

    pageNumber: number;
    totalResults: number;
    currentShowing: string;
    currentFilter: any;
    selectedKey: string;

    constructor() {
      this.pageNumber = 1;
    } //constructor

    ngOnChanges() {
        this.configureSearchPageModule();
        this.getShowResults(this.searchPageInput);
    } //ngOnChanges

    configureSearchPageModule() {
        let input = this.searchPageInput;
    } //configureSearchPageModule

    filterSwitch($event) {
        this.pageNumber = 1;
        this.selectedKey = $event;
        this.selectedKeyFilter.next({
            dropdownIndex: 0,
            key: $event
        });
    }

    newIndex(index) {
        this.pageNumber = index;
        window.scrollTo(0, 0);
        this.getShowResults(this.searchPageInput);
    }

    getShowResults(data) {
        let self = this;
        data.tabData.forEach(function(val, index) {
            if (val.isTabDefault) {//Optimize
                if (val.results[self.pageNumber - 1] == null) {
                    val.results[self.pageNumber - 1] = [];
                }
                var pageMax = Number(val.pageMax);
                var currPage = Number(self.pageNumber);
                var totalItemsOnPage = val.results[self.pageNumber - 1].length;
                var rangeStart = (currPage - 1) * pageMax + 1;
                var rangeEnd = rangeStart + totalItemsOnPage - 1;
                if (val.results[self.pageNumber - 1].length > 0) {
                    self.currentShowing = rangeStart + ' - ' + rangeEnd;
                } else {
                    self.currentShowing = '0 - 0';
                }
                self.totalResults = Number(val.totalResults);
            }
        })
    }

    tabSelected(event) {
        this.pageNumber = 1;
        this.searchPageInput.tabData.forEach(function(val, index) {
            if (val.tabName == event) {//Optimize
                val.isTabDefault = true;
            } else {
                val.isTabDefault = false;
            }
        })
        this.getShowResults(this.searchPageInput);
    }
}
