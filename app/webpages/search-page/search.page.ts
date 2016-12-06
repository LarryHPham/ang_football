import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { VerticalGlobalFunctions } from '../../global/vertical-global-functions';

//services
import { SearchService } from '../../services/search.service';

//interfaces
import { SearchPageInput } from '../../fe-core/modules/search-page/search-page.module';

interface SearchPageParams {
    query: string;
}

@Component({
    selector: 'search-page',
    templateUrl: './app/webpages/search-page/search.page.html'
})

export class SearchPage implements OnInit {
    public pageParams: SearchPageParams;
    public partnerID: string;
    public scope: string;
    public query: string;

    public searchPageInput: SearchPageInput;
    public searchPageFilters: Array<any>;

    constructor(
      private activatedRoute: ActivatedRoute,
      private _router: Router,
      private _searchService: SearchService,
      private _title: Title
    ) {
        //check to see if scope is correct and redirect
        //VerticalGlobalFunctions.scopeRedirect(_router, _params);
        this.activatedRoute.params.subscribe(
          (param :any)=> {
            this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';
            this.query = param['query'];

            if (!GlobalSettings.getHomeInfo().isSubdomainPartner) {
              this.partnerID = param['partnerID'];
            }
          }
        )

        _title.setTitle(GlobalSettings.getPageTitle("Search"));
        let query = decodeURIComponent(this.query);
        this.pageParams = {
            query: query
        }
    } //constructor



    configureSearchPageData(filter?) {
        let self = this;
        let query = self.pageParams.query;cd

        if (typeof filter == 'undefined') {
            filter = null;
        }
        self._searchService.getSearch()
            .subscribe(
            data => {
                let searchData = self._searchService.getSearchPageData(this._router, this.partnerID, query, filter, data);
                self.searchPageInput = searchData.results;
                if (self.searchPageFilters == null) {
                    self.searchPageFilters = searchData.filters;
                }
            }
            );
    } //configureSearchPageData

    filterSwitch(event) {
        this.configureSearchPageData(event.key);
    }
    ngOnInit() {
        this.configureSearchPageData();
    }

}
