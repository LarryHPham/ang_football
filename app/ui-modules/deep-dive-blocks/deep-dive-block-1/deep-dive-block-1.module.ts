import {Component, Input, Injector, OnChanges} from '@angular/core';
import { BoxScoresService } from '../../../services/box-scores.service';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData, VideoStackData } from "../../../fe-core/interfaces/deep-dive.data";
import { GlobalSettings } from "../../../global/global-settings";
import { GlobalFunctions } from '../../../global/global-functions';

declare var moment;

@Component({
  selector: 'deep-dive-block-1',
  templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-1/deep-dive-block-1.module.html',
})

export class DeepDiveBlock1{
  public widgetPlace: string = "widgetForPage";
  firstStackTop: any;
  firstStackRow: any;
  callLimit:number = 8;
  videoCallLimit: number = 6;
  tilestackData: any;
  //for box scores
  boxScoresData: any;
  videoData: any;
  currentBoxScores: any;
  page: number = 1;
  dateParam: any;
  scroll: boolean = true;
  @Input() maxHeight: any;
  @Input() geoLocation: any;
  @Input() profileName: any;
  @Input() scope: string;
  constructor(private _boxScores:BoxScoresService, private _deepDiveData: DeepDiveService){
      window.onresize = (e) =>
      {
        // current use is box scores
        this.checkSize();
      }
    }

  ngOnInit() {
    var currentUnixDate = new Date().getTime();
    //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
    this.dateParam ={
      teamId:this.scope == 'home' ? 'nfl' : this.scope,//current profile page
      scope:'league',
      date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
    }
     this.callModules();
  }

  getFirstArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.scope, this.callLimit, 1, this.geoLocation)
        .subscribe(data => {
          this.firstStackTop = this._deepDiveData.transformToArticleStack(data);
        },
        err => {
              console.log("Error getting first article stack data");
        });
    this._deepDiveData.getDeepDiveAiBatchService(this.scope, 'postgame-report', 1, this.callLimit, this.geoLocation)
        .subscribe(data => {
          this.firstStackRow = this._deepDiveData.transformToAiArticleRow(data);
        },
        err => {
            console.log("Error getting first AI article batch data");
        });
  }

  getTileStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.scope, this.callLimit, 2, this.geoLocation)
        .subscribe(data => {
          this.tilestackData = this._deepDiveData.transformTileStack(data, this.scope);
        },
        err => {
            console.log("Error getting tile stack data");
        });
  }

  private getDeepDiveVideoBatch(scope, region, numItems, startNum){
    this._deepDiveData.getDeepDiveVideoBatchService(this.scope, numItems, startNum, region).subscribe(
      data => {
        this.videoData = this._deepDiveData.transformVideoStack(data.data);
      },
      err => {
          console.log("Error getting video batch data");
      });
  }

  //api for BOX SCORES
  private getBoxScores(dateParams?) {
    if(this.scope != 'home'){
      if (dateParams != null) {
        this.dateParam = dateParams;
      }
      this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
        this.boxScoresData = boxScoresData;
        this.currentBoxScores = currentBoxScores;
      })
    }else{
      this.dateParam = null;
    }
  }
  checkSize(){
    var width = window.outerWidth;
    var height = window.outerHeight;
    if(width < 640){
      this.scroll = false;
      this.maxHeight = 'auto';
    }else if(width >= 640){
      this.scroll = true;
      this.maxHeight = 650;
    }
  }
  callModules(){
    setTimeout(() => { // wait to load the rest of the page below the fold
      this.getBoxScores(this.dateParam);
      this.getDeepDiveVideoBatch(this.scope, this.geoLocation, this.videoCallLimit, this.page);
      this.getTileStackData();
    }, 500);
  }
}
