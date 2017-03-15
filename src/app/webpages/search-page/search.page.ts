import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { isBrowser } from 'angular2-universal';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from '../../global/global-functions';
import { VerticalGlobalFunctions } from '../../global/vertical-global-functions';

//services
import { SearchService } from '../../services/search.service';
import { SeoService } from "../../seo.service";
//interfaces
import { SearchPageInput } from '../../ui-modules/search-page/search-page.module';

interface SearchPageParams {
    query: string;
}

@Component({
    selector: 'search-page',
    templateUrl: './search.page.html'
})

export class SearchPage{
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
      private _title: Title,
      private _seoService: SeoService
    ) {
        //check to see if scope is correct and redirect
        //VerticalGlobalFunctions.scopeRedirect(_router, _params);
        this.activatedRoute.params.subscribe(
          (param :any)=> {
            this.pageParams = param;
            this.scope = param['scope'] != null ? param['scope'].toLowerCase() : 'nfl';

            if (!GlobalSettings.getHomeInfo().isSubdomainPartner) {
              this.partnerID = param['partnerID'];
            }
              this.configureSearchPageData();
          }
        )
        // _title.setTitle(GlobalSettings.getPageTitle("Search"));
    } //constructor



    configureSearchPageData(filter?) {
        let self = this;
        let query = this.pageParams.query;
        if (typeof filter == 'undefined') {
            filter = null;
        }

        this._searchService.getSearch()
          .finally(() => GlobalSettings.setPreboot() ) // call preboot after last piece of data is returned on page
          .subscribe(
            data => {
            let searchData = self._searchService.getSearchPageData(this.partnerID, query, filter, data);
              self.searchPageInput = searchData.results;
              if (self.searchPageFilters == null) {
                  self.searchPageFilters = searchData.filters;
                 }
            }
          );
    } //configureSearchPageData

    private metaTags() {
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let title = 'Search Page';

      let metaDesc = 'Discover the latest in football - Find the players and teams you love.';
      let image = GlobalSettings.getmainLogoUrl();
      let keywords = "football, search";
      let link = this._seoService.getPageUrl();
      this._seoService.setTitle(title);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setCanonicalLink();

      this._seoService.setMetaTags([
        {
          'og:title': title,
        },
        {
          'og:description': metaDesc,
        },
        {
          'og:type':'website',
        },
        {
          'og:url':link,
        },
        {
          'og:image': image,
        },
        {
          'es_page_title': title,
        },
        {
          'es_page_url': link
        },
        {
          'es_description': metaDesc,
        },
        {
          'es_page_type': 'Search page',
        },
        {
          'es_keywords': keywords
        },
        {
          'es_image_url':image
        }
      ])
      this._seoService.setMetaRobots('INDEX, FOLLOW');

    } //metaTags

    filterSwitch(event) {
        this.configureSearchPageData(event.key);
    }
}
