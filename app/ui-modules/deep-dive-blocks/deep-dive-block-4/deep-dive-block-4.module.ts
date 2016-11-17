import {Component, Input, Injector, OnChanges} from '@angular/core';
import {GlobalSettings} from '../../../global/global-settings';
import {GlobalFunctions} from '../../../global/global-functions';
import {DeepDiveService} from '../../../services/deep-dive.service';

@Component({
    selector: 'deep-dive-block-4',
    templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-4/deep-dive-block-4.module.html',
})
export class DeepDiveBlock4{
  public widgetPlace: string = "widgetForPage";
  fourthStackTop: any;
  fourthStackRow: any;
  callLimit:number = 8;
  scroll: boolean = true;
  aiBatchName: string = "player-comparisons";
  @Input() maxHeight: any;
  @Input() geoLocation: any;
  @Input() profileName: any;
  @Input() scope: string;

  constructor(private _deepDiveData: DeepDiveService){}
    ngOnInit() {
       this.callModules();
    }

  getFourthArticleStackData(){
    this._deepDiveData.getDeepDiveBatchService(this.scope, this.callLimit, 4, this.geoLocation)
        .subscribe(data => {
          this.fourthStackTop = this._deepDiveData.transformToArticleStack(data);
        },
        err => {
              console.log("Error getting forth article stack TOP data");
        });
    this._deepDiveData.getDeepDiveAiBatchService(this.scope, this.aiBatchName, 1, this.callLimit, this.geoLocation)
        .subscribe(data => {
          this.fourthStackRow = this._deepDiveData.transformToAiArticleRow(data);
        },
        err => {
            console.log("Error getting forth article stack ROW data");
        });
  }

  callModules(){
    this.getFourthArticleStackData();
  }

}
