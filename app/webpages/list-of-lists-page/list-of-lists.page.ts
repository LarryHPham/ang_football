import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

//globals
import { GlobalSettings } from "../../global/global-settings";
import { GlobalFunctions } from "../../global/global-functions";
import { VerticalGlobalFunctions } from "../../global/vertical-global-functions";

//interfaces
import { DetailListInput } from '../../fe-core/components/detailed-list-item/detailed-list-item.component';
import { SliderCarouselInput } from '../../fe-core/components/carousels/slider-carousel/slider-carousel.component';
import { TitleInputData } from '../../fe-core/components/title/title.component';
import { PaginationParameters } from "../../fe-core/components/pagination-footer/pagination-footer.component";
import { IListOfListsItem } from "../../fe-core/components/list-of-lists-item/list-of-lists-item.component";

//services
import { ListOfListsService } from "../../services/list-of-lists.service";
import { ProfileHeaderService } from '../../services/profile-header.service';

declare var moment:any;

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html'
})

export class ListOfListsPage implements OnInit {
  public partnerID: string;
  public scope: string;
  public target: string;
  public targetID: string;
  public perPageCount: number;
  public pageNumber: number;
  public pageParams: any;

  errorData             : string;
  detailedDataArray     : Array<IListOfListsItem>; //variable that is just a list of the detailed DataArray
  carouselDataArray     : Array<SliderCarouselInput>;
  profileName           : string;
  isError               : boolean = false;
  pageType              : string; // [player,team]
  id                    : string; // [playerId, teamId]
  limit                 : string; // pagination limit
  pageNum               : string; // page of pages to show

  paginationSize        : number = 10;
  index                 : number = 0;
  paginationParameters  : PaginationParameters;
  titleData             : TitleInputData;

    constructor(
        private activatedRoute: ActivatedRoute,
        private listService:ListOfListsService,
        private _profileService: ProfileHeaderService,
        private _title: Title
    ) {
      // check to see if scope is correct and redirect
      // VerticalGlobalFunctions.scopeRedirect(_router, params);
      this.activatedRoute.params.subscribe(
        (param :any)=> {
          this.scope = param['scope'].toLowerCase() == 'ncaaf' ? 'fbs' : 'nfl';
          this.partnerID = param['partnerID'];
          this.pageType = param['target'];
          this.targetID = param['statName'];
          this.perPageCount = param['perPageCount'];
          this.pageNumber = param['pageNumber'];
        }
      )

      this.pageParams = {
        scope: this.scope,
        pageType: this.pageType,
        targetID: this.targetID,
        perPageCount:this.perPageCount,
        pageNumber: this.pageNumber
      }

      if ( this.pageType == null ) {
          this.pageType = "league";
          this._profileService.getLeagueProfile()
          .subscribe(data => {
              this.getListOfListsPage(this.pageParams, GlobalSettings.getImageUrl(data.headerData.leagueLogo));
          }, err => {
              console.log("Error loading MLB profile");
          });
      } else{
        this.getListOfListsPage(this.pageParams);
      }
    } //constructor



    getListOfListsPage(urlParams, logoUrl?: string) {
        this.listService.getListOfListsService(urlParams, this.pageType, "page")
          .subscribe(
            list => {
                if(list.listData.length == 0){//makes sure it only runs once
                    this.detailedDataArray = null;
                }else{
                    this.detailedDataArray = list.listData;
                }
                this.setPaginationParams(list.pagination);
                this.carouselDataArray = list.carData;


                var profileName = "League";
                var profileRoute = ["League-page"];
                var profileImage = logoUrl ? logoUrl : GlobalSettings.getSiteLogoUrl();


                var listTargetData;

                if (this.pageType != 'league') {
                  listTargetData = list.targetData[0];
                }
                else {
                  listTargetData = list.targetData;
                }

                switch ( urlParams.target ) {
                    case "player":
                        profileName = listTargetData.playerFirstName + " " + listTargetData.playerLastName;
                        profileRoute = VerticalGlobalFunctions.formatPlayerRoute(this.scope, listTargetData.teamName, profileName, listTargetData.playerId);
                        profileImage = GlobalSettings.getImageUrl(listTargetData.playerHeadshotUrl);
                        break;

                    case "team":
                        profileName = listTargetData.teamName;
                        profileRoute = VerticalGlobalFunctions.formatTeamRoute(this.scope, listTargetData.teamName, listTargetData.teamId);
                        profileImage = GlobalSettings.getImageUrl(listTargetData.teamLogo);
                        break;

                    default: break;
                }


                this.profileName = profileName

                this.titleData = {
                    imageURL : profileImage,
                    imageRoute: profileRoute,
                    text1 : 'Last Updated: ' + GlobalFunctions.sntGlobalDateFormatting(list.lastUpdated['lastUpdated'],'defaultDate'),
                    text2 : ' United States',
                    text3 : 'Top lists - ' + this.profileName,
                    icon: 'fa fa-map-marker'
                };

            },
            err => {
                this.isError= true;
                console.log('Error: ListOfLists API: ', err);
            }
          );
    } //getListOfListsPage



    //PAGINATION
    //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
    setPaginationParams(input) {
        var params = this.pageParams;

        var navigationParams = {
            perPageCount     : params['perPageCount'],
            pageNumber    : params['pageNumber'],

        };

        if(params['targetId'] != null) {
           navigationParams['targetId'] = params['targetId'];
        }
        else {
          navigationParams['targetId'] = 'null';
        }

        navigationParams['target'] = this.pageType;



        var navigationPage = 'List-of-lists-page-scoped';
        if ( !this.detailedDataArray ) {
            navigationPage = "Error-page";
        }
        else if ( navigationParams['scope'] ) {
            navigationPage = 'List-of-lists-page-scoped';
        }
        this.paginationParameters = {
            index: params['pageNumber'] != null ? Number(params['pageNumber']) : null,
            max: Number(input.listPageCount),
            paginationType: 'page',
            navigationPage: navigationPage,
            navigationParams: navigationParams,
            indexKey: 'pageNumber'
        };
    } //setPaginationParams



    ngOnInit(){}
}
